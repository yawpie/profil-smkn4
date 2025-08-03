// pages/pengumuman/[id].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
// import Image from 'next/image'; // Komponen Image tidak lagi dibutuhkan jika tidak ada gambar
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import type { Announcement } from '@/types/Announcement'; // Pastikan tipe Announcement sesuai
import MainLayout from '../../components/layout/MainLayout'; // Pastikan path ini benar
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

const AnnouncementDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // Menggunakan 'id'

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

  // Loading State
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gradient-to-b from-white to-blue-50 text-gray-700 font-sans"> {/* Tambah font-sans */}
          <p className="text-base">Memuat detail pengumuman...</p> {/* Perkecil font */}
        </div>
      </MainLayout>
    );
  }

  // Error State
  if (error) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 text-gray-700 p-4 text-center font-sans"> {/* Tambah font-sans */}
          <p className="text-base text-red-500 mb-3">{error}</p> {/* Perkecil font, margin */}
          <Link href="/pengumuman" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-300 ease-in-out text-sm"> {/* Perkecil padding, font */}
            Kembali ke Daftar Pengumuman
          </Link>
        </div>
      </MainLayout>
    );
  }

  // Not Found State
  if (!announcement) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gradient-to-b from-white to-blue-50 text-gray-700 font-sans"> {/* Tambah font-sans */}
          <p className="text-base">Pengumuman tidak tersedia.</p> {/* Perkecil font */}
          <Link href="/pengumuman" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-300 ease-in-out mt-3 text-sm"> {/* Perkecil padding, font */}
            Kembali ke Daftar Pengumuman
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head>
        <title>{announcement.title} - Pengumuman SMKN 4 Mataram</title>
        <meta name="description" content={announcement.summary || announcement.content?.substring(0, 160) || `Detail pengumuman ${announcement.title} dari SMKN 4 Mataram.`} />
        {/* Open Graph Meta Tags untuk SEO dan sharing */}
        <meta property="og:title" content={announcement.title} />
        <meta property="og:description" content={announcement.summary || announcement.content?.substring(0, 160) || `Detail pengumuman ${announcement.title} dari SMKN 4 Mataram.`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pengumuman/${announcement.id}`} />
        <meta name="twitter:card" content="summary" />
      </Head>

      <div className="bg-gradient-to-b from-white to-blue-50 text-gray-800 font-sans py-12 min-h-[calc(100vh-120px)]"> {/* Padding vertikal dan font-sans */}
        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6" // Max-width dan padding sedikit lebih kecil
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
        >
          {/* Breadcrumb */}
          <motion.div
            className="mb-5 text-xs text-gray-600" // Perkecil font dan margin
            initial="hidden"
            animate="visible"
            variants={slideInVariants}
          >
            <Link href="/" className="hover:underline hover:text-blue-600 transition duration-200">Beranda</Link> &gt;{' '}
            <Link href="/pengumuman" className="hover:underline hover:text-blue-600 transition duration-200">Pengumuman</Link> &gt;{' '}
            <span className="font-semibold text-blue-700">{announcement.title}</span>
          </motion.div>

          {/* Bagian header pengumuman (Tanpa gambar overlay, hanya gradasi background) */}
          <motion.div
            className="relative w-full h-40 sm:h-56 rounded-lg overflow-hidden shadow-xl border border-blue-400/20
                       bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex items-end p-5 sm:p-6" // Tinggi lebih kecil, rounded lebih kecil, shadow lebih kecil, padding lebih kecil
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
          >
            {/* Judul Pengumuman di sudut kiri bawah gambar */}
            <motion.h2
              className="relative text-xl sm:text-3xl font-extrabold text-white drop-shadow-md z-10" // Font H2 lebih kecil, drop-shadow lebih kecil
              initial={{ opacity: 0, y: 15 }} // Animasi y lebih kecil
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {announcement.title}
            </motion.h2>
          </motion.div>

          {/* Tanggal Publikasi */}
          <motion.p
            className="text-gray-600 text-xs mt-3 text-center sm:text-left" // Perkecil font dan margin
            initial={{ opacity: 0, y: 8 }} // Animasi y lebih kecil
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Dipublikasikan pada {new Date(announcement.publishDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </motion.p>

          {/* Konten pengumuman */}
          <motion.div
            className="mt-6 bg-white p-6 rounded-xl shadow-lg space-y-3 text-gray-700 leading-relaxed border border-gray-200 prose prose-base max-w-none" // Margin top, padding, rounded, shadow, space-y, prose lebih kecil
            initial={{ opacity: 0, y: 15 }} // Animasi y lebih kecil
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7, ease: 'easeOut' }}
          >
            <div dangerouslySetInnerHTML={{ __html: announcement.content || '<p>Konten pengumuman tidak tersedia.</p>' }} />
          </motion.div>

          {/* Tombol Kembali */}
          <motion.div
            className="mt-10 text-center" // Margin top lebih kecil
            initial={{ opacity: 0, y: 15 }} // Animasi y lebih kecil
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <Link href="/pengumuman" className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-0.5"> {/* Padding, font, transform hover lebih kecil */}
              &larr; Kembali ke Daftar Pengumuman
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </MainLayout>
  );
};

export default AnnouncementDetailPage;