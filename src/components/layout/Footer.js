import Link from 'next/link';
import Image from 'next/image'; // Import Image component if you plan to use an image logo
import { FaPhone, FaEnvelope, FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa'; // Added FaWhatsapp for a more common contact method

export default function Footer() {
  const currentYear = new Date().getFullYear(); // Get current year dynamically

  return (
    <footer className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white pt-16 pb-8 border-t border-blue-800 shadow-inner-top">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Logo and Description */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="flex items-center mb-4 group">
              {/* If you have a school logo image, uncomment and use this */}
              {/* <Image src="/images/smkn4_logo.png" alt="SMKN 4 Mataram Logo" width={50} height={50} className="mr-3 filter grayscale hover:grayscale-0 transition-all duration-300" /> */}
              <span className="text-3xl font-extrabold tracking-tight text-white group-hover:text-blue-300 transition-colors duration-300">
                SMKN 4 MATARAM
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-blue-200 max-w-xs">
              Mewujudkan generasi berprestasi, inovatif, dan berakhlak mulia melalui pendidikan vokasi unggulan.
            </p>
          </div>

          {/* Column 2: Kontak Info */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-blue-100 border-b border-blue-700 pb-2">Kontak Kami</h3>
            <ul className="text-sm space-y-3 text-blue-200">
              <li className="flex items-start gap-3">
                <span className="text-blue-300 mt-1"><FaEnvelope size={16} /></span>
                <span>smkn4mtrm@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-300 mt-1"><FaPhone size={16} /></span>
                <span>081 89273 99890</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-300 mt-1"><FaWhatsapp size={16} /></span>
                <span>081 89273 99890</span> {/* Often same as phone, or provide separate WhatsApp number */}
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-300 mt-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a4.001 4.001 0 115.656-5.656l.828.829.828-.829a4.001 4.001 0 015.656 5.656z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.325 5.568L18.43 3.673a1.998 1.998 0 00-2.828 0l-.707.707-.707-.707a1.998 1.998 0 00-2.828 0L9.04 5.568m5.656 5.656L12 14.12l-2.828-2.828m5.656 5.656L12 19.776l-2.828-2.828m0 0a4.001 4.001 0 115.656-5.656l.828.829.828-.829a4.001 4.001 0 115.656 5.656z" />
                </svg></span>
                <span>Jl. Nani Wartabone Desa Bubeya Kec. Suwawa Kab. Bone Bolang</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Navigasi Cepat - Profile */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-blue-100 border-b border-blue-700 pb-2">Navigasi Cepat</h3>
            <ul className="text-sm space-y-3">
              <li><Link href="/profil/tentang-kami" className="text-blue-200 hover:text-blue-50 transition-colors duration-300">Tentang Kami</Link></li>
              <li><Link href="/jurusan" className="text-blue-200 hover:text-blue-50 transition-colors duration-300">Pilihan Jurusan</Link></li>
              <li><Link href="/fasilitas" className="text-blue-200 hover:text-blue-50 transition-colors duration-300">Fasilitas</Link></li>
              <li><Link href="/daftar-guru" className="text-blue-200 hover:text-blue-50 transition-colors duration-300">Daftar Guru</Link></li>
              <li><Link href="/ekstrakurikuler" className="text-blue-200 hover:text-blue-50 transition-colors duration-300">Ekstrakurikuler</Link></li>
            </ul>
          </div>

          {/* Column 4: Social Media & Login */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-blue-100 border-b border-blue-700 pb-2">Ikuti Kami</h3>
            <div className="flex space-x-5 mb-6">
              <a href="https://www.facebook.com/smkn4mtrm" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white transition-colors duration-300 transform hover:scale-110">
                <FaFacebookF size={24} />
              </a>
              <a href="https://www.instagram.com/smkn4mtr" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white transition-colors duration-300 transform hover:scale-110">
                <FaInstagram size={24} />
              </a>
              <a href="https://www.tiktok.com/@smeka.media" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white transition-colors duration-300 transform hover:scale-110">
                <FaTiktok size={24} />
              </a>
            </div>
            <Link href="/register/login" className="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright */}
      <div className="border-t border-blue-800 pt-6 mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-sm text-blue-300">
          <div className="mb-3 sm:mb-0 text-center sm:text-left">
            &copy; {currentYear} SMKN 4 Mataram. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}