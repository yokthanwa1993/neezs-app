import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Bell, MessageSquare, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const { user, firebaseUser } = useAuth();

  const navItems = [
    { path: '/seeker/home', icon: Home, label: 'หน้าแรก' },
    { path: '/seeker/chat', icon: MessageSquare, label: 'แชท' },
    { path: '/seeker/notifications', icon: Bell, label: 'แจ้งเตือน' },
  ];

  const isActive = (path: string) => {
    // Handle special case for home to not match other routes like /seeker/home/details
    if (path === '/seeker/home') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 w-full border-t bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-lg">
      <div className="mx-auto w-full max-w-md flex h-20 items-center justify-between px-3">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-center text-gray-600 transition-all duration-200 hover:bg-gray-50 active:scale-[0.98]"
            >
              <Icon
                className={`h-8 w-8 ${active ? 'text-black' : 'text-gray-500'} transition-colors duration-200`}
                fill={active ? 'hsl(var(--primary))' : 'none'}
                strokeWidth={active ? 2 : 1.5}
              />
              <span className={`mt-1 text-sm ${active ? 'font-semibold text-black' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Profile Link */}
        <Link
          to="/seeker/profile"
          className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-center text-gray-600 transition-all duration-200 hover:bg-gray-50 active:scale-[0.98]"
          title="โปรไฟล์"
        >
          <div
            className={`flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 transition-colors duration-200 ${
              isActive('/seeker/profile') ? 'border-primary' : 'border-transparent'
            }`}
          >
            {(user?.picture || firebaseUser?.photoURL || localStorage.getItem('liff_picture_url')) ? (
              <img
                src={user?.picture || firebaseUser?.photoURL || localStorage.getItem('liff_picture_url') || undefined}
                alt="Profile"
                className="h-full w-full object-cover"
                onError={(e)=>{(e.currentTarget as HTMLImageElement).src='/placeholder.svg'}}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200">
                <User className={`h-6 w-6 ${isActive('/seeker/profile') ? 'text-black' : 'text-gray-500'}`} />
              </div>
            )}
          </div>
          <span className={`mt-1 text-sm ${isActive('/seeker/profile') ? 'font-semibold text-black' : 'text-gray-500'}`}>โปรไฟล์</span>
        </Link>
      </div>
    </footer>
  );
};

export default BottomNavigation;