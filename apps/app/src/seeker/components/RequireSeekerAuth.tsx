import React from 'react';
import { useSeekerAuth } from '../contexts/SeekerAuthContext';
import SeekerLogin from './SeekerLogin';
import LoadingScreen from '@/shared/components/LoadingScreen';

type Props = { children: React.ReactElement };

const RequireSeekerAuth: React.FC<Props> = ({ children }) => {
  const { isLoading, isAuthenticated } = useSeekerAuth();

  if (isLoading) {
    return <LoadingScreen title="กำลังตรวจสอบการเข้าสู่ระบบ..." subtitle="โปรดรอสักครู่" />;
  }

  if (!isAuthenticated) {
    return <SeekerLogin />;
  }

  return children;
};

export default RequireSeekerAuth;

