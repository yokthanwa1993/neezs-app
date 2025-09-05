import React from 'react';
import BottomNavigation from '@/shared/components/BottomNavigation';
import { Home, Bell, MessageSquare } from 'lucide-react';
import { useSeekerAuth } from '@/seeker/contexts/SeekerAuthContext';

const SeekerBottomNavigation: React.FC = () => {
  const { user } = useSeekerAuth();
  const items = [
    { path: '/seeker/home', icon: Home, label: 'หน้าแรก' },
    { path: '/seeker/chat', icon: MessageSquare, label: 'แชท' },
    { path: '/seeker/notifications', icon: Bell, label: 'แจ้งเตือน' },
  ];
  const profileImageUrl = user?.profile?.pictureUrl || (user as any)?.photoURL || (typeof window !== 'undefined' ? localStorage.getItem('liff_picture_url') || undefined : undefined);
  return <BottomNavigation items={items} profilePath="/seeker/profile" profileImageUrl={profileImageUrl} />;
};

export default SeekerBottomNavigation;
