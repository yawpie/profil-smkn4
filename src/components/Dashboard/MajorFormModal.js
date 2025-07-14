// src/components/Dashboard/MajorFormModal.js
import React, { useState, useEffect } from 'react';

const MajorFormModal = ({ major, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: major?.id || null,
    name: major?.name || '',
    image: major?.image || '',
    description: major?.description || ''
  });

  useEffect(() => {
    if (major) {
      setFormData(major);
    } else {
      setFormData({ id: null, name: '', image: '', description: '' });
    }
  }, [major]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Nama Jurusan tidak boleh kosong!');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg animate-pop-in border-t-4 border-blue-600">
        <h2 className="text-3xl font-extrabold text-blue-800 mb-7 text-center">
          {major ? 'Edit Jurusan' : 'Tambah Jurusan Baru'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5"> {/* Margin bawah sedikit lebih besar */}
            <label htmlFor="name" className="block text-gray-800 text-sm font-semibold mb-2">
              Nama Jurusan:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-gray-800 placeholder-gray-400"
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="image" className="block text-gray-800 text-sm font-semibold mb-2">
              URL Gambar Jurusan (Opsional):
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Contoh: https://example.com/gambar-jurusan.jpg"
              className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-gray-800 placeholder-gray-400"
            />
            {formData.image && (
                <img
                    src={formData.image}
                    alt="Preview"
                    className="mt-3 h-28 w-28 object-cover rounded-lg shadow-md border-2 border-gray-200 transition-transform duration-200 hover:scale-105"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/112x112?text=Invalid+URL';
                    }}
                />
            )}
          </div>
          <div className="mb-7"> {/* Margin bawah lebih besar untuk textarea */}
            <label htmlFor="description" className="block text-gray-800 text-sm font-semibold mb-2">
              Deskripsi (Opsional):
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4" // Tingkatkan tinggi default textarea
              className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-gray-800 placeholder-gray-400 resize-y"
            ></textarea>
          </div>
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2.5 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MajorFormModal;