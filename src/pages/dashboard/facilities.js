// src/pages/dashboard/facilities.js
"use client";

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Dashboard/Layout';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import FacilityFormModal from '../../components/Dashboard/FacilityFormModal';

const FacilitiesPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFacility, setCurrentFacility] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null);     // Add error state

  // Function to fetch facilities data from the API
  const fetchFacilities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/facilities'); // Fetch from your API Route
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFacilities(data);
    } catch (e) {
      console.error("Failed to fetch facilities:", e);
      setError("Failed to load facility data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities(); // Call fetchFacilities when the component mounts
  }, []);

  const handleAddEdit = (facility = null) => {
    setCurrentFacility(facility);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this facility?')) {
      try {
        const response = await fetch(`/api/facilities?id=${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await response.json(); // Consume the response
        setNotification({ message: 'Facility successfully deleted!', type: 'success' });
        fetchFacilities(); // Re-fetch data after deletion
      } catch (e) {
        console.error("Failed to delete facility:", e);
        setNotification({ message: `Failed to delete facility: ${e.message}`, type: 'error' });
      }
    }
  };

  const handleSaveFacility = async (newFacility) => {
    try {
      const method = newFacility.id ? 'PUT' : 'POST';
      const response = await fetch('/api/facilities', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFacility),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json(); // Consume the response
      setNotification({ message: `Facility successfully ${newFacility.id ? 'updated' : 'added'}!`, type: 'success' });
      setIsModalOpen(false);
      setCurrentFacility(null);
      fetchFacilities(); // Re-fetch data after saving
    } catch (e) {
      console.error("Failed to save facility:", e);
      setNotification({ message: `Failed to save facility: ${e.message}`, type: 'error' });
    }
  };

  return (
<Layout setNotification={setNotification}>
      <div className="bg-gradient-to-b from-white to-blue-50 rounded-2xl shadow-xl p-8 animate-fade-in max-w-6xl mx-auto mt-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 tracking-wide">
            🏫 Manajemen Fasilitas
          </h1>
          <button
            onClick={() => handleAddEdit()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all duration-200 shadow-md"
          >
            <PlusIcon className="h-5 w-5" />
            Tambah Fasilitas
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-600 py-8">Memuat data fasilitas...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Gambar</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Deskripsi</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Lokasi</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-blue-800 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-blue-800 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {facilities.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-6 text-center text-gray-500">Belum ada data fasilitas.</td>
                  </tr>
                ) : (
                  facilities.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50 transition-colors duration-100">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.name}</td>
                      <td className="px-6 py-4">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover border border-blue-200 shadow" />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-300 flex items-center justify-center text-gray-600 text-xs">No Img</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 line-clamp-2">{item.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.location}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'Tersedia' ? 'bg-green-100 text-green-800' : item.status === 'Digunakan' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => handleAddEdit(item)} className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200" title="Edit">
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200" title="Hapus">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && (
          <FacilityFormModal
            facility={currentFacility}
            onSave={handleSaveFacility}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default FacilitiesPage;