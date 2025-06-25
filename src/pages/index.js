// pages/index.js
import MainLayout from '../components/layout/MainLayout';
import HeroSection from '../components/HeroSection';
import DaftarGuru from '../components/layout/DaftarGuru';
import ArticleSection from '../components/layout/ArticleSection';

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />

      {/* Konten lain di halaman beranda */}
      <section className="container mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Selamat Datang di Website Resmi SMKN 4 Mataram
        </h2>
        <p className="text-base text-gray-700">
          Temukan informasi terbaru, pengumuman, dan kegiatan sekolah kami di sini.
        </p>
      </section>

      {/* Tampilkan Daftar Guru secara sekilas */}
      <DaftarGuru/>

      {/* Tampilkan Artikel secara sekilas */}
      <ArticleSection/>    

      {/* Anda bisa menambahkan bagian lain seperti Galeri Preview, Testimoni, dll. */}
    </MainLayout>
  );
}