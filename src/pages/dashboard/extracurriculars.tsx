"use client";

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Dashboard/Layout';
import { PlusIcon, PencilIcon, TrashIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import ExtracurricularFormModal from '../../components/Dashboard/ExtracurricularFormModal';
import type { Extracurricular } from '@/types/Extracurricular';
import type { Notification } from '@/types/Notification';

const ExtracurricularsPage: React.FC = () => {
  const [extracurriculars, setExtracurriculars] = useState<Extracurricular[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentExtracurricular, setCurrentExtracurricular] = useState<Extracurricular | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  // Function to fetch extracurricular data from API
  const fetchExtracurriculars = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/extracurriculars');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui dari server.' }));
        throw new Error(`HTTP error! status: ${response.status}: ${errorData.message || response.statusText}`);
      }
      const data: Extracurricular[] = await response.json();
      setExtracurriculars(data);
    } catch (e: unknown) {
      console.error("Failed to fetch extracurriculars:", e);
      if (e instanceof Error) {
        setError(`Gagal memuat data ekstrakurikuler. Detail: ${e.message}`);
      } else {
        setError("Gagal memuat data ekstrakurikuler. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExtracurriculars();
  }, []);

  const handleAddEdit = (extracurricular: Extracurricular | null = null) => {
    setCurrentExtracurricular(extracurricular);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string | null) => {
    setDeleteItemId(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteItemId) return;

    try {
      const response = await fetch(`/api/extracurriculars?id=${deleteItemId}`, {
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
      setNotification({ message: 'Ekstrakurikuler berhasil dihapus!', type: 'success' });
      fetchExtracurriculars();
    } catch (e: unknown) {
      console.error("Gagal menghapus ekstrakurikuler:", e);
      if (e instanceof Error) {
        setNotification({ message: `Gagal menghapus ekstrakurikuler: ${e.message}`, type: 'error' });
      } else {
        setNotification({ message: 'Gagal menghapus ekstrakurikuler. Silakan coba lagi.', type: 'error' });
      }
    } finally {
      setShowConfirmModal(false);
      setDeleteItemId(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setDeleteItemId(null);
  };

  const handleSaveExtracurricular = async (newExtracurricular: Extracurricular) => {
    try {
      const method = newExtracurricular.id ? 'PUT' : 'POST';
      const response = await fetch('/api/extracurriculars', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExtracurricular),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui.' }));
        let errorMessage = `HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`;

        if (response.status === 413) {
          errorMessage = "Gagal menyimpan ekstrakurikuler. Ukuran gambar terlalu besar. Silakan pilih gambar yang lebih kecil.";
        }
        
        setNotification({ message: errorMessage, type: 'error' });
        console.error('Backend Error Response for SAVE:', errorData);
        return;
      }

      await response.json();
      setNotification({ message: `Ekstrakurikuler berhasil ${newExtracurricular.id ? 'diperbarui' : 'ditambahkan'}!`, type: 'success' });
      setIsModalOpen(false);
      setCurrentExtracurricular(null);
      fetchExtracurriculars();
    } catch (e: unknown) {
      console.error("Gagal menyimpan ekstrakurikuler:", e);
      if (e instanceof Error) {
        setNotification({ message: `Gagal menyimpan ekstrakurikuler: ${e.message}`, type: 'error' });
      } else {
        setNotification({ message: 'Gagal menyimpan ekstrakurikuler. Silakan coba lagi.', type: 'error' });
      }
    }
  };

  return (
    <Layout setNotification={setNotification}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <AcademicCapIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Manajemen Ekstrakurikuler</h1>
                  <p className="text-gray-600 mt-1">Kelola dan pantau semua kegiatan ekstrakurikuler</p>
                </div>
              </div>
              <button
                onClick={() => handleAddEdit()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <PlusIcon className="h-5 w-5" />
                Tambah Ekstrakurikuler
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  <p className="text-gray-600 font-medium">Memuat data ekstrakurikuler...</p>
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
                        Ekstrakurikuler
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Gambar
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Deskripsi
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Pelatih
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Jadwal
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {extracurriculars.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-gray-100 rounded-full">
                              <AcademicCapIcon className="h-12 w-12 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-gray-900 font-semibold text-lg">Belum ada ekstrakurikuler</p>
                              <p className="text-gray-500 mt-1">Mulai dengan menambahkan ekstrakurikuler pertama Anda</p>
                            </div>
                            <button
                              onClick={() => handleAddEdit()}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
                            >
                              <PlusIcon className="h-4 w-4" />
                              Tambah Ekstrakurikuler
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      extracurriculars.map((item, index) => (
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
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1586348902889-437aa5a670fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fG5vJTIwaW1hZ2V8ZW58MHx8MHx8&auto=format&fit=crop&w=64&h=64&q=70';
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-gray-200">
                                <AcademicCapIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-700 max-w-xs truncate" title={item.description}>
                              {item.description}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                              {item.coach}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-700 font-medium">{item.schedule}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleAddEdit(item)}
                                className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 transition-all duration-200"
                                title="Edit Ekstrakurikuler"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(item.id)}
                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-200"
                                title="Hapus Ekstrakurikuler"
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
        <ExtracurricularFormModal
          extracurricular={currentExtracurricular}
          onSave={handleSaveExtracurricular}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-full">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Penghapusan</h3>
                <p className="text-gray-600 text-sm">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Apakah Anda yakin ingin menghapus ekstrakurikuler ini? Semua data terkait akan dihapus secara permanen.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
              >
                Hapus Ekstrakurikuler
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ExtracurricularsPage;