import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSeekerLiff } from '../contexts/SeekerLiffContext';
import { useSeekerAuth } from '../contexts/SeekerAuthContext';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/shared/lib/firebase';

interface SeekerLiffHandlerProps {
  targetPath?: string;
}

const SeekerLiffHandler: React.FC<SeekerLiffHandlerProps> = ({ 
  targetPath = '/seeker/home' 
}) => {
  const navigate = useNavigate();
  const { 
    initializeLiff, 
    isLiffReady, 
    isLiffLoading, 
    isInLiffBrowser, 
    isLiffLoggedIn, 
    getLiffToken, 
    getLiffProfile,
    forceLiffReload,
    liffError
  } = useSeekerLiff();
  const { user } = useSeekerAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ถ้า user login แล้ว ให้ redirect ทันที
  useEffect(() => {
    if (user) {
      console.log('✅ SeekerLiffHandler: User already authenticated, redirecting');
      navigate(targetPath, { replace: true });
    }
  }, [user, navigate, targetPath]);

  // เริ่ม LIFF authentication process
  useEffect(() => {
    const handleLiffAuthentication = async () => {
      if (isAuthenticating || user) return;

      // ถ้า LIFF error ให้ redirect ไป normal login
      if (liffError && !isLiffLoading) {
        console.log('⚠️ SeekerLiffHandler: LIFF failed, redirecting to normal login');
        setTimeout(() => {
          navigate('/seeker/login', { replace: true });
        }, 3000); // รอ 3 วินาที เพื่อให้ user เห็น error
        return;
      }

      // รอให้ LIFF พร้อม
      if (!isLiffReady) {
        if (!isLiffLoading && !liffError) {
          console.log('🔄 SeekerLiffHandler: Initializing LIFF');
          try {
            await initializeLiff();
          } catch (error) {
            console.error('❌ SeekerLiffHandler: LIFF init failed', error);
            setError('ไม่สามารถเชื่อมต่อกับ LINE ได้');
            return;
          }
        }
        return;
      }

      // ตรวจสอบว่าอยู่ใน LIFF browser หรือไม่
      if (!isInLiffBrowser()) {
        console.log('⚠️ SeekerLiffHandler: Not in LIFF browser, redirecting to web login');
        navigate('/seeker/login', { replace: true });
        return;
      }

      // ตรวจสอบว่า login แล้วหรือไม่
      if (!isLiffLoggedIn()) {
        console.log('⚠️ SeekerLiffHandler: Not logged in to LIFF');
        setError('กรุณาเข้าสู่ระบบ LINE ก่อน');
        return;
      }

      // เริ่ม authentication
      setIsAuthenticating(true);
      console.log('🔄 SeekerLiffHandler: Starting LIFF authentication');

      try {
        // ดึง LIFF token และ profile
        const [liffToken, profile] = await Promise.all([
          getLiffToken(),
          getLiffProfile()
        ]);

        if (!liffToken || !profile) {
          throw new Error('ไม่สามารถดึงข้อมูลจาก LINE ได้');
        }

        console.log('✅ SeekerLiffHandler: LIFF data obtained', profile.displayName);

        // ส่งข้อมูลไป backend เพื่อ verify และสร้าง Firebase token
        const response = await fetch('/api/auth/line', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idToken: liffToken, // ใช้ liffToken เป็น idToken
            profile,
            role: 'seeker'
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'การยืนยันตัวตนล้มเหลว');
        }

        const { firebaseToken } = await response.json();

        if (!firebaseToken) {
          throw new Error('ไม่ได้รับ token จาก server');
        }

        // เข้าสู่ระบบ Firebase ด้วย custom token
        console.log('🔄 SeekerLiffHandler: Signing in to Firebase');
        const userCredential = await signInWithCustomToken(auth, firebaseToken);
        
        // สร้าง seeker user object
        const seekerUser = {
          ...userCredential.user,
          role: 'seeker' as const,
          profile: {
            lineUserId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl,
            statusMessage: profile.statusMessage
          }
        };

        console.log('✅ SeekerLiffHandler: Firebase authentication successful');
        // User state will be updated automatically by Firebase auth state listener

        // Navigation จะเกิดขึ้นใน useEffect ด้านบน

      } catch (error) {
        console.error('❌ SeekerLiffHandler: Authentication failed', error);
        setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      } finally {
        setIsAuthenticating(false);
      }
    };

    handleLiffAuthentication();
  }, [
    isLiffReady, 
    isLiffLoading, 
    isInLiffBrowser, 
    isLiffLoggedIn, 
    isAuthenticating, 
    user,
    liffError,
    initializeLiff,
    getLiffToken,
    getLiffProfile,
    navigate
  ]);

  const handleRetry = () => {
    setError(null);
    setIsAuthenticating(false);
    // รีเฟรชหน้า
    window.location.reload();
  };

  const handleBackToLogin = () => {
    navigate('/seeker/login', { replace: true });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="bg-white p-4 rounded-2xl shadow-xl w-full max-w-mobile-lg text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          
          <div className="space-y-3">
            <button
              onClick={forceLiffReload}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              🔄 ล้าง Cache และลองใหม่
            </button>
            <button
              onClick={handleRetry}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              ลองใหม่
            </button>
            <button
              onClick={handleBackToLogin}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              กลับหน้า Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-4 rounded-2xl shadow-xl w-full max-w-mobile-lg text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          กำลังเข้าสู่ระบบ
        </h2>
        
        <div className="space-y-2 text-sm text-gray-600">
          {isLiffLoading && <p>🔄 กำลังโหลด LINE... (retry อัตโนมัติ)</p>}
          {liffError && <p className="text-red-600">❌ {liffError}</p>}
          {liffError && <p className="text-blue-600">🔄 กำลังเปลี่ยนไปหน้า Login ปกติ...</p>}
          {isLiffReady && !isAuthenticating && <p>✅ LINE พร้อมแล้ว</p>}
          {isAuthenticating && <p>🔐 กำลังยืนยันตัวตน...</p>}
        </div>
      </div>
    </div>
  );
};

export default SeekerLiffHandler;
