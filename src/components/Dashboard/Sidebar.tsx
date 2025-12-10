"use client";

import React, { useState, useEffect, FC, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import type { Notification } from "@/types/Notification";
import type { NavItem } from "@/types/Sidebar";
import { iconsSvg } from "@/icons/icons";
import { apiGet, apiPost } from "@/utils/apiClient";

type SidebarProps = {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setNotification: React.Dispatch<React.SetStateAction<Notification | null>>;
};

const Sidebar: FC<SidebarProps> = ({ isCollapsed, toggleSidebar, setNotification }) => {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const sidebarRef = useRef<HTMLElement>(null);

  const collapsedWidthPx = 80;
  const expandedWidthPx = 280;
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

    window.addEventListener('resize', adjustSidebarScale);

    return () => {
      window.removeEventListener('resize', adjustSidebarScale);
    };
  }, [sidebarWidth]);

  const navItems: NavItem[] = [
    { href: "/dashboard/", label: "Dashboard Overview", icon: iconsSvg.DashboardIcon },
    { href: "/dashboard/admin-profile", label: "Profil Admin", icon: iconsSvg.UserIcon },
    { href: "/dashboard/teachers", label: "Daftar Guru", icon: iconsSvg.TeacherIcon },
    { href: "/dashboard/staff", label: "Daftar Staff", icon: iconsSvg.StaffIcon },
    { href: "/dashboard/facilities", label: "Fasilitas", icon: iconsSvg.BuildingIcon },
    { href: "/dashboard/extracurriculars", label: "Ekstrakurikuler", icon: iconsSvg.SportIcon },
    { href: "/dashboard/majors", label: "Jurusan", icon: iconsSvg.AcademicCapIcon },
    { href: "/dashboard/announcements", label: "Pengumuman", icon: iconsSvg.MegaphoneIcon },
    { href: "/dashboard/articles", label: "Artikel Sekolah", icon: iconsSvg.ArticleIcon },
    { href: "/dashboard/achievements", label: "Manajemen Prestasi", icon: iconsSvg.TrophyIcon },
    { href: "/dashboard/slides", label: "Manajemen Slides", icon: iconsSvg.ImageIcon },
  ];

  const handleLogout = async () => {
    try {
      await apiPost('/logout',{});
      router.push('/');

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
      ref={sidebarRef}
      animate={{ width: sidebarWidth }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white shadow-2xl  overflow-hidden flex flex-col justify-between backdrop-blur-xl border border-white/10`}
      style={{
        minWidth: sidebarWidth,
        maxWidth: sidebarWidth,
        flexShrink: 0,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #312e81 50%, #1e1b4b 75%, #0f172a 100%)',
      }}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="relative flex items-center justify-between px-4 py-4 border-b border-white/10">
        {isCollapsed ? (
          <></>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="font-bold text-white text-base tracking-tight">Admin Panel</h1>
              <p className="text-purple-300 text-xs font-medium">Management System</p>
            </div>
          </div>
        )}
        <motion.button
          onClick={toggleSidebar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="ml-auto bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-xl transition-all duration-200 border border-white/10"
          title={isCollapsed ? "Perbesar Sidebar" : "Perkecil Sidebar"}
        >
          {isCollapsed ? (
            <iconsSvg.ChevronRightIcon className="h-4 w-4" />
          ) : (
            <iconsSvg.ChevronLeftIcon className="h-4 w-4" />
          )}
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-1 relative">
        <div className="space-y-0.5 max-h-full overflow-y-auto modern-scrollbar pr-2">
          {navItems.map((item, index) => {
            const isActive =
              item.href === pathname ||
              (item.href === "/dashboard/" && pathname === "/dashboard") ||
              (item.href !== "/dashboard/" && pathname.startsWith(item.href));
            const CurrentIcon = item.icon;

            return (
              <motion.li 
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="list-none"
              >
                <Link
                  href={item.href}
                  className={`
                    group flex items-center relative
                    ${isCollapsed ? "justify-center p-2" : "justify-start py-1.5 px-2"}
                    rounded-md transition-all duration-300 ease-out
                    text-xs font-medium overflow-hidden
                    ${isActive 
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white shadow-lg border border-purple-400/30 backdrop-blur-sm" 
                      : "text-slate-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10 backdrop-blur-sm"
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-pink-400 rounded-r-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  {/* Icon with glow effect */}
                  <div className={`flex-shrink-0 ${isCollapsed ? "" : "mr-2"} relative`}>
                    <CurrentIcon className={`h-3.5 w-3.5 transition-all duration-300 ${isActive ? 'text-purple-300' : 'text-slate-400 group-hover:text-white'}`} />
                    {isActive && (
                      <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-sm" />
                    )}
                  </div>

                  {/* Label */}
                  {!isCollapsed && (
                    <span className="truncate font-medium tracking-wide">
                      {item.label}
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 py-2 px-4
                                     bg-slate-800/90 backdrop-blur-sm text-white text-sm font-medium rounded-xl
                                     opacity-0 group-hover:opacity-100 pointer-events-none
                                     transition-all duration-200 delay-300
                                     whitespace-nowrap z-50
                                     shadow-xl border border-white/10
                                     before:content-[''] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2
                                     before:border-4 before:border-transparent before:border-r-slate-800/90">
                      {item.label}
                    </div>
                  )}

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </motion.li>
            );
          })}
        </div>
      </nav>

      {/* Logout Section */}
      <div className="relative px-3 py-3 border-t border-white/10 flex justify-center">
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            ${isCollapsed ? "w-8 h-8 rounded-xl flex items-center justify-center relative group" : "w-full py-2.5 rounded-xl"}
            bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 
            text-white font-semibold transition-all duration-300
            text-sm shadow-lg hover:shadow-xl
            border border-red-400/30 backdrop-blur-sm
            relative overflow-hidden
          `}
          title={isCollapsed ? "Logout" : ""}
        >
          {/* Button glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative z-10 flex items-center justify-center">
            {isCollapsed ? (
              <iconsSvg.LogoutIcon className="h-4 w-4" />
            ) : (
              <div className="flex items-center space-x-2">
                <iconsSvg.LogoutIcon className="h-4 w-4" />
                <span>Logout</span>
              </div>
            )}
          </div>

          {/* Tooltip for collapsed logout */}
          {isCollapsed && (
            <div className="absolute left-full ml-4 py-2 px-4
                                     bg-red-600/90 backdrop-blur-sm text-white text-sm font-medium rounded-xl
                                     opacity-0 group-hover:opacity-100 pointer-events-none
                                     transition-all duration-200 delay-300
                                     whitespace-nowrap z-50
                                     shadow-xl border border-red-400/30
                                     before:content-[''] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2
                                     before:border-4 before:border-transparent before:border-r-red-600/90">
              Logout
            </div>
          )}
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;