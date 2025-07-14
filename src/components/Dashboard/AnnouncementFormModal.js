// src/components/Dashboard/AnnouncementFormModal.js
import React, { useState, useEffect } from 'react';

const AnnouncementFormModal = ({ announcement, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: announcement?.id || null,
    title: announcement?.title || '',
    content: announcement?.content || '',
    publishDate: announcement?.publishDate || new Date().toISOString().slice(0, 10), // Default to current date
    status: announcement?.status || 'Draft' // Default status
  });

  useEffect(() => {
    if (announcement) {
      setFormData(announcement);
    } else {
      setFormData({ id: null, title: '', content: '', publishDate: new Date().toISOString().slice(0, 10), status: 'Draft' });
    }
  }, [announcement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validasi sederhana
    if (!formData.title || !formData.content || !formData.publishDate) {
      alert('Judul, Konten, dan Tanggal Publikasi tidak boleh kosong!');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg animate-pop-in">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {announcement ? 'Edit Pengumuman' : 'Tambah Pengumuman Baru'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
              Judul Pengumuman:
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
            <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
              Isi Pengumuman:
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="6"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 resize-y"
              required
            ></textarea>
          </div>
          <div className="mb-4">
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
          <div className="mb-6">
            <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
              Status:
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
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

export default AnnouncementFormModal;