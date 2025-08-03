import React from "react";
import {
  motion,
  Variants,
} from "framer-motion";

// Varian untuk animasi teks judul
const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 }, // Jarak disesuaikan lagi
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7, // Durasi tetap halus
      ease: "easeOut",
    },
  },
};

// Varian untuk animasi kotak stat
const statCardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 }, // Animasi pop-up sedikit lebih pendek
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6, // Durasi animasi card sedikit lebih cepat
      ease: "easeOut",
      delay: i * 0.12 + 0.2, // Penundaan berdasarkan indeks, ditambah penundaan awal
      type: "spring",
      stiffness: 110, // Sedikit kurang 'bouncy'
      damping: 14,
    },
  }),
};

const StatItem = ({
  label,
  value,
  index,
}: {
  label: string;
  value: string;
  index: number;
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={statCardVariants}
      custom={index}
      className="text-center p-5 rounded-xl shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 transform hover:scale-[1.03] transition-transform duration-300 ease-in-out cursor-pointer group relative overflow-hidden" // Padding dan shadow disesuaikan
    >
      {/* Efek gradasi overlay pada hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-1.5 drop-shadow-sm"> {/* Ukuran font angka diperkecil */}
          {value}
        </div>
        <div className="text-sm md:text-base text-gray-700 font-medium"> {/* Ukuran font label diperkecil */}
          {label}
        </div>
      </div>
    </motion.div>
  );
};

const StatsSection = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-purple-50 font-sans"> {/* Padding disesuaikan */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Max width lebih kecil */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={textVariants}
          className="text-2xl font-extrabold text-center text-gray-800 sm:text-3xl md:text-4xl leading-tight mb-8 drop-shadow-sm" // Ukuran font judul diperkecil
        >
          Statistik <span className="text-blue-600">SMKN 4 Mataram</span>
        </motion.h2>

        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4"> {/* Gap dan margin-top disesuaikan */}
          <StatItem label="Siswa Aktif" value="1.200" index={0} />
          <StatItem label="Guru & Staff" value="85" index={1} />
          <StatItem label="Jurusan" value="6" index={2} />
          <StatItem label="Alumni" value="7.500+" index={3} />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;