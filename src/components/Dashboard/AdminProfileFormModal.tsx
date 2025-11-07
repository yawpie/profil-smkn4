// components/AdminProfileFormModal.tsx
import React, { useState, useEffect, FC, ChangeEvent, FormEvent, Dispatch, SetStateAction } from 'react';
import type { AdminProfile } from '@/types/AdminProfile';
import type { Notification } from '@/types/Notification';
// import { useRouter } from 'next/router'; // Menggunakan useRouter untuk navigasi
import Image from 'next/image';

// --- Komponen Modal Ubah Kata Sandi (Contoh Dummy) ---
type ChangePasswordModalProps = {
  onClose: () => void;
  setNotification: Dispatch<SetStateAction<Notification | null>>;
};

const ChangePasswordModal: FC<ChangePasswordModalProps> = ({ onClose, setNotification }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmNewPassword) {
            setError('Kata sandi baru dan konfirmasi kata sandi tidak cocok.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Kata sandi baru minimal 6 karakter.');
            return;
        }

        setIsLoading(true);
        try {
            // --- Implementasi API Anda di sini ---
            // Contoh: Panggil API untuk mengubah kata sandi
            // const response = await fetch('/api/change-password', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ currentPassword, newPassword }),
            // });

            // if (!response.ok) {
            //     const errorData = await response.json();
            //     throw new Error(errorData.message || 'Gagal mengubah kata sandi.');
            // }

            // Simulasi sukses
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setNotification({ message: "Kata sandi berhasil diubah!", type: "success" });
            onClose();
        } catch (err: unknown) {
            if (err instanceof Error) {
              console.error(err.message);
            } else {
              console.error(String(err));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs p-5 animate-fade-in-up relative">
                <h2 className="text-lg font-extrabold text-blue-800 mb-4 text-center">Ubah Kata Sandi</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-1">Kata Sandi Lama</label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 px-3 py-1.5 text-gray-800 shadow-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-1">Kata Sandi Baru</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 px-3 py-1.5 text-gray-800 shadow-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmNewPassword" className="block text-sm font-semibold text-gray-700 mb-1">Konfirmasi Kata Sandi Baru</label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 px-3 py-1.5 text-gray-800 shadow-sm"
                            required
                        />
                    </div>
                    {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                    <div className="flex justify-end gap-2 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 shadow-sm text-sm"
                            disabled={isLoading}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-1.5 rounded-xl bg-blue-700 text-white hover:bg-blue-800 font-semibold shadow-lg transform hover:scale-105 text-sm"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Mengubah...' : 'Ubah Kata Sandi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
// --- Akhir Komponen Modal Ubah Kata Sandi ---


// Perbaikan pada AdminProfileFormModalProps: Menambahkan `setNotification`
type AdminProfileFormModalProps = {
  adminProfile: AdminProfile | null;
  onSave: (profile: AdminProfile) => void;
  onClose: () => void;
  setNotification: Dispatch<SetStateAction<Notification | null>>; // Ini adalah baris yang diperbaiki
};

const AdminProfileFormModal: FC<AdminProfileFormModalProps> = ({ adminProfile, onSave, onClose, setNotification }) => {
  const [formData, setFormData] = useState<AdminProfile>({
    name: '',
    email: '',
    phone: '',
    role: '',
    profileImage: '',
  });
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showChangePasswordModal, setShowChangePasswordModal] = useState<boolean>(false); // State untuk modal kata sandi
  const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB in bytes

  useEffect(() => {
    if (adminProfile) {
      setFormData(adminProfile);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: '',
        profileImage: '',
      });
    }
  }, [adminProfile]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        setErrorMessage(`Ukuran gambar maksimal adalah ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB.`);
        setShowErrorModal(true);
        e.target.value = '';
        setFormData(prev => ({ ...prev, profileImage: '' }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, profileImage: '' }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) {
      setErrorMessage('Nama, Email, dan Jabatan wajib diisi!');
      setShowErrorModal(true);
      return;
    }
    onSave({ ...formData, id: adminProfile?.id });
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs p-5 animate-fade-in-up transform transition-all duration-300 scale-100 opacity-100 relative">
          <h2 className="text-lg font-extrabold text-blue-800 mb-4 text-center">Edit Profil Admin</h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-3 py-1.5 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-3 py-1.5 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">Telepon <span className="text-gray-500 font-normal">(Opsional)</span></label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-3 py-1.5 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-1">Jabatan / Peran</label>
              <input
                id="role"
                name="role"
                type="text"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-3 py-1.5 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
                required
              />
            </div>

            {/* Profile Image File Upload */}
            <div>
              <label htmlFor="profileImage" className="block text-sm font-semibold text-gray-700 mb-1">Unggah Gambar Profil</label>
              <input
                id="profileImage"
                name="profileImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-3 py-1.5 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">Maksimal {MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB</p>
            </div>

            {/* Preview */}
            {formData.profileImage && (
              <div className="mt-2 flex justify-center">
                <Image
                  src={formData.profileImage}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded-full border-4 border-blue-200 shadow-lg transition transform hover:scale-105 duration-200"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://placehold.co/80x80/e0e0e0/555555?text=File+Invalid';
                  }}
                />
              </div>
            )}

            {/* Tombol Ubah Kata Sandi */}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => setShowChangePasswordModal(true)}
                className="w-full px-4 py-2 rounded-xl bg-yellow-500 text-white hover:bg-yellow-600 font-semibold transition duration-200 ease-in-out shadow-lg text-sm"
              >
                Ubah Kata Sandi
              </button>
            </div>

            {/* Buttons for Save and Cancel */}
            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition duration-200 ease-in-out shadow-sm text-sm"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-blue-700 text-white hover:bg-blue-800 font-semibold transition duration-200 ease-in-out shadow-lg transform hover:scale-105 text-sm"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>

        {/* Custom Error Modal */}
        {showErrorModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-xs w-full text-center animate-fade-in-up">
              <p className="text-lg font-bold text-red-700 mb-4">{errorMessage}</p>
              <button
                onClick={handleCloseErrorModal}
                className="px-6 py-2.5 bg-red-700 text-white rounded-lg hover:bg-red-800 transition duration-200 ease-in-out shadow-md"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Ubah Kata Sandi */}
      {showChangePasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowChangePasswordModal(false)}
          setNotification={setNotification} // Meneruskan setNotification ke modal kata sandi
        />
      )}
    </>
  );
};

export default AdminProfileFormModal;