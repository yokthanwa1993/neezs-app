import React, { ReactNode } from 'react';
import AppLayout from './AppLayout';
import { useRole } from '@/shared/contexts/RoleContext';

// Seeker imports
import SeekerBottomNavigation from '@/seeker/components/SeekerBottomNavigation';
import SeekerLogin from '@/seeker/components/SeekerLogin';
import { useSeekerAuth } from '@/seeker/contexts/SeekerAuthContext';

// Employer imports
import EmployerBottomNavigation from '@/employer/components/EmployerBottomNavigation';
import EmployerLogin from '@/employer/components/EmployerLogin';
import { useEmployerAuth } from '@/employer/contexts/EmployerAuthContext';

type Props = {
  children?: ReactNode;
};

/**
 * Shared role-aware mobile layout for the whole app
 * - Centers content to mobile width
 * - Applies safe areas via AppLayout
 * - Picks bottom navigation and auth guard by role
 * - Gracefully handles missing auth providers
 */
const Layout = ({ children }: Props) => {
  const { hasRole, isEmployer } = useRole();

  // If no role selected yet, render base layout without nav
  if (!hasRole) {
    return (
      <AppLayout>
        {children}
      </AppLayout>
    );
  }

  // Employer role
  if (isEmployer) {
    try {
      const { isAuthenticated, isLoading } = useEmployerAuth();
      if (isLoading) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white p-4 rounded-2xl shadow-xl w-full max-w-mobile-lg text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">กำลังตรวจสอบสถานะ...</h2>
              <p className="text-gray-600">โปรดรอสักครู่</p>
            </div>
          </div>
        );
      }
      if (!isAuthenticated) {
        return <EmployerLogin />;
      }
    } catch (e) {
      // No provider mounted – render without auth enforcement
    }

    return (
      <AppLayout footer={<EmployerBottomNavigation />}>
        {children}
      </AppLayout>
    );
  }

  // Seeker role
  try {
    const { isAuthenticated, isLoading } = useSeekerAuth();
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="bg-white p-4 rounded-2xl shadow-xl w-full max-w-mobile-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">กำลังตรวจสอบสถานะ...</h2>
            <p className="text-gray-600">โปรดรอสักครู่</p>
          </div>
        </div>
      );
    }
    if (!isAuthenticated) {
      return <SeekerLogin />;
    }
  } catch (e) {
    // No provider mounted – render without auth enforcement
  }

  return (
    <AppLayout footer={<SeekerBottomNavigation />}>
      {children}
    </AppLayout>
  );
};

export default Layout;

