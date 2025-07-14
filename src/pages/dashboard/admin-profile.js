"use client";

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Dashboard/Layout';
import { PencilIcon } from '@heroicons/react/24/outline';
import AdminProfileFormModal from '../../components/Dashboard/AdminProfileFormModal';

const DetailItem = ({ label, value, color = 'from-gray-100 to-white' }) => (
    <div className={`rounded-xl bg-gradient-to-br ${color} p-4 shadow-inner border border-gray-200`}>
      <div className="text-sm text-gray-600 mb-1 font-medium">{label}</div>
      <div className="text-lg font-semibold text-gray-900">{value}</div>
    </div>
  );  
  
const AdminProfilePage = () => {
  const [adminProfile, setAdminProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const dummyProfile = {
          id: 1,
          name: 'Bayu Prakoso',
          email: 'admin@sekolah.sch.id',
          phone: '081234567890',
          role: 'Administrator Utama',
          profileImage: 'https://i.pravatar.cc/150?img=50',
        };
        setAdminProfile(dummyProfile);
      } catch (err) {
        console.error("Error fetching admin profile:", err);
        setError("Gagal memuat profil admin.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleSaveProfile = async (updatedProfile) => {
    try {
      setAdminProfile(updatedProfile);
      setNotification({ message: 'Profil admin berhasil diperbarui!', type: 'success' });
    } catch (err) {
      console.error("Error saving admin profile:", err);
      setNotification({ message: `Gagal memperbarui profil: ${err.message}`, type: 'error' });
    } finally {
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return (
      <Layout setNotification={setNotification}>
        <div className="bg-white rounded-lg shadow-md p-6 text-center animate-fade-in">
          Memuat data profil...
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout setNotification={setNotification}>
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-red-600 animate-fade-in">
          {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout setNotification={setNotification}>
      <div className="bg-gradient-to-b from-white to-blue-50 rounded-2xl shadow-xl p-8 animate-fade-in max-w-5xl mx-auto mt-6">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-blue-800 tracking-wide">
            👤 Profil Admin
          </h1>
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all duration-200 shadow-md"
          >
            <PencilIcon className="h-5 w-5" />
            Edit Profil
          </button>
        </div>

        {adminProfile && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Foto Profil */}
            <div className="flex flex-col items-center bg-white rounded-2xl shadow-inner p-6">
              <img
                src={adminProfile.profileImage || 'https://via.placeholder.com/150?text=Admin'}
                alt="Foto Profil Admin"
                className="w-36 h-36 rounded-full object-cover border-4 border-blue-200 shadow-lg mb-4 transition-transform hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/150?text=No+Img';
                }}
              />
              <h2 className="text-xl font-semibold text-gray-800">{adminProfile.name}</h2>
              <p className="text-sm text-blue-600 mt-1">{adminProfile.role}</p>
            </div>

            {/* Detail Profil */}
            <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-800 mb-6 border-b border-blue-100 pb-3">
                📝 Biodata Lengkap
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <DetailItem label="Nama Lengkap" value={adminProfile.name} color="from-blue-100 to-blue-50" />
                <DetailItem label="Email" value={adminProfile.email} color="from-purple-100 to-purple-50" />
                <DetailItem label="Telepon" value={adminProfile.phone || '-'} color="from-yellow-100 to-yellow-50" />
                <DetailItem label="Jabatan" value={adminProfile.role} color="from-green-100 to-green-50" />
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
