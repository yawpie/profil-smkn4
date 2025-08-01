// src/pages/api/announcements.tsx
// Ini adalah contoh API Route yang sangat sederhana dengan data di memori
// Untuk aplikasi produksi, Anda akan terhubung ke database di sini.

import { NextApiRequest, NextApiResponse } from 'next';
import type { Announcement } from '@/types/Announcement'; // Pastikan path ini benar

// Data pengumuman yang disimpan di memori
let announcementsData: Announcement[] = [
  {
    id: '1',
    title: 'Libur Hari Raya Idul Fitri 1446 H',
    content: 'Diberitahukan kepada seluruh siswa dan staf bahwa kegiatan belajar mengajar akan diliburkan dari tanggal 1 hingga 7 April 2025 dalam rangka Hari Raya Idul Fitri.',
    publishDate: '2025-03-25',
    status: 'Published',
    summary: 'Kegiatan belajar mengajar akan diliburkan dari tanggal 1 hingga 7 April 2025 dalam rangka Hari Raya Idul Fitri.',
    slug: 'libur-hari-raya-idul-fitri-1446-h',
  },
  {
    id: '2',
    title: 'Rapat Orang Tua Murid Kelas X',
    content: 'Akan diadakan rapat orang tua murid kelas X pada hari Sabtu, 15 April 2025, pukul 09.00 WIB di Aula Sekolah. Diharapkan kehadiran Bapak/Ibu sekalian.',
    publishDate: '2025-04-05',
    status: 'Draft',
    summary: 'Rapat orang tua murid kelas X pada hari Sabtu, 15 April 2025, pukul 09.00 WIB di Aula Sekolah.',
    slug: 'rapat-orang-tua-murid-kelas-x',
  },
  {
    id: '3',
    title: 'Perlombaan Kreativitas Siswa',
    content: 'Dalam rangka memperingati Hari Pendidikan Nasional, sekolah akan mengadakan perlombaan kreativitas siswa. Pendaftaran dibuka mulai tanggal 10 April 2025.',
    publishDate: '2025-04-08',
    status: 'Published',
    summary: 'Sekolah akan mengadakan perlombaan kreativitas siswa dalam rangka memperingati Hari Pendidikan Nasional.',
    slug: 'perlombaan-kreativitas-siswa',
  },
];

// Handler untuk rute API
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Announcement[] | Announcement | { message: string; id: string }>
) {
  // Fungsi helper untuk membuat slug
  const generateSlug = (title: string, id: string): string => {
    const cleanTitle = title || '';
    if (!cleanTitle) return id;
    return cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
  };

  if (req.method === 'GET') {
    res.status(200).json(announcementsData);
  } else if (req.method === 'POST') {
    const newId = (announcementsData.length > 0
      ? Math.max(...announcementsData.map(a => parseInt(a.id))) + 1
      : 1
    ).toString();

    // Dapatkan nilai dari req.body dan pastikan tipenya
    const { title, content, publishDate, status, summary, slug } = req.body as Partial<Announcement>;

    const newAnnouncement: Announcement = {
      id: newId,
      title: title || 'Pengumuman Baru', // Pastikan title adalah string
      content: content || '',
      publishDate: publishDate || new Date().toISOString().split('T')[0],
      status: status || 'Draft',
      summary: summary || (content ? content.substring(0, 150) + '...' : ''),
      slug: slug || generateSlug(title || '', newId), // Pastikan title adalah string
    };
    announcementsData.push(newAnnouncement);
    res.status(201).json(newAnnouncement);
  } else if (req.method === 'PUT') {
    const { id, ...updatedFields } = req.body as Partial<Announcement> & { id: string }; // Perlu id untuk PUT
    const announcementId = id ? String(id) : null;

    if (!announcementId) {
      return res.status(400).json({ message: 'ID pengumuman diperlukan untuk pembaruan.', id: '' });
    }

    let found = false;
    announcementsData = announcementsData.map(ann => {
      if (ann.id === announcementId) {
        found = true;
        // Kita perlu menyusun objek secara manual agar TypeScript senang
        const updatedAnn: Announcement = {
          ...ann,
          ...updatedFields,
          // Handle slug update jika title berubah
          slug: updatedFields.title ? generateSlug(updatedFields.title, ann.id) : ann.slug,
          // Pastikan properti wajib lainnya tidak jadi undefined jika tidak disediakan di updatedFields
          title: updatedFields.title || ann.title,
          content: updatedFields.content || ann.content,
          publishDate: updatedFields.publishDate || ann.publishDate,
          status: updatedFields.status || ann.status,
          summary: updatedFields.summary || ann.summary,
        };
        return updatedAnn;
      }
      return ann;
    });

    if (!found) {
      return res.status(404).json({ message: 'Pengumuman tidak ditemukan.', id: announcementId });
    }

    res.status(200).json({ message: 'Pengumuman diperbarui', id: announcementId });
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    const announcementIdToDelete = Array.isArray(id) ? id[0] : String(id);

    if (!announcementIdToDelete) {
      return res.status(400).json({ message: 'ID pengumuman diperlukan untuk penghapusan.', id: '' });
    }

    const initialLength = announcementsData.length;
    announcementsData = announcementsData.filter(ann => ann.id !== announcementIdToDelete);

    if (announcementsData.length === initialLength) {
      return res.status(404).json({ message: 'Pengumuman tidak ditemukan.', id: announcementIdToDelete });
    }

    res.status(200).json({ message: 'Pengumuman dihapus', id: announcementIdToDelete });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}