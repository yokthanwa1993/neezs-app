import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Notifications = () => {
  const navigate = useNavigate();

  const todayNotifications = [
    {
      id: 1,
      user: {
        name: 'สมชาย ใจดี',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        initials: 'สช'
      },
      action: 'ถูกใจโพสต์ของคุณ',
      target: 'งานทำความสะอาด-045',
      time: '2 ชั่วโมงที่แล้ว',
      type: 'like',
      hasImage: true,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&h=100&fit=crop',
      unread: true
    },
    {
      id: 2,
      user: {
        name: 'สมชาย ใจดี',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        initials: 'สช'
      },
      action: 'ถูกใจโพสต์ของคุณ',
      target: 'งานทำความสะอาด-045',
      time: '2 ชั่วโมงที่แล้ว',
      type: 'like',
      hasImage: false,
      unread: true
    },
    {
      id: 3,
      user: {
        name: 'ราหุล ราช',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        initials: 'รร'
      },
      action: 'ถูกใจโพสต์ของคุณ',
      target: 'เมนูอาหาร-042',
      time: '6 ชั่วโมงที่แล้ว',
      type: 'like',
      hasImage: true,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop',
      unread: true
    },
    {
      id: 4,
      user: {
        name: 'ราหุล ราช',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        initials: 'รร'
      },
      action: 'ถูกใจโพสต์ของคุณ',
      target: 'เมนูอาหาร-042',
      time: '6 ชั่วโมงที่แล้ว',
      type: 'like',
      hasImage: true,
      image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=100&h=100&fit=crop',
      unread: true
    }
  ];

  const weekNotifications = [
    {
      id: 5,
      user: {
        name: 'อาร์ติ ซิงห์',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        initials: 'อซ'
      },
      action: 'ถูกใจโพสต์ของคุณ',
      target: 'เมนูอาหาร UI 044',
      time: '30 ตุลาคม',
      type: 'like',
      hasImage: true,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop',
      unread: false
    },
    {
      id: 6,
      user: {
        name: 'Best UI Design',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
        initials: 'BD'
      },
      action: 'เริ่มติดตามงานของคุณ',
      target: '',
      time: '30 สิงหาคม',
      type: 'follow',
      hasImage: true,
      image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=100&h=100&fit=crop',
      unread: false
    },
    {
      id: 7,
      user: {
        name: 'จัสติ โบลต์',
        avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face',
        initials: 'จบ'
      },
      action: 'กล่าวถึงคุณในโพสต์',
      target: '',
      time: '05 พฤศจิกายน',
      type: 'mention',
      hasImage: false,
      unread: false
    }
  ];

  const getStatusDot = (unread: boolean) => {
    return (
      <div className={`w-2 h-2 rounded-full ${unread ? 'bg-red-500' : 'bg-gray-300'}`} />
    );
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-red-500 fill-red-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-primary" />;
      case 'mention':
        return <MessageCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const NotificationItem = ({ notification }: { notification: any }) => (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
      <div className="flex items-center">
        {getStatusDot(notification.unread)}
      </div>
      
      <div className="relative">
        <Avatar className="w-12 h-12">
          <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
          <AvatarFallback>{notification.user.initials}</AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
          {getActionIcon(notification.type)}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-semibold text-primary">{notification.user.name}</span>
              <span className="text-gray-600 ml-1">{notification.action}</span>
              {notification.target && (
                <span className="text-gray-800 ml-1">{notification.target}</span>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
          </div>
          
          {notification.hasImage && (
            <div className="ml-3 flex-shrink-0">
              <img 
                src={notification.image} 
                alt="Preview" 
                className="w-12 h-12 rounded-lg object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const unreadCount = [...todayNotifications, ...weekNotifications].filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-white pb-20">
      
      
      <div className="px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-500">
              You have <span className="text-primary font-semibold">{unreadCount} Notifications</span> today.
            </p>
          </div>
          <div className="bg-gray-100 p-3 rounded-full">
            <Settings className="w-6 h-6 text-gray-600" />
          </div>
        </div>

        {/* Today Section */}
        <div className="space-y-1">
          {todayNotifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>

        {/* This Week Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">This Week</h2>
          <div className="space-y-1">
            {weekNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;