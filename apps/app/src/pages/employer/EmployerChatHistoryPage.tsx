import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

const chats = [
  {
    id: 1,
    name: 'ธันวา พรหมมินทร์',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'สวัสดีครับ สนใจสมัครงานพนักงานเสิร์ฟครับ',
    timestamp: '10 นาที',
    unread: true,
    unreadCount: 1,
    jobTitle: 'พนักงานเสิร์ฟ',
    online: true,
  },
  {
    id: 2,
    name: 'สมหญิง ใจดี',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'สอบถามเรื่องเวลาทำงานค่ะ',
    timestamp: '1 ชม.',
    unread: false,
    unreadCount: 0,
    jobTitle: 'พนักงานต้อนรับ',
    online: false,
  },
  {
    id: 3,
    name: 'มานะ พากเพียร',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'ขอบคุณสำหรับโอกาสครับ',
    timestamp: 'เมื่อวาน',
    unread: false,
    unreadCount: 0,
    jobTitle: 'พนักงานทำความสะอาด',
    online: true,
  },
];

const EmployerChatHistoryPage: React.FC = () => {
  const navigate = useNavigate();

  const handleChatSelect = (chatId: number) => {
    navigate(`/employer/chat/${chatId}`);
  };

  return (
    <div className="flex flex-col h-screen bg-white pb-20">


      {/* Search */}
      <div className="p-4 bg-white">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="ค้นหาผู้สมัคร..."
            className="w-full pl-12 pr-4 py-3 h-12 bg-gray-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 px-2 py-2 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center p-3 space-x-4 hover:bg-primary/10 rounded-xl transition-colors cursor-pointer"
            onClick={() => handleChatSelect(chat.id)}
          >
            <div className="relative flex-shrink-0">
              <Avatar className="w-14 h-14 border-2 border-white shadow-sm">
                <AvatarImage src={chat.avatar} alt={chat.name} />
                <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {chat.online && (
                <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white"></span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="font-bold text-gray-800 truncate">{chat.name}</p>
                <p className="text-xs text-gray-400 flex-shrink-0 ml-2">{chat.timestamp}</p>
              </div>
              <p className="text-sm text-gray-500 truncate">{chat.jobTitle}</p>
              <div className="flex justify-between items-center mt-1">
                <p className={`text-sm truncate ${chat.unread ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                  {chat.lastMessage}
                </p>
                {chat.unread && chat.unreadCount > 0 && (
                  <span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployerChatHistoryPage;