import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployerAuth } from '../contexts/EmployerAuthContext';
import { Button } from '@/shared/components/ui/button';
import LogoutButton from '@/shared/components/LogoutButton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
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
  const { logout } = useEmployerAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => setConfirmOpen(true);

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
        <LogoutButton onLogout={logout} />
      </div>
    </div>
  );
};

export default EmployerProfileSettingsTab;
