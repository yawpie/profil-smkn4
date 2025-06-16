import Link from 'next/link';
import Image from 'next/image';
import { FaPhone, FaEnvelope, FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'; // Assuming FaTwitter for X icon or similar

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white pt-10 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Logo and Description */}
          <div>
            {/* Using a placeholder for "University" logo from the image */}
            {/* If you have a specific image for "University" logo, replace src */}
            <div className="flex items-center mb-4">
              {/* You might want to use your actual school logo here instead of a generic one */}
              {/* For now, replicating the text-based "University" from the image */}
              <span className="text-2xl font-extrabold tracking-tight">SKMN 4 MATARAM</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sit amet eleifend nulla.
            </p>
          </div>

          {/* Column 2: Kontak Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak Info</h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                {/* Location icon if desired, not explicit in image but common */}
                <span>Jl. Nani Wartabone Desa Bubeya Kec. Suwawa Kab. Bone Bolang</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-sm" />
                <span>081 89273 99890</span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-sm" />
                <span>mail@zafereinadigital.com</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Profile */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Profile</h3>
            <ul className="text-sm space-y-2">
              <li><Link href="/profile/tentang-kampus" className="hover:text-yellow-300 transition-colors">Tentang Kampus</Link></li>
              <li><Link href="/profile/daftar-guru" className="hover:text-yellow-300 transition-colors">Daftar Guru</Link></li>
              <li><Link href="/profile/fasilitas" className="hover:text-yellow-300 transition-colors">Fasilitas</Link></li>
            </ul>
          </div>

          {/* Column 4: Informasi */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informasi</h3>
            <ul className="text-sm space-y-2">
              <li><Link href="/informasi/prestasi-siswa" className="hover:text-yellow-300 transition-colors">Prestasi Siswa</Link></li>
              <li><Link href="/informasi/kegiatan-alumni" className="hover:text-yellow-300 transition-colors">Kegiatan Alumni</Link></li>
              <li><Link href="/informasi/blog-sekolah" className="hover:text-yellow-300 transition-colors">Blog Sekolah</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-blue-800 pt-4 mt-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <div className="mb-2 sm:mb-0">
            ©2025 SMKN 4 MATARAM
          </div>
          <div className="flex gap-4 items-center">
            {/* The X icon is typically FaTwitter now */}
            <a href="#" className="hover:text-white"><FaTwitter size={18} /></a>
            <a href="#" className="hover:text-white"><FaFacebookF size={18} /></a>
            <a href="#" className="hover:text-white"><FaInstagram size={18} /></a>
            {/* Assuming the last icon is a generic brand/AI icon,
                using a placeholder for now as it's not a standard react-icon.
                You might use an actual image or another icon if available.
            */}
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
              {/* This could be an SVG or another icon */}
              <span className="text-white text-xs font-bold">AI</span> {/* Placeholder text for the icon */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}