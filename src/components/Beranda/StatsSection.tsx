"use client";

import React from "react";
import {
  motion,
  Variants,
} from "framer-motion";

const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const StatItem = ({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: "easeOut", delay },
        },
      }}
      className="text-center"
    >
      <div className="text-3xl font-bold text-blue-600">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </motion.div>
  );
};

const StatsSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={textVariants}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="text-2xl font-extrabold text-center text-gray-800 sm:text-3xl"
        >
          Statistik SMKN 4 Mataram
        </motion.h2>

        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
          <StatItem label="Siswa Aktif" value="1.200" delay={0.2} />
          <StatItem label="Guru & Staff" value="85" delay={0.3} />
          <StatItem label="Jurusan" value="6" delay={0.4} />
          <StatItem label="Alumni" value="7.500+" delay={0.5} />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
