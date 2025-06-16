// pages/index.js
import MainLayout from '../components/layout/MainLayout';
import HeroSection from '../components/HeroSection';

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      {/* Di sini Anda bisa menambahkan bagian lain dari halaman beranda
          misalnya: Berita Terbaru, Profil Sekolah Singkat, Galeri, dll. */}
      <section className="px-5 py-10 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Selamat Datang di Website Resmi SMKN 4 Mataram
        </h2>
        <p className="text-base text-gray-700">
          Temukan informasi terbaru, pengumuman, dan kegiatan sekolah kami di sini.
        </p>
        {/* Konten tambahan */}
      </section>
    </MainLayout>
  );
}
