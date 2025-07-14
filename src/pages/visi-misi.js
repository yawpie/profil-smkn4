// pages/visi-misi.js
"use client";

import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { motion } from 'framer-motion'; // Import motion from framer-motion

export default function VisiMisiPage() {
  const [visiMisiData, setVisiMisiData] = useState(null);
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

  const contentBlockVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        type: "spring",
        stiffness: 90,
        damping: 15,
      }
    },
  };

  // Function to fetch Visi & Misi data from backend/API
  useEffect(() => {
    async function fetchVisiMisi() {
      setLoading(true);
      setError(null);
      try {
        // IMPORTANT: Replace '/api/visi-misi' with your actual backend endpoint
        // This endpoint should return an object like:
        // {
        //   visi: "Visi sekolah Anda...",
        //   misi: ["Misi 1...", "Misi 2...", "Misi 3..."]
        // }
        const response = await fetch('/api/visi-misi');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVisiMisiData(data);
      } catch (e) {
        console.error("Gagal mengambil data Visi & Misi:", e);
        setError("Gagal memuat Visi & Misi. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    }

    fetchVisiMisi();
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-28 lg:py-36 overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
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
            Visi & <span className="text-blue-600">Misi</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={textVariants}
            transition={{ ...textVariants.visible.transition, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-800 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Mewujudkan masa depan cerah melalui nilai dan tujuan yang jelas.
          </motion.p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-white shadow-inner-lg rounded-t-3xl -mt-16 relative z-10">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-100 rounded-xl shadow-md p-8 animate-pulse">
              <div className="h-10 bg-gray-300 rounded w-1/2 mb-6"></div> {/* Visi title */}
              <div className="h-6 bg-gray-300 rounded w-full mb-3"></div> {/* Visi text line 1 */}
              <div className="h-6 bg-gray-300 rounded w-11/12"></div> {/* Visi text line 2 */}
            </div>
            <div className="bg-gray-100 rounded-xl shadow-md p-8 animate-pulse">
              <div className="h-10 bg-gray-300 rounded w-1/2 mb-6"></div> {/* Misi title */}
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-300 rounded w-full mb-3"></div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-center py-20 bg-red-50 rounded-xl shadow-lg border border-red-200"
          >
            <p className="text-2xl text-red-700 font-semibold mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Coba Lagi
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && !visiMisiData && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-center py-20 bg-blue-50 rounded-xl shadow-lg border border-blue-200"
          >
            <p className="text-2xl text-blue-700 font-semibold mb-4">Data Visi & Misi belum tersedia saat ini.</p>
            <p className="text-lg text-gray-600">Kami sedang dalam proses pembaruan informasi.</p>
          </motion.div>
        )}

        {/* Content when data is loaded */}
        {!loading && !error && visiMisiData && (
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Visi Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={contentBlockVariants}
              className="bg-white rounded-xl shadow-2xl p-8 lg:p-10 border border-blue-100 relative overflow-hidden group"
            >
              {/* Subtle background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>

              <h2 className="relative z-10 text-4xl font-extrabold text-blue-700 mb-6 pb-2 border-b-2 border-blue-200">
                Visi
              </h2>
              <p className="relative z-10 text-lg md:text-xl text-gray-800 leading-relaxed">
                {visiMisiData.visi}
              </p>
            </motion.div>

            {/* Misi Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={contentBlockVariants}
              transition={{ ...contentBlockVariants.visible.transition, delay: 0.2 }} // Slightly delayed for stagger
              className="bg-white rounded-xl shadow-2xl p-8 lg:p-10 border border-purple-100 relative overflow-hidden group"
            >
               {/* Subtle background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>

              <h2 className="relative z-10 text-4xl font-extrabold text-purple-700 mb-6 pb-2 border-b-2 border-purple-200">
                Misi
              </h2>
              <ul className="relative z-10 text-lg md:text-xl text-gray-800 space-y-4 list-disc pl-5">
                {visiMisiData.misi && visiMisiData.misi.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}
      </section>
    </MainLayout>
  );
}