import React from 'react';
import { useEmployerAuth } from '../contexts/EmployerAuthContext';
import EmployerLogin from './EmployerLogin';
import LoadingScreen from '@/shared/components/LoadingScreen';

type Props = { children: React.ReactElement };

const RequireEmployerAuth: React.FC<Props> = ({ children }) => {
  const { isLoading, isAuthenticated } = useEmployerAuth();

  if (isLoading) {
    return <LoadingScreen title="กำลังตรวจสอบการเข้าสู่ระบบ..." subtitle="โปรดรอสักครู่" />;
  }

  if (!isAuthenticated) {
    return <EmployerLogin />;
  }

  return children;
};

export default RequireEmployerAuth;

