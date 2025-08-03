"use client";

import React, { useState, useEffect, FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const sidebarWidth = isCollapsed ? 80 : 240;

  return (
    <motion.aside
      animate={{ width: sidebarWidth }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-2xl rounded-2xl m-4 overflow-hidden flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-blue-800">
        {isCollapsed ? (
          <iconsSvg.MenuIcon className="h-6 w-6 text-blue-200 mx-auto" />
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

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto scrollbar-hidden">
        <ul className="space-y-1">
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

      {/* Logout */}
      <div className={`px-4 py-4 border-t border-blue-800 ${isCollapsed ? "flex justify-center" : ""}`}>
        <button
          onClick={() => {
            setNotification({ message: "Anda telah logout! (Simulasi)", type: "success" });
          }}
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
