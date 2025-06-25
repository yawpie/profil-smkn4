// pages/daftar-guru.js
import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Image from 'next/image';

export default function DaftarGuruPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Number of teachers per page for the full list (you can adjust this)

  // Function to fetch teacher data from the backend/API
  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Ensure this API endpoint is publicly accessible for data retrieval
      const response = await fetch('/api/teachers'); // Replace with your actual API endpoint
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTeachers(data);
      setCurrentPage(1); // Reset to page 1 whenever new data is fetched
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
      setError("Gagal memuat daftar guru. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  // Call fetchTeachers when the component mounts
  useEffect(() => {
    fetchTeachers();
  }, []);

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(teachers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTeachers = teachers.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // --- LOADING AND ERROR STATES ---
  if (loading) {
    return (
      <MainLayout>
        <section className="container mx-auto px-4 py-12 text-center">
          <p>Memuat daftar guru...</p>
        </section>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <section className="container mx-auto px-4 py-12 text-center text-red-600">
          <p>{error}</p>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-10">Daftar Guru SMKN 4 Mataram</h1>

        {teachers.length === 0 ? (
          <p className="text-center text-gray-700">Belum ada data guru yang tersedia saat ini.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {currentTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transform transition-transform hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="w-full h-[160px] relative bg-gray-100"> {/* Added bg-gray-100 fallback */}
                    <Image
                      src={teacher.imageUrl || '/images/default_avatar.png'} // Use teacher's image or default
                      alt={teacher.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{teacher.name}</h3>
                    <p className="text-base text-blue-700 font-semibold mb-1">{teacher.subject}</p> {/* Mata Pelajaran */}
                    <p className="text-sm text-gray-600">NIP: {teacher.nip || '-'}</p> {/* NIP */}
                    {/* Assuming you have a 'role' property from your backend for their position/jabatan */}
                    <p className="text-sm text-gray-500 mt-2">{teacher.role || 'Tenaga Pengajar'}</p> {/* Jabatan/Peran */}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="inline-flex space-x-1 text-base">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md border ${
                      currentPage === 1
                        ? 'text-gray-400 border-gray-300 bg-gray-100 cursor-not-allowed'
                        : 'text-blue-600 border-blue-300 hover:bg-blue-100'
                    }`}
                  >
                    ← Sebelumnya
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToPage(i + 1)}
                      className={`px-4 py-2 rounded-md border ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md border ${
                      currentPage === totalPages
                        ? 'text-gray-400 border-gray-300 bg-gray-100 cursor-not-allowed'
                        : 'text-blue-600 border-blue-300 hover:bg-blue-100'
                    }`}
                  >
                    Berikutnya →
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </section>
    </MainLayout>
  );
}