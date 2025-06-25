// pages/fasilitas.js
import MainLayout from '../components/layout/MainLayout';
import Image from 'next/image';
import { useState, useEffect } from 'react'; // Import useEffect

export default function Fasilitas() {
  const [facilities, setFacilities] = useState([]); // State untuk menyimpan data fasilitas
  const [activeFacility, setActiveFacility] = useState(null); // State untuk fasilitas yang aktif
  const [loading, setLoading] = useState(true); // State untuk status loading
  const [error, setError] = useState(null);   // State untuk error

  useEffect(() => {
    async function fetchFacilities() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/facilities'); // Panggil API route yang baru dibuat
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFacilities(data);
        // Set fasilitas pertama sebagai aktif secara default setelah data dimuat
        if (data.length > 0) {
          setActiveFacility(data[0].id);
        }
      } catch (e) {
        console.error("Gagal mengambil data fasilitas:", e);
        setError("Gagal memuat fasilitas. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    }

    fetchFacilities();
  }, []); // Array dependensi kosong agar hanya berjalan sekali saat komponen di-mount

  const currentFacility = facilities.find(fac => fac.id === activeFacility);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header section of Fasilitas page */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Fasilitas Sekolah</h1>
        <h2 className="text-4xl font-extrabold text-blue-800 mb-10">Fasilitas unggulan dari Sekolah Kami</h2>

        {loading && (
          <div className="text-center py-10">
            <p className="text-lg text-gray-700">Memuat fasilitas...</p>
            {/* Anda bisa menambahkan spinner loading di sini */}
          </div>
        )}

        {error && (
          <div className="text-center py-10">
            <p className="text-lg text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && facilities.length === 0 && (
          <div className="text-center py-10">
            <p className="text-lg text-gray-700">Tidak ada fasilitas yang tersedia saat ini.</p>
          </div>
        )}

        {!loading && !error && facilities.length > 0 && (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Sidebar for Navigation */}
            <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md md:sticky md:top-24 h-fit">
              <nav>
                <ul>
                  {facilities.map((fac) => (
                    <li key={fac.id} className="mb-2">
                      <button
                        onClick={() => setActiveFacility(fac.id)}
                        className={`block w-full text-left py-2 px-3 rounded-md transition-colors duration-200 ${
                          activeFacility === fac.id
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {fac.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Right Content Area */}
            <div className="w-full md:w-3/4 bg-white p-8 rounded-lg shadow-md">
              {currentFacility && (
                <div>
                  <div className="mb-6 overflow-hidden rounded-lg">
                    <Image
                      src={currentFacility.image}
                      alt={currentFacility.title}
                      // Menggunakan width dan height asli dari HTML Anda untuk konsistensi
                      width={1480}
                      height={
                        currentFacility.image === '/images/perpustakaan.webp' ? 769 :
                        (currentFacility.image === '/images/profile-hero.webp' ? 685 : 617)
                      }
                      layout="responsive"
                      objectFit="cover"
                      className="rounded-lg shadow-md"
                      priority={activeFacility === facilities[0].id} // Prioritas pada gambar fasilitas pertama yang dimuat
                    />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{currentFacility.title}</h2>
                  {currentFacility.description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
              {/* Jika tidak ada fasilitas aktif, mungkin karena data kosong atau error awal */}
              {!currentFacility && facilities.length > 0 && (
                <p className="text-gray-600">Pilih fasilitas dari menu di samping untuk melihat detailnya.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}