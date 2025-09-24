// pages/api/achievements.ts

import { NextApiRequest, NextApiResponse } from 'next';
import type { Achievement } from '@/types/Achievement';

// Data dummy untuk simulasi. Ini adalah "database" in-memory.
// Data akan hilang setiap kali server di-restart.
let achievementsData: Achievement[] = [
  {
    id: '1',
    title: 'Juara 1 Lomba Cipta Web Nasional 2024',
    publishDate: '2024-09-15T10:00:00Z',
    description: 'Tim dari SMKN 4 Mataram berhasil meraih juara pertama dalam kompetisi pengembangan web tingkat nasional yang diselenggarakan oleh Kementerian Komunikasi dan Informatika.',
    content: `
      <p>Tim siswa kami, yang terdiri dari Ahmad, Budi, dan Citra, menunjukkan inovasi luar biasa dalam proyek "Eco-Tracker", sebuah platform untuk memantau jejak karbon pribadi. Proyek ini memukau para juri dengan antarmuka yang ramah pengguna dan teknologi back-end yang efisien, mengungguli ratusan peserta dari seluruh Indonesia. Kemenangan ini membuktikan kualitas pendidikan di bidang teknologi yang kami tawarkan.</p>
      <p>Kami sangat bangga dengan pencapaian ini dan berharap dapat menjadi inspirasi bagi siswa-siswi lainnya.</p>
    `,
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Medali Emas Olimpiade Sains Tingkat Provinsi',
    publishDate: '2024-08-20T12:30:00Z',
    description: 'Siswa kelas XI, Siti Nurhaliza, berhasil meraih medali emas dalam Olimpiade Sains Bidang Biologi, mewakili sekolah di tingkat provinsi.',
    content: `
      <p>Siti Nurhaliza, siswi berprestasi dari jurusan IPA, berhasil memenangkan medali emas dalam Olimpiade Sains Provinsi NTB. Persiapannya yang matang dan dedikasinya dalam mempelajari biologi membuatnya unggul dari kompetitor lainnya. Prestasi ini mengantarkannya ke seleksi tingkat nasional.</p>
      <p>Keberhasilan Siti menunjukkan bahwa dengan kerja keras dan bimbingan yang tepat, setiap siswa bisa mencapai impiannya.</p>
    `,
    image: 'https://images.unsplash.com/photo-1517048676731-d85c9a095908?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Peringkat 5 Lomba Desain Grafis Internasional',
    publishDate: '2024-07-10T09:00:00Z',
    description: 'Karya desain grafis oleh Rina Amelia masuk dalam 5 besar terbaik di kompetisi desain internasional "Creative Minds Awards".',
    content: `
      <p>Rina Amelia, siswi jurusan Desain Komunikasi Visual (DKV), membawa nama baik sekolah dengan karyanya yang memukau. Karyanya yang berjudul "Cultural Harmony" menggabungkan elemen tradisional dan modern dengan cara yang unik dan menarik, mendapatkan pujian dari dewan juri internasional.</p>
      <p>Prestasi ini membuktikan bahwa kreativitas siswa kami mampu bersaing di kancah global.</p>
    `,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1470&auto=format&fit=crop',
  },
];

// API Handler
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Achievement[] | Achievement | { message: string; id?: string }>
) {
  switch (req.method) {
    case 'GET':
      // Mengambil ID dari query parameter
      const { id } = req.query;

      if (id && typeof id === 'string') {
        // Jika ada ID, cari prestasi spesifik
        const foundAchievement = achievementsData.find((a) => a.id === id);
        if (foundAchievement) {
          return res.status(200).json(foundAchievement);
        } else {
          return res.status(404).json({ message: 'Prestasi tidak ditemukan.' });
        }
      } else {
        // Jika tidak ada ID, kembalikan semua prestasi, diurutkan terbaru dahulu
        const sortedAchievements = [...achievementsData].sort(
          (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        );
        return res.status(200).json(sortedAchievements);
      }

    case 'POST':
      // Menambah prestasi baru
      const { title, publishDate, description, content, image } = req.body as Partial<Achievement>;
      if (!title || !description || !content) {
        return res.status(400).json({ message: 'Judul, deskripsi, dan konten wajib diisi.' });
      }

      const newId = String(
        achievementsData.length > 0
          ? Math.max(...achievementsData.map((a) => parseInt(a.id))) + 1
          : 1
      );

      const newAchievement: Achievement = {
        id: newId,
        title,
        publishDate: publishDate || new Date().toISOString(),
        description,
        content,
        image: image || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1470&auto=format&fit=crop',
      };

      achievementsData.push(newAchievement);
      return res.status(201).json(newAchievement);

    case 'PUT':
      // Memperbarui prestasi yang sudah ada
      const { id: updateId, ...updatedFields } = req.body as Partial<Achievement> & { id: string };
      if (!updateId) {
        return res.status(400).json({ message: 'ID prestasi diperlukan untuk pembaruan.' });
      }

      let found = false;
      achievementsData = achievementsData.map((ach) => {
        if (ach.id === updateId) {
          found = true;
          return { ...ach, ...updatedFields };
        }
        return ach;
      });

      if (!found) {
        return res.status(404).json({ message: 'Prestasi tidak ditemukan.' });
      }

      const updatedAchievement = achievementsData.find((a) => a.id === updateId);
      return res.status(200).json(updatedAchievement!);

    case 'DELETE':
      // Menghapus prestasi
      const { id: deleteId } = req.body as { id: string };
      if (!deleteId) {
        return res.status(400).json({ message: 'ID prestasi diperlukan untuk penghapusan.' });
      }

      const initialLength = achievementsData.length;
      achievementsData = achievementsData.filter((a) => a.id !== deleteId);

      if (achievementsData.length === initialLength) {
        return res.status(404).json({ message: 'Prestasi tidak ditemukan.' });
      }

      return res.status(200).json({ message: 'Prestasi berhasil dihapus.' });

    default:
      // Metode HTTP tidak diizinkan
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}