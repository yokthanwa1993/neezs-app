import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiff } from '@/contexts/LiffContext';
import { useAuth } from '@/contexts/AuthContext';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/shared/lib/firebase';

interface LineLoginProps {
  onLoginSuccess?: () => void;
  role?: 'seeker' | 'employer';
}

const LineLogin: React.FC<LineLoginProps> = ({ onLoginSuccess, role = 'seeker' }) => {
  const navigate = useNavigate();
  const { isLiffReady, isLiffLoading, liff, initializeLiffForRole } = useLiff();
  const { user, setUser } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Initialize LIFF for the specific role when component mounts
    // Only initialize if not already ready for this role
    if (!isLiffReady) {
      console.log(`🔄 Initializing LIFF for ${role} role`);
      initializeLiffForRole(role);
    }
  }, [role, isLiffReady, initializeLiffForRole]);

  useEffect(() => {
    // If authentication completes and we get a user object, proceed.
    if (user) {
      console.log('✅ Auth user found, proceeding to login success...');
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        const defaultPath = role === 'seeker' ? '/seeker/home' : '/employer/home';
        navigate(defaultPath);
      }
    }
  }, [user, onLoginSuccess, role, navigate]);

  useEffect(() => {
    // ใน LIFF browser ถ้า login แล้วให้จัดการ authentication ทันที
    if (isLiffReady && liff && liff.isInClient() && liff.isLoggedIn() && !user && !isLoggingIn) {
      console.log('🔄 LIFF browser detected with login - auto authenticating');
      // Store role for authentication
      localStorage.setItem('login_role', role);
      handleLiffAuthentication();
    }
  }, [isLiffReady, liff, user, isLoggingIn, role]);

  const handleLiffAuthentication = async () => {
    if (!liff || !liff.isLoggedIn()) return;
    
    try {
      setIsLoggingIn(true);
      
      // Get ID Token from LIFF
      const idToken = liff.getIDToken();
      if (!idToken) {
        console.error('❌ No ID Token available from LIFF');
        return;
      }

      // Get user profile
      const profile = await liff.getProfile();
      console.log('👤 LIFF Profile:', profile);

      // Store LIFF user data
      localStorage.setItem('liff_user_id', profile.userId);
      localStorage.setItem('liff_display_name', profile.displayName);
      localStorage.setItem('liff_picture_url', profile.pictureUrl);
      localStorage.setItem('liff_status_message', profile.statusMessage || '');

      // Authenticate with backend
      const response = await fetch('/api/auth/line', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken, profile, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'เกิดข้อผิดพลาดในการยืนยันตัวตน');
      }

      const { customToken, user: userData } = await response.json();
      console.log('✅ Got custom token from backend');

      // Store Firebase auth data
      localStorage.setItem('firebase_custom_token', customToken);
      localStorage.setItem('firebase_user_data', JSON.stringify(userData));

      // Sign in to Firebase with Custom Token
      await signInWithCustomToken(auth, customToken);
      console.log('✅ Signed in to Firebase');

      // Set user data in context
      const userObj = {
        id: userData.uid,
        name: userData.displayName || 'ผู้ใช้ LINE',
        email: userData.email || '',
        picture: userData.pictureUrl || undefined
      };
      
      setUser(userObj);
      localStorage.setItem('auth_user', JSON.stringify(userObj));
      console.log('👤 User data set in context from LIFF authentication');
      
    } catch (error: any) {
      console.error('❌ LIFF authentication error:', error);
      alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoggingIn(false);
    }
  };


  const handleLogin = async () => {
    if (!isLiffReady || !liff) {
      console.log('⏳ LIFF not ready yet, initializing...');
      return;
    }

    // เช็คว่าอยู่ใน LINE browser และยังไม่ได้ login
    if (liff.isInClient() && !liff.isLoggedIn()) {
      console.log('⚠️ In LINE browser but not logged in');
      alert('กรุณาเข้าสู่ระบบ LINE ก่อน\n\nการใช้งานใน LINE:\n1. ออกจากหน้านี้\n2. ตรวจสอบว่าคุณได้เข้าสู่ระบบ LINE แล้ว\n3. กลับมาที่หน้านี้อีกครั้ง\n\nหรือเปิดในเบราว์เซอร์ธรรมดาแทน');
      return;
    }

    setIsLoggingIn(true);
    try {
      // ตรวจสอบว่า login แล้วหรือยัง
      if (liff.isLoggedIn()) {
        console.log('✅ User is already logged in to LIFF');
        await handleLiffAuthentication();
        return;
      }
      
      // Store role before login so callback knows where to redirect
      localStorage.setItem('login_role', role);
      console.log(`📝 Stored login role: ${role}`);

      // ถ้าอยู่นอก LINE browser (external browser)
      if (!liff.isInClient()) {
        const currentOrigin = window.location.origin;
        const redirectUri = `${currentOrigin}/callback`;
        console.log('🚀 In external browser - using redirect:', redirectUri);
        liff.login({ redirectUri });
      }

    } catch (error: any) {
      console.error('❌ LINE login error:', error);
      alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง');
      setIsLoggingIn(false);
    }
  };

  // ถ้าอยู่ใน LIFF browser และ login แล้ว ให้แสดง loading เมื่อกำลัง authenticate
  if (isLoggingIn || (isLiffReady && liff && liff.isInClient() && liff.isLoggedIn() && !user)) {
    return (
      <div className="fixed inset-0 w-full h-full flex items-center justify-center p-4 overflow-hidden" style={{backgroundColor: '#ffb300'}}>
        <div className="text-center text-white">
          <div className="w-16 h-16 mx-auto mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
          </div>
          <h2 className="text-2xl font-bold mb-2">กำลังเข้าสู่ระบบ...</h2>
          <p className="text-green-100">กรุณารอสักครู่</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center p-4 overflow-hidden" style={{backgroundColor: '#ffb300'}}>
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="45" fill="#00C300"/>
                <path d="M25 45h50c2.76 0 5 2.24 5 5v15c0 2.76-2.24 5-5 5H60l-10 8v-8H25c-2.76 0-5-2.24-5-5V50c0-2.76 2.24-5 5-5z" fill="white"/>
                <circle cx="35" cy="57" r="3" fill="#00C300"/>
                <circle cx="50" cy="57" r="3" fill="#00C300"/>
                <circle cx="65" cy="57" r="3" fill="#00C300"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">NEEZS</h1>
            <p className="text-gray-600 text-lg">เข้าสู่ระบบด้วย LINE</p>
            <p className="text-gray-500 text-sm mt-2">ง่าย รวดเร็ว ปลอดภัย</p>
          </div>

          <button
            onClick={handleLogin}
            disabled={!isLiffReady || isLoggingIn}
            className="w-full bg-green-500 text-white font-bold py-4 px-6 rounded-2xl hover:bg-green-600 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:transform-none shadow-lg"
          >
            <div className="flex items-center justify-center space-x-3">
              {(!isLiffReady && !isLoggingIn) ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                </svg>
              )}
              <span>
                {!isLiffReady && !isLoggingIn ? 'กำลังเตรียมความพร้อม...' : 'เข้าสู่ระบบด้วย LINE'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LineLogin;