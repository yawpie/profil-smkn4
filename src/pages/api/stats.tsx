// src/pages/api/school-stats.tsx
import { NextApiRequest, NextApiResponse } from 'next';
import type { SchoolStats } from '@/types/SchoolStats';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SchoolStats> // Specify the response type
) {
  // Hanya izinkan metode GET untuk API ini
  if (req.method === 'GET') {
    const schoolStats: SchoolStats = {
      totalStudents: 1250, // Contoh: Total siswa aktif
      totalMajors: 10,     // Contoh: Total jurusan atau program studi
      totalTeachers: 85    // Contoh: Total guru dan staf pengajar
    };

    res.status(200).json(schoolStats);
  } else {
    // Jika metode HTTP lain selain GET, kirim respons 405 Method Not Allowed
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}