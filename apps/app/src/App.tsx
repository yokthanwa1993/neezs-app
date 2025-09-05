import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useLiff } from './shared/contexts/LiffContext';
import { AppProviders } from '@/shared/providers/AppProviders';
import { PlatformWrapper } from './shared/components/PlatformWrapper';
import SeekerProfilePage from './seeker/pages/SeekerProfilePage';
import SeekerProfileEditPage from './seeker/pages/SeekerProfileEditPage';
import SeekerWallet from './seeker/components/SeekerWallet';
import SeekerMyShifts from './seeker/components/SeekerMyShifts';
import Onboarding from './shared/components/Onboarding';
import SeekerJobDetail from './seeker/components/SeekerJobDetail';
import SeekerJobFeed from './seeker/components/SeekerJobFeed';
import SeekerHome from './seeker/pages/SeekerHome';
import SeekerChatPage from './seeker/components/SeekerChatPage';
import SeekerChatHistoryPage from './seeker/pages/SeekerChatHistoryPage';
import SeekerNotificationsPage from './seeker/pages/SeekerNotificationsPage';
import RequireSeekerAuth from './seeker/components/RequireSeekerAuth';
import SeekerFullTimeJobs from './seeker/pages/SeekerFullTimeJobs';
import LiffHandler from './shared/components/LiffHandler';

// Import Seeker Authentication Components
import { SeekerLiffHandler, SeekerCallback, SeekerProviders } from './seeker';

import EmployerHome from './employer/pages/EmployerHome';
import EmployerChatHistoryPage from './employer/pages/EmployerChatHistoryPage';
import EmployerChatPage from './employer/pages/EmployerChatPage';
import EmployerNotificationsPage from './employer/pages/EmployerNotificationsPage';
import EmployerProfile from './employer/pages/EmployerProfile';
import RoleSelection from './shared/pages/RoleSelection';
import MapView from './shared/pages/MapView';
import EmployerEditProfilePage from './employer/pages/EmployerEditProfilePage';
import SeekerSettingsPage from './seeker/pages/SeekerSettingsPage';
import EmployerSettingsPage from './employer/pages/EmployerSettingsPage';
import EmployerTeamManagementPage from './employer/pages/EmployerTeamManagementPage';
import EmployerBillingPage from './employer/pages/EmployerBillingPage';
import EmployerSecurityPage from './employer/pages/EmployerSecurityPage';
import SupportPage from './shared/pages/SupportPage';
import RoleLayout from './shared/components/RoleLayout';
import EmployerJobList from './employer/pages/EmployerJobList';
import NotFound from './shared/pages/NotFound';
// Use shared RoleLayout instead of per-role wrappers
import AppLayout from './shared/components/AppLayout';
import ChangeEmailPage from './shared/pages/ChangeEmailPage';
import RoleLayoutWrapper from './shared/components/RoleLayoutWrapper';
import EmployerJobApplicants from './employer/pages/EmployerJobApplicants';
import EmployerApplicantProfilePage from './employer/pages/EmployerApplicantProfilePage';
import EmployerJobDetail from './employer/pages/EmployerJobDetail';
import { JobProvider } from './shared/contexts/JobContext';
import EmployerJobSchedule from './employer/pages/EmployerJobSchedule';
// import EmployerJobPublish from './employer/pages/EmployerJobPublish.tsx';
import EmployerJobUpload from './employer/pages/EmployerJobUpload.tsx';
import EmployerJobWage from './employer/pages/EmployerJobWage';
import EmployerJobSummary from './employer/pages/EmployerJobSummary';
import RequireEmployerAuth from './employer/components/RequireEmployerAuth';
import SeekerOtpVerification from './seeker/pages/apply/SeekerOtpVerification';
import SeekerEkycId from './seeker/pages/apply/SeekerEkycId';
import SeekerEkycFace from './seeker/pages/apply/SeekerEkycFace';
import SeekerBidPrice from './seeker/pages/apply/SeekerBidPrice';
import EmployerSeekerSelection from './employer/pages/EmployerSeekerSelection';
import EmployerSeekerProfile from './employer/pages/EmployerSeekerProfile';
import EmployerLogin from './employer/components/EmployerLogin';
import EmployerCallback from './employer/components/EmployerCallback';
import EmployerProviders from './employer/providers/EmployerProviders';
// SeekerLogin จะใช้จาก seeker module แทน
// import SeekerLogin from './shared/components/SeekerLogin';
// import SplashScreen from './components/shared/SplashScreen'; // เอาออกแล้ว

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingLiff, setIsCheckingLiff] = React.useState(false);
  // เอา isLiffLoading ออกไปเลยเพราะไม่ใช้แล้ว

  useEffect(() => {
    // LIFF Detection: Check if we're in LINE browser for auto-redirect
    const isLiffBrowser = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      return userAgent.includes('line/') || 
             userAgent.includes('line-ios/') || 
             userAgent.includes('line-android/') ||
             window.location.href.includes('liff.line.me');
    };

    // If in LIFF browser and on root path, wait for LIFF to load then redirect
    if (location.pathname === '/' && isLiffBrowser() && !isCheckingLiff) {
      console.log('🔄 App: LIFF browser detected, initializing LIFF...');
      setIsCheckingLiff(true);
      
      // Load LIFF SDK first
      const loadLiffAndRedirect = async () => {
        try {
          // Load LIFF SDK if not already loaded
          if (!window.liff) {
            const script = document.createElement('script');
            script.src = 'https://static.line-scdn.net/liff/edge/2/sdk.js';
            await new Promise((resolve, reject) => {
              script.onload = resolve;
              script.onerror = reject;
              document.head.appendChild(script);
            });
            console.log('✅ App: LIFF SDK loaded');
          }

          // Small delay to ensure LIFF is ready
          await new Promise(resolve => setTimeout(resolve, 500));
          
          console.log('🔄 App: Redirecting to seeker LIFF handler');
          navigate('/seeker/auth/liff', { replace: true });
        } catch (error) {
          console.error('❌ App: LIFF SDK load failed', error);
          // Fallback to seeker home (which will show login form)
          navigate('/seeker/home', { replace: true });
        } finally {
          setIsCheckingLiff(false);
        }
      };

      loadLiffAndRedirect();
      return;
    }

    // Only redirect to role-selection if:
    // 1. On root path 
    // 2. NOT currently in authentication flow (callback, login pages)
    // 3. NOT in LIFF browser
    // 4. NOT checking LIFF
    const isAuthFlow = location.pathname.includes('/callback') || 
                      location.pathname.includes('/login') ||
                      location.pathname.includes('/home') ||
                      location.pathname.includes('/auth');
    
    if (location.pathname === '/' && !isAuthFlow && !isLiffBrowser() && !isCheckingLiff) {
      navigate('/role-selection', { replace: true });
    }
  }, [navigate, location.pathname, isCheckingLiff]);

  // เอา SplashScreen ออก - ให้แสดง page ปกติเลยแม้ระหว่างโหลด

  const protectedRoute = (element: React.ReactElement, role: 'seeker' | 'employer' | 'any' = 'any') => {
    if (role === 'seeker') {
      return <RequireSeekerAuth>{element}</RequireSeekerAuth>;
    }
    if (role === 'employer') {
      return <RequireEmployerAuth>{element}</RequireEmployerAuth>;
    }
    return element;
  };

  // Show loading screen when checking LIFF
  if (isCheckingLiff) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังเชื่อมต่อกับ LINE...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Root and Shared Routes */}
      <Route path="/" element={<Navigate to="/role-selection" replace />} />
      {/* Employer Authentication Routes */}
      <Route path="/employer/auth/callback" element={<EmployerProviders><EmployerCallback /></EmployerProviders>} />
      <Route path="/employer/auth/liff" element={<EmployerProviders><EmployerLogin /></EmployerProviders>} />
      
      {/* Seeker Authentication Routes */}
      <Route path="/seeker/auth/liff" element={<SeekerProviders><SeekerLiffHandler /></SeekerProviders>} />
      <Route path="/seeker/auth/callback" element={<SeekerProviders><SeekerCallback /></SeekerProviders>} />
      
      {/* LIFF Routes - Handle LIFF authentication */}
      <Route path="/seeker/home" element={protectedRoute(<RoleLayout role="seeker"><SeekerHome /></RoleLayout>, 'seeker')} />
      <Route path="/employer/auth" element={<LiffHandler role="employer" targetPath="/employer/home" />} />
      
      {/* Protected routes with specific layouts */}
      <Route path="/role-selection" element={<AppLayout><RoleSelection /></AppLayout>} />
      <Route path="/onboarding" element={protectedRoute(<AppLayout><Onboarding /></AppLayout>)} />
      
      {/* These shared pages now get the correct role-based navbar */}
      <Route path="/support" element={protectedRoute(<RoleLayoutWrapper><SupportPage /></RoleLayoutWrapper>)} />
      <Route path="/change-email" element={protectedRoute(<RoleLayoutWrapper><ChangeEmailPage /></RoleLayoutWrapper>)} />
      
      <Route path="/map-view" element={<MapView />} />
      
      {/* Seeker Routes wrapped in SeekerLayout - All Protected */}
      <Route path="/seeker/dashboard" element={<Navigate to="/seeker/home" replace />} />
      <Route path="/seeker/profile" element={protectedRoute(<RoleLayout role="seeker"><SeekerProfilePage /></RoleLayout>, 'seeker')} />
      <Route path="/seeker/profile/edit" element={protectedRoute(<RoleLayout role="seeker"><SeekerProfileEditPage /></RoleLayout>, 'seeker')} />
      <Route path="/seeker/wallet" element={protectedRoute(<RoleLayout role="seeker"><SeekerWallet /></RoleLayout>, 'seeker')} />
      <Route path="/seeker/my-shifts" element={protectedRoute(<RoleLayout role="seeker"><SeekerMyShifts /></RoleLayout>, 'seeker')} />
      <Route path="/seeker/job/:id" element={protectedRoute(<RoleLayout role="seeker"><SeekerJobDetail /></RoleLayout>, 'seeker')} />
      <Route path="/seeker/jobs" element={protectedRoute(<RoleLayout role="seeker"><SeekerJobFeed /></RoleLayout>, 'seeker')} />
      <Route path="/seeker/full-time-jobs" element={protectedRoute(<RoleLayout role="seeker"><SeekerFullTimeJobs /></RoleLayout>, 'seeker')} />
      <Route path="/seeker/chat" element={protectedRoute(<RoleLayout role="seeker"><SeekerChatHistoryPage /></RoleLayout>, 'seeker')} />
      <Route path="/seeker/chat/:id" element={protectedRoute(<RoleLayout role="seeker"><SeekerChatPage /></RoleLayout>, 'seeker')} />
      <Route path="/seeker/notifications" element={protectedRoute(<RoleLayout role="seeker"><SeekerNotificationsPage /></RoleLayout>, 'seeker')} />
      <Route path="/seeker/settings" element={protectedRoute(<RoleLayout role="seeker"><SeekerSettingsPage /></RoleLayout>, 'seeker')} />
      
      {/* Backward compatibility redirects */}
      <Route path="/home" element={<Navigate to="/seeker/home" replace />} />
      <Route path="/profile" element={<Navigate to="/seeker/profile" replace />} />
      <Route path="/profile/edit" element={<Navigate to="/seeker/profile/edit" replace />} />
      <Route path="/wallet" element={<Navigate to="/seeker/wallet" replace />} />
      <Route path="/my-shifts" element={<Navigate to="/seeker/my-shifts" replace />} />
      <Route path="/job/:id" element={<Navigate to="/seeker/job/:id" replace />} />
      <Route path="/jobs" element={<Navigate to="/seeker/jobs" replace />} />
      <Route path="/full-time-jobs" element={<Navigate to="/seeker/full-time-jobs" replace />} />
      <Route path="/chat" element={<Navigate to="/seeker/chat" replace />} />
      <Route path="/chat/:id" element={<Navigate to="/seeker/chat/:id" replace />} />
      <Route path="/notifications" element={<Navigate to="/seeker/notifications" replace />} />
      
      {/* Seeker Application Flow - All Protected */}
      <Route path="/seeker/apply/otp" element={protectedRoute(<RoleLayout role="seeker"><SeekerOtpVerification /></RoleLayout>, 'seeker')} />
      {/* select-category removed per request */}
      <Route path="/seeker/apply/ekyc-id" element={protectedRoute(<RoleLayout role="seeker"><SeekerEkycId /></RoleLayout>, 'seeker')} />
      <Route path="/seeker/apply/ekyc-face" element={protectedRoute(<RoleLayout role="seeker"><SeekerEkycFace /></RoleLayout>, 'seeker')} />
      <Route path="/seeker/apply/bid" element={protectedRoute(<RoleLayout role="seeker"><SeekerBidPrice /></RoleLayout>, 'seeker')} />
      
      {/* Employer Routes: home is the add-job page (prompt for job creation) - All Protected */}
      <Route path="/employer/home" element={protectedRoute(<RoleLayout role="employer"><EmployerHome /></RoleLayout>, 'employer')} />
      <Route path="/employer/dashboard" element={<Navigate to="/employer/home" replace />} />
      <Route path="/employer/add-job" element={<Navigate to="/employer/home" replace />} />
      <Route path="/employer/my-jobs" element={protectedRoute(<RoleLayout role="employer"><EmployerJobList /></RoleLayout>, 'employer')} />
      <Route path="/employer/job/:jobId/seekers" element={protectedRoute(<RoleLayout role="employer"><EmployerSeekerSelection /></RoleLayout>, 'employer')} />
      <Route path="/employer/seeker/:seekerId/profile" element={protectedRoute(<RoleLayout role="employer"><EmployerSeekerProfile /></RoleLayout>, 'employer')} />
      <Route path="/employer/job/:jobId/detail" element={protectedRoute(<RoleLayout role="employer"><EmployerJobDetail /></RoleLayout>, 'employer')} />
      <Route path="/employer/job/:jobId/applicants" element={protectedRoute(<RoleLayout role="employer"><EmployerJobApplicants /></RoleLayout>, 'employer')} />
      <Route path="/employer/applicant/:applicantId" element={protectedRoute(<RoleLayout role="employer"><EmployerApplicantProfilePage /></RoleLayout>, 'employer')} />
      <Route path="/employer/chat" element={protectedRoute(<RoleLayout role="employer"><EmployerChatHistoryPage /></RoleLayout>, 'employer')} />
      <Route path="/employer/chat/:id" element={protectedRoute(<RoleLayout role="employer"><EmployerChatPage /></RoleLayout>, 'employer')} />
      <Route path="/employer/notifications" element={protectedRoute(<RoleLayout role="employer"><EmployerNotificationsPage /></RoleLayout>, 'employer')} />
      <Route path="/employer/profile" element={protectedRoute(<RoleLayout role="employer"><EmployerProfile /></RoleLayout>, 'employer')} />
      <Route path="/employer/edit-profile" element={protectedRoute(<RoleLayout role="employer"><EmployerEditProfilePage /></RoleLayout>, 'employer')} />
      <Route path="/employer/settings" element={protectedRoute(<RoleLayout role="employer"><EmployerSettingsPage /></RoleLayout>, 'employer')} />
      <Route path="/employer/team" element={protectedRoute(<RoleLayout role="employer"><EmployerTeamManagementPage /></RoleLayout>, 'employer')} />
      <Route path="/employer/billing" element={protectedRoute(<RoleLayout role="employer"><EmployerBillingPage /></RoleLayout>, 'employer')} />
      <Route path="/employer/security" element={protectedRoute(<RoleLayout role="employer"><EmployerSecurityPage /></RoleLayout>, 'employer')} />
      <Route path="/employer/job-schedule" element={protectedRoute(<RoleLayout role="employer"><EmployerJobSchedule /></RoleLayout>, 'employer')} />
      <Route path="/employer/job-wage" element={protectedRoute(<RoleLayout role="employer"><EmployerJobWage /></RoleLayout>, 'employer')} />
      {/* <Route path="/employer/job-publish" element={<EmployerJobPublish />} /> */}
      <Route path="/employer/job-upload" element={protectedRoute(<EmployerJobUpload />, 'employer')} />
      <Route path="/employer/job-summary" element={protectedRoute(<RoleLayout role="employer"><EmployerJobSummary /></RoleLayout>, 'employer')} />
      <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppProviders>
        <JobProvider>
          <PlatformWrapper>
            <SeekerProviders>
              <EmployerProviders>
                <AppContent />
              </EmployerProviders>
            </SeekerProviders>
          </PlatformWrapper>
        </JobProvider>
      </AppProviders>
    </Router>
  );
}

export default App;
