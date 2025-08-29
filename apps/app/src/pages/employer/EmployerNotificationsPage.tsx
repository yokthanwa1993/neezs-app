import React from 'react';
import { UserPlus, MessageSquare, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const notifications = [
  {
    id: 1,
    type: 'new_applicant',
    title: 'ผู้สมัครใหม่สำหรับ "พนักงานเสิร์ฟ"',
    description: 'ธันวา พรหมมินทร์ ได้สมัครงานของคุณ',
    time: '5 นาทีที่แล้ว',
    unread: true,
    icon: <UserPlus className="w-5 h-5 text-primary" />,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 2,
    type: 'new_message',
    title: 'ข้อความใหม่จาก สมหญิง ใจดี',
    description: 'สอบถามเรื่องเวลาทำงานค่ะ',
    time: '1 ชั่วโมงที่แล้ว',
    unread: true,
    icon: <MessageSquare className="w-5 h-5 text-green-500" />,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 3,
    type: 'job_viewed',
    title: 'มีผู้เข้าชมประกาศงานของคุณ 50 ครั้ง',
    description: '"พนักงานทำความสะอาด" กำลังได้รับความสนใจ!',
    time: '3 ชั่วโมงที่แล้ว',
    unread: false,
    icon: <Eye className="w-5 h-5 text-purple-500" />,
    avatar: null,
  },
  {
    id: 4,
    type: 'new_applicant',
    title: 'ผู้สมัครใหม่สำหรับ "บาริสต้า"',
    description: 'มานะ พากเพียร ได้สมัครงานของคุณ',
    time: '1 วันที่แล้ว',
    unread: false,
    icon: <UserPlus className="w-5 h-5 text-primary" />,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
  },
];

const EmployerNotificationsPage = () => {
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 overflow-x-hidden">
      <div className="p-4 pt-8">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            คุณมีการแจ้งเตือนที่ยังไม่ได้อ่าน <span className="font-bold text-primary">{unreadCount}</span> รายการ
          </p>
        </div>

        <div className="space-y-3">
          {notifications.map(notification => (
            <Card key={notification.id} className={`shadow-sm border-l-4 ${notification.unread ? 'border-primary bg-primary/10' : 'border-transparent'}`}>
              <CardContent className="p-3 flex items-start space-x-3">
                <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center mt-1">
                  {notification.avatar ? (
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={notification.avatar} />
                      <AvatarFallback>{notification.title.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    notification.icon
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployerNotificationsPage;