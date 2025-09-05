import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSeekerAuth } from '../contexts/SeekerAuthContext';
import { Search, FileText, MessageSquare, User, LogOut } from 'lucide-react';
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

const SeekerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useSeekerAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setConfirmOpen(true);
  };

  const menuItems = [
    {
      title: 'ค้นหางาน',
      description: 'หางานที่เหมาะกับคุณ',
      icon: Search,
      path: '/seeker/jobs',
      color: 'bg-primary',
    },
    {
      title: 'งานของฉัน',
      description: 'ติดตามตารางกะงาน',
      icon: FileText,
      path: '/seeker/my-shifts',
      color: 'bg-green-500',
    },
    {
      title: 'แชท',
      description: 'สื่อสารกับนายจ้าง',
      icon: MessageSquare,
      path: '/seeker/chat',
      color: 'bg-purple-500',
    },
    {
      title: 'โปรไฟล์',
      description: 'จัดการข้อมูลส่วนตัว',
      icon: User,
      path: '/seeker/profile',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-mobile-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                หน้าหลัก
              </h1>
              <p className="text-gray-600">
                ยินดีต้อนรับ {user?.profile?.displayName || user?.email || 'ผู้ใช้'}
              </p>
            </div>

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogContent className="max-w-sm mx-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle>ยืนยันการออกจากระบบ</AlertDialogTitle>
                  <AlertDialogDescription>
                    ต้องการออกจากระบบตอนนี้หรือไม่?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isLoggingOut}>ยกเลิก</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      setIsLoggingOut(true);
                      try {
                        await logout();
                      } finally {
                        setIsLoggingOut(false);
                        setConfirmOpen(false);
                      }
                    }}
                  >
                    ยืนยันออกจากระบบ
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="relative">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <span className="inline-flex items-center">
                    <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2"></span>
                    <span>กำลังออกจากระบบ</span>
                  </span>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    <span>ออกจากระบบ</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Confirm Dialog */}
            <div>
              {/* inline import to avoid top changes - but we need proper components */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-mobile-lg mx-auto px-4 py-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">งานที่สมัคร</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">ข้อความใหม่</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">งานแนะนำ</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                onClick={() => navigate(item.path)}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;
