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
  // const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB in bytes

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
    setErrorMessage('');
  }, [announcement]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     if (file.size > MAX_IMAGE_SIZE_BYTES) {
  //       setErrorMessage(`Ukuran gambar maksimal adalah ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB.`);
  //       setShowErrorModal(true);
  //       e.target.value = '';
  //       setFormData(prev => ({ ...prev, image: '' }));
  //       return;
  //     }
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setFormData(prev => ({ ...prev, image: reader.result as string }));
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     setFormData(prev => ({ ...prev, image: '' }));
  //   }
  // };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.publishDate) {
      setErrorMessage('Judul, Konten, dan Tanggal Publikasi wajib diisi!');
      setShowErrorModal(true);
      return;
    }

    const announcementToSave: Announcement = {
      id: formData.id ?? '',
      title: formData.title,
      content: formData.content,
      publishDate: formData.publishDate,
      status: formData.status,
      summary: formData.summary,
    } as Announcement;

    onSave(announcementToSave);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      {/* Modal yang dioptimalkan ukurannya */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl p-6 md:p-12 animate-fade-in-up transform transition-all duration-300 scale-100 opacity-100 relative">
        <h2 className="text-xl sm:text-2xl font-extrabold text-blue-800 mb-6 text-center">
          {announcement ? 'Edit Data Pengumuman' : 'Tambah Pengumuman Baru'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Judul Pengumuman */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
              Judul Pengumuman:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              required
            />
          </div>
          {/* Isi Pengumuman */}
          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-1">
              Isi Pengumuman:
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={6}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400 resize-y"
              required
            ></textarea>
          </div>

          {/* Tanggal Publikasi dan Status (Side-by-side on larger screens) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tanggal Publikasi */}
            <div>
              <label htmlFor="publishDate" className="block text-sm font-semibold text-gray-700 mb-1">
                Tanggal Publikasi:
              </label>
              <input
                type="date"
                id="publishDate"
                name="publishDate"
                value={formData.publishDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
                required
              />
            </div>
            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">
                Status:
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
                required
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
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
              className="px-6 py-2.5 bg-red-700 text-white rounded-lg hover:bg-red-800 transition duration-200 ease-in-out shadow-md text-base"
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
