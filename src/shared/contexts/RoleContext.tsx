import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'seeker' | 'employer' | null;

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isSeeker: boolean;
  isEmployer: boolean;
  hasRole: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    // Load role from localStorage on initialization
    try {
      const savedRole = localStorage.getItem('user_role');
      return (savedRole as UserRole) || null;
    } catch (error) {
      console.error('Error loading role from localStorage:', error);
      return null;
    }
  });

  const isSeeker = role === 'seeker';
  const isEmployer = role === 'employer';
  const hasRole = role !== null;

  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole) {
      localStorage.setItem('user_role', newRole);
    } else {
      localStorage.removeItem('user_role');
    }
  };

  const value = {
    role,
    setRole: handleSetRole,
    isSeeker,
    isEmployer,
    hasRole,
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}; 