import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import type { Article } from '@/types/Article';
import MainLayout from '../../components/layout/MainLayout';
import Head from 'next/head';

// Variasi untuk animasi Framer Motion
const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const slideInVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const ArticleDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi pembantu untuk memformat tanggal
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date string');
      }
      return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  useEffect(() => {
    const fetchArticleDetails = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/articles?id=${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('Artikel tidak ditemukan.');
          } else {
            throw new Error(`Gagal mengambil data: ${res.statusText}`);
          }
        }
        const data: Article = await res.json();
        if (data) {
          setArticle(data);
        } else {
          setError('Data artikel tidak tersedia.');
        }
      } catch (err: any) {
        console.error('Error fetching article details:', err);
        setError(`Terjadi kesalahan saat memuat data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetails();
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gradient-to-b from-white to-blue-50 text-gray-700 font-sans p-4">
          <p className="text-base">Memuat detail artikel...</p>
        </div>
      </MainLayout>
    );
  }

  // Error State (termasuk Not Found)
  if (error) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 text-gray-700 p-4 text-center font-sans">
          <p className="text-base text-red-500 mb-4">{error}</p>
          <Link href="/artikel" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-300 ease-in-out text-sm">
            Kembali ke Daftar Artikel
          </Link>
        </div>
      </MainLayout>
    );
  }

  // Jika artikel masih null setelah loading selesai dan tidak ada error
  if (!article) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 text-gray-700 font-sans p-4">
          <p className="text-base">Artikel tidak tersedia.</p>
          <Link href="/artikel" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-300 ease-in-out mt-4 text-sm">
            Kembali ke Daftar Artikel
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head>
        <title>{article.title} - Artikel SMKN 4 Mataram</title>
        <meta name="description" content={article.summary || article.content?.substring(0, 160) || `Detail artikel ${article.title} dari SMKN 4 Mataram.`} />
        {/* Open Graph Meta Tags untuk SEO dan sharing */}
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.summary || article.content?.substring(0, 160) || `Detail artikel ${article.title} dari SMKN 4 Mataram.`} />
        {article.image && <meta property="og:image" content={article.image} />}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/artikel/${article.slug || article.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
        {article.image && <meta name="twitter:image" content={article.image} />}
      </Head>

      <div className="bg-gradient-to-b from-white to-blue-50 text-gray-800 font-sans py-12 min-h-[calc(100vh-120px)]">
        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6"
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
        >
          {/* Breadcrumb */}
          <motion.div
            className="mb-5 text-sm text-gray-600"
            initial="hidden"
            animate="visible"
            variants={slideInVariants}
          >
            <Link href="/" className="hover:underline hover:text-blue-600 transition duration-200">Beranda</Link> &gt;{' '}
            <Link href="/artikel" className="hover:underline hover:text-blue-600 transition duration-200">Artikel</Link> &gt;{' '}
            <span className="font-semibold text-blue-700">{article.title}</span>
          </motion.div>

          {/* Bagian header artikel */}
          <motion.div
            className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden shadow-xl border border-blue-400/20
                       bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex items-end p-6 sm:p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
          >
            {/* Gambar Artikel sebagai overlay */}
            {article.image && (
              <Image
                src={article.image}
                alt={article.title}
                fill // Menggunakan fill sebagai pengganti layout="fill"
                style={{ objectFit: 'cover' }} // Properti objectFit dipindahkan ke style
                className="absolute inset-0 rounded-xl opacity-30 sm:opacity-50 filter brightness-90 contrast-110"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent via-black/20" />

            {/* Judul Artikel */}
            <motion.h2
              className="relative text-2xl sm:text-4xl font-extrabold text-white drop-shadow-md z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {article.title}
            </motion.h2>
          </motion.div>

          {/* Tanggal dan Penulis */}
          <motion.p
            className="text-gray-600 text-sm mt-4 text-center sm:text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Dipublikasikan pada {formatDate(article.publishDate)}
            {article.author && ` oleh ${article.author}`}
          </motion.p>

          {/* Konten panjang dari artikel */}
          <motion.div
            className="mt-8 bg-white p-8 rounded-2xl shadow-lg space-y-4 text-gray-700 leading-relaxed border border-gray-200 prose prose-lg max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7, ease: 'easeOut' }}
          >
            <div dangerouslySetInnerHTML={{ __html: article.content || '<p>Konten artikel tidak tersedia.</p>' }} />
          </motion.div>

          {/* Tombol Kembali */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <Link href="/artikel" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1">
              &larr; Kembali ke Daftar Artikel
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </MainLayout>
  );
};

export default ArticleDetailPage;