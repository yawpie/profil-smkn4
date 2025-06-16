import Image from 'next/image';
import { useState, useEffect } from 'react'; // Import useEffect

export default function TeacherList() {
  // State untuk menyimpan data guru yang akan diambil dari backend
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true); // State untuk indikator loading
  const [error, setError] = useState(null);   // State untuk error

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Jumlah guru per halaman

  useEffect(() => {
    // Fungsi untuk mengambil data guru dari backend/API
    async function fetchTeachersFromBackend() {
      setLoading(true); // Mulai loading
      setError(null);   // Reset error
      try {
        const response = await fetch('/api/teachers');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTeachers(data);
        setCurrentPage(1); // Reset ke halaman 1 setiap kali data baru diambil
      } catch (e) {
        console.error("Gagal mengambil daftar guru dari backend:", e);
        setError("Gagal memuat daftar guru. Silakan coba lagi nanti.");
      } finally {
        setLoading(false); // Selesai loading
      }
    }

    fetchTeachersFromBackend();
  }, []); // Array dependensi kosong: useEffect ini hanya akan berjalan sekali setelah render pertama

  // --- LOGIKA PAGINASI ---
  const totalPages = Math.ceil(teachers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  // Memastikan kita tidak mengambil indeks di luar batas array jika data baru dimuat
  const currentTeachers = teachers.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // --- KONDISI LOADING DAN ERROR ---
  if (loading) {
    return (
      <section className="py-10 bg-gray-50 text-center text-gray-700">
        <div className="container mx-auto px-4">
          <p>Memuat daftar guru...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10 bg-gray-50 text-center text-red-600">
        <div className="container mx-auto px-4">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (teachers.length === 0) {
    return (
      <section className="py-10 bg-gray-50 text-center text-gray-700">
        <div className="container mx-auto px-4">
          <p>Belum ada guru yang terdaftar.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Daftar Guru</h2>
          <p className="mt-2 text-gray-500">
            Berikut adalah daftar tenaga pengajar di SMKN 4 Mataram
          </p>
        </div>

        {/* Grid Guru */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {currentTeachers.map((teacher) => (
            // Gunakan 'teacher.id' sebagai key jika data dari database menyediakan ID unik
            // Jika tidak, Anda bisa menggunakan index, tapi ID unik lebih baik.
            <div key={teacher.id || teacher.name} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="w-full h-64 relative">
                <Image
                  src={teacher.image} // Path gambar akan diambil dari properti 'image' di data backend
                  alt={teacher.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800">{teacher.name}</h3>
                <p className="text-sm text-gray-500">{teacher.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && ( // Tampilkan paginasi hanya jika ada lebih dari 1 halaman
          <div className="flex justify-center mt-10">
            <nav className="inline-flex space-x-1 text-sm">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === 1
                    ? 'text-gray-400 border-gray-300 bg-gray-100 cursor-not-allowed'
                    : 'text-blue-600 border-blue-300 hover:bg-blue-100'
                }`}
              >
                ← Sebelumnya
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i} // Key untuk tombol halaman
                  onClick={() => goToPage(i + 1)}
                  className={`px-3 py-1 rounded-md border ${
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
                className={`px-3 py-1 rounded-md border ${
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
      </div>
    </section>
  );
}