import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Send } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'other';
  timestamp: string;
}

const EmployerChatPage: React.FC = () => {
  const { id } = useParams(); // To get applicant ID
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'สวัสดีครับ สนใจสมัครงานพนักงานเสิร์ฟครับ', sender: 'other', timestamp: '10:30' },
    { id: 2, text: 'สวัสดีค่ะ ยินดีค่ะ ไม่ทราบว่ามีประสบการณ์มาก่อนไหมคะ', sender: 'user', timestamp: '10:32' },
    { id: 3, text: 'เคยทำที่ร้านอาหารสยาม 2 ปีครับ', sender: 'other', timestamp: '10:33' },
  ]);
  
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const newMsg: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 pb-20">
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <h1 className="text-lg font-bold text-center">ธันวา พรหมมินทร์</h1>
        <p className="text-sm text-gray-500 text-center">พนักงานเสิร์ฟ</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-br-none' 
                  : 'bg-white text-black rounded-bl-none shadow-sm'
              }`}
            >
              <p>{message.text}</p>
              <p 
                className={`text-xs mt-1 text-right ${
                  message.sender === 'user' ? 'text-primary-foreground/70' : 'text-gray-500'
                }`}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white p-2 border-t sticky bottom-[60px] z-10">
        <div className="flex items-center">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="พิมพ์ข้อความ..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={newMessage.trim() === ''}
            className="ml-2 bg-primary text-white rounded-full p-3 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployerChatPage;