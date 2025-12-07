// pages/pengumuman/index.tsx
import { useState, useEffect, FC, useCallback } from "react";
import Link from "next/link";
import MainLayout from "../../components/layout/MainLayout";
import { motion, AnimatePresence, type Variants } from "framer-motion";

import type {
  Announcement,
  AnnouncementApi,
  AnnouncementsApiEnvelope,
} from "@/types/Announcement";
import { apiGet, type ApiError } from "@/utils/apiClient";

const Pengumuman: FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 10;

  // Framer Motion Variants
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

  const mainCardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Function to fetch announcements from backend/API
  const fetchAnnouncementsFromBackend = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<AnnouncementsApiEnvelope>(
        `/announcement/?page=${currentPage}&limit=${itemsPerPage}`
      );
      const rawItems: AnnouncementApi[] = res.data;

      const mapped: Announcement[] = rawItems.map((item) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        publishDate: new Date(item.date).toISOString(),
        status: item.status === "PUBLISHED" ? "Published" : "Draft",
        image: item.image_url,
      }));

      const publishedAnnouncements = mapped.filter(
        (ann) => ann.status === "Published"
      );
      const sortedData = publishedAnnouncements.sort(
        (a, b) =>
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      );

      setAnnouncements(sortedData);

      // Extract pagination info from response
      if (res.page) {
        setTotalPages(Math.ceil(res.total / itemsPerPage));
        setTotalItems(res.total || 0);
      }
    } catch (e: unknown) {
      console.error("Gagal mengambil pengumuman:", e);
      const apiError = e as ApiError;
      if (apiError?.message) {
        setError(`Gagal memuat pengumuman. Detail: ${apiError.message}`);
      } else if (e instanceof Error) {
        setError(`Gagal memuat pengumuman. Detail: ${e.message}`);
      } else {
        setError("Gagal memuat pengumuman. Silakan coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchAnnouncementsFromBackend();
  }, [fetchAnnouncementsFromBackend]);

  const mainAnnouncement = announcements.length > 0 ? announcements[0] : null;
  const otherAnnouncements =
    announcements.length > 1 ? announcements.slice(1) : [];

  const getAnnouncementLink = (announcement: Announcement) => {
    return `/pengumuman/${announcement.id}`;
  };

  const getTruncatedContent = (content: string, summary?: string) => {
    return summary || content.substring(0, 120) + "...";
  };

  return (
    <MainLayout>
      {/* Hero Section - Professional Design */}
      <section className="relative w-full py-20 md:py-24 lg:py-28 overflow-hidden bg-slate-900">
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-600 transform rotate-12"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-slate-600 transform -rotate-12"></div>
          <div className="absolute bottom-10 left-1/4 w-16 h-16 bg-blue-500 transform rotate-45"></div>
          <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-slate-500 transform -rotate-45"></div>
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
                <div className="w-1 h-12 bg-blue-500 mr-4"></div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                  Pengumuman Resmi
                </h1>
                <div className="w-1 h-12 bg-blue-500 ml-4"></div>
              </div>
              <div className="w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
            </motion.div>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={textVariants}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
            >
              Informasi terkini dan pengumuman resmi dari SMKN 4 Mataram
            </motion.p>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="bg-slate-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-center text-slate-800 mb-12">
              Memuat Pengumuman...
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white shadow-lg p-8 animate-pulse">
                <div className="h-4 bg-slate-200 w-1/4 mb-4"></div>
                <div className="h-8 bg-slate-200 w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-200 w-full mb-2"></div>
                <div className="h-4 bg-slate-200 w-11/12 mb-4"></div>
                <div className="h-4 bg-slate-200 w-1/3"></div>
              </div>
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white shadow-md p-6 animate-pulse">
                    <div className="h-3 bg-slate-200 w-1/4 mb-3"></div>
                    <div className="h-6 bg-slate-200 w-3/4 mb-3"></div>
                    <div className="h-4 bg-slate-200 w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Error State */}
      {!loading && error && (
        <section className="bg-slate-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-red-50 border-l-4 border-red-500 p-8">
              <motion.p
                initial="hidden"
                animate="visible"
                variants={textVariants}
                className="text-lg text-red-800 font-semibold mb-4"
              >
                {error}
              </motion.p>
              <button
                onClick={fetchAnnouncementsFromBackend}
                className="px-6 py-3 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors duration-200"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && !error && announcements.length === 0 && (
        <section className="bg-slate-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-blue-50 border-l-4 border-blue-500 p-8 text-center">
              <motion.p
                initial="hidden"
                animate="visible"
                variants={textVariants}
                className="text-lg text-blue-800 font-semibold mb-3"
              >
                Belum ada pengumuman tersedia
              </motion.p>
              <p className="text-slate-600">
                Nantikan informasi terbaru dari kami
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      {!loading && !error && announcements.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Announcement */}
              {mainAnnouncement && (
                <motion.article
                  key={mainAnnouncement.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={mainCardVariants}
                  className="lg:col-span-2 bg-white shadow-lg border-l-4 border-blue-600 p-8 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 uppercase tracking-wider">
                      Pengumuman Utama
                    </span>
                  </div>

                  <time className="text-sm text-slate-500 font-medium block mb-3">
                    {new Date(mainAnnouncement.publishDate).toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </time>

                  <Link
                    href={getAnnouncementLink(mainAnnouncement)}
                    className="block group"
                  >
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                      {mainAnnouncement.title}
                    </h2>
                  </Link>

                  <p className="text-slate-700 mb-6 leading-relaxed line-clamp-4">
                    {getTruncatedContent(
                      mainAnnouncement.content,
                      mainAnnouncement.summary
                    )}
                  </p>

                  <Link
                    href={getAnnouncementLink(mainAnnouncement)}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold group"
                  >
                    Baca Selengkapnya
                    <svg
                      className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
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
                  </Link>
                </motion.article>
              )}

              {/* Other Announcements */}
              <aside className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6 pb-2 border-b-2 border-slate-200">
                  Pengumuman Lainnya
                </h3>

                <AnimatePresence>
                  {otherAnnouncements.map((announcement, index) => (
                    <motion.article
                      key={announcement.id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      variants={cardVariants}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white shadow-md border-l-2 border-slate-300 p-6 hover:shadow-lg hover:border-blue-400 transition-all duration-200"
                    >
                      <time className="text-xs text-slate-500 font-medium uppercase tracking-wide block mb-2">
                        {new Date(announcement.publishDate).toLocaleDateString(
                          "id-ID",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </time>

                      <Link
                        href={getAnnouncementLink(announcement)}
                        className="block group"
                      >
                        <h4 className="text-base font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                          {announcement.title}
                        </h4>
                      </Link>

                      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {getTruncatedContent(
                          announcement.content,
                          announcement.summary
                        )}
                      </p>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </aside>
            </div>
          </div>
        </section>)}

        {/* Pagination */}
        {totalPages > 1 && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-6 sm:px-8 lg:px-12">
              <div className="flex items-center justify-center">
                {/* Pagination Controls */}
                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="hidden sm:flex items-center space-x-1">
                    {(() => {
                      const pages = [];
                      const maxVisible = 7;

                      if (totalPages <= maxVisible) {
                        for (let i = 1; i <= totalPages; i++) {
                          pages.push(i);
                        }
                      } else {
                        pages.push(1);
                        let start = Math.max(2, currentPage - 1);
                        let end = Math.min(totalPages - 1, currentPage + 1);

                        if (currentPage <= 3) {
                          end = 5;
                        }
                        if (currentPage >= totalPages - 2) {
                          start = totalPages - 4;
                        }

                        if (start > 2) {
                          pages.push(-1);
                        }
                        for (let i = start; i <= end; i++) {
                          pages.push(i);
                        }
                        if (end < totalPages - 1) {
                          pages.push(-2);
                        }
                        pages.push(totalPages);
                      }

                      return pages.map((page, index) => {
                        if (page < 0) {
                          return (
                            <span
                              key={`ellipsis-${index}`}
                              className="px-3 py-2 text-gray-500"
                            >
                              ...
                            </span>
                          );
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                              currentPage === page
                                ? "bg-blue-600 text-white shadow-sm"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      });
                    })()}
                  </div>

                  {/* Mobile Page Indicator */}
                  <div className="sm:hidden px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
                    {currentPage} / {totalPages}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(totalPages, prev + 1)
                      )
                    }
                    disabled={currentPage === totalPages}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                  >
                    Next
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      
      
    </MainLayout>
  );
};

export default Pengumuman;
