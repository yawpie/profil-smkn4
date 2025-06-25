// components/layout/MainLayout.js
import Header from './Header'; // Pastikan path ini benar relatif terhadap MainLayout.js
import Footer from './Footer'; // Pastikan path ini benar relatif terhadap MainLayout.js
// Hapus: import DaftarGuru from './DaftarGuru';
// Hapus: import ArticleSection from './ArticleSection';

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/*
        Ini sudah benar dari perbaikan sebelumnya.
        Tidak ada 'container mx-auto px-4 py-6' di sini.
      */}
      <main className="flex-grow">
        {children} {/* Konten spesifik halaman akan dirender di sini */}
        {/* Hapus: <DaftarGuru/> */}
        {/* Hapus: <ArticleSection/> */}
      </main>
      <Footer />
    </div>
  );
}