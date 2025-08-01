// pages/hubungi-kami.tsx
import Head from 'next/head';
import MainLayout from '../components/layout/MainLayout'; // Pastikan path ini benar
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

const HubungiKami: React.FC = () => {
  return (
    <MainLayout>
      <Head>
        <title>Hubungi Kami - SMKN 4 Mataram</title>
        <meta name="description" content="Informasi kontak SMKN 4 Mataram: alamat, telepon, email, dan media sosial." />
      </Head>

      {/* Bagian utama dengan latar belakang putih */}
      <div className="min-h-screen bg-white py-6 md:py-8"> {/* Padding vertikal tetap seperti versi sebelumnya (agak lebih kecil) */}
        <div className="container mx-auto p-3 md:p-4 max-w-4xl"> {/* Padding container tetap seperti versi sebelumnya */}

          {/* Wrapper untuk Judul agar bisa di-center dan framenya sesuai ukuran teks (Kecil & Tanpa Animasi) */}
          <div className="flex justify-center mb-6 md:mb-8"> {/* Margin bawah tetap seperti versi sebelumnya */}
            <div className="relative p-1.5 md:p-2 rounded-md shadow-sm inline-block
                         bg-blue-400"> {/* Frame judul tetap biru muda, kecil, dan tanpa animasi */}
              <h1 className="text-xl md:text-2xl font-extrabold text-white text-center"> {/* Judul tetap kecil */}
                Hubungi Kami
              </h1>
              {/* Efek kilau (shine) di atas judul tetap dihapus */}
              {/* <div className="absolute inset-0 z-0 overflow-hidden rounded-md pointer-events-none">
                  <div className="absolute top-0 -left-1/2 w-full h-full bg-white opacity-20 transform -skew-x-12 animate-shine"></div>
              </div> */}
            </div>
          </div>


          {/* Bagian alamat (Ukuran teks dan padding dikembalikan ke ukuran sedang) */}
          <div className="text-center mb-6 md:mb-8 p-3 bg-gray-50 rounded-lg shadow-sm"> {/* Padding dan margin, rounded dikembalikan */}
            <p className="text-base md:text-lg text-gray-700 leading-relaxed"> {/* Ukuran teks alamat dikembalikan */}
              Jl. Lingkar, Pondok Cina, Kecamatan Beji, Kota Depok, Jawa Barat 16424
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"> {/* Gap dikembalikan */}
            {/* Contact Info Card - Gradasi Biru Keunguan & Animasi (Tetap) */}
            <div className="p-5 md:p-6 rounded-lg shadow-xl {/* Padding dan shadow dikembalikan */}
                        bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600
                        text-white transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"> {/* Animasi hover dikembalikan */}
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 border-b-2 pb-2 border-blue-300">Contact Info</h2> {/* Judul kartu dikembalikan */}
              <div className="flex items-center mb-2 md:mb-3 text-base"> {/* Teks konten dikembalikan */}
                <FontAwesomeIcon icon={faPhone} className="mr-3 md:mr-4 text-xl w-6" /> {/* Ukuran ikon dan margin dikembalikan */}
                <span>+62 81 8054 22671</span>
              </div>
              <div className="flex items-center mb-2 md:mb-3 text-base">
                <FontAwesomeIcon icon={faEnvelope} className="mr-3 md:mr-4 text-xl w-6" />
                <span>info@universitas.id</span>
              </div>
              <div className="flex items-center text-base">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3 md:mr-4 text-xl w-6" />
                <a
                  href="https://maps.app.goo.gl/YourSchoolLocation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Google Map
                </a>
              </div>
            </div>

            {/* Media Sosial Card - Gradasi Biru Keunguan & Animasi (Tetap) */}
            <div className="p-5 md:p-6 rounded-lg shadow-xl
                        bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600
                        text-white transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 border-b-2 pb-2 border-blue-300">Media Sosial</h2>
              <div className="flex items-center mb-2 md:mb-3 text-base">
                <FontAwesomeIcon icon={faFacebook} className="mr-3 md:mr-4 text-xl w-6" />
                <a
                  href="https://www.facebook.com/YourSchoolPage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Facebook
                </a>
              </div>
              <div className="flex items-center mb-2 md:mb-3 text-base">
                <FontAwesomeIcon icon={faInstagram} className="mr-3 md:mr-4 text-xl w-6" />
                <a
                  href="https://www.instagram.com/YourSchoolAccount"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Instagram
                </a>
              </div>
              <div className="flex items-center text-base">
                <FontAwesomeIcon icon={faYoutube} className="mr-3 md:mr-4 text-xl w-6" />
                <a
                  href="https://www.youtube.com/YourSchoolChannel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Youtube
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HubungiKami;