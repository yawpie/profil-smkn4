import { useState, useEffect, FC, useCallback } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { motion, type Variants } from 'framer-motion';
import type { VisiMisiData } from '@/types/VisiMisi';

const VisiMisiPage: FC = () => {
  const [visiMisiData, setVisiMisiData] = useState<VisiMisiData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const contentBlockVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      }
    },
  };

  const fetchVisiMisi = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/visi-misi');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: VisiMisiData = await response.json();
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
      {/* Hero Section - Professional Design */}
      <section className="relative w-full py-20 md:py-24 lg:py-28 overflow-hidden bg-slate-900">
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-blue-600 transform rotate-12"></div>
          <div className="absolute top-32 right-16 w-32 h-32 bg-slate-600 transform -rotate-12"></div>
          <div className="absolute bottom-16 left-1/3 w-24 h-24 bg-blue-500 transform rotate-45"></div>
          <div className="absolute bottom-32 right-1/4 w-28 h-28 bg-slate-500 transform -rotate-45"></div>
          
          {/* Additional geometric elements */}
          <div className="absolute top-1/4 left-1/2 w-2 h-16 bg-white opacity-20 transform rotate-12"></div>
          <div className="absolute top-1/3 right-1/3 w-16 h-2 bg-white opacity-20 transform -rotate-12"></div>
          <div className="absolute bottom-1/3 left-1/4 w-2 h-12 bg-white opacity-20 transform rotate-45"></div>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={headerVariants}
              className="mb-6"
            >
              <div className="flex justify-center mb-4">
                <div className="w-1 h-16 bg-blue-500 mr-6"></div>
                <div className="text-center">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                    Visi & <span className="text-blue-400">Misi</span>
                  </h1>
                </div>
                <div className="w-1 h-16 bg-blue-500 ml-6"></div>
              </div>
              <div className="w-32 h-1 bg-blue-500 mx-auto mb-6"></div>
            </motion.div>
            
            <motion.p
              initial="hidden"
              animate="visible"
              variants={textVariants}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
            >
              Fondasi nilai dan tujuan yang mengarahkan setiap langkah institusi menuju keunggulan
            </motion.p>
          </div>
        </div>
        
        {/* Bottom border with gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-slate-500 to-blue-500">
          <div className="absolute top-0 left-0 w-2 h-2 bg-blue-600"></div>
          <div className="absolute top-0 right-0 w-2 h-2 bg-blue-600"></div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {loading && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white shadow-lg p-8 animate-pulse">
                <div className="h-8 bg-slate-200 w-1/4 mb-6"></div>
                <div className="h-4 bg-slate-200 w-full mb-3"></div>
                <div className="h-4 bg-slate-200 w-11/12"></div>
              </div>
              <div className="bg-white shadow-lg p-8 animate-pulse">
                <div className="h-8 bg-slate-200 w-1/4 mb-6"></div>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-slate-200 w-full mb-3"></div>
                ))}
              </div>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={textVariants}
                className="bg-red-50 border-l-4 border-red-500 p-8"
              >
                <p className="text-lg text-red-800 font-semibold mb-4">{error}</p>
                <button
                  onClick={fetchVisiMisi}
                  className="px-6 py-3 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors duration-200"
                >
                  Coba Lagi
                </button>
              </motion.div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && !visiMisiData && (
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={textVariants}
                className="bg-blue-50 border-l-4 border-blue-500 p-8 text-center"
              >
                <p className="text-lg text-blue-800 font-semibold mb-3">Data Visi & Misi belum tersedia</p>
                <p className="text-slate-600">Sedang dalam proses pembaruan informasi</p>
              </motion.div>
            </div>
          )}

          {/* Content when data is loaded */}
          {!loading && !error && visiMisiData && (
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Visi Section */}
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={contentBlockVariants}
                className="bg-white shadow-lg border-l-4 border-blue-600 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-8 lg:p-10">
                  <div className="flex items-center mb-6">
                    <div className="w-3 h-3 bg-blue-600 mr-4"></div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 uppercase tracking-wider">
                      Visi
                    </h2>
                  </div>
                  <div className="w-16 h-1 bg-blue-600 mb-6"></div>
                  <p className="text-base md:text-lg text-slate-700 leading-relaxed font-medium">
                    {visiMisiData.visi}
                  </p>
                </div>
              </motion.section>

              {/* Misi Section */}
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={contentBlockVariants}
                transition={{ delay: 0.2 }}
                className="bg-white shadow-lg border-l-4 border-slate-600 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-8 lg:p-10">
                  <div className="flex items-center mb-6">
                    <div className="w-3 h-3 bg-slate-600 mr-4"></div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 uppercase tracking-wider">
                      Misi
                    </h2>
                  </div>
                  <div className="w-16 h-1 bg-slate-600 mb-6"></div>
                  
                  {visiMisiData.misi && visiMisiData.misi.length > 0 ? (
                    <div className="space-y-4">
                      {visiMisiData.misi.map((item: string, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="flex items-start"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-slate-100 flex items-center justify-center mr-4 mt-1">
                            <span className="text-slate-600 font-bold text-sm">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                          </div>
                          <p className="text-base md:text-lg text-slate-700 leading-relaxed font-medium">
                            {item}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">Data misi tidak tersedia</p>
                  )}
                </div>
              </motion.section>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default VisiMisiPage;