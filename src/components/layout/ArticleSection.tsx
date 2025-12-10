import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, FC, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import type { Article, ArticleApi, ArticlesApiEnvelope } from "@/types/Article";
import { apiGet, type ApiError } from "@/utils/apiClient";

const getTruncatedText = (
  content: string,
  summary?: string,
  maxLength: number = 120
): string => {
  if (summary) {
    return summary.length > maxLength
      ? summary.substring(0, maxLength) + "..."
      : summary;
  }
  if (content === null || content === undefined) {
    return "";
  }
  return String(content).length > maxLength
    ? String(content).substring(0, maxLength) + "..."
    : String(content);
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string");
    }
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
};

const ArticleSection: FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Simplified Motion Variants
  const sectionHeaderVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
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
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const fetchArticlesFromBackend = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<ArticlesApiEnvelope>("/articles/");
      const rawItems: ArticleApi[] = res.data;

      const mapped: Article[] = rawItems.map((item) => ({
        id: item.articles_id,
        title: item.title,
        image: item.image_url ?? "/images/default_article.png",
        content: item.content,
        author: item.admin?.username ?? "Admin",
        publishDate: item.published_date ?? "",
        summary: undefined,
        slug: item.slug,
        status: item.status,
        categoryName: item.category?.name ?? null,
      }));

      const sorted = mapped.sort((a, b) => {
        const dateA = new Date(a.publishDate).getTime();
        const dateB = new Date(b.publishDate).getTime();
        return dateB - dateA;
      });

      setArticles(sorted.slice(0, 5));
    } catch (e: unknown) {
      console.error("Gagal mengambil artikel:", e);
      if ((e as ApiError)?.message) {
        setError(`Gagal memuat artikel. Detail: ${(e as ApiError).message}`);
      } else if (e instanceof Error) {
        setError(`Gagal memuat artikel. Detail: ${e.message}`);
      } else {
        setError("Gagal memuat artikel. Silakan coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticlesFromBackend();
  }, [fetchArticlesFromBackend]);

  const featuredArticle: Article | null =
    articles.length > 0 ? articles[0] : null;
  const smallArticles: Article[] =
    articles.length > 1 ? articles.slice(1, 5) : [];

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white border border-gray-200 shadow-lg mb-8">
      {/* Header */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionHeaderVariants}
        className="border-b border-gray-200 pb-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-blue-600"></div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Artikel Terbaru
          </h2>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Featured Article Skeleton */}
          <div className="lg:col-span-2 bg-gray-100 border border-gray-200 animate-pulse">
            <div className="w-full h-64 bg-gray-300"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-300 w-1/4 mb-2"></div>
              <div className="h-5 bg-gray-300 w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 w-1/2"></div>
            </div>
          </div>
          {/* Small Articles Skeleton */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 border border-gray-200 animate-pulse"
              >
                <div className="w-full h-32 bg-gray-300"></div>
                <div className="p-3">
                  <div className="h-3 bg-gray-300 w-1/3 mb-1"></div>
                  <div className="h-4 bg-gray-300 w-full mb-2"></div>
                  <div className="h-3 bg-gray-300 w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8 bg-red-50 border border-red-200">
          <p className="text-red-800 font-medium mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && articles.length === 0 && (
        <div className="text-center py-8 bg-gray-50 border border-gray-200">
          <p className="text-gray-600 font-medium">
            Belum ada artikel yang tersedia saat ini.
          </p>
        </div>
      )}

      {/* Main Article Grid */}
      {!loading && !error && articles.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Featured Article */}
          {featuredArticle && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="lg:col-span-2"
            >
              <Link
                href={`/artikel/${featuredArticle.id}`}
                className="block group bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative w-full h-64">
                  <Image
                    src={featuredArticle.image || "/images/default_article.png"}
                    alt={featuredArticle.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="group-hover:opacity-90 transition-opacity duration-300"
                    quality={80}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1">
                      FEATURED
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formatDate(featuredArticle.publishDate)}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors duration-200">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {getTruncatedText(
                      featuredArticle.content,
                      featuredArticle.summary
                    )}
                  </p>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Small Articles */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {smallArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={`/artikel/${article.slug || article.id}`}
                    className="block group bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 h-full"
                  >
                    <div className="relative w-full h-32">
                      <Image
                        src={article.image || "/images/default_article.png"}
                        alt={article.title}
                        fill
                        style={{ objectFit: "cover" }}
                        className="group-hover:opacity-90 transition-opacity duration-300"
                        quality={70}
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {formatDate(article.publishDate)}
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors duration-200 mb-1">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {getTruncatedText(article.content, article.summary, 80)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* View All Button */}
      {!loading && !error && articles.length > 0 && (
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <Link
            href="/artikel"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
          >
            <span>Lihat Semua Artikel</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      )}
    </section>
  );
};

export default ArticleSection;
