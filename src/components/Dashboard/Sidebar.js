// src/components/Dashboard/Sidebar.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// --- KOMPONEN ICON (tidak ada perubahan) ---
const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
);
const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
);
const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
);
const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H5a3 3 0 01-3-3V7a3 3 0 013-3h5a3 3 0 013 3v1" /></svg>
);
const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l7 7 7 7M19 10v10a1 1 0 01-1 1h-3m-7 0a2 2 0 11-4 0h4zm0 0V9m0 6a2 2 0 11-4 0h4zm0 0v-4" /></svg>
);
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const TeacherIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 10a6 6 0 00-12 0v2H3a1 1 0 00-1 1v6a1 1 0 001 1h18a1 1 0 001-1v-6a1 1 0 00-1-1h-3v-2z" /></svg>
);
const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
);
const SportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13a4 4 0 110-8 4 4 0 010 8zM19 21a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2h10a2 2 0 012 2v12zM15 3h.01M19 7h.01" /></svg>
);
const AcademicCapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM12 4a8 8 0 00-8 8c0 2.21 1.79 4 4 4v3h8v-3c2.21 0 4-1.79 4-4a8 8 0 00-8-8z" /></svg>
);
const MegaphoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.86c-2.45-1.12-5.45-1.12-7.9 0l-2.12 1.06c-1.16.58-1.16 2.08 0 2.66l2.12 1.06c2.45 1.12 5.45 1.12 7.9 0l2.12-1.06c1.16-.58 1.16-2.08 0-2.66L11 5.86zM13 14h8V8h-8v6z" /></svg>
);
const ArticleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);
// --- AKHIR KOMPONEN ICON ---

export default function Sidebar({ isCollapsed, toggleSidebar, setNotification }) {
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const navItems = [
        { href: "/dashboard/data_view", label: "Dashboard Overview", icon: DashboardIcon },
        { href: "/dashboard/admin-profile", label: "Profil Admin", icon: UserIcon },
        { href: "/dashboard/teachers", label: "Daftar Guru", icon: TeacherIcon },
        { href: "/dashboard/facilities", label: "Fasilitas", icon: BuildingIcon },
        { href: "/dashboard/extracurriculars", label: "Ekstrakurikuler", icon: SportIcon },
        { href: "/dashboard/majors", label: "Jurusan", icon: AcademicCapIcon },
        { href: "/dashboard/announcements", label: "Pengumuman", icon: MegaphoneIcon },
        { href: "/dashboard/articles", label: "Artikel Sekolah", icon: ArticleIcon },
    ];

    const sidebarWidthClass = isMounted
        ? (isCollapsed ? "w-20" : "w-64")
        : "w-64";

    return (
        <aside
            className={`relative h-screen bg-blue-900 text-white transition-all duration-300 ease-in-out ${sidebarWidthClass} flex flex-col shadow-lg rounded-2xl m-4`}
        >
            {/* Tombol Ciutkan/Perluas */}
            {isMounted && (
                <button
                    onClick={toggleSidebar}
                    className="absolute top-4 right-[-1.25rem] transform translate-x-1/2 bg-blue-700 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg z-10 hidden md:block"
                    title={isCollapsed ? "Perbesar Sidebar" : "Perkecil Sidebar"}
                >
                    {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </button>
            )}

            <div className={`p-6 flex items-center ${isCollapsed && isMounted ? "justify-center" : "justify-between"}`}>
                {isCollapsed && isMounted ? (
                    <MenuIcon className="h-5 w-5 text-blue-100" />
                ) : (
                    <div className="text-xl font-bold text-blue-100 font-poppins">Admin Panel</div>
                )}
            </div>

            {/* Navigasi Utama */}
            <nav className="flex-1 px-4 py-3">
                <ul>
                    {navItems.map((item) => {
                        // === PERBAIKAN LOGIKA DI SINI ===
                        const isActive = item.href === pathname ||
                                         (item.href === "/dashboard/data_view" && pathname === "/dashboard"); // Hanya aktifkan dashboard overview jika di root dashboard

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
                                    {item.icon && (
                                        <span className={`${isCollapsed ? "mx-auto" : "mr-3"} text-blue-100 group-hover:text-white transition-colors duration-200`}>
                                            {item.icon()}
                                        </span>
                                    )}
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

            {/* Tombol Logout */}
            <div className={`px-4 pb-4 ${isCollapsed && isMounted ? "flex justify-center" : ""}`}>
                <button
                    onClick={() => {
                        setNotification({ message: "Anda telah logout! (Simulasi)", type: "success" });
                        // Di aplikasi nyata, Anda mungkin akan mengarahkan ulang ke halaman login
                        // Contoh: window.location.href = "/";
                    }}
                    className={`w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 text-sm py-2
            ${isCollapsed && isMounted ? "w-12 h-12 rounded-full flex items-center justify-center" : ""}
            ${isCollapsed ? "group" : ""}
          `}
                    title={isCollapsed && isMounted ? "Logout" : ""}
                >
                    {isCollapsed && isMounted ? (
                        <LogoutIcon className="text-white" />
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
}