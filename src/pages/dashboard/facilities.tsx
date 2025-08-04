import React, { useState, useEffect } from 'react';
import Layout from '../../components/Dashboard/Layout';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import FacilityFormModal from '../../components/Dashboard/FacilityFormModal';
import type { Facility } from '@/types/Facility'; // Assuming you have a types.ts file for interfaces
import type { Notification } from '@/types/Notification'; // Asumsikan Anda memiliki type Notification

const FacilitiesPage = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentFacility, setCurrentFacility] = useState<Facility | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null); // Gunakan type Notification
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch facilities data from the API
  const fetchFacilities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/facilities'); // Fetch from your API Route
      if (!response.ok) {
        // Tangani error dari API dengan lebih baik
        const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui dari server.' }));
        throw new Error(`HTTP error! status: ${response.status}: ${errorData.message || response.statusText}`);
      }
      const data: Facility[] = await response.json();
      setFacilities(data);
    } catch (e: unknown) { // Gunakan unknown untuk type safety
      console.error("Failed to fetch facilities:", e);
      if (e instanceof Error) {
        setError(`Gagal memuat data fasilitas. Detail: ${e.message}`);
      } else {
        setError("Gagal memuat data fasilitas. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities(); // Call fetchFacilities when the component mounts
  }, []);

  const handleAddEdit = (facility: Facility | null = null) => {
    setCurrentFacility(facility);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string | null) => {
    if (confirm('Apakah Anda yakin ingin menghapus fasilitas ini?')) {
      try {
        const response = await fetch(`/api/facilities?id=${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui.' }));
          throw new Error(`HTTP error! status: ${response.status}: ${errorData.message || response.statusText}`);
        }
        await response.json(); // Consume the response
        setNotification({ message: 'Fasilitas berhasil dihapus!', type: 'success' });
        fetchFacilities(); // Re-fetch data after deletion
      } catch (e: unknown) {
        console.error("Gagal menghapus fasilitas:", e);
        if (e instanceof Error) {
          setNotification({ message: `Gagal menghapus fasilitas: ${e.message}`, type: 'error' });
        } else {
          setNotification({ message: 'Gagal menghapus fasilitas. Silakan coba lagi.', type: 'error' });
        }
      }
    }
  };

  const handleSaveFacility = async (newFacility: Facility) => {
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
        const errorData = await response.json().catch(() => ({ message: 'Kesalahan tidak diketahui.' }));
        let errorMessage = `HTTP error! Status: ${response.status}: ${errorData.message || response.statusText}`;

        // Cek apakah error 413, lalu berikan pesan yang lebih jelas
        if (response.status === 413) {
          errorMessage = "Gagal menyimpan fasilitas. Ukuran gambar terlalu besar. Silakan pilih gambar yang lebih kecil.";
        }
        
        setNotification({ message: errorMessage, type: 'error' });
        console.error('Backend Error Response for SAVE:', errorData);
        return; // Hentikan eksekusi fungsi
      }

      await response.json(); // Consume the response
      setNotification({ message: `Fasilitas berhasil ${newFacility.id ? 'diperbarui' : 'ditambahkan'}!`, type: 'success' });
      setIsModalOpen(false); // Tutup modal hanya jika berhasil
      setCurrentFacility(null);
      fetchFacilities(); // Re-fetch data after saving
    } catch (e: unknown) { // Gunakan unknown untuk type safety
      console.error("Gagal menyimpan fasilitas:", e);
      if (e instanceof Error) {
        setNotification({ message: `Gagal menyimpan fasilitas: ${e.message}`, type: 'error' });
      } else {
        setNotification({ message: 'Gagal menyimpan fasilitas. Silakan coba lagi.', type: 'error' });
      }
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
                    <td colSpan={6} className="px-6 py-6 text-center text-gray-500">Belum ada data fasilitas.</td>
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