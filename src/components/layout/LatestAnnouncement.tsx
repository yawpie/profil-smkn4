"use client";

import React, { useState, useEffect, FC } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import type {
  Announcement,
  AnnouncementApi,
  AnnouncementsApiEnvelope,
} from "@/types/Announcement";
import { apiGet, type ApiError } from "@/utils/apiClient";

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

const LatestAnnouncement: FC = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string): string => {
    if (!dateString) {
      return "";
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date string");
      }
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString("id-ID", options);
    } catch (e) {
      console.error("Gagal memformat tanggal:", dateString, e);
      return dateString;
    }
  };

  useEffect(() => {
    async function fetchLatestAnnouncement(): Promise<void> {
      try {
        const response = await apiGet<AnnouncementsApiEnvelope>(
          "/announcement"
        );

        const apiAnnouncements: AnnouncementApi[] = response.data;

        const mapped: Announcement[] = apiAnnouncements
          .filter((item) => item.status === "PUBLISHED")
          .map(
            (item): Announcement => ({
              id: item.id,
              title: item.title,
              content: item.content,
              publishDate: new Date(item.date).toISOString(),
              status: item.status === "PUBLISHED" ? "Published" : "Draft",
              image: item.image_url,
            })
          )
          .sort(
            (a, b) =>
              new Date(b.publishDate).getTime() -
              new Date(a.publishDate).getTime()
          );

        if (mapped.length > 0) {
          setAnnouncement(mapped[0]);
        } else {
          setAnnouncement(null);
        }
      } catch (e: unknown) {
        console.error("Gagal mengambil pengumuman terbaru:", e);
        if ((e as ApiError)?.message) {
          setError(
            `Gagal memuat pengumuman terbaru. Detail: ${
              (e as ApiError).message
            }`
          );
        } else if (e instanceof Error) {
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

  const truncateContent = (content: string, wordLimit: number) => {
    const words = content.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return content;
  };

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
          <p className="font-semibold mb-1">Gagal memuat pengumuman.</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (!announcement) {
    return (
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={containerVariants}
          className="bg-gray-50 border border-gray-200 p-6 text-center"
        >
          <p className="text-gray-600 font-medium">
            Belum ada pengumuman terbaru saat ini.
          </p>
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
        <div className="bg-orange-50 border-b border-orange-200 px-6 py-4">
          <motion.h3
            initial="hidden"
            whileInView="visible"
            variants={textVariants}
            className="text-lg font-semibold text-gray-900 flex items-center gap-2"
          >
            <div className="w-1 h-6 bg-orange-500"></div>
            Pengumuman Terbaru
            <span className="ml-auto bg-orange-500 text-white text-xs font-medium px-2 py-1">
              PENTING
            </span>
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
          {/* Announcement Title & Date */}
          <div className="bg-gray-50 border border-gray-200 p-4 mb-4">
            <h4 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
              {announcement.title}
            </h4>
            <div className="flex items-center text-sm text-gray-500">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formatDate(announcement.publishDate)}
            </div>
          </div>

          {/* Content Preview */}
          <div className="mb-6">
            <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
              {truncateContent(announcement.content, 25)}
            </p>
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <Link
              href={`/pengumuman/${announcement.id}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm border border-blue-200 hover:border-blue-300 px-4 py-2 transition-colors duration-200"
            >
              <span>Baca Selengkapnya</span>
              <svg
                className="w-4 h-4 ml-1 transition-transform duration-200 hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default LatestAnnouncement;
