// components/Beranda/StatsSection.js
"use client";

import { motion, useInView, useAnimation } from 'framer-motion'; // Tambahkan useInView, useAnimation
import { useState, useEffect, useRef } from 'react'; // Tambahkan useRef
// Impor ikon dari Heroicons (pastikan sudah terinstal: npm install @heroicons/react)
import { UsersIcon, AcademicCapIcon, BuildingLibraryIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

// --- Komponen Animated Counter (Digunakan untuk efek angka berjalan dari 0 ke target) ---
const AnimatedCounter = ({ from, to, duration = 2, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(from);
  const ref = useRef(null); // Gunakan useRef untuk elemen yang diobservasi
  const isInView = useInView(ref, { once: true, amount: 0.5 }); // Trigger saat 50% di viewport
  const controls = useAnimation(); // Kontrol animasi

  useEffect(() => {
    if (isInView) {
      controls.start({
        count: to,
        transition: { duration: duration, ease: "easeOut" }
      });
    }
  }, [isInView, to, duration, controls]);

  return (
    <motion.span
      ref={ref} // Referensikan span ini ke useRef
      initial={{ count: from }}
      animate={controls}
      onUpdate={(latest) => {
        setCount(Math.round(latest.count));
      }}
    >
      {prefix}{count.toLocaleString('id-ID')}{suffix}
    </motion.span>
  );
};

export default function StatsSection() {
  const [statsData, setStatsData] = useState(null); // Akan menyimpan { totalStudents, totalMajors, totalTeachers }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Framer Motion Variants
  const sectionHeaderVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
        damping: 15,
      }
    },
  };

  // --- Fungsi untuk mengambil data statistik dari API ---
  useEffect(() => {
    async function fetchSchoolStats() {
      setLoading(true);
      setError(null);
      try {
        // Ganti URL ini dengan endpoint API Anda yang mengembalikan data statistik
        // Contoh: { totalStudents: 1250, totalMajors: 10, totalTeachers: 85 }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.236.15:3000"}/api/stats`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStatsData(data); // Simpan data yang diambil
      } catch (e) {
        console.error("Gagal mengambil data statistik sekolah:", e);
        setError("Gagal memuat statistik. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    }

    fetchSchoolStats();
  }, []); // Jalankan hanya sekali saat komponen mount


  // Data untuk dirender (kondisional berdasarkan loading/error/data)
  const statsToRender = statsData ? [
    { id: 1, label: 'Total Siswa', targetValue: statsData.totalStudents, icon: UsersIcon, accentColor: 'text-blue-600' },
    { id: 2, label: 'Total Jurusan', targetValue: statsData.totalMajors, icon: BuildingLibraryIcon, accentColor: 'text-indigo-600' },
    { id: 3, label: 'Total Guru', targetValue: statsData.totalTeachers, icon: AcademicCapIcon, accentColor: 'text-purple-600' },
  ] : [];

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Loading State dengan Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl shadow-md p-6 text-center animate-pulse">
              <div className="h-14 bg-gray-300 rounded-lg mb-3 w-3/4 mx-auto"></div>
              <div className="h-5 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-10 bg-red-50 rounded-xl shadow-lg border border-red-200">
          <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-red-700 font-semibold mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Empty State (Jika tidak ada data atau API mengembalikan kosong) */}
      {!loading && !error && (!statsData || statsToRender.length === 0) && (
        <div className="text-center py-10 bg-blue-50 rounded-xl shadow-lg border border-blue-200">
          <p className="text-lg text-gray-600">Statistik belum tersedia saat ini.</p>
          <p className="text-sm text-gray-500">Mohon coba lagi nanti atau hubungi administrator.</p>
        </div>
      )}

      {/* Tampilan Statistik (Jika data sudah dimuat) */}
      {!loading && !error && statsData && statsToRender.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {statsToRender.map((stat, index) => (
            <motion.div
              key={stat.id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.15 }} // Staggered animation
              className="bg-white rounded-xl shadow-lg p-6 text-center
                         transform transition-all duration-300 ease-in-out
                         hover:scale-[1.03] hover:shadow-2xl hover:border-purple-400 border border-transparent
                         group relative cursor-pointer overflow-hidden"
            >
              {/* Latar belakang gradasi pada hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>

              <div className="relative z-10">
                <div className="mb-4 flex justify-center items-center">
                  <stat.icon className={`h-10 w-10 ${stat.accentColor} group-hover:text-white transition-colors duration-300`} />
                </div>
                <h3 className="text-4xl font-extrabold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                  <AnimatedCounter from={0} to={stat.targetValue} />{stat.label !== 'Total Jurusan' ? '+' : ''}
                </h3>
                <p className="text-lg text-gray-600 group-hover:text-indigo-800 transition-colors duration-300 font-semibold">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}