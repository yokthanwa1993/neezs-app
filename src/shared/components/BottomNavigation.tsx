import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Plus } from 'lucide-react';

export type BottomNavItem = {
  path: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any; // LucideIcon type without importing heavy types
};

interface BottomNavigationProps {
  items: BottomNavItem[];
  profilePath: string;
  profileImageUrl?: string;
  centerAction?: {
    to: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon?: any;
    ariaLabel?: string;
  };
}

// Unified bottom navigation styled per Seeker design
const BottomNavigation: React.FC<BottomNavigationProps> = ({ items, profilePath, profileImageUrl, centerAction }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path.endsWith('/home')) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const firstHalf = centerAction ? items.slice(0, Math.ceil(items.length / 2)) : items;
  const secondHalf = centerAction ? items.slice(Math.ceil(items.length / 2)) : [];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 w-full border-t bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-lg safe-area-pb">
      <div className="mx-auto w-full max-w-mobile-lg flex h-20 items-center justify-between px-3">
        {firstHalf.map((item) => {
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

        {centerAction && (
          <button
            aria-label={centerAction.ariaLabel || 'เพิ่มงาน'}
            className="relative -top-6 flex items-center justify-center h-16 w-16 bg-yellow-400 rounded-full shadow-lg hover:bg-yellow-500 transition-all duration-200 border-4 border-white active:scale-95"
            onClick={() => navigate(centerAction.to)}
          >
            {(() => { const CenterIcon = centerAction.icon || Plus; return <CenterIcon className="text-black" size={32} strokeWidth={2.5} />; })()}
          </button>
        )}

        {secondHalf.map((item) => {
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

        {/* Profile Link (shared styling) */}
        <Link
          to={profilePath}
          className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-center text-gray-600 transition-all duration-200 hover:bg-gray-50 active:scale-[0.98]"
          title="โปรไฟล์"
        >
          <div
            className={`flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 transition-colors duration-200 ${
              isActive(profilePath) ? 'border-primary' : 'border-transparent'
            }`}
          >
            {(() => {
              const lsUrl = typeof window !== 'undefined' ? localStorage.getItem('liff_picture_url') : null;
              const src = profileImageUrl || lsUrl;
              if (src) {
                return (
                  <img
                    src={src}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                );
              }
              return (
                <div className="flex h-full w-full items-center justify-center bg-gray-200">
                  <User className={`h-6 w-6 ${isActive(profilePath) ? 'text-black' : 'text-gray-500'}`} />
                </div>
              );
            })()}
          </div>
          <span className={`mt-1 text-sm ${isActive(profilePath) ? 'font-semibold text-black' : 'text-gray-500'}`}>โปรไฟล์</span>
        </Link>
      </div>
    </footer>
  );
};

export default BottomNavigation;
