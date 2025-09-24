import React, { useState, useEffect, FC, ChangeEvent, FormEvent, SyntheticEvent } from 'react';
import type { Extracurricular } from '@/types/Extracurricular';

type ExtracurricularFormModalProps = {
  extracurricular: Extracurricular | null;
  onSave: (extracurricular: Extracurricular) => void;
  onClose: () => void;
};

const ExtracurricularFormModal: FC<ExtracurricularFormModalProps> = ({ extracurricular, onSave, onClose }) => {
  const [formData, setFormData] = useState<Extracurricular>({
    id: extracurricular?.id || '',
    name: extracurricular?.name || '',
    image: extracurricular?.image || '', // This will now store a Data URL for preview, or an actual URL after upload
    description: extracurricular?.description || '',
    coach: extracurricular?.coach || '',
    schedule: extracurricular?.schedule || ''
  });
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 5 MB in bytes

  useEffect(() => {
    if (extracurricular) {
      setFormData(extracurricular);
    } else {
      // Reset form if extracurricular is null (e.g., for creating new)
      setFormData({ id: '', name: '', image: '', description: '', coach: '', schedule: '' });
    }
  }, [extracurricular]);

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
        setFormData(prev => ({ ...prev, image: '' })); // Clear preview
        return;
      }

      // Read file as Data URL for immediate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file); // Converts file to base64 string for preview
    } else {
      setFormData(prev => ({ ...prev, image: '' }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simple validation
    if (!formData.name || !formData.coach || !formData.schedule) {
      setErrorMessage('Nama, Pelatih, dan Jadwal wajib diisi!');
      setShowErrorModal(true);
      return;
    }
    onSave(formData);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-6 md:p-12 animate-fade-in-up transform transition-all duration-300 scale-100 opacity-100 relative max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-extrabold text-blue-800 mb-6 text-center">
          {extracurricular ? 'Edit Data Ekstrakurikuler' : 'Tambah Ekstrakurikuler'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Ekstrakurikuler */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Nama Ekstrakurikuler:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              required
            />
          </div>

          {/* Unggah Gambar Ekstrakurikuler */}
          <div>
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1">
              Unggah Gambar Ekstrakurikuler
            </label>
            <input
              type="file" // Changed to file input
              id="image"
              name="image"
              accept="image/*" // Restrict to image files
              onChange={handleFileChange} // Use the new file handler
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400 file:mr-3 file:py-0.5 file:px-2 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-sm text-gray-500 mt-1">Maksimal {MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB</p>
          </div>

          {/* Preview Gambar */}
          {formData.image && (
            <div className="mt-2 flex justify-center">
              <img
                src={formData.image}
                alt="Preview Ekstrakurikuler"
                className="h-24 w-24 object-cover rounded-full border-4 border-blue-200 shadow-lg transition transform hover:scale-105 duration-200"
                onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://placehold.co/96x96/e0e0e0/555555?text=File+Invalid'; // Smaller placeholder
                }}
              />
            </div>
          )}

          {/* Deskripsi */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
              Deskripsi: <span className="text-gray-500 font-normal">(Opsional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400 resize-y"
            ></textarea>
          </div>

          {/* Nama Pelatih */}
          <div>
            <label htmlFor="coach" className="block text-sm font-semibold text-gray-700 mb-1">
              Nama Pelatih:
            </label>
            <input
              type="text"
              id="coach"
              name="coach"
              value={formData.coach}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              required
            />
          </div>

          {/* Jadwal */}
          <div>
            <label htmlFor="schedule" className="block text-sm font-semibold text-gray-700 mb-1">
              Jadwal:
            </label>
            <input
              type="text"
              id="schedule"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              required
            />
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center justify-end gap-5 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition duration-200 ease-in-out shadow-sm text-sm font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800 font-semibold transition duration-200 ease-in-out shadow-lg transform hover:scale-105 text-sm"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>

      {/* Custom Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center animate-fade-in-up">
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

export default ExtracurricularFormModal;