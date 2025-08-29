import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from '@/components/shared/BottomNavigation';
import AppLayout from '@/components/shared/AppLayout';

const SeekerLayout = ({ children }: { children?: ReactNode }) => {
  return (
    <AppLayout footer={<BottomNavigation />}>
      {children ?? <Outlet />}
    </AppLayout>
  );
};

export default SeekerLayout;
