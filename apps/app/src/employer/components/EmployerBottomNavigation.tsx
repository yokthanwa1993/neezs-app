import React from 'react';
import BottomNavigation from '@/shared/components/BottomNavigation';
import { Home, Bell, MessageSquare, Plus } from 'lucide-react';
import { useEmployerAuth } from '@/employer/contexts/EmployerAuthContext';

const EmployerBottomNavigation: React.FC = () => {
  const { user } = useEmployerAuth();
  // Keep 5 buttons with center plus for add-job
  const items = [
    { path: '/employer/my-jobs', icon: Home, label: 'myjobs' },
    { path: '/employer/chat', icon: MessageSquare, label: 'แชท' },
    { path: '/employer/notifications', icon: Bell, label: 'แจ้งเตือน' },
  ];
  return (
    <BottomNavigation
      items={items}
      profilePath="/employer/profile"
      profileImageUrl={user?.profile?.pictureUrl || (user as any)?.photoURL || (typeof window !== 'undefined' ? localStorage.getItem('liff_picture_url') || undefined : undefined)}
      centerAction={{ to: '/employer/home', icon: Plus, ariaLabel: 'เพิ่มงาน' }}
    />
  );
};

export default EmployerBottomNavigation;
