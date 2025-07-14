// src/pages/dashboard/majors.js
"use client";

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Dashboard/Layout';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import MajorFormModal from '../../components/Dashboard/MajorFormModal';

const MajorsPage = () => {
  const [majors, setMajors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMajor, setCurrentMajor] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMajors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/majors');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMajors(data);
    } catch (e) {
      console.error("Failed to fetch majors:", e);
      setError("Gagal memuat data jurusan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMajors();
  }, []);

  const handleAddEdit = (major = null) => {
    setCurrentMajor(major);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus jurusan ini?')) {
      try {
        const response = await fetch(`/api/majors?id=${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await response.json();
        setNotification({ message: 'Jurusan berhasil dihapus!', type: 'success' });
        fetchMajors();
      } catch (e) {
        console.error("Failed to delete major:", e);
        setNotification({ message: `Gagal menghapus jurusan: ${e.message}`, type: 'error' });
      }
    }
  };

  const handleSaveMajor = async (newMajor) => {
    try {
      const method = newMajor.id ? 'PUT' : 'POST';
      const response = await fetch('/api/majors', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMajor),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      setNotification({ message: `Jurusan berhasil ${newMajor.id ? 'diperbarui' : 'ditambahkan'}!`, type: 'success' });
      setIsModalOpen(false);
      setCurrentMajor(null);
      fetchMajors();
    } catch (e) {
      console.error("Failed to save major:", e);
      setNotification({ message: `Gagal menyimpan jurusan: ${e.message}`, type: 'error' });
    }
  };

  return (
    <Layout setNotification={setNotification}>
      <div className="bg-white rounded-lg shadow-md p-8 animate-fade-in">
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
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
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
                            className="h-12 w-12 rounded-lg object-cover shadow"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
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