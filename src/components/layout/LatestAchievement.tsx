"use client";

import React, { useState, useEffect, FC } from 'react';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { Achievement } from '@/types/Achievement';

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

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

const LatestAchievement: FC = () => {
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string): string => {
    if (!dateString) {
      return '';
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date string');
      }
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('id-ID', options);
    } catch (e) {
      console.error("Gagal memformat tanggal:", dateString, e);
      return dateString;
    }
  };

  useEffect(() => {
    async function fetchLatestAchievement(): Promise<void> {
      try {
        const response = await fetch('/api/achievements');
        if (!response.ok) {
          throw new Error(`Kesalahan HTTP! status: ${response.status}`);
        }
        const data: Achievement[] = await response.json();
        
        if (data && data.length > 0) {
          const latest = data.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())[0];
          setAchievement(latest); 
        } else {
          setAchievement(null);
        }
      } catch (e: unknown) {
        console.error("Gagal mengambil prestasi terbaru:", e);
        if (e instanceof Error) {
          setError(`Gagal memuat prestasi terbaru. Detail: ${e.message}`);
        } else {
          setError("Gagal memuat prestasi terbaru. Silakan coba lagi nanti.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchLatestAchievement();
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border border-gray-200 shadow-sm p-6 animate-pulse">
          <div className="h-5 bg-gray-200 w-1/4 mb-3"></div>
          <div className="h-4 bg-gray-200 w-3/4"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-red-50 border border-red-200 p-6 text-red-800">
          <p className="font-semibold mb-1">Gagal memuat prestasi.</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (!achievement) {
    return (
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={containerVariants}
          className="bg-gray-50 border border-gray-200 p-6 text-center"
        >
          <p className="text-gray-600 font-medium">Belum ada prestasi terbaru saat ini.</p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={containerVariants}
        className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-4">
          <motion.h3
            initial="hidden"
            whileInView="visible"
            variants={textVariants}
            className="text-lg font-semibold text-gray-900 flex items-center gap-2"
          >
            <div className="w-1 h-6 bg-blue-600"></div>
            Prestasi Terbaru
          </motion.h3>
        </div>

        {/* Content */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={textVariants}
          transition={{ delay: 0.2 }}
          className="p-6"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Image */}
            {achievement.image && (
              <div className="lg:w-1/3">
                <div className="relative w-full h-48 lg:h-32 bg-gray-100 overflow-hidden">
                  <Image
                    src={achievement.image}
                    alt={achievement.title}
                    layout="fill"
                    objectFit="cover"
                    unoptimized
                    className="transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
            )}

            {/* Text Content */}
            <div className="lg:w-2/3">
              <div className="mb-3">
                <h4 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {achievement.title}
                </h4>
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(achievement.publishDate)}
                </div>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                {achievement.description}
              </p>
              
              <Link 
                href={`/prestasi/${achievement.id}`} 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
              >
                <span>Baca Selengkapnya</span>
                <svg className="w-4 h-4 ml-1 transition-transform duration-200 hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default LatestAchievement;