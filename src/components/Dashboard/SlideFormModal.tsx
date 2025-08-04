import React, { useState, useEffect, FC, ChangeEvent, FormEvent } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import type { Slide } from '@/types/Slide';

type SlideFormModalProps = {
  slide: Slide | null;
  onSave: (slide: Slide) => void;
  onClose: () => void;
};

const SlideFormModal: FC<SlideFormModalProps> = ({ slide, onSave, onClose }) => {
  const [formData, setFormData] = useState<Slide>({
    id: slide?.id || '',
    image: slide?.image || '',
    alt: slide?.alt || '',
    title: slide?.title || '',
    subtitle: slide?.subtitle || '',
    description: slide?.description || '',
    gradientFrom: slide?.gradientFrom || '',
    gradientTo: slide?.gradientTo || '',
    order: slide?.order || 1,
    isActive: slide?.isActive ?? true,
  });

  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const MAX_FILE_SIZE_MB = 5;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  const MAX_SLIDE_ORDER = 3;

  useEffect(() => {
    if (slide) {
      setFormData(slide);
    } else {
      setFormData({
        id: '', image: '', alt: '', title: '', subtitle: '', description: '',
        gradientFrom: '', gradientTo: '', order: 1, isActive: true
      });
    }
  }, [slide]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrorMessage(`Ukuran gambar maksimal adalah ${MAX_FILE_SIZE_MB}MB.`);
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
      if (slide?.image) {
        setFormData(prev => ({ ...prev, image: slide.image }));
      } else {
        setFormData(prev => ({ ...prev, image: '' }));
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (errorMessage) {
      setShowErrorModal(true);
      return;
    }

    if (formData.order > MAX_SLIDE_ORDER) {
      setErrorMessage(`Urutan tampil tidak boleh lebih dari ${MAX_SLIDE_ORDER}.`);
      setShowErrorModal(true);
      return;
    }

    if (!formData.image && (!slide || !slide.image)) {
        setErrorMessage('Gambar slide wajib diunggah atau dipilih.');
        setShowErrorModal(true);
        return;
    }

    const finalSlideData: Slide = {
      ...formData,
      image: formData.image, // Sekarang langsung menggunakan formData.image
      alt: formData.alt || formData.title || 'Gambar Slide',
      isActive: formData.isActive ?? true,
    };

    onSave(finalSlideData);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-4 animate-fade-in-up transform transition-all duration-300 scale-100 opacity-100 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition"
          aria-label="Tutup Modal"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
        <h2 className="text-lg font-extrabold text-blue-800 mb-3 text-center">
          {slide ? 'Edit Slide' : 'Tambah Slide Baru'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-gray-700 mb-0.5">
              Judul Utama: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-600 focus:outline-none px-2 py-1 text-sm text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              required
            />
          </div>

          <div>
            <label htmlFor="subtitle" className="block text-xs font-semibold text-gray-700 mb-0.5">
              Sub Judul:
            </label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-600 focus:outline-none px-2 py-1 text-sm text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-gray-700 mb-0.5">
              Deskripsi: <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-600 focus:outline-none px-2 py-1 text-sm text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400 resize-y"
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="imageUpload" className="block text-xs font-semibold text-gray-700 mb-0.5">
              Gambar Slide:
            </label>
            <input
              type="file"
              id="imageUpload"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-xs text-gray-600
                         file:mr-2 file:py-1 file:px-2
                         file:rounded-md file:border-0
                         file:text-xs file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100 transition duration-150 cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">Maksimal {MAX_FILE_SIZE_MB}MB</p>
          </div>

          {formData.image ? (
            <div className="mt-2 flex justify-center">
              <img
                src={formData.image}
                alt="Pratinjau Slide"
                className="h-16 w-auto object-cover rounded-md border-2 border-blue-200 shadow-sm transition transform hover:scale-105 duration-200"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1586348902889-437aa5a670fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fG5vJTIwaW1hZ2V8ZW58MHx8MHx8&auto=format&fit=crop&w=64&h=64&q=70';
                }}
              />
            </div>
          ) : (
            <div className="mt-2 h-16 w-full flex flex-col items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded-md text-gray-400 text-xs">
              <PhotoIcon className="h-6 w-6 mb-0.5" />
              <span>Belum ada gambar</span>
            </div>
          )}

          <div>
            <label htmlFor="order" className="block text-xs font-semibold text-gray-700 mb-0.5">
              Urutan Tampil: <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="1"
              max={MAX_SLIDE_ORDER}
              className="w-full rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-600 focus:outline-none px-2 py-1 text-sm text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition duration-200 ease-in-out shadow-sm text-xs font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-blue-700 text-white hover:bg-blue-800 font-semibold transition duration-200 ease-in-out shadow-lg transform hover:scale-105 text-xs rounded-lg"
              disabled={!!errorMessage || formData.order > MAX_SLIDE_ORDER}
            >
              {slide ? 'Simpan Perubahan' : 'Tambah Slide'}
            </button>
          </div>
        </form>
      </div>

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

export default SlideFormModal;