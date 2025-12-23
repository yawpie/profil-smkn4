import MainLayout from "../components/layout/MainLayout";
import Image from "next/image";
import { useState, useEffect, FC } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import type {
  FacilitiesApiEnvelope,
  Facility,
  FacilityApi,
} from "@/types/Facility";
import { apiGet } from "@/utils/apiClient";
import ContentNotAvailableCard from "@/components/Beranda/NotAvailable";

const Fasilitas: FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [activeFacility, setActiveFacility] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Framer Motion Variants for general sections
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Variants for main content
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.98, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delayChildren: 0.1,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 25,
      },
    },
  };

  // Variants for facility detail content
  const detailVariants: Variants = {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: "easeIn" } },
  };

  // Function to fetch facility data from backend/API
  const fetchFacilities = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiGet<FacilitiesApiEnvelope>("/facilities");
      if (response) {
        const data: Facility[] = response.data.map((item: FacilityApi) => ({
          id: item.id || null,
          name: item.name,
          image: item.image_url || "/images/placeholder-facility.png",
          description: item.description || "Deskripsi tidak tersedia.",
          location: item.location || "Lokasi tidak tersedia.",
          status:
            item.status === "TERSEDIA"
              ? "Tersedia"
              : item.status === "DIGUNAKAN"
              ? "Digunakan"
              : item.status === "PERBAIKAN"
              ? "Perbaikan"
              : "Tidak Tersedia",
        }));
        setFacilities(data);

        if (data.length > 0) {
          setActiveFacility(data[0].id ?? null);
        }
      } else {
        setError("Data fasilitas tidak tersedia.");
      }
    } catch (e: unknown) {
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

  // Find active facility
  const currentFacility = facilities.find(
    (fac: Facility) => fac.id === activeFacility
  );

  return (
    <MainLayout>
      {/* Professional Hero Section */}
      <section className="relative w-full py-16 md:py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-b-4 border-blue-700 font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
          >
            Fasilitas <span className="text-blue-300">Unggulan</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Jelajahi berbagai fasilitas modern dan lengkap yang mendukung proses
            belajar mengajar di sekolah kami untuk pengalaman terbaik.
          </motion.p>

          {/* Professional breadcrumb-style indicator */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            transition={{ delay: 0.4 }}
            className="mt-8 inline-block bg-blue-800/30 px-6 py-2 border border-blue-600/50"
          >
            <span className="text-blue-100 font-semibold uppercase tracking-wide text-sm">
              Fasilitas Sekolah
            </span>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="bg-white font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Loading State with Professional Skeleton */}
          {loading && (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Skeleton */}
              <div className="w-full lg:w-1/4 bg-gray-50 border-2 border-gray-200 shadow-lg animate-pulse">
                <div className="bg-slate-800 p-4">
                  <div className="h-5 bg-gray-600 w-3/4"></div>
                </div>
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-6 bg-gray-300"></div>
                  ))}
                </div>
              </div>
              {/* Content Skeleton */}
              <div className="w-full lg:w-3/4 bg-gray-50 border-2 border-gray-200 shadow-lg animate-pulse">
                <div className="p-6">
                  <div className="w-full h-64 bg-gray-300 mb-6"></div>
                  <div className="h-8 bg-gray-300 w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 w-11/12 mb-2"></div>
                  <div className="h-4 bg-gray-300 w-5/6"></div>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              className="bg-white border-l-4 border-red-600 shadow-lg p-8 max-w-2xl mx-auto"
            >
              <div className="flex items-center mb-4">
                <svg
                  className="w-8 h-8 text-red-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                  Error
                </h3>
              </div>
              <p className="text-base text-gray-700 mb-6">{error}</p>
              <button
                onClick={fetchFacilities}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg uppercase tracking-wide text-sm"
              >
                Coba Lagi
              </button>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && facilities.length === 0 && (
            
            <ContentNotAvailableCard 
            title="Tidak Ada Fasilitas" 
            content="Tidak ada fasilitas yang tersedia saat ini. Mohon maaf, kami
                sedang mempersiapkan informasi lebih lanjut."/>
          )}

          {/* Main Content when data is loaded */}
          {!loading && !error && facilities.length > 0 && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={containerVariants}
              className="flex flex-col lg:flex-row gap-8"
            >
              {/* Left Sidebar for Navigation */}
              <motion.div
                variants={itemVariants}
                className="w-full lg:w-1/4 bg-gray-50 border-2 border-gray-300 shadow-lg lg:sticky lg:top-6 h-fit"
              >
                {/* Sidebar Header */}
                <div className="bg-slate-800 text-white p-4">
                  <h3 className="text-base font-bold uppercase tracking-wider">
                    Daftar Fasilitas
                  </h3>
                </div>

                {/* Sidebar Navigation */}
                <nav className="p-4">
                  <ul className="space-y-2">
                    {facilities.map((fac: Facility) => (
                      <li key={fac.id ?? fac.name}>
                        <button
                          onClick={() => setActiveFacility(fac.id ?? null)}
                          className={`relative block w-full text-left py-3 px-4 transition-all duration-300 ease-in-out text-sm font-medium border-l-4
                            ${
                              activeFacility === fac.id
                                ? "bg-blue-700 text-white border-blue-500 shadow-md"
                                : "text-gray-700 hover:bg-gray-100 hover:text-blue-800 border-transparent hover:border-blue-300"
                            }`}
                        >
                          {fac.name}
                          {activeFacility === fac.id && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-white"></span>
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
                className="w-full lg:w-3/4 bg-white border-2 border-gray-200 shadow-lg"
              >
                <AnimatePresence mode="wait">
                  {currentFacility ? (
                    <motion.div
                      key={currentFacility.id ?? currentFacility.name}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={detailVariants}
                      className="p-8"
                    >
                      {/* Facility Image */}
                      <div className="mb-8 bg-gray-100 border-2 border-gray-300 overflow-hidden shadow-lg">
                        <Image
                          src={currentFacility.image}
                          alt={currentFacility.name}
                          width={1200}
                          height={600}
                          layout="responsive"
                          objectFit="cover"
                          className="transition-transform duration-500 hover:scale-105"
                          priority={activeFacility === facilities[0]?.id}
                        />
                      </div>

                      {/* Facility Title */}
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 border-b-4 border-gray-300 pb-3 uppercase tracking-wide">
                        {currentFacility.name}
                      </h2>

                      {/* Facility Description */}
                      <div
                        className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                        style={{ lineHeight: "1.7" }}
                      >
                        {currentFacility.description
                          .split("\n\n")
                          .map((paragraph, index) => (
                            <p
                              key={index}
                              className="text-base text-gray-700 leading-relaxed mb-4"
                            >
                              {paragraph}
                            </p>
                          ))}
                      </div>

                      {/* Additional Info Section */}
                      <div className="mt-8 pt-6 border-t-2 border-gray-300">
                        <div className="bg-gray-50 border border-gray-200 p-4">
                          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                            Status Fasilitas
                          </h4>
                          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 text-xs font-semibold uppercase tracking-wide border border-green-300">
                            Tersedia
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="no-facility-selected"
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={detailVariants}
                      className="p-12 text-center text-gray-600"
                    >
                      <div className="bg-gray-50 border-2 border-gray-200 p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
                          Pilih Fasilitas
                        </h3>
                        <p className="text-base">
                          Silakan pilih salah satu fasilitas dari daftar di
                          samping untuk melihat detailnya.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Fasilitas;
