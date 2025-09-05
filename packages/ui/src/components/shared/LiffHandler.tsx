import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLiff } from '../../contexts/LiffContext';

interface LiffHandlerProps {
  role: 'seeker' | 'employer';
  targetPath?: string;
}

const LiffHandler: React.FC<LiffHandlerProps> = ({ role, targetPath }) => {
  const { user } = useAuth();
  const { initializeLiffForRole, isLiffReady } = useLiff();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔄 LiffHandler: Starting LIFF authentication flow');
    
    // ถ้า user ล็อกอินแล้ว ให้ไปหน้าปลายทางเลย
    if (user) {
      const defaultPath = role === 'seeker' ? '/seeker/dashboard' : '/employer/home';
      navigate(targetPath || defaultPath, { replace: true });
      return;
    }

    // เริ่ม LIFF authentication
    initializeLiffForRole(role);
  }, [user, role, targetPath, initializeLiffForRole, navigate]);

  // แสดง loading ระหว่างทำ LIFF authentication
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary to-primary-dark">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">กำลังเข้าสู่ระบบ</h2>
        <p className="text-sm opacity-80">กรุณารอสักครู่...</p>
      </div>
    </div>
  );
};

export default LiffHandler;
