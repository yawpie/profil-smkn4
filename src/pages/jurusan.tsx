import { useState, useEffect, FC, useCallback } from 'react';
import Head from 'next/head';
import { motion, type Variants } from 'framer-motion';
import JurusanCard from '../components/Card/JurusanCard';
import MainLayout from '../components/layout/MainLayout';
import type { Major } from '@/types/Major';

const JurusanPage: FC = () => {
  const [jurusan, setJurusan] = useState<Major[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJurusan = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/majors');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Major[] = await response.json();
      setJurusan(data);
    } catch (e: unknown) {
      console.error("Failed to fetch jurusan:", e);
      if (e instanceof Error) {
        setError(`Gagal memuat jurusan. Detail: ${e.message}`);
      } else {
        setError("Gagal memuat jurusan. Silakan coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJurusan();
  }, [fetchJurusan]);

  // Framer Motion variants for animations
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  if (loading) {
    return (
      <MainLayout>
        <section className="relative container mx-auto px-4 py-24 min-h-[calc(100vh-120px)] flex flex-col justify-center items-center overflow-hidden">
          {/* Background gradient for loading state */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-100 animate-gradient-xy"></div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative text-6xl font-extrabold text-center text-blue-700 mb-8 animate-pulse drop-shadow-lg"
          >
            Jurusan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="relative text-xl text-center text-gray-700"
          >
            Mempersiapkan masa depanmu dengan pilihan terbaik...
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
            Jurusan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="relative text-xl text-center text-red-700"
          >
            Terjadi kesalahan: Gagal memuat jurusan. Silakan coba lagi nanti. ({error})
          </motion.p>
          <button
            onClick={fetchJurusan} // Sekarang fetchJurusan bisa diakses
            className="px-8 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors duration-300 transform hover:scale-105 shadow-lg"
          >
            Coba Lagi
          </button>
        </section>
      </MainLayout>
    );
  }

  if (jurusan.length === 0) {
    return (
      <MainLayout>
        <section className="relative container mx-auto px-4 py-24 min-h-[calc(100vh-120px)] flex flex-col justify-center items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-100 animate-gradient-xy"></div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative text-5xl font-extrabold text-center text-blue-700 mb-6 drop-shadow-lg"
          >
            Jurusan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
            className="relative text-xl text-center text-gray-700"
          >
            Belum ada informasi jurusan yang tersedia saat ini.
          </motion.p>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head>
        <title>Jurusan - SMKN 4 Mataram</title>
        <meta name="description" content="Temukan daftar pilihan jurusan unggulan di SMKN 4 Mataram untuk masa depan karirmu." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section with Gradient Background */}
      <section className="relative w-full py-20 md:py-28 lg:py-36 overflow-hidden bg-gradient-to-br from-blue-100 via-sky-100 to-cyan-100">
        <div className="absolute inset-0 opacity-40 animate-blob-pulse">
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-sky-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-blue-800 leading-tight mb-4 drop-shadow-xl"
          >
            <span className="text-cyan-600">Jurusan</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="text-lg sm:text-xl text-gray-800 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Temukan jalur pendidikan yang sesuai dengan minat dan bakatmu di SMKN 4 Mataram, siapkan dirimu untuk masa depan yang cerah.
          </motion.p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-white shadow-inner-lg rounded-t-3xl -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
          {jurusan.map((item: Major, index: number) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.1 }}
            >
              <JurusanCard
                id={item.id}
                name={item.name}
                description={item.description}
                image={item.image}
              />
            </motion.div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
};

export default JurusanPage;