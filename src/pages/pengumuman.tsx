// pages/pengumuman/index.tsx
import { useState, useEffect, FC, useCallback } from 'react';
import Link from 'next/link';
import MainLayout from '../components/layout/MainLayout';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

// Impor tipe Announcement
import type { Announcement } from '@/types/Announcement'; // Sesuaikan path jika berbeda

const Pengumuman: FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Framer Motion Variants
  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      }
    },
  };

  const mainCardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      }
    },
  };

  // Function to fetch announcements from backend/API
  const fetchAnnouncementsFromBackend = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/announcements'); // Your actual API endpoint
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Announcement[] = await response.json();

      // Filter pengumuman dengan status 'Published' sebelum sorting dan displaying
      const publishedAnnouncements = data.filter(ann => ann.status === 'Published');

      // Sort by publishDate
      const sortedData = publishedAnnouncements.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

      setAnnouncements(sortedData);
    } catch (e: unknown) {
      console.error("Gagal mengambil pengumuman:", e);
      if (e instanceof Error) {
        setError(`Gagal memuat pengumuman. Detail: ${e.message}`);
      } else {
        setError("Gagal memuat pengumuman. Silakan coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncementsFromBackend();
  }, [fetchAnnouncementsFromBackend]);

  const mainAnnouncement = announcements.length > 0 ? announcements[0] : null;
  const otherAnnouncements = announcements.length > 1 ? announcements.slice(1) : [];

  const getAnnouncementLink = (announcement: Announcement) => {
    return `/pengumuman/${announcement.id}`;
  };

  const getTruncatedContent = (content: string, summary?: string) => {
    return summary || content.substring(0, 120) + '...';
  };

  return (
    <MainLayout>
      {/* Hero Section - Professional Design */}
      <section className="relative w-full py-20 md:py-24 lg:py-28 overflow-hidden bg-slate-900">
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-600 transform rotate-12"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-slate-600 transform -rotate-12"></div>
          <div className="absolute bottom-10 left-1/4 w-16 h-16 bg-blue-500 transform rotate-45"></div>
          <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-slate-500 transform -rotate-45"></div>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={headerVariants}
              className="mb-6"
            >
              <div className="flex justify-center mb-4">
                <div className="w-1 h-12 bg-blue-500 mr-4"></div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                  Pengumuman Resmi
                </h1>
                <div className="w-1 h-12 bg-blue-500 ml-4"></div>
              </div>
              <div className="w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
            </motion.div>
            
            <motion.p
              initial="hidden"
              animate="visible"
              variants={textVariants}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
            >
              Informasi terkini dan pengumuman resmi dari SMKN 4 Mataram
            </motion.p>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="bg-slate-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-center text-slate-800 mb-12">
              Memuat Pengumuman...
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white shadow-lg p-8 animate-pulse">
                <div className="h-4 bg-slate-200 w-1/4 mb-4"></div>
                <div className="h-8 bg-slate-200 w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-200 w-full mb-2"></div>
                <div className="h-4 bg-slate-200 w-11/12 mb-4"></div>
                <div className="h-4 bg-slate-200 w-1/3"></div>
              </div>
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white shadow-md p-6 animate-pulse">
                    <div className="h-3 bg-slate-200 w-1/4 mb-3"></div>
                    <div className="h-6 bg-slate-200 w-3/4 mb-3"></div>
                    <div className="h-4 bg-slate-200 w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Error State */}
      {!loading && error && (
        <section className="bg-slate-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-red-50 border-l-4 border-red-500 p-8">
              <motion.p
                initial="hidden"
                animate="visible"
                variants={textVariants}
                className="text-lg text-red-800 font-semibold mb-4"
              >
                {error}
              </motion.p>
              <button
                onClick={fetchAnnouncementsFromBackend}
                className="px-6 py-3 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors duration-200"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && !error && announcements.length === 0 && (
        <section className="bg-slate-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-blue-50 border-l-4 border-blue-500 p-8 text-center">
              <motion.p
                initial="hidden"
                animate="visible"
                variants={textVariants}
                className="text-lg text-blue-800 font-semibold mb-3"
              >
                Belum ada pengumuman tersedia
              </motion.p>
              <p className="text-slate-600">Nantikan informasi terbaru dari kami</p>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      {!loading && !error && announcements.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Announcement */}
              {mainAnnouncement && (
                <motion.article
                  key={mainAnnouncement.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={mainCardVariants}
                  className="lg:col-span-2 bg-white shadow-lg border-l-4 border-blue-600 p-8 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 uppercase tracking-wider">
                      Pengumuman Utama
                    </span>
                  </div>
                  
                  <time className="text-sm text-slate-500 font-medium block mb-3">
                    {new Date(mainAnnouncement.publishDate).toLocaleDateString('id-ID', { 
                      weekday: 'long',
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </time>
                  
                  <Link href={getAnnouncementLink(mainAnnouncement)} className="block group">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                      {mainAnnouncement.title}
                    </h2>
                  </Link>
                  
                  <p className="text-slate-700 mb-6 leading-relaxed line-clamp-4">
                    {getTruncatedContent(mainAnnouncement.content, mainAnnouncement.summary)}
                  </p>
                  
                  <Link 
                    href={getAnnouncementLink(mainAnnouncement)} 
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold group"
                  >
                    Baca Selengkapnya
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </motion.article>
              )}

              {/* Other Announcements */}
              <aside className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6 pb-2 border-b-2 border-slate-200">
                  Pengumuman Lainnya
                </h3>
                
                <AnimatePresence>
                  {otherAnnouncements.map((announcement, index) => (
                    <motion.article
                      key={announcement.id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      variants={cardVariants}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white shadow-md border-l-2 border-slate-300 p-6 hover:shadow-lg hover:border-blue-400 transition-all duration-200"
                    >
                      <time className="text-xs text-slate-500 font-medium uppercase tracking-wide block mb-2">
                        {new Date(announcement.publishDate).toLocaleDateString('id-ID', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </time>
                      
                      <Link href={getAnnouncementLink(announcement)} className="block group">
                        <h4 className="text-base font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                          {announcement.title}
                        </h4>
                      </Link>
                      
                      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {getTruncatedContent(announcement.content, announcement.summary)}
                      </p>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </aside>
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
};

export default Pengumuman;