// src/components/Dashboard/TeacherFormModal.js
import React, { useState, useEffect } from 'react';

const TeacherFormModal = ({ teacher, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: teacher?.id || null,
    name: teacher?.name || '',
    image: teacher?.image || '',
    subject: teacher?.subject || '',
    nip: teacher?.nip || '',
    position: teacher?.position || '',
  });

  useEffect(() => {
    // Memastikan form terisi dengan data terbaru saat modal dibuka atau 'teacher' berubah
    if (teacher) {
      setFormData(teacher);
    } else {
      // Reset form jika menambah guru baru
      setFormData({ id: null, name: '', image: '', subject: '', nip: '', position: '' });
    }
  }, [teacher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validasi sederhana
    if (!formData.name || !formData.subject || !formData.nip || !formData.position) {
      alert('Nama, Mata Pelajaran, NIP, dan Jabatan tidak boleh kosong!');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg animate-pop-in border-t-4 border-blue-600">
        <h2 className="text-3xl font-extrabold text-blue-800 mb-7 text-center">
          {teacher ? 'Edit Data Guru' : 'Tambah Guru Baru'}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Nama Guru */}
          <div className="mb-5">
            <label htmlFor="name" className="block text-gray-800 text-sm font-semibold mb-2">
              Nama Guru:
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

          {/* URL Gambar Profil */}
          <div className="mb-5">
            <label htmlFor="image" className="block text-gray-800 text-sm font-semibold mb-2">
              URL Gambar Profil (Opsional):
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Contoh: https://example.com/guru.jpg"
              className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-gray-800 placeholder-gray-400"
            />
            {formData.image && (
                <img
                    src={formData.image}
                    alt="Preview Profil"
                    className="mt-3 h-28 w-28 object-cover rounded-full shadow-md border-2 border-gray-200 transition-transform duration-200 hover:scale-105 mx-auto block" /* mx-auto block untuk menengahkan gambar */
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/112x112?text=Invalid+URL';
                    }}
                />
            )}
          </div>

          {/* Mata Pelajaran */}
          <div className="mb-5">
            <label htmlFor="subject" className="block text-gray-800 text-sm font-semibold mb-2">
              Mata Pelajaran:
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-gray-800 placeholder-gray-400"
              required
            />
          </div>

          {/* NIP */}
          <div className="mb-5">
            <label htmlFor="nip" className="block text-gray-800 text-sm font-semibold mb-2">
              NIP:
            </label>
            <input
              type="text"
              id="nip"
              name="nip"
              value={formData.nip}
              onChange={handleChange}
              className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-gray-800 placeholder-gray-400"
              required
            />
          </div>

          {/* Jabatan */}
          <div className="mb-7">
            <label htmlFor="position" className="block text-gray-800 text-sm font-semibold mb-2">
              Jabatan:
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-gray-800 placeholder-gray-400"
              required
            />
          </div>

          {/* Tombol Aksi */}
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

export default TeacherFormModal;