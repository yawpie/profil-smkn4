// src/components/Dashboard/MajorFormModal.tsx
import React, { useState, useEffect, FC, ChangeEvent, FormEvent } from 'react';
import type { Major } from '@/types/Major'; // Import Major from your centralized types file

type MajorFormModalProps = {
  major: Major | null;
  onSave: (major: Major) => Promise<void>;
  onClose: () => void;
};

// Define a local type for formData to handle potential `null` or `undefined` values for optional fields
// as they appear in the form state before being sent to the API.
type MajorFormData = {
  id: string | null; // ID can be null for new majors
  name: string;
  image: string;
  description: string;
  // slug dihapus dari MajorFormData
};


const MajorFormModal: FC<MajorFormModalProps> = ({ major, onSave, onClose }) => {
  // Initialize formData without slug
  const [formData, setFormData] = useState<MajorFormData>({
    id: major?.id || null, // Use null for initial empty state for ID
    name: major?.name || '',
    image: major?.image || '',
    description: major?.description || '',
    // slug dihapus dari inisialisasi state
  });

  // State for validation errors
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB in bytes

  useEffect(() => {
    // When the 'major' prop changes, update the form data
    if (major) {
      setFormData({
        id: major.id,
        name: major.name,
        image: major.image || '', // Ensure image is a string, even if empty
        description: major.description,
        // slug dihapus dari update state
      });
    } else {
      // Reset form for adding a new major
      setFormData({ id: null, name: '', description: '', image: '' }); // Reset tanpa slug
    }
    setErrorMessage(''); // Clear previous errors on prop change
  }, [major]);

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
        setFormData(prev => ({ ...prev, image: '' }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, image: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.description || !formData.image) {
      setErrorMessage('Nama, Deskripsi, dan Gambar wajib diisi!');
      setShowErrorModal(true);
      return;
    }
    setErrorMessage(''); // Clear previous errors

    // Construct the Major object to be passed to onSave
    const majorToSave: Major = {
      ...(formData.id && { id: formData.id }),
      name: formData.name,
      image: formData.image,
      description: formData.description,
      // slug tidak disertakan di sini
    } as Major; // Type assertion to satisfy `Major` type

    await onSave(majorToSave);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs p-5 animate-fade-in-up transform transition-all duration-300 scale-100 opacity-100 relative">
        <h2 className="text-lg font-extrabold text-blue-800 mb-4 text-center">
          {major ? 'Edit Data Jurusan' : 'Tambah Jurusan Baru'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nama Jurusan */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Nama Jurusan:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-3 py-1.5 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              required
            />
          </div>

          {/* Unggah Gambar */}
          <div>
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1">
              Unggah Gambar:
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-3 py-1.5 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">Maksimal {MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB</p>
          </div>

          {/* Preview Gambar */}
          {formData.image && (
            <div className="mt-2 flex justify-center">
              <img
                src={formData.image}
                alt="Preview Jurusan"
                className="h-20 w-20 object-cover rounded-full border-4 border-blue-200 shadow-lg transition transform hover:scale-105 duration-200"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://placehold.co/80x80/e0e0e0/555555?text=File+Invalid';
                }}
              />
            </div>
          )}

          {/* Deskripsi */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
              Deskripsi:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-3 py-1.5 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400 resize-y"
              required
            ></textarea>
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center justify-end gap-2 pt-3">
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

export default MajorFormModal;