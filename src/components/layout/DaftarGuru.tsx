import Image from "next/image";
import React, { useState, useEffect, FC, useCallback } from "react";
import { motion, type Variants } from "framer-motion";
import { useRouter } from "next/router";
import type { ModalMessage } from "@/types/Teacher";
import type { Teacher, TeacherApi, TeachersApiEnvelope } from "@/types/Teacher";
import { apiGet, type ApiError } from "@/utils/apiClient";
import paginate from "@/utils/paginate";
import Lightbox from "@/components/Lightbox";

interface DaftarGuruProps {
  /** Filter berdasarkan jabatan, contoh: "normada", "BK" */
  jabatan?: string;
  /** Judul section */
  title?: string;
  /** Deskripsi section */
  description?: string;
  /** Mode tampilan: "preview" untuk homepage (max items, tombol lihat lebih), "full" untuk halaman lengkap (pagination) */
  mode?: "preview" | "full";
  /** Jumlah item per halaman (mode full) atau max preview items (mode preview) */
  itemsPerPage?: number;
  /** Data guru yang sudah di-fetch (skip API call jika disediakan) */
  initialData?: Teacher[];
}

const DaftarGuru: FC<DaftarGuruProps> = ({
  jabatan = "normada",
  title = "Tenaga Pengajar",
  description = "Staff pengajar profesional yang berpengalaman dan berkualifikasi",
  mode = "preview",
  itemsPerPage = mode === "preview" ? 4 : 10,
  initialData,
}) => {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalTeachersCount, setTotalTeachersCount] = useState<number>(0);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<ModalMessage | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
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

  const fetchTeachers = useCallback(async (): Promise<void> => {
    // Skip fetch if initialData is provided
    if (initialData) {
      setTeachers(initialData);
      setTotalTeachersCount(initialData.length);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (jabatan) {
        queryParams.set("jabatan", jabatan);
      }
      // In preview mode, limit from API; in full mode, fetch all and paginate client-side
      if (mode === "preview") {
        queryParams.set("limit", String(itemsPerPage));
      }

      const response = await apiGet<TeachersApiEnvelope>(
        `/teachers?${queryParams.toString()}`
      );

      const apiTeachers: TeacherApi[] = response.data;

      const mappedTeachers: Teacher[] = apiTeachers.map((t) => ({
        id: t.guru_id,
        name: t.name,
        image: t.image_url || "/images/default_avatar.png",
        subject: t.mata_pelajaran || t.jabatan,
        nip: t.nip,
        position: t.jabatan,
        major_id: t.major_id,
      }));

      setTeachers(mappedTeachers);
      setTotalTeachersCount(response.total);
    } catch (e: unknown) {
      console.error("Gagal mengambil daftar guru:", e);
      let message = "Gagal memuat daftar guru. Silakan coba lagi nanti.";
      if ((e as ApiError)?.message) {
        message = `Gagal memuat daftar guru. Detail: ${(e as ApiError).message}`;
      } else if (e instanceof Error) {
        message = `Gagal memuat daftar guru. Detail: ${e.message}`;
      }
      setError(message);
      setModalMessage({ message, type: "error" });
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  }, [jabatan, itemsPerPage, mode, initialData]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // Pagination logic for full mode
  const paginated = paginate(teachers, currentPage, itemsPerPage);
  const displayTeachers = mode === "full" ? paginated.data : teachers;
  const totalPages = mode === "full" ? paginated.totalPages : 1;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCloseModal = () => {
    setShowErrorModal(false);
    setModalMessage(null);
  };

  const handleViewMore = () => {
    router.push("/daftar-guru");
  };

  return (
    <section className="bg-white py-16">
      {/* Header Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={headerVariants}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-1 h-12 bg-blue-600 mr-4"></div>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
              {title}
            </h2>
          </div>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
              {[...Array(itemsPerPage > 4 ? 4 : itemsPerPage)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 shadow-sm animate-pulse w-full flex flex-col sm:flex-row overflow-hidden"
                >
                  <div className="w-full sm:w-64 h-64 sm:h-72 bg-gray-300 flex-shrink-0"></div>
                  <div className="p-5 flex flex-col justify-center flex-1">
                    <div className="h-5 bg-gray-300 w-1/2 mb-3"></div>
                    <div className="h-3 bg-gray-300 w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error Modal */}
          {showErrorModal && modalMessage && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white border border-gray-300 shadow-lg p-6 max-w-md w-full"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Error
                  </h3>
                  <p className="text-gray-600 mb-6">{modalMessage.message}</p>
                  <button
                    onClick={handleCloseModal}
                    className="bg-blue-600 text-white px-6 py-2 font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Tutup
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && teachers.length === 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="text-center py-16 bg-gray-50 border border-gray-200"
            >
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tidak Ada Data
              </h3>
              <p className="text-gray-500">
                Belum ada data tenaga pengajar tersedia
              </p>
            </motion.div>
          )}

          {/* Teacher Cards */}
          {!loading && !error && teachers.length > 0 && (
            <>
              <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
                {displayTeachers.map((teacher, index) => (
                  <motion.div
                    key={teacher.id}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden w-full flex flex-col sm:flex-row"
                  >
                    {/* Image */}
                    <div
                      className="relative w-full sm:w-64 h-64 sm:h-72 flex-shrink-0 bg-gray-100 cursor-pointer"
                      onClick={() => teacher.image && setLightboxImage(teacher.image)}
                    >
                      <Image
                        src={teacher.image || "/images/default_avatar.png"}
                        alt={teacher.name}
                        layout="fill"
                        objectFit="cover"
                        quality={75}
                      />
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col justify-center border-t-4 sm:border-t-0 sm:border-l-4 border-blue-600">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {teacher.name}
                      </h3>

                      {teacher.nip && (
                        <p className="text-xs text-gray-500 flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          NIP: {teacher.nip}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Preview mode: "Lihat Lebih Banyak" button */}
              {mode === "preview" && totalTeachersCount > itemsPerPage && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  variants={cardVariants}
                  className="text-center mt-12"
                >
                  <button
                    onClick={handleViewMore}
                    className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md group cursor-pointer"
                  >
                    <span>Lihat Lebih Banyak</span>
                    <svg
                      className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                </motion.div>
              )}

              {/* Full mode: Pagination */}
              {mode === "full" && totalPages > 1 && (
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
      </div>

      <Lightbox imageUrl={lightboxImage} onClose={() => setLightboxImage(null)} />
    </section>
  );
};

export default DaftarGuru;
