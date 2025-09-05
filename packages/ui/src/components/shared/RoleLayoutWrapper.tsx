import React from 'react';
import { useRole } from '@/contexts/RoleContext';
import SeekerLayout from '@/pages/seeker/SeekerLayout';
import EmployerLayout from '@/pages/employer/EmployerLayout';
import AppLayout from './AppLayout';

const RoleLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { hasRole, isEmployer } = useRole();

  // If user has not selected a role yet, use the basic layout without a navbar.
  if (!hasRole) {
    return <AppLayout>{children}</AppLayout>;
  }

  if (isEmployer) {
    return <EmployerLayout>{children}</EmployerLayout>;
  }
  
  return <SeekerLayout>{children}</SeekerLayout>;
};

export default RoleLayoutWrapper;