"use client";

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Dashboard/Layout';
import { PlusIcon, PencilIcon, TrashIcon, UserGroupIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import StaffFormModal from '../../components/Dashboard/StaffFormModal';
import type { Staff } from '@/types/Staff';
import type { Notification } from '@/types/Notification';

const StaffPage: React.FC = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch staff data from the API
  const fetchStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/staff');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui dari server.' }));
        const errorMessage = `HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`;
        setNotification({ message: errorMessage, type: 'error' });
        throw new Error(errorMessage);
      }
      const data: Staff[] = await response.json();
      setStaffList(data);
    } catch (e: unknown) {
      console.error("Failed to fetch staff:", e);
      if (e instanceof Error) {
        setError(`Gagal memuat data staff. Detail: ${e.message}`);
      } else {
        setError("Gagal memuat data staff. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddEdit = (staff: Staff | null = null) => {
    setCurrentStaff(staff);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data staff ini?')) {
      try {
        const response = await fetch(`/api/staff?id=${id}`, {
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
        setNotification({ message: 'Data staff berhasil dihapus!', type: 'success' });
        fetchStaff();
      } catch (e: unknown) {
        console.error("Failed to delete staff:", e);
        if (e instanceof Error) {
          setNotification({ message: `Gagal menghapus staff: ${e.message}`, type: 'error' });
        } else {
          setNotification({ message: 'Gagal menghapus staff. Silakan coba lagi.', type: 'error' });
        }
      }
    }
  };

  const handleSaveStaff = async (newStaff: Staff) => {
    try {
      const method = newStaff.id ? 'PUT' : 'POST';
      const response = await fetch('/api/staff', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStaff),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui.' }));
        let errorMessage = `HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`;

        if (response.status === 413) {
          errorMessage = "Gagal menyimpan staff. Ukuran gambar terlalu besar. Silakan pilih gambar yang lebih kecil.";
        }

        setNotification({ message: errorMessage, type: 'error' });
        console.error('Backend Error Response for SAVE:', errorData);
        return;
      }
      await response.json();
      setNotification({ message: `Data staff berhasil ${newStaff.id ? 'diperbarui' : 'ditambahkan'}!`, type: 'success' });
      setIsModalOpen(false);
      setCurrentStaff(null);
      fetchStaff();
    } catch (e: unknown) {
      console.error("Failed to save staff:", e);
      if (e instanceof Error) {
        setNotification({ message: `Gagal menyimpan staff: ${e.message}`, type: 'error' });
      } else {
        setNotification({ message: 'Gagal menyimpan staff. Silakan coba lagi.', type: 'error' });
      }
    }
  };

  return (
    <Layout setNotification={setNotification}>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
                  <BriefcaseIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manajemen Staff</h1>
                <p className="text-gray-600 mt-1">Kelola data tenaga administrasi sekolah</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-teal-50 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <UserGroupIcon className="w-5 h-5 text-teal-600" />
                  <span className="text-sm font-medium text-teal-900">
                    Total: {staffList.length} Staff
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => handleAddEdit()}
                className="inline-flex items-center px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200 shadow-sm"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Tambah Staff
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-4"></div>
              <p className="text-gray-600 text-sm">Memuat data staff...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          ) : (
            <>
              {staffList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <BriefcaseIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada data staff</h3>
                  <p className="text-gray-600 text-sm mb-6">Mulai dengan menambahkan staff pertama</p>
                  <button
                    onClick={() => handleAddEdit()}
                    className="inline-flex items-center px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors duration-200"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Tambah Staff Pertama
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Staff
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jabatan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          NIP
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {staffList.map((staff, index) => (
                        <tr 
                          key={staff.id} 
                          className="hover:bg-gray-50 transition-colors duration-150"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                {staff.image ? (
                                  <img
                                    className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                                    src={staff.image}
                                    alt={staff.name}
                                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                      const target = e.target as HTMLImageElement;
                                      target.onerror = null;
                                      target.src = 'https://images.unsplash.com/photo-1586348902889-437aa5a670fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fG5vJTIwaW1hZ2V8ZW58MHx8MHx8&auto=format&fit=crop&w=48&h=48&q=70';
                                    }}
                                  />
                                ) : (
                                  <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                    <BriefcaseIcon className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                                <div className="text-sm text-gray-500">Tenaga Administrasi</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                              {staff.position}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                            {staff.nip}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></div>
                              Aktif
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleAddEdit(staff)}
                                className="inline-flex items-center p-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors duration-150"
                                title="Edit staff"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(staff.id!)}
                                className="inline-flex items-center p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-150"
                                title="Hapus staff"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <StaffFormModal
          staff={currentStaff}
          onSave={handleSaveStaff}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Layout>
  );
};

export default StaffPage;