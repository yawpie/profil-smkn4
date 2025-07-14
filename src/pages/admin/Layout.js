// src/app/dashboard/layout.js
"use client";

import { useState } from "react";
// Pastikan jalur impor ini benar relatif terhadap layout.js
import Sidebar from "../../components/Dashboard/Sidebar";
import Notification from "../../components/Dashboard/Notification";

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notification, setNotification] = useState(null); // Status notifikasi terpusat untuk seluruh layout dashboard

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
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
}