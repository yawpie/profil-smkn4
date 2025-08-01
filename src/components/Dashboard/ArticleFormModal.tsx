// src/components/Dashboard/ArticleFormModal.tsx
import React, { useState, useEffect, FC, ChangeEvent, FormEvent } from 'react';
import type { Article } from '@/types/Article'; // Import tipe Article

type ArticleFormModalProps = {
  article: Article | null; // Artikel yang sedang diedit (bisa null jika menambah baru)
  onSave: (article: Article) => void; // Fungsi onSave menerima objek Article yang lengkap
  onClose: () => void;
};

const ArticleFormModal: FC<ArticleFormModalProps> = ({ article, onSave, onClose }) => {
  // Inisialisasi formData dengan Article
  const [formData, setFormData] = useState<Article>({
    id: article?.id || '',
    title: article?.title || '',
    image: article?.image || '',
    content: article?.content || '',
    author: article?.author || '',
    publishDate: article?.publishDate || new Date().toISOString().slice(0, 10),
    summary: article?.summary || '',
  });

  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB in bytes

  useEffect(() => {
    if (article) {
      setFormData({
        id: article.id,
        title: article.title,
        image: article.image || '',
        content: article.content,
        author: article.author,
        publishDate: article.publishDate,
        summary: article.summary || '',
      });
    } else {
      setFormData({
        id: '',
        title: '',
        image: '',
        content: '',
        author: '',
        publishDate: new Date().toISOString().slice(0, 10),
        summary: '',
      });
    }
    setErrorMessage('');
  }, [article]);

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

    // Validasi sederhana
    if (!formData.title || !formData.content || !formData.author || !formData.publishDate) {
      setErrorMessage('Judul, Konten, Penulis, dan Tanggal Publikasi wajib diisi!');
      setShowErrorModal(true);
      return;
    }

    // Buat objek Article yang akan dikirim ke onSave
    const articleToSave: Article = {
      id: formData.id ?? '', // Pastikan id selalu string (default jadi string kosong kalau null)
      title: formData.title,
      image: formData.image, // Akan menjadi Data URL atau URL aktual
      content: formData.content,
      author: formData.author,
      publishDate: formData.publishDate,
      summary: formData.summary,
      // slug: formData.slug ?? '', // Dihapus: Slug dari objek yang disimpan
    } as Article; // Type assertion to ensure it matches Article type

    onSave(articleToSave);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs p-4 animate-fade-in-up transform transition-all duration-300 scale-100 opacity-100 relative">
        <h2 className="text-base font-extrabold text-blue-800 mb-3 text-center">
          {article ? 'Edit Data Artikel' : 'Tambah Artikel Baru'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Judul Artikel */}
          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-gray-700 mb-1">
              Judul Artikel:
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

          {/* Unggah Gambar Artikel */}
          <div>
            <label htmlFor="image" className="block text-xs font-semibold text-gray-700 mb-1">
              Unggah Gambar Artikel:
            </label>
            <input
              type="file" // Changed to file input
              id="image"
              name="image"
              accept="image/*" // Restrict to image files
              onChange={handleFileChange} // Use the new file handler
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-2 py-1 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400 file:mr-3 file:py-0.5 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required // Assuming image is mandatory per your Article type
            />
            <p className="text-xs text-gray-500 mt-1">Maksimal {MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB</p>
          </div>

          {/* Preview Gambar */}
          {formData.image && (
            <div className="mt-1 flex justify-center">
              <img
                src={formData.image}
                alt="Preview Artikel"
                className="h-16 w-16 object-cover rounded-full border-3 border-blue-200 shadow-lg transition transform hover:scale-105 duration-200"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://placehold.co/64x64/e0e0e0/555555?text=File+Invalid'; // Smaller placeholder
                }}
              />
            </div>
          )}

          {/* Isi Artikel */}
          <div>
            <label htmlFor="content" className="block text-xs font-semibold text-gray-700 mb-1">
              Isi Artikel:
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

          {/* Penulis */}
          <div>
            <label htmlFor="author" className="block text-xs font-semibold text-gray-700 mb-1">
              Penulis:
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none px-2 py-1 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:border-blue-400"
              required
            />
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

export default ArticleFormModal;