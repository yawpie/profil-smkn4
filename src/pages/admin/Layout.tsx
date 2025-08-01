// src/app/dashboard/layout.tsx
"use client";

import React, { useState, FC, ReactNode } from "react";
import Sidebar from "../../components/Dashboard/Sidebar";
import Notification from "../../components/Dashboard/Notification";
import type { Notification as NotificationType } from '@/types/Notification';

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationType | null>(null);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-inter">
      {/* Komponen Sidebar yang akan selalu ada */}
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        setNotification={setNotification} // Meneruskan fungsi setNotification ke Sidebar
      />

      {/* Area konten utama tempat halaman anak akan dirender */}
      <main className="flex-1 overflow-y-auto">
        {children} {/* Ini adalah tempat halaman `src/app/dashboard/teachers/page.js` akan dirender */}
      </main>

      {/* Tampilan Notifikasi terpusat */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={dismissNotification}
        />
      )}
    </div>
  );
};

export default DashboardLayout;