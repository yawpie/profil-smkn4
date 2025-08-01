// src/pages/dashboard/majors.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react'; // Tambahkan useCallback
import Layout from '../../components/Dashboard/Layout'; // Path layout
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'; // Ikon
import MajorFormModal from '../../components/Dashboard/MajorFormModal'; // Modal form
import type { Major } from '@/types/Major'; // Tipe Major
import type { Notification } from '@/types/Notification'; // Tipe Notifikasi

const MajorsPage: React.FC = () => {
  const [majors, setMajors] = useState<Major[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentMajor, setCurrentMajor] = useState<Major | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk mengambil data jurusan dari API
  const fetchMajors = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/majors');
      if (!response.ok) {
        // Coba parsing pesan error dari respons API
        const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui dari server.' }));
        throw new Error(`HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`);
      }
      const data: Major[] = await response.json(); // Tipekan data yang diambil
      setMajors(data);
    } catch (e: unknown) { // Gunakan 'unknown' untuk penanganan error yang lebih aman
      console.error("Gagal memuat jurusan:", e);
      if (e instanceof Error) {
        setError(`Gagal memuat data jurusan. Detail: ${e.message}`);
      } else {
        setError("Gagal memuat data jurusan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }, []); // Dependensi kosong karena fungsi ini hanya bergantung pada API endpoint

  useEffect(() => {
    fetchMajors();
  }, [fetchMajors]); // Tambahkan fetchMajors sebagai dependensi useEffect

  const handleAddEdit = useCallback((major: Major | null = null) => { // Gunakan useCallback
    setCurrentMajor(major);
    setIsModalOpen(true);
  }, []); // Dependensi kosong

  const handleDelete = useCallback(async (id: string) => { // Gunakan useCallback
    if (confirm('Apakah Anda yakin ingin menghapus jurusan ini? Aksi ini tidak bisa dibatalkan!')) {
      try {
        const response = await fetch(`/api/majors?id=${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui.' }));
          throw new Error(`HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`);
        }
        await response.json(); // Konsumsi respons
        setNotification({ message: 'Jurusan berhasil dihapus!', type: 'success' });
        fetchMajors(); // Ambil ulang data setelah penghapusan
      } catch (e: unknown) {
        console.error("Gagal menghapus jurusan:", e);
        if (e instanceof Error) {
          setNotification({ message: `Gagal menghapus jurusan: ${e.message}`, type: 'error' });
        } else {
          setNotification({ message: 'Gagal menghapus jurusan. Silakan coba lagi.', type: 'error' });
        }
      }
    }
  }, [fetchMajors]); // Tergantung pada fetchMajors

  const handleSaveMajor = useCallback(async (newMajor: Major) => { // Gunakan useCallback
    try {
      const method = newMajor.id ? 'PUT' : 'POST';
      const url = '/api/majors';
      const bodyToSend = JSON.stringify(newMajor); // Kirim objek Major langsung

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

      await response.json(); // Konsumsi respons
      setNotification({ message: `Jurusan berhasil ${newMajor.id ? 'diperbarui' : 'ditambahkan'}!`, type: 'success' });
      setIsModalOpen(false);
      setCurrentMajor(null);
      fetchMajors(); // Ambil ulang data setelah penyimpanan
    } catch (e: unknown) {
      console.error("Gagal menyimpan jurusan:", e);
      if (e instanceof Error) {
        setNotification({ message: `Gagal menyimpan jurusan: ${e.message}`, type: 'error' });
      } else {
        setNotification({ message: 'Gagal menyimpan jurusan. Silakan coba lagi.', type: 'error' });
      }
    }
  }, [fetchMajors]); // Tergantung pada fetchMajors

  return (
    <Layout setNotification={setNotification}>
      <div className="bg-gradient-to-b from-white to-blue-50 rounded-2xl shadow-xl p-8 animate-fade-in max-w-6xl mx-auto mt-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-800 tracking-wide">
              🎓 Manajemen Jurusan
            </h1>
            <p className="text-sm text-gray-500 mt-1">Kelola daftar jurusan yang tersedia di sekolah beserta deskripsi dan gambar representatif.</p>
          </div>
          <button
            onClick={() => handleAddEdit()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-200 shadow-md"
          >
            <PlusIcon className="h-5 w-5" />
            Tambah Jurusan
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-700">Memuat data jurusan...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <thead className="bg-blue-100 text-blue-800 uppercase text-xs font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Nama Jurusan</th>
                  <th className="px-6 py-3 text-left">Gambar</th>
                  <th className="px-6 py-3 text-left">Deskripsi</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {majors.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      Belum ada data jurusan.
                    </td>
                  </tr>
                ) : (
                  majors.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50 transition duration-150">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 rounded-lg object-cover border border-blue-200 shadow"
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                              const target = e.target as HTMLImageElement; // Cast target to HTMLImageElement
                              target.onerror = null;
                              target.src = 'https://via.placeholder.com/48x48?text=No+Image'; // Fallback image
                            }}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
                            No Img
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 line-clamp-2">{item.description}</td>
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
          <MajorFormModal
            major={currentMajor}
            onSave={handleSaveMajor}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default MajorsPage;