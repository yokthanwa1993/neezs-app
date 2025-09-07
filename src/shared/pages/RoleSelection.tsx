import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../shared/contexts/RoleContext';
import { User, Building2, ArrowRight, Briefcase, Search, Settings, ToggleLeft, ToggleRight } from 'lucide-react';

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setRole } = useRole();
  const [bypassMode, setBypassMode] = useState(() => {
    return localStorage.getItem('bypass_mode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('bypass_mode', bypassMode.toString());
  }, [bypassMode]);

  const handleRoleSelect = (role: 'seeker' | 'employer') => {
    setRole(role);
    
    // Check if bypass mode is enabled
    if (bypassMode) {
      // Create mock user for development
      const mockUser = {
        id: `mock_${role}_${Date.now()}`,
        name: role === 'seeker' ? 'Mock ผู้หางาน' : 'Mock ผู้จ้างงาน',
        email: `mock_${role}@dev.neeiz.com`,
        picture: undefined,
        role: role as 'seeker' | 'employer'
      };
      
      console.log('🚀 Bypass mode: Creating mock user', mockUser);
      
      // Navigate directly to home page
      const homePath = role === 'seeker' ? '/seeker/home' : '/employer/home';
      navigate(homePath, { replace: true });
      return;
    }
    
    // Normal flow - redirect to login page
    if (role === 'seeker') {
      navigate('/seeker/home');
    } else {
      navigate('/employer/auth/liff');
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex flex-col justify-center p-6 overflow-hidden">
      <div className="max-w-sm w-full mx-auto animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
            NEEZS
          </h1>
          <p className="text-white/90 text-base font-medium">
            เลือกประเภทการใช้งาน
          </p>
          <p className="text-white/70 text-sm mt-1">
            เริ่มต้นการใช้งานของคุณ
          </p>
        </div>

        {/* Role Cards */}
        <div className="space-y-4">
          {/* Applicant Card */}
          <button
            onClick={() => handleRoleSelect('seeker')}
            className="group w-full bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 hover:bg-white hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-102 active:scale-98"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-900">
                    ผู้หางาน
                  </h3>
                  <p className="text-gray-600 text-sm font-medium">
                    ค้นหางานที่ใช่ เจอโอกาสใหม่
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    สมัครงาน • ติดตามสถานะ • รับงาน
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all duration-300" />
            </div>
          </button>

          {/* Employer Card */}
          <button
            onClick={() => handleRoleSelect('employer')}
            className="group w-full bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 hover:bg-white hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-102 active:scale-98"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-900">
                    ผู้จ้างงาน
                  </h3>
                  <p className="text-gray-600 text-sm font-medium">
                    หาคนที่ใช่ เจอคนเก่ง
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    ประกาศงาน • คัดเลือกคน • จัดการทีม
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all duration-300" />
            </div>
          </button>
        </div>

        {/* Bypass Toggle */}
        <div className="mt-6">
          <button
            onClick={() => setBypassMode(!bypassMode)}
            className="w-full bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <Settings className="w-4 h-4 text-white/80" />
              <div className="text-left">
                <p className="text-white/90 text-sm font-medium">
                  Bypass Mode
                </p>
                <p className="text-white/60 text-xs">
                  {bypassMode ? 'ข้าม LINE Login (สำหรับทดสอบ)' : 'ใช้ LINE Login ปกติ'}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              {bypassMode ? (
                <ToggleRight className="w-6 h-6 text-green-400" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-white/60" />
              )}
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <p className="text-white/80 text-xs font-medium">
              💡 คุณสามารถเปลี่ยนประเภทการใช้งานได้ในภายหลัง
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
