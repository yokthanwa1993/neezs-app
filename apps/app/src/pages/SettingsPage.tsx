import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  HelpCircle,
  Mail,
  LogOut,
  ArrowLeft
} from 'lucide-react';

const SettingsOption = ({ icon: Icon, label, onClick }: { icon: React.ElementType, label: string, onClick: () => void }) => (
  <div onClick={onClick} className="p-4 flex items-center cursor-pointer hover:bg-gray-50 transition-colors duration-200 bg-white">
    <Icon className="w-6 h-6 text-gray-500 mr-4" />
    <span className="flex-1 font-medium text-gray-800">{label}</span>
    <ChevronRight className="w-5 h-5 text-gray-400" />
  </div>
);

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    // In a real app, you'd show a confirmation dialog here
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center p-4 bg-white border-b sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-bold text-center flex-1 mr-10">ตั้งค่า</h1>
      </header>

      <main className="p-4">
        <div className="space-y-2">
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <SettingsOption
              icon={HelpCircle}
              label="ศูนย์ช่วยเหลือ"
              onClick={() => navigate('/help-center')}
            />
            <div className="border-t border-gray-200"></div>
            <SettingsOption
              icon={Mail}
              label="เปลี่ยนอีเมล"
              onClick={() => navigate('/change-email')}
            />
          </div>

          <div className="pt-4">
             <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start p-4 text-red-500 hover:text-red-600 hover:bg-red-50 font-medium bg-white border border-gray-200"
              >
                <LogOut className="w-6 h-6 mr-4" />
                ออกจากระบบ
              </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;