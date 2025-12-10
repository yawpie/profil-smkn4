// 'use client';
import { useState, useEffect, FC } from "react";
import Head from "next/head";
import { motion, type Variants } from "framer-motion";
import EkstrakurikulerCard from "../../components/Card/EkstrakurikulerCard";
import MainLayout from "../../components/layout/MainLayout";
import type {
  Extracurricular,
  ExtracurricularApi,
  ExtracurricularsApiEnvelope,
} from "@/types/Extracurricular";
import { apiGet, type ApiError } from "@/utils/apiClient";

const EkstrakurikulerPage: FC = () => {
  const [extracurriculars, setExtracurriculars] = useState<Extracurricular[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExtracurriculars(): Promise<void> {
      try {
        setError(null);
        const res = await apiGet<ExtracurricularsApiEnvelope>(
          "/extracurriculars/"
        );
        const rawItems: ExtracurricularApi[] = res.data ?? [];

        const mapped: Extracurricular[] = rawItems.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description || "No description available.",
          image: item.image_url || "/images/placeholder-extracurricular.png",
          coach: item.guru?.name || "Not assigned",
          // schedule is not provided by the API; using placeholder
          schedule: "Schedule not available",
        }));

        setExtracurriculars(mapped);
      } catch (e: unknown) {
        console.error("Failed to fetch extracurriculars:", e);
        if ((e as ApiError)?.message) {
          setError(
            `Gagal memuat ekstrakurikuler. Detail: ${(e as ApiError).message}`
          );
        } else if (e instanceof Error) {
          setError(`Gagal memuat ekstrakurikuler. Detail: ${e.message}`);
        } else {
          setError("Gagal memuat ekstrakurikuler. Silakan coba lagi nanti.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchExtracurriculars();
  }, []);

  // Framer Motion variants
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  if (loading) {
    return (
      <MainLayout>
        <section className="min-h-screen bg-slate-50 flex flex-col justify-center items-center relative overflow-hidden">
          {/* Gen Z Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 transform rotate-12"></div>
            <div className="absolute top-20 right-20 w-24 h-24 bg-gradient-to-br from-pink-500 to-red-500 transform -rotate-12"></div>
            <div className="absolute bottom-10 left-1/4 w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 transform rotate-45"></div>
          </div>

          <div className="relative z-10 text-center">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 animate-spin mx-auto mb-6"></div>
            <motion.h1
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-semibold text-slate-900 mb-3"
            >
              Extracurricular Activities
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-slate-600 font-medium"
            >
              Loading inspiring extracurricular activities...
            </motion.p>
          </div>
        </section>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <section className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
          <div className="max-w-md mx-auto text-center bg-white border border-red-200 p-8">
            <div className="w-16 h-16 bg-red-100 mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-semibold text-red-900 mb-3"
            >
              System Error
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-red-700 mb-6"
            >
              Failed to load extracurricular activities. Please try again later.
              ({error})
            </motion.p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </section>
      </MainLayout>
    );
  }

  if (extracurriculars.length === 0) {
    return (
      <MainLayout>
        <section className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
          <div className="text-center bg-white border border-slate-200 p-12">
            <div className="w-16 h-16 bg-slate-100 mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m0 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-semibold text-slate-900 mb-3"
            >
              Extracurricular Activities
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-600"
            >
              No extracurricular activities are currently available.
            </motion.p>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head>
        <title>Extracurricular Activities - Educational Institution</title>
        <meta
          name="description"
          content="Comprehensive listing of extracurricular activities and programs available for student development and engagement."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        {/* Gen Z Background Pattern - All square shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-600 transform rotate-12"></div>
          <div className="absolute top-32 right-16 w-32 h-32 bg-gradient-to-br from-pink-500 to-red-500 transform -rotate-12"></div>
          <div className="absolute bottom-16 left-1/3 w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 transform rotate-45"></div>
          <div className="absolute bottom-32 right-1/4 w-28 h-28 bg-gradient-to-br from-yellow-500 to-orange-500 transform -rotate-45"></div>

          {/* Additional geometric elements */}
          <div className="absolute top-1/4 left-1/2 w-2 h-16 bg-white opacity-20 transform rotate-12"></div>
          <div className="absolute top-1/3 right-1/3 w-16 h-2 bg-white opacity-20 transform -rotate-12"></div>
          <div className="absolute bottom-1/3 left-1/4 w-2 h-12 bg-white opacity-20 transform rotate-45"></div>
          <div className="absolute top-2/3 right-1/2 w-12 h-2 bg-white opacity-20 transform -rotate-45"></div>
        </div>

        <div className="relative container mx-auto px-6 sm:px-8 lg:px-12 py-24">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="max-w-5xl mx-auto text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-1 h-16 bg-gradient-to-b from-blue-500 to-purple-600"></div>
                <div className="text-center">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                    Extracurricular{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      Activities
                    </span>
                  </h1>
                </div>
                <div className="w-1 h-16 bg-gradient-to-b from-purple-600 to-pink-500"></div>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed"
            >
              Discover diverse opportunities that enhance student development,
              foster creativity, and build essential life skills beyond the
              traditional classroom experience.
            </motion.p>

            {/* Stats section - Gen Z touch with square dividers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              <div className="text-center border-l border-slate-700 pl-6 first:border-l-0 first:pl-0 relative">
                <div className="absolute -left-1 top-0 w-2 h-2 bg-blue-500 opacity-60"></div>
                <div className="text-2xl font-bold text-white">
                  {extracurriculars.length}
                </div>
                <div className="text-sm text-slate-400 uppercase tracking-wide">
                  Activities
                </div>
              </div>
              <div className="text-center border-l border-slate-700 pl-6 relative">
                <div className="absolute -left-1 top-0 w-2 h-2 bg-purple-500 opacity-60"></div>
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm text-slate-400 uppercase tracking-wide">
                  Participants
                </div>
              </div>
              <div className="text-center border-l border-slate-700 pl-6 relative">
                <div className="absolute -left-1 top-0 w-2 h-2 bg-pink-500 opacity-60"></div>
                <div className="text-2xl font-bold text-white">12</div>
                <div className="text-sm text-slate-400 uppercase tracking-wide">
                  Categories
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom border with gradient - square pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          <div className="absolute top-0 left-0 w-2 h-2 bg-blue-600 opacity-80"></div>
          <div className="absolute top-0 right-0 w-2 h-2 bg-pink-600 opacity-80"></div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <div className="flex justify-center mb-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-blue-500"></div>
                <div className="w-3 h-3 bg-purple-500"></div>
                <div className="w-3 h-3 bg-pink-500"></div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Program Directory
            </h2>
            <p className="text-slate-600 text-lg">
              Comprehensive overview of all available extracurricular programs
              and activities.
            </p>
          </motion.div>

          {/* Activities Grid */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {extracurriculars.map((item, index) => (
                <motion.div
                  key={item.id ?? `activity-${index}`}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.05 }}
                  className="h-full"
                >
                  <EkstrakurikulerCard
                    id={item.id}
                    name={item.name}
                    description={item.description}
                    image={item.image}
                    coach={item.coach}
                    schedule={item.schedule}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section - Gen Z Touch with square elements */}
      {/* <section className="bg-slate-900 text-white py-16 relative overflow-hidden"> */}
        {/* Background pattern - all square shapes */}
        {/* <div className="absolute inset-0 opacity-5">
          <div className="absolute top-8 left-8 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 transform rotate-12"></div>
          <div className="absolute bottom-8 right-8 w-20 h-20 bg-gradient-to-br from-pink-500 to-orange-500 transform -rotate-12"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 transform rotate-45"></div>
          <div className="absolute bottom-1/3 right-1/3 w-14 h-14 bg-gradient-to-br from-yellow-500 to-red-500 transform -rotate-45"></div>
        </div> */}

        {/* <div className="relative container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={sectionVariants}
            >
              <div className="flex justify-center mb-6">
                <div className="flex space-x-2">
                  <div className="w-4 h-4 bg-blue-500"></div>
                  <div className="w-4 h-4 bg-purple-500"></div>
                  <div className="w-4 h-4 bg-pink-500"></div>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Ready to Get Involved?
              </h2>
              <p className="text-slate-300 mb-8 text-lg">
                Join our vibrant community of students exploring their passions
                and developing new skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 border border-transparent">
                  View Application Process
                </button>
                <button className="px-8 py-4 border border-white text-white hover:bg-white hover:text-slate-900 font-medium transition-all duration-200">
                  Contact Coordinator
                </button>
              </div>
            </motion.div>
          </div>
        </div> */}
      {/* </section> */}
    </MainLayout>
  );
};

export default EkstrakurikulerPage;
