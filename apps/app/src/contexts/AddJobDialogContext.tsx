import React, { createContext, useContext, useState, ReactNode } from 'react';
// This provider is now a no-op since we moved to full-page add job.

interface AddJobDialogContextType { openAddJobDialog: () => void }

const AddJobDialogContext = createContext<AddJobDialogContextType | undefined>(undefined);

export const useAddJobDialog = () => {
  const context = useContext(AddJobDialogContext);
  if (!context) {
    throw new Error('useAddJobDialog must be used within an AddJobDialogProvider');
  }
  return context;
};

export const AddJobDialogProvider = ({ children }: { children: ReactNode }) => {
  const openAddJobDialog = () => { window.location.href = '/employer/home' }

  return (
    <AddJobDialogContext.Provider value={{ openAddJobDialog }}>
      {children}
    </AddJobDialogContext.Provider>
  );
};