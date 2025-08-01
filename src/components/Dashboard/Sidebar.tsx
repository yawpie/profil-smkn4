// src/components/Dashboard/Sidebar.tsx
"use client";

import React, { useState, useEffect, FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Notification } from "@/types/Notification";
import type { NavItem } from "@/types/Sidebar";
import { iconsSvg } from "@/icons/icons"; // Perhatikan path, pastikan sesuai dengan lokasi icons.tsx

type SidebarProps = {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setNotification: React.Dispatch<React.SetStateAction<Notification | null>>;
};

const Sidebar: FC<SidebarProps> = ({ isCollapsed, toggleSidebar, setNotification }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const pathname: string = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Definisikan navItems dengan menggunakan komponen SVG langsung dari iconsSvg
  const navItems: NavItem[] = [
    { href: "/dashboard/", label: "Dashboard Overview", icon: iconsSvg.DashboardIcon },
    { href: "/dashboard/admin-profile", label: "Profil Admin", icon: iconsSvg.UserIcon },
    { href: "/dashboard/teachers", label: "Daftar Guru", icon: iconsSvg.TeacherIcon },
    { href: "/dashboard/facilities", label: "Fasilitas", icon: iconsSvg.BuildingIcon }, // Menggunakan BuildingIcon untuk fasilitas
    { href: "/dashboard/extracurriculars", label: "Ekstrakurikuler", icon: iconsSvg.SportIcon }, // Menggunakan SportIcon untuk ekstrakurikuler
    { href: "/dashboard/majors", label: "Jurusan", icon: iconsSvg.AcademicCapIcon }, // Menggunakan AcademicCapIcon untuk jurusan
    { href: "/dashboard/announcements", label: "Pengumuman", icon: iconsSvg.MegaphoneIcon }, // Menggunakan MegaphoneIcon untuk pengumuman
    { href: "/dashboard/articles", label: "Artikel Sekolah", icon: iconsSvg.ArticleIcon },
  ];

  const sidebarWidthClass: string = isMounted
    ? (isCollapsed ? "w-20" : "w-64")
    : "w-64";

  // Kita akan membuat komponen kecil untuk merender ikon agar lebih rapi
  const IconComponent: React.FC<{ Icon: React.ElementType; className?: string }> = ({ Icon, className }) => (
    <Icon className={className} />
  );

  return (
    <aside
      className={`relative h-screen bg-blue-900 text-white transition-all duration-300 ease-in-out ${sidebarWidthClass} flex flex-col shadow-lg rounded-2xl m-4`}
    >
      {isMounted && (
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-[-1.25rem] transform translate-x-1/2 bg-blue-700 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg z-10 hidden md:block"
          title={isCollapsed ? "Perbesar Sidebar" : "Perkecil Sidebar"}
        >
          {/* Menggunakan komponen SVG langsung */}
          {isCollapsed ? (
            <iconsSvg.ChevronRightIcon className="h-5 w-5" />
          ) : (
            <iconsSvg.ChevronLeftIcon className="h-5 w-5" />
          )}
        </button>
      )}

      <div className={`p-6 flex items-center ${isCollapsed && isMounted ? "justify-center" : "justify-between"}`}>
        {isCollapsed && isMounted ? (
          // Menggunakan komponen SVG langsung
          <iconsSvg.MenuIcon className="h-5 w-5 text-blue-100" />
        ) : (
          <div className="text-xl font-bold text-blue-100 font-poppins">Admin Panel</div>
        )}
      </div>

      <nav className="flex-1 px-4 py-3">
        <ul>
          {navItems.map((item) => {
            const isActive: boolean = item.href === pathname ||
                                     (item.href === "/dashboard/" && pathname === "/dashboard");

            // Ambil komponen ikon dari item.icon
            const CurrentIcon = item.icon;

            return (
              <li key={item.href} className="mb-2">
                <Link
                  href={item.href}
                  className={`group flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 ease-in-out border-4 w-full text-left text-sm
                    ${
                      isActive
                        ? "bg-blue-700 text-white shadow-xl border-blue-600 transform scale-100"
                        : "text-blue-100 hover:bg-blue-800 hover:text-white border-transparent"
                    }
                    ${isCollapsed ? "justify-center" : ""}
                  `}
                >
                  <span className={`${isCollapsed ? "mx-auto" : "mr-3"} text-blue-100 group-hover:text-white transition-colors duration-200`}>
                    {/* Render komponen ikon secara langsung */}
                    <CurrentIcon className="h-5 w-5" />
                  </span>
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  {isCollapsed && (
                    <span className="text-xs absolute left-1/2 -translate-x-1/2 top-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-700 text-white px-2 py-1 rounded-md whitespace-nowrap hidden md:block z-20">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className={`px-4 pb-4 ${isCollapsed && isMounted ? "flex justify-center" : ""}`}>
        <button
          onClick={() => {
            setNotification({ message: "Anda telah logout! (Simulasi)", type: "success" });
          }}
          className={`w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 text-sm py-2
            ${isCollapsed && isMounted ? "w-12 h-12 rounded-full flex items-center justify-center relative" : ""}
            ${isCollapsed ? "group" : ""}
          `}
          title={isCollapsed && isMounted ? "Logout" : ""}
        >
          {isCollapsed && isMounted ? (
            // Menggunakan komponen SVG LogoutIcon langsung
            <iconsSvg.LogoutIcon className="h-5 w-5" />
          ) : (
            "Logout"
          )}
          {isCollapsed && isMounted && (
            <span className="text-xs absolute left-1/2 -translate-x-1/2 top-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-700 text-white px-2 py-1 rounded-md whitespace-nowrap hidden md:block z-20">Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;