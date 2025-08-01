import React, { useState, FC, ReactNode, Dispatch, SetStateAction } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import type { Notification } from '@/types/Notification';

type LayoutProps = {
  children: ReactNode;
  setNotification?: Dispatch<SetStateAction<Notification | null>>;
  notification?: Notification | null;
};

const Layout: FC<LayoutProps> = ({ children, setNotification, notification }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [internalNotification, setInternalNotification] = useState<Notification | null>(null);

  const effectiveSetNotification: Dispatch<SetStateAction<Notification | null>> =
    setNotification ?? setInternalNotification;
  const effectiveNotification = notification ?? internalNotification;

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const closeNotification = () => {
    effectiveSetNotification(null);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        setNotification={effectiveSetNotification}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6 lg:p-8">
          {effectiveNotification && (
            <div
              className={`mb-6 p-4 rounded-md flex justify-between items-center ${
                effectiveNotification.type === 'success'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              } animate-fade-in shadow-md`}
            >
              <span>{effectiveNotification.message}</span>
              <button onClick={closeNotification} className="text-current font-bold ml-4">
                &times;
              </button>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
