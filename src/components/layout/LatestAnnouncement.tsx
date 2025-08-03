// components/Beranda/LatestAnnouncement.tsx
"use client";

import React, { useState, useEffect, FC } from 'react';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';

// Definisikan tipe untuk pengumuman
interface Announcement {
  id: string;
  title: string;
  content: string; // Konten penuh, mungkin akan dipotong
  date: string; // Tanggal pengumuman
  slug?: string; // Slug untuk link detail (opsional, jika ada)
  // Tambahkan properti lain yang mungkin ada di objek pengumuman Anda
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      type: "spring",
      stiffness: 80,
      damping: 15,
      delay: 0.2 // Sedikit delay setelah bagian di atasnya muncul
    },
  },
};

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

const LatestAnnouncement: FC = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLatestAnnouncement(): Promise<void> {
      try {
        // Sesuaikan endpoint API Anda. Misalnya, API Anda mungkin punya endpoint
        // '/api/announcements?limit=1&sortBy=date&order=desc' untuk mengambil yang terbaru.
        // Jika tidak, Anda perlu memfilter array setelah mengambil semua pengumuman.
        const response = await fetch('/api/announcements'); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Announcement[] = await response.json();
        if (data && data.length > 0) {
          setAnnouncement(data[0]); 
        } else {
          setAnnouncement(null); // Tidak ada pengumuman
        }
      } catch (e: unknown) {
        console.error("Failed to fetch latest announcement:", e);
        if (e instanceof Error) {
          setError(`Gagal memuat pengumuman terbaru. Detail: ${e.message}`);
        } else {
          setError("Gagal memuat pengumuman terbaru. Silakan coba lagi nanti.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchLatestAnnouncement();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (e) {
      console.error("Failed to format date:", dateString, e);
      return dateString; // Kembali ke string asli jika gagal
    }
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-md p-8 text-center border border-blue-200 animate-pulse">
          <div className="h-6 bg-blue-200 rounded w-1/3 mb-4 mx-auto"></div>
          <div className="h-4 bg-blue-200 rounded w-2/3 mx-auto"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
        <div className="bg-red-50 rounded-2xl shadow-md p-8 text-center border border-red-200 text-red-700">
          <p className="text-lg font-semibold mb-2">Gagal memuat pengumuman.</p>
          <p className="text-sm">{error}</p>
        </div>
      </section>
    );
  }

  if (!announcement) {
    return (
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={containerVariants}
          className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-md p-8 text-center border border-gray-200"
        >
          <p className="text-lg text-gray-700 font-semibold">Belum ada pengumuman terbaru saat ini.</p>
        </motion.div>
      </section>
    );
  }

  // Fungsi untuk memotong teks konten agar tidak terlalu panjang di beranda
  const truncateContent = (content: string, wordLimit: number) => {
    const words = content.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return content;
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={containerVariants}
        className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-8 md:p-10 text-center border border-blue-200 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-8 -left-8 w-28 h-28 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute -bottom-8 -right-8 w-36 h-36 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        </div>

        <motion.h3
          initial="hidden"
          whileInView="visible"
          variants={textVariants}
          className="relative z-10 text-xl sm:text-2xl font-extrabold text-blue-800 mb-3 leading-tight drop-shadow-sm"
        >
          Pengumuman Terbaru
        </motion.h3>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={textVariants}
          transition={{ delay: 0.3 }}
          className="relative z-10 p-4 md:p-6 bg-white/70 backdrop-blur-sm rounded-lg border border-blue-100 shadow-inner"
        >
          <p className="text-lg font-semibold text-gray-900 mb-2">{announcement.title}</p>
          <p className="text-sm text-gray-600 mb-3">{formatDate(announcement.date)}</p>
          <p className="text-base text-gray-700 leading-relaxed mb-4">
            {truncateContent(announcement.content, 30)} {/* Potong konten menjadi 30 kata */}
          </p>
          {/* Menggunakan slug jika ada, fallback ke id */}
          <Link href={`/pengumuman/${announcement.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">
            Baca Selengkapnya &rarr;
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default LatestAnnouncement;