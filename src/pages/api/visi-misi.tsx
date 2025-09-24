// src/pages/api/visi-misi.tsx
import { NextApiRequest, NextApiResponse } from 'next';
import type { VisiMisiData } from '@/types/VisiMisi';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<VisiMisiData> // Specify the response type
) {
  if (req.method === 'GET') {
    const visiMisiData: VisiMisiData = {
      visi: "Menjadi Pusat Pendidikan dan Penelatihan Vokasi yang Berbasis Digital untuk Mewujudkan SDM Unggul Bersaing di Era Global",
      misi: [
        "Mengembangkan karakter siswa yang religius, jujur, disiplin, dan bertanggung jawab.",
        "Melaksanakan pembelajaran yang inovatif dan berpusat pada siswa untuk mengembangkan potensi akademik dan non-akademik.",
        "Meningkatkan kompetensi guru dan tenaga kependidikan secara berkelanjutan.",
        "Menciptakan lingkungan sekolah yang aman, nyaman, bersih, dan kondusif untuk belajar.",
        "Menjalin kerja sama yang harmonis dengan orang tua, masyarakat, dan dunia industri."
      ]
    };

    res.status(200).json(visiMisiData);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}