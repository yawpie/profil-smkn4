import Image from "next/image";
import React, { useState, useEffect, FC, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useRouter } from "next/router";
import type { ModalMessage } from "@/types/Teacher";
import type { Teacher, TeacherApi, TeachersApiEnvelope } from "@/types/Teacher";
import { apiGet, type ApiError } from "@/utils/apiClient";

const DaftarGuruPreview: FC = () => {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalTeachersCount, setTotalTeachersCount] = useState<number>(0);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<ModalMessage | null>(null);

  const maxPreviewItems: number = 4; // Maksimal 4 guru untuk preview

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
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

  const fetchTeachersFromBackend = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet<TeachersApiEnvelope>("/teachers/");

      const apiTeachers: TeacherApi[] = response.data;

      const mappedTeachers: Teacher[] = apiTeachers.map((t) => ({
        id: t.guru_id,
        name: t.name,
        image:
          t.image_url ||
          "https://placehold.co/400x300/6B7280/FFFFFF?text=Teacher",
        subject: t.jabatan,
        nip: t.nip,
        position: t.jabatan,
      }));

      setTeachers(mappedTeachers);
      setTotalTeachersCount(mappedTeachers.length);
    } catch (e: unknown) {
      console.error("Gagal mengambil daftar guru dari database:", e);
      if ((e as ApiError)?.message) {
        const message = `Gagal memuat daftar guru. Detail: ${
          (e as ApiError).message
        }`;
        setError(message);
        setModalMessage({ message, type: "error" });
      } else if (e instanceof Error) {
        const message = `Gagal memuat daftar guru. Detail: ${e.message}`;
        setError(message);
        setModalMessage({ message, type: "error" });
      } else {
        const message = "Gagal memuat daftar guru. Silakan coba lagi nanti.";
        setError(message);
        setModalMessage({ message, type: "error" });
      }
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachersFromBackend();
  }, [fetchTeachersFromBackend]);

  // Ambil hanya 4 guru pertama untuk preview
  const previewTeachers = teachers.slice(0, maxPreviewItems);

  const handleCloseModal = () => {
    setShowErrorModal(false);
    setModalMessage(null);
  };

  const handleViewMore = () => {
    router.push("/daftar-guru"); // Navigasi ke halaman daftar guru lengkap
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
              Tenaga Pengajar
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Staff pengajar profesional yang berpengalaman dan berkualifikasi
          </p>
          <div className="mt-4 bg-blue-600 text-white px-4 py-2 inline-block text-sm font-medium">
            Total: {totalTeachersCount} Pengajar
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
              {[...Array(maxPreviewItems)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 shadow-sm animate-pulse w-full max-w-sm"
                >
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 w-1/2 mb-2"></div>
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

          {/* Teacher Cards - Maksimal 4 */}
          {!loading && !error && teachers.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
                <AnimatePresence>
                  {previewTeachers.map((teacher, index) => (
                    <motion.div
                      key={teacher.id}
                      variants={cardVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 group w-full max-w-sm"
                    >
                      {/* Status Bar */}
                      <div className="h-1 bg-blue-600"></div>

                      {/* Image */}
                      <div className="w-full h-48 relative overflow-hidden bg-gray-100">
                        <Image
                          src={
                            teacher.image ||
                            "https://placehold.co/400x300/6B7280/FFFFFF?text=Teacher"
                          }
                          alt={teacher.name}
                          layout="fill"
                          objectFit="cover"
                          className="group-hover:opacity-90 transition-opacity duration-300"
                          quality={75}
                          onError={(
                            e: React.SyntheticEvent<HTMLImageElement, Event>
                          ) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "https://placehold.co/400x300/6B7280/FFFFFF?text=Error";
                          }}
                        />

                        {/* Position Badge */}
                        {teacher.position && (
                          <div className="absolute top-3 right-3 bg-white bg-opacity-90 text-gray-800 text-xs font-medium px-2 py-1 border border-gray-200">
                            {teacher.position}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors duration-200">
                          {teacher.name}
                        </h3>

                        {teacher.subject && (
                          <p className="text-sm text-gray-600 mb-2 font-medium">
                            {teacher.subject}
                          </p>
                        )}

                        {teacher.nip && (
                          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 inline-block border border-gray-200">
                            NIP: {teacher.nip}
                          </div>
                        )}

                        {/* Contact Info */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center text-xs text-gray-500">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <span>Staff Pengajar</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Lihat Lebih Banyak Button */}
              {totalTeachersCount > maxPreviewItems && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  variants={cardVariants}
                  className="text-center mt-12"
                >
                  <button
                    onClick={handleViewMore}
                    className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md group"
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
                  <p className="text-sm text-gray-500 mt-2">
                    Menampilkan {previewTeachers.length} dari{" "}
                    {totalTeachersCount} pengajar
                  </p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default DaftarGuruPreview;
