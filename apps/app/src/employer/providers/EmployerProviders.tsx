import React, { ReactNode } from 'react';
import { EmployerLiffProvider } from '../contexts/EmployerLiffContext';
import { EmployerAuthProvider, useEmployerAuth } from '../contexts/EmployerAuthContext';

interface EmployerProvidersProps {
  children: ReactNode;
}

const EmployerProviders: React.FC<EmployerProvidersProps> = ({ children }) => {
  return (
    <EmployerLiffProvider>
      <EmployerAuthProvider>
        {children}
      </EmployerAuthProvider>
    </EmployerLiffProvider>
  );
};

export { useEmployerAuth };
export default EmployerProviders;
