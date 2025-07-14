// src/components/Dashboard/Layout.js
// Sesuaikan path import Sidebar dan Header jika struktur folder Anda berbeda
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notification, setNotification] = useState(null); // State notifikasi di Layout

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Fungsi untuk menutup notifikasi
  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} setNotification={setNotification} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        {/* === Perubahan di sini: Penambahan padding global pada main content === */}
        {/* Menambahkan 'p-6 md:p-8' untuk padding yang responsif */}
        {/* 'overflow-y-auto' untuk scrollable content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6 lg:p-8">
          {/* Notifikasi di sini */}
          {notification && (
            <div className={`mb-6 p-4 rounded-md flex justify-between items-center ${
              notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            } animate-fade-in shadow-md`}>
              <span>{notification.message}</span>
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