import React, { useState } from 'react';
import BottomNavigation from '../shared/BottomNavigation';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'other';
  timestamp: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'สวัสดี! มีอะไรให้ช่วยไหม?', sender: 'other', timestamp: '10:30' },
    { id: 2, text: 'สอบถามเกี่ยวกับงานที่โพสต์ไว้', sender: 'user', timestamp: '10:32' },
    { id: 3, text: 'แน่นอน งานไหนครับ?', sender: 'other', timestamp: '10:33' },
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
                  : 'bg-white text-black rounded-bl-none'
              }`}
            >
              <p>{message.text}</p>
              <p 
                className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-gray-800' : 'text-gray-500'
                }`}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white p-4 border-t sticky bottom-20">
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
            className="ml-2 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default ChatPage;