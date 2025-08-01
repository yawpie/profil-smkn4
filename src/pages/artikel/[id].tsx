// pages/artikel/[slug].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion'; // Menggunakan tipe Variants dari framer-motion
import Link from 'next/link';
import type { Article } from '@/types/Article'; // Pastikan tipe Article sesuai (tanpa tags)
import MainLayout from '../../components/layout/MainLayout'; // Pastikan path ini benar
import Head from 'next/head'; // Mengimpor Head untuk SEO

// Variasi untuk animasi Framer Motion (disesuaikan dari halaman jurusan)
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
  const { slug } = router.query; // Menggunakan 'slug' karena ArtikelPage Anda mengarah ke slug

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticleDetails = async () => {
      if (!slug) return; // Pastikan slug sudah tersedia dari router

      setLoading(true);
      setError(null);
      try {
        // Fetch dari API Anda berdasarkan slug
        // Pastikan endpoint API Anda '/api/articles/[slug]' sudah benar
        const res = await fetch(`/api/articles/${slug}`);
        if (!res.ok) {
          throw new Error(`Gagal mengambil data: ${res.statusText}`);
        }
        const data: Article = await res.json(); // Explicitly type data as Article
        if (data) {
          setArticle(data);
        } else {
          setError('Data artikel tidak ditemukan.');
        }
      } catch (err: any) {
        console.error('Error fetching article details:', err);
        setError(`Terjadi kesalahan saat memuat data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetails();
  }, [slug]); // Dependensi adalah 'slug'

  // Loading State
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gradient-to-b from-white to-blue-50 text-gray-700">
          <p className="text-xl">Memuat detail artikel...</p>
        </div>
      </MainLayout>
    );
  }

  // Error State
  if (error) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 text-gray-700 p-4 text-center">
          <p className="text-xl text-red-500 mb-4">{error}</p>
          <Link href="/artikel" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-300 ease-in-out">
            Kembali ke Daftar Artikel
          </Link>
        </div>
      </MainLayout>
    );
  }

  // Not Found State (jika artikel null setelah loading selesai tanpa error)
  if (!article) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gradient-to-b from-white to-blue-50 text-gray-700">
          <p className="text-xl">Artikel tidak tersedia.</p>
          <Link href="/artikel" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-300 ease-in-out mt-4">
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

      <div className="bg-gradient-to-b from-white to-blue-50 text-gray-800 font-sans py-16 min-h-[calc(100vh-120px)]">
        <motion.div
          className="max-w-5xl mx-auto px-4 sm:px-8"
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
        >
          {/* Breadcrumb */}
          <motion.div
            className="mb-6 text-sm text-gray-600"
            initial="hidden"
            animate="visible"
            variants={slideInVariants}
          >
            <Link href="/" className="hover:underline hover:text-blue-600 transition duration-200">Beranda</Link> &gt;{' '}
            <Link href="/artikel" className="hover:underline hover:text-blue-600 transition duration-200">Artikel</Link> &gt;{' '}
            <span className="font-semibold text-blue-700">{article.title}</span>
          </motion.div>

          {/* Bagian header artikel dengan gradasi biru gelap sebagai background utama */}
          <motion.div
            className="relative w-full h-72 sm:h-96 rounded-xl overflow-hidden shadow-2xl border border-blue-400/30
                       bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex items-end p-6 sm:p-8"
            initial="hidden"
            animate="visible"
            variants={fadeInVariants} // Menggunakan fadeInVariants untuk efek umum
            transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
          >
            {/* Gambar Artikel sebagai overlay */}
            {article.image && (
              <Image
                src={article.image}
                alt={article.title}
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 rounded-xl opacity-30 sm:opacity-50 filter brightness-90 contrast-110"
                priority // Untuk gambar di atas fold
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent via-black/20" />

            {/* Judul Artikel di sudut kiri bawah gambar */}
            <motion.h2
              className="relative text-2xl sm:text-4xl font-extrabold text-white drop-shadow-lg z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {article.title}
            </motion.h2>
          </motion.div>

          {/* Tanggal dan Penulis di bawah header */}
          <motion.p
            className="text-gray-600 text-sm mt-4 text-center sm:text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Dipublikasikan pada {new Date(article.publishDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            {article.author && ` oleh ${article.author}`}
          </motion.p>


          {/* Konten panjang dari artikel - kini di latar putih */}
          <motion.div
            className="mt-8 bg-white p-8 rounded-2xl shadow-lg space-y-4 text-gray-700 leading-relaxed border border-gray-200 prose prose-lg max-w-none" // Menambahkan prose
            initial="hidden"
            animate="visible"
            variants={fadeInVariants} // Menggunakan fadeInVariants
            transition={{ delay: 0.7, duration: 0.7, ease: 'easeOut' }}
          >
            {/* Menggunakan dangerouslySetInnerHTML untuk merender HTML dari article.content */}
            <div dangerouslySetInnerHTML={{ __html: article.content || '<p>Konten artikel tidak tersedia.</p>' }} />
          </motion.div>

          {/* Tombol Kembali */}
          <motion.div
            className="mt-12 text-center"
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
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