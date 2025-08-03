import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Dashboard/Layout'; // Pastikan path ke Dashboard Layout Anda benar
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import SlideFormModal from '../../components/Dashboard/SlideFormModal'; // Komponen Modal Form untuk Slide
import type { Slide } from '@/types/Slide'; // Gunakan Slide yang punya ID, order, isActive
import type { Notification } from '@/types/Notification'; // Pastikan tipe Notification sudah ada

const SlidesPage: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<Slide | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk mengambil data slides dari API
  const fetchSlides = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/slides'); // Endpoint API untuk mengambil semua slides
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui dari server.' }));
        throw new Error(`HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`);
      }
      const data: Slide[] = await response.json();
      setSlides(data);
    } catch (e: unknown) {
      console.error("Gagal memuat slides:", e);
      if (e instanceof Error) {
        setError(`Gagal memuat data slides. Detail: ${e.message}`);
      } else {
        setError("Gagal memuat data slides. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const handleAddEdit = useCallback((slide: Slide | null = null) => {
    setCurrentSlide(slide);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus slide ini? Aksi ini tidak bisa dibatalkan!')) {
      try {
        const response = await fetch(`/api/slides/${id}`, { // Endpoint API untuk delete berdasarkan ID
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui.' }));
          throw new Error(`HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`);
        }
        setNotification({ message: 'Slide berhasil dihapus!', type: 'success' });
        fetchSlides(); // Ambil ulang data setelah penghapusan
      } catch (e: unknown) {
        console.error("Gagal menghapus slide:", e);
        if (e instanceof Error) {
          setNotification({ message: `Gagal menghapus slide: ${e.message}`, type: 'error' });
        } else {
          setNotification({ message: 'Gagal menghapus slide. Silakan coba lagi.', type: 'error' });
        }
      }
    }
  }, [fetchSlides]);

  const handleSaveSlide = useCallback(async (slideToSave: Slide) => {
    try {
      const method = slideToSave.id ? 'PUT' : 'POST'; // Jika ada ID, update; jika tidak, tambah baru
      const url = slideToSave.id ? `/api/slides/${slideToSave.id}` : '/api/slides'; // URL spesifik untuk PUT
      const bodyToSend = JSON.stringify(slideToSave);

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui.' }));
        throw new Error(`HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`);
      }

      setNotification({ message: `Slide berhasil ${slideToSave.id ? 'diperbarui' : 'ditambahkan'}!`, type: 'success' });
      setIsModalOpen(false);
      setCurrentSlide(null);
      fetchSlides(); // Ambil ulang data setelah penyimpanan
    } catch (e: unknown) {
      console.error("Gagal menyimpan slide:", e);
      if (e instanceof Error) {
        setNotification({ message: `Gagal menyimpan slide: ${e.message}`, type: 'error' });
      } else {
        setNotification({ message: 'Gagal menyimpan slide. Silakan coba lagi.', type: 'error' });
      }
    }
  }, [fetchSlides]);

  return (
    <Layout setNotification={setNotification}>
      <div className="bg-gradient-to-b from-white to-blue-50 rounded-2xl shadow-xl p-8 animate-fade-in max-w-6xl mx-auto mt-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-800 tracking-wide">
              🖼️ Manajemen Slide Hero
            </h1>
            <p className="text-sm text-gray-500 mt-1">Kelola gambar dan teks yang tampil di bagian hero halaman utama.</p>
          </div>
          <button
            onClick={() => handleAddEdit()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-200 shadow-md"
          >
            <PlusIcon className="h-5 w-5" />
            Tambah Slide
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-700">Memuat data slides...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <thead className="bg-blue-100 text-blue-800 uppercase text-xs font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Urutan</th>
                  <th className="px-6 py-3 text-left">Gambar</th>
                  <th className="px-6 py-3 text-left">Judul</th>
                  <th className="px-6 py-3 text-left">Sub Judul</th>
                  <th className="px-6 py-3 text-left">Aktif</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {slides.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Belum ada data slide.
                    </td>
                  </tr>
                ) : (
                  slides.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50 transition duration-150">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.order}</td>
                      <td className="px-6 py-4">
                        {item.src ? (
                          <img
                            src={item.src}
                            alt={item.alt}
                            className="h-12 w-16 rounded-lg object-cover border border-blue-200 shadow" // Ukuran gambar disesuaikan
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = 'https://via.placeholder.com/64x48?text=No+Img';
                            }}
                          />
                        ) : (
                          <div className="h-12 w-16 rounded-lg bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
                            No Img
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 line-clamp-2 max-w-xs">{item.title}</td> {/* Tambah max-w-xs */}
                      <td className="px-6 py-4 text-sm text-gray-700 line-clamp-2 max-w-xs">{item.subtitle}</td> {/* Tambah max-w-xs */}
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                            item.isActive ? 'text-green-900' : 'text-red-900'
                          }`}
                        >
                          <span
                            aria-hidden
                            className={`absolute inset-0 opacity-50 rounded-full ${
                              item.isActive ? 'bg-green-200' : 'bg-red-200'
                            }`}
                          ></span>
                          <span className="relative">{item.isActive ? 'Aktif' : 'Tidak Aktif'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleAddEdit(item)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-full transition"
                            title="Hapus"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && (
          <SlideFormModal
            slide={currentSlide}
            onSave={handleSaveSlide}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default SlidesPage;