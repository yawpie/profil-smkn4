// src/components/Dashboard/AnnouncementFormModal.tsx
import React, { useState, useEffect, FC, ChangeEvent, FormEvent } from 'react';
import type { Announcement } from '@/types/Announcement';

type AnnouncementFormModalProps = {
  announcement: Announcement | null;
  onSave: (announcement: Announcement) => void;
  onClose: () => void;
};

const AnnouncementFormModal: FC<AnnouncementFormModalProps> = ({ announcement, onSave, onClose }) => {
  const [formData, setFormData] = useState<Announcement>({
    id: announcement?.id || '',
    title: announcement?.title || '',
    content: announcement?.content || '',
    publishDate: announcement?.publishDate || new Date().toISOString().slice(0, 10),
    status: announcement?.status || 'Draft',
    summary: announcement?.summary || '',
  });

  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB in bytes

  useEffect(() => {
    if (announcement) {
      setFormData({
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        publishDate: announcement.publishDate,
        status: announcement.status,
        summary: announcement.summary || '',
      });
    } else {
      setFormData({
        id: '',
        title: '',
        content: '',
        publishDate: new Date().toISOString().slice(0, 10),
        status: 'Draft',
        summary: '',
      });
    }
    setErrorMessage(''); // Clear previous errors on prop change
  }, [announcement]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        // In a real application, you would upload this 'file' object to a storage service
        // (e.g., Firebase Storage, AWS S3) and then save the returned URL to formData.image.
        // For this example, we're using the Data URL for preview purposes.
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file); // Converts file to base64 string for preview
    } else {
      // If no file is selected (e.g., user cancels file dialog)
      setFormData(prev => ({ ...prev, image: '' }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.publishDate) {
      setErrorMessage('Judul, Konten, dan Tanggal Publikasi wajib diisi!');
      setShowErrorModal(true);
      return;
    }

    const announcementToSave: Announcement = {
      id: formData.id ?? '', // konversi ke string jika tidak null
      title: formData.title,
      content: formData.content,
      publishDate: formData.publishDate,
      status: formData.status,
      summary: formData.summary,
    } as Announcement; // Type assertion to ensure it matches Announcement type

    onSave(announcementToSave);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs p-4 animate-fade-in-up transform transition-all duration-300 scale-100 opacity-100 relative">
        <h2 className="text-base font-extrabold text-blue-800 mb-3 text-center">
          {announcement ? 'Edit Data Pengumuman' : 'Tambah Pengumuman Baru'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Judul Pengumuman */}
          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-gray-700 mb-1">
              Judul Pengumuman:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-2 py-1 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              required
            />
          </div>
          {/* Isi Pengumuman */}
          <div>
            <label htmlFor="content" className="block text-xs font-semibold text-gray-700 mb-1">
              Isi Pengumuman:
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={3} // Adjusted rows for compactness
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-2 py-1 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400 resize-y"
              required
            ></textarea>
          </div>

          {/* Ringkasan */}
          <div>
            <label htmlFor="summary" className="block text-xs font-semibold text-gray-700 mb-1">
              Ringkasan: <span className="text-gray-500 font-normal">(Opsional)</span>
            </label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary || ''}
              onChange={handleChange}
              rows={1} // Adjusted rows for compactness
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-2 py-1 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400 resize-y"
            ></textarea>
          </div>

          {/* Tanggal Publikasi */}
          <div>
            <label htmlFor="publishDate" className="block text-xs font-semibold text-gray-700 mb-1">
              Tanggal Publikasi:
            </label>
            <input
              type="date"
              id="publishDate"
              name="publishDate"
              value={formData.publishDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-2 py-1 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-xs font-semibold text-gray-700 mb-1">
              Status:
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-2 py-1 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              required
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition duration-200 ease-in-out shadow-sm text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded-xl bg-blue-700 text-white hover:bg-blue-800 font-semibold transition duration-200 ease-in-out shadow-lg transform hover:scale-105 text-xs"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>

      {/* Custom Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl p-5 max-w-xs w-full text-center animate-fade-in-up">
            <p className="text-base font-bold text-red-700 mb-3">{errorMessage}</p>
            <button
              onClick={handleCloseErrorModal}
              className="px-5 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition duration-200 ease-in-out shadow-md text-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementFormModal;
