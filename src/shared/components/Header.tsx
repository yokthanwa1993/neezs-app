
import React from 'react';
import { ArrowLeft, Search, Bell, Settings, MoreVertical } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  showSettings?: boolean;
  showMenu?: boolean;
  onSearchClick?: () => void;
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
  onMenuClick?: () => void;
  className?: string;
  variant?: 'default' | 'transparent' | 'gradient';
  notificationCount?: number;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showSearch = false,
  showNotifications = false,
  showSettings = false,
  showMenu = false,
  onSearchClick,
  onNotificationClick,
  onSettingsClick,
  onMenuClick,
  className = '',
  variant = 'default',
  notificationCount = 0
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    navigate(-1);
  };

  const getHeaderStyle = () => {
    switch (variant) {
      case 'transparent':
        return 'bg-transparent backdrop-blur-md';
      case 'gradient':
        return 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600';
      default:
        return 'bg-white border-b border-gray-200';
    }
  };

  const getTextColor = () => {
    return variant === 'gradient' ? 'text-white' : 'text-gray-900';
  };

  const getIconColor = () => {
    return variant === 'gradient' ? 'text-white hover:text-yellow-100' : 'text-gray-600 hover:text-gray-900';
  };

  return (
    <div className={`sticky top-0 z-50 ${getHeaderStyle()} ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 h-16">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          {showBackButton && (
            <button
              onClick={handleBackClick}
              className={`p-2 rounded-full transition-all duration-200 hover:bg-black/10 ${getIconColor()}`}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          
          {title && (
            <div className="flex flex-col">
              <h1 className={`text-xl font-bold ${getTextColor()} truncate max-w-48`}>
                {title}
              </h1>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {showSearch && (
            <button
              onClick={onSearchClick}
              className={`p-2 rounded-full transition-all duration-200 hover:bg-black/10 ${getIconColor()}`}
            >
              <Search className="w-6 h-6" />
            </button>
          )}

          {showNotifications && (
            <button
              onClick={onNotificationClick}
              className={`relative p-2 rounded-full transition-all duration-200 hover:bg-black/10 ${getIconColor()}`}
            >
              <Bell className="w-6 h-6" />
              {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </div>
              )}
            </button>
          )}

          {showSettings && (
            <button
              onClick={onSettingsClick}
              className={`p-2 rounded-full transition-all duration-200 hover:bg-black/10 ${getIconColor()}`}
            >
              <Settings className="w-6 h-6" />
            </button>
          )}

          {showMenu && (
            <button
              onClick={onMenuClick}
              className={`p-2 rounded-full transition-all duration-200 hover:bg-black/10 ${getIconColor()}`}
            >
              <MoreVertical className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Subtle shadow effect for default variant */}
      {variant === 'default' && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      )}
    </div>
  );
};

export default Header;
