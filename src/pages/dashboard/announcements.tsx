"use client";

import React, { useState, useEffect, FC } from 'react';
import Layout from '../../components/Dashboard/Layout';
import { PlusIcon, PencilIcon, TrashIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';
import AnnouncementFormModal from '../../components/Dashboard/AnnouncementFormModal';
import { Announcement } from '@/types/Announcement';
import type { Notification } from '@/types/Notification';

type CustomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'confirm' | 'info' | 'error';
}

const CustomModal: FC<CustomModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Ya", cancelText = "Batal", type = 'info' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-red-100 rounded-full">
            <TrashIcon className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-gray-600 text-sm mt-1">Tindakan ini tidak dapat dibatalkan</p>
          </div>
        </div>
        
        <p className="text-gray-700 mb-6">{message}</p>
        
        <div className="flex justify-end gap-3">
          {type === 'confirm' && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm || onClose}
            className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const AnnouncementsPage: FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [confirmActionId, setConfirmActionId] = useState<string | null>(null);

  const fetchAnnouncements = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/announcements?status=all');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui dari server.' }));
        const errorMessage = `HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`;
        setNotification({ message: errorMessage, type: 'error' });
        throw new Error(errorMessage);
      }
      const data: Announcement[] = await response.json();
      setAnnouncements(data);
    } catch (e: unknown) {
      console.error("Failed to fetch announcements:", e);
      if (e instanceof Error) {
        setError(`Gagal memuat data pengumuman. Detail: ${e.message}`);
      } else {
        setError("Gagal memuat data pengumuman. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleAddEdit = (announcement: Announcement | null = null): void => {
    setCurrentAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string | number): void => {
    setConfirmActionId(id.toString());
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (!confirmActionId) return;

    try {
      const response = await fetch(`/api/announcements?id=${confirmActionId}`, {
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
      setNotification({ message: 'Pengumuman berhasil dihapus!', type: 'success' });
      fetchAnnouncements();
    } catch (e: unknown) {
      console.error("Gagal menghapus pengumuman:", e);
      if (e instanceof Error) {
        setNotification({ message: `Gagal menghapus pengumuman: ${e.message}`, type: 'error' });
      } else {
        setNotification({ message: 'Gagal menghapus pengumuman. Silakan coba lagi.', type: 'error' });
      }
    } finally {
      setIsConfirmModalOpen(false);
      setConfirmActionId(null);
    }
  };

  const handleSaveAnnouncement = async (newAnnouncement: Announcement): Promise<void> => {
    try {
      const method = newAnnouncement.id ? 'PUT' : 'POST';
      const response = await fetch('/api/announcements', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAnnouncement),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui.' }));
        let errorMessage = `HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`;

        if (response.status === 413) {
          errorMessage = "Gagal menyimpan pengumuman. Ukuran gambar terlalu besar. Silakan pilih gambar yang lebih kecil.";
        }
        
        setNotification({ message: errorMessage, type: 'error' });
        console.error('Backend Error Response for SAVE:', errorData);
        return;
      }
      await response.json();
      setNotification({ message: `Pengumuman berhasil ${newAnnouncement.id ? 'diperbarui' : 'ditambahkan'}!`, type: 'success' });
      setIsModalOpen(false);
      setCurrentAnnouncement(null);
      fetchAnnouncements();
    } catch (e: unknown) {
      console.error("Failed to save announcement:", e);
      if (e instanceof Error) {
        setNotification({ message: `Gagal menyimpan pengumuman: ${e.message}`, type: 'error' });
      } else {
        setNotification({ message: 'Gagal menyimpan pengumuman. Silakan coba lagi.', type: 'error' });
      }
    }
  };

  // Fungsi helper untuk mendapatkan kelas warna status
  const getStatusColorClass = (status: string) => {
    if (status === 'Published') {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
    return 'bg-amber-100 text-amber-800 border-amber-200';
  };

  const getStatusDot = (status: string) => {
    if (status === 'Published') {
      return 'bg-emerald-500';
    }
    return 'bg-amber-500';
  };

  return (
    <Layout setNotification={setNotification}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <SpeakerWaveIcon className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Manajemen Pengumuman</h1>
                  <p className="text-gray-600 mt-1">Kelola dan publikasikan pengumuman penting</p>
                </div>
              </div>
              <button
                onClick={() => handleAddEdit()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <PlusIcon className="h-5 w-5" />
                Tambah Pengumuman
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                  <p className="text-gray-600 font-medium">Memuat data pengumuman...</p>
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
                        Pengumuman
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Konten
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Tanggal Publikasi
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {announcements.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-gray-100 rounded-full">
                              <SpeakerWaveIcon className="h-12 w-12 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-gray-900 font-semibold text-lg">Belum ada pengumuman</p>
                              <p className="text-gray-500 mt-1">Mulai dengan menambahkan pengumuman pertama Anda</p>
                            </div>
                            <button
                              onClick={() => handleAddEdit()}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors duration-200"
                            >
                              <PlusIcon className="h-4 w-4" />
                              Tambah Pengumuman
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      announcements.map((item, index) => (
                        <tr key={item.id || `announcement-${index}`} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <p className="text-sm font-semibold text-gray-900 line-clamp-2" title={item.title}>
                                {item.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">ID: {item.id}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-700 max-w-xs truncate" title={item.content}>
                              {item.content}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <p className="text-sm text-gray-700 font-medium">
                                {new Date(item.publishDate).toLocaleDateString('id-ID', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(item.publishDate).toLocaleDateString('id-ID', { 
                                  weekday: 'long' 
                                })}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColorClass(item.status)}`}>
                              <span className={`w-2 h-2 rounded-full mr-2 ${getStatusDot(item.status)}`}></span>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleAddEdit(item)} 
                                className="p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 transition-all duration-200" 
                                title="Edit Pengumuman"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteClick(item.id!)} 
                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-200" 
                                title="Hapus Pengumuman"
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
        <AnnouncementFormModal
          announcement={currentAnnouncement}
          onSave={handleSaveAnnouncement}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Confirmation Modal for Delete */}
      <CustomModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Konfirmasi Penghapusan"
        message="Apakah Anda yakin ingin menghapus pengumuman ini secara permanen?"
        confirmText="Hapus Pengumuman"
        cancelText="Batal"
        type="confirm"
      />
    </Layout>
  );
};

export default AnnouncementsPage;