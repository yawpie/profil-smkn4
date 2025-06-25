import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { formatDate } from '@/utils/formatDate';

export default function ArticleSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);   

  useEffect(() => {
    async function fetchArticlesFromBackend() {
      setLoading(true);
      setError(null);   
      try {
        const response = await fetch('http://192.168.236.15:3000/api/articles?page=1&limit=5'); 

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setArticles(data.data.data);
      } catch (e) {
        console.error("Gagal mengambil artikel dari rafi", e);
        setError("Gagal memuat artikel. Silakan coba lagi nanti.");
      } finally {
        setLoading(false); 
      }
    }

    fetchArticlesFromBackend();
  }, []);

  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const smallArticles = articles.length > 1 ? articles.slice(1) : [];

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-8 text-center text-gray-700">
        <p>Memuat artikel...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-8 text-center text-red-600">
        <p>{error}</p>
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section className="container mx-auto px-4 py-8 text-center text-gray-700">
        <p>Belum ada artikel yang tersedia.</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Header Bagian */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Informasi Lainnya</h2>
        <Link href="/artikel" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
          Lihat Semua
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Grid Artikel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Render Artikel Unggulan (Kolom Kiri) */}
        {featuredArticle && (
          <div className="lg:col-span-1">
            <Link href="#" className="block group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative w-full h-96">
                <Image
                  src={featuredArticle.image_url}
                  alt={featuredArticle.title}
                  layout="fill"
                  objectFit="cover"
                  className="group-hover:scale-105 transition-transform duration-300 brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <p className="text-xs font-semibold mb-1 opacity-90">{featuredArticle.category.name}</p>
                  <h3 className="text-xl font-bold mb-2 leading-tight">{featuredArticle.title}</h3>
                  <p className="text-sm opacity-80">{formatDate(featuredArticle.published_date)}</p>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Render Artikel Kecil (Dua Kolom Kanan) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {smallArticles.map((article) => (
            <Link href="#" key={article.id || article.title} className="block group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative w-full h-48">
                <Image
                  src={article.image_url} // Path gambar akan diambil dari properti 'image' di data backend
                  alt={article.title}
                  layout="fill"
                  objectFit="cover"
                  className="group-hover:scale-105 transition-transform duration-300 brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <p className="text-xs font-semibold mb-1 opacity-90">{article.category.name}</p>
                  <h3 className="text-md font-bold mb-1 leading-tight">{article.title}</h3>
                  <p className="text-xs opacity-80">{formatDate(article.published_date)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}