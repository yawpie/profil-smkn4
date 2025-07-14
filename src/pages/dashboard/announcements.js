// src/pages/dashboard/announcements.js
"use client";

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Dashboard/Layout';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import AnnouncementFormModal from '../../components/Dashboard/AnnouncementFormModal';

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true); // Tambah state loading
  const [error, setError] = useState(null);     // Tambah state error

  // Fungsi untuk mengambil data pengumuman dari API
  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/announcements'); // Fetch dari API Route Anda
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAnnouncements(data);
    } catch (e) {
      console.error("Failed to fetch announcements:", e);
      setError("Gagal memuat data pengumuman. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements(); // Panggil fetchAnnouncements saat komponen pertama kali dimuat
  }, []);

  const handleAddEdit = (announcement = null) => {
    setCurrentAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
      try {
        const response = await fetch(`/api/announcements?id=${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await response.json();
        setNotification({ message: 'Pengumuman berhasil dihapus!', type: 'success' });
        fetchAnnouncements(); // Ambil ulang data setelah penghapusan
      } catch (e) {
        console.error("Failed to delete announcement:", e);
        setNotification({ message: `Gagal menghapus pengumuman: ${e.message}`, type: 'error' });
      }
    }
  };

  const handleSaveAnnouncement = async (newAnnouncement) => {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      setNotification({ message: `Pengumuman berhasil ${newAnnouncement.id ? 'diperbarui' : 'ditambahkan'}!`, type: 'success' });
      setIsModalOpen(false);
      setCurrentAnnouncement(null);
      fetchAnnouncements(); // Ambil ulang data setelah disimpan
    } catch (e) {
      console.error("Failed to save announcement:", e);
      setNotification({ message: `Gagal menyimpan pengumuman: ${e.message}`, type: 'error' });
    }
  };

  return (
    <Layout setNotification={setNotification}>
    <div className="p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
        <span>📢</span>
        <span className="text-blue-700">Manajemen Pengumuman</span>
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
                    <td colSpan="5" className="px-6 py-6 text-center text-gray-500 bg-gray-50">
                      Belum ada data pengumuman.
                    </td>
                  </tr>
                ) : (
                  announcements.map((item, index) => (
                    <tr
                      key={item.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 line-clamp-2">{item.content}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {item.publishDate}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            item.status === "Published"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.status}
                        </span>
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
                            onClick={() => handleDelete(item.id)}
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
    </div>
    </Layout>
  );
};

export default AnnouncementsPage;