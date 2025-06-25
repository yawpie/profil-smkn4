// pages/pengumuman.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import MainLayout from '../components/layout/MainLayout'; // Import MainLayout dari path yang benar

export default function Pengumuman() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnnouncementsFromBackend() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/announcements');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAnnouncements(data);
      } catch (e) {
        console.error("Gagal mengambil", e);
        setError("Gagal memuat pengumuman. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    }

    fetchAnnouncementsFromBackend();
  }, []);

  const mainAnnouncement = announcements.length > 0 ? announcements[0] : null;
  const otherAnnouncements = announcements.length > 1 ? announcements.slice(1) : [];

  return (
    <MainLayout> {/* Gunakan MainLayout di sini */}
      {loading && (
        <section className="container mx-auto px-4 py-8 text-center text-gray-700">
          <p>Memuat pengumuman...</p>
        </section>
      )}

      {error && (
        <section className="container mx-auto px-4 py-8 text-center text-red-600">
          <p>{error}</p>
        </section>
      )}

      {!loading && !error && announcements.length === 0 && (
        <section className="container mx-auto px-4 py-8 text-center text-gray-700">
          <p>Belum ada pengumuman yang tersedia saat ini.</p>
        </section>
      )}

      {!loading && !error && announcements.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">Pengumuman Terbaru</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {mainAnnouncement && (
                <div className="md:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-[1.01]">
                  <div className="p-6">
                    <p className="text-sm text-gray-500 mb-2">{mainAnnouncement.date}</p>
                    <Link href={`/pengumuman/${mainAnnouncement.slug || mainAnnouncement.id}`}>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 cursor-pointer hover:text-blue-600 transition-colors">
                        {mainAnnouncement.title}
                      </h3>
                    </Link>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {mainAnnouncement.summary}
                    </p>
                    <Link href={`/pengumuman/${mainAnnouncement.slug || mainAnnouncement.id}`} className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                      Baca Selengkapnya &rarr;
                    </Link>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {otherAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="bg-white rounded-lg shadow-md p-5 border-l-4 border-yellow-400 transition-transform transform hover:scale-[1.01]">
                    <p className="text-xs text-gray-500 mb-1">{announcement.date}</p>
                    <Link href={`/pengumuman/${announcement.slug || announcement.id}`}>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2 cursor-pointer hover:text-blue-600 transition-colors">
                        {announcement.title}
                      </h4>
                    </Link>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {announcement.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/pengumuman" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md">
                Lihat Semua Pengumuman
              </Link>
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
}