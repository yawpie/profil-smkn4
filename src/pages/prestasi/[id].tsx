import React, { FC } from 'react';
import { GetStaticProps, GetStaticPaths } from "next";
import MainLayout from '../../components/layout/MainLayout';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import type { Achievement, AchievementApi } from '@/types/Achievement';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { apiGet } from '@/utils/apiClient';
import DOMPurify from "isomorphic-dompurify";
import RichTextRenderer from '@/components/RichTextRenderer';

// Helper function to format dates
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string');
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
};

// Framer Motion Variants
const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const slideInVariants: Variants = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

interface AchievementDetailPageProps {
  achievement: Achievement;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<AchievementDetailPageProps> = async (context) => {
  const id = context.params?.id as string;

  if (!id) {
    return { notFound: true };
  }

  try {
    const response = await apiGet<AchievementApi>(`/achievements?id=${id}`);
    if (response) {
      const achievement: Achievement = {
        id: response.id,
        title: response.title,
        content: DOMPurify.sanitize(response.content),
        description: response.description || '',
        publishDate: response.publishDate || '',
        image: response.image_url || "/images/placeholder-achievement.png",
      };
      // console.log("Fetched achievement for SSG:", achievement);
      return {
        props: { achievement },
        revalidate: 60, // ISR revalidate every 60 seconds
      };
    }
  } catch (err: any) {
    console.error('Error fetching achievement details at SSG:', err);
  }

  return { notFound: true };
};

const AchievementDetailPage: FC<AchievementDetailPageProps> = ({ achievement }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <MainLayout>
      <Head>
        <title>{`${achievement.title} - SMKN 4 Mataram`}</title>
        <meta name="description" content={achievement.description || achievement.content?.substring(0, 160) || `Details of achievement ${achievement.title}.`} />
        <meta property="og:title" content={achievement.title} />
        <meta property="og:description" content={achievement.description || achievement.content?.substring(0, 160) || `Details of achievement ${achievement.title}.`} />
        {achievement.image && <meta property="og:image" content={achievement.image} />}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/prestasi/${achievement.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
        {achievement.image && <meta name="twitter:image" content={achievement.image} />}
      </Head>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-slate-900 text-white overflow-hidden">
          {/* Background Pattern - Gen Z Touch */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600"></div>
            <div className="absolute top-20 right-20 w-24 h-24 bg-gradient-to-br from-pink-500 to-red-500"></div>
            <div className="absolute bottom-10 left-1/4 w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500"></div>
            <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500"></div>
          </div>

          <div className="relative container mx-auto px-6 sm:px-8 lg:px-12 py-24">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              className="max-w-7xl mx-auto"
            >
              {/* Breadcrumb */}
              <motion.nav
                variants={slideInVariants}
                className="mb-10 text-sm text-slate-300"
              >
                <Link href="/" className="hover:text-white transition-colors duration-200">
                  Home
                </Link>
                <span className="mx-3">/</span>
                <Link href="/prestasi" className="hover:text-white transition-colors duration-200">
                  Achievements
                </Link>
                <span className="mx-3">/</span>
                <span className="text-white font-medium">{achievement.title}</span>
              </motion.nav>

              {/* Achievement Title */}
              <motion.div
                variants={fadeInVariants}
                className="mb-12"
              >
                <div className="flex items-start space-x-6 mb-6">
                  <div className="w-1.5 h-20 bg-gradient-to-b from-blue-500 to-purple-600 flex-shrink-0"></div>
                  <div className="flex-1">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                      {achievement.title}
                    </h1>
                  </div>
                </div>

                <div className="flex items-center space-x-8 text-slate-300 ml-8">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium text-lg">{formatDate(achievement.publishDate)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500"></div>
                    <span className="text-sm font-medium uppercase tracking-wide">PUBLISHED</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
                {/* Content Column - Now takes 3/4 width */}
                <motion.div
                  className="lg:col-span-3"
                  initial="hidden"
                  animate="visible"
                  variants={fadeInVariants}
                >
                  {/* Achievement Image */}
                  {achievement.image && (
                    <motion.div
                      className="relative mb-12 bg-slate-100 border border-slate-200"
                      variants={fadeInVariants}
                    >
                      <Image
                        src={achievement.image}
                        alt={achievement.title}
                        width={1200}
                        height={600}
                        className="w-full h-auto object-cover"
                        // unoptimized
                      />
                      {/* <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 border border-slate-200">
                        <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                          FEATURED
                        </span>
                      </div> */}
                    </motion.div>
                  )}

                  {/* Content Sections */}
                  <div className="space-y-12">
                    {/* Summary Section */}
                    {/* <motion.div
                      variants={fadeInVariants}
                      className="border-l-4 border-blue-600 pl-8"
                    >
                      <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center space-x-4">
                        <span>Executive Summary</span>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                      </h2>
                      <div className="prose prose-slate prose-lg max-w-none">
                        <p className="text-slate-700 leading-relaxed text-xl">
                          {achievement.description}
                        </p>
                      </div>
                    </motion.div> */}

                    {/* Detailed Content */}
                    <motion.div
                      variants={fadeInVariants}
                      className="border-l-4 border-purple-600 pl-8"
                    >
                      {/* <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center space-x-4">
                        <span>Comprehensive Details</span>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                      </h2> */}
                      <div className="prose prose-slate prose-lg max-w-none">
                        {RichTextRenderer({
                          content: achievement.content || "",
                          className: "text-slate-700 leading-relaxed space-y-6",
                        })}
                        {/* <div className="" /> */}
                        {/* {achievement.content?.split('\n\n').map((paragraph, index) => (
                            <div key={index} className="prose" dangerouslySetInnerHTML={ {__html:paragraph}}/>
                          ))}
                        </div> */}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Sidebar - Now takes 1/4 width */}
                <motion.div
                  className="lg:col-span-1"
                  initial="hidden"
                  animate="visible"
                  variants={fadeInVariants}
                >
                  <div className="sticky top-8 space-y-8">
                    {/* Quick Info Card */}
                    <div className="bg-slate-50 border border-slate-200 p-8">
                      <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center space-x-3">
                        <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500"></div>
                        <span>Quick Info</span>
                      </h3>
                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between border-b border-slate-200 pb-3">
                          <span className="text-slate-600 font-medium">Published:</span>
                          <span className="font-semibold text-slate-900">{formatDate(achievement.publishDate)}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-3">
                          <span className="text-slate-600 font-medium">Status:</span>
                          <span className="font-semibold text-green-600">Active</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 font-medium">Category:</span>
                          <span className="font-semibold text-slate-900">Achievement</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Card - Gen Z Touch */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 border border-slate-700">
                      <h3 className="text-xl font-semibold mb-6 flex items-center space-x-3">
                        <div className="w-1.5 h-8 bg-gradient-to-b from-pink-500 to-orange-500"></div>
                        <span>Actions</span>
                      </h3>
                      <div className="space-y-4">
                        <button
                          onClick={() => router.push('/prestasi')}
                          className="w-full px-6 py-4 bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors duration-200 border border-slate-300"
                        >
                          ← Back to List
                        </button>
                        <button
                          onClick={() => window.print()}
                          className="w-full px-6 py-4 border border-white text-white hover:bg-white hover:text-slate-900 font-medium transition-colors duration-200"
                        >
                          Print Page
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Section - Gen Z Touch */}
        <section className="bg-slate-900 text-white py-16">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto text-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInVariants}
              >
                <div className="flex justify-center mb-6">
                  <div className="flex space-x-3">
                    <div className="w-4 h-4 bg-blue-500"></div>
                    <div className="w-4 h-4 bg-purple-500"></div>
                    <div className="w-4 h-4 bg-pink-500"></div>
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-6">Explore More Achievements</h2>
                <p className="text-slate-300 mb-8 text-lg max-w-2xl mx-auto">Discover other institutional milestones and accomplishments that showcase our commitment to excellence.</p>
                <Link
                  href="/prestasi"
                  className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200"
                >
                  View All Achievements
                  <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default AchievementDetailPage;