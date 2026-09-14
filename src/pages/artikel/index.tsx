// pages/artikel/index.tsx
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import MainLayout from "../../components/layout/MainLayout";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import type { Article, ArticleApi, ArticlesApiEnvelope } from "@/types/Article";
import { apiGet } from "@/utils/apiClient";
import RichTextRenderer from "@/components/RichTextRenderer";

// Helper function to safely get a truncated text
const getTruncatedText = (
  text: string | null | undefined,
  maxLength: number
): string => {
  if (text === null || text === undefined) {
    return "";
  }
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const ArtikelPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
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

  // Function to fetch articles from backend/API
  const fetchArticles = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet<ArticlesApiEnvelope>(
        `/articles/?page=${currentPage}&limit=${itemsPerPage}`
      );
      const data: ArticleApi[] = response.data;
      // const data: Article[] = await response.json();
      const mapped: Article[] = data.map((item) => ({
        id: item.articles_id,
        title: item.title,
        image: item.image_url || "/images/placeholder-article.png",
        content: item.content,
        author: item.admin?.username || "Admin",
        publishDate: item.published_date || "",
      }));
      // Sort by publishDate
      const sortedData = mapped.sort((a, b) => {
        const dateA = new Date(a.publishDate).getTime();
        const dateB = new Date(b.publishDate).getTime();
        return dateB - dateA;
      });
      setArticles(sortedData);

      if (response.page) {
        setTotalPages(Math.ceil(response.total / itemsPerPage));
        setTotalItems(response.total || 0);
      }
    } catch (e: unknown) {
      console.error("Failed to fetch articles:", e);
      if (e instanceof Error) {
        setError(`Gagal memuat artikel. Detail: ${e.message}`);
      } else {
        setError("Gagal memuat artikel. Silakan coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

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
                    Artikel & <span className="text-blue-400">Publikasi</span>
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
              Informasi terkini, berita, dan artikel edukatif dari SMKN 4
              Mataram
            </motion.p>
          </div>
        </div>

        {/* Bottom border with gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-slate-500 to-blue-500">
          <div className="absolute top-0 left-0 w-2 h-2 bg-blue-600"></div>
          <div className="absolute top-0 right-0 w-2 h-2 bg-blue-600"></div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="bg-slate-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-center text-slate-800 mb-12">
              Memuat Artikel...
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white shadow-md p-6 animate-pulse">
                  <div className="w-full h-40 bg-slate-200 mb-4"></div>
                  <div className="h-6 bg-slate-200 w-3/4 mb-3"></div>
                  <div className="h-4 bg-slate-200 w-1/2 mb-2"></div>
                  <div className="h-4 bg-slate-200 w-full mb-2"></div>
                  <div className="h-4 bg-slate-200 w-11/12 mb-4"></div>
                  <div className="h-4 bg-slate-200 w-1/3"></div>
                </div>
              ))}
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
                Gagal memuat artikel: {error}
              </motion.p>
              <button
                onClick={fetchArticles}
                className="px-6 py-3 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors duration-200"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && !error && articles.length === 0 && (
        <section className="bg-slate-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-blue-50 border-l-4 border-blue-500 p-8 text-center">
              <motion.p
                initial="hidden"
                animate="visible"
                variants={textVariants}
                className="text-lg text-blue-800 font-semibold mb-3"
              >
                Belum ada artikel tersedia
              </motion.p>
              <p className="text-slate-600">
                Nantikan publikasi terbaru dari kami
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      {!loading && !error && articles.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={textVariants}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                Artikel & Berita Terbaru
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Menampilkan artikel terbaru dari berbagai kegiatan dan informasi
                sekolah
              </p>
            </motion.div>

            {/* Articles Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {articles.map((article, index) => (
                  <motion.article
                    key={article.id ?? `article-${index}`}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                  >
                    {/* Image Container */}
                    {article.image && (
                      <div className="w-full h-48 relative overflow-hidden bg-slate-100">
                        <Image
                          src={article.image}
                          alt={article.title}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      <div className="mb-3">
                        <time className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                          {new Date(article.publishDate).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                          {article.author && (
                            <span className="ml-2">oleh {article.author}</span>
                          )}
                        </time>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-700 transition-colors duration-200">
                        {article.title}
                      </h3>
                          <RichTextRenderer content={getTruncatedText(article.content, 120)} className="text-sm text-slate-600 mb-4 leading-relaxed line-clamp-3" />
                      {/* <p className="text-sm text-slate-600 mb-4 leading-relaxed line-clamp-3">
                        {getTruncatedText(article.content, 120)}
                      </p> */}

                      <Link
                        href={`/artikel/${article.slug || article.id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm group"
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
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center">
                <div className="flex items-center space-x-2">
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
                    Sebelumnya
                  </button>

                  <div className="hidden sm:flex items-center space-x-1">
                    {(() => {
                      const pages = [] as number[];
                      const maxVisible = 7;

                      if (totalPages <= maxVisible) {
                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                      } else {
                        pages.push(1);
                        let start = Math.max(2, currentPage - 1);
                        let end = Math.min(totalPages - 1, currentPage + 1);

                        if (currentPage <= 3) end = 5;
                        if (currentPage >= totalPages - 2)
                          start = totalPages - 4;

                        if (start > 2) pages.push(-1);
                        for (let i = start; i <= end; i++) pages.push(i);
                        if (end < totalPages - 1) pages.push(-2);
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

                  <div className="sm:hidden px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
                    {currentPage} / {totalPages}
                  </div>

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
                    Selanjutnya
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
            )}
          </div>
        </section>
      )}
    </MainLayout>
  );
};

export default ArtikelPage;
