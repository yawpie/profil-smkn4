// components/AdminProfileFormModal.tsx
import React, { useState, useEffect, FC, ChangeEvent, FormEvent } from 'react';
import type { AdminProfile } from '@/types/AdminProfile';

type AdminProfileFormModalProps = {
  adminProfile: AdminProfile | null;
  onSave: (profile: AdminProfile) => void;
  onClose: () => void;
};

const AdminProfileFormModal: FC<AdminProfileFormModalProps> = ({ adminProfile, onSave, onClose }) => {
  const [formData, setFormData] = useState<AdminProfile>({
    name: '',
    email: '',
    phone: '',
    role: '',
    profileImage: '', // This will now store a Data URL for preview, or an actual URL after upload
  });
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB in bytes

  useEffect(() => {
    if (adminProfile) {
      setFormData(adminProfile);
    } else {
      // Reset form if adminProfile is null (e.g., for creating new)
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
      // Check file size
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        setErrorMessage(`Ukuran gambar maksimal adalah ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB.`);
        setShowErrorModal(true);
        // Clear the file input and preview
        e.target.value = ''; // Resets the file input
        setFormData(prev => ({ ...prev, profileImage: '' })); // Clear preview
        return;
      }

      // Read file as Data URL for immediate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        // In a real application, you would upload this 'file' object to a storage service
        // (e.g., Firebase Storage, AWS S3) and then save the returned URL to formData.profileImage.
        // For this example, we're using the Data URL for preview purposes.
        setFormData(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file); // Converts file to base64 string for preview
    } else {
      // If no file is selected (e.g., user cancels file dialog)
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
    // Ensure id is passed if it exists
    // Note: If profileImage is a Data URL, you'll need to handle its upload
    // to a persistent storage (e.g., Firebase Storage) before saving the profile.
    // For this example, we're passing the Data URL as is.
    onSave({ ...formData, id: adminProfile?.id });
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  return (
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
              type="file" // Changed to file input
              accept="image/*" // Restrict to image files
              onChange={handleFileChange} // Use the new file handler
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-3 py-1.5 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">Maksimal {MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB</p>
          </div>

          {/* Preview */}
          {formData.profileImage && (
            <div className="mt-2 flex justify-center">
              <img
                src={formData.profileImage}
                alt="Preview"
                className="h-20 w-20 object-cover rounded-full border-4 border-blue-200 shadow-lg transition transform hover:scale-105 duration-200"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://placehold.co/80x80/e0e0e0/555555?text=File+Invalid'; // Smaller placeholder
                }}
              />
            </div>
          )}

          {/* Buttons */}
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
  );
};

export default AdminProfileFormModal;
