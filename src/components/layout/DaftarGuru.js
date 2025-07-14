// This code assumes it's for pages/daftar-guru.js or a component used within it.
// If this is specifically for a homepage preview, pagination logic should be removed.

"use client"; // Important for client-side functionality and Hooks

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion

export default function DaftarGuruPage() { // Renamed to Page for clarity if it's a full page
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  // Ensure your API can handle `page` and `limit` parameters for proper pagination
  const itemsPerPage = 8; // Displaying more items per page for a full list

  // Framer Motion Variants
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

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  // Function to fetch teacher data from backend/API
  useEffect(() => {
    async function fetchTeachersFromBackend() {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = `${process.env.DOT || "http://192.168.236.15:3000"}/api/teacher?page=${currentPage}&limit=${itemsPerPage}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const apiResponse = await response.json();
        setTeachers(apiResponse.data.data);
      } catch (e) {
        console.error("Gagal mengambil daftar guru dari database:", e);
        setError("Gagal memuat daftar guru. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    }

    // Fetch teachers whenever currentPage changes (for pagination)
    fetchTeachersFromBackend();
  }, [currentPage]); // Re-fetch when page changes

  // Client-side totalPages calculation (works for small datasets,
  // but for full pagination of large data, total items should come from API)
  const totalItems = teachers.length; // If full data is fetched initially
  // Or if API sends totalItems: const totalItems = teachersData.totalItems;
  const totalPages = Math.ceil(totalItems / itemsPerPage);


  // No more need for currentTeachers slice here, as the API fetch handles pagination directly.
  // const currentTeachers = teachers; // Now `teachers` state only holds current page's data

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Optional: Scroll to top of content section when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full overflow-hidden">
      {/* Main Content Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-white shadow-inner-lg rounded-t-3xl -mt-16 relative z-10">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[...Array(itemsPerPage)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl shadow-md p-6 text-center animate-pulse-slow">
                <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
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
              onClick={() => window.location.reload()} // Simple reload to retry fetch
              className="px-8 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Coba Lagi
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && teachers.length === 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-center py-20 bg-blue-50 rounded-xl shadow-lg border border-blue-200"
          >
            <p className="text-2xl text-blue-700 font-semibold mb-4">Belum ada data guru yang tersedia saat ini.</p>
            <p className="text-lg text-gray-600">Mohon maaf, kami sedang memperbarui daftar ini.</p>
          </motion.div>
        )}

        {/* Grid Guru */}
        {!loading && !error && teachers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <AnimatePresence>
              {teachers.map((teacher, index) => (
                <motion.div
                  key={teacher.guru_id || teacher.name} // Unique key
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.08 }} // Staggered animation
                  className="bg-white rounded-xl shadow-xl overflow-hidden
                             transform transition-all duration-300 ease-in-out
                             hover:scale-[1.03] hover:shadow-2xl hover:border-blue-400 border border-transparent
                             group relative cursor-pointer"
                >
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>

                  <div className="w-full h-48 relative overflow-hidden">
                    <Image
                      src={teacher.image_url || '/images/default_avatar.png'}
                      alt={teacher.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-500 group-hover:scale-110"
                      quality={75}
                    />
                    {/* Dark overlay at the bottom for text contrast */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    {/* Role/Jabatan */}
                    <p className="absolute bottom-3 left-3 text-white text-sm md:text-base font-medium px-3 py-1 bg-blue-600 rounded-lg shadow-md z-20">
                      {teacher.jabatan || 'Tenaga Pengajar'}
                    </p>
                  </div>
                  <div className="p-6 text-center relative z-10">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight">{teacher.name}</h3>
                    <p className="text-base text-blue-700 font-semibold">{teacher.subject || 'Belum Ditentukan'}</p>
                    {/* You can add NIP or other details here if needed */}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && teachers.length > 0 && totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <motion.nav
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={textVariants} // Apply textVariants for animation
              className="inline-flex space-x-2 text-base rounded-lg bg-white p-3 shadow-xl border border-gray-100"
            >
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-6 py-2 rounded-lg transition-all duration-300 ease-in-out font-medium
                  ${currentPage === 1
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-blue-700 bg-white hover:bg-blue-50 hover:text-blue-800'
                  }`}
              >
                &larr; Sebelumnya
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`px-6 py-2 rounded-lg transition-all duration-300 ease-in-out font-semibold
                    ${currentPage === i + 1
                      ? 'bg-blue-600 text-white shadow-md transform scale-105'
                      : 'text-gray-700 bg-white hover:bg-blue-50 hover:text-blue-800'
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-6 py-2 rounded-lg transition-all duration-300 ease-in-out font-medium
                  ${currentPage === totalPages
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-blue-700 bg-white hover:bg-blue-50 hover:text-blue-800'
                  }`}
              >
                Berikutnya &rarr;
              </button>
            </motion.nav>
          </div>
        )}
      </section>
    </section>
  );
}