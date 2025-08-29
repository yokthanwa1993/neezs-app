import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, Sun, HelpCircle, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({ title: '', description: '' });

  const handleLogout = () => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?')) {
      navigate('/');
    }
  };

  const openSettingDialog = (title: string) => {
    setDialogData({
      title: title,
      description: `ส่วนของ "${title}" กำลังอยู่ในระหว่างการพัฒนา จะพร้อมใช้งานเร็วๆ นี้`,
    });
    setDialogOpen(true);
  };

  const handleItemClick = (label: string) => {
    switch (label) {
      case 'ข้อมูลส่วนตัว':
        navigate('/seeker/profile');
        break;
      case 'ความปลอดภัย':
        navigate('/security');
        break;
      case 'การแจ้งเตือน':
        navigate('/seeker/notifications');
        break;
      case 'คำถามที่พบบ่อย':
        navigate('/faq');
        break;
      case 'ติดต่อเรา':
        navigate('/contact');
        break;
      default:
        openSettingDialog(label);
        break;
    }
  };

  const settingsItems = {
    account: [
      { icon: User, label: 'ข้อมูลส่วนตัว' },
      { icon: Lock, label: 'ความปลอดภัย' },
    ],
    application: [
      { icon: Bell, label: 'การแจ้งเตือน' },
    ],
    help: [
      { icon: HelpCircle, label: 'คำถามที่พบบ่อย' },
      { icon: Mail, label: 'ติดต่อเรา' },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">ตั้งค่า</h1>
      </header>
      
      <div className="p-4 pb-20">
        {Object.entries(settingsItems).map(([key, items]) => (
          <div key={key} className="bg-white rounded-xl shadow-sm mb-4">
            <h2 className="font-bold text-lg p-4 border-b border-gray-200 capitalize">
              {key === 'account' ? 'บัญชี' : key === 'application' ? 'แอปพลิเคชัน' : 'ความช่วยเหลือ'}
            </h2>
            <div className="divide-y divide-gray-200">
              {items.map(item => {
                const Icon = item.icon;
                return (
                  <button key={item.label} onClick={() => handleItemClick(item.label)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <Icon className="text-gray-500 mr-3" size={20} />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-gray-400">›</span>
                  </button>
                );
              })}
              {key === 'application' && (
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <Sun className="text-gray-500 mr-3" size={20} />
                    <span>โหมดกลางวัน</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              )}
            </div>
          </div>
        ))}

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center bg-red-50 text-red-600 rounded-xl py-4 font-bold hover:bg-red-100 transition-colors"
        >
          <LogOut className="mr-2" size={20} />
          ออกจากระบบ
        </button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogData.title}</DialogTitle>
            <DialogDescription className="pt-4">
              {dialogData.description}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;