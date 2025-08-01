// src/pages/daftar-guru.tsx
"use client";

import Image from 'next/image';
import React, { useState, useEffect, FC, useCallback } from 'react'; // Import FC, useCallback
import Link from 'next/link';
import { motion, AnimatePresence, type Variants } from 'framer-motion'; // Import Framer Motion and type Variants
import type { ModalMessage } from '@/types/Teacher';
import type { Teacher } from '@/types/Teacher';

const DaftarGuruPage: FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalTeachersCount, setTotalTeachersCount] = useState<number>(0); // Total count from API
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<ModalMessage | null>(null);

  const itemsPerPage: number = 8; 
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

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  // Fungsi untuk mengambil data guru dari backend/API
  const fetchTeachersFromBackend = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl: string = `/api/teachers`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Teacher[] = await response.json();
      
      setTeachers(data);
      setTotalTeachersCount(data.length); // Total count diambil dari panjang data yang diterima
      
      setCurrentPage(1); 
    } catch (e: unknown) {
      console.error("Gagal mengambil daftar guru dari database:", e);
      if (e instanceof Error) {
        setError(`Gagal memuat daftar guru. Detail: ${e.message}`);
        setModalMessage({ message: `Gagal memuat daftar guru. Detail: ${e.message}`, type: "error" });
      } else {
        setError("Gagal memuat daftar guru. Silakan coba lagi nanti.");
        setModalMessage({ message: "Gagal memuat daftar guru. Silakan coba lagi nanti.", type: "error" });
      }
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  }, []); // Dependensi kosong karena fungsi ini hanya bergantung pada API endpoint

  useEffect(() => {
    // Fetch teachers when component mounts
    fetchTeachersFromBackend();
  }, [fetchTeachersFromBackend]); // Re-fetch when fetchTeachersFromBackend changes (only once due to useCallback)

  // Calculate total pages based on totalTeachersCount
  const totalPages: number = Math.ceil(totalTeachersCount / itemsPerPage);

  // Get teachers for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTeachers = teachers.slice(startIndex, startIndex + itemsPerPage);


  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCloseModal = () => {
    setShowErrorModal(false);
    setModalMessage(null);
  };

  return (
    <section className="relative w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-28 lg:py-36 overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
        <div className="absolute inset-0 opacity-30 animate-blob-pulse">
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
            Daftar <span className="text-blue-600">Guru</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={textVariants}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-800 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Kenali para pendidik hebat yang berdedikasi membimbing dan menginspirasi setiap siswa di SMKN 4 Mataram.
          </motion.p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-white shadow-inner-lg rounded-t-3xl -mt-16 relative z-10">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[...Array(itemsPerPage)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl shadow-md p-6 text-center animate-pulse">
                <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State (using custom modal) */}
        {showErrorModal && modalMessage && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center">
              <p className={`text-lg font-semibold mb-4 ${modalMessage.type === 'error' ? 'text-red-600' : 'text-blue-600'}`}>
                {modalMessage.message}
              </p>
              <button
                onClick={handleCloseModal}
                className={`px-6 py-2 rounded-lg text-white transition ${modalMessage.type === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                Tutup
              </button>
            </div>
          </div>
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
              {currentTeachers.map((teacher, index) => (
                <motion.div
                  key={teacher.id} // Gunakan 'teacher.id' sebagai key
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white rounded-xl shadow-xl overflow-hidden
                             transform transition-all duration-300 ease-in-out
                             hover:scale-[1.03] hover:shadow-2xl hover:border-blue-400 border border-transparent
                             group relative cursor-pointer"
                >
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>

                  <div className="w-full h-48 relative overflow-hidden">
                    <Image
                      src={teacher.image || 'https://placehold.co/400x300/cccccc/333333?text=No+Image'} // Gunakan 'teacher.image'
                      alt={teacher.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-500 group-hover:scale-110"
                      quality={75}
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://placehold.co/400x300/cccccc/333333?text=Image+Error';
                      }}
                    />
                    {/* Dark overlay at the bottom for text contrast */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    {/* Role/Jabatan */}
                    <p className="absolute bottom-3 left-3 text-white text-sm md:text-base font-medium px-3 py-1 bg-blue-600 rounded-lg shadow-md z-20">
                      {teacher.position || 'Tenaga Pengajar'} {/* Gunakan 'teacher.position' */}
                    </p>
                  </div>
                  <div className="p-6 text-center relative z-10">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight">{teacher.name}</h3>
                    <p className="text-base text-blue-700 font-semibold">{teacher.subject || 'Belum Ditentukan'}</p>
                    {/* Menampilkan NIP jika ada */}
                    {teacher.nip && <p className="text-sm text-gray-600">NIP: {teacher.nip}</p>}
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
              variants={textVariants}
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
};

export default DaftarGuruPage;