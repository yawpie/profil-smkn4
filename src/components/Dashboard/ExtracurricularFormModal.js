// src/components/Dashboard/ExtracurricularFormModal.js
import React, { useState, useEffect } from 'react';

const ExtracurricularFormModal = ({ extracurricular, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: extracurricular?.id || null,
    name: extracurricular?.name || '',
    image: extracurricular?.image || '', // Tambah field image
    description: extracurricular?.description || '',
    coach: extracurricular?.coach || '',
    schedule: extracurricular?.schedule || ''
  });

  useEffect(() => {
    if (extracurricular) {
      setFormData(extracurricular);
    } else {
      setFormData({ id: null, name: '', image: '', description: '', coach: '', schedule: '' });
    }
  }, [extracurricular]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.coach || !formData.schedule) {
      alert('Nama, Pelatih, dan Jadwal tidak boleh kosong!');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg animate-pop-in">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {extracurricular ? 'Edit Ekstrakurikuler' : 'Tambah Ekstrakurikuler Baru'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Nama Ekstrakurikuler:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
              URL Gambar Ekstrakurikuler (Opsional):
            </label>
            <input
              type="url" // Menggunakan type="url" untuk validasi browser dasar
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Contoh: https://example.com/gambar-ekskul.jpg"
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
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
              Deskripsi:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 resize-y"
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="coach" className="block text-gray-700 text-sm font-bold mb-2">
              Nama Pelatih:
            </label>
            <input
              type="text"
              id="coach"
              name="coach"
              value={formData.coach}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="schedule" className="block text-gray-700 text-sm font-bold mb-2">
              Jadwal:
            </label>
            <input
              type="text"
              id="schedule"
              name="schedule"
              value={formData.schedule}
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

export default ExtracurricularFormModal;