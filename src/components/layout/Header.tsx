import React, { useState, useRef, useEffect, FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const Header: FC = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLLIElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
  }, []);

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
  }, []);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(prev => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  return (
    <header className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ease-in-out font-sans
      ${isScrolled
        ? 'bg-gradient-to-r from-blue-700 to-indigo-900 shadow-2xl py-2'
        : 'bg-transparent py-4 shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo_sekolah.png"
            alt="SMKN 4 Mataram Logo"
            width={40}
            height={40}
            className="rounded-full bg-white p-0.5 shadow-md"
            unoptimized
          />
          <span className={`text-lg md:text-xl font-extrabold transition-colors duration-300 ease-in-out
            ${isScrolled ? 'text-white' : 'text-blue-950'}`}>
            SMKN 4 Mataram
          </span>
        </Link>

        {/* Hamburger Menu (Hanya di mobile) */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className={`p-2 rounded-lg transition-colors duration-300 ease-in-out
              ${isScrolled ? 'text-white hover:bg-blue-600/70' : 'text-blue-900 hover:bg-gray-100/50'}`}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Navigasi Utama (Desktop) */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm font-medium">
            <li><Link href="/" className={`nav-link ${isScrolled ? 'text-white' : 'text-blue-950'}`}>Beranda</Link></li>

            {/* Profile dengan Dropdown */}
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={toggleProfileDropdown}
                className={`nav-link flex items-center gap-1 ${isScrolled ? 'text-white' : 'text-blue-950'}`}
                aria-expanded={isProfileDropdownOpen}
                aria-haspopup="true"
              >
                Profile
                <ChevronDownIcon className={`ml-0.5 h-4 w-4 transform transition-transform ${isProfileDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
              </button>

              {isProfileDropdownOpen && (
                <ul className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white text-blue-800 rounded-lg shadow-xl py-1.5 z-50 animate-fade-in-down border border-blue-100">
                  <li>
                    <Link href="/visi-misi" className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200" onClick={() => setIsProfileDropdownOpen(false)}>
                      Visi Misi
                    </Link>
                  </li>
                  <li>
                    <Link href="/daftar-guru" className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200" onClick={() => setIsProfileDropdownOpen(false)}>
                      Daftar Guru
                    </Link>
                  </li>
                  <li>
                    <Link href="/fasilitas" className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200" onClick={() => setIsProfileDropdownOpen(false)}>
                      Fasilitas
                    </Link>
                  </li>
                  <li>
                    <Link href="/ekstrakurikuler" className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200" onClick={() => setIsProfileDropdownOpen(false)}>
                      Ekstrakurikuler
                    </Link>
                  </li>
                  <li>
                    <Link href="/jurusan" className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200" onClick={() => setIsProfileDropdownOpen(false)}>
                      Jurusan
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li><Link href="/pengumuman" className={`nav-link ${isScrolled ? 'text-white' : 'text-blue-950'}`}>Pengumuman</Link></li>
            <li><Link href="/artikel" className={`nav-link ${isScrolled ? 'text-white' : 'text-blue-950'}`}>Artikel</Link></li>
            <li><Link href="/kontak" className={`nav-link ${isScrolled ? 'text-white' : 'text-blue-950'}`}>Hubungi Kami</Link></li>
          </ul>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 left-0 w-full bg-gradient-to-br from-blue-800 to-indigo-950 shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out md:hidden
          ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
        style={{ height: '100vh' }}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-white hover:bg-blue-600 focus:outline-none"
            aria-label="Close mobile menu"
          >
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>
        <nav className="px-6 py-4">
          <ul className="flex flex-col gap-4 text-lg text-white font-medium">
            <li><Link href="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Beranda</Link></li>
            {/* Dropdown untuk Mobile */}
            <li className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="mobile-nav-link flex items-center justify-between w-full"
              >
                Profile
                <ChevronDownIcon className={`ml-1 h-5 w-5 transform transition-transform ${isProfileDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
              </button>
              {isProfileDropdownOpen && (
                <ul className="mt-2 pl-4 text-base bg-white bg-opacity-10 rounded-md py-1.5 space-y-1 animate-fade-in-down">
                  <li><Link href="/visi-misi" className="block px-3 py-2 hover:text-blue-300 transition-colors" onClick={() => { setIsMobileMenuOpen(false); setIsProfileDropdownOpen(false); }}>Visi Misi</Link></li>
                  <li><Link href="/daftar-guru" className="block px-3 py-2 hover:text-blue-300 transition-colors" onClick={() => { setIsMobileMenuOpen(false); setIsProfileDropdownOpen(false); }}>Daftar Guru</Link></li>
                  <li><Link href="/fasilitas" className="block px-3 py-2 hover:text-blue-300 transition-colors" onClick={() => { setIsMobileMenuOpen(false); setIsProfileDropdownOpen(false); }}>Fasilitas</Link></li>
                  <li><Link href="/ekstrakurikuler" className="block px-3 py-2 hover:text-blue-300 transition-colors" onClick={() => { setIsMobileMenuOpen(false); setIsProfileDropdownOpen(false); }}>Ekstrakurikuler</Link></li>
                  <li><Link href="/jurusan" className="block px-3 py-2 hover:text-blue-300 transition-colors" onClick={() => { setIsMobileMenuOpen(false); setIsProfileDropdownOpen(false); }}>Jurusan</Link></li>
                </ul>
              )}
            </li>
            <li><Link href="/pengumuman" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Pengumuman</Link></li>
            <li><Link href="/artikel" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Artikel</Link></li>
            <li><Link href="/kontak" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Hubungi Kami</Link></li>
          </ul>
        </nav>
      </div>

      <style jsx>{`
        .nav-link {
          @apply relative transition-colors duration-300 ease-in-out px-2 py-1 rounded-md;
        }

        /* Hover dan Focus efek untuk desktop nav link */
        .nav-link::after {
          content: '';
          @apply absolute left-0 bottom-0 h-[2px] bg-white w-0 transition-all duration-300 ease-in-out;
        }

        .nav-link:hover::after,
        .nav-link:focus::after {
          @apply w-full;
        }

        /* Adjust text color for transparent state for nav-link directly */
        header:not(.bg-gradient-to-r) .nav-link {
          @apply text-blue-950;
        }
        
        /* Special hover/focus for transparent state */
        header:not(.bg-gradient-to-r) .nav-link:hover,
        header:not(.bg-gradient-to-r) .nav-link:focus {
          @apply text-blue-700;
        }
        
        header:not(.bg-gradient-to-r) .nav-link::after {
          content: '';
          @apply bg-blue-700;
        }

        .mobile-nav-link {
          @apply block w-full text-white font-medium hover:text-blue-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 py-2.5 px-3 rounded-md;
        }
      `}</style>
    </header>
  );
};

export default Header;
