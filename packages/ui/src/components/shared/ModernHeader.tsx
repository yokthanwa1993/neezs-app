
import React, { useState } from 'react';
import { ArrowLeft, Search, Bell, User, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface ModernHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  showProfile?: boolean;
  showNotifications?: boolean;
  showSearch?: boolean;
  showMenu?: boolean;
  notificationCount?: number;
  profileImage?: string;
  userName?: string;
  onSearchClick?: () => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onMenuClick?: () => void;
  className?: string;
  theme?: 'light' | 'dark' | 'yellow' | 'gradient';
}

const ModernHeader: React.FC<ModernHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  showProfile = false,
  showNotifications = false,
  showSearch = false,
  showMenu = false,
  notificationCount = 0,
  profileImage,
  userName,
  onSearchClick,
  onNotificationClick,
  onProfileClick,
  onMenuClick,
  className = '',
  theme = 'yellow'
}) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleBackClick = () => {
    navigate(-1);
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return {
          container: 'bg-gray-900 border-gray-700',
          text: 'text-white',
          subtext: 'text-gray-300',
          button: 'text-gray-300 hover:text-white hover:bg-gray-800'
        };
      case 'gradient':
        return {
          container: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 shadow-lg',
          text: 'text-white',
          subtext: 'text-yellow-100',
          button: 'text-white hover:text-yellow-100 hover:bg-white/20'
        };
      case 'yellow':
        return {
          container: 'bg-yellow-400 shadow-md',
          text: 'text-gray-900',
          subtext: 'text-gray-700',
          button: 'text-gray-700 hover:text-gray-900 hover:bg-yellow-500/30'
        };
      default:
        return {
          container: 'bg-white border-gray-200 shadow-sm',
          text: 'text-gray-900',
          subtext: 'text-gray-600',
          button: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <>
      <div className={`sticky top-0 z-50 border-b ${themeClasses.container} ${className}`}>
        <div className="flex items-center justify-between px-4 py-4 h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {showBackButton && (
              <button
                onClick={handleBackClick}
                className={`p-2 rounded-full transition-all duration-200 ${themeClasses.button}`}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            
            <div className="flex flex-col min-w-0 flex-1">
              {title && (
                <h1 className={`text-xl font-bold ${themeClasses.text} truncate`}>
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className={`text-sm ${themeClasses.subtext} truncate`}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {showSearch && (
              <button
                onClick={onSearchClick}
                className={`p-2 rounded-full transition-all duration-200 ${themeClasses.button}`}
              >
                <Search className="w-6 h-6" />
              </button>
            )}

            {showNotifications && (
              <button
                onClick={onNotificationClick}
                className={`relative p-2 rounded-full transition-all duration-200 ${themeClasses.button}`}
              >
                <Bell className="w-6 h-6" />
                {notificationCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </button>
            )}

            {showProfile && (
              <button
                onClick={onProfileClick}
                className={`flex items-center space-x-2 p-1 rounded-full transition-all duration-200 ${themeClasses.button}`}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={userName || 'Profile'}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </button>
            )}

            {showMenu && (
              <button
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                  onMenuClick?.();
                }}
                className={`p-2 rounded-full transition-all duration-200 ${themeClasses.button}`}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Progress bar for loading states */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-0 animate-pulse"></div>
      </div>

      {/* Dropdown Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute top-16 right-4 bg-white rounded-lg shadow-xl border p-2 min-w-48">
            <div className="py-2">
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md">
                ตั้งค่า
              </button>
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md">
                ช่วยเหลือ
              </button>
              <hr className="my-2" />
              <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModernHeader;
