import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Major, MajorApi, MajorsApiEnvelope } from "@/types/Major";
import MainLayout from "../../components/layout/MainLayout";
import Head from "next/head";
import { apiGet, type ApiError } from "@/utils/apiClient";

const DetailJurusanPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [major, setMajor] = useState<Major | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMajorDetails = async () => {
      if (id) {
        setLoading(true);
        setError(null);
        try {
          const response = await apiGet<MajorApi>(
            `/majors?id=${id}`
          );
          const apiMajor = response;
          if (apiMajor) {
            const mapped: Major = {
              id: apiMajor.id,
              name: apiMajor.name,
              description: apiMajor.description,
              image:
                apiMajor.image_url ||
                "https://placehold.co/600x400/6B7280/FFFFFF?text=Major",
            };
            setMajor(mapped);
          } else {
            setError("Data jurusan tidak ditemukan.");
          }
        } catch (err: unknown) {
          console.error("Error fetching major details:", err);
          if ((err as ApiError)?.message) {
            setError(
              `Terjadi kesalahan saat memuat data: ${(err as ApiError).message}`
            );
          } else if (err instanceof Error) {
            setError(`Terjadi kesalahan saat memuat data: ${err.message}`);
          } else {
            setError("Terjadi kesalahan saat memuat data.");
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMajorDetails();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 text-gray-700">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent animate-spin mx-auto"></div>
            <p className="text-xl font-medium">Loading data jurusan...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 text-gray-700 p-4 text-center">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6 max-w-md">
            <p className="text-lg text-red-700 font-medium">{error}</p>
          </div>
          <Link
            href="/jurusan"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            ← Back to Jurusan List
          </Link>
        </div>
      </MainLayout>
    );
  }

  if (!major) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 text-gray-700 space-y-6">
          <p className="text-xl font-medium">Data tidak tersedia.</p>
          <Link
            href="/jurusan"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            ← Back to Jurusan List
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Head>
        <title>{major.name} - Jurusan SMKN 4 Mataram</title>
        <meta
          name="description"
          content={`Detail jurusan ${major.name} di SMKN 4 Mataram, termasuk deskripsi, prospek karir, dan kurikulum.`}
        />
        <meta property="og:title" content={major.name} />
        <meta
          property="og:description"
          content={`Detail jurusan ${major.name} di SMKN 4 Mataram.`}
        />
        {major.image && <meta property="og:image" content={major.image} />}
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`${
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
          }/jurusan/${major.id}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        {major.image && <meta name="twitter:image" content={major.image} />}
      </Head>

      {/* Main Section with Modern Gradient */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 text-gray-800 font-sans min-h-[calc(100vh-120px)] pt-20 pb-16 md:pt-24 md:pb-20">
        <motion.div
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Modern Breadcrumb */}
          <motion.div
            className="mb-8 flex items-center space-x-2 text-sm text-gray-600 font-medium"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <Link
              href="/"
              className="hover:text-blue-600 transition-colors duration-200 flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="/jurusan"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              Jurusan
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-blue-700 font-semibold">{major.name}</span>
          </motion.div>

          {/* Hero Section with Sharp Edges */}
          <motion.div
            className="relative w-full h-80 sm:h-96 lg:h-[28rem] overflow-hidden shadow-2xl border-l-8 border-blue-600 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          >
            {/* Background Image with Modern Overlay */}
            {major.image && (
              <Image
                src={major.image}
                alt={major.name}
                fill
                style={{ objectFit: "cover" }}
                className="absolute inset-0 opacity-40 filter brightness-75 contrast-125"
                priority
              />
            )}

            {/* Modern Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-blue-900/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 lg:p-16">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="inline-block px-4 py-2 bg-blue-600/90 backdrop-blur-sm text-white text-sm font-semibold uppercase tracking-wider">
                  Program Keahlian
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                  {major.name}
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-600/10 to-transparent"></div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="mt-16 grid lg:grid-cols-3 gap-8">
            {/* Description Section */}
            <motion.div
              className="lg:col-span-2 space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
            >
              <div className="bg-white border-l-4 border-blue-600 shadow-xl p-8 lg:p-10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                    Deskripsi Program
                  </h2>
                </div>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  {typeof major.description === "string" ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: major.description.replace(/\n/g, "<br/><br/>"),
                      }}
                    />
                  ) : (
                    <p className="italic text-gray-500 text-center py-8">
                      Deskripsi belum tersedia.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
            >
              {/* Quick Facts */}
              {/* {major.fastFacts && Array.isArray(major.fastFacts) && major.fastFacts.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-t-4 border-blue-600 shadow-lg p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Quick Facts</h3>
                  </div>
                  <ul className="space-y-3">
                    {major.fastFacts.map((fact: string, idx: number) => (
                      <motion.li
                        key={idx}
                        className="flex items-start space-x-3 text-gray-700"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + idx * 0.05, duration: 0.5 }}
                      >
                        <div className="w-2 h-2 bg-blue-600 mt-2 flex-shrink-0"></div>
                        <span className="text-sm font-medium">{fact}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )} */}

              {/* Career Prospects */}
              {/* {major.careerProspects && Array.isArray(major.careerProspects) && major.careerProspects.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-t-4 border-green-600 shadow-lg p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zM8 5a1 1 0 011-1h2a1 1 0 011 1v1H8V5zM8 11a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Career Path</h3>
                  </div>
                  <ul className="space-y-3">
                    {major.careerProspects.map((prospect: string, idx: number) => (
                      <motion.li
                        key={idx}
                        className="flex items-start space-x-3 text-gray-700"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 + idx * 0.05, duration: 0.5 }}
                      >
                        <div className="w-2 h-2 bg-green-600 mt-2 flex-shrink-0"></div>
                        <span className="text-sm font-medium">{prospect}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )} */}
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-4">
              <Link
                href="/jurusan"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <svg
                  className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Back to All Programs
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default DetailJurusanPage;
