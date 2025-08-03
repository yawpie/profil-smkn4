// src/pages/dashboard/index.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Dashboard/Layout';
import { motion, useInView, useAnimation, Variants } from 'framer-motion';
import {
  UsersIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  MegaphoneIcon,
  GlobeAltIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

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
} from 'recharts';

import type {
  TotalsData,
  MonthlyDataItem,
  MajorDistributionItem,
  DataCardProps,
  AnimatedCounterProps
} from '@/types/index'; // Pastikan path ini benar

// --- Komponen Animated Counter (Digunakan untuk efek angka berjalan) ---
const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ from, to, duration = 1.5, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState<number>(from);
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        transition: {
          duration,
          ease: 'easeOut',
        }
      });

      const start = performance.now();

      const animate = (now: number) => {
        const elapsed = (now - start) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        const current = from + (to - from) * progress;
        setCount(Math.round(current));
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, from, to, duration, controls]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={controls}
    >
      {prefix}{count.toLocaleString('id-ID')}{suffix}
    </motion.span>
  );
};

// --- Komponen DataCard (untuk card total) ---
const DataCard: React.FC<DataCardProps & { variants: Variants }> = ({ title, value, icon: Icon, gradient, iconBg, shadowColor, variants }) => (
  <motion.div
    variants={variants}
    className={`relative bg-gradient-to-br ${gradient} p-4 rounded-xl shadow-lg flex items-center space-x-3
                 transform hover:scale-[1.03] transition-transform duration-300 ease-in-out
                 overflow-hidden group ${shadowColor} border border-opacity-20 border-white/30`}
  >
    <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-15 transition-opacity duration-300 rounded-xl"></div>
    <div className={`p-2 rounded-full ${iconBg} bg-opacity-70 backdrop-blur-sm relative z-10 flex-shrink-0
                     shadow-inner `}> {/* Added shadow-inner for depth */}
      {Icon && <Icon className="h-6 w-6 text-white" />} {/* Ensure icon color is white for premium look */}
    </div>
    <div className="relative z-10">
      <h3 className="text-sm font-semibold text-white opacity-90">{title}</h3>
      <p className="text-2xl font-extrabold text-white mt-0.5 drop-shadow-md">
        <AnimatedCounter from={0} to={value} />
      </p>
    </div>
  </motion.div>
);

const DashboardOverviewPage: React.FC = () => {
  const [totals, setTotals] = useState<TotalsData>({
    teachers: 0,
    articles: 0,
    majors: 0,
    extracurriculars: 0,
    facilities: 0,
    announcements: 0,
    students: 0
  });
  const [loadingTotals, setLoadingTotals] = useState<boolean>(true);
  const [errorTotals, setErrorTotals] = useState<string | null>(null);

  // Recharts Data (bisa juga diambil dari API jika ada)
  const monthlyData: MonthlyDataItem[] = [
    { name: 'Jan', students: 50, teachers: 10, articles: 5 },
    { name: 'Feb', students: 70, teachers: 12, articles: 7 },
    { name: 'Mar', students: 60, teachers: 11, articles: 6 },
    { name: 'Apr', students: 80, teachers: 13, articles: 8 },
    { name: 'Mei', students: 90, teachers: 14, articles: 9 }, // Changed May to Mei
    { name: 'Jun', students: 100, teachers: 15, articles: 10 },
  ];

  const majorsDistribution: MajorDistributionItem[] = [
    { name: 'Rekayasa Perangkat Lunak', value: 350 }, // More descriptive names
    { name: 'Teknik Komputer & Jaringan', value: 280 },
    { name: 'Desain Komunikasi Visual', value: 180 },
    { name: 'Akuntansi & Keuangan', value: 120 },
    { name: 'Kuliner', value: 80 },
    { name: 'Teknik Kendaraan Ringan', value: 140 },
  ];

  // Palet warna yang lebih kaya dan premium untuk Pie Chart
  const PIE_COLORS: string[] = [
    '#6366F1', // Indigo
    '#0EA5E9', // Sky Blue
    '#EC4899', // Pink
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#A855F7', // Purple
    '#22C55E', // Green
  ];

  // --- Fetching Data for Totals ---
  useEffect(() => {
    async function fetchDashboardTotals() {
      setLoadingTotals(true);
      setErrorTotals(null);
      try {
        const response = await fetch('/api/dashboard-totals');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: TotalsData = await response.json();
        setTotals(data);
      } catch (e: any) {
        console.error("Failed to fetch dashboard totals:", e);
        setErrorTotals("Gagal memuat data total. Silakan coba lagi.");
      } finally {
        setLoadingTotals(false);
      }
    }
    fetchDashboardTotals();
  }, []);

  // Data Cards untuk dirender dengan warna premium
  const dataCards: DataCardProps[] = [
    {
      title: 'Total Siswa', value: totals.students, icon: UsersIcon,
      gradient: 'from-blue-700 to-blue-900', iconBg: 'bg-blue-500', // Solid, richer iconBg
      shadowColor: 'shadow-blue-600/60' // Deeper shadow
    },
    {
      title: 'Total Guru', value: totals.teachers, icon: AcademicCapIcon,
      gradient: 'from-purple-700 to-purple-900', iconBg: 'bg-purple-500',
      shadowColor: 'shadow-purple-600/60'
    },
    {
      title: 'Total Jurusan', value: totals.majors, icon: BuildingOfficeIcon,
      gradient: 'from-teal-700 to-teal-900', iconBg: 'bg-teal-500',
      shadowColor: 'shadow-teal-600/60'
    },
    {
      title: 'Total Artikel', value: totals.articles, icon: DocumentTextIcon,
      gradient: 'from-orange-700 to-orange-900', iconBg: 'bg-orange-500',
      shadowColor: 'shadow-orange-600/60'
    },
    {
      title: 'Total Ekstrakurikuler', value: totals.extracurriculars, icon: GlobeAltIcon,
      gradient: 'from-emerald-700 to-emerald-900', iconBg: 'bg-emerald-500',
      shadowColor: 'shadow-emerald-600/60'
    },
    {
      title: 'Total Fasilitas', value: totals.facilities, icon: BuildingOfficeIcon, // Using BuildingOfficeIcon twice, consider another icon if available
      gradient: 'from-rose-700 to-rose-900', iconBg: 'bg-rose-500',
      shadowColor: 'shadow-rose-600/60'
    },
    {
      title: 'Total Pengumuman', value: totals.announcements, icon: MegaphoneIcon,
      gradient: 'from-cyan-700 to-cyan-900', iconBg: 'bg-cyan-500',
      shadowColor: 'shadow-cyan-600/60'
    },
  ];

  // Framer Motion Variants for section components
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    },
  };

  const cardItemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
  };

  return (
    <Layout setNotification={() => {}}>
      {/* Header Section - Dashboard Overview */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-6 mb-6 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("/images/abstract-bg.svg")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div> {/* Add a subtle background texture */}
        <div className="relative z-10">
          <motion.h1
            variants={cardItemVariants}
            className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight drop-shadow-lg"
          >
            Dashboard Admin
          </motion.h1>
          <motion.p
            variants={cardItemVariants}
            className="text-md md:text-lg text-gray-300 mb-6 max-w-2xl leading-relaxed"
          >
            Selamat datang kembali! Dapatkan ringkasan cepat dan visualisasi data penting sekolah Anda di sini.
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="space-y-6"> {/* Adjusted for better overall spacing */}
        {/* Total Data Cards Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          {/* Judul dengan 'Frame' Premium */}
          <motion.div
            variants={cardItemVariants}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3 rounded-lg mb-6 shadow-xl flex items-center justify-between"
          >
            <h2 className="text-xl font-bold tracking-wide">Ringkasan Data Sekolah</h2>
            <AcademicCapIcon className="h-7 w-7 text-white opacity-80" />
          </motion.div>

          {loadingTotals ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(dataCards.length)].map((_, i) => (
                <div key={i} className="bg-gray-100 p-4 rounded-xl shadow-lg animate-pulse h-32 flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-7 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : errorTotals ? (
            <div className="text-center py-8 bg-red-50 rounded-xl shadow-lg border border-red-200">
              <ExclamationCircleIcon className="h-10 w-10 text-red-500 mx-auto mb-3" />
              <p className="text-lg text-red-700 font-semibold mb-2">{errorTotals}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 px-5 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md text-sm"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dataCards.map((card, index) => (
                <DataCard key={index} {...card} variants={cardItemVariants} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Aktivitas Bulanan Chart (Bar Chart) */}
          <motion.div variants={cardItemVariants} className="bg-white rounded-xl shadow-lg p-6">
            {/* Judul dengan 'Frame' Premium */}
            <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white p-3 rounded-lg mb-5 shadow-xl flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-wide">Aktivitas Bulanan</h2>
              <DocumentTextIcon className="h-7 w-7 text-white opacity-80" />
            </div>
            <p className="text-gray-600 text-sm mb-3">Tren jumlah siswa, guru, dan artikel per bulan.</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={monthlyData}
                margin={{ top: 15, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} /> {/* Lighter grid lines */}
                <XAxis dataKey="name" stroke="#6b7280" className="text-xs" />
                <YAxis stroke="#6b7280" className="text-xs" />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.03)' }} // Lighter tooltip cursor
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0px 4px 15px rgba(0,0,0,0.08)' }}
                  labelStyle={{ color: '#334155', fontWeight: 'bold', fontSize: '14px' }}
                  itemStyle={{ color: '#475569', fontSize: '13px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '13px' }} />
                <Bar dataKey="students" fill="#6366F1" name="Jumlah Siswa" barSize={25} radius={[6, 6, 0, 0]} /> {/* Wider bars, softer radius */}
                <Bar dataKey="teachers" fill="#0EA5E9" name="Jumlah Guru" barSize={25} radius={[6, 6, 0, 0]} />
                <Bar dataKey="articles" fill="#10B981" name="Jumlah Artikel" barSize={25} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Distribusi Jurusan Chart (Pie Chart) */}
          <motion.div variants={cardItemVariants} className="bg-white rounded-xl shadow-lg p-6">
            {/* Judul dengan 'Frame' Premium */}
            <div className="bg-gradient-to-r from-orange-600 to-red-700 text-white p-3 rounded-lg mb-5 shadow-xl flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-wide">Distribusi Jurusan</h2>
              <BuildingOfficeIcon className="h-7 w-7 text-white opacity-80" />
            </div>
            <p className="text-gray-600 text-sm mb-3">Persebaran siswa di berbagai jurusan.</p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={majorsDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {majorsDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0px 4px 15px rgba(0,0,0,0.08)' }}
                  labelStyle={{ color: '#334155', fontWeight: 'bold', fontSize: '14px' }}
                  itemStyle={{ color: '#475569', fontSize: '13px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '13px' }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Laporan & Analisis Lainnya */}
          <motion.div variants={cardItemVariants} className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
            {/* Judul dengan 'Frame' Premium */}
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-3 rounded-lg mb-5 shadow-xl flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-wide">Laporan & Analisis Mendalam</h2>
              <MegaphoneIcon className="h-7 w-7 text-white opacity-80" />
            </div>
            <p className="text-gray-600 text-sm">
              Bagian ini dapat diperluas untuk menyajikan lebih banyak metrik, tabel, atau laporan detail.
              Misalnya, tingkat kehadiran guru, popularitas ekstrakurikuler, atau kinerja siswa secara spesifik.
            </p>
            <div className="mt-5 p-5 bg-gray-50 rounded-xl border border-gray-200 text-gray-500 italic flex items-center justify-center h-36">
              <p className="text-center text-md font-medium">Area untuk laporan dan analisis mendalam di masa mendatang.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default DashboardOverviewPage;