import React from "react";
import { motion, type Variants } from "framer-motion";

// Varian untuk animasi teks judul
const textVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Varian untuk animasi kotak stat
const statCardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      delay: i * 0.08 + 0.1,
    },
  }),
};

// Komponen StatItem untuk menampilkan setiap statistik
const StatItem = ({
  label,
  value,
  index,
}: {
  label: string;
  value: string | number;
  index: number;
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={statCardVariants}
      custom={index}
      // ✨ Perubahan padding dan font di sini
      className="text-center p-3 sm:p-4 bg-white border-l-2 border-blue-600 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
    >
      {/* Modern grid pattern background */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.08'%3E%3Cpath d='M0 0h15v15H0V0zm15 15h15v15H15V15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Subtle gradient hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-50 opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>

      {/* Left accent border expansion */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-300 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"></div>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10">
        <div className="text-xl md:text-2xl font-bold text-slate-800 mb-1 tracking-tight">
          {value}
        </div>
        <div className="text-xxs sm:text-xs text-slate-600 font-medium uppercase tracking-wider">
          {label}
        </div>

        {/* Modern accent dot */}
        <div className="mt-2 flex justify-center">
          <div className="w-1 h-1 bg-blue-600 group-hover:bg-slate-800 transition-colors duration-300"></div>
        </div>
      </div>
    </motion.div>
  );
};

// Komponen utama StatsSection
const StatsSection = ({
  stats = {
    totalSiswa: "800",
    totalGuru: 0,
    totalStaff: 0,
    totalEkstrakurikuler: 0,
    totalJurusan: 0,
    totalFasilitas: 0,
  },
}: {
  stats: {
    totalSiswa: string | number;
    totalGuru: number;
    totalStaff: number;
    totalEkstrakurikuler: number;
    totalJurusan: number;
    totalFasilitas: number;
  };
}) => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-slate-50 to-gray-100 relative overflow-hidden">
      {/* Modern geometric background */}
      <div className="absolute inset-0 opacity-3">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='0.06'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Compact Header Section */}
        <div className="text-center mb-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={textVariants}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 bg-white px-4 py-2 border border-slate-200 mb-5 shadow-sm"
          >
            <div className="w-1.5 h-1.5 bg-blue-600"></div>
            <span className="uppercase tracking-widest">Data Institusi</span>
          </motion.div>

          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={textVariants}
            className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl leading-tight mb-3"
          >
            <span className="text-slate-800">PROFIL</span>
            <span className="block text-blue-700 font-semibold text-xl sm:text-2xl md:text-3xl">
              SMKN 4 MATARAM
            </span>
          </motion.h2>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={textVariants}
            className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            Institusi pendidikan kejuruan berkualitas dengan komitmen menghasilkan
            lulusan kompeten dan siap kerja
          </motion.p>
        </div>

        {/* Compact Stats Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
          <StatItem label="Siswa Aktif" value={stats.totalSiswa} index={0} />
          <StatItem label="Guru" value={stats.totalGuru} index={1} />
          <StatItem label="Staf" value={stats.totalStaff} index={2} />
          <StatItem
            label="Ekstrakurikuler"
            value={stats.totalEkstrakurikuler}
            index={3}
          />
          <StatItem label="Jurusan" value={stats.totalJurusan} index={4} />
          <StatItem label="Fasilitas" value={stats.totalFasilitas} index={5} />
        </div>

        {/* Compact Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center bg-white border border-slate-200 shadow-sm text-xs">
            <div className="flex items-center space-x-2 px-5 py-3 border-r border-slate-200">
              <div className="w-2 h-2 bg-blue-600"></div>
              <span className="font-semibold text-slate-700 uppercase tracking-wide">
                Terakreditasi A
              </span>
            </div>
            <div className="flex items-center space-x-2 px-5 py-3 border-r border-slate-200">
              <div className="w-2 h-2 bg-slate-500"></div>
              <span className="font-semibold text-slate-700 uppercase tracking-wide">
                ISO 9001:2015
              </span>
            </div>
            <div className="flex items-center space-x-2 px-5 py-3">
              <div className="w-2 h-2 bg-blue-800"></div>
              <span className="font-semibold text-slate-700 uppercase tracking-wide">
                SMK Rujukan
              </span>
            </div>
          </div>
        </motion.div>

        {/* Modern bottom accent */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 flex justify-center"
        >
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
        </motion.div>
      </div>

      {/* Subtle bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
    </section>
  );
};

export default StatsSection;