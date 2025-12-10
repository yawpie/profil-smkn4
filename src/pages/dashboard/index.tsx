"use client";

import React, { useState, useEffect } from "react";
import Layout from "../../components/Dashboard/Layout";
import { motion, useInView, useAnimation, Variants } from "framer-motion";
import {
  UsersIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  MegaphoneIcon,
  GlobeAltIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

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
} from "recharts";

import type {
  TotalsData,
  MonthlyDataItem,
  MajorDistributionItem,
  DataCardProps,
  AnimatedCounterProps,
} from "@/types/index";
import { apiGet } from "@/utils/apiClient";
import {
  DashboardTotals,
  DashboardTotalsResponse,
} from "@/types/DashboardTotals";

// --- Komponen Animated Counter ---
const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  from,
  to,
  duration = 1.5,
  suffix = "",
  prefix = "",
}) => {
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
          ease: "easeOut",
        },
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
    <motion.span ref={ref} initial={{ opacity: 0 }} animate={controls}>
      {prefix}
      {count.toLocaleString("id-ID")}
      {suffix}
    </motion.span>
  );
};

// --- Komponen DataCard ---
const DataCard: React.FC<DataCardProps & { variants: Variants }> = ({
  title,
  value,
  icon: Icon,
  gradient,
  iconBg,
  shadowColor,
  variants,
}) => (
  <motion.div
    variants={variants}
    className={`relative bg-gradient-to-br ${gradient} p-6 shadow-2xl flex items-center space-x-4
                 transform hover:scale-[1.02] transition-all duration-300 ease-out
                 overflow-hidden group ${shadowColor} border-l-4 border-white/40
                 backdrop-blur-sm hover:shadow-3xl`}
  >
    {/* Glassmorphism overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

    {/* Geometric accent */}
    <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 transform rotate-45 translate-x-10 -translate-y-10"></div>

    <div
      className={`p-4 ${iconBg} bg-opacity-80 backdrop-blur-sm relative z-10 flex-shrink-0
                     shadow-lg border border-white/20`}
    >
      {Icon && <Icon className="h-7 w-7 text-white drop-shadow-sm" />}
    </div>
    <div className="relative z-10 flex-1">
      <h3 className="text-sm font-bold text-white/90 uppercase tracking-wider mb-1">
        {title}
      </h3>
      <p className="text-3xl font-black text-white drop-shadow-lg">
        <AnimatedCounter from={0} to={value} />
      </p>
    </div>

    {/* Modern accent line */}
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/30 to-transparent"></div>
  </motion.div>
);

const DashboardOverviewPage: React.FC = () => {
  const [totals, setTotals] = useState<DashboardTotals>({
    achievements: 0,
    teachers: 0,
    articles: 0,
    majors: 0,
    extracurriculars: 0,
    facilities: 0,
    announcements: 0,
  });
  const [loadingTotals, setLoadingTotals] = useState<boolean>(true);
  const [errorTotals, setErrorTotals] = useState<string | null>(null);

  const monthlyData: MonthlyDataItem[] = [
    { name: "Jan", articles: 5 },
    { name: "Feb", articles: 7 },
    { name: "Mar", articles: 6 },
    { name: "Apr", articles: 8 },
    { name: "Mei", articles: 9 },
    { name: "Jun", articles: 10 },
  ];
  

  const majorsDistribution: MajorDistributionItem[] = [
    { name: "Rekayasa Perangkat Lunak", value: 350 },
    { name: "Teknik Komputer & Jaringan", value: 280 },
    { name: "Desain Komunikasi Visual", value: 180 },
    { name: "Akuntansi & Keuangan", value: 120 },
    { name: "Kuliner", value: 80 },
    { name: "Teknik Kendaraan Ringan", value: 140 },
  ];

  const PIE_COLORS: string[] = [
    "#6366F1",
    "#0EA5E9",
    "#EC4899",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#A855F7",
    "#22C55E",
  ];

  useEffect(() => {
    async function fetchDashboardTotals() {
      setLoadingTotals(true);
      setErrorTotals(null);
      try {
        const response = await apiGet<DashboardTotalsResponse>("/stats");
        // const data: DashboardTotals = response.data;
        const data: DashboardTotals = JSON.parse(localStorage.getItem("statsTotals") || "{}");
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

  const dataCards: DataCardProps[] = [
    {
      title: "Total Prestasi",
      value: totals.achievements,
      icon: UsersIcon,
      gradient: "from-slate-800 via-blue-900 to-slate-900",
      iconBg: "bg-blue-600",
      shadowColor: "shadow-blue-900/50",
    },
    {
      title: "Total Guru",
      value: totals.teachers,
      icon: AcademicCapIcon,
      gradient: "from-slate-800 via-purple-900 to-slate-900",
      iconBg: "bg-purple-600",
      shadowColor: "shadow-purple-900/50",
    },
    {
      title: "Total Jurusan",
      value: totals.majors,
      icon: BuildingOfficeIcon,
      gradient: "from-slate-800 via-teal-900 to-slate-900",
      iconBg: "bg-teal-600",
      shadowColor: "shadow-teal-900/50",
    },
    {
      title: "Total Artikel",
      value: totals.articles,
      icon: DocumentTextIcon,
      gradient: "from-slate-800 via-orange-900 to-slate-900",
      iconBg: "bg-orange-600",
      shadowColor: "shadow-orange-900/50",
    },
    {
      title: "Total Ekstrakurikuler",
      value: totals.extracurriculars,
      icon: GlobeAltIcon,
      gradient: "from-slate-800 via-emerald-900 to-slate-900",
      iconBg: "bg-emerald-600",
      shadowColor: "shadow-emerald-900/50",
    },
    {
      title: "Total Fasilitas",
      value: totals.facilities,
      icon: BuildingOfficeIcon,
      gradient: "from-slate-800 via-rose-900 to-slate-900",
      iconBg: "bg-rose-600",
      shadowColor: "shadow-rose-900/50",
    },
    {
      title: "Total Pengumuman",
      value: totals.announcements,
      icon: MegaphoneIcon,
      gradient: "from-slate-800 via-cyan-900 to-slate-900",
      iconBg: "bg-cyan-600",
      shadowColor: "shadow-cyan-900/50",
    },
  ];

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const cardItemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
      },
    },
  };

  return (
    <Layout setNotification={() => {}}>
      {/* Header Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-2xl p-8 mb-8 text-white relative overflow-hidden border-b-4 border-purple-500"
      >
        {/* Geometric background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white transform rotate-45 -translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white transform rotate-12 translate-x-30 translate-y-30"></div>
        </div>

        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm"></div>

        <div className="relative z-10">
          <motion.div
            variants={cardItemVariants}
            className="flex items-center space-x-4 mb-6"
          >
            <div className="w-2 h-16 bg-gradient-to-b from-purple-400 to-pink-400"></div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
                DASHBOARD ADMIN
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-400"></div>
            </div>
          </motion.div>

          <motion.p
            variants={cardItemVariants}
            className="text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed font-medium"
          >
            Selamat datang kembali! Dapatkan ringkasan cepat dan visualisasi
            data penting sekolah Anda di sini.
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Total Data Cards Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="bg-white shadow-2xl p-8 border-t-4 border-blue-600"
        >
          <motion.div
            variants={cardItemVariants}
            className="bg-gradient-to-r from-slate-900 to-blue-900 text-white p-6 mb-8 shadow-xl flex items-center justify-between border-l-4 border-blue-400"
          >
            <div className="flex items-center space-x-4">
              <div className="w-3 h-12 bg-gradient-to-b from-blue-400 to-cyan-400"></div>
              <h2 className="text-2xl font-black tracking-wide uppercase">
                Ringkasan Data Sekolah
              </h2>
            </div>
            <AcademicCapIcon className="h-8 w-8 text-blue-300" />
          </motion.div>

          {loadingTotals ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(dataCards.length)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-slate-200 to-slate-300 p-6 shadow-xl animate-pulse h-36 flex items-center space-x-4"
                >
                  <div className="h-12 w-12 bg-slate-400"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-400 w-3/4"></div>
                    <div className="h-8 bg-slate-400 w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : errorTotals ? (
            <div className="text-center py-12 bg-red-50 shadow-xl border-l-4 border-red-500">
              <ExclamationCircleIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <p className="text-xl text-red-800 font-bold mb-4">
                {errorTotals}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-red-600 text-white hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-bold uppercase tracking-wide"
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
          className="grid grid-cols-1 lg:grid-cols gap-8"
        >
          {/* Bar Chart */}
          <motion.div
            variants={cardItemVariants}
            className="bg-white shadow-2xl p-8 border-t-4 border-green-600"
          >
            <div className="bg-gradient-to-r from-slate-900 to-green-900 text-white p-6 mb-6 shadow-xl flex items-center justify-between border-l-4 border-green-400">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-12 bg-gradient-to-b from-green-400 to-teal-400"></div>
                <h2 className="text-xl font-black tracking-wide uppercase">
                  Aktivitas Bulanan
                </h2>
              </div>
              <DocumentTextIcon className="h-8 w-8 text-green-300" />
            </div>
            <p className="text-slate-600 font-medium mb-6 text-lg">
              Tren jumlah siswa, guru, dan artikel per bulan.
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="name" stroke="#475569" className="font-bold" />
                <YAxis stroke="#475569" className="font-bold" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    color: "#ffffff",
                    fontWeight: "bold",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "20px", fontWeight: "bold" }}
                />
                <Bar
                  dataKey="students"
                  fill="#6366F1"
                  name="Jumlah Siswa"
                  barSize={30}
                />
                <Bar
                  dataKey="teachers"
                  fill="#0EA5E9"
                  name="Jumlah Guru"
                  barSize={30}
                />
                <Bar
                  dataKey="articles"
                  fill="#10B981"
                  name="Jumlah Artikel"
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart */}
          {/* <motion.div variants={cardItemVariants} className="bg-white shadow-2xl p-8 border-t-4 border-orange-600">
            <div className="bg-gradient-to-r from-slate-900 to-orange-900 text-white p-6 mb-6 shadow-xl flex items-center justify-between border-l-4 border-orange-400">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-12 bg-gradient-to-b from-orange-400 to-red-400"></div>
                <h2 className="text-xl font-black tracking-wide uppercase">Distribusi Jurusan</h2>
              </div>
              <BuildingOfficeIcon className="h-8 w-8 text-orange-300" />
            </div>
            <p className="text-slate-600 font-medium mb-6 text-lg">Persebaran siswa di berbagai jurusan.</p>
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
                  label={({ name, percent }: { name?: string; percent?: number }) => 
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                >
                  {majorsDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    color: '#ffffff',
                    fontWeight: 'bold',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div> */}

          {/* Analysis Section */}
          <motion.div
            variants={cardItemVariants}
            className="bg-white shadow-2xl p-8 lg:col-span-2 border-t-4 border-slate-600"
          >
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 mb-6 shadow-xl flex items-center justify-between border-l-4 border-slate-400">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-12 bg-gradient-to-b from-slate-400 to-gray-600"></div>
                <h2 className="text-xl font-black tracking-wide uppercase">
                  Laporan & Analisis Mendalam
                </h2>
              </div>
              <MegaphoneIcon className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-slate-600 font-medium text-lg mb-8">
              Bagian ini dapat diperluas untuk menyajikan lebih banyak metrik,
              tabel, atau laporan detail. Misalnya, tingkat kehadiran guru,
              popularitas ekstrakurikuler, atau kinerja siswa secara spesifik.
            </p>
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-8 border-l-4 border-slate-400 text-slate-600 flex items-center justify-center h-40">
              <div className="text-center">
                <div className="w-16 h-1 bg-slate-400 mx-auto mb-4"></div>
                <p className="text-xl font-bold uppercase tracking-wide">
                  Area untuk laporan dan analisis mendalam di masa mendatang
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default DashboardOverviewPage;
