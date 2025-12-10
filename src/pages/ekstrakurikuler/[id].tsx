import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Extracurricular, ExtracurricularApi } from '@/types/Extracurricular';
import MainLayout from '../../components/layout/MainLayout';
import Head from 'next/head';
import { apiGet } from '@/utils/apiClient';

const DetailEkstrakurikulerPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [ekskul, setEkskul] = useState<Extracurricular | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEkskulDetails = async () => {
      if (id) {
        setLoading(true);
        setError(null);
        try {
          const res = await apiGet<ExtracurricularApi>(`/extracurriculars?id=${id}`);
          if (res) {
            setEkskul({
              id: res.id,
              name: res.name,
              description: res.description || '',
              image: res.image_url || undefined,
              coach: res.guru?.name || undefined,
            });
          } else {
            setError('Data ekstrakurikuler tidak ditemukan.');
          }
        } catch (err: any) {
          console.error('Error fetching extracurricular details:', err);
          setError(`Terjadi kesalahan saat memuat data: ${err.message}`);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEkskulDetails();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gray-50 text-gray-700">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-700 border-t-transparent animate-spin mx-auto mb-4"></div>
            <p className="text-base font-medium uppercase tracking-wide">Memuat Detail Ekstrakurikuler</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center bg-gray-50 text-gray-700 p-4 text-center">
          <div className="bg-white border-l-4 border-red-600 shadow-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-3">
              <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Error</h3>
            </div>
            <p className="text-sm text-gray-700 mb-4">{error}</p>
            <Link href="/ekstrakurikuler" className="inline-block px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold transition duration-300 ease-in-out text-sm uppercase tracking-wider shadow-md hover:shadow-lg">
              Kembali ke Daftar Ekstrakurikuler
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!ekskul) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center bg-gray-50 text-gray-700 p-4">
          <div className="bg-white border border-gray-300 shadow-lg p-6 max-w-md w-full text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Data Tidak Tersedia</h3>
            <p className="text-sm text-gray-600 mb-4">Ekstrakurikuler yang Anda cari tidak dapat ditemukan.</p>
            <Link href="/ekstrakurikuler" className="inline-block px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold transition duration-300 ease-in-out text-sm uppercase tracking-wider shadow-md hover:shadow-lg">
              Kembali ke Daftar Ekstrakurikuler
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head>
        <title>{ekskul.name} - Ekstrakurikuler SMKN 4 Mataram</title>
        <meta name="description" content={`Detail ekstrakurikuler ${ekskul.name} di SMKN 4 Mataram.`} />
        <meta property="og:title" content={ekskul.name} />
        <meta property="og:description" content={`Detail ekstrakurikuler ${ekskul.name} di SMKN 4 Mataram.`} />
        {ekskul.image && <meta property="og:image" content={ekskul.image} />}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/ekstrakurikuler/${ekskul.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
        {ekskul.image && <meta name="twitter:image" content={ekskul.image} />}
      </Head>

      <div className="bg-white text-gray-900 font-sans min-h-[calc(120vh-120px)]">
        {/* Professional Header Section */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-b-4 border-blue-700">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {/* Professional Breadcrumb */}
              <motion.nav
                className="mb-6 text-sm text-blue-200 font-medium"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <div className="flex items-center space-x-3">
                  <Link href="/" className="hover:text-white transition duration-200 uppercase tracking-wider font-semibold">
                    Beranda
                  </Link>
                  <div className="w-1 h-1 bg-blue-400 transform rotate-45"></div>
                  <Link href="/ekstrakurikuler" className="hover:text-white transition duration-200 uppercase tracking-wider font-semibold">
                    Ekstrakurikuler
                  </Link>
                  <div className="w-1 h-1 bg-blue-400 transform rotate-45"></div>
                  <span className="text-white font-bold uppercase tracking-wider">Detail</span>
                </div>
              </motion.nav>

              {/* Extracurricular Title */}
              <motion.h1
                className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4 max-w-4xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                >
                {ekskul.name}
              </motion.h1>

              {/* Category Badge */}
              <motion.div
                className="inline-block bg-blue-800/30 px-4 py-2 border border-blue-600/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <span className="text-blue-100 font-semibold uppercase tracking-wide text-sm">Ekstrakurikuler</span>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
            >
              {/* Featured Image */}
              {ekskul.image && (
                <motion.div
                  className="mb-8 bg-gray-100 border-2 border-gray-300 overflow-hidden shadow-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                >
                  <Image
                    src={ekskul.image}
                    alt={ekskul.name}
                    width={700}
                    height={350}
                    className="w-full h-48 sm:h-64 object-cover"
                    priority
                  />
                </motion.div>
              )}

              {/* Description Content */}
              <motion.div
                className="bg-white border-2 border-gray-200 shadow-lg p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7, ease: 'easeOut' }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-gray-300 pb-2">
                  Tentang Ekstrakurikuler
                </h3>
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  style={{
                    lineHeight: '1.7'
                  }}
                >
                  {typeof ekskul.description === 'string' ? (
                    <div dangerouslySetInnerHTML={{ __html: ekskul.description.replace(/\n/g, '<br/><br/>') }} />
                  ) : (
                    <p className="italic text-gray-500">Deskripsi belum tersedia.</p>
                  )}
                </div>
              </motion.div>
            </motion.div>

            {/* Professional Sidebar */}
            <motion.aside
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <div className="bg-gray-50 border-2 border-gray-300 shadow-lg sticky top-6">
                {/* Sidebar Header */}
                <div className="bg-slate-800 text-white p-4"
               >
                  <h3 className="text-base font-bold uppercase tracking-wider">
                    Informasi Detail
                  </h3>
                </div>
                
                {/* Sidebar Content */}
                <div className="p-4 space-y-4"
                 >
                  <div className="border-b border-gray-300 pb-3">
                    <span className="font-bold text-gray-700 uppercase tracking-wide text-xs block mb-1">Pelatih</span>
                    <span className="text-gray-900 font-medium text-sm">{ekskul.coach || 'Tidak diketahui'}</span>
                  </div>
                  
                  <div className="border-b border-gray-300 pb-3">
                    <span className="font-bold text-gray-700 uppercase tracking-wide text-xs block mb-1">Jadwal</span>
                    <span className="text-gray-900 font-medium text-sm">{ekskul.schedule || 'Belum ditentukan'}</span>
                  </div>

                  <div className="border-b border-gray-300 pb-3">
                    <span className="font-bold text-gray-700 uppercase tracking-wide text-xs block mb-1">Status</span>
                    <span className="inline-block bg-green-100 text-green-800 px-2 py-1 text-xs font-semibold uppercase tracking-wide border border-green-300">
                      Aktif
                    </span>
                  </div>

                  <div>
                    <span className="font-bold text-gray-700 uppercase tracking-wide text-xs block mb-1">Kategori</span>
                    <span className="text-gray-900 font-medium text-sm">Ekstrakurikuler Sekolah</span>
                  </div>
                </div>

                {/* Sidebar Action */}
                <div className="p-4 bg-gray-100 border-t-2 border-gray-300">
                  <Link 
                    href="/ekstrakurikuler" 
                    className="block w-full px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white text-center font-bold transition duration-300 ease-in-out uppercase tracking-wider text-xs shadow-md hover:shadow-lg"
                  >
                    ← Kembali
                  </Link>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>

        {/* Professional Footer Navigation */}
        <div className="bg-slate-100 border-t-4 border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              <Link 
                href="/ekstrakurikuler" 
                className="inline-flex items-center gap-3 px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold transition duration-300 ease-in-out uppercase tracking-wider text-sm shadow-lg hover:shadow-xl"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Lihat Semua Ekstrakurikuler
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DetailEkstrakurikulerPage;