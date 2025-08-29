import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ChevronRight, HelpCircle, Mail, LogOut, Wallet } from 'lucide-react';

const SettingsOption = ({ icon: Icon, label, onClick }: { icon: React.ElementType, label: string, onClick: () => void }) => (
  <div onClick={onClick} className="p-4 flex items-center cursor-pointer hover:bg-gray-50 transition-colors duration-200 group">
    <Icon className="w-6 h-6 text-primary mr-4 transition-colors group-hover:text-primary" />
    <span className="flex-1 font-medium text-gray-800">{label}</span>
    <ChevronRight className="w-5 h-5 text-gray-400" />
  </div>
);

const EmployerProfileSettingsTab: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?')) {
      logout();
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
        <SettingsOption
          icon={Wallet}
          label="การชำระเงินและ Wallet"
          onClick={() => navigate('/employer/billing')}
        />
        <div className="border-t border-gray-200"></div>
        <SettingsOption
          icon={HelpCircle}
          label="ศูนย์ช่วยเหลือ"
          onClick={() => navigate('/support')}
        />
        <div className="border-t border-gray-200"></div>
        <SettingsOption
          icon={Mail}
          label="เปลี่ยนอีเมล"
          onClick={() => navigate('/change-email')}
        />
      </div>
      <div className="pt-2">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-center p-4 text-white font-bold text-lg bg-red-500 hover:bg-red-600 border border-red-500 hover:border-red-600 rounded-xl"
        >
          <LogOut className="w-6 h-6 mr-2" />
          ออกจากระบบ
        </Button>
      </div>
    </div>
  );
};

export default EmployerProfileSettingsTab;