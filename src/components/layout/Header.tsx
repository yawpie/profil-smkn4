import React, { useState, useRef, useEffect, FC } from 'react'; // Import FC for Functional Component typing
import Link from 'next/link';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const Header: FC = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  
  // Tipekan useRef dengan HTMLElement atau null
  const dropdownRef = useRef<HTMLLIElement>(null); // Ref untuk elemen li dropdown
  const mobileMenuRef = useRef<HTMLDivElement>(null); // Ref untuk div menu mobile

  // Fungsi untuk menutup dropdown dan menu mobile saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Pastikan event.target adalah Node sebelum menggunakan contains
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Dependensi kosong karena listener hanya perlu disetel sekali

  // Efek untuk mengubah header saat scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Dependensi kosong karena listener hanya perlu disetel sekali

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(prev => !prev); // Gunakan functional update
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev); // Gunakan functional update
  };

  return (
    <header className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ease-in-out
      ${isScrolled
        ? 'bg-gradient-to-r from-blue-700 to-blue-900 shadow-xl'
        : 'bg-transparent'
      }`}
    >
      {/* Bagian Atas: Logo dan Nama Sekolah */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo_sekolah.png"
            alt="SMKN 4 Mataram Logo"
            width={45}
            height={45}
            className="rounded-full bg-white p-1 shadow-md"
            unoptimized // Pertimbangkan apakah ini benar-benar diperlukan untuk gambar lokal
          />
          <span className={`text-xl md:text-2xl font-extrabold transition-colors duration-300 ease-in-out
            ${isScrolled ? 'text-white' : 'text-blue-900'}`}>
            SMKN 4 Mataram
          </span>
        </Link>

        {/* Hamburger Menu (Hanya di mobile) */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className={`p-2 rounded-md transition-colors duration-300 ease-in-out
              ${isScrolled ? 'text-white hover:bg-blue-600' : 'text-blue-900 hover:bg-gray-200'}`}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-7 w-7" />
            ) : (
              <Bars3Icon className="h-7 w-7" />
            )}
          </button>
        </div>

        {/* Navigasi Utama (Desktop) */}
        <nav className="hidden md:block">
          <ul className="flex gap-8 text-base font-medium">
            <li><Link href="/" className={`nav-link ${isScrolled ? 'text-white' : 'text-blue-900'}`}>Beranda</Link></li>

            {/* Profile dengan Dropdown */}
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={toggleProfileDropdown}
                className={`nav-link flex items-center gap-1 ${isScrolled ? 'text-white' : 'text-blue-900'}`}
                aria-expanded={isProfileDropdownOpen}
                aria-haspopup="true"
              >
                Profile
                <ChevronDownIcon className={`ml-1 h-4 w-4 transform transition-transform ${isProfileDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
              </button>

              {isProfileDropdownOpen && (
                <ul className="absolute left-1/2 -translate-x-1/2 mt-3 w-52 bg-white text-blue-800 rounded-lg shadow-xl py-2 z-50 animate-fade-in-down">
                  <li>
                    <Link href="/visi-misi" className="block px-4 py-2 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200" onClick={() => setIsProfileDropdownOpen(false)}>
                      Visi Misi
                    </Link>
                  </li>
                  <li>
                    <Link href="/daftar-guru" className="block px-4 py-2 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200" onClick={() => setIsProfileDropdownOpen(false)}>
                      Daftar Guru
                    </Link>
                  </li>
                  <li>
                    <Link href="/fasilitas" className="block px-4 py-2 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200" onClick={() => setIsProfileDropdownOpen(false)}>
                      Fasilitas
                    </Link>
                  </li>
                  <li>
                    <Link href="/ekskul" className="block px-4 py-2 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200" onClick={() => setIsProfileDropdownOpen(false)}>
                      Ekstrakurikuler
                    </Link>
                  </li>
                  <li>
                    <Link href="/jurusan" className="block px-4 py-2 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200" onClick={() => setIsProfileDropdownOpen(false)}>
                      Jurusan
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li><Link href="/pengumuman" className={`nav-link ${isScrolled ? 'text-white' : 'text-blue-900'}`}>Pengumuman</Link></li>
            <li><Link href="/artikel" className={`nav-link ${isScrolled ? 'text-white' : 'text-blue-900'}`}>Artikel</Link></li>
            <li><Link href="/kontak" className={`nav-link ${isScrolled ? 'text-white' : 'text-blue-900'}`}>Hubungi Kami</Link></li>
          </ul>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 left-0 w-full bg-gradient-to-br from-blue-700 to-blue-900 shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out md:hidden
          ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
        style={{ height: '100vh' }}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-white hover:bg-blue-600 focus:outline-none"
            aria-label="Close mobile menu"
          >
            <XMarkIcon className="h-8 w-8" />
          </button>
        </div>
        <nav className="px-8 py-4">
          <ul className="flex flex-col gap-6 text-xl text-white font-semibold">
            <li><Link href="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Beranda</Link></li>
            {/* Dropdown untuk Mobile */}
            <li className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="mobile-nav-link flex items-center justify-between w-full"
              >
                Profile
                <ChevronDownIcon className={`ml-1 h-6 w-6 transform transition-transform ${isProfileDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
              </button>
              {isProfileDropdownOpen && (
                <ul className="mt-2 pl-4 text-lg bg-white bg-opacity-10 rounded-md py-2 space-y-2 animate-fade-in-down">
                  <li><Link href="/visi-misi" className="block px-3 py-2 hover:text-yellow-300 transition-colors" onClick={() => { setIsMobileMenuOpen(false); setIsProfileDropdownOpen(false); }}>Visi Misi</Link></li>
                  <li><Link href="/daftar-guru" className="block px-3 py-2 hover:text-yellow-300 transition-colors" onClick={() => { setIsMobileMenuOpen(false); setIsProfileDropdownOpen(false); }}>Daftar Guru</Link></li>
                  <li><Link href="/fasilitas" className="block px-3 py-2 hover:text-yellow-300 transition-colors" onClick={() => { setIsMobileMenuOpen(false); setIsProfileDropdownOpen(false); }}>Fasilitas</Link></li>
                  <li><Link href="/ekstrakurikuler" className="block px-3 py-2 hover:text-yellow-300 transition-colors" onClick={() => { setIsMobileMenuOpen(false); setIsProfileDropdownOpen(false); }}>Ekstrakurikuler</Link></li>
                  <li><Link href="/jurusan" className="block px-3 py-2 hover:text-yellow-300 transition-colors" onClick={() => { setIsMobileMenuOpen(false); setIsProfileDropdownOpen(false); }}>Jurusan</Link></li>
                </ul>
              )}
            </li>
            <li><Link href="/pengumuman" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Pengumuman</Link></li>
            <li><Link href="/artikel" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Artikel</Link></li>
            <li><Link href="/contact" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Hubungi Kami</Link></li>
          </ul>
        </nav>
      </div>

      {/* Global styles untuk link navigasi */}
      {/* Jika Anda menggunakan Tailwind CSS, sebaiknya definisikan ini di file CSS global (misal: globals.css) */}
      <style jsx>{`
        .nav-link {
          /* Warna teks untuk desktop nav link saat tidak di-scroll */
          /* Default text-blue-900 atau text-white tergantung isScrolled */
          @apply hover:text-yellow-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50 px-2 py-1 rounded-md;
        }
        .mobile-nav-link {
          @apply block w-full text-white hover:text-yellow-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50 py-3 px-4 rounded-md;
        }
      `}</style>
    </header>
  );
};

export default Header;