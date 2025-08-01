"use client";

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Dashboard/Layout';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
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
      const response = await fetch('/api/extracurriculars'); // Fetch from your API Route
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Extracurricular[] = await response.json();
      setExtracurriculars(data);
    } catch (e: any) {
      console.error("Failed to fetch extracurriculars:", e);
      setError("Gagal memuat data ekstrakurikuler. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExtracurriculars(); // Call fetchExtracurriculars when the component mounts
  }, []);

  const handleAddEdit = (extracurricular: Extracurricular | null = null) => {
    setCurrentExtracurricular(extracurricular);
    setIsModalOpen(true);
  };

  // Custom confirmation dialog instead of 'confirm()'
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // No need to await response.json() if the API doesn't return meaningful data for DELETE
      // await response.json();
      setNotification({ message: 'Ekstrakurikuler berhasil dihapus!', type: 'success' });
      fetchExtracurriculars(); // Re-fetch data after deletion
    } catch (e: any) {
      console.error("Failed to delete extracurricular:", e);
      setNotification({ message: `Gagal menghapus ekstrakurikuler: ${e.message}`, type: 'error' });
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // No need to await response.json() if the API doesn't return meaningful data for POST/PUT
      // await response.json();
      setNotification({ message: `Ekstrakurikuler berhasil ${newExtracurricular.id ? 'diperbarui' : 'ditambahkan'}!`, type: 'success' });
      setIsModalOpen(false);
      setCurrentExtracurricular(null);
      fetchExtracurriculars(); // Re-fetch data after saving
    } catch (e: any) {
      console.error("Failed to save extracurricular:", e);
      setNotification({ message: `Gagal menyimpan ekstrakurikuler: ${e.message}`, type: 'error' });
    }
  };

  return (
    <Layout setNotification={setNotification}>
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800 tracking-wide flex items-center gap-3">
            <span>🎯</span>
            <span>Manajemen Ekstrakurikuler</span>
          </h1>

          <button
            onClick={() => handleAddEdit()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-200 shadow-md"
          >
            <PlusIcon className="h-5 w-5" />
            Tambah Ekstrakurikuler
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-700">Memuat data ekstrakurikuler...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <thead className="bg-blue-100 text-blue-800 uppercase text-xs font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Nama</th>
                  <th className="px-6 py-3 text-left">Gambar</th>
                  <th className="px-6 py-3 text-left">Deskripsi</th>
                  <th className="px-6 py-3 text-left">Pelatih</th>
                  <th className="px-6 py-3 text-left">Jadwal</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {extracurriculars.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Belum ada data ekstrakurikuler.
                    </td>
                  </tr>
                ) : (
                  extracurriculars.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50 transition duration-150">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 rounded-lg object-cover shadow"
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = 'https://via.placeholder.com/48x48?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 line-clamp-2">{item.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {item.coach}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.schedule}</td>
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
                            onClick={() => handleDeleteClick(item.id)} // Use custom confirmation
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
          <ExtracurricularFormModal
            extracurricular={currentExtracurricular}
            onSave={handleSaveExtracurricular}
            onClose={() => setIsModalOpen(false)}
          />
        )}

        {/* Custom Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Konfirmasi Penghapusan</h3>
              <p className="text-gray-700 mb-6">Apakah Anda yakin ingin menghapus ekstrakurikuler ini?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ExtracurricularsPage;
