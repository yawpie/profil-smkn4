import { NextApiRequest, NextApiResponse } from 'next';
import type { Extracurricular } from '@/types/Extracurricular'; // Pastikan path ini benar

// Data ekstrakurikuler yang disimpan di memori
let extracurricularsData: Extracurricular[] = [
  {
    id: '1', // ID sebagai string
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
    // Dapatkan properti dari body request dan menipekannya
    const { name, image, description, coach, schedule } = req.body as Partial<Extracurricular>;

    // Menghasilkan ID unik baru sebagai string
    const newId = (extracurricularsData.length > 0
      ? Math.max(...extracurricularsData.map(e => parseInt(e.id))) + 1
      : 1
    ).toString();

    const newExtracurricular: Extracurricular = {
      id: newId,
      name: name || 'Ekstrakurikuler Baru',
      description: description || '',
      image: image || '/images/default_ekskul.jpg', // Fallback gambar default
      coach: coach || 'Belum Ditentukan',
      schedule: schedule || 'Belum Ditentukan',
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
        // Menyusun objek secara manual untuk memastikan semua properti wajib ada
        const updatedExt: Extracurricular = {
          ...ext, 
          id: ext.id, // ID tidak berubah
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
    // ID dari query parameter bisa string atau array string, pastikan jadi string tunggal
    const extracurricularIdToDelete = Array.isArray(id) ? id[0] : String(id);

    if (!extracurricularIdToDelete) {
      return res.status(400).json({ message: 'ID ekstrakurikuler diperlukan untuk penghapusan.', id: '' });
    }

    const initialLength = extracurricularsData.length;
    // Filter berdasarkan ID string
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