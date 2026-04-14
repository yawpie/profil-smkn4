import { GetStaticProps, GetStaticPaths } from "next";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import type { Article, ArticleApi } from "@/types/Article";
import MainLayout from "../../components/layout/MainLayout";
import Head from "next/head";
import { apiGet } from "@/utils/apiClient";

// Animation variants for Framer Motion
const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const slideInVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

interface ArticleDetailPageProps {
  article: Article;
}

// Helper function to format date
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

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<ArticleDetailPageProps> = async (context) => {
  const id = context.params?.id as string;

  if (!id) {
    return { notFound: true };
  }

  try {
    const res = await apiGet<ArticleApi>(`/articles?id=${id}`);
    if (res) {
      const article: Article = {
        id: res.articles_id,
        title: res.title,
        image: res.image_url || "/images/placeholder-article.png",
        content: res.content,
        author: res.admin?.username || "Admin",
        publishDate: res.published_date || "",
        slug: res.slug,
        status: res.status,
        categoryName: res.category?.name || null,
      };

      return {
        props: { article },
        revalidate: 60, // ISR revalidate every 60 seconds
      };
    }
  } catch (error) {
    console.error("Error fetching article details at SSG:", error);
  }

  return { notFound: true };
};

const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ article }) => {
  return (
    <MainLayout>
      <Head>
        <title>{`${article.title} - SMKN 4 Mataram`}</title>
        <meta
          name="description"
          content={
            article.summary ||
            article.content?.substring(0, 160) ||
            `Detail artikel ${article.title} dari SMKN 4 Mataram.`
          }
        />
        <meta property="og:title" content={article.title} />
        <meta
          property="og:description"
          content={
            article.summary ||
            article.content?.substring(0, 160) ||
            `Detail artikel ${article.title} dari SMKN 4 Mataram.`
          }
        />
        {article.image && <meta property="og:image" content={article.image} />}
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`${
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
          }/artikel/${article.slug || article.id}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        {article.image && <meta name="twitter:image" content={article.image} />}
      </Head>

      <div className="bg-white text-gray-900 font-sans min-h-[calc(100vh-120px)]">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-b-8 border-blue-600">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
            >
              {/* Breadcrumb */}
              <motion.div
                className="mb-8 text-sm text-blue-200 font-semibold"
                initial="hidden"
                animate="visible"
                variants={slideInVariants}
              >
                <Link
                  href="/"
                  className="hover:text-white transition duration-200 uppercase tracking-widest"
                >
                  Beranda
                </Link>
                <span className="mx-4 text-blue-300 text-lg">|</span>
                <Link
                  href="/artikel"
                  className="hover:text-white transition duration-200 uppercase tracking-widest"
                >
                  Artikel
                </Link>
                <span className="mx-4 text-blue-300 text-lg">|</span>
                <span className="text-white font-bold uppercase tracking-widest">
                  Detail
                </span>
              </motion.div>

              {/* Article Title */}
              <motion.h1
                className="text-4xl sm:text-6xl font-bold text-white leading-tight mb-8 max-w-5xl"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {article.title}
              </motion.h1>

              {/* Article Meta */}
              <motion.div
                className="flex flex-col sm:flex-row sm:items-center gap-6 text-blue-200 text-base"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
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
                  </div>
                  <span className="font-semibold uppercase tracking-wide">
                    {formatDate(article.publishDate)}
                  </span>
                </div>
                {article.author && (
                  <>
                    <div className="hidden sm:block w-2 h-2 bg-blue-400"></div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-500 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
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
                      </div>
                      <span className="font-semibold uppercase tracking-wide">
                        {article.author}
                      </span>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Article Content */}
            <motion.div
              className="lg:col-span-4"
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
            >
              {/* Featured Image */}
              {article.image && (
                <motion.div
                  className="mb-12 bg-gray-100 border-4 border-gray-300 overflow-hidden shadow-2xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={1000}
                    height={500}
                    className="w-full h-80 sm:h-96 object-cover"
                    priority
                  />
                </motion.div>
              )}

              {/* Article Content */}
              <motion.div
                className="bg-white border-4 border-gray-200 p-12 sm:p-16 shadow-xl"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div
                  className="prose prose-xl max-w-none text-gray-700 leading-relaxed"
                  style={{
                    lineHeight: "1.8",
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        article.content ||
                        "<p>Konten artikel tidak tersedia.</p>",
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <div className="bg-gray-50 border-4 border-gray-300 p-8 sticky top-8 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-widest border-b-4 border-gray-400 pb-4">
                  Informasi Artikel
                </h3>

                <div className="space-y-6 text-sm">
                  <div className="border-b border-gray-300 pb-4">
                    <span className="font-bold text-gray-600 uppercase tracking-wider block mb-2">
                      Tanggal Publikasi
                    </span>
                    <span className="text-gray-900 font-medium text-base">
                      {formatDate(article.publishDate)}
                    </span>
                  </div>

                  {article.author && (
                    <div className="border-b border-gray-300 pb-4">
                      <span className="font-bold text-gray-600 uppercase tracking-wider block mb-2">
                        Penulis
                      </span>
                      <span className="text-gray-900 font-medium text-base">
                        {article.author}
                      </span>
                    </div>
                  )}

                  <div >
                    <span className="font-bold text-gray-600 uppercase tracking-wider block mb-2">
                      Kategori
                    </span>
                    <span className="text-gray-900 font-medium text-base">
                      Artikel Sekolah
                    </span>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t-4 border-gray-400">
                  <Link
                    href="/artikel"
                    className="block w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white text-center font-bold transition duration-300 ease-in-out uppercase tracking-widest text-sm shadow-lg hover:shadow-xl"
                  >
                    ← Kembali ke Artikel
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-gray-100 border-t-8 border-gray-400">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
            >
              <Link
                href="/artikel"
                className="inline-flex items-center gap-4 px-12 py-6 bg-slate-800 hover:bg-slate-900 text-white font-bold transition duration-300 ease-in-out uppercase tracking-widest text-base shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Lihat Semua Artikel
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ArticleDetailPage;
