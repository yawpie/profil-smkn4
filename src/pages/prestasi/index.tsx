import React, { useState, useEffect, FC, useCallback } from "react";
import MainLayout from "../../components/layout/MainLayout";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import type { Achievement, AchievementsApiEnvelope } from "@/types/Achievement";
import { apiGet } from "@/utils/apiClient";

// Helper function to format dates
const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string");
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
};

// Helper function to safely truncate text
const getTruncatedText = (
  text: string | null | undefined,
  maxLength: number
): string => {
  if (text === null || text === undefined) {
    return "";
  }
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const AchievementsPage: FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 10;

  // Framer Motion Variants
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
      transition: { duration: 0.4, ease: "easeOut", delay: 0.2 },
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

  // Function to fetch achievements, wrapped in useCallback
  const fetchAchievements = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet<AchievementsApiEnvelope>(
        `/achievements/?page=${currentPage}&limit=${itemsPerPage}`
      );
      if (response) {
        const data: Achievement[] = response.data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description || "Description not available.",
          date: item.publishDate || "Date not available.",
          image: item.image_url || "/images/placeholder-achievement.png",
          publishDate: item.publishDate || "",
          content: item.content,
        }));
        setAchievements(data);

        // Set pagination info from response
        if (response.page) {
          setTotalPages(Math.ceil(response.total / itemsPerPage));
          setTotalItems(response.total || 0);
        }
      }
    } catch (err: unknown) {
      console.error("Failed to load achievements:", err);
      if (err instanceof Error) {
        setError(`Failed to load achievements list. Details: ${err.message}`);
      } else {
        setError("Failed to load achievements list. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        {/* Gen Z Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-gradient-to-br from-pink-500 to-red-500"></div>
          <div className="absolute bottom-10 left-1/4 w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500"></div>
          <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500"></div>

          {/* Geometric lines - Gen Z touch */}
          <div className="absolute top-1/3 left-1/2 w-1 h-20 bg-white opacity-20"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-1 bg-white opacity-20"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-12 bg-white opacity-20"></div>
        </div>

        <div className="relative container mx-auto px-6 sm:px-8 lg:px-12 py-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={headerVariants}
            className="max-w-5xl mx-auto text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-1 h-16 bg-gradient-to-b from-blue-500 to-purple-600"></div>
                <div className="text-center">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                    Student{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      Achievements
                    </span>
                  </h1>
                </div>
                <div className="w-1 h-16 bg-gradient-to-b from-purple-600 to-pink-500"></div>
              </div>
            </div>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8"
            >
              Discover our students' inspiring achievements and accomplishments
              at local, national, and international levels that demonstrate
              excellence and dedication.
            </motion.p>

            {/* Achievement Stats - Gen Z touch */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              <div className="text-center border-l border-slate-700 pl-6 first:border-l-0 first:pl-0">
                <div className="text-2xl font-bold text-white">
                  {achievements.length}
                </div>
                <div className="text-sm text-slate-400 uppercase tracking-wide">
                  Total Achievements
                </div>
              </div>
              <div className="text-center border-l border-slate-700 pl-6">
                <div className="text-2xl font-bold text-white">
                  {new Date().getFullYear()}
                </div>
                <div className="text-sm text-slate-400 uppercase tracking-wide">
                  Current Year
                </div>
              </div>
              <div className="text-center border-l border-slate-700 pl-6">
                <div className="text-2xl font-bold text-white">Excellence</div>
                <div className="text-sm text-slate-400 uppercase tracking-wide">
                  Standard
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom border with gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="bg-white py-20">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto text-center mb-12">
              <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 animate-spin mx-auto mb-4"></div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                Loading Achievements
              </h2>
              <p className="text-slate-600">
                Please wait while we fetch the latest achievements...
              </p>
            </div>

            {/* Loading Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-50 border border-slate-200 overflow-hidden animate-pulse"
                >
                  <div className="w-full h-48 bg-slate-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-slate-200 mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200"></div>
                      <div className="h-4 bg-slate-200 w-11/12"></div>
                      <div className="h-4 bg-slate-200 w-3/4"></div>
                    </div>
                    <div className="h-3 bg-slate-200 w-1/3 mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Error State */}
      {!loading && error && (
        <section className="bg-white py-20">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <div className="max-w-md mx-auto text-center bg-red-50 border border-red-200 p-8">
              <div className="w-16 h-16 bg-red-100 mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
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
              <motion.h2
                initial="hidden"
                animate="visible"
                variants={textVariants}
                className="text-xl font-semibold text-red-900 mb-3"
              >
                System Error
              </motion.h2>
              <motion.p
                initial="hidden"
                animate="visible"
                variants={textVariants}
                className="text-red-700 mb-6"
              >
                {error}
              </motion.p>
              <button
                onClick={fetchAchievements}
                className="px-6 py-3 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && !error && achievements.length === 0 && (
        <section className="bg-white py-20">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <div className="max-w-md mx-auto text-center bg-slate-50 border border-slate-200 p-12">
              <div className="w-16 h-16 bg-slate-100 mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <motion.h2
                initial="hidden"
                animate="visible"
                variants={textVariants}
                className="text-xl font-semibold text-slate-900 mb-3"
              >
                No Achievements Available
              </motion.h2>
              <motion.p
                initial="hidden"
                animate="visible"
                variants={textVariants}
                className="text-slate-600"
              >
                We're preparing amazing achievements to showcase. Please check
                back soon!
              </motion.p>
            </div>
          </div>
        </section>
      )}

      {/* Achievements Grid */}
      {!loading && !error && achievements.length > 0 && (
        <section className="bg-white py-20">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            {/* Section Header */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={textVariants}
              className="max-w-4xl mx-auto text-center mb-16"
            >
              <div className="flex justify-center mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-blue-500"></div>
                  <div className="w-3 h-3 bg-purple-500"></div>
                  <div className="w-3 h-3 bg-pink-500"></div>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Achievement Portfolio
              </h2>
              <p className="text-slate-600 text-lg">
                Comprehensive showcase of student excellence and institutional
                pride.
              </p>
            </motion.div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-slate-200 shadow-sm overflow-hidden
                           transform transition-all duration-300 ease-in-out
                           hover:shadow-lg hover:border-slate-300
                           group cursor-pointer"
                >
                  <Link href={`/prestasi/${achievement.id}`}>
                    <div className="relative">
                      {/* Image Container */}
                      <div className="w-full h-48 relative bg-slate-100">
                        <Image
                          src={
                            achievement.image ||
                            "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1470&auto=format&fit=crop"
                          }
                          alt={achievement.title}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>

                        {/* Date Badge */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 border border-slate-200">
                          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                            {formatDate(achievement.publishDate)}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                          {getTruncatedText(achievement.description, 120)}
                        </p>

                        {/* Read More Link */}
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group-hover:underline transition-colors text-sm">
                            Read More
                            <svg
                              className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
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
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

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
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA Section - Gen Z Touch */}
      {!loading && !error && achievements.length > 0 && (
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-8 left-8 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600"></div>
            <div className="absolute bottom-8 right-8 w-20 h-20 bg-gradient-to-br from-pink-500 to-orange-500"></div>
          </div>

          <div className="relative container mx-auto px-6 sm:px-8 lg:px-12">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={textVariants}
              >
                <div className="flex justify-center mb-6">
                  <div className="flex space-x-2">
                    <div className="w-4 h-4 bg-blue-500"></div>
                    <div className="w-4 h-4 bg-purple-500"></div>
                    <div className="w-4 h-4 bg-pink-500"></div>
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  Inspired by Excellence?
                </h2>
                <p className="text-slate-300 mb-8 text-lg">
                  Join our community of high achievers and discover your
                  potential for greatness.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200">
                    Learn More About Us
                  </button>
                  <button className="px-8 py-4 border border-white text-white hover:bg-white hover:text-slate-900 font-medium transition-all duration-200">
                    Contact Admissions
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
};

export default AchievementsPage;
