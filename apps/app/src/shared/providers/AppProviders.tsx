import { ReactNode } from 'react';
import { LiffProvider } from '@/shared/contexts/LiffContext';
import { RoleProvider } from '@/shared/contexts/RoleContext';
import { AddJobDialogProvider } from '@/shared/contexts/AddJobDialogContext';

type Props = { children: ReactNode };

export function AppProviders({ children }: Props) {
  return (
    <AddJobDialogProvider>
      <RoleProvider>
        <LiffProvider>
          {children}
        </LiffProvider>
      </RoleProvider>
    </AddJobDialogProvider>
  );
}