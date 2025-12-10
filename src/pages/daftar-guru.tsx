import { useState, useEffect, FC } from "react";
import MainLayout from "../components/layout/MainLayout";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";

import type { Teacher, TeacherApi, TeachersApiEnvelope } from "@/types/Teacher";
import { apiGet, type ApiError } from "@/utils/apiClient";

const DaftarGuruPage: FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 8;

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const fetchTeachers = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<TeachersApiEnvelope>("/teachers/");
      const rawItems: TeacherApi[] = res.data;

      const mapped: Teacher[] = rawItems.map((item) => ({
        id: item.guru_id,
        name: item.name,
        image: item.image_url || "/images/default_avatar.png",
        subject: item.jabatan,
        nip: item.nip,
        position: item.jabatan,
      }));

      setTeachers(mapped);
      setCurrentPage(1);
    } catch (err: unknown) {
      console.error("Failed to load teacher list:", err);
      if ((err as ApiError)?.message) {
        setError(
          `Gagal memuat daftar guru. Detail: ${(err as ApiError).message}`
        );
      } else if (err instanceof Error) {
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

  // Pagination Logic
  const totalPages: number = Math.ceil(teachers.length / itemsPerPage);
  const startIndex: number = (currentPage - 1) * itemsPerPage;
  const currentTeachers: Teacher[] = teachers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Loading State
  if (loading) {
    return (
      <MainLayout>
        <section className="relative w-full py-20 min-h-[calc(100vh-120px)] flex flex-col justify-center items-center overflow-hidden bg-slate-900">
          {/* Geometric Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-blue-600 transform rotate-12"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-slate-600 transform -rotate-12"></div>
            <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-blue-500 transform rotate-45"></div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative text-3xl md:text-4xl font-bold text-center text-white mb-4"
          >
            Daftar Guru
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="relative text-slate-300 text-center"
          >
            Memuat data pendidik...
          </motion.p>
          <div className="mt-6 w-8 h-8 border-2 border-slate-400 border-t-white animate-spin"></div>
        </section>
      </MainLayout>
    );
  }

  // Error State
  if (error) {
    return (
      <MainLayout>
        <section className="relative container mx-auto px-4 py-16 min-h-[calc(100vh-120px)] flex flex-col justify-center items-center bg-slate-50">
          <div className="max-w-2xl mx-auto bg-red-50 border-l-4 border-red-500 p-8">
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-2xl font-bold text-center text-red-800 mb-4"
            >
              Terjadi Kesalahan
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
              className="text-red-700 text-center mb-6"
            >
              {error}
            </motion.p>
            <div className="text-center">
              <button
                onClick={fetchTeachers}
                className="px-6 py-3 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors duration-200"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section - Professional Design */}
      <section className="relative w-full py-20 md:py-24 lg:py-28 overflow-hidden bg-slate-900">
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-blue-600 transform rotate-12"></div>
          <div className="absolute top-32 right-16 w-32 h-32 bg-slate-600 transform -rotate-12"></div>
          <div className="absolute bottom-16 left-1/3 w-24 h-24 bg-blue-500 transform rotate-45"></div>
          <div className="absolute bottom-32 right-1/4 w-28 h-28 bg-slate-500 transform -rotate-45"></div>

          {/* Additional geometric elements */}
          <div className="absolute top-1/4 left-1/2 w-2 h-16 bg-white opacity-20 transform rotate-12"></div>
          <div className="absolute top-1/3 right-1/3 w-16 h-2 bg-white opacity-20 transform -rotate-12"></div>
          <div className="absolute bottom-1/3 left-1/4 w-2 h-12 bg-white opacity-20 transform rotate-45"></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={headerVariants}
              className="mb-6"
            >
              <div className="flex justify-center mb-4">
                <div className="w-1 h-16 bg-blue-500 mr-6"></div>
                <div className="text-center">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                    Daftar <span className="text-blue-400">Guru</span>
                  </h1>
                </div>
                <div className="w-1 h-16 bg-blue-500 ml-6"></div>
              </div>
              <div className="w-32 h-1 bg-blue-500 mx-auto mb-6"></div>
            </motion.div>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={textVariants}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
            >
              Para pendidik profesional yang berdedikasi membentuk generasi
              unggul
            </motion.p>
          </div>
        </div>
      </section>

      {/* Organizational Chart Section */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                Struktur Organisasi
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
            </div>
            <div className="relative w-full bg-white shadow-lg border border-slate-200 p-4">
              <Image
                src="/images/Organisasi.png"
                alt="Struktur Organisasi SMKN 4 Mataram"
                width={1600}
                height={900}
                layout="responsive"
                objectFit="contain"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {teachers.length === 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="max-w-2xl mx-auto bg-slate-50 border-l-4 border-slate-400 p-8 text-center"
            >
              <p className="text-lg font-semibold text-slate-800 mb-2">
                Belum ada data guru tersedia
              </p>
              <p className="text-slate-600">
                Data sedang dalam proses pembaruan
              </p>
            </motion.div>
          ) : (
            <>
              {/* Section Header */}
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Tim Pendidik Profesional
                </h2>
                <div className="w-24 h-1 bg-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  Menampilkan {teachers.length} pendidik berkualitas yang
                  berkomitmen pada keunggulan pendidikan
                </p>
              </div>

              {/* Teachers Grid */}
              <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
                {currentTeachers.map((teacher, index) => (
                  <motion.div
                    key={teacher.id}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white shadow-lg border border-slate-200 overflow-hidden
                              hover:shadow-xl transition-all duration-300 group w-full max-w-sm"
                  >
                    {/* Image Container */}
                    <div className="w-full h-48 relative overflow-hidden bg-slate-100">
                      <Image
                        src={teacher.image || "/images/default_avatar.png"}
                        alt={teacher.name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 left-3">
                        <span className="inline-block bg-blue-600 text-white text-xs font-medium px-2 py-1 uppercase tracking-wide">
                          {teacher.position || "Guru"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">
                        {teacher.name}
                      </h3>
                      <p className="text-blue-700 font-semibold text-sm mb-2">
                        {teacher.subject}
                      </p>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">
                        NIP: {teacher.nip || "Tidak Tersedia"}
                      </p>
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
                    className="inline-flex bg-white shadow-lg border border-slate-200"
                  >
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 border-r border-slate-200 font-medium transition-colors duration-200
                        ${
                          currentPage === 1
                            ? "text-slate-400 bg-slate-50 cursor-not-allowed"
                            : "text-slate-700 bg-white hover:bg-slate-50"
                        }`}
                    >
                      &larr; Sebelumnya
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goToPage(i + 1)}
                        className={`px-4 py-2 border-r border-slate-200 last:border-r-0 font-medium transition-colors duration-200
                          ${
                            currentPage === i + 1
                              ? "bg-blue-600 text-white"
                              : "text-slate-700 bg-white hover:bg-slate-50"
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 font-medium transition-colors duration-200
                        ${
                          currentPage === totalPages
                            ? "text-slate-400 bg-slate-50 cursor-not-allowed"
                            : "text-slate-700 bg-white hover:bg-slate-50"
                        }`}
                    >
                      Berikutnya &rarr;
                    </button>
                  </motion.nav>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default DaftarGuruPage;
