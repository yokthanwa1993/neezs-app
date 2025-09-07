import React, { useState } from 'react';
import { Bell, CheckCircle, Coins, Star, Briefcase, Trash2, Settings } from 'lucide-react';
import { Button } from '@neezs/ui';

const SeekerNotificationsPage = () => {
  const [selectedTab, setSelectedTab] = useState('all'); // 'all', 'jobs', 'system'

  const notifications = [
    {
      id: 1,
      type: 'job',
      title: 'งานใหม่ที่เหมาะกับคุณ',
      message: 'มีงาน "พนักงานเสิร์ฟ" ใหม่ในเขตใกล้คุณ',
      time: '5 นาทีที่แล้ว',
      read: false,
      icon: Briefcase,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'payment',
      title: 'การจ่ายเงินสำเร็จ',
      message: 'คุณได้รับเงิน 1,200 บาท สำหรับงาน "พนักงานขายของ"',
      time: '2 ชั่วโมงที่แล้ว',
      read: false,
      icon: Coins,
      color: 'text-green-500'
    },
    {
      id: 3,
      type: 'rating',
      title: 'ได้รับคะแนนใหม่',
      message: 'นายจ้างให้คะแนน 5 ดาว สำหรับงานล่าสุดของคุณ',
      time: '1 วันที่แล้ว',
      read: true,
      icon: Star,
      color: 'text-yellow-500'
    },
    {
      id: 4,
      type: 'system',
      title: 'อัพเดทแอป',
      message: 'มีฟีเจอร์ใหม่ในแอป NEEZS แล้ว!',
      time: '3 วันที่แล้ว',
      read: true,
      icon: Bell,
      color: 'text-purple-500'
    }
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'jobs') return notification.type === 'job';
    if (selectedTab === 'system') return notification.type === 'system' || notification.type === 'rating' || notification.type === 'payment';
    return true;
  });

  const markAsRead = (id: number) => {
    console.log(`Mark notification ${id} as read`);
  };

  const deleteNotification = (id: number) => {
    console.log(`Delete notification ${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">การแจ้งเตือน</h1>
          <Button variant="ghost" size="sm">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1 mt-4 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setSelectedTab('all')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setSelectedTab('jobs')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'jobs'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            งาน
          </button>
          <button
            onClick={() => setSelectedTab('system')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'system'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ระบบ
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Bell className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">ไม่มีการแจ้งเตือน</p>
            <p className="text-sm text-center">การแจ้งเตือนจะแสดงที่นี่เมื่อมีข้อมูลใหม่</p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {filteredNotifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg border p-4 transition-all duration-200 hover:shadow-sm ${
                    !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${notification.read ? 'bg-gray-100' : 'bg-blue-100'}`}>
                      <IconComponent className={`w-5 h-5 ${notification.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="ทำเครื่องหมายว่าอ่านแล้ว"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="ลบการแจ้งเตือน"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      
    </div>
  );
};

export default SeekerNotificationsPage;
