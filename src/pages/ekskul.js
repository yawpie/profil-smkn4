// pages/ekstrakurikuler.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion'; // Import motion from framer-motion
import EkstrakurikulerCard from '../components/Card/EkstrakurikulerCard';
import MainLayout from '../components/layout/MainLayout';

export default function EkstrakurikulerPage() {
  const [ekstrakurikuler, setEkstrakurikuler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEkstrakurikuler() {
      try {
        const response = await fetch('/api/extracurriculars');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEkstrakurikuler(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEkstrakurikuler();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  if (loading) {
    return (
      <MainLayout>
        <section className="relative container mx-auto px-4 py-24 min-h-[calc(100vh-120px)] flex flex-col justify-center items-center overflow-hidden">
          {/* Background gradient for loading state */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 animate-gradient-xy"></div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative text-6xl font-extrabold text-center text-indigo-700 mb-8 animate-pulse drop-shadow-lg"
          >
            Kegiatan Ekstrakurikuler
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="relative text-xl text-center text-gray-700"
          >
            Memuat kegiatan ekstrakurikuler yang inspiratif...
          </motion.p>
        </section>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <section className="relative container mx-auto px-4 py-24 min-h-[calc(100vh-120px)] flex flex-col justify-center items-center bg-red-50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-100 animate-gradient-xy"></div>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative text-5xl font-extrabold text-center text-red-800 mb-6 drop-shadow-md"
          >
            Kegiatan Ekstrakurikuler
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="relative text-xl text-center text-red-700"
          >
            Terjadi kesalahan: Gagal memuat ekstrakurikuler. Silakan coba lagi nanti. ({error})
          </motion.p>
        </section>
      </MainLayout>
    );
  }

  if (ekstrakurikuler.length === 0) {
    return (
      <MainLayout>
        <section className="relative container mx-auto px-4 py-24 min-h-[calc(100vh-120px)] flex flex-col justify-center items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-100 animate-gradient-xy"></div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative text-5xl font-extrabold text-center text-indigo-700 mb-6 drop-shadow-lg"
          >
            Kegiatan Ekstrakurikuler
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
            className="relative text-xl text-center text-gray-700"
          >
            Belum ada kegiatan ekstrakurikuler yang tersedia saat ini.
          </motion.p>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head>
        <title>Ekstrakurikuler - SMKN 4 Mataram</title>
        <meta name="description" content="Daftar kegiatan ekstrakurikuler SMKN 4 Mataram, SMKN 4 Mataram" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section with Gradient Background */}
      <section className="relative w-full py-20 md:py-28 lg:py-36 overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
        <div className="absolute inset-0 opacity-30 animate-blob-pulse">
          {/* Animated blobs for visual interest */}
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-indigo-800 leading-tight mb-4 drop-shadow-xl"
          >
            Kegiatan <span className="text-blue-600">Ekstrakurikuler</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="text-lg sm:text-xl text-gray-800 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Jelajahi berbagai kegiatan menarik yang membentuk bakat dan minat siswa di luar jam pelajaran, membuka potensi baru, dan membangun pengalaman berharga.
          </motion.p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-white shadow-inner-lg rounded-t-3xl -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
          {ekstrakurikuler.map((item, index) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.1 }} // Staggered animation
            >
              <EkstrakurikulerCard
                id={item.id}
                slug={item.slug}
                title={item.title}
                description={item.description}
                imageUrl={item.imageUrl}
                date={item.date}
                category={item.category}
              />
            </motion.div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}