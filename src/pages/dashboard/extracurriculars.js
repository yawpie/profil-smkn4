// src/pages/dashboard/extracurriculars.js
"use client";

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Dashboard/Layout';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ExtracurricularFormModal from '../../components/Dashboard/ExtracurricularFormModal';

const ExtracurricularsPage = () => {
  const [extracurriculars, setExtracurriculars] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExtracurricular, setCurrentExtracurricular] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true); // Tambah state loading
  const [error, setError] = useState(null);     // Tambah state error

  // Fungsi untuk mengambil data ekstrakurikuler dari API
  const fetchExtracurriculars = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/extracurriculars'); // Fetch dari API Route Anda
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setExtracurriculars(data);
    } catch (e) {
      console.error("Failed to fetch extracurriculars:", e);
      setError("Gagal memuat data ekstrakurikuler. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExtracurriculars(); // Panggil fetchExtracurriculars saat komponen pertama kali dimuat
  }, []);

  const handleAddEdit = (extracurricular = null) => {
    setCurrentExtracurricular(extracurricular);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus ekstrakurikuler ini?')) {
      try {
        const response = await fetch(`/api/extracurriculars?id=${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await response.json(); // Konsumsi respons
        setNotification({ message: 'Ekstrakurikuler berhasil dihapus!', type: 'success' });
        fetchExtracurriculars(); // Ambil ulang data setelah penghapusan
      } catch (e) {
        console.error("Failed to delete extracurricular:", e);
        setNotification({ message: `Gagal menghapus ekstrakurikuler: ${e.message}`, type: 'error' });
      }
    }
  };

  const handleSaveExtracurricular = async (newExtracurricular) => {
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
      await response.json(); // Konsumsi respons
      setNotification({ message: `Ekstrakurikuler berhasil ${newExtracurricular.id ? 'diperbarui' : 'ditambahkan'}!`, type: 'success' });
      setIsModalOpen(false);
      setCurrentExtracurricular(null);
      fetchExtracurriculars(); // Ambil ulang data setelah disimpan
    } catch (e) {
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
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
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
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
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
      <ExtracurricularFormModal
        extracurricular={currentExtracurricular}
        onSave={handleSaveExtracurricular}
        onClose={() => setIsModalOpen(false)}
      />
    )}
  </div>
</Layout>

  );
};

export default ExtracurricularsPage;