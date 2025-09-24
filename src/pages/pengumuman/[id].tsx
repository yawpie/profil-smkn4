// pages/pengumuman/[id].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import type { Announcement } from '@/types/Announcement';
import MainLayout from '../../components/layout/MainLayout';
import Head from 'next/head';

// Motion variants
const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const slideInVariants: Variants = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const AnnouncementDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncementDetails = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/announcements?id=${id}`);
        if (!res.ok) {
          throw new Error(`Gagal mengambil data: ${res.statusText}`);
        }
        const data: Announcement = await res.json();
        if (data) {
          setAnnouncement(data);
        } else {
          setError('Data pengumuman tidak ditemukan.');
        }
      } catch (err: any) {
        console.error('Error fetching announcement details:', err);
        setError(`Terjadi kesalahan saat memuat data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncementDetails();
  }, [id]);

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date string');
      }
      return date.toLocaleDateString('id-ID', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  // Loading State
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Memuat detail pengumuman...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Error State
  if (error) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-slate-50">
          <div className="max-w-2xl mx-auto bg-red-50 border-l-4 border-red-500 p-8 text-center">
            <p className="text-lg text-red-800 font-semibold mb-4">{error}</p>
            <Link 
              href="/pengumuman" 
              className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-200"
            >
              Kembali ke Daftar Pengumuman
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Not Found State
  if (!announcement) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-slate-50">
          <div className="max-w-2xl mx-auto bg-slate-100 border-l-4 border-slate-400 p-8 text-center">
            <p className="text-lg text-slate-800 font-semibold mb-4">Pengumuman tidak tersedia</p>
            <Link 
              href="/pengumuman" 
              className="inline-block px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-medium transition-colors duration-200"
            >
              Kembali ke Daftar Pengumuman
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head>
        <title>{announcement.title} - Pengumuman SMKN 4 Mataram</title>
        <meta name="description" content={announcement.summary || announcement.content?.substring(0, 160) || `Detail pengumuman ${announcement.title} dari SMKN 4 Mataram.`} />
        <meta property="og:title" content={announcement.title} />
        <meta property="og:description" content={announcement.summary || announcement.content?.substring(0, 160) || `Detail pengumuman ${announcement.title} dari SMKN 4 Mataram.`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pengumuman/${announcement.id}`} />
        <meta name="twitter:card" content="summary" />
      </Head>

      {/* Hero Section - Professional Design */}
      <section className="relative w-full py-20 md:py-24 overflow-hidden bg-slate-900">
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-600 transform rotate-12"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-slate-600 transform -rotate-12"></div>
          <div className="absolute bottom-10 left-1/4 w-16 h-16 bg-blue-500 transform rotate-45"></div>
          <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-slate-500 transform -rotate-45"></div>
        </div>
        
        <div className="relative container mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            className="max-w-6xl mx-auto"
          >
            {/* Breadcrumb */}
            <motion.nav
              className="mb-10 text-sm text-slate-300"
              variants={slideInVariants}
            >
              <Link href="/" className="hover:text-white transition-colors duration-200">
                Beranda
              </Link>
              <span className="mx-2">/</span>
              <Link href="/pengumuman" className="hover:text-white transition-colors duration-200">
                Pengumuman
              </Link>
              <span className="mx-2">/</span>
              <span className="text-blue-400 font-medium">Detail</span>
            </motion.nav>

            {/* Header Content */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-1 h-12 bg-blue-500 mr-6"></div>
                <div>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-4 py-2 uppercase tracking-wider mb-6">
                    Pengumuman Resmi
                  </span>
                </div>
                <div className="w-1 h-12 bg-blue-500 ml-6"></div>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-8 px-4">
                {announcement.title}
              </h1>
              
              <div className="flex items-center justify-center text-slate-300 text-base">
                <time className="font-medium">
                  {formatDate(announcement.publishDate)}
                </time>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            className="max-w-6xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
          >
            {/* Content Card */}
            <motion.article
              className="bg-white shadow-lg border border-slate-200 mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="p-10 md:p-16 lg:p-20">
                {/* Article Header */}
                <header className="border-b border-slate-200 pb-8 mb-12">
                  <div className="flex items-center mb-6">
                    <div className="w-3 h-3 bg-blue-600 mr-4"></div>
                    <span className="text-sm text-slate-500 uppercase tracking-wider font-medium">
                      Pengumuman Resmi SMKN 4 Mataram
                    </span>
                  </div>
                  <div className="w-20 h-1 bg-blue-600 mb-6"></div>
                  
                  <div className="flex items-center text-base text-slate-600">
                    <span className="font-medium">Dipublikasikan:</span>
                    <time className="ml-2">{formatDate(announcement.publishDate)}</time>
                  </div>
                </header>

                {/* Article Content */}
                <div className="prose prose-xl prose-slate max-w-none"
                >
                  <div 
                    className="text-slate-700 leading-relaxed text-lg"
                    dangerouslySetInnerHTML={{ 
                      __html: announcement.content || '<p>Konten pengumuman tidak tersedia.</p>' 
                    }} 
                  />
                </div>
              </div>
            </motion.article>

            {/* Navigation */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link 
                href="/pengumuman" 
                className="inline-flex items-center px-10 py-5 bg-slate-600 hover:bg-slate-700 text-white font-medium text-lg transition-colors duration-200 group"
              >
                <svg 
                  className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Kembali ke Daftar Pengumuman
              </Link>
            </motion.div>

            {/* Additional Navigation or Related Content */}
            <motion.div
              className="bg-white shadow-lg border-l-4 border-blue-600 p-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-blue-600 mr-4"></div>
                <h3 className="text-xl font-bold text-slate-900">
                  Informasi Tambahan
                </h3>
              </div>
              <div className="w-20 h-1 bg-blue-600 mb-6"></div>
              <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                Untuk informasi lebih lanjut mengenai pengumuman ini, silakan hubungi bagian administrasi sekolah.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/kontak"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200"
                >
                  Hubungi Kami
                </Link>
                <Link
                  href="/pengumuman"
                  className="inline-flex items-center px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors duration-200"
                >
                  Pengumuman Lainnya
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AnnouncementDetailPage;