import MainLayout from "../components/layout/MainLayout";
import Image from "next/image";
import { useState, useEffect, FC } from "react";
import { motion, type Variants } from "framer-motion";
import type {
  FacilitiesApiEnvelope,
  Facility,
  FacilityApi,
} from "@/types/Facility";
import { apiGet } from "@/utils/apiClient";
import ContentNotAvailableCard from "@/components/Beranda/NotAvailable";
import RichTextRenderer from "@/components/RichTextRenderer";

const Fasilitas: FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

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

  useEffect(() => {
    fetchFacilities();
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
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
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-slate-50 font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Loading State */}
          {loading && (
            <div className="max-w-4xl mx-auto space-y-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 shadow-md animate-pulse"
                >
                  <div className="w-full h-64 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-7 bg-gray-300 w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-300 w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 w-11/12 mb-2"></div>
                    <div className="h-4 bg-gray-300 w-4/5"></div>
                  </div>
                </div>
              ))}
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
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors duration-300 shadow-md uppercase tracking-wide text-sm"
              >
                Coba Lagi
              </button>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && facilities.length === 0 && (
            <ContentNotAvailableCard
              title="Tidak Ada Fasilitas"
              content="Tidak ada fasilitas yang tersedia saat ini. Mohon maaf, kami sedang mempersiapkan informasi lebih lanjut."
            />
          )}

          {/* Facility List */}
          {!loading && !error && facilities.length > 0 && (
            <div className="max-w-4xl mx-auto space-y-10">
              {facilities.map((facility, index) => (
                <motion.div
                  key={facility.id ?? facility.name}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  variants={cardVariants}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-200 shadow-lg overflow-hidden"
                >
                  {/* Facility Image */}
                  <div className="relative w-full h-64 sm:h-80 bg-gray-100">
                    <Image
                      src={facility.image}
                      alt={facility.name}
                      fill
                      style={{ objectFit: "cover" }}
                      quality={80}
                    />
                  </div>

                  {/* Facility Content */}
                  <div className="p-6 sm:p-8">
                    {/* Title & Status */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase tracking-wide">
                        {facility.name}
                      </h2>
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wide border ${
                          facility.status === "Tersedia"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : facility.status === "Digunakan"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                            : facility.status === "Perbaikan"
                            ? "bg-orange-100 text-orange-800 border-orange-300"
                            : "bg-gray-100 text-gray-800 border-gray-300"
                        }`}
                      >
                        {facility.status}
                      </span>
                    </div>

                    {/* Description */}
                    <RichTextRenderer
                      content={facility.description}
                      className="text-gray-700 leading-relaxed"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Fasilitas;
