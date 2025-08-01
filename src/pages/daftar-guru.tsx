import { useState, useEffect, FC } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';

import type { Teacher } from '@/types/Teacher';

const DaftarGuruPage: FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
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

  const fetchTeachers = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/teachers');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Teacher[] = await response.json();
      setTeachers(data);

      setCurrentPage(1);
    } catch (err: unknown) {
      console.error("Failed to load teacher list:", err);
      if (err instanceof Error) {
        setError(`Gagal memuat daftar guru. Detail: ${err.message}`);
      } else {
        setError("Gagal memuat daftar guru. Silakan coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // --- PAGINATION LOGIC ---
  const totalPages: number = Math.ceil(teachers.length / itemsPerPage);
  const startIndex: number = (currentPage - 1) * itemsPerPage;
  const currentTeachers: Teacher[] = teachers.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <MainLayout>
        <section className="relative w-full py-24 min-h-[calc(100vh-120px)] flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="absolute inset-0 opacity-30 animate-blob-pulse">
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative text-5xl md:text-6xl font-extrabold text-center text-indigo-700 mb-8 animate-pulse drop-shadow-lg"
          >
            Daftar Guru
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="relative text-xl text-center text-gray-700"
          >
            Memuat daftar pendidik inspiratif...
          </motion.p>
        </section>
      </MainLayout>
    );
  }

  // --- ERROR STATE ---
  if (error) {
    return (
      <MainLayout>
        <section className="relative container mx-auto px-4 py-24 min-h-[calc(100vh-120px)] flex flex-col justify-center items-center bg-red-50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-100 animate-gradient-xy"></div>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative text-5xl font-extrabold text-center text-red-800 mb-6 drop-shadow-md"
          >
            Terjadi Kesalahan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="relative text-xl text-center text-red-700 mb-8"
          >
            {error}
          </motion.p>
          <button
            onClick={fetchTeachers}
            className="px-8 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors duration-300 transform hover:scale-105 shadow-lg"
          >
            Coba Lagi
          </button>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
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
            className="text-lg sm:text-xl text-gray-800 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Kenali para pendidik hebat yang berdedikasi membimbing dan menginspirasi setiap siswa di SMKN 4 Mataram.
          </motion.p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-white shadow-inner-lg rounded-t-3xl -mt-16 relative z-10">
        {teachers.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="bg-white rounded-xl shadow-md p-10 text-center text-gray-700 border border-gray-200"
          >
            <p className="text-xl font-semibold mb-2">Belum ada data guru yang tersedia saat ini.</p>
            <p className="text-base text-gray-500">Kami sedang bekerja untuk segera memperbarui daftar ini. Mohon bersabar!</p>
          </motion.div>
        ) : (
          <>
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
              {currentTeachers.map((teacher, index) => (
                <motion.div
                  key={teacher.id} // ID harus unik
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-xl overflow-hidden
                             transform transition-all duration-300 ease-in-out
                             hover:scale-[1.03] hover:shadow-2xl hover:border-blue-400 border border-transparent
                             group relative cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>

                  <div className="w-full h-[180px] relative overflow-hidden">
                    <Image
                      src={teacher.image || '/images/default_avatar.png'} // Menggunakan 'image'
                      alt={teacher.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60"></div>
                    <p className="absolute bottom-3 left-3 text-white text-sm md:text-base font-medium px-3 py-1 bg-blue-600 rounded-lg shadow-md z-20">
                      {teacher.position || 'Tenaga Pengajar'} {/* Menggunakan 'position' */}
                    </p>
                  </div>

                  <div className="p-6 text-center relative z-10">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight">{teacher.name}</h3>
                    <p className="text-base md:text-lg text-blue-700 font-semibold mb-2">{teacher.subject}</p>
                    <p className="text-sm text-gray-600">NIP: {teacher.nip || '-'}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-16">
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
          </>
        )}
      </section>
    </MainLayout>
  );
};

export default DaftarGuruPage;