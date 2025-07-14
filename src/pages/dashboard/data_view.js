"use client";

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Dashboard/Layout'; // Pastikan path Layout dashboard benar
import { motion } from 'framer-motion'; // Impor motion dari Framer Motion
import { useInView, useAnimation } from 'framer-motion'; // Impor Hooks Framer Motion untuk animasi angka
import {
  UsersIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  MegaphoneIcon,
  GlobeAltIcon, // Untuk Ekstrakurikuler
  // Tambahkan ikon lain jika diperlukan
  ExclamationCircleIcon // Untuk Error State
} from '@heroicons/react/24/outline'; // Pastikan Heroicons terinstal dan versi 24/outline

// --- Komponen Animated Counter (Digunakan untuk efek angka berjalan) ---
const AnimatedCounter = ({ from, to, duration = 1.5, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(from);
  const ref = React.useRef(null); // Gunakan React.useRef
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const controls = useAnimation();

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
      ref={ref}
      className="inline-block"
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


// Impor Recharts components
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart, // Tambah LineChart untuk contoh tren
  Line
} from 'recharts';

const DashboardOverviewPage = () => {
  const [totals, setTotals] = useState({
    teachers: 0,
    articles: 0,
    majors: 0,
    extracurriculars: 0,
    facilities: 0,
    announcements: 0,
    students: 0 // Tambahkan total students
  });
  const [loadingTotals, setLoadingTotals] = useState(true);
  const [errorTotals, setErrorTotals] = useState(null);

  // Recharts Data (bisa juga diambil dari API jika ada)
  const monthlyData = [
    { name: 'Jan', students: 50, teachers: 10, articles: 5 },
    { name: 'Feb', students: 70, teachers: 12, articles: 7 },
    { name: 'Mar', students: 60, teachers: 11, articles: 6 },
    { name: 'Apr', students: 80, teachers: 13, articles: 8 },
    { name: 'May', students: 90, teachers: 14, articles: 9 },
    { name: 'Jun', students: 100, teachers: 15, articles: 10 },
  ];

  const majorsDistribution = [
    { name: 'RPL', value: 350 },
    { name: 'TKJ', value: 280 },
    { name: 'DKV', value: 180 },
    { name: 'Akuntansi', value: 120 },
    { name: 'Tata Boga', value: 80 },
    { name: 'Teknik Otomotif', value: 140 },
  ];

  // Pastikan warna-warna ini konsisten dengan palet Anda
  const PIE_COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#EC4899', '#EF4444', '#10B981', '#06B6D4']; // Tambahkan warna jika lebih banyak jurusan


  // --- Fetching Data for Totals ---
  useEffect(() => {
    async function fetchDashboardTotals() {
      setLoadingTotals(true);
      setErrorTotals(null);
      try {
        // Contoh API endpoint yang mengembalikan semua total
        // Anda perlu membuat endpoint ini di `pages/api/dashboard-totals.js`
        const response = await fetch('/api/dashboard-totals');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTotals(data); // Data langsung di set ke state totals
      } catch (e) {
        console.error("Failed to fetch dashboard totals:", e);
        setErrorTotals("Gagal memuat data total. Silakan coba lagi.");
      } finally {
        setLoadingTotals(false);
      }
    }
    fetchDashboardTotals();
  }, []); // Hanya dijalankan sekali saat mount


  // Data Cards untuk dirender
  const dataCards = [
    {
      title: 'Total Siswa', value: totals.students, icon: UsersIcon,
      gradient: 'from-blue-600 to-blue-800', iconBg: 'bg-blue-100/50 text-blue-600',
      shadowColor: 'shadow-blue-400/50'
    },
    {
      title: 'Total Guru', value: totals.teachers, icon: AcademicCapIcon,
      gradient: 'from-indigo-600 to-indigo-800', iconBg: 'bg-indigo-100/50 text-indigo-600',
      shadowColor: 'shadow-indigo-400/50'
    },
    {
      title: 'Total Jurusan', value: totals.majors, icon: BuildingOfficeIcon, // Ikon untuk Jurusan
      gradient: 'from-purple-600 to-purple-800', iconBg: 'bg-purple-100/50 text-purple-600',
      shadowColor: 'shadow-purple-400/50'
    },
    {
      title: 'Total Artikel', value: totals.articles, icon: DocumentTextIcon,
      gradient: 'from-green-600 to-green-800', iconBg: 'bg-green-100/50 text-green-600',
      shadowColor: 'shadow-green-400/50'
    },
    {
      title: 'Total Ekstrakurikuler', value: totals.extracurriculars, icon: GlobeAltIcon, // Ikon untuk Ekstrakurikuler
      gradient: 'from-orange-600 to-orange-800', iconBg: 'bg-orange-100/50 text-orange-600',
      shadowColor: 'shadow-orange-400/50'
    },
    {
      title: 'Total Fasilitas', value: totals.facilities, icon: BuildingOfficeIcon, // Ikon untuk Fasilitas (BuildingOfficeIcon)
      gradient: 'from-teal-600 to-teal-800', iconBg: 'bg-teal-100/50 text-teal-600',
      shadowColor: 'shadow-teal-400/50'
    },
    {
      title: 'Total Pengumuman', value: totals.announcements, icon: MegaphoneIcon,
      gradient: 'from-rose-600 to-rose-800', iconBg: 'bg-rose-100/50 text-rose-600',
      shadowColor: 'shadow-rose-400/50'
    },
  ];

  // Framer Motion Variants for section components
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.1 } },
  };

  const cardItemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } },
  };


  return (
    <Layout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="bg-white rounded-xl shadow-lg p-8 mb-8"
      >
        <motion.h1
          variants={cardItemVariants}
          className="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight"
        >
          Dashboard Overview
        </motion.h1>
        <motion.p
          variants={cardItemVariants}
          className="text-lg text-gray-600 mb-8 max-w-2xl"
        >
          Dapatkan ringkasan cepat dan visualisasi data penting sekolah Anda.
        </motion.p>

        {loadingTotals ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(dataCards.length)].map((_, i) => (
              <div key={i} className="bg-gray-100 p-6 rounded-xl shadow-lg animate-pulse h-36 flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : errorTotals ? (
          <div className="text-center py-10 bg-red-50 rounded-xl shadow-lg border border-red-200">
            <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-xl text-red-700 font-semibold mb-2">{errorTotals}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"> {/* Lebih banyak kolom */}
            {dataCards.map((card, index) => (
              <motion.div
                key={index}
                variants={cardItemVariants}
                className={`relative bg-gradient-to-br ${card.gradient} p-6 rounded-xl shadow-lg flex items-center space-x-4
                            transform hover:scale-[1.03] transition-transform duration-300 ease-in-out
                            overflow-hidden group hover:${card.shadowColor} `}
              >
                {/* Background overlay for hover effect */}
                <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-15 transition-opacity duration-300 rounded-xl"></div>
                {/* Icon Circle */}
                <div className={`p-3 rounded-full ${card.iconBg} bg-opacity-70 backdrop-blur-sm relative z-10 flex-shrink-0`}> {/* Padding ikon lebih kecil */}
                  {card.icon && <card.icon className="h-8 w-8" />} {/* Ukuran ikon lebih kecil */}
                </div>
                {/* Text Content */}
                <div className="relative z-10">
                  <h3 className="text-base font-semibold text-white opacity-90">{card.title}</h3> {/* Ukuran teks judul lebih kecil */}
                  <p className="text-3xl font-extrabold text-white mt-0.5 drop-shadow-md">
                    <AnimatedCounter from={0} to={card.value} />
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8"
      >
        {/* Aktivitas Bulanan Chart (Bar Chart) */}
        <motion.div variants={cardItemVariants} className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Aktivitas Bulanan</h2>
          <p className="text-gray-600 mb-4">Tren jumlah siswa, guru, dan artikel per bulan.</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} vertical={false} /> {/* Garis grid lebih halus, hanya horizontal */}
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                cursor={{ fill: 'rgba(0,0,0,0.05)' }} // Kursor Tooltip lebih lembut
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}
                labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                itemStyle={{ color: '#4b5563' }}
              />
              <Legend wrapperStyle={{ paddingTop: '15px' }} /> {/* Padding atas legend */}
              <Bar dataKey="students" fill="#3B82F6" name="Jumlah Siswa" barSize={25} radius={[10, 10, 0, 0]} />
              <Bar dataKey="teachers" fill="#6366F1" name="Jumlah Guru" barSize={25} radius={[10, 10, 0, 0]} />
              <Bar dataKey="articles" fill="#10B981" name="Jumlah Artikel" barSize={25} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Distribusi Jurusan Chart (Pie Chart) */}
        <motion.div variants={cardItemVariants} className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Distribusi Jurusan</h2>
          <p className="text-gray-600 mb-4">Persebaran siswa di berbagai jurusan.</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={majorsDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {majorsDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}
                labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                itemStyle={{ color: '#4b5563' }}
              />
              <Legend wrapperStyle={{ paddingTop: '15px' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Laporan & Analisis Lainnya */}
        <motion.div variants={cardItemVariants} className="bg-white rounded-xl shadow-lg p-8 lg:col-span-2"> {/* Span 2 kolom */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Laporan & Analisis Lainnya</h2>
          <p className="text-gray-600">
            Bagian ini bisa diperluas dengan lebih banyak metrik, tabel, atau laporan detail.
            Misalnya, tingkat kehadiran guru, popularitas ekstrakurikuler, atau kinerja siswa.
          </p>
          <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200 text-gray-500 italic flex items-center justify-center h-40">
            <p className="text-center">Area untuk laporan dan analisis mendalam di masa mendatang.</p>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default DashboardOverviewPage;