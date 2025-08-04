"use client";

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Dashboard/Layout';
import AdminProfileFormModal from '../../components/Dashboard/AdminProfileFormModal';
import { PencilIcon, UserCircleIcon, IdentificationIcon, EnvelopeIcon, PhoneIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import type { AdminProfile } from '@/types/AdminProfile';
import type { Notification } from '@/types/Notification';

type DetailItemProps = {
  label: string;
  value: string;
  icon?: React.ElementType;
  color?: string;
};

const DetailItem: React.FC<DetailItemProps> = ({ label, value, icon: Icon, color = 'from-gray-50 to-white' }) => (
  <div className={`rounded-lg bg-gradient-to-br ${color} p-4 shadow-md border border-gray-100 flex items-start space-x-3 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]`}>
    {Icon && (
      <div className="flex-shrink-0 p-1.5 rounded-full bg-blue-500/10 text-blue-700 shadow-inner">
        <Icon className="h-5 w-5" />
      </div>
    )}
    <div>
      <div className="text-xs text-gray-600 mb-0.5 font-medium">{label}</div>
      <div className="text-base font-semibold text-gray-900 break-words">{value}</div>
    </div>
  </div>
);

const AdminProfilePage: React.FC = () => {
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulasi fetching data dari API, ganti ini dengan fetch('/api/admin-profile') di masa depan
        const dataProfile: AdminProfile = {
          id: '1',
          name: 'Bayu Prakoso',
          email: 'admin@sekolah.sch.id',
          phone: '0812-3456-7890',
          role: 'Administrator Utama',
          profileImage: 'https://i.pravatar.cc/300?img=50',
        };
        setAdminProfile(dataProfile);
      } catch (err: unknown) { // Ganti 'any' dengan 'unknown'
        console.error("Error fetching admin profile:", err);
        if (err instanceof Error) {
            setError(`Gagal memuat profil admin. Detail: ${err.message}`);
        } else {
            setError("Gagal memuat profil admin. Silakan coba lagi.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleSaveProfile = (updatedProfile: AdminProfile) => {
    try {
      // PERHATIAN: Ini masih simulasi. Di aplikasi nyata, Anda akan melakukan fetch ke API di sini
      // Misalnya: const response = await fetch('/api/admin-profile', { method: 'PUT', body: JSON.stringify(updatedProfile), ... });
      
      // Jika Anda ingin menguji error, Anda bisa menambahkan throw di sini
      // Contoh: throw new Error("Gagal menyimpan data ke API");
      
      setAdminProfile(updatedProfile);
      setNotification({ message: 'Profil admin berhasil diperbarui!', type: 'success' });
    } catch (err: unknown) { // Ganti 'any' dengan 'unknown'
      console.error("Error saving admin profile:", err);
      if (err instanceof Error) {
        setNotification({ message: `Gagal memperbarui profil: ${err.message}`, type: 'error' });
      } else {
        setNotification({ message: 'Gagal memperbarui profil. Silakan coba lagi.', type: 'error' });
      }
    } finally {
      setIsModalOpen(false); // Tutup modal di finally block
    }
  };

  if (loading) {
    return (
      <Layout setNotification={setNotification}>
        <div className="bg-white rounded-xl shadow-lg p-8 text-center text-blue-700 font-semibold flex items-center justify-center min-h-[200px] animate-pulse font-sans">
          <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-base">Memuat data profil...</span>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout setNotification={setNotification}>
        <div className="bg-red-50 rounded-xl shadow-lg p-8 text-center text-red-700 font-semibold border border-red-200 flex flex-col items-center justify-center min-h-[200px] font-sans">
          <ExclamationCircleIcon className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-5 py-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 shadow-md text-base"
          >
            Coba Lagi
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout setNotification={setNotification}>
      <div className="bg-white rounded-xl shadow-xl p-6 animate-fade-in max-w-6xl mx-auto mt-4 border border-gray-100 font-sans">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-3 border-b border-gray-100">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3 sm:mb-0">
            Profil Admin 🚀
          </h1>
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm"
          >
            <PencilIcon className="h-4 w-4" />
            Edit Profil
          </button>
        </div>

        {adminProfile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-xl p-6 border border-blue-100 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("/images/pattern-blue.svg")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>

              <div className="relative z-10 flex flex-col items-center">
                <img
                  src={adminProfile.profileImage || 'https://images.unsplash.com/photo-1586348902889-437aa5a670fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fG5vJTIwaW1hZ2V8ZW58MHx8MHx8&auto=format&fit=crop&w=300&h=300&q=70'}
                  alt="Foto Profil Admin"
                  className="w-32 h-32 rounded-full object-cover border-3 border-white shadow-lg mb-4 transition-transform duration-300 hover:scale-105 ring-3 ring-blue-300/50"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1586348902889-437aa5a670fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fG5vJTIwaW1hZ2V8ZW58MHx8MHx8&auto=format&fit=crop&w=300&h=300&q=70';
                  }}
                />
                <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">{adminProfile.name}</h2>
                <p className="text-base text-blue-700 font-semibold mb-3 text-center">{adminProfile.role}</p>
                <button
                  onClick={handleEdit}
                  className="mt-3 flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-all duration-200 shadow-md text-xs"
                  aria-label="Edit Foto Profil"
                >
                  <PencilIcon className="h-3.5 w-3.5" />
                  Ganti Foto
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
                Informasi Detail 📋
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <DetailItem label="Nama Lengkap" value={adminProfile.name} icon={IdentificationIcon} color="from-blue-50 to-blue-100" />
                <DetailItem label="Email" value={adminProfile.email} icon={EnvelopeIcon} color="from-purple-50 to-purple-100" />
                <DetailItem label="Telepon" value={adminProfile.phone || '-'} icon={PhoneIcon} color="from-green-50 to-green-100" />
                <DetailItem label="Jabatan" value={adminProfile.role} icon={UserCircleIcon} color="from-yellow-50 to-yellow-100" />
              </div>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && adminProfile && (
        <AdminProfileFormModal
          adminProfile={adminProfile}
          onSave={handleSaveProfile}
          onClose={() => setIsModalOpen(false)}
          setNotification={setNotification}
        />
      )}
    </Layout>
  );
};

export default AdminProfilePage;