import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Major } from '@/types/Major';
import MainLayout from '../../components/layout/MainLayout'; // Pastikan path ini benar

const DetailJurusanPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [major, setMajor] = useState<Major | null>(null);
  const [loading, setLoading] = useState(true); // State untuk loading
  const [error, setError] = useState<string | null>(null); // State untuk error

  useEffect(() => {
    const fetchMajorDetails = async () => {
      if (id) {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/majors?id=${id}`);
          if (!res.ok) {
            throw new Error(`Gagal mengambil data: ${res.statusText}`);
          }
          const data = await res.json();
          if (data) {
            setMajor(data);
          } else {
            setError('Data jurusan tidak ditemukan.');
          }
        } catch (err: any) {
          console.error('Error fetching major details:', err);
          setError(`Terjadi kesalahan saat memuat data: ${err.message}`);
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
        <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gradient-to-b from-white to-blue-50 text-gray-700">
          <p className="text-xl">Memuat detail jurusan...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 text-gray-700 p-4 text-center">
          <p className="text-xl text-red-500 mb-4">{error}</p>
          <Link href="/jurusan" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition duration-300 ease-in-out">
            Kembali ke Daftar Jurusan
          </Link>
        </div>
      </MainLayout>
    );
  }

  if (!major) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gradient-to-b from-white to-blue-50 text-gray-700">
          <p className="text-xl">Data tidak tersedia.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-white to-blue-50 text-gray-800 font-sans py-16 min-h-[calc(100vh-120px)]">
        <motion.div
          className="max-w-5xl mx-auto px-4 sm:px-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Breadcrumb */}
          <motion.div
            className="mb-6 text-sm text-gray-600"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <Link href="/" className="hover:underline hover:text-blue-600 transition duration-200">Beranda</Link> &gt;{' '}
            <Link href="/jurusan" className="hover:underline hover:text-blue-600 transition duration-200">Jurusan</Link> &gt;{' '}
            <span className="font-semibold text-blue-700">{major.name}</span>
          </motion.div>

          {/* Bagian header jurusan dengan gradasi biru gelap sebagai background utama */}
          <motion.div
            className="relative w-full h-72 sm:h-96 rounded-xl overflow-hidden shadow-2xl border border-blue-400/30
                       bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex items-end p-6 sm:p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
          >
            {/* Gambar Jurusan sebagai overlay */}
            {major.image && (
              <Image
                src={major.image}
                alt={major.name}
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 rounded-xl opacity-30 sm:opacity-50 filter brightness-90 contrast-110"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent via-black/20" />
            
            {/* Judul Jurusan di sudut kiri bawah gambar - ukuran font diperkecil */}
            <motion.h2 
              className="relative text-2xl sm:text-4xl font-extrabold text-white drop-shadow-lg z-10" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {major.name}
            </motion.h2>
          </motion.div>

          {/* Konten panjang dari deskripsi - kini di latar putih */}
          <motion.div
            className="mt-12 bg-white p-8 rounded-2xl shadow-lg space-y-4 text-gray-700 leading-relaxed border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7, ease: 'easeOut' }}
          >
            <h3 className="text-xl font-bold text-blue-800 mb-4 border-b border-blue-200 pb-2">Deskripsi Jurusan</h3> {/* Ukuran font sub-judul diperkecil */}
            {typeof major.description === 'string' ? (
              major.description
                .split('\n')
                .filter((line) => line.trim() !== '')
                .map((para, idx) => (
                  <motion.p
                    key={idx}
                    className="text-base" // Ukuran font paragraf diperkecil
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1, duration: 0.5 }}
                  >
                    {para}
                  </motion.p>
                ))
            ) : (
              <p className="italic text-gray-500 text-base">Deskripsi belum tersedia.</p>
            )}
          </motion.div>

          {/* Bagian opsional: Fakta Cepat / Prospek Karir - kini di latar putih dengan aksen biru */}
          {major.fastFacts && Array.isArray(major.fastFacts) && major.fastFacts.length > 0 && (
            <motion.div
              className="mt-10 bg-blue-50 p-8 rounded-2xl shadow-md border border-blue-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
            >
              <h3 className="text-xl font-bold text-blue-800 mb-4 border-b border-blue-300 pb-2">Fakta Cepat</h3> {/* Ukuran font sub-judul diperkecil */}
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-base"> {/* Ukuran font list item diperkecil */}
                {major.fastFacts.map((fact: string, idx: number) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + idx * 0.05, duration: 0.5 }}
                  >
                    {fact}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {major.careerProspects && Array.isArray(major.careerProspects) && major.careerProspects.length > 0 && (
            <motion.div
              className="mt-10 bg-blue-50 p-8 rounded-2xl shadow-md border border-blue-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.7 }}
            >
              <h3 className="text-xl font-bold text-blue-800 mb-4 border-b border-blue-300 pb-2">Prospek Karir</h3> {/* Ukuran font sub-judul diperkecil */}
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-base"> {/* Ukuran font list item diperkecil */}
                {major.careerProspects.map((prospect: string, idx: number) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + idx * 0.05, duration: 0.5 }}
                  >
                    {prospect}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Tombol Kembali - ukuran font diperkecil */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <Link href="/jurusan" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1">
              &larr; Kembali ke Daftar Jurusan
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </MainLayout>
  );
};

export default DetailJurusanPage;