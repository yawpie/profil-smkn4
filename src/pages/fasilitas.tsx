import MainLayout from '../components/layout/MainLayout';
import Image from 'next/image';
import { useState, useEffect, FC } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import type { Facility } from '@/types/Facility';

const Fasilitas: FC = () => { // Gunakan FC untuk menipekan komponen
  const [facilities, setFacilities] = useState<Facility[]>([]); // Tipekan state facilities
  const [activeFacility, setActiveFacility] = useState<string | null>(null); // activeFacility akan menyimpan ID fasilitas
  const [loading, setLoading] = useState<boolean>(true); // Tipekan state loading
  const [error, setError] = useState<string | null>(null); // Tipekan state error

  // Framer Motion Variants for general sections
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  // Variants for main content (sidebar and detail) for morph-like entry
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.98, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        delayChildren: 0.2,
        staggerChildren: 0.1,
      }
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      }
    },
  };

  // Variants for facility detail content (when switching between facilities)
  const detailVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
  };

  // Function to fetch facility data from backend/API
  const fetchFacilities = async (): Promise<void> => { // Tipekan fungsi fetchFacilities
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/facilities');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Facility[] = await response.json(); // Tipekan data yang diterima
      setFacilities(data);

      if (data.length > 0) {
        // Set the first facility as active by default, pastikan id tidak null
        setActiveFacility(data[0].id ?? null);
      }
    } catch (e: unknown) { // Gunakan unknown untuk error handling yang lebih aman
      console.error("Failed to fetch facilities data:", e);
      if (e instanceof Error) {
        setError(`Gagal memuat fasilitas. Detail: ${e.message}`);
      } else {
        setError("Gagal memuat fasilitas. Silakan coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Call fetchFacilities when the component mounts
  useEffect(() => {
    fetchFacilities();
  }, []);

  // Temukan fasilitas yang aktif
  const currentFacility = facilities.find((fac: Facility) => fac.id === activeFacility);

  return (
    <MainLayout>
      {/* Hero Section with Title */}
      <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-blue-100 via-sky-100 to-cyan-100 font-sans"> {/* Padding dan font-sans */}
        <div className="absolute inset-0 opacity-40 animate-blob-pulse">
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-sky-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-800 leading-tight mb-3 drop-shadow-xl" // Font H1 lebih kecil
          >
            Fasilitas <span className="text-cyan-600">Unggulan</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-gray-800 max-w-2xl mx-auto mb-8 leading-relaxed" // Font P lebih kecil
          >
            Jelajahi berbagai fasilitas modern dan lengkap yang mendukung proses belajar mengajar di sekolah kami untuk pengalaman terbaik.
          </motion.p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 bg-white shadow-inner-lg rounded-t-3xl -mt-16 relative z-10 font-sans"> {/* Padding dan font-sans */}
        {/* Loading State with Skeleton */}
        {loading && (
          <div className="flex flex-col md:flex-row gap-6 mt-8"> {/* Gap lebih kecil */}
            {/* Sidebar Skeleton */}
            <div className="w-full md:w-1/4 bg-gray-100 p-5 rounded-xl shadow-md animate-pulse"> {/* Padding lebih kecil */}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-300 rounded-md mb-2"></div>
              ))}
            </div>
            {/* Content Skeleton */}
            <div className="w-full md:w-3/4 bg-gray-100 p-7 rounded-xl shadow-md animate-pulse"> {/* Padding lebih kecil */}
              <div className="w-full h-[250px] bg-gray-300 rounded-lg mb-5"></div> {/* Tinggi dan margin lebih kecil */}
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div> {/* Tinggi dan margin lebih kecil */}
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div> {/* Tinggi dan margin lebih kecil */}
              <div className="h-4 bg-gray-300 rounded w-11/12 mb-2"></div> {/* Tinggi dan margin lebih kecil */}
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="text-center py-16 bg-red-50 rounded-xl shadow-lg border border-red-200 font-sans" // Padding dan font-sans
          >
            <p className="text-lg text-red-700 font-semibold mb-3">{error}</p> {/* Font lebih kecil */}
            <button
              onClick={fetchFacilities}
              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md text-base" // Padding & font lebih kecil
            >
              Coba Lagi
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && facilities.length === 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="text-center py-16 bg-blue-50 rounded-xl shadow-lg border border-blue-200 font-sans" // Padding dan font-sans
          >
            <p className="text-lg text-blue-700 font-semibold mb-3">Tidak ada fasilitas yang tersedia saat ini.</p> {/* Font lebih kecil */}
            <p className="text-base text-gray-600">Mohon maaf, kami sedang mempersiapkan informasi lebih lanjut.</p>
          </motion.div>
        )}

        {/* Main Content when data is loaded */}
        {!loading && !error && facilities.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className="flex flex-col md:flex-row gap-6 relative mt-8" // Gap lebih kecil
          >
            {/* Background decoration (optional, for aesthetic touch) */}
            <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl opacity-20 pointer-events-none">
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-6000"></div>
            </div>

            {/* Left Sidebar for Navigation */}
            <motion.div
              variants={itemVariants}
              className="w-full md:w-1/4 bg-white p-5 rounded-xl shadow-xl md:sticky md:top-20 h-fit z-10 border border-gray-100" // Padding lebih kecil, top lebih kecil
            >
              <h3 className="text-base font-bold text-gray-800 mb-3 pb-1.5 border-b border-gray-200">Daftar Fasilitas</h3> {/* Font H3 lebih kecil, padding lebih kecil */}
              <nav>
                <ul>
                  {facilities.map((fac: Facility) => (
                    <li key={fac.id ?? fac.name} className="mb-1.5"> {/* Margin bawah lebih kecil */}
                      <button
                        onClick={() => setActiveFacility(fac.id ?? null)}
                        className={`relative block w-full text-left py-2.5 px-3 rounded-lg transition-all duration-300 ease-in-out group text-sm
                          ${activeFacility === fac.id
                            ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold shadow-md transform translate-x-0.5' // Transform lebih kecil
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-800'
                          }`}
                      >
                        {fac.name}
                        {activeFacility === fac.id && (
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 h-2.5 w-2.5 bg-white rounded-full transition-all duration-300 group-hover:scale-125"></span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>

            {/* Right Content Area */}
            <motion.div
              variants={itemVariants}
              className="w-full md:w-3/4 bg-white p-7 rounded-xl shadow-xl z-10 border border-gray-100" // Padding lebih kecil
            >
              <AnimatePresence mode="wait">
                {currentFacility ? (
                  <motion.div
                    key={currentFacility.id ?? currentFacility.name}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={detailVariants}
                  >
                    <div className="mb-5 overflow-hidden rounded-lg shadow-md border border-gray-200"> {/* Margin bawah, rounded, shadow lebih kecil */}
                      <Image
                        src={currentFacility.image}
                        alt={currentFacility.name}
                        width={1600}
                        height={900}
                        layout="responsive"
                        objectFit="cover"
                        className="rounded-lg transition-transform duration-700 hover:scale-105" // Rounded lebih kecil
                        priority={activeFacility === facilities[0]?.id}
                      />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-3 leading-tight">{currentFacility.name}</h2> {/* Font H2 lebih kecil */}
                    {currentFacility.description.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-sm text-gray-700 leading-relaxed mb-3"> {/* Font P lebih kecil */}
                        {paragraph}
                      </p>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-facility-selected"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={detailVariants}
                    className="text-center py-8 text-gray-600 text-base" // Padding dan font lebih kecil
                  >
                    <p>Silakan pilih salah satu fasilitas dari daftar di samping untuk melihat detailnya.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </section>
    </MainLayout>
  );
}

export default Fasilitas;