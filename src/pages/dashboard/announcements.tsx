"use client";

import React, { useState, useEffect, FC } from 'react';
import Layout from '../../components/Dashboard/Layout';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import AnnouncementFormModal from '../../components/Dashboard/AnnouncementFormModal';
import { Announcement } from '@/types/Announcement';
import type { Notification } from '@/types/Notification';

interface CustomModalProps {
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

  const bgColor = type === 'error' ? 'bg-red-100' : type === 'confirm' ? 'bg-yellow-100' : 'bg-blue-100';
  const textColor = type === 'error' ? 'text-red-800' : type === 'confirm' ? 'text-yellow-800' : 'text-blue-800';
  const buttonConfirmBg = type === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in-up relative ${bgColor} border ${type === 'error' ? 'border-red-200' : type === 'confirm' ? 'border-yellow-200' : 'border-blue-200'}`}>
        <h3 className={`text-xl font-bold mb-4 ${textColor}`}>{title}</h3>
        <p className={`text-gray-700 mb-6 ${textColor}`}>{message}</p>
        <div className="flex justify-end space-x-3">
          {type === 'confirm' && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm || onClose}
            className={`px-5 py-2 rounded-lg text-white font-medium transition shadow ${buttonConfirmBg}`}
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
  // State isErrorModalOpen dan errorModalMessage bisa dihapus, karena kita akan menggunakan notifikasi
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [errorModalMessage, setErrorModalMessage] = useState<string>('');


  // Function to fetch announcement data from API
  const fetchAnnouncements = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/announcements');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui dari server.' }));
        const errorMessage = `HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`;
        setNotification({ message: errorMessage, type: 'error' });
        throw new Error(errorMessage); // Ini akan menangani error di `catch` block di bawah
      }
      const data: Announcement[] = await response.json();
      setAnnouncements(data);
    } catch (e: unknown) { // Gunakan 'unknown' untuk type safety
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
        return; // Hentikan eksekusi
      }
      await response.json();
      setNotification({ message: 'Pengumuman berhasil dihapus!', type: 'success' });
      fetchAnnouncements();
    } catch (e: unknown) { // Gunakan 'unknown' untuk type safety
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

        // Cek apakah error 413, lalu berikan pesan yang lebih jelas
        if (response.status === 413) {
          errorMessage = "Gagal menyimpan pengumuman. Ukuran gambar terlalu besar. Silakan pilih gambar yang lebih kecil.";
        }
        
        setNotification({ message: errorMessage, type: 'error' });
        console.error('Backend Error Response for SAVE:', errorData);
        return; // Hentikan eksekusi
      }
      await response.json();
      setNotification({ message: `Pengumuman berhasil ${newAnnouncement.id ? 'diperbarui' : 'ditambahkan'}!`, type: 'success' });
      setIsModalOpen(false);
      setCurrentAnnouncement(null);
      fetchAnnouncements();
    } catch (e: unknown) { // Ganti 'any' dengan 'unknown'
      console.error("Failed to save announcement:", e);
      if (e instanceof Error) {
        setNotification({ message: `Gagal menyimpan pengumuman: ${e.message}`, type: 'error' });
      } else {
        setNotification({ message: 'Gagal menyimpan pengumuman. Silakan coba lagi.', type: 'error' });
      }
    }
  };

  return (
    <Layout setNotification={setNotification}>
      <div className="p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <span>📢</span>
            <span className="text-3xl font-bold text-blue-800 tracking-wide">Manajemen Pengumuman</span>
          </h1>

          <button
            onClick={() => handleAddEdit()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all shadow-md"
          >
            <PlusIcon className="h-5 w-5" />
            Tambah Pengumuman
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-600 text-sm">Memuat data pengumuman...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md">
              <thead className="bg-blue-100 text-blue-800 uppercase text-xs font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Judul</th>
                  <th className="px-6 py-3 text-left">Konten</th>
                  <th className="px-6 py-3 text-left">Tanggal Publikasi</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {announcements.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-6 text-center text-gray-500 bg-gray-50">
                      Belum ada data pengumuman.
                    </td>
                  </tr>
                ) : (
                  announcements.map((item, index) => (
                    <tr
                      key={item.id || `announcement-${index}`}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 line-clamp-2">{item.content}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {item.publishDate}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {/* Status logic needs to be implemented */}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleAddEdit(item)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item.id!)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition"
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
          confirmText="Hapus"
          cancelText="Batal"
          type="confirm"
        />

        {/* Error Modal */}
        {/* Hapus CustomModal ini, karena kita akan menggunakan setNotification yang sudah terintegrasi dengan Layout */}
      </div>
    </Layout>
  );
};

export default AnnouncementsPage;