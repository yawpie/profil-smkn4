import React, { useState, useEffect } from 'react';
import Layout from '../../components/Dashboard/Layout';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import SlideFormModal from '../../components/Dashboard/SlideFormModal';
import type { Slide } from '@/types/Slide';
import type { Notification } from '@/types/Notification';

const SlidesPage: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<Slide | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const MAX_SLIDE_ORDER = 3;

  const fetchSlides = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/slides');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui dari server.' }));
        throw new Error(`HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`);
      }
      const data: Slide[] = await response.json();
      setSlides(data.sort((a, b) => a.order - b.order));
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
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleAddEdit = (slide: Slide | null = null) => {
    if (!slide && slides.length >= MAX_SLIDE_ORDER) {
      setNotification({ message: `Tidak dapat menambah slide. Maksimal ${MAX_SLIDE_ORDER} slide. Silakan edit yang sudah ada.`, type: 'error' });
      return;
    }
    setCurrentSlide(slide);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus slide ini? Aksi ini tidak bisa dibatalkan!')) {
      try {
        const response = await fetch('/api/slides', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui.' }));
          console.error('Backend Error Response for DELETE:', errorData);
          throw new Error(`HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`);
        }
        await response.json();
        setNotification({ message: 'Slide berhasil dihapus!', type: 'success' });
        fetchSlides();
      } catch (e: unknown) {
        console.error("Gagal menghapus slide:", e);
        if (e instanceof Error) {
          setNotification({ message: `Gagal menghapus slide: ${e.message}`, type: 'error' });
        } else {
          setNotification({ message: 'Gagal menghapus slide. Silakan coba lagi.', type: 'error' });
        }
      }
    }
  };

  const handleSaveSlide = async (slideToSave: Slide) => {
    try {
      const method = slideToSave.id ? 'PUT' : 'POST';
      const url = '/api/slides';
      const bodyToSend = JSON.stringify(slideToSave);

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyToSend,
      });

      if (!response.ok) {
        // PERBAIKAN PENTING: Tangani error spesifik dari server
        const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui.' }));
        // Gunakan pesan error dari backend jika ada, jika tidak, pakai pesan status
        let errorMessage = `HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`;

        // Cek apakah error 413, lalu berikan pesan yang lebih jelas
        if (response.status === 413) {
          errorMessage = "Gagal menyimpan slide. Ukuran gambar terlalu besar. Silakan pilih gambar yang lebih kecil.";
        }

        // Jangan me-re-throw error di sini
        setNotification({ message: errorMessage, type: 'error' });
        console.error('Backend Error Response for SAVE:', errorData);
        return; // Hentikan eksekusi fungsi
      }

      await response.json();
      setNotification({ message: `Slide berhasil ${slideToSave.id ? 'diperbarui' : 'ditambahkan'}!`, type: 'success' });
      setIsModalOpen(false); // Modal ditutup HANYA jika berhasil
      setCurrentSlide(null);
      fetchSlides();
    } catch (e: unknown) {
      // Tangkap error jika fetch gagal total (misalnya, masalah jaringan)
      console.error("Gagal menyimpan slide:", e);
      if (e instanceof Error) {
        setNotification({ message: `Gagal menyimpan slide: ${e.message}`, type: 'error' });
      } else {
        setNotification({ message: 'Gagal menyimpan slide. Silakan coba lagi.', type: 'error' });
      }
    }
  };

  const canAddMoreSlides = slides.length < MAX_SLIDE_ORDER;

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
            className={`flex items-center gap-2 px-5 py-2.5 font-semibold rounded-full transition-all duration-200 shadow-md
              ${canAddMoreSlides 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            disabled={!canAddMoreSlides}
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
          <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
            <table className="min-w-full bg-white">
              <thead className="bg-blue-100 text-blue-800 uppercase text-xs font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left w-20">Urutan</th>
                  <th className="px-6 py-3 text-left w-32">Gambar</th>
                  <th className="px-6 py-3 text-left">Judul</th>
                  <th className="px-6 py-3 text-left">Sub Judul</th>
                  <th className="px-6 py-3 text-left w-28">Aktif</th>
                  <th className="px-6 py-3 text-right w-32">Aksi</th>
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
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.alt}
                            className="h-12 w-16 rounded-lg object-cover border border-blue-200 shadow"
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = 'https://images.unsplash.com/photo-1586348902889-437aa5a670fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fG5vJTIwaW1hZ2V8ZW58MHx8MHx8&auto=format&fit=crop&w=64&h=48&q=70';
                            }}
                          />
                        ) : (
                          <div className="h-12 w-16 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-xs border border-gray-300">
                            No Img
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 break-words max-w-xs sm:max-w-sm md:max-w-md lg:max-w-none">
                        <p className="line-clamp-2">{item.title}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 break-words max-w-xs sm:max-w-sm md:max-w-md lg:max-w-none">
                        <p className="line-clamp-2">{item.subtitle}</p>
                      </td>
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