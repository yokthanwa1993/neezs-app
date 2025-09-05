import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

const AppLayout = ({ children, footer }: { children?: ReactNode, footer?: ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#F3F4F6] flex justify-center">
      <div className="w-full max-w-mobile-lg min-h-screen shadow-xl flex flex-col">
        <main className="flex-1 overflow-y-auto">
          {children ?? <Outlet />}
        </main>
        {footer}
      </div>
    </div>
  );
};

export default AppLayout;
