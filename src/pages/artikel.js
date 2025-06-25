// pages/artikel.js
import MainLayout from '../components/layout/MainLayout';
// import komponen ArticleList lengkap
// Contoh: import ArticleList from '../components/ArticleList'; // Anda perlu membuat komponen ini

export default function ArtikelPage() {
  return (
    <MainLayout>
      <section className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-10">Semua Artikel Sekolah</h1>
        {/* Di sini panggil komponen ArticleList yang menampilkan SEMUA artikel */}
        {/* <ArticleList /> */}
        <p className="text-center text-gray-700">
          Konten daftar artikel lengkap akan dimuat di sini.
          Anda bisa melakukan fetch data artikel dari API di sini dan menampilkannya.
        </p>
        {/* Ini adalah contoh struktur, Anda akan mengganti ini dengan komponen rendering artikel yang sebenarnya */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-900">Judul Artikel {i + 1}</h3>
                    <p className="text-gray-600 text-sm mt-2">Tanggal: 2025-06-{20 - i}</p>
                    <p className="text-gray-700 mt-3 line-clamp-3">
                        Ini adalah ringkasan dari artikel nomor {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link href={`/artikel/${i + 1}`} className="text-blue-600 hover:text-blue-800 font-semibold mt-4 block">
                        Baca Selengkapnya &rarr;
                    </Link>
                </div>
            ))}
        </div>
      </section>
    </MainLayout>
  );
}