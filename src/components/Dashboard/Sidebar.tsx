"use client";

import React, { useState, useEffect, FC, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import type { Notification } from "@/types/Notification";
import type { NavItem } from "@/types/Sidebar";
import { iconsSvg } from "@/icons/icons";

type SidebarProps = {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setNotification: React.Dispatch<React.SetStateAction<Notification | null>>;
};

const Sidebar: FC<SidebarProps> = ({ isCollapsed, toggleSidebar, setNotification }) => {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const sidebarRef = useRef<HTMLElement>(null); // Ref untuk elemen sidebar

  // Definisikan lebar sidebar dalam piksel (misalnya, 80px dan 240px)
  const collapsedWidthPx = 80;
  const expandedWidthPx = 240;
  const sidebarWidth = isCollapsed ? collapsedWidthPx : expandedWidthPx;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const adjustSidebarScale = () => {
      if (sidebarRef.current) {
          const viewportWidth = window.innerWidth;
      }
    };

    adjustSidebarScale();

    // Tambahkan event listener untuk resize (mungkin juga dipicu oleh zoom di beberapa browser)
    window.addEventListener('resize', adjustSidebarScale);

    // Cleanup event listener
    return () => {
      window.removeEventListener('resize', adjustSidebarScale);
    };
  }, [sidebarWidth]); // Dependensi pada sidebarWidth untuk re-kalkulasi saat ukuran berubah

  const navItems: NavItem[] = [
    { href: "/dashboard/", label: "Dashboard Overview", icon: iconsSvg.DashboardIcon },
    { href: "/dashboard/admin-profile", label: "Profil Admin", icon: iconsSvg.UserIcon },
    { href: "/dashboard/teachers", label: "Daftar Guru", icon: iconsSvg.TeacherIcon },
    { href: "/dashboard/facilities", label: "Fasilitas", icon: iconsSvg.BuildingIcon },
    { href: "/dashboard/extracurriculars", label: "Ekstrakurikuler", icon: iconsSvg.SportIcon },
    { href: "/dashboard/majors", label: "Jurusan", icon: iconsSvg.AcademicCapIcon },
    { href: "/dashboard/announcements", label: "Pengumuman", icon: iconsSvg.MegaphoneIcon },
    { href: "/dashboard/articles", label: "Artikel Sekolah", icon: iconsSvg.ArticleIcon },
    { href: "/dashboard/slides", label: "Manajemen Slides", icon: iconsSvg.ImageIcon },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch('http://192.168.236.15:3000/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        setNotification({ message: "Anda berhasil logout!", type: "success" });
        router.push('/');
      } else {
        const errorData = await response.json();
        setNotification({ message: errorData.message || "Gagal logout. Silakan coba lagi.", type: "error" });
      }
    } catch (error: any) {
      console.error("Error during logout:", error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        setNotification({
          message: "Koneksi ke server gagal. Pastikan server berjalan dan Anda terhubung ke jaringan yang benar.",
          type: "error"
        });
      } else {
        setNotification({
          message: error.message || "Terjadi kesalahan tidak terduga saat logout. Silakan coba lagi.",
          type: "error"
        });
      }
    }
  };

  return (
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`h-[calc(100vh-2rem)] bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-2xl rounded-2xl m-4 overflow-hidden flex flex-col justify-between`}
        style={{
          minWidth: sidebarWidth,
          maxWidth: sidebarWidth,
          flexShrink: 0, // <-- Jangan ikut mengecil saat zoom
        }}
      >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-blue-800">
        {isCollapsed ? (
          <div className="w-6 h-6 mx-auto"></div>
        ) : (
          <div className="font-extrabold text-blue-100 tracking-wide font-poppins text-[16px]">
            Admin Panel
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="ml-auto bg-blue-700 hover:bg-blue-600 text-white p-2 rounded-full transition duration-200"
          title={isCollapsed ? "Perbesar Sidebar" : "Perkecil Sidebar"}
        >
          {isCollapsed ? (
            <iconsSvg.ChevronRightIcon className="h-4 w-4" />
          ) : (
            <iconsSvg.ChevronLeftIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigasi */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto scrollbar-hidden">
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const isActive =
              item.href === pathname ||
              (item.href === "/dashboard/" && pathname === "/dashboard") ||
              (item.href !== "/dashboard/" && pathname.startsWith(item.href));
            const CurrentIcon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    group flex items-center
                    ${isCollapsed ? "justify-center p-2" : "justify-start py-2 px-4"}
                    rounded-lg transition-all duration-200
                    border w-full text-left text-[14px] font-medium
                    ${isActive ? "bg-blue-700 text-white shadow border-blue-500" : "text-blue-200 hover:bg-blue-800 hover:text-white border-transparent"}
                    relative overflow-hidden
                  `}
                >
                  <span className={`flex-shrink-0 ${isCollapsed ? "" : "mr-3"}`}>
                    <CurrentIcon className="h-5 w-5" />
                  </span>

                  {!isCollapsed && (
                    <span className="truncate text-white text-[14px]">
                      {item.label}
                    </span>
                  )}

                  {isCollapsed && (
                    <span className="absolute left-full ml-3 py-1 px-3
                                          bg-blue-700 text-white text-xs font-medium rounded-md
                                          opacity-0 group-hover:opacity-100
                                          transition-opacity duration-200
                                          whitespace-nowrap z-20
                                          shadow-md hidden md:block">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Tombol Logout */}
      <div className={`px-4 py-4 border-t border-blue-800 ${isCollapsed ? "flex justify-center" : ""}`}>
        <button
          onClick={handleLogout}
          className={`
            ${isCollapsed ? "w-12 h-12 rounded-full flex items-center justify-center relative group" : "w-full"}
            bg-red-700 hover:bg-red-600 text-white font-semibold transition-colors duration-200
            text-sm py-2 rounded-lg shadow-md
          `}
          title={isCollapsed ? "Logout" : ""}
        >
          {isCollapsed ? <iconsSvg.LogoutIcon className="h-5 w-5" /> : "Logout"}
          {isCollapsed && (
            <span className="absolute left-full ml-3 py-1 px-3
                                          bg-red-700 text-white text-xs font-medium rounded-md
                                          opacity-0 group-hover:opacity-100
                                          transition-opacity duration-200
                                          whitespace-nowrap z-20
                                          shadow-md hidden md:block">
              Logout
            </span>
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;