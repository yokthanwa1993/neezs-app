import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLiff } from '@/contexts/LiffContext';
import { ArrowLeft, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import BottomNavigation from '@/components/shared/BottomNavigation';

// อัปเดตข้อมูล mock ให้ใช้รูปภาพจริงและชื่อภาษาไทย
const chats = [
    { id: 1, name: 'สมชาย ใจดี', lastMessage: 'เยี่ยมเลย เดี๋ยวเช็คให้นะ', timestamp: '21:34', unread: true, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 2, name: 'สมหญิง อารี', lastMessage: 'ขอบคุณค่ะ', timestamp: '21:34', unread: true, avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&h=256&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 3, name: 'อาทิตย์ รุ่งเรือง', lastMessage: 'ยินดีต้อนรับ!', timestamp: '21:34', unread: false, avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 4, name: 'คุณมานี มีนา', lastMessage: 'สวัสดีตอนเช้า!', timestamp: '21:34', unread: true, avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=256&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 5, name: 'วิชัย แซ่ตั้ง', lastMessage: 'ทำต่อไป!', timestamp: '21:34', unread: false, avatarUrl: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=256&h=256&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 6, name: 'อรุณี ศรีสดใส', lastMessage: 'ขอบคุณค่ะ', timestamp: '21:34', unread: true, avatarUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=256&h=256&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

const ChatHistoryPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, isLoading } = useAuth();
    const { isLiffLoading } = useLiff();

    const handleChatSelect = (chatId: number) => {
        navigate(`/seeker/chat/${chatId}`);
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Header and Search */}
            <header className="bg-primary text-primary-foreground p-4 pb-6 sticky top-0 z-10">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                        type="text"
                        placeholder="ค้นหา"
                        className="w-full pl-12 pr-4 py-3 h-12 bg-white text-gray-900 border-none rounded-xl focus:outline-none"
                    />
                </div>
            </header>

            {/* Chat list */}
            <main className="flex-1 overflow-y-auto p-4 bg-white rounded-t-3xl -mt-4 z-20 relative pb-20">
                {isLoading || isLiffLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3"></div>
                        <h2 className="text-lg font-semibold text-gray-800">กำลังโหลด...</h2>
                    </div>
                ) : !user ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <img 
                            src="/placeholder.svg" 
                            alt="No messages" 
                            className="w-28 h-28 mb-4 opacity-70"
                        />
                        <h2 className="text-lg font-semibold text-gray-800">เข้าสู่ระบบเพื่อดูแชท</h2>
                        <p className="mt-1">คุณยังไม่ได้เข้าสู่ระบบ จึงยังไม่มีข้อความแสดง</p>
                    </div>
                ) : chats.length > 0 ? (
                    <div className="space-y-2">
                        {chats.map((chat) => (
                            <div
                                key={chat.id}
                                className="flex items-center space-x-4 cursor-pointer p-3 rounded-2xl hover:bg-gray-50"
                                onClick={() => handleChatSelect(chat.id)}
                            >
                                <div className="relative flex-shrink-0">
                                    <Avatar className="w-14 h-14">
                                        <AvatarImage src={chat.avatarUrl} alt={chat.name} className="object-cover" />
                                        <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    {chat.unread && (
                                        <span className="absolute bottom-1 right-1 block h-3 w-3 rounded-full bg-primary border-2 border-white"></span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-900 truncate">{chat.name}</span>
                                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{chat.timestamp}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <img 
                            src="https://ik.imagekit.io/storyset/illustrations/chatting/pana.svg" 
                            alt="No messages" 
                            className="w-64 h-64 mb-4"
                        />
                        <h2 className="text-xl font-semibold text-gray-800">ยังไม่มีข้อความ</h2>
                        <p className="mt-2">เมื่อคุณเริ่มแชท ข้อความจะปรากฏที่นี่</p>
                    </div>
                )}
            </main>
            <BottomNavigation />
        </div>
    );
};

export default ChatHistoryPage;