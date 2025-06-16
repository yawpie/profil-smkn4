import Link from 'next/link';
import Image from 'next/image';
// FaBars, FaFileAlt, FaImages, FaDownload, FaBell are no longer needed
// useState, useEffect are no longer needed for this simplified header

export default function Header() {
  return (
    <header className="w-full shadow-lg bg-white z-50">
      {/* Top section: Logo and School Name */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-start">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo_SMKN4.jpg" // Ensure this path is correct
            alt="SMKN 4 Mataram Logo"
            width={40} // Adjusted width to match the new image more closely
            height={40} // Adjusted height
            className="rounded shadow-sm" // Kept rounded shadow if desired, can remove if not in image
          />
          <span className="text-blue-900 text-xl font-bold">SMKN 4 Mataram</span>
        </Link>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-blue-800 text-white py-3"> {/* Darker blue background */}
        <div className="container mx-auto px-4 flex justify-center items-center"> {/* Changed justify-end to justify-center */}
          <nav>
            <ul className="flex gap-8 text-base font-medium"> {/* Increased gap between links */}
              <li><Link href="/" className="hover:text-yellow-300 transition-colors">Beranda</Link></li>
              <li><Link href="/pengumuman" className="hover:text-yellow-300 transition-colors">Pengumuman</Link></li>
              <li><Link href="/artikel" className="hover:text-yellow-300 transition-colors">Artikel</Link></li>
              <li><Link href="/contact" className="hover:text-yellow-300 transition-colors">Hubungi Kami</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}