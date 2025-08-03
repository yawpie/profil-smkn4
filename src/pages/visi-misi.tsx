import { useState, useEffect, FC, useCallback } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { motion, type Variants } from 'framer-motion';
import type { VisiMisiData } from '@/types/VisiMisi'; // Sesuaikan path jika berbeda

const VisiMisiPage: FC = () => {
  const [visiMisiData, setVisiMisiData] = useState<VisiMisiData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const contentBlockVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        type: "spring",
        stiffness: 90,
        damping: 15,
      }
    },
  };

  // Function to fetch Visi & Misi data from backend/API
  const fetchVisiMisi = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/visi-misi'); // Pastikan endpoint ini benar
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: VisiMisiData = await response.json(); // Tipekan data yang diterima
      setVisiMisiData(data);
    } catch (e: unknown) {
      console.error("Gagal mengambil data Visi & Misi:", e);
      if (e instanceof Error) {
        setError(`Gagal memuat Visi & Misi. Detail: ${e.message}`);
      } else {
        setError("Gagal memuat Visi & Misi. Silakan coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisiMisi();
  }, [fetchVisiMisi]);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 font-sans"> {/* Padding vertikal dan font-sans */}
        <div className="absolute inset-0 opacity-40 animate-blob-pulse">
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={headerVariants}
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-indigo-800 leading-tight mb-2 drop-shadow-xl" // Font H1 lebih kecil
          >
            Visi & <span className="text-blue-600">Misi</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={textVariants}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-gray-800 max-w-2xl mx-auto mb-6 leading-relaxed" // Font P lebih kecil
          >
            Mewujudkan masa depan cerah melalui nilai dan tujuan yang jelas.
          </motion.p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-white shadow-inner-lg rounded-t-3xl -mt-16 relative z-10 font-sans"> {/* Padding dan font-sans lebih kecil */}
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col gap-6 max-w-3xl mx-auto"> {/* Gap dan max-w lebih kecil */}
            <div className="bg-gray-100 rounded-xl shadow-md p-6 animate-pulse"> {/* Padding lebih kecil */}
              <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div> {/* Visi title */}
              <div className="h-5 bg-gray-300 rounded w-full mb-2.5"></div> {/* Visi text line 1 */}
              <div className="h-5 bg-gray-300 rounded w-11/12"></div> {/* Visi text line 2 */}
            </div>
            <div className="bg-gray-100 rounded-xl shadow-md p-6 animate-pulse"> {/* Padding lebih kecil */}
              <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div> {/* Misi title */}
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-5 bg-gray-300 rounded w-full mb-2.5"></div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-center py-12 bg-red-50 rounded-xl shadow-lg border border-red-200 font-sans" // Padding dan font-sans
          >
            <p className="text-base text-red-700 font-semibold mb-2.5">{error}</p> {/* Font lebih kecil */}
            <button
              onClick={fetchVisiMisi}
              className="px-5 py-1.5 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md text-sm" // Padding & font lebih kecil
            >
              Coba Lagi
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && !visiMisiData && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-center py-12 bg-blue-50 rounded-xl shadow-lg border border-blue-200 font-sans" // Padding dan font-sans
          >
            <p className="text-base text-blue-700 font-semibold mb-2.5">Data Visi & Misi belum tersedia saat ini.</p> {/* Font lebih kecil */}
            <p className="text-sm text-gray-600">Kami sedang dalam proses pembaruan informasi.</p> {/* Font lebih kecil */}
          </motion.div>
        )}

        {/* Content when data is loaded */}
        {!loading && !error && visiMisiData && (
          <div className="max-w-3xl mx-auto space-y-8"> {/* Max-w dan space-y lebih kecil */}
            {/* Visi Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={contentBlockVariants}
              className="bg-white rounded-xl shadow-xl p-6 lg:p-8 border border-blue-100 relative overflow-hidden group" // Padding dan shadow lebih kecil
            >
              {/* Subtle background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>

              <h2 className="relative z-10 text-2xl md:text-3xl font-extrabold text-blue-700 mb-4 pb-1.5 border-b-2 border-blue-200"> {/* Font H2 lebih kecil, padding lebih kecil */}
                Visi
              </h2>
              <p className="relative z-10 text-sm md:text-base text-gray-800 leading-relaxed"> {/* Font P lebih kecil */}
                {visiMisiData.visi}
              </p>
            </motion.div>

            {/* Misi Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={contentBlockVariants}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-xl p-6 lg:p-8 border border-purple-100 relative overflow-hidden group" // Padding dan shadow lebih kecil
            >
              {/* Subtle background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>

              <h2 className="relative z-10 text-2xl md:text-3xl font-extrabold text-purple-700 mb-4 pb-1.5 border-b-2 border-purple-200"> {/* Font H2 lebih kecil, padding lebih kecil */}
                Misi
              </h2>
              <ul className="relative z-10 text-sm md:text-base text-gray-800 space-y-3 list-disc pl-5"> {/* Font P dan space-y lebih kecil */}
                {visiMisiData.misi && visiMisiData.misi.map((item: string, index: number) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -15 }} // Animasi x lebih kecil
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }} // Delay sedikit lebih cepat
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default VisiMisiPage;