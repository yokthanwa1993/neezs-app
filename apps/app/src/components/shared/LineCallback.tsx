import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

declare global {
  interface Window {
    liff: any;
  }
}

const LineCallback: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Load LIFF SDK if not already loaded
      if (!window.liff) {
        await loadLiffSdk();
      }

      // Get role from localStorage to determine correct LIFF ID
      const storedRole = localStorage.getItem('login_role') || 'seeker';
      const liffId = storedRole === 'employer'
        ? import.meta.env.VITE_LIFF_ID_EMPLOYER
        : import.meta.env.VITE_LIFF_ID_SEEKER;
      
      console.log(`🆔 Using ${storedRole.toUpperCase()} LIFF ID:`, liffId);
      
      if (!liffId) {
        console.error(`❌ LIFF ID for ${storedRole} not found in environment variables`);
        setError(`LIFF ID for ${storedRole} not configured`);
        setIsLoading(false);
        return;
      }

      // Initialize LIFF with comprehensive error suppression
      try {
        // Temporarily suppress console errors from LIFF SDK
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.error = (...args) => {
          const message = args.join(' ');
          if (message.includes('api.line.me') || message.includes('Bad Request') || message.includes('400')) {
            // Suppress LINE API errors that don't affect functionality
            return;
          }
          originalError.apply(console, args);
        };
        
        console.warn = (...args) => {
          const message = args.join(' ');
          if (message.includes('api.line.me') || message.includes('authorization')) {
            return;
          }
          originalWarn.apply(console, args);
        };
        
        await window.liff.init({ liffId });
        
        // Restore original console methods
        console.error = originalError;
        console.warn = originalWarn;
        
      } catch (liffError: any) {
        // Restore console methods in case of error
        console.error = console.error;
        console.warn = console.warn;
        
        // Only log actual critical errors
        if (!liffError.message || (!liffError.message.includes('authorization') && !liffError.message.includes('token'))) {
          console.warn('⚠️ LIFF initialization issue:', liffError);
        }
      }

      // Check if user is logged in with proper error handling
      if (!window.liff || typeof window.liff.isLoggedIn !== 'function') {
        console.warn('⚠️ LIFF not fully initialized, waiting...');
        // Wait a bit for LIFF to be ready
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      if (!window.liff || !window.liff.isLoggedIn()) {
        console.log('❌ User not logged in, redirecting to home');
        navigate('/');
        return;
      }

      // Get LINE ID Token
      const idToken = window.liff.getIDToken();
      if (!idToken) {
        throw new Error('ไม่สามารถรับ ID Token จาก LINE ได้');
      }

      console.log('✅ Got ID Token from LIFF');

      // Store LIFF token immediately
      localStorage.setItem('liff_id_token', idToken);
      localStorage.setItem('liff_token_timestamp', new Date().toISOString());

      // Get user profile from LIFF
      let profile = null;
      try {
        profile = await window.liff.getProfile();
        console.log('👤 LIFF Profile:', profile);
        
        // Store LIFF user data
        localStorage.setItem('liff_user_id', profile.userId);
        localStorage.setItem('liff_display_name', profile.displayName);
        localStorage.setItem('liff_picture_url', profile.pictureUrl);
        localStorage.setItem('liff_status_message', profile.statusMessage || '');
        
        console.log('💾 Stored LIFF user data in localStorage');
      } catch (profileError) {
        console.warn('⚠️ Could not get LIFF profile:', profileError);
      }

      // Send ID Token and profile to backend via Vite proxy with role
      const endpoint = '/api/auth/line';
      console.log(`🌐 Authenticating ${storedRole} with backend via`, endpoint);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken, profile, role: storedRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Backend error:', errorData);
        throw new Error(errorData.message || 'เกิดข้อผิดพลาดในการยืนยันตัวตน');
      }

      const { customToken, user: userData } = await response.json();
      console.log('✅ Got custom token from backend');

      // Store Firebase custom token
      localStorage.setItem('firebase_custom_token', customToken);
      localStorage.setItem('firebase_user_data', JSON.stringify(userData));

      // Sign in to Firebase with Custom Token
      await signInWithCustomToken(auth, customToken);
      console.log('✅ Signed in to Firebase');

      // Set user data in context immediately
      const userObj = {
        id: userData.uid,
        name: userData.displayName || 'ผู้ใช้ LINE',
        email: userData.email || '',
        picture: userData.pictureUrl || undefined
      };
      
      console.log('👤 Setting user object in context:', userObj);
      setUser(userObj);
      console.log('✅ User data set in context immediately');

      // Also save to localStorage for persistence
      localStorage.setItem('auth_user', JSON.stringify(userObj));
      console.log('💾 User data saved to localStorage');

      // Store authentication completion timestamp
      localStorage.setItem('auth_completed_at', new Date().toISOString());

      console.log('🎉 Authentication completed successfully!');
      console.log('🔄 Redirecting to home page...');

      // Get role for redirect (use the same variable from earlier)
      localStorage.removeItem('login_role'); // Clean up
      
      const redirectPath = storedRole === 'employer' ? '/employer/home' : '/seeker/home';
      console.log(`🎯 Redirecting ${storedRole} to: ${redirectPath}`);
      
      // Small delay to ensure user context is set before navigation
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 100);

    } catch (error: any) {
      // Filter out non-critical LINE API errors
      if (error.message && error.message.includes('authorization code')) {
        console.log('⚠️ Ignoring LINE authorization code warning');
        // Don't set error for this specific case
        setIsLoading(false);
        return;
      }
      
      console.error('LINE callback error:', error);
      setError(error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setIsLoading(false);
    }
  };

  const loadLiffSdk = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if script already exists
      if (document.querySelector('script[src*="liff"]')) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://static.line-scdn.net/liff/edge/2/sdk.js';
      script.async = true;
      
      script.onload = () => {
        // Suppress any immediate SDK errors
        setTimeout(() => {
          resolve();
        }, 100);
      };
      script.onerror = () => reject(new Error('ไม่สามารถโหลด LINE SDK ได้'));
      
      document.head.appendChild(script);
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังเข้าสู่ระบบ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-red-600">{error}</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            กลับหน้าแรก
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default LineCallback;