import React from 'react';
import { useRole } from '@/shared/contexts/RoleContext';
import AppLayout from './AppLayout';
import RoleLayout from './RoleLayout';

const RoleLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { hasRole, isEmployer } = useRole();

  // If user has not selected a role yet, use the basic layout without a navbar.
  if (!hasRole) {
    return <AppLayout>{children}</AppLayout>;
  }

  if (isEmployer) {
    return <RoleLayout role="employer">{children}</RoleLayout>;
  }

  return <RoleLayout role="seeker">{children}</RoleLayout>;
};

export default RoleLayoutWrapper;
