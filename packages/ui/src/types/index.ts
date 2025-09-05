export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role?: 'seeker' | 'employer';
  profile?: any;
}

export interface AuthContextType {
  user: User | null;
  firebaseUser: any;
  setUser: (user: User | null) => void;
}

export interface LiffContextType {
  isLiffReady: boolean;
  isLiffLoading: boolean;
  liff: any;
  initializeLiffForRole: (role: string) => void;
}
