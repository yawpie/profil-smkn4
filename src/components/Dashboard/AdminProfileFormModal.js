import React, { useState, useEffect } from 'react';

const AdminProfileFormModal = ({ adminProfile, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    profileImage: '',
  });

  useEffect(() => {
    if (adminProfile) {
      setFormData(adminProfile);
    }
  }, [adminProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) {
      alert('Nama, Email, dan Jabatan wajib diisi!');
      return;
    }
    onSave({ ...formData, id: adminProfile?.id });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8 animate-fade-in-up relative">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Edit Profil Admin</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none px-4 py-2 text-gray-800 shadow-sm"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none px-4 py-2 text-gray-800 shadow-sm"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telepon <span className="text-gray-400">(Opsional)</span></label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none px-4 py-2 text-gray-800 shadow-sm"
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Jabatan / Peran</label>
            <input
              id="role"
              name="role"
              type="text"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none px-4 py-2 text-gray-800 shadow-sm"
              required
            />
          </div>

          {/* Profile Image URL */}
          <div>
            <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">URL Gambar Profil <span className="text-gray-400">(Opsional)</span></label>
            <input
              id="profileImage"
              name="profileImage"
              type="url"
              value={formData.profileImage}
              onChange={handleChange}
              placeholder="https://example.com/profile.jpg"
              className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none px-4 py-2 text-gray-800 shadow-sm"
            />

            {/* Preview */}
            {formData.profileImage && (
              <img
                src={formData.profileImage}
                alt="Preview"
                className="mt-3 h-24 w-24 object-cover rounded-full border border-gray-300 shadow-sm"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/96x96?text=Invalid+URL';
                }}
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition shadow"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfileFormModal;