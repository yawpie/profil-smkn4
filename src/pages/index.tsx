// pages/index.tsx
import MainLayout from '../components/layout/MainLayout';
import HeroSection from '../components/Beranda/HeroSection';
import DaftarGuru from '../components/layout/DaftarGuru';
import ArticleSection from '../components/layout/ArticleSection';
import StatsSection from '../components/Beranda/StatsSection';
import LatestAnnouncement from '../components/layout/LatestAnnouncement'; 
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />

      {/* --- Bagian Sambutan Selamat Datang --- */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95, rotateX: 5 }}
          whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
            type: "spring",
            stiffness: 70,
            damping: 10
          }}
          className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-8 md:p-12 text-center border border-blue-200 relative overflow-hidden"
        >
          {/* Latar belakang dekoratif blob/partikel */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute -top-10 -left-10 w-36 h-36 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl animate-blob"></div>
            <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000"></div>
          </div>

          <h2 className="relative z-10 text-2xl sm:text-3xl font-extrabold text-gray-800 mb-3 leading-tight drop-shadow-sm">
            Selamat Datang di Website Resmi <br className="hidden sm:inline" /> <span className="text-blue-700">SMKN 4 Mataram</span>
          </h2>
          <p className="relative z-10 text-sm sm:text-base text-gray-700 max-w-2xl mx-auto leading-relaxed opacity-90">
            Temukan informasi terbaru, pengumuman, program unggulan, dan kegiatan seru sekolah kami di sini. Mari bergabung dalam perjalanan edukasi yang inspiratif!
          </p>
        </motion.div>
      </section>

      {/* --- Bagian Statistik Sekolah --- */}
      <StatsSection />

      {/* --- Bagian Pengumuman Terbaru --- */}
      <LatestAnnouncement />

      {/* Tampilkan Daftar Guru secara sekilas */}
      <DaftarGuru/>

      {/* Tampilkan Artikel secara sekilas */}
      <ArticleSection/>

      {/* Anda bisa menambahkan bagian lain seperti Galeri Preview, Testimoni, dll. */}
    </MainLayout>
  );
}