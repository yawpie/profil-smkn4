import { NextApiRequest, NextApiResponse } from 'next';
import type { Teacher } from '@/types/Teacher'; // Pastikan path ini benar

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Sesuaikan dengan kebutuhan Anda
    },
  },
};

// Data guru yang disimpan di memori
let teachersData: Teacher[] = [
  {
    id: '1', // ID diubah menjadi string
    name: 'Budi Santoso, S.Pd.',
    image: 'https://i.pravatar.cc/150?img=68',
    subject: 'Matematika',
    nip: '198001012005011001',
    position: 'Guru Mata Pelajaran',
  },
  {
    id: '2', // ID diubah menjadi string
    name: 'Siti Aminah, M.Pd.',
    image: 'https://i.pravatar.cc/150?img=33',
    subject: 'Bahasa Indonesia',
    nip: '198505102010022005',
    position: 'Guru Bahasa',
  },
  {
    id: '3', // ID diubah menjadi string
    name: 'Agus Salim, S.Kom.',
    image: 'https://i.pravatar.cc/150?img=12',
    subject: 'Informatika',
    nip: '197503151999031010',
    position: 'Waka Kurikulum',
  },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Teacher[] | Teacher | { message: string; id: string }>
) {
  // Hanya simulasi data di memori. Data akan hilang saat server restart.
  // Untuk data persisten, gunakan database.

  if (req.method === 'GET') {
    res.status(200).json(teachersData);
  } else if (req.method === 'POST') {
    // Mendapatkan properti dari body request dan menipekannya
    // ID akan dibuat otomatis oleh API, jadi tidak perlu dari body
    const { name, image, subject, nip, position } = req.body as Partial<Teacher>;

    // Menghasilkan ID unik baru sebagai string
    const existingNumericIds = teachersData
      .map(t => parseInt(t.id)) // Konversi ID string ke number
      .filter(id => !isNaN(id)); // Filter ID yang tidak valid

    const newId = (existingNumericIds.length > 0
      ? Math.max(...existingNumericIds) + 1
      : 1
    ).toString();

    // Pastikan semua properti wajib ada dengan fallback
    const newTeacher: Teacher = {
      id: newId, // ID baru selalu string
      name: name || 'Nama Guru Baru',
      image: image || 'https://i.pravatar.cc/150', // Default avatar
      subject: subject || 'Umum',
      nip: nip || null, // NIP bisa null
      position: position || 'Tenaga Pengajar',
    };
    teachersData.push(newTeacher);
    res.status(201).json(newTeacher);
  } else if (req.method === 'PUT') {
    // Untuk PUT, `id` diharapkan ada di body dan wajib
    const { id, ...updatedFields } = req.body as Partial<Teacher> & { id: string };
    const teacherId = String(id); // Pastikan ID adalah string untuk perbandingan

    if (!teacherId) {
      return res.status(400).json({ message: 'Teacher ID is required for update.', id: '' });
    }

    let found = false;
    teachersData = teachersData.map(teacher => {
      if (teacher.id === teacherId) {
        found = true;
        // Menyusun objek secara manual untuk memastikan semua properti wajib ada
        const updatedTeacher: Teacher = {
          ...teacher, // Mulai dari data guru yang sudah ada
          ...updatedFields, // Timpa dengan field yang diperbarui
          // Pastikan properti wajib yang mungkin tidak disediakan tetap ada dengan fallback
          id: teacher.id, // ID tidak berubah
          name: updatedFields.name || teacher.name,
          image: updatedFields.image || teacher.image,
          subject: updatedFields.subject || teacher.subject,
          nip: updatedFields.nip !== undefined ? updatedFields.nip : teacher.nip, // NIP bisa null, jadi cek undefined
          position: updatedFields.position || teacher.position,
        };
        return updatedTeacher;
      }
      return teacher;
    });

    if (!found) {
      return res.status(404).json({ message: 'Teacher not found.', id: teacherId });
    }

    res.status(200).json({ message: 'Teacher updated successfully', id: teacherId });
  } else if (req.method === 'DELETE') {
    const { id } = req.query; // Untuk DELETE, ID dari query parameter
    // Pastikan ID adalah string tunggal
    const teacherIdToDelete = Array.isArray(id) ? id[0] : String(id);

    if (!teacherIdToDelete) {
      return res.status(400).json({ message: 'Teacher ID is required for deletion.', id: '' });
    }

    const initialLength = teachersData.length;
    teachersData = teachersData.filter(teacher => teacher.id !== teacherIdToDelete);

    if (teachersData.length === initialLength) {
      return res.status(404).json({ message: 'Teacher not found.', id: teacherIdToDelete });
    }

    res.status(200).json({ message: 'Teacher deleted successfully', id: teacherIdToDelete });
  } else {
    // Metode HTTP tidak diizinkan
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}