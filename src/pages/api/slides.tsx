// pages/api/slides.ts (Pages Router)
import type { NextApiRequest, NextApiResponse } from 'next';
import { Slide } from '@/types/Slide'; // Gunakan tipe Slide

// --- DATA SLIDE INTERNAL (DIREKOMENDASIKAN HANYA UNTUK PROTOTIPE/DEMO KECIL) ---
// CATATAN: Perubahan pada data ini TIDAK akan persisten setelah server di-restart.
let slides: Slide[] = [
  {
    "id": "slide1",
    "src": "/images/logo_sekolah.png",
    "alt": "Pemandangan modern SMKN 4 Mataram",
    "title": "Selamat Datang di",
    "subtitle": "SMK NEGERI 4 MATARAM",
    "description": "Membentuk generasi unggul, berprestasi, dan siap menghadapi masa depan.",
    "gradientFrom": "from-blue-900",
    "gradientTo": "to-blue-600",
    "order": 1,
    "isActive": true
  },
  {
    "id": "slide2",
    "src": "/images/bg-hero-2.jpg",
    "alt": "Lingkungan belajar inovatif",
    "title": "Inovasi Pendidikan",
    "subtitle": "Fokus pada Keunggulan Vokasi",
    "description": "Kurikulum adaptif yang selaras dengan industri terkini.",
    "gradientFrom": "from-purple-900",
    "gradientTo": "to-indigo-600",
    "order": 2,
    "isActive": true
  },
  {
    "id": "slide3",
    "src": "/images/bg-hero-3.jpg",
    "alt": "Kegiatan ekstrakurikuler siswa",
    "title": "Ekstrakurikuler Beragam",
    "subtitle": "Kembangkan Bakat dan Potensi",
    "description": "Pilih dari berbagai kegiatan yang menginspirasi dan membangun karakter.",
    "gradientFrom": "from-cyan-900",
    "gradientTo": "to-teal-600",
    "order": 3,
    "isActive": true
  }
];
// --- AKHIR DATA SLIDE INTERNAL ---

export default function handler(req: NextApiRequest, res: NextApiResponse<Slide[] | Slide | { message: string }>) {
  // Dalam skenario nyata, Anda akan berinteraksi dengan database di sini, bukan variabel global.

  switch (req.method) {
    case 'GET':
      // Mengambil semua slide (filter berdasarkan query param jika ada)
      const filteredSlides = req.query.activeOnly === 'true'
        ? slides.filter(slide => slide.isActive).sort((a, b) => a.order - b.order)
        : slides.sort((a, b) => a.order - b.order); // Urutkan juga jika tidak difilter
      res.status(200).json(filteredSlides);
      break;

    case 'POST':
      // Menambahkan slide baru
      const newSlide: Slide = {
        id: Date.now().toString(), // Generate ID unik (sederhana)
        ...req.body, // Ambil data dari body request
        order: parseInt(req.body.order as string, 10), // Pastikan order adalah number
        isActive: req.body.isActive === true || req.body.isActive === 'true' // Pastikan isActive adalah boolean
      };

      // Validasi data minimal
      if (!newSlide.title || !newSlide.src || !newSlide.gradientFrom || !newSlide.subtitle || !newSlide.description) {
        return res.status(400).json({ message: 'Data slide tidak lengkap. Pastikan semua bidang terisi.' });
      }

      slides.push(newSlide); // Tambahkan ke array in-memory
      res.status(201).json(newSlide); // Kirim slide yang baru dibuat
      break;

    case 'PUT':
      // Memperbarui slide berdasarkan ID dari body
      const { id: putId, ...updatedFields } = req.body;

      if (!putId) {
        return res.status(400).json({ message: 'ID slide tidak ditemukan dalam body request untuk PUT.' });
      }

      const putSlideIndex = slides.findIndex(s => s.id === putId);

      if (putSlideIndex !== -1) {
        // Pastikan order dan isActive di-parse dengan benar dari body
        const parsedOrder = parseInt(updatedFields.order as string, 10);
        const parsedIsActive = updatedFields.isActive === true || updatedFields.isActive === 'true';

        slides[putSlideIndex] = {
          ...slides[putSlideIndex],
          ...updatedFields,
          id: putId as string, // Pastikan ID tidak berubah
          order: isNaN(parsedOrder) ? slides[putSlideIndex].order : parsedOrder, // Gunakan yang lama jika parsing gagal
          isActive: parsedIsActive
        };
        res.status(200).json(slides[putSlideIndex]); // Kirim slide yang diperbarui
      } else {
        res.status(404).json({ message: 'Slide tidak ditemukan untuk diperbarui.' });
      }
      break;

    case 'DELETE':
      // Menghapus slide berdasarkan ID dari query parameter
      const { id: deleteId } = req.query;

      if (!deleteId || typeof deleteId !== 'string') {
        return res.status(400).json({ message: 'ID slide tidak valid untuk dihapus.' });
      }

      const deleteSlideIndex = slides.findIndex(s => s.id === deleteId);

      if (deleteSlideIndex !== -1) {
        slides.splice(deleteSlideIndex, 1); // Hapus slide dari array
        res.status(204).end(); // 204 No Content untuk DELETE berhasil
      } else {
        res.status(404).json({ message: 'Slide tidak ditemukan untuk dihapus.' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}