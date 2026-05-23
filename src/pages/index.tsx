// src/pages/index.tsx
import React, { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import HeroSection from "../components/Beranda/HeroSection";
import DaftarGuru from "../components/layout/DaftarGuru";
import ArticleSection from "../components/layout/ArticleSection";
import StatsSection from "../components/Beranda/StatsSection";
import LatestAnnouncement from "../components/layout/LatestAnnouncement";
import LatestAchievement from "../components/layout/LatestAchievement";
import { motion } from "framer-motion";
import Image from "next/image";

// Impor semua tipe data yang telah Anda berikan
import type { TeachersApiEnvelope } from "../types/Teacher";
import type { ExtracurricularsApiEnvelope } from "../types/Extracurricular";
import type { FacilitiesApiEnvelope } from "../types/Facility";
// import type { StaffApiResponse } from "../types/Staff";
import type { MajorsApiEnvelope } from "../types/Major";
import { apiGet } from "@/utils/apiClient";

export default function HomePage() {
  const [statsData, setStatsData] = useState({
    totalSiswa: "1000+",
    totalGuru: 0,
    // totalStaff: 0,
    totalEkstrakurikuler: 0,
    totalJurusan: 0,
    totalFasilitas: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          guruResponse,
          // staffResponse,
          ekstraResponse,
          jurusanResponse,
          fasilitasResponse,
        ] = await Promise.all([
          apiGet<TeachersApiEnvelope>("/teachers"),
          // apiGet<StaffApiResponse>("/staff"),
          apiGet<ExtracurricularsApiEnvelope>("/extracurriculars"),
          apiGet<MajorsApiEnvelope>("/majors"),
          apiGet<FacilitiesApiEnvelope>("/facilities"),
        ]);

        setStatsData({
          ...statsData,
          // totalSiswa: "800",
          totalGuru: guruResponse.total,
          // totalStaff: staffResponse.data.length,
          totalEkstrakurikuler: ekstraResponse.total,
          totalJurusan: jurusanResponse.total,
          totalFasilitas: fasilitasResponse.total,
        });
      } catch (error) {
        console.error("Gagal mengambil data statistik:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <MainLayout>
      <HeroSection />

      {/* Principal's Welcome Section - Professional Design */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white shadow-lg border border-slate-200  relative overflow-hidden"
          >
            {/* Geometric Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-600 transform rotate-12"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-slate-600 transform -rotate-12"></div>
              <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-blue-500 transform rotate-45"></div>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center ">
              {/* Principal Photo */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex h-full justify-center order-2 md:order-1 "
              >
                <div className="relative bg-slate-100 shadow-xl border border-slate-200">
                  <Image
                    src="/images/foto-kepala-sekolah.jpg"
                    alt="Kepala Sekolah SMKN 4 Mataram"
                    width={3365}
                    height={4000}
                    // layout="responsive"
                    // objectFit="fill"
                    // fill
                    className={"h-full w-full object-cover object-center "} //hover:scale-105 transition-transform duration-300
                  />
                </div>
              </motion.div>

              {/* Principal's Message */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-center md:text-left order-1 md:order-2 m-16"
              >
                <div className="mb-6">
                  <div className="flex items-center justify-center md:justify-start mb-4">
                    <div className="w-3 h-3 bg-blue-600 mr-4"></div>
                    <span className="text-sm text-slate-500 uppercase tracking-wider font-medium">
                      Sambutan Kepala Sekolah
                    </span>
                  </div>
                  <div className="w-16 h-1 bg-blue-600 mx-auto md:mx-0 mb-6"></div>
                </div>

                <blockquote className="text-lg md:text-xl font-semibold text-slate-800 mb-6 leading-relaxed">
                  "Pendidikan adalah investasi terbaik untuk masa depan. Kami
                  berkomitmen menghasilkan lulusan yang kompeten, berkarakter,
                  dan siap menghadapi tantangan dunia industri."
                </blockquote>

                <div className="border-l-4 border-blue-600 pl-6 mb-6">
                  <p className="text-slate-600 leading-relaxed">
                    SMKN 4 Mataram terus berinovasi dalam menyediakan pendidikan
                    vokasi berkualitas tinggi yang sesuai dengan kebutuhan
                    industri dan perkembangan teknologi terkini.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 border-l-2 border-slate-300">
                  <p className="font-semibold text-slate-900 mb-1">
                    Iwan Supriady, A.Md.Par., S.Pd.
                  </p>
                  <p className="text-sm text-slate-600 tracking-wide">
                    Kepala Sekolah SMKN 4 Mataram
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Other Sections */}
      <StatsSection stats={statsData} />
      <LatestAnnouncement />
      <LatestAchievement />
      <DaftarGuru />
      <ArticleSection />

      {/* School Profile Video Section - Professional Design */}
      <section className="bg-slate-100 py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white shadow-lg border border-slate-200 p-8 md:p-12 relative overflow-hidden"
          >
            {/* Geometric Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600 transform rotate-45"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-slate-600 transform -rotate-45"></div>
              <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-blue-500 transform rotate-12"></div>
            </div>

            <div className="relative z-10">
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-3 h-3 bg-blue-600 mr-4"></div>
                  <span className="text-sm text-slate-500 uppercase tracking-wider font-medium">
                    Profil Institusi
                  </span>
                  <div className="w-3 h-3 bg-blue-600 ml-4"></div>
                </div>
                <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Video Profil{" "}
                  <span className="text-blue-600">SMKN 4 Mataram</span>
                </h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  Mengenal lebih dekat fasilitas modern, program unggulan, dan
                  suasana pembelajaran di sekolah menengah kejuruan terdepan di
                  Mataram.
                </p>
              </motion.div>

              {/* Video Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative mx-auto w-full max-w-5xl bg-slate-900 shadow-2xl border border-slate-300 overflow-hidden"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/VaswBn3SVIQ?rel=0"
                  title="Video Profil SMKN 4 Mataram"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </motion.div>

              {/* Video Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="bg-slate-50 p-6 border-l-4 border-blue-600">
                  <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wide">
                    Fasilitas Modern
                  </h4>
                  <p className="text-sm text-slate-600">
                    Laboratorium dan workshop terlengkap dengan teknologi
                    terkini
                  </p>
                </div>
                <div className="bg-slate-50 p-6 border-l-4 border-slate-600">
                  <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wide">
                    Program Unggulan
                  </h4>
                  <p className="text-sm text-slate-600">
                    Kurikulum selaras industri dengan sertifikasi internasional
                  </p>
                </div>
                <div className="bg-slate-50 p-6 border-l-4 border-blue-600">
                  <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wide">
                    Prestasi Terbaik
                  </h4>
                  <p className="text-sm text-slate-600">
                    Lulusan berprestasi dengan tingkat serapan kerja tinggi
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}
