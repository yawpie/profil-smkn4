// src/components/Dashboard/ArticleFormModal.js
import React, { useState, useEffect } from 'react';

const ArticleFormModal = ({ article, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: article?.id || null,
    title: article?.title || '',
    image: article?.image || '', // Field untuk gambar
    content: article?.content || '',
    author: article?.author || '',
    publishDate: article?.publishDate || new Date().toISOString().slice(0, 10), // Default ke tanggal saat ini
  });

  useEffect(() => {
    if (article) {
      setFormData(article);
    } else {
      setFormData({ id: null, title: '', image: '', content: '', author: '', publishDate: new Date().toISOString().slice(0, 10) });
    }
  }, [article]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validasi sederhana
    if (!formData.title || !formData.content || !formData.author || !formData.publishDate) {
      alert('Judul, Konten, Penulis, dan Tanggal Publikasi tidak boleh kosong!');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg animate-pop-in">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {article ? 'Edit Artikel' : 'Tambah Artikel Baru'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
              Judul Artikel:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
              URL Gambar Artikel (Opsional):
            </label>
            <input
              type="url" // Menggunakan type="url" untuk validasi browser dasar
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Contoh: https://example.com/gambar-artikel.jpg"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            />
            {formData.image && (
                <img
                    src={formData.image}
                    alt="Preview"
                    className="mt-2 h-24 w-24 object-cover rounded-lg shadow-sm"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/96x96?text=Invalid+URL';
                    }}
                />
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
              Isi Artikel:
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="8"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 resize-y"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="author" className="block text-gray-700 text-sm font-bold mb-2">
              Penulis:
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="publishDate" className="block text-gray-700 text-sm font-bold mb-2">
              Tanggal Publikasi:
            </label>
            <input
              type="date"
              id="publishDate"
              name="publishDate"
              value={formData.publishDate}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            />
          </div>
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleFormModal;