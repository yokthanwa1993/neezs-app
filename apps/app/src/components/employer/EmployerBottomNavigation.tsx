import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Plus, Briefcase, Bell, MessageCircle } from 'lucide-react';
// No longer uses AddJobDialog; navigate to full-page route instead

const EmployerBottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Keep bottom nav visible on all employer pages per new mapping

  // ตัวอย่างจำนวนแจ้งเตือนค้างอ่าน (ภายหลังสามารถเชื่อมต่อ API/สถานะจริงได้)
  const unreadNotifications = 3;

  const navItems = [
    { path: '/employer/my-jobs', label: 'JOBS', icon: Briefcase },
    { path: '/employer/chat', label: 'แชท', icon: MessageCircle },
    { path: 'add-job-trigger', icon: Plus, isCentral: true },
    { path: '/employer/notifications', label: 'แจ้งเตือน', icon: Bell, badge: unreadNotifications },
    { path: '/employer/profile', label: 'โปรไฟล์', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 shadow-[0_-1px_4px_rgba(0,0,0,0.05)]">
      <div className="w-full max-w-sm mx-auto">
        <div className="grid grid-cols-5 items-center">
          {navItems.map((item) => {
            if ('isCentral' in item && item.isCentral) {
              const IconComponent = item.icon;
              return (
                <div 
                  key={item.path}
                  className="flex justify-center"
                  onClick={() => navigate('/employer/home')}
                >
                  <div className="relative -top-6 flex items-center justify-center h-16 w-16 bg-yellow-400 rounded-full cursor-pointer shadow-lg hover:bg-yellow-500 transition-all duration-200 border-4 border-white">
                    <IconComponent className="text-black" size={32} strokeWidth={2.5} />
                  </div>
                </div>
              );
            }

            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <div 
                key={item.path}
                className="flex flex-col items-center justify-center py-3 cursor-pointer select-none group"
                onClick={() => navigate(item.path)}
              >
                <div className="relative">
                  <IconComponent 
                    size={28} 
                    strokeWidth={isActive ? 2 : 1.5}
                    className={`mb-1 transition-all duration-200 ${
                      isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                    fill={isActive ? 'hsl(var(--primary))' : 'none'}
                  />
                  {/* @ts-ignore */}
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 bg-primary text-primary-foreground text-[11px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                      {/* @ts-ignore */}
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-xs leading-tight font-bold ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmployerBottomNavigation;