// components/Header.js
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

export default function Header() {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <header className="w-full shadow-lg bg-white z-50">
      {/* Top section: Logo and School Name */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-start">
        <Link href="/" className="flex items-center gap-3 ">
          <Image
            src="/images/logo_sekolah.png"
            alt="SMKN 4 Mataram Logo"
            width={40}
            height={40}
            className="rounded bg-transparent "
            unoptimized
          />
          <span className="text-blue-900 text-xl font-bold">SMKN 4 Mataram</span>
        </Link>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-blue-800 text-white py-3">
        <div className="container mx-auto px-4 flex justify-center items-center">
          <nav>
            <ul className="flex gap-8 text-base font-medium">
              <li><Link href="/" className="hover:text-yellow-300 transition-colors">Beranda</Link></li>

              {/* Profile with Dropdown */}
              <li className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="hover:text-yellow-300 transition-colors focus:outline-none flex items-center gap-1"
                  aria-expanded={isProfileDropdownOpen}
                  aria-haspopup="true"
                >
                  Profile
                  <svg
                    className={`ml-1 h-4 w-4 transform transition-transform ${isProfileDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1_0_010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {isProfileDropdownOpen && (
                  <ul className="absolute left-0 mt-2 w-48 bg-white text-blue-800 rounded-md shadow-lg py-2 z-100">
                    <li>
                      <Link href="/profile/visi-misi" className="block px-4 py-2 hover:bg-blue-100 transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
                        Visi Misi
                      </Link>
                    </li>
                    {/* Link ke halaman Daftar Guru lengkap */}
                    <li>
                      <Link href="/daftar-guru" className="block px-4 py-2 hover:bg-blue-100 transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
                        Daftar Guru
                      </Link>
                    </li>
                    <li>
                      <Link href="/fasilitas" className="block px-4 py-2 hover:bg-blue-100 transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
                        Fasilitas
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile/ekstrakurikuler" className="block px-4 py-2 hover:bg-blue-100 transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
                        Ekstrakurikuler
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile/jurusan" className="block px-4 py-2 hover:bg-blue-100 transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
                        Jurusan
                      </Link>
                    </li>
                    {/* Prestasi mungkin juga sub-halaman dari profile */}
                    <li>
                      <Link href="/profile/prestasi" className="block px-4 py-2 hover:bg-blue-100 transition-colors" onClick={() => setIsProfileDropdownOpen(false)}>
                        Prestasi
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li><Link href="/pengumuman" className="hover:text-yellow-300 transition-colors">Pengumuman</Link></li>
              {/* Link ke halaman Artikel lengkap */}
              <li><Link href="/artikel" className="hover:text-yellow-300 transition-colors">Artikel</Link></li>
              <li><Link href="/contact" className="hover:text-yellow-300 transition-colors">Hubungi Kami</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}