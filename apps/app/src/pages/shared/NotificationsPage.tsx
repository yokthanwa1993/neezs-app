import React, { useState } from 'react';
import { Bell, CheckCircle, Coins, Star, Briefcase } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import BottomNavigation from '@/components/shared/BottomNavigation';
import EmployerBottomNavigation from '@/components/employer/EmployerBottomNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLiff } from '@/contexts/LiffContext';

const NotificationsPage = () => {
  const [selectedTab, setSelectedTab] = useState('all'); // 'all', 'jobs', 'system'
  const { isEmployer } = useRole();
  const { user, isLoading } = useAuth();
  const { isLiffLoading } = useLiff();

  const notifications = [
    {
      id: 1,
      type: 'job_confirmed',
      title: 'งานได้รับการยืนยันแล้ว',
      description: 'งานพนักงานร้านขายของ ได้รับการยืนยันแล้ว เริ่มงานวันพรุ่งนี้',
      timestamp: '1 วันที่แล้ว',
      unread: true,
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
    },
    {
      id: 2,
      type: 'payment',
      title: 'ได้รับเงินค่าจ้าง',
      description: 'ได้รับเงินค่าจ้าง ฿720 จากงานพนักงานร้านขายของ',
      timestamp: '2 วันที่แล้ว',
      unread: true,
      icon: <Coins className="w-6 h-6 text-primary" />,
    },
    {
      id: 3,
      type: 'rating',
      title: 'ได้รับคะแนนจากนายจ้าง',
      description: 'คุณได้รับคะแนน 5 ดาว จากงานพนักงานห้องครัว',
      timestamp: '2 วันที่แล้ว',
      unread: false,
      icon: <Star className="w-6 h-6 text-yellow-400" />,
    },
    {
      id: 4,
      type: 'job_offer',
      title: 'ข้อเสนองานใหม่',
      description: 'ร้านอาหารไทยแก่ ได้เสนองาน "พนักงานครัว" ให้คุณ',
      timestamp: '3 วันที่แล้ว',
      unread: false,
      icon: <Briefcase className="w-6 h-6 text-blue-500" />,
    },
  ];

  const filteredNotifications = notifications.filter(n => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'jobs') return ['job_confirmed', 'rating', 'job_offer'].includes(n.type);
    if (selectedTab === 'system') return ['payment'].includes(n.type);
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pb-24 pt-4">
        {/* Tabs */}
        <div className="px-4 pb-3">
          <div className="flex space-x-2 rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setSelectedTab('all')}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                selectedTab === 'all' ? 'bg-primary text-primary-foreground shadow' : 'text-gray-600'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setSelectedTab('jobs')}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                selectedTab === 'jobs' ? 'bg-primary text-primary-foreground shadow' : 'text-gray-600'
              }`}
            >
              เกี่ยวกับงาน
            </button>
            <button
              onClick={() => setSelectedTab('system')}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                selectedTab === 'system' ? 'bg-primary text-primary-foreground shadow' : 'text-gray-600'
              }`}
            >
              จากระบบ
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <main className="px-4">
          {isLoading || isLiffLoading ? (
            <div className="py-20 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-700">กำลังโหลด...</h2>
            </div>
          ) : !user ? (
            <div className="py-20 text-center">
              <Bell className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-700">เข้าสู่ระบบเพื่อดูการแจ้งเตือน</h2>
              <p className="text-gray-500">เมื่อคุณเข้าสู่ระบบ การแจ้งเตือนจะปรากฏที่นี่</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="space-y-3">
              {filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm transition-all duration-300 ${
                    item.unread ? 'border-l-4 border-primary' : 'border-l-4 border-transparent'
                  }`}
                >
                  <div className="mt-1 flex-shrink-0 rounded-full bg-primary/10 p-3">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-bold text-gray-800">{item.title}</h2>
                      {item.unread && (
                        <span className="h-2.5 w-2.5 rounded-full bg-primary"></span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                    <div className="mt-2 text-xs text-gray-400">{item.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <Bell className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-700">ไม่มีการแจ้งเตือน</h2>
              <p className="text-gray-500">การแจ้งเตือนของคุณจะปรากฏที่นี่</p>
            </div>
          )}
        </main>
      </div>
      
      {isEmployer ? <EmployerBottomNavigation /> : <BottomNavigation />}
    </div>
  );
};

export default NotificationsPage;