import React, { useState, useEffect, FC, ChangeEvent, FormEvent, SyntheticEvent } from 'react';
import type { Achievement } from '@/types/Achievement';
import Image from 'next/image';

type AchievementFormModalProps = {
  achievement: Achievement | null; // Prestasi yang sedang diedit (bisa null jika menambah baru)
  onSave: (achievement: Achievement, imageFile: File | null) => void; // Mengirimkan objek Achievement dan file gambar
  onClose: () => void;
};

const AchievementFormModal: FC<AchievementFormModalProps> = ({ achievement, onSave, onClose }) => {
  const [formData, setFormData] = useState<Achievement>({
    id: achievement?.id || '',
    title: achievement?.title || '',
    image: achievement?.image || '',
    description: achievement?.description || '',
    content: achievement?.content || '',
    publishDate: achievement?.publishDate?.split('T')[0] || new Date().toISOString().slice(0, 10),
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB in bytes

  useEffect(() => {
    if (achievement) {
      setFormData({
        id: achievement.id,
        title: achievement.title,
        image: achievement.image || '',
        description: achievement.description,
        content: achievement.content,
        publishDate: achievement.publishDate?.split('T')[0] || '',
      });
      setImageFile(null); // Reset file saat beralih ke mode edit
    } else {
      setFormData({
        id: '',
        title: '',
        image: '',
        description: '',
        content: '',
        publishDate: new Date().toISOString().slice(0, 10),
      });
      setImageFile(null);
    }
    setErrorMessage('');
  }, [achievement]);

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
        setImageFile(null);
        return;
      }
      setImageFile(file);
      // Buat URL sementara untuk preview
      const previewURL = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: previewURL }));
    } else {
      setImageFile(null);
      setFormData(prev => ({ ...prev, image: achievement?.image || '' }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.content || !formData.publishDate) {
      setErrorMessage('Judul, Ringkasan, Konten, dan Tanggal Publikasi wajib diisi!');
      setShowErrorModal(true);
      return;
    }

    const achievementToSave: Achievement = {
      id: formData.id ?? '',
      title: formData.title,
      image: formData.image, // URL sementara
      description: formData.description,
      content: formData.content,
      publishDate: formData.publishDate,
    };

    onSave(achievementToSave, imageFile);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  const imageUrl = imageFile ? URL.createObjectURL(imageFile) : formData.image;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl p-4 md:p-8 animate-fade-in-up transform transition-all duration-300 scale-100 opacity-100 relative max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg sm:text-xl font-extrabold text-green-800 mb-6 text-center">
          {achievement ? 'Edit Data Prestasi' : 'Tambah Prestasi Baru'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
              Judul Prestasi:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-green-400"
              required
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1">
              Unggah Gambar Prestasi:
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-green-400 file:mr-3 file:py-0.5 file:px-2 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            <p className="text-sm text-gray-500 mt-1">Maksimal {MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB</p>
          </div>

          {imageUrl && (
            <div className="mt-1 flex justify-center">
              <Image
                src={imageUrl}
                width={96}
                height={96}
                alt="Preview Prestasi"
                className="h-24 w-24 object-cover rounded-xl border-4 border-green-200 shadow-lg transition transform hover:scale-105 duration-200"
                onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://placehold.co/96x96/e0e0e0/555555?text=File+Invalid';
                }}
              />
            </div>
          )}

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
              Ringkasan Prestasi:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-green-400 resize-y"
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-1">
              Isi Prestasi:
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={6}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-green-400 resize-y"
              required
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:outline-none px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-green-400"
                required
              />
            </div>
          </div>

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
              className="px-6 py-2 rounded-xl bg-green-700 text-white hover:bg-green-800 font-semibold transition duration-200 ease-in-out shadow-lg transform hover:scale-105 text-sm"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>

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

export default AchievementFormModal;