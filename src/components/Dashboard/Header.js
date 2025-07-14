// src/components/Dashboard/Header.js
"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState("Dashboard");

  useEffect(() => {
    const getTitleFromPathname = (path) => {
      switch (path) {
        case '/dashboard/data_view':
          return 'Dashboard Overview';
        case '/dashboard/admin-profile':
          return 'Profil Admin'; // <-- PASTIKAN BARIS INI ADA
        case '/dashboard/teachers':
          return 'Daftar Guru';
        case '/dashboard/facilities':
          return 'Manajemen Fasilitas';
        case '/dashboard/extracurriculars':
          return 'Manajemen Ekstrakurikuler';
        case '/dashboard/majors':
          return 'Manajemen Jurusan';
        case '/dashboard/announcements':
          return 'Manajemen Pengumuman';
        case '/dashboard/articles':
          return 'Manajemen Artikel Sekolah';
        default:
          return 'Dashboard Admin';
      }
    };

    setPageTitle(getTitleFromPathname(pathname));
  }, [pathname]);

  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between border-b border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800">{pageTitle}</h2>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <img
            className="h-10 w-10 rounded-full object-cover mr-2 shadow-sm"
            src="https://via.placeholder.com/40/2196F3/FFFFFF?text=AD"
            alt="Admin Avatar"
          />
          <span className="text-gray-700 font-medium hidden sm:block">Admin Sekolah</span>
        </div>
      </div>
    </header>
  );
};

export default Header;