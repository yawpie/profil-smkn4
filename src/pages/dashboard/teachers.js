// src/pages/dashboard/teachers.js
"use client";

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Dashboard/Layout';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import TeacherFormModal from '../../components/Dashboard/TeacherFormModal';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil data guru dari API
  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/teachers');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTeachers(data);
    } catch (e) {
      console.error("Failed to fetch teachers:", e);
      setError("Gagal memuat data guru. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []); // Panggil fetchTeachers saat komponen pertama kali dimuat

  const handleAddEdit = (teacher = null) => {
    setCurrentTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus data guru ini?')) {
      try {
        const response = await fetch(`/api/teachers?id=${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await response.json();
        setNotification({ message: 'Data guru berhasil dihapus!', type: 'success' });
        fetchTeachers(); // Ambil ulang data setelah penghapusan
      } catch (e) {
        console.error("Failed to delete teacher:", e);
        setNotification({ message: `Gagal menghapus guru: ${e.message}`, type: 'error' });
      }
    }
  };

  const handleSaveTeacher = async (newTeacher) => {
    try {
      const method = newTeacher.id ? 'PUT' : 'POST';
      const response = await fetch('/api/teachers', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTeacher),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      setNotification({ message: `Data guru berhasil ${newTeacher.id ? 'diperbarui' : 'ditambahkan'}!`, type: 'success' });
      setIsModalOpen(false);
      setCurrentTeacher(null);
      fetchTeachers(); // Ambil ulang data setelah disimpan
    } catch (e) {
      console.error("Failed to save teacher:", e);
      setNotification({ message: `Gagal menyimpan guru: ${e.message}`, type: 'error' });
    }
  };

  return (
      <Layout setNotification={setNotification}>
      <div className="bg-gradient-to-b from-white to-blue-50 rounded-2xl shadow-xl p-8 animate-fade-in max-w-6xl mx-auto mt-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 tracking-wide">
            🧑‍🏫 Manajemen Guru
          </h1>
          <button
            onClick={() => handleAddEdit()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all duration-200 shadow-md"
          >
            <PlusIcon className="h-5 w-5" />
            Tambah Guru
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-600 py-8">Memuat data guru...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Foto</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Mapel</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">NIP</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Jabatan</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-blue-800 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {teachers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-6 text-center text-gray-500">Belum ada data guru.</td>
                  </tr>
                ) : (
                  teachers.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50 transition-colors duration-100">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.name}</td>
                      <td className="px-6 py-4">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-10 w-10 rounded-full object-cover border border-blue-200 shadow" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
                            No Img
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.subject}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.nip}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.position}</td>
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleAddEdit(item)}
                            className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200"
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
          <TeacherFormModal
            teacher={currentTeacher}
            onSave={handleSaveTeacher}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </Layout>

  );
};

export default TeachersPage;