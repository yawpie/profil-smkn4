"use client";

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Dashboard/Layout';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import TeacherFormModal from '../../components/Dashboard/TeacherFormModal';
import type { Teacher } from '@/types/Teacher';
import type { Notification } from '@/types/Notification';

const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch teacher data from the API
  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/teachers');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui dari server.' }));
        // Gunakan pesan error dari backend jika ada, jika tidak, pakai pesan status
        const errorMessage = `HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`;
        setNotification({ message: errorMessage, type: 'error' });
        throw new Error(errorMessage); // Tetap throw untuk menonaktifkan loading dan menampilkan error di halaman
      }
      const data: Teacher[] = await response.json();
      setTeachers(data);
    } catch (e: unknown) { // Ganti 'any' dengan 'unknown' untuk type safety
      console.error("Failed to fetch teachers:", e);
      if (e instanceof Error) {
        setError(`Gagal memuat data guru. Detail: ${e.message}`);
      } else {
        setError("Gagal memuat data guru. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddEdit = (teacher: Teacher | null = null) => {
    setCurrentTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data guru ini?')) {
      try {
        const response = await fetch(`/api/teachers?id=${id}`, {
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
        setNotification({ message: 'Data guru berhasil dihapus!', type: 'success' });
        fetchTeachers();
      } catch (e: unknown) { // Ganti 'any' dengan 'unknown'
        console.error("Failed to delete teacher:", e);
        if (e instanceof Error) {
          setNotification({ message: `Gagal menghapus guru: ${e.message}`, type: 'error' });
        } else {
          setNotification({ message: 'Gagal menghapus guru. Silakan coba lagi.', type: 'error' });
        }
      }
    }
  };

  const handleSaveTeacher = async (newTeacher: Teacher) => {
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
        const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui.' }));
        let errorMessage = `HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`;

        // Cek apakah error 413, lalu berikan pesan yang lebih jelas
        if (response.status === 413) {
          errorMessage = "Gagal menyimpan guru. Ukuran gambar terlalu besar. Silakan pilih gambar yang lebih kecil.";
        }

        setNotification({ message: errorMessage, type: 'error' });
        console.error('Backend Error Response for SAVE:', errorData);
        return; // Hentikan eksekusi
      }
      await response.json();
      setNotification({ message: `Data guru berhasil ${newTeacher.id ? 'diperbarui' : 'ditambahkan'}!`, type: 'success' });
      setIsModalOpen(false);
      setCurrentTeacher(null);
      fetchTeachers();
    } catch (e: unknown) { // Ganti 'any' dengan 'unknown'
      console.error("Failed to save teacher:", e);
      if (e instanceof Error) {
        setNotification({ message: `Gagal menyimpan guru: ${e.message}`, type: 'error' });
      } else {
        setNotification({ message: 'Gagal menyimpan guru. Silakan coba lagi.', type: 'error' });
      }
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
                    <td colSpan={6} className="px-6 py-6 text-center text-gray-500">Belum ada data guru.</td>
                  </tr>
                ) : (
                  teachers.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50 transition-colors duration-100">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.name}</td>
                      <td className="px-6 py-4">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-10 w-10 rounded-full object-cover border border-blue-200 shadow"
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = 'https://images.unsplash.com/photo-1586348902889-437aa5a670fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fG5vJTIwaW1hZ2V8ZW58MHx8MHx8&auto=format&fit=crop&w=40&h=40&q=70'; // Fallback Unsplash
                            }}
                          />
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
                            onClick={() => handleDelete(item.id!)}
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