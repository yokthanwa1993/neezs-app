import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { signOut, onAuthStateChanged, User as FirebaseUser, signInWithCustomToken } from 'firebase/auth';
import { resetLiffState } from './LiffContext';

interface User {
  id: string;
  name: string;
  picture?: string;
  email?: string;
  role?: 'seeker' | 'employer';
}


interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  hardRefresh: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const idTokenResult = await fbUser.getIdTokenResult();
        const userRole = (idTokenResult.claims.role as 'seeker' | 'employer') || 'seeker';
        
        const userData: User = {
          id: fbUser.uid,
          name: fbUser.displayName || 'ผู้ใช้',
          email: fbUser.email || '',
          picture: fbUser.photoURL || undefined,
          role: userRole,
        };
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem('auth_user');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      // Notify LINE OA about logout if possible
      try {
        let lineUserId: string | null = null;
        try {
          if (typeof window !== 'undefined' && (window as any).liff && typeof (window as any).liff.getProfile === 'function') {
            const profile = await (window as any).liff.getProfile();
            lineUserId = profile?.userId || null;
          }
        } catch {}
        if (!lineUserId) {
          lineUserId = localStorage.getItem('liff_user_id');
        }
        if (lineUserId) {
          await fetch('/api/auth/line/logout-notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lineUserId, message: 'Logout' }),
            // ensure request is sent even if the page is being closed
            keepalive: true as any,
          } as any);
        }
      } catch {}

      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      // Clear all web caches and local storage to ensure fresh UI next load
      try {
        localStorage.clear();
      } catch {}
      try {
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
      } catch {}
      try {
        if (navigator.serviceWorker) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
        }
      } catch {}
      resetLiffState();
      if (window.liff) {
        window.liff.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const hardRefresh = async () => {
    try {
      try { if ('caches' in window) { const keys = await caches.keys(); await Promise.all(keys.map((k)=>caches.delete(k))); } } catch {}
      try { if (navigator.serviceWorker) { const regs = await navigator.serviceWorker.getRegistrations(); await Promise.all(regs.map((r)=>r.unregister())); } } catch {}
      // keep auth tokens, just reload ignoring cache
      window.location.replace('/');
    } catch (e) {
      window.location.reload();
    }
  };


  const value = {
    user,
    firebaseUser,
    setUser: (newUser: User | null) => {
      setUser(newUser);
      if (newUser) {
        localStorage.setItem('auth_user', JSON.stringify(newUser));
      } else {
        localStorage.removeItem('auth_user');
      }
    },
    logout,
    hardRefresh,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};