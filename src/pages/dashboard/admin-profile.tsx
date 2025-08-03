// src/pages/dashboard/admin-profile/index.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Dashboard/Layout';
import AdminProfileFormModal from '../../components/Dashboard/AdminProfileFormModal';
import { PencilIcon, UserCircleIcon, IdentificationIcon, EnvelopeIcon, PhoneIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'; // Pastikan ExclamationCircleIcon diimpor juga
import type { AdminProfile } from '@/types/AdminProfile';
import type { Notification } from '@/types/Notification';

// --- Komponen DetailItem dengan Peningkatan UI ---
type DetailItemProps = {
  label: string;
  value: string;
  icon?: React.ElementType; // Tambahkan prop ikon
  color?: string; // Prop color tetap ada
};

const DetailItem: React.FC<DetailItemProps> = ({ label, value, icon: Icon, color = 'from-gray-50 to-white' }) => (
  <div className={`rounded-lg bg-gradient-to-br ${color} p-4 shadow-md border border-gray-100 flex items-start space-x-3 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]`}>
    {Icon && (
      <div className="flex-shrink-0 p-1.5 rounded-full bg-blue-500/10 text-blue-700 shadow-inner"> {/* Warna ikon yang lebih premium, ukuran p-1.5 lebih kecil */}
        <Icon className="h-5 w-5" /> {/* Ukuran ikon h-5 w-5 lebih kecil */}
      </div>
    )}
    <div>
      <div className="text-xs text-gray-600 mb-0.5 font-medium">{label}</div> {/* Font label lebih kecil */}
      <div className="text-base font-semibold text-gray-900 break-words">{value}</div> {/* Font value lebih kecil */}
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
        // Simulasi fetching data dari API
        const dataProfile: AdminProfile = {
          id: '1',
          name: 'Bayu Prakoso',
          email: 'admin@sekolah.sch.id',
          phone: '0812-3456-7890',
          role: 'Administrator Utama',
          profileImage: 'https://i.pravatar.cc/300?img=50', // Ukuran gambar lebih besar untuk kualitas
        };
        setAdminProfile(dataProfile);
      } catch (err: any) {
        console.error("Error fetching admin profile:", err);
        setError("Gagal memuat profil admin. Silakan coba lagi.");
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
      setAdminProfile(updatedProfile);
      setNotification({ message: 'Profil admin berhasil diperbarui!', type: 'success' });
    } catch (err: any) {
      console.error("Error saving admin profile:", err);
      setNotification({ message: `Gagal memperbarui profil: ${err.message}`, type: 'error' });
    } finally {
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return (
      <Layout setNotification={setNotification}>
        <div className="bg-white rounded-xl shadow-lg p-8 text-center text-blue-700 font-semibold flex items-center justify-center min-h-[200px] animate-pulse font-sans">
          <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> {/* Ukuran SVG loading lebih kecil */}
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-base">Memuat data profil...</span> {/* Ukuran teks loading lebih kecil */}
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout setNotification={setNotification}>
        <div className="bg-red-50 rounded-xl shadow-lg p-8 text-center text-red-700 font-semibold border border-red-200 flex flex-col items-center justify-center min-h-[200px] font-sans">
          <ExclamationCircleIcon className="h-12 w-12 text-red-500 mb-4" /> {/* Ukuran ikon error lebih kecil */}
          <p className="text-lg">{error}</p> {/* Ukuran teks error lebih kecil */}
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
      <div className="bg-white rounded-xl shadow-xl p-6 animate-fade-in max-w-6xl mx-auto mt-4 border border-gray-100 font-sans"> {/* Padding kontainer utama lebih kecil, shadow, border, dan font-sans */}
        {/* Header Bagian Atas */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-3 border-b border-gray-100"> {/* Margin bawah dan padding bawah lebih kecil */}
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3 sm:mb-0"> {/* Ukuran judul h1 lebih kecil */}
            Profil Admin 🚀
          </h1>
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm"
          >
            <PencilIcon className="h-4 w-4" /> {/* Ukuran ikon tombol lebih kecil */}
            Edit Profil
          </button>
        </div>

        {adminProfile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"> {/* Gap antar kolom lebih kecil */}
            {/* Kolom Kiri: Foto Profil & Info Dasar */}
            <div className="lg:col-span-1 flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-xl p-6 border border-blue-100 relative overflow-hidden"> {/* Padding, shadow, border, dan rounded lebih kecil */}
              {/* Background halus */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("/images/pattern-blue.svg")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>

              <div className="relative z-10 flex flex-col items-center">
                <img
                  src={adminProfile.profileImage || 'https://via.placeholder.com/200?text=Admin'}
                  alt="Foto Profil Admin"
                  className="w-32 h-32 rounded-full object-cover border-3 border-white shadow-lg mb-4 transition-transform duration-300 hover:scale-105 ring-3 ring-blue-300/50" // Ukuran gambar, border, shadow, ring lebih kecil
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image'; // Ukuran placeholder lebih kecil
                  }}
                />
                <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">{adminProfile.name}</h2> {/* Ukuran judul h2 lebih kecil */}
                <p className="text-base text-blue-700 font-semibold mb-3 text-center">{adminProfile.role}</p> {/* Ukuran teks p lebih kecil */}
                <button
                  onClick={handleEdit}
                  className="mt-3 flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-all duration-200 shadow-md text-xs" // Ukuran tombol dan teks tombol lebih kecil
                  aria-label="Edit Foto Profil"
                >
                  <PencilIcon className="h-3.5 w-3.5" /> {/* Ukuran ikon tombol lebih kecil */}
                  Ganti Foto
                </button>
              </div>
            </div>

            {/* Kolom Kanan: Detail Profil */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-xl"> {/* Padding, rounded, shadow lebih kecil */}
              <h3 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200"> {/* Ukuran judul h3 dan margin bawah lebih kecil */}
                Informasi Detail 📋
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5"> {/* Gap antar detail item lebih kecil */}
                <DetailItem label="Nama Lengkap" value={adminProfile.name} icon={IdentificationIcon} color="from-blue-50 to-blue-100" />
                <DetailItem label="Email" value={adminProfile.email} icon={EnvelopeIcon} color="from-purple-50 to-purple-100" />
                <DetailItem label="Telepon" value={adminProfile.phone || '-'} icon={PhoneIcon} color="from-green-50 to-green-100" />
                <DetailItem label="Jabatan" value={adminProfile.role} icon={UserCircleIcon} color="from-yellow-50 to-yellow-100" />
              </div>

              {/* Bagian Tambahan untuk Informasi Lain (Opsional) */}
              <div className="mt-8 pt-6 border-t border-gray-100"> {/* Margin atas dan padding atas lebih kecil */}
                <h3 className="text-xl font-bold text-gray-800 mb-5"> {/* Ukuran judul h3 lebih kecil */}
                  Pengaturan Akun ⚙️
                </h3>
                <p className="text-gray-600 text-sm mb-4"> {/* Ukuran teks p lebih kecil */}
                  Anda dapat memperbarui informasi pribadi dan keamanan akun Anda di sini.
                  Pastikan data Anda selalu terkini.
                </p>
                <div className="flex flex-wrap gap-3"> {/* Gap antar tombol lebih kecil */}
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-full hover:bg-gray-200 transition-all duration-200 shadow-sm text-xs border border-gray-200"> {/* Ukuran tombol dan teks tombol lebih kecil */}
                    Ubah Kata Sandi
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-full hover:bg-gray-200 transition-all duration-200 shadow-sm text-xs border border-gray-200"> {/* Ukuran tombol dan teks tombol lebih kecil */}
                    Manajemen Peran
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <AdminProfileFormModal
          adminProfile={adminProfile}
          onSave={handleSaveProfile}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Layout>
  );
};

export default AdminProfilePage;