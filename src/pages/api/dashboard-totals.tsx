// src/pages/api/dashboard-totals.tsx
import { NextApiRequest, NextApiResponse } from 'next';
import type { DashboardTotals } from '@/types/DashboardTotals';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardTotals> // Specify the response type
) {
  // Hanya izinkan metode GET untuk API ini
  if (req.method === 'GET') {
    // const dashboardTotals: DashboardTotals = {
    //   students: 1250,           // Contoh: Total siswa aktif
    //   teachers: 85,             // Contoh: Total guru dan staf pengajar
    //   majors: 10,               // Contoh: Total jurusan atau program studi
    //   articles: 42,             // Contoh: Total artikel blog
    //   extracurriculars: 8,      // Contoh: Total kegiatan ekstrakurikuler
    //   facilities: 15,           // Contoh: Total fasilitas sekolah (ruang kelas, lab, lapangan)
    //   announcements: 7          // Contoh: Total pengumuman aktif
    // };

    res.status(200);
  } else {
    // Jika metode HTTP lain selain GET, kirim respons 405 Method Not Allowed
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}