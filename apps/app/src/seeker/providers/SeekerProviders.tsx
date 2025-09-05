import { ReactNode } from 'react';
import { SeekerAuthProvider } from '../contexts/SeekerAuthContext';
import { SeekerLiffProvider } from '../contexts/SeekerLiffContext';

interface SeekerProvidersProps {
  children: ReactNode;
}

export const SeekerProviders: React.FC<SeekerProvidersProps> = ({ children }) => {
  return (
    <SeekerLiffProvider>
      <SeekerAuthProvider>
        {children}
      </SeekerAuthProvider>
    </SeekerLiffProvider>
  );
};
