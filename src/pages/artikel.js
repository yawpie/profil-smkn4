// pages/artikel.js
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Added Image for potential article thumbnails
import MainLayout from '../components/layout/MainLayout';
import { motion } from 'framer-motion'; // Import motion from framer-motion

// Helper function to safely get a truncated text
const getTruncatedText = (text, maxLength) => {
  if (text === null || text === undefined) {
    return ''; // Return an empty string if text is null or undefined
  }
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export default function ArtikelPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Framer Motion Variants
  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        type: "spring", // For a subtle "morph" effect
        stiffness: 100,
        damping: 15,
      }
    },
  };

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/article'); // Your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Assuming your articles have 'date' property, sort them by date (newest first)
        const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setArticles(sortedData);
      } catch (e) {
        console.error("Failed to fetch articles:", e);
        setError("Gagal memuat artikel. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-28 lg:py-36 overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100">
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
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-indigo-800 leading-tight mb-4 drop-shadow-xl"
          >
            Semua <span className="text-blue-600">Artikel</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={textVariants}
            transition={{ ...textVariants.visible.transition, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-800 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Jelajahi berbagai artikel informatif dan inspiratif dari sekolah kami.
          </motion.p>
        </div>
      </section>

      {/* Loading State with Skeleton */}
      {loading && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white shadow-inner-lg rounded-t-3xl -mt-16 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12 animate-pulse">
            Memuat Artikel...
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => ( // Show 6 skeleton cards
              <div key={i} className="bg-gray-100 rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-300"></div> {/* Skeleton for image */}
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div> {/* Skeleton for title */}
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div> {/* Skeleton for date */}
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div> {/* Skeleton for summary line 1 */}
                  <div className="h-4 bg-gray-300 rounded w-11/12"></div> {/* Skeleton for summary line 2 */}
                  <div className="h-4 bg-gray-300 rounded w-1/3 mt-4"></div> {/* Skeleton for read more */}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Error State */}
      {!loading && error && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-red-50 rounded-xl shadow-lg border border-red-200 text-center -mt-16 relative z-10">
          <motion.p
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-2xl text-red-700 font-semibold mb-4"
          >
            Error: Gagal memuat artikel. {error}
          </motion.p>
          <button
            onClick={() => window.location.reload()} // Simple reload to retry fetch
            className="px-8 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Coba Lagi
          </button>
        </section>
      )}

      {/* Empty State */}
      {!loading && !error && articles.length === 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-blue-50 rounded-xl shadow-lg border border-blue-200 text-center -mt-16 relative z-10">
          <motion.p
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-2xl text-blue-700 font-semibold mb-4"
          >
            Belum ada artikel yang tersedia saat ini.
          </motion.p>
          <p className="text-lg text-gray-600">Nantikan tulisan-tulisan terbaru dari kami!</p>
        </section>
      )}

      {/* Main Content when data is loaded */}
      {!loading && !error && articles.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-white shadow-inner-lg rounded-t-3xl -mt-16 relative z-10">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={textVariants}
            className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-12"
          >
            Semua <span className="text-blue-700">Artikel Sekolah</span>
          </motion.h2>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: index * 0.08 }} // Staggered animation for morph effect
                className="bg-white rounded-xl shadow-xl overflow-hidden
                           transform transition-all duration-300 ease-in-out
                           hover:scale-[1.03] hover:shadow-2xl hover:border-blue-400 border border-transparent
                           group relative cursor-pointer"
              >
                {/* Gradient effect on hover inside the card */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>

                {article.imageUrl && ( // Conditionally render image if available
                  <div className="w-full h-48 relative overflow-hidden rounded-t-xl">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}

                <div className="p-6 relative z-10"> {/* z-10 to keep content above hover effect */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-700 transition-colors duration-300">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Tanggal: {new Date(article.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-gray-700 mt-3 line-clamp-3 flex-grow">
                    {article.summary || getTruncatedText(article.content, 150)}
                  </p>
                  <Link href={`/artikel/${article.slug || article.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold mt-4 group-hover:underline transition-colors">
                    Baca Selengkapnya
                    <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </MainLayout>
  );
}