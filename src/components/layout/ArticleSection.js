// components/ArticleSection.js
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion
import { formatDate } from '@/utils/formatDate'; // Pastikan path ini benar dan fungsi formatDate berfungsi

export default function ArticleSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Framer Motion Variants
  const sectionHeaderVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const featuredCardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.98, rotateX: 10 }, // Subtle 3D tilt
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        type: "spring",
        stiffness: 90,
        damping: 15,
      }
    },
  };

  const smallCardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
        damping: 15,
      }
    },
  };

  useEffect(() => {
    async function fetchArticlesFromBackend() {
      setLoading(true);
      setError(null);
      try {
        // Fetch 5 articles: 1 featured + 4 small. Ensure API supports sorting by date.
        // If your API can sort, add `&sortBy=date&order=desc`
        const response = await fetch('http://192.168.236.15:3000/api/articles?page=1&limit=5');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Assuming data.data.data is the array of articles
        // Sort by published_date if not sorted by API (newest first)
        const sortedArticles = data.data.data.sort((a, b) => new Date(b.published_date) - new Date(a.published_date));
        setArticles(sortedArticles);
      } catch (e) {
        console.error("Gagal mengambil artikel:", e);
        setError("Gagal memuat artikel. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    }

    fetchArticlesFromBackend();
  }, []);

  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const smallArticles = articles.length > 1 ? articles.slice(1, 5) : []; // Ambil 4 artikel kecil setelah yang unggulan

  // Helper function to safely get a truncated text for article summary
  const getTruncatedText = (text, maxLength) => {
    if (text === null || text === undefined) {
      return '';
    }
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };


  return (
    // Section utama dengan padding dan background abu-abu terang
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 bg-gray-50 rounded-3xl mb-16">
      {/* Header Bagian dengan Animasi */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionHeaderVariants}
        className="text-center mb-12"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-3">
          Artikel <span className="text-teal-700">Terbaru</span>
        </h2>
      </motion.div>

      {/* Loading State dengan Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Featured Article Skeleton */}
          <div className="lg:col-span-1 bg-gray-100 rounded-xl shadow-md overflow-hidden animate-pulse">
            <div className="w-full h-80 md:h-96 bg-gray-300"></div>
            <div className="p-6">
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
          {/* Small Articles Skeleton */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-40 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-3 bg-gray-300 rounded w-1/3 mb-1"></div>
                  <div className="h-5 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-10 bg-red-50 rounded-xl shadow-lg border border-red-200">
          <p className="text-xl text-red-700 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && articles.length === 0 && (
        <div className="text-center py-10 bg-blue-50 rounded-xl shadow-lg border border-blue-200">
          <p className="text-lg text-gray-600">Belum ada artikel yang tersedia saat ini.</p>
        </div>
      )}

      {/* Grid Artikel Utama (Featured & Small Articles) */}
      {!loading && !error && articles.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">

          {/* Render Artikel Unggulan (Kolom Kiri) */}
          {featuredArticle && (
            <motion.div
              variants={featuredCardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }} // Trigger early for the main card
              className="lg:col-span-1"
            >
              <Link href={`/artikel/${featuredArticle.slug || featuredArticle.id}`} className="block group relative overflow-hidden rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] border border-transparent hover:border-teal-300">
                <div className="relative w-full h-80 md:h-96"> {/* Tinggi disesuaikan */}
                  <Image
                    src={featuredArticle.image_url || '/images/default_article.png'} // Fallback image
                    alt={featuredArticle.title}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform duration-500 brightness-75 group-hover:brightness-90" // Lebih terang di hover
                    quality={80} // Kualitas gambar lebih baik
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-100"></div> {/* Overlay lebih gelap */}
                  <div className="absolute bottom-0 left-0 p-6 text-white z-10">
                    <p className="text-xs font-semibold mb-1 opacity-90 px-2 py-0.5 bg-teal-600 rounded-md inline-block">{featuredArticle.category?.name || 'Umum'}</p> {/* Kategori */}
                    <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight group-hover:text-blue-200 transition-colors duration-300">{featuredArticle.title}</h3> {/* Judul lebih besar */}
                    <p className="text-sm opacity-80">{formatDate(featuredArticle.published_date)}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Render Artikel Kecil (Dua Kolom Kanan) */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {smallArticles.map((article, index) => (
                <motion.div
                  key={article.id || article.title}
                  variants={smallCardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }} // Trigger saat 10% kartu terlihat
                  transition={{ delay: index * 0.12 }} // Staggered animation
                >
                  <Link href={`/artikel/${article.slug || article.id}`} className="block group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] border border-transparent hover:border-cyan-300">
                    <div className="relative w-full h-40"> {/* Tinggi gambar disesuaikan */}
                      <Image
                        src={article.image_url || '/images/default_article.png'} // Fallback image
                        alt={article.title}
                        layout="fill"
                        objectFit="cover"
                        className="group-hover:scale-105 transition-transform duration-500 brightness-75 group-hover:brightness-90"
                        quality={70} // Kualitas gambar
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100"></div> {/* Overlay lebih gelap */}
                      <div className="absolute bottom-0 left-0 p-4 text-white z-10">
                        <p className="text-xs font-semibold mb-1 opacity-90 px-2 py-0.5 bg-teal-600 rounded-md inline-block">{article.category?.name || 'Umum'}</p> {/* Kategori */}
                        <h3 className="text-base font-bold mb-1 leading-tight group-hover:text-blue-200 transition-colors duration-300">{article.title}</h3>
                        <p className="text-xs opacity-80">{formatDate(article.published_date)}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Tombol "Lihat Semua Artikel" */}
      {!loading && !error && articles.length > 0 && (
        <div className="text-center mt-12">
          <Link href="/artikel" className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg transform hover:scale-105 text-md">
            Lihat Semua Artikel &rarr;
          </Link>
        </div>
      )}
    </section>
  );
}