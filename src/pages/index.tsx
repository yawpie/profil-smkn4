// pages/index.js
import MainLayout from '../components/layout/MainLayout';
import HeroSection from '../components/Beranda/HeroSection';
import DaftarGuru from '../components/layout/DaftarGuru'; // Pastikan path ini benar
import ArticleSection from '../components/layout/ArticleSection'; // Pastikan path ini benar
import StatsSection from '../components/Beranda/StatsSection'; // Import komponen StatsSection yang baru
import { motion } from 'framer-motion'; // Pastikan motion diimpor jika digunakan di sini

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />

        {/* --- Bagian Sambutan Selamat Datang --- */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: 15 }} // Animasi awal yang lebih "morph"
            whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }} // Kembali ke posisi normal
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              type: "spring", // Tipe transisi spring untuk efek "melenting"
              stiffness: 80, // Kekakuan spring
              damping: 12 // Redaman spring
            }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 md:p-12 text-center border border-blue-100 relative overflow-hidden"
          >
            {/* Latar belakang dekoratif blob/partikel */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            </div>

            <h2 className="relative z-10 text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4 leading-tight">
              Selamat Datang di Website Resmi <br className="hidden sm:inline" /> <span className="text-blue-700">SMKN 4 Mataram</span>
            </h2>
            <p className="relative z-10 text-md sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Temukan informasi terbaru, pengumuman, program unggulan, dan kegiatan seru sekolah kami di sini. Mari bergabung dalam perjalanan edukasi yang inspiratif!
            </p>
          </motion.div>
        </section>

      {/* --- Bagian Statistik Sekolah (Baru Ditambahkan) --- */}
      <StatsSection /> {/* Panggil komponen statistik di sini */}

      {/* Tampilkan Daftar Guru secara sekilas */}
      <DaftarGuru/>

      {/* Tampilkan Artikel secara sekilas */}
      <ArticleSection/>

      {/* Anda bisa menambahkan bagian lain seperti Galeri Preview, Testimoni, dll. */}
    </MainLayout>
  );
}