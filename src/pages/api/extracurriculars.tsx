// src/pages/api/extracurriculars.tsx

import { NextApiRequest, NextApiResponse } from 'next';
import type { Extracurricular } from '@/types/Extracurricular'; // Pastikan path ini benar

// Tambahkan konfigurasi ini untuk meningkatkan batas ukuran payload
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb', // Sesuaikan dengan kebutuhan Anda, misal '10mb'
    },
  },
};

// Data ekstrakurikuler yang disimpan di memori
let extracurricularsData: Extracurricular[] = [
  {
    id: '1',
    name: 'Futsal',
    image: 'https://images.unsplash.com/photo-1547347963-f09b537c3527?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Ekstrakurikuler olahraga futsal untuk mengembangkan bakat dan sportivitas.',
    coach: 'Budi Santoso',
    schedule: 'Senin, 15.00-17.00',
  },
  {
    id: '2',
    name: 'Pramuka',
    image: 'https://images.unsplash.com/photo-1549497914-46c927329b3c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Ekstrakurikuler kepanduan untuk melatih kemandirian dan kepemimpinan.',
    coach: 'Siti Aminah',
    schedule: 'Rabu, 14.00-16.00',
  },
  {
    id: '3',
    name: 'Paskibra',
    image: 'https://images.unsplash.com/photo-1596700676451-87771765c82a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Ekstrakurikuler baris-berbaris untuk kedisiplinan dan kekompakan.',
    coach: 'Agus Salim',
    schedule: 'Jumat, 16.00-18.00',
  },
];

// Handler untuk rute API
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Extracurricular[] | Extracurricular | { message: string; id: string }>
) {
  if (req.method === 'GET') {
    const { id } = req.query;
  
    if (id) {
      const selected = extracurricularsData.find((e) => e.id === String(id));
      if (selected) {
        return res.status(200).json(selected);
      } else {
        return res.status(404).json({ message: 'Ekstrakurikuler tidak ditemukan.', id: String(id) });
      }
    }
    return res.status(200).json(extracurricularsData);
  
  } else if (req.method === 'POST') {
    const { name, image, description, coach, schedule } = req.body as Partial<Extracurricular>;

    // Validasi input wajib
    if (!name || !coach || !schedule) {
      return res.status(400).json({ message: 'Nama, pelatih, dan jadwal wajib diisi!', id: '' });
    }

    // Menghasilkan ID unik baru yang lebih andal
    const newId = (Date.now() + Math.floor(Math.random() * 1000)).toString();

    const newExtracurricular: Extracurricular = {
      id: newId,
      name: name,
      description: description || '',
      // Fallback gambar default jika tidak ada gambar yang diunggah
      image: image || 'https://images.unsplash.com/photo-1586348902889-437aa5a670fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fG5vJTIwaW1hZ2V8ZW58MHx8MHx8&auto=format&fit=crop&w=1920&q=90',
      coach: coach,
      schedule: schedule,
    };
    extracurricularsData.push(newExtracurricular);
    res.status(201).json(newExtracurricular);

  } else if (req.method === 'PUT') {
    const { id, ...updatedFields } = req.body as Partial<Extracurricular> & { id: string };
    const extracurricularId = String(id); 
    if (!extracurricularId) {
      return res.status(400).json({ message: 'ID ekstrakurikuler diperlukan untuk pembaruan.', id: '' });
    }

    let found = false;
    extracurricularsData = extracurricularsData.map(ext => {
      if (ext.id === extracurricularId) {
        found = true;
        const updatedExt: Extracurricular = {
          ...ext, 
          ...updatedFields,
          id: ext.id,
          name: updatedFields.name || ext.name,
          description: updatedFields.description || ext.description,
          image: updatedFields.image || ext.image,
          coach: updatedFields.coach || ext.coach,
          schedule: updatedFields.schedule || ext.schedule,
        };
        return updatedExt;
      }
      return ext;
    });

    if (!found) {
      return res.status(404).json({ message: 'Ekstrakurikuler tidak ditemukan.', id: extracurricularId });
    }

    res.status(200).json({ message: 'Ekstrakurikuler diperbarui', id: extracurricularId });

  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    const extracurricularIdToDelete = Array.isArray(id) ? id[0] : String(id);

    if (!extracurricularIdToDelete) {
      return res.status(400).json({ message: 'ID ekstrakurikuler diperlukan untuk penghapusan.', id: '' });
    }

    const initialLength = extracurricularsData.length;
    extracurricularsData = extracurricularsData.filter(ext => ext.id !== extracurricularIdToDelete);

    if (extracurricularsData.length === initialLength) {
      return res.status(404).json({ message: 'Ekstrakurikuler tidak ditemukan.', id: extracurricularIdToDelete });
    }

    res.status(200).json({ message: 'Ekstrakurikuler dihapus', id: extracurricularIdToDelete });

  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}