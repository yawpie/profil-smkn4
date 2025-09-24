"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Dashboard/Layout';
import { PlusIcon, PencilIcon, TrashIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import MajorFormModal from '../../components/Dashboard/MajorFormModal';
import type { Major } from '@/types/Major';
import type { Notification } from '@/types/Notification';

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
        const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui dari server.' }));
        const errorMessage = `HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`;
        setNotification({ message: errorMessage, type: 'error' });
        throw new Error(errorMessage);
      }
      const data: Major[] = await response.json();
      setMajors(data);
    } catch (e: unknown) {
      console.error("Gagal memuat jurusan:", e);
      if (e instanceof Error) {
        setError(`Gagal memuat data jurusan. Detail: ${e.message}`);
      } else {
        setError("Gagal memuat data jurusan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMajors();
  }, [fetchMajors]);

  const handleAddEdit = useCallback((major: Major | null = null) => {
    setCurrentMajor(major);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus jurusan ini? Aksi ini tidak bisa dibatalkan!')) {
      try {
        const response = await fetch(`/api/majors?id=${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui.' }));
          const errorMessage = `HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`;
          setNotification({ message: errorMessage, type: 'error' });
          console.error('Backend Error Response for DELETE:', errorData);
          return;
        }
        await response.json();
        setNotification({ message: 'Jurusan berhasil dihapus!', type: 'success' });
        fetchMajors();
      } catch (e: unknown) {
        console.error("Gagal menghapus jurusan:", e);
        if (e instanceof Error) {
          setNotification({ message: `Gagal menghapus jurusan: ${e.message}`, type: 'error' });
        } else {
          setNotification({ message: 'Gagal menghapus jurusan. Silakan coba lagi.', type: 'error' });
        }
      }
    }
  }, [fetchMajors]);

  const handleSaveMajor = useCallback(async (newMajor: Major) => {
    try {
      const method = newMajor.id ? 'PUT' : 'POST';
      const url = '/api/majors';
      const bodyToSend = JSON.stringify(newMajor);

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui.' }));
        let errorMessage = `HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`;

        if (response.status === 413) {
          errorMessage = "Gagal menyimpan jurusan. Ukuran gambar terlalu besar. Silakan pilih gambar yang lebih kecil.";
        }
        
        setNotification({ message: errorMessage, type: 'error' });
        console.error('Backend Error Response for SAVE:', errorData);
        return;
      }

      await response.json();
      setNotification({ message: `Jurusan berhasil ${newMajor.id ? 'diperbarui' : 'ditambahkan'}!`, type: 'success' });
      setIsModalOpen(false);
      setCurrentMajor(null);
      fetchMajors();
    } catch (e: unknown) {
      console.error("Gagal menyimpan jurusan:", e);
      if (e instanceof Error) {
        setNotification({ message: `Gagal menyimpan jurusan: ${e.message}`, type: 'error' });
      } else {
        setNotification({ message: 'Gagal menyimpan jurusan. Silakan coba lagi.', type: 'error' });
      }
    }
  }, [fetchMajors]);

  return (
    <Layout setNotification={setNotification}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <BookOpenIcon className="h-8 w-8 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Manajemen Jurusan</h1>
                  <p className="text-gray-600 mt-1">Kelola daftar jurusan dan program studi yang tersedia</p>
                </div>
              </div>
              <button
                onClick={() => handleAddEdit()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <PlusIcon className="h-5 w-5" />
                Tambah Jurusan
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                  <p className="text-gray-600 font-medium">Memuat data jurusan...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="p-4 bg-red-100 rounded-full inline-block mb-4">
                    <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <p className="text-red-600 font-semibold text-lg mb-2">Terjadi Kesalahan</p>
                  <p className="text-gray-600">{error}</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Jurusan
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Gambar
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Deskripsi
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {majors.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-gray-100 rounded-full">
                              <BookOpenIcon className="h-12 w-12 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-gray-900 font-semibold text-lg">Belum ada jurusan</p>
                              <p className="text-gray-500 mt-1">Mulai dengan menambahkan jurusan pertama Anda</p>
                            </div>
                            <button
                              onClick={() => handleAddEdit()}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                            >
                              <PlusIcon className="h-4 w-4" />
                              Tambah Jurusan
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      majors.map((item, index) => (
                        <tr key={item.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-500 mt-1">ID: {item.id}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {item.image ? (
                              <div className="relative">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="h-16 w-16 rounded-lg object-cover border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = 'https://images.unsplash.com/photo-1586348902889-437aa5a670fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fG5vJTIwaW1hZ2V8ZW58MHx8MHx8&auto=format&fit=crop&w=64&h=64&q=70';
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-gray-200">
                                <BookOpenIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-700 max-w-md" title={item.description}>
                              {item.description}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleAddEdit(item)} 
                                className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200" 
                                title="Edit Jurusan"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(item.id)} 
                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-200" 
                                title="Hapus Jurusan"
                              >
                                <TrashIcon className="h-4 w-4" />
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
          </div>
        </div>
      </div>

      {isModalOpen && (
        <MajorFormModal
          major={currentMajor}
          onSave={handleSaveMajor}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Layout>
  );
};

export default MajorsPage;