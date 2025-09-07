import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import AppLayout from '@/shared/components/AppLayout';
import { logger } from '@/shared/utils/logger';

import SeekerBottomNavigation from '@/seeker/components/SeekerBottomNavigation';
import EmployerBottomNavigation from '@/employer/components/EmployerBottomNavigation';
// import SeekerLogin from '@/seeker/components/SeekerLogin';
// import EmployerLogin from '@/employer/components/EmployerLogin';
import { useSeekerAuth } from '@/seeker/contexts/SeekerAuthContext';
import { useEmployerAuth } from '@/employer/contexts/EmployerAuthContext';

type Role = 'seeker' | 'employer';

interface RoleLayoutProps {
  role: Role;
  children?: ReactNode;
}

const RoleLayout = ({ role, children }: RoleLayoutProps) => {
  const label = role === 'seeker' ? 'SeekerLayout' : 'EmployerLayout';

  let user: any = null;
  let isAuthenticated = false;
  let isLoading = true;
  let isLogoutInProgress = false;
  let loginFn: (() => Promise<void>) | null = null;

  try {
    const authContext = role === 'seeker' ? useSeekerAuth() : useEmployerAuth();
    user = authContext.user;
    isAuthenticated = authContext.isAuthenticated;
    isLoading = authContext.isLoading;
    loginFn = authContext.login;
    // Optional flag for finer UI control during logout
    // @ts-ignore
    isLogoutInProgress = authContext.isLogoutInProgress || false;
  } catch (error) {
    logger.error(`${label}: No ${role === 'seeker' ? 'Seeker' : 'Employer'}AuthProvider context available`);
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white p-4 rounded-2xl shadow-xl w-full max-w-mobile-lg text-center">
            <h2 className="text-xl font-bold text-red-800 mb-4">Authentication Error</h2>
            <p className="text-gray-600 mb-6">Authentication context not available. Please refresh the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  logger.info(`${label}: Component rendered`, {
    user: user ? `${user.uid} (${user.email})` : 'null',
    isAuthenticated,
    isLoading,
  });

  // Determine content + footer within the same centered AppLayout
  let content: ReactNode = children ?? <Outlet />;
  let footer: ReactNode | undefined = role === 'seeker' ? <SeekerBottomNavigation /> : <EmployerBottomNavigation />;

  // Loading state
  if (isLoading && !isLogoutInProgress) {
    logger.info(`${label}: Still loading auth state, showing loading screen`);
    footer = undefined;
    content = (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-4 rounded-2xl shadow-xl w-full max-w-mobile-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">กำลังตรวจสอบสถานะ...</h2>
          <p className="text-gray-600">🔍 โปรดรอสักครู่...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated state: show page content and a subtle login prompt instead of full-page login
  const showLoginPrompt = !isAuthenticated && !isLogoutInProgress;

  // We keep content as-is; no full-page login replacement
  // Footer is still shown for navigation experience

  logger.info(`${label}: Rendering AppLayout with ${footer ? 'footer' : 'no footer'}`);

  return (
    <AppLayout footer={footer}>
      {content}
      {showLoginPrompt && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
          <div className="bg-black/80 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
            <span className="text-sm">ยังไม่ได้เข้าสู่ระบบ</span>
            <button
              onClick={() => loginFn && loginFn().catch(() => {})}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-sm px-3 py-1 rounded-full"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default RoleLayout;
