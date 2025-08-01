// components/ArticleSection.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, FC, useCallback } from 'react'; // Import FC, useCallback
import { motion, AnimatePresence, type Variants } from 'framer-motion'; // Import type Variants
import type { Article } from '@/types/Article';


const getTruncatedText = (content: string, summary?: string, maxLength: number = 150): string => {
  if (summary) {
    return summary.length > maxLength ? summary.substring(0, maxLength) + '...' : summary;
  }
  if (content === null || content === undefined) {
    return '';
  }
  return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
};

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString; // Mengembalikan string asli jika parsing gagal
  }
};

const ArticleSection: FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Framer Motion Variants
  const sectionHeaderVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const featuredCardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.98, rotateX: 10 },
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

  const smallCardVariants: Variants = {
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

  // Fungsi untuk mengambil artikel dari backend/API
  const fetchArticlesFromBackend = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      // Menggunakan endpoint /api/articles yang sudah kita buat
      // Anda mungkin ingin menambahkan parameter query seperti ?limit=5 jika API mendukung
      const response = await fetch('/api/articles'); // Menggunakan endpoint relatif

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Article[] = await response.json(); // Tipekan data langsung sebagai Article[]
      
      // Sort by publishDate (terbaru pertama)
      const sortedArticles: Article[] = data.sort((a: Article, b: Article) => {
        const dateA = new Date(a.publishDate).getTime(); // Menggunakan 'publishDate'
        const dateB = new Date(b.publishDate).getTime(); // Menggunakan 'publishDate'
        return dateB - dateA;
      });
      
      // Ambil hanya 5 artikel teratas setelah diurutkan
      setArticles(sortedArticles.slice(0, 5));
    } catch (e: unknown) { // Gunakan 'unknown' untuk penanganan error yang lebih aman
      console.error("Gagal mengambil artikel:", e);
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
    fetchArticlesFromBackend();
  }, [fetchArticlesFromBackend]); // Tambahkan sebagai dependensi useEffect

  const featuredArticle: Article | null = articles.length > 0 ? articles[0] : null;
  const smallArticles: Article[] = articles.length > 1 ? articles.slice(1, 5) : []; // Ambil 4 artikel kecil setelah yang utama

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 bg-gray-50 rounded-3xl mb-16">
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

      {/* Loading State with Skeleton */}
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

      {/* Main Article Grid (Featured & Small Articles) */}
      {!loading && !error && articles.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">

          {/* Render Featured Article (Left Column) */}
          {featuredArticle && (
            <motion.div
              variants={featuredCardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="lg:col-span-1"
            >
              <Link href={`/artikel/${featuredArticle.slug || featuredArticle.id}`} className="block group relative overflow-hidden rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] border border-transparent hover:border-teal-300">
                <div className="relative w-full h-80 md:h-96">
                  <Image
                    src={featuredArticle.image || '/images/default_article.png'} // Menggunakan 'image'
                    alt={featuredArticle.title}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform duration-500 brightness-75 group-hover:brightness-90"
                    quality={80}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-100"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white z-10">
                    {/* Category dihapus karena tidak ada di tipe Article */}
                    <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight group-hover:text-blue-200 transition-colors duration-300">{featuredArticle.title}</h3>
                    <p className="text-sm opacity-80">{formatDate(featuredArticle.publishDate)}</p> {/* Menggunakan 'publishDate' */}
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Render Small Articles (Two Right Columns) */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {smallArticles.map((article, index) => (
                <motion.div
                  key={article.id} // ID adalah string dan wajib, gunakan langsung
                  variants={smallCardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: index * 0.12 }}
                >
                  <Link href={`/artikel/${article.slug || article.id}`} className="block group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] border border-transparent hover:border-cyan-300">
                    <div className="relative w-full h-40">
                      <Image
                        src={article.image || '/images/default_article.png'} // Menggunakan 'image'
                        alt={article.title}
                        layout="fill"
                        objectFit="cover"
                        className="group-hover:scale-105 transition-transform duration-500 brightness-75 group-hover:brightness-90"
                        quality={70}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100"></div>
                      <div className="absolute bottom-0 left-0 p-4 text-white z-10">
                        {/* Category dihapus karena tidak ada di tipe Article */}
                        <h3 className="text-base font-bold mb-1 leading-tight group-hover:text-blue-200 transition-colors duration-300">{article.title}</h3>
                        <p className="text-xs opacity-80">{formatDate(article.publishDate)}</p> {/* Menggunakan 'publishDate' */}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* "View All Articles" Button */}
      {!loading && !error && articles.length > 0 && (
        <div className="text-center mt-12">
          <Link href="/artikel" className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg transform hover:scale-105 text-md">
            Lihat Semua Artikel &rarr;
          </Link>
        </div>
      )}
    </section>
  );
};

export default ArticleSection;