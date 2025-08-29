import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useLiff } from './contexts/LiffContext';
import { AppProviders } from '@/providers/AppProviders';
import LineLogin from './components/shared/LineLogin';
import SeekerProfilePage from './pages/seeker/SeekerProfilePage';
import SeekerProfileEditPage from './pages/seeker/SeekerProfileEditPage';
import SeekerWallet from './components/seeker/SeekerWallet';
import SeekerMyShifts from './components/seeker/SeekerMyShifts';
import Onboarding from './components/shared/Onboarding';
import SeekerJobDetail from './components/seeker/SeekerJobDetail';
import SeekerJobFeed from './components/seeker/SeekerJobFeed';
import SeekerHome from './pages/seeker/SeekerHome';
import SeekerChatPage from './components/seeker/SeekerChatPage';
import SettingsPage from './pages/shared/SettingsPage';
import SeekerChatHistoryPage from './pages/seeker/SeekerChatHistoryPage';
import NotificationsPage from './pages/shared/NotificationsPage';
import SeekerFullTimeJobs from './pages/seeker/SeekerFullTimeJobs';
import LineCallback from './components/shared/LineCallback';
import LiffHandler from './components/shared/LiffHandler';
import EmployerHome from './pages/employer/EmployerHome';
import EmployerChatHistoryPage from './pages/employer/EmployerChatHistoryPage';
import EmployerChatPage from './pages/employer/EmployerChatPage';
import EmployerMyJobsPage from './pages/employer/EmployerMyJobsPage';
import EmployerNotificationsPage from './pages/employer/EmployerNotificationsPage';
import EmployerProfile from './pages/employer/EmployerProfile';
import RoleSelection from './pages/shared/RoleSelection';
import MapView from './pages/shared/MapView';
import EmployerEditProfilePage from './pages/employer/EmployerEditProfilePage';
import EmployerTeamManagementPage from './pages/employer/EmployerTeamManagementPage';
import EmployerBillingPage from './pages/employer/EmployerBillingPage';
import EmployerSecurityPage from './pages/employer/EmployerSecurityPage';
import SupportPage from './pages/shared/SupportPage';
import EmployerLayout from './pages/employer/EmployerLayout';
import EmployerAddJob from './pages/employer/EmployerAddJob';
import NotFound from './pages/shared/NotFound';
import SeekerLayout from './pages/seeker/SeekerLayout';
import AppLayout from './components/shared/AppLayout';
import ChangeEmailPage from './pages/ChangeEmailPage';
import RoleLayoutWrapper from './components/shared/RoleLayoutWrapper';
import EmployerJobApplicants from './pages/employer/EmployerJobApplicants';
import EmployerApplicantProfilePage from './pages/employer/EmployerApplicantProfilePage';
import EmployerJobDetail from './pages/employer/EmployerJobDetail';
import { JobProvider } from './contexts/JobContext';
import EmployerJobSchedule from './pages/employer/EmployerJobSchedule';
// import EmployerJobPublish from './pages/employer/EmployerJobPublish.tsx';
import EmployerJobUpload from './pages/employer/EmployerJobUpload.tsx';
import EmployerJobWage from './pages/employer/EmployerJobWage';
import EmployerJobSummary from './pages/employer/EmployerJobSummary';
import SeekerOtpVerification from './pages/seeker/apply/SeekerOtpVerification';
import OnboardingFlow from './pages/shared/OnboardingFlow';
import SeekerEkycId from './pages/seeker/apply/SeekerEkycId';
import SeekerEkycFace from './pages/seeker/apply/SeekerEkycFace';
import SeekerBidPrice from './pages/seeker/apply/SeekerBidPrice';
import EmployerSeekerSelection from './pages/employer/EmployerSeekerSelection';
import EmployerSeekerProfile from './pages/employer/EmployerSeekerProfile';
import EmployerLogin from './components/shared/EmployerLogin';
import SeekerLogin from './components/shared/SeekerLogin';
// import SplashScreen from './components/shared/SplashScreen'; // เอาออกแล้ว

const AppContent = () => {
  const { user } = useAuth(); // เอา isLoading ออกไปเลยเพราะไม่ใช้แล้ว
  const navigate = useNavigate();
  const location = useLocation();
  // เอา isLiffLoading ออกไปเลยเพราะไม่ใช้แล้ว

  useEffect(() => {
    // Only redirect to role-selection if:
    // 1. On root path AND no user
    // 2. NOT currently in authentication flow (callback, login pages)
    const isAuthFlow = location.pathname.includes('/callback') || 
                      location.pathname.includes('/login') ||
                      location.pathname.includes('/home');
    
    if (location.pathname === '/' && !user && !isAuthFlow) {
      navigate('/role-selection', { replace: true });
    }
  }, [navigate, user, location.pathname]);

  // เอา SplashScreen ออก - ให้แสดง page ปกติเลยแม้ระหว่างโหลด

  const protectedRoute = (element: React.ReactElement, role: 'seeker' | 'employer' | 'any' = 'any') => {
    if (!user) {
      if (role === 'seeker') {
        return <Navigate to="/seeker/login" replace />;
      }
      if (role === 'employer') {
        return <Navigate to="/employer/login" replace />;
      }
      return <Navigate to="/role-selection" replace />;
    }
    return element;
  };

  return (
    <Routes>
      {/* Root and Shared Routes */}
      <Route path="/" element={<Navigate to="/role-selection" replace />} />
      <Route path="/seeker/login" element={<AppLayout><SeekerLogin /></AppLayout>} />
      <Route path="/employer/login" element={<AppLayout><EmployerLogin onLoginSuccess={() => navigate('/employer/profile')} /></AppLayout>} />
      <Route path="/callback" element={<AppLayout><LineCallback /></AppLayout>} />
      
      {/* LIFF Routes - Handle LIFF authentication */}
      <Route path="/seeker/home" element={<LiffHandler role="seeker" targetPath="/seeker/dashboard" />} />
      <Route path="/employer/home" element={<LiffHandler role="employer" targetPath="/employer/dashboard" />} />
      
      {/* Protected routes with specific layouts */}
      <Route path="/role-selection" element={<AppLayout><RoleSelection /></AppLayout>} />
      <Route path="/onboarding" element={protectedRoute(<AppLayout><Onboarding /></AppLayout>)} />
      
      {/* These shared pages now get the correct role-based navbar */}
      <Route path="/settings" element={protectedRoute(<RoleLayoutWrapper><SettingsPage /></RoleLayoutWrapper>)} />
      <Route path="/support" element={protectedRoute(<RoleLayoutWrapper><SupportPage /></RoleLayoutWrapper>)} />
      <Route path="/change-email" element={protectedRoute(<RoleLayoutWrapper><ChangeEmailPage /></RoleLayoutWrapper>)} />
      
      <Route path="/map-view" element={<MapView />} />
      
      {/* Seeker Routes wrapped in SeekerLayout - All Protected */}
      <Route path="/seeker/dashboard" element={protectedRoute(<SeekerLayout><SeekerHome /></SeekerLayout>, 'seeker')} />
      <Route path="/seeker/profile" element={protectedRoute(<SeekerLayout><SeekerProfilePage /></SeekerLayout>, 'seeker')} />
      <Route path="/seeker/profile/edit" element={protectedRoute(<SeekerLayout><SeekerProfileEditPage /></SeekerLayout>, 'seeker')} />
      <Route path="/seeker/wallet" element={protectedRoute(<SeekerLayout><SeekerWallet /></SeekerLayout>, 'seeker')} />
      <Route path="/seeker/my-shifts" element={protectedRoute(<SeekerLayout><SeekerMyShifts /></SeekerLayout>, 'seeker')} />
      <Route path="/seeker/job/:id" element={protectedRoute(<SeekerLayout><SeekerJobDetail /></SeekerLayout>, 'seeker')} />
      <Route path="/seeker/jobs" element={protectedRoute(<SeekerLayout><SeekerJobFeed /></SeekerLayout>, 'seeker')} />
      <Route path="/seeker/full-time-jobs" element={protectedRoute(<SeekerLayout><SeekerFullTimeJobs /></SeekerLayout>, 'seeker')} />
      <Route path="/seeker/chat" element={protectedRoute(<SeekerLayout><SeekerChatHistoryPage /></SeekerLayout>, 'seeker')} />
      <Route path="/seeker/chat/:id" element={protectedRoute(<SeekerLayout><SeekerChatPage /></SeekerLayout>, 'seeker')} />
      <Route path="/seeker/notifications" element={protectedRoute(<SeekerLayout><NotificationsPage /></SeekerLayout>, 'seeker')} />
      
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
      <Route path="/seeker/apply/otp" element={protectedRoute(<SeekerLayout><SeekerOtpVerification /></SeekerLayout>, 'seeker')} />
      {/* select-category removed per request */}
      <Route path="/seeker/apply/ekyc-id" element={protectedRoute(<SeekerLayout><SeekerEkycId /></SeekerLayout>, 'seeker')} />
      <Route path="/seeker/apply/ekyc-face" element={protectedRoute(<SeekerLayout><SeekerEkycFace /></SeekerLayout>, 'seeker')} />
      <Route path="/seeker/apply/bid" element={protectedRoute(<SeekerLayout><SeekerBidPrice /></SeekerLayout>, 'seeker')} />
      
      {/* Employer Routes: home is the Add Job page, my-jobs is the job list - All Protected */}
      <Route path="/employer/dashboard" element={protectedRoute(<EmployerLayout><EmployerAddJob /></EmployerLayout>, 'employer')} />
      <Route path="/employer/add-job" element={<Navigate to="/employer/dashboard" replace />} />
      <Route path="/employer/my-jobs" element={protectedRoute(<EmployerLayout><EmployerMyJobsPage /></EmployerLayout>, 'employer')} />
      <Route path="/employer/job/:jobId/seekers" element={protectedRoute(<EmployerLayout><EmployerSeekerSelection /></EmployerLayout>, 'employer')} />
      <Route path="/employer/seeker/:seekerId/profile" element={protectedRoute(<EmployerLayout><EmployerSeekerProfile /></EmployerLayout>, 'employer')} />
      <Route path="/employer/job/:jobId/detail" element={protectedRoute(<EmployerLayout><EmployerJobDetail /></EmployerLayout>, 'employer')} />
      <Route path="/employer/job/:jobId/applicants" element={protectedRoute(<EmployerLayout><EmployerJobApplicants /></EmployerLayout>, 'employer')} />
      <Route path="/employer/applicant/:applicantId" element={protectedRoute(<EmployerLayout><EmployerApplicantProfilePage /></EmployerLayout>, 'employer')} />
      <Route path="/employer/chat" element={protectedRoute(<EmployerLayout><EmployerChatHistoryPage /></EmployerLayout>, 'employer')} />
      <Route path="/employer/chat/:id" element={protectedRoute(<EmployerLayout><EmployerChatPage /></EmployerLayout>, 'employer')} />
      <Route path="/employer/notifications" element={protectedRoute(<EmployerLayout><EmployerNotificationsPage /></EmployerLayout>, 'employer')} />
      <Route path="/employer/profile" element={protectedRoute(<EmployerLayout><EmployerProfile /></EmployerLayout>, 'employer')} />
      <Route path="/employer/edit-profile" element={protectedRoute(<EmployerLayout><EmployerEditProfilePage /></EmployerLayout>, 'employer')} />
      <Route path="/employer/team" element={protectedRoute(<EmployerLayout><EmployerTeamManagementPage /></EmployerLayout>, 'employer')} />
      <Route path="/employer/billing" element={protectedRoute(<EmployerLayout><EmployerBillingPage /></EmployerLayout>, 'employer')} />
      <Route path="/employer/security" element={protectedRoute(<EmployerLayout><EmployerSecurityPage /></EmployerLayout>, 'employer')} />
      <Route path="/employer/job-schedule" element={protectedRoute(<EmployerLayout><EmployerJobSchedule /></EmployerLayout>, 'employer')} />
      <Route path="/employer/job-wage" element={protectedRoute(<EmployerLayout><EmployerJobWage /></EmployerLayout>, 'employer')} />
      {/* <Route path="/employer/job-publish" element={<EmployerJobPublish />} /> */}
      <Route path="/employer/job-upload" element={protectedRoute(<EmployerJobUpload />, 'employer')} />
      <Route path="/employer/job-summary" element={protectedRoute(<EmployerLayout><EmployerJobSummary /></EmployerLayout>, 'employer')} />
      <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppProviders>
        <JobProvider>
          <AppContent />
        </JobProvider>
      </AppProviders>
    </Router>
  );
}

export default App;