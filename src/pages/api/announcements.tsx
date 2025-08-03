// pages/api/announcements/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import type { Announcement } from '@/types/Announcement';

// Data dummy pengumuman (in-memory, akan hilang saat server restart)
let announcementsData: Announcement[] = [
  {
    id: '1',
    slug: 'penerimaan-siswa-baru-2025',
    title: 'Penerimaan Siswa Baru Tahun Ajaran 2025/2026 Dibuka!',
    content: `
      Kami dengan bangga mengumumkan pembukaan pendaftaran siswa baru untuk Tahun Ajaran 2025/2026. Ini adalah kesempatan bagi calon siswa yang bersemangat untuk bergabung dengan komunitas belajar kami yang dinamis.
      <h3>Jadwal Penting:</h3>
      <ul>
        <li><strong>Pendaftaran Online:</strong> 1 Juli - 31 Juli 2025</li>
        <li><strong>Tes Seleksi:</strong> 10 Agustus 2025</li>
        <li><strong>Pengumuman Hasil:</strong> 17 Agustus 2025</li>
        <li><strong>Daftar Ulang:</strong> 19 - 25 Agustus 2025</li>
      </ul>
      <p>Pastikan Anda memenuhi semua persyaratan yang tertera di website resmi kami. Segera daftarkan diri Anda dan raih masa depan cerah bersama SMKN 4 Mataram!</p>
      <p>Untuk informasi lebih lanjut dan formulir pendaftaran, kunjungi halaman <a href="/pendaftaran">Pendaftaran Siswa Baru</a>.</p>
    `,
    summary: 'Pendaftaran siswa baru SMKN 4 Mataram tahun ajaran 2025/2026 telah dibuka. Lihat jadwal dan syarat lengkapnya.',
    publishDate: '2025-07-01T08:00:00Z',
    status: 'Published',
  },
  {
    id: '2',
    slug: 'libur-semester-genap',
    title: 'Pengumuman Libur Semester Genap',
    content: `
      <p>Diberitahukan kepada seluruh siswa, guru, dan staf SMKN 4 Mataram, bahwa libur semester genap akan dilaksanakan mulai tanggal <strong>25 Juli 2025 hingga 10 Agustus 2025</strong>.</p>
      <p>Kegiatan belajar mengajar aktif kembali pada tanggal 11 Agustus 2025. Gunakan waktu libur ini untuk beristirahat, berkumpul bersama keluarga, dan melakukan kegiatan positif lainnya. Tetap jaga kesehatan dan keselamatan.</p>
      <p>Selamat berlibur!</p>
    `,
    summary: 'Jadwal libur semester genap SMKN 4 Mataram dari 25 Juli hingga 10 Agustus 2025.',
    publishDate: '2025-07-20T10:00:00Z',
    status: 'Published',
  },
  {
    id: '3',
    slug: 'rapat-wali-murid',
    title: 'Undangan Rapat Wali Murid Kelas XII',
    content: `
      <p>Dengan hormat, kami mengundang Bapak/Ibu wali murid kelas XII untuk menghadiri rapat penting mengenai persiapan Ujian Akhir Sekolah dan kelulusan siswa.</p>
      <h3>Detail Rapat:</h3>
      <ul>
        <li><strong>Tanggal:</strong> 5 Agustus 2025</li>
        <li><strong>Waktu:</strong> 09.00 - Selesai</li>
        <li><strong>Tempat:</strong> Aula Serbaguna SMKN 4 Mataram</li>
      </ul>
      <p>Kehadiran Bapak/Ibu sangat kami harapkan untuk kelancaran proses akhir studi siswa.</p>
    `,
    summary: 'Rapat wali murid kelas XII untuk membahas persiapan Ujian Akhir Sekolah dan kelulusan.',
    publishDate: '2025-07-28T14:30:00Z',
    status: 'Published',
  },
  {
    id: '4',
    slug: 'jadwal-ujian-tulis-susulan',
    title: 'Jadwal Ujian Tulis Susulan Semester Genap',
    content: `
      <p>Diumumkan kepada siswa yang belum mengikuti Ujian Tulis Semester Genap dan memiliki alasan yang dapat dipertanggungjawabkan, dapat mengikuti ujian susulan pada:</p>
      <ul>
        <li><strong>Tanggal:</strong> 1 - 3 September 2025</li>
        <li><strong>Waktu:</strong> Sesuai jadwal yang ditentukan</li>
        <li><strong>Tempat:</strong> Ruang Ujian No. 5</li>
      </ul>
      <p>Harap segera mendaftar ke bagian Kurikulum sebelum tanggal 28 Agustus 2025.</p>
    `,
    summary: 'Informasi jadwal ujian tulis susulan untuk siswa yang belum mengikuti ujian semester genap.',
    publishDate: '2025-08-01T11:00:00Z',
    status: 'Draft',
  },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Announcement[] | Announcement | { message: string; id?: string }>
) {
  if (req.method === 'GET') {
    const { id, slug } = req.query; // Mengambil kedua 'id' dan 'slug'

    // Jika ada 'id' di query, cari pengumuman berdasarkan 'id'
    if (id && typeof id === 'string') {
      const selectedAnnouncement = announcementsData.find((ann) => ann.id === id); // Cari berdasarkan 'id'
      if (selectedAnnouncement) {
        return res.status(200).json(selectedAnnouncement);
      } else {
        return res.status(404).json({ message: 'Pengumuman tidak ditemukan.', id });
      }
    }
    // Jika ada 'slug' di query (fallback jika Anda masih punya link slug dari tempat lain)
    if (slug && typeof slug === 'string') {
      const selectedAnnouncement = announcementsData.find((ann) => ann.slug === slug);
      if (selectedAnnouncement) {
        return res.status(200).json(selectedAnnouncement);
      } else {
        return res.status(404).json({ message: 'Pengumuman tidak ditemukan.', id: slug }); // Mengembalikan slug jika tidak ditemukan
      }
    }

    // Jika tidak ada 'id' atau 'slug' di query, kembalikan semua pengumuman yang Published
    const publishedAnnouncements = announcementsData.filter(ann => ann.status === 'Published');
    return res.status(200).json(publishedAnnouncements);

  } else if (req.method === 'POST') {
    const { title, content, summary, publishDate, status, slug} = req.body as Partial<Announcement>;

    if (!title || !content || !publishDate || !status) {
        return res.status(400).json({ message: 'Judul, konten, tanggal publikasi, dan status wajib diisi.' });
    }

    const newId = (announcementsData.length > 0 ? Math.max(...announcementsData.map(a => parseInt(a.id.replace('a','')))) + 1 : 1).toString();
    const newSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    const newAnnouncement: Announcement = {
        id: `a${newId}`,
        title,
        content,
        summary: summary || content.substring(0, 150) + '...',
        publishDate,
        status,
        slug: newSlug,
    };

    announcementsData.push(newAnnouncement);
    return res.status(201).json(newAnnouncement);

  } else if (req.method === 'PUT') {
    const { id, ...updatedFields } = req.body as Partial<Announcement> & { id: string };
    const announcementId = String(id); 

    if (!announcementId) {
      return res.status(400).json({ message: 'ID pengumuman diperlukan untuk pembaruan.' });
    }

    let found = false;
    announcementsData = announcementsData.map(ann => {
      if (ann.id === announcementId) {
        found = true;
        const updatedAnn: Announcement = {
          ...ann, 
          id: ann.id,
          title: updatedFields.title || ann.title,
          content: updatedFields.content || ann.content,
          summary: updatedFields.summary || ann.summary,
          publishDate: updatedFields.publishDate || ann.publishDate,
          status: updatedFields.status || ann.status,
          slug: updatedFields.slug || ann.slug,
        };
        return updatedAnn;
      }
      return ann;
    });

    if (!found) {
      return res.status(404).json({ message: 'Pengumuman tidak ditemukan.', id: announcementId });
    }

    const returnedAnn = announcementsData.find(a => a.id === announcementId);
    return res.status(200).json(returnedAnn || { message: 'Pengumuman diperbarui', id: announcementId });

  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    const targetId = Array.isArray(id) ? id[0] : String(id);

    if (!targetId) {
      return res.status(400).json({ message: 'ID pengumuman diperlukan untuk penghapusan.' });
    }

    const initialLength = announcementsData.length;
    announcementsData = announcementsData.filter(ann => ann.id !== targetId);

    if (announcementsData.length === initialLength) {
      return res.status(404).json({ message: 'Pengumuman tidak ditemukan.', id: targetId });
    }

    return res.status(200).json({ message: 'Pengumuman dihapus', id: targetId });

  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}