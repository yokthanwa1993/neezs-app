import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import EmployerBottomNavigation from '@/components/employer/EmployerBottomNavigation';
import AppLayout from '@/components/shared/AppLayout';

interface EmployerLayoutProps {
  children?: ReactNode;
}

const EmployerLayout = ({ children }: EmployerLayoutProps) => {
  return (
    <AppLayout footer={<EmployerBottomNavigation />}>
      {children ?? <Outlet />}
    </AppLayout>
  );
};

export default EmployerLayout;