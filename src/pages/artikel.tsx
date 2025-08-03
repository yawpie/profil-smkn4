// pages/artikel/index.tsx
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MainLayout from '../components/layout/MainLayout';
import { motion, AnimatePresence, type Variants } from 'framer-motion'; // Tambahkan AnimatePresence
import type { Article } from '@/types/Article';

// Helper function to safely get a truncated text, now prioritizes summary
const getTruncatedText = (text: string | null | undefined, maxLength: number): string => {
  if (text === null || text === undefined) {
    return '';
  }
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const ArtikelPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Framer Motion Variants
  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.2 } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
        damping: 15,
      }
    },
  };

  // Function to fetch articles from backend/API
  const fetchArticles = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/articles'); // Menggunakan endpoint '/api/articles'
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Article[] = await response.json();

      // Sort by publishDate (sesuai tipe Article dan API Anda)
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.publishDate).getTime(); // Menggunakan publishDate
        const dateB = new Date(b.publishDate).getTime(); // Menggunakan publishDate
        return dateB - dateA;
      });
      setArticles(sortedData);
    } catch (e: unknown) {
      console.error("Failed to fetch articles:", e);
      if (e instanceof Error) {
        setError(`Gagal memuat artikel. Detail: ${e.message}`);
      } else {
        setError("Gagal memuat artikel. Silakan coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  }, []); // Dependensi kosong karena fungsi ini hanya bergantung pada API endpoint

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]); // Tambahkan fetchArticles sebagai dependensi useEffect

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 font-sans"> {/* Padding dan font-sans */}
        <div className="absolute inset-0 opacity-40 animate-blob-pulse">
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={headerVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-indigo-800 leading-tight mb-3 drop-shadow-xl" // Font H1 lebih kecil
          >
            Semua <span className="text-blue-600">Artikel</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-sm sm:text-base text-gray-800 max-w-2xl mx-auto mb-8 leading-relaxed" // Font P lebih kecil
          >
            Jelajahi berbagai artikel informatif dan inspiratif dari sekolah kami.
          </motion.p>
        </div>
      </section>

      {/* Loading State with Skeleton */}
      {loading && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white shadow-inner-lg rounded-t-3xl -mt-16 relative z-10 font-sans"> {/* Padding dan font-sans */}
          <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-10 animate-pulse"> {/* Font H2 lebih kecil */}
            Memuat Artikel...
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Gap lebih kecil */}
            {[...Array(6)].map((_, i) => ( // Show 6 skeleton cards
              <div key={i} className="bg-gray-100 rounded-xl shadow-md overflow-hidden p-5 animate-pulse"> {/* Padding lebih kecil */}
                <div className="w-full h-36 bg-gray-300 mb-3"></div> {/* Skeleton for image */}
                <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div> {/* Skeleton for title */}
                <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div> {/* Skeleton for date */}
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div> {/* Skeleton for summary line 1 */}
                <div className="h-4 bg-gray-300 rounded w-11/12"></div> {/* Skeleton for summary line 2 */}
                <div className="h-3 bg-gray-300 rounded w-1/3 mt-4"></div> {/* Skeleton for read more */}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Error State */}
      {!loading && error && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-red-50 rounded-xl shadow-lg border border-red-200 text-center -mt-16 relative z-10 font-sans"> {/* Padding dan font-sans */}
          <motion.p
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-lg text-red-700 font-semibold mb-3" // Font lebih kecil
          >
            Error: Gagal memuat artikel. {error}
          </motion.p>
          <button
            onClick={fetchArticles}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md text-base" // Padding & font lebih kecil
          >
            Coba Lagi
          </button>
        </section>
      )}

      {/* Empty State */}
      {!loading && !error && articles.length === 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-blue-50 rounded-xl shadow-lg border border-blue-200 text-center -mt-16 relative z-10 font-sans"> {/* Padding dan font-sans */}
          <motion.p
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-lg text-blue-700 font-semibold mb-3" // Font lebih kecil
          >
            Belum ada artikel yang tersedia saat ini.
          </motion.p>
          <p className="text-base text-gray-600">Nantikan tulisan-tulisan terbaru dari kami!</p> {/* Font lebih kecil */}
        </section>
      )}

      {/* Main Content when data is loaded */}
      {!loading && !error && articles.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 bg-white shadow-inner-lg rounded-t-3xl -mt-16 relative z-10 font-sans"> {/* Padding dan font-sans */}
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={textVariants}
            className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900 mb-10" // Font H2 lebih kecil
          >
            Semua <span className="text-blue-700">Artikel Sekolah</span>
          </motion.h2>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"> {/* Gap lebih kecil */}
            {articles.map((article, index) => (
              <motion.div
                key={article.id ?? `article-${index}`} // Gunakan ID atau fallback ke index
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: index * 0.08 }}
                className="bg-white rounded-xl shadow-xl overflow-hidden
                           transform transition-all duration-300 ease-in-out
                           hover:scale-[1.03] hover:shadow-2xl hover:border-blue-400 border border-transparent
                           group relative cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>

                {article.image && ( // Menggunakan 'article.image' sesuai tipe Article
                  <div className="w-full h-40 relative overflow-hidden rounded-t-xl"> {/* Tinggi gambar sedikit lebih kecil */}
                    <Image
                      src={article.image} // Menggunakan 'article.image'
                      alt={article.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}

                <div className="p-5 relative z-10"> {/* Padding lebih kecil */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-700 transition-colors duration-300"> {/* Font H3 lebih kecil */}
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-xs mb-2"> {/* Font & margin lebih kecil */}
                    Tanggal: {new Date(article.publishDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })} {/* Menggunakan publishDate */}
                    {article.author && ` oleh ${article.author}`}
                  </p>
                  <p className="text-gray-700 mt-2 line-clamp-3 flex-grow text-sm"> {/* Font P lebih kecil */}
                    {getTruncatedText(article.content, 120)} {/* Potongan konten lebih pendek */}
                  </p>
                  <Link
                    href={`/artikel/${article.id}`} // Menggunakan ID untuk link
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold mt-3 group-hover:underline transition-colors text-sm" // Font link lebih kecil
                  >
                    Baca Selengkapnya
                    <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </MainLayout>
  );
};

export default ArtikelPage;