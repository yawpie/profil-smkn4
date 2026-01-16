"use client";

import { useState, useEffect, FC, useCallback } from "react";
import Head from "next/head";
import { motion, type Variants } from "framer-motion";
import JurusanCard from "@/components/Card/JurusanCard";
import MainLayout from "@/components/layout/MainLayout";
import type { Major, MajorApi, MajorsApiEnvelope } from "@/types/Major";
import { apiGet, type ApiError } from "@/utils/apiClient";
import ContentNotAvailableCard from "@/components/Beranda/NotAvailable";

const JurusanPage: FC = () => {
  const [jurusan, setJurusan] = useState<Major[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 10;

  const fetchJurusan = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet<MajorsApiEnvelope>(
        `/majors/?page=${currentPage}&limit=${itemsPerPage}`
      );
      const apiMajors: MajorApi[] = response.data;
      const mapped: Major[] = apiMajors.map((m) => ({
        id: m.id,
        name: m.name,
        description: m.description,
        image:
          m.image_url ||
          "https://placehold.co/600x400/6B7280/FFFFFF?text=Major",
      }));
      setJurusan(mapped);

      // Extract pagination info from response
      if (response.page) {
        setTotalPages(Math.ceil(response.total / itemsPerPage));
        setTotalItems(response.total || 0);
      }
    } catch (e: unknown) {
      console.error("Failed to fetch jurusan:", e);
      if ((e as ApiError)?.message) {
        setError(`Gagal memuat jurusan. Detail: ${(e as ApiError).message}`);
      } else if (e instanceof Error) {
        setError(`Gagal memuat jurusan. Detail: ${e.message}`);
      } else {
        setError("Gagal memuat jurusan. Silakan coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchJurusan();
  }, [fetchJurusan]);

  // Framer Motion variants for animations
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  if (loading) {
    return (
      <MainLayout>
        <section className="relative min-h-[calc(100vh-120px)] flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>

          {/* Geometric Loading Elements */}
          <div className="relative z-10 text-center space-y-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 bg-blue-600 animate-pulse"></div>
              <div
                className="w-4 h-4 bg-indigo-600 animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-4 h-4 bg-blue-600 animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-4"
            >
              <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
                Loading Programs
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium max-w-md mx-auto">
                Preparing your future career pathways...
              </p>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-20 left-20 w-32 h-32 border-l-4 border-t-4 border-blue-600/20"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 border-r-4 border-b-4 border-indigo-600/20"></div>
        </section>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <section className="relative min-h-[calc(100vh-120px)] flex flex-col justify-center items-center bg-gradient-to-br from-red-50 via-white to-orange-50">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-orange-600/5"></div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 text-center space-y-6 max-w-md mx-auto px-6"
          >
            <div className="w-16 h-16 bg-red-600 mx-auto flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-red-800 tracking-tight">
              System Error
            </h1>

            <div className="bg-red-100 border-l-4 border-red-600 p-4 text-left">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>

            <button
              onClick={fetchJurusan}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Retry Connection
            </button>
          </motion.div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head>
        <title>Academic Programs - SMKN 4 Mataram</title>
        <meta
          name="description"
          content="Discover our flagship academic programs at SMKN 4 Mataram designed for your future career success."
        />
        <meta
          name="keywords"
          content="SMKN 4 Mataram, jurusan, program keahlian, pendidikan vokasi"
        />
        <meta
          property="og:title"
          content="Academic Programs - SMKN 4 Mataram"
        />
        <meta
          property="og:description"
          content="Explore our comprehensive vocational programs designed for industry readiness."
        />
      </Head>

      {/* Hero Section - Modern & Sharp */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Geometric Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black/50 to-transparent"></div>
          <div className="absolute top-20 right-20 w-64 h-64 border-4 border-blue-400/20 transform rotate-45"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 border-4 border-indigo-400/20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/10"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Jurusan
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              Temukan program pendidikan vokasi yang selaras dengan kebutuhan
              industri untuk memulai karier Anda di bidang perhotelan, seni
              kuliner, dan teknologi fesyen.
            </motion.p>

            {/* CTA Elements */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <div className="flex items-center space-x-4 text-white/80 text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400"></div>
                  <span>Industry Certified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400"></div>
                  <span>Career Ready</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400"></div>
                  <span>Future Focused</span>
                </div>
              </div>
            </motion.div> */}
          </motion.div>
        </div>

        {/* Bottom Accent */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
      </section>

      {/* Programs Grid Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16 space-y-6"
          ></motion.div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-10">
            {jurusan.map((item: Major, index: number) => (
              <motion.div
                key={item.id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <JurusanCard
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  image={item.image}
                />
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-12 space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
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
          )}
          {!loading && !error && jurusan.length === 0 && (
            <ContentNotAvailableCard sectionVariants={sectionVariants} />
          )}
          {/* Bottom CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center mt-20 space-y-8"
          ></motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-0 w-64 h-64 bg-gradient-to-br from-blue-600/5 to-transparent"></div>
        <div className="absolute bottom-20 right-0 w-64 h-64 bg-gradient-to-tl from-indigo-600/5 to-transparent"></div>
      </section>
    </MainLayout>
  );
};

export default JurusanPage;
