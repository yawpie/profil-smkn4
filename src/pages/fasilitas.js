// pages/fasilitas.js
"use client";

import MainLayout from '../components/layout/MainLayout';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence

export default function Fasilitas() {
  const [facilities, setFacilities] = useState([]);
  const [activeFacility, setActiveFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Framer Motion Variants for general sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  // Variants for main content (sidebar and detail) for morph-like entry
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        delayChildren: 0.2, // Stagger children animations
        staggerChildren: 0.1,
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      }
    },
  };

  // Variants for facility detail content (when switching between facilities)
  const detailVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
  };


  // Function to fetch facility data from backend/API
  useEffect(() => {
    async function fetchFacilities() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/facilities');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFacilities(data);

        if (data.length > 0) {
          setActiveFacility(data[0].id); // Set the first facility as active by default
        }
      } catch (e) {
        console.error("Failed to fetch facilities data:", e);
        setError("Gagal memuat fasilitas. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    }

    fetchFacilities();
  }, []);

  const currentFacility = facilities.find(fac => fac.id === activeFacility);

  return (
    <MainLayout>
      {/* Hero Section with Title */}
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
            variants={sectionVariants}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-blue-800 leading-tight mb-4 drop-shadow-xl"
          >
            Fasilitas <span className="text-cyan-600">Unggulan</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            transition={{ ...sectionVariants.visible.transition, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-800 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Jelajahi berbagai fasilitas modern dan lengkap yang mendukung proses belajar mengajar di sekolah kami untuk pengalaman terbaik.
          </motion.p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-white shadow-inner-lg rounded-t-3xl -mt-16 relative z-10">
        {/* Loading State with Skeleton */}
        {loading && (
          <div className="flex flex-col md:flex-row gap-8 mt-8">
            {/* Sidebar Skeleton */}
            <div className="w-full md:w-1/4 bg-gray-100 p-6 rounded-xl shadow-md animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-300 rounded-md mb-3"></div>
              ))}
            </div>
            {/* Content Skeleton */}
            <div className="w-full md:w-3/4 bg-gray-100 p-8 rounded-xl shadow-md animate-pulse">
              <div className="w-full h-[300px] bg-gray-300 rounded-lg mb-6"></div>
              <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-5 bg-gray-300 rounded w-full mb-3"></div>
              <div className="h-5 bg-gray-300 rounded w-11/12 mb-3"></div>
              <div className="h-5 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="text-center py-20 bg-red-50 rounded-xl shadow-lg border border-red-200"
          >
            <p className="text-2xl text-red-700 font-semibold mb-4">{error}</p>
            <button
              onClick={fetchFacilities}
              className="px-8 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Coba Lagi
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && facilities.length === 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="text-center py-20 bg-blue-50 rounded-xl shadow-lg border border-blue-200"
          >
            <p className="text-2xl text-blue-700 font-semibold mb-4">Tidak ada fasilitas yang tersedia saat ini.</p>
            <p className="text-lg text-gray-600">Mohon maaf, kami sedang mempersiapkan informasi lebih lanjut.</p>
          </motion.div>
        )}

        {/* Main Content when data is loaded */}
        {!loading && !error && facilities.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants} // Apply container variants for initial morph-in
            className="flex flex-col md:flex-row gap-8 relative mt-8"
          >
            {/* Background decoration (optional, for aesthetic touch) */}
            <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl opacity-20 pointer-events-none">
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-6000"></div>
            </div>

            {/* Left Sidebar for Navigation */}
            <motion.div
              variants={itemVariants} // Apply item variants to sidebar
              className="w-full md:w-1/4 bg-white p-6 rounded-xl shadow-xl md:sticky md:top-24 h-fit z-10 border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Daftar Fasilitas</h3>
              <nav>
                <ul>
                  {facilities.map((fac) => (
                    <li key={fac.id} className="mb-2">
                      <button
                        onClick={() => setActiveFacility(fac.id)}
                        className={`relative block w-full text-left py-3 px-4 rounded-lg transition-all duration-300 ease-in-out group
                          ${activeFacility === fac.id
                            ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold shadow-md transform translate-x-1'
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-800'
                          }`}
                      >
                        {fac.name}
                        {activeFacility === fac.id && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full transition-all duration-300 group-hover:scale-125"></span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>

            {/* Right Content Area */}
            <motion.div
              variants={itemVariants} // Apply item variants to content area
              className="w-full md:w-3/4 bg-white p-8 rounded-xl shadow-xl z-10 border border-gray-100"
            >
              <AnimatePresence mode="wait"> {/* Use AnimatePresence for exit animations on facility change */}
                {currentFacility ? (
                  <motion.div
                    key={currentFacility.id} // Key changes to trigger animation on facility switch
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={detailVariants}
                  >
                    <div className="mb-6 overflow-hidden rounded-xl shadow-lg border border-gray-200">
                      <Image
                        src={currentFacility.image}
                        alt={currentFacility.title}
                        width={1600}
                        height={900}
                        layout="responsive"
                        objectFit="cover"
                        className="rounded-xl transition-transform duration-700 hover:scale-105"
                        priority={activeFacility === facilities[0].id} // Prioritize loading the first image
                      />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4 leading-tight">{currentFacility.title}</h2>
                    {currentFacility.description.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-lg text-gray-700 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-facility-selected"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={detailVariants}
                    className="text-center py-10 text-gray-600"
                  >
                    <p className="text-lg">Silakan pilih salah satu fasilitas dari daftar di samping untuk melihat detailnya.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </section>
    </MainLayout>
  );
}