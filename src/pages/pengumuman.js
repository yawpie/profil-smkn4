// pages/pengumuman.js
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MainLayout from '../components/layout/MainLayout';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence

export default function Pengumuman() {
  const [announcements, setAnnouncements] = useState([]);
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
        type: "spring",
        stiffness: 100,
        damping: 15,
      }
    },
  };

  const mainCardVariants = {
    hidden: { opacity: 0, scale: 0.9, rotateX: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        type: "spring",
        stiffness: 80,
        damping: 12,
      }
    },
  };

  // Function to fetch announcements from backend/API
  useEffect(() => {
    async function fetchAnnouncementsFromBackend() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/announcements'); // Your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Sort by date if 'date' is a string that can be compared, or add a 'createdAt' field
        // For demonstration, let's assume 'date' can be sorted directly or is in a sortable format
        const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));

        setAnnouncements(sortedData);
      } catch (e) {
        console.error("Gagal mengambil pengumuman:", e);
        setError("Gagal memuat pengumuman. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    }

    fetchAnnouncementsFromBackend();
  }, []);

  const mainAnnouncement = announcements.length > 0 ? announcements[0] : null;
  const otherAnnouncements = announcements.length > 1 ? announcements.slice(1) : [];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-28 lg:py-36 overflow-hidden bg-gradient-to-br from-blue-100 via-sky-100 to-cyan-100">
        <div className="absolute inset-0 opacity-40 animate-blob-pulse">
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-sky-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={headerVariants}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-blue-800 leading-tight mb-4 drop-shadow-xl"
          >
            Pengumuman <span className="text-cyan-600">Resmi</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={textVariants}
            transition={{ ...textVariants.visible.transition, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-800 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Dapatkan informasi terkini dan penting langsung dari SMKN 4 Mataram.
          </motion.p>
        </div>
      </section>

      {/* Loading State with Skeleton */}
      {loading && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white shadow-inner-lg rounded-t-3xl -mt-16 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12 animate-pulse">
            Memuat Pengumuman...
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-gray-100 rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div> {/* Date */}
              <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div> {/* Title */}
              <div className="h-5 bg-gray-300 rounded w-full mb-2"></div> {/* Summary line 1 */}
              <div className="h-5 bg-gray-300 rounded w-11/12 mb-4"></div> {/* Summary line 2 */}
              <div className="h-4 bg-gray-300 rounded w-1/3"></div> {/* Read more */}
            </div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl shadow-md p-5 animate-pulse">
                  <div className="h-3 bg-gray-300 rounded w-1/4 mb-2"></div> {/* Date */}
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div> {/* Title */}
                  <div className="h-4 bg-gray-300 rounded w-full"></div> {/* Summary */}
                </div>
              ))}
            </div>
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
            {error}
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
      {!loading && !error && announcements.length === 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-blue-50 rounded-xl shadow-lg border border-blue-200 text-center -mt-16 relative z-10">
          <motion.p
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-2xl text-blue-700 font-semibold mb-4"
          >
            Belum ada pengumuman yang tersedia saat ini.
          </motion.p>
          <p className="text-lg text-gray-600">Nantikan informasi terbaru dari kami!</p>
        </section>
      )}

      {/* Main Content when data is loaded */}
      {!loading && !error && announcements.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-white shadow-inner-lg rounded-t-3xl -mt-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mainAnnouncement && (
              <motion.div
                key={mainAnnouncement.id} // Key to trigger animation if announcement changes
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={mainCardVariants} // Apply main card specific variants
                className="md:col-span-2 bg-white rounded-xl shadow-2xl overflow-hidden
                           transition-all duration-300 ease-in-out transform hover:scale-[1.01] hover:shadow-blue-500/30
                           relative group border border-blue-100"
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>

                <div className="p-8 relative z-10"> {/* z-10 to keep content above hover effect */}
                  <p className="text-sm text-gray-500 mb-3 font-medium">
                    {new Date(mainAnnouncement.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <Link href={`/pengumuman/${mainAnnouncement.slug || mainAnnouncement.id}`} className="block">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4 cursor-pointer hover:text-blue-700 transition-colors duration-300 leading-tight">
                      {mainAnnouncement.title}
                    </h3>
                  </Link>
                  <p className="text-gray-700 mb-5 leading-relaxed line-clamp-4">
                    {mainAnnouncement.summary}
                  </p>
                  <Link href={`/pengumuman/${mainAnnouncement.slug || mainAnnouncement.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors group-hover:underline">
                    Baca Selengkapnya
                    <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </Link>
                </div>
              </motion.div>
            )}

            <div className="space-y-6">
              <AnimatePresence>
                {otherAnnouncements.map((announcement, index) => (
                  <motion.div
                    key={announcement.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={cardVariants}
                    transition={{ delay: index * 0.1 }} // Stagger for morph effect
                    className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500
                               transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-xl
                               relative group overflow-hidden"
                  >
                     {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>

                    <div className="relative z-10">
                      <p className="text-xs text-gray-500 mb-2 font-medium">
                        {new Date(announcement.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <Link href={`/pengumuman/${announcement.slug || announcement.id}`} className="block">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2 cursor-pointer hover:text-blue-700 transition-colors duration-300">
                          {announcement.title}
                        </h4>
                      </Link>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {announcement.summary}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link href="/pengumuman-arsip" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg transform hover:scale-105">
              Lihat Semua Pengumuman &rarr;
            </Link>
          </div>
        </section>
      )}
    </MainLayout>
  );
}