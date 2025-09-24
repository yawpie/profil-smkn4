import { NextApiRequest, NextApiResponse } from 'next';
import type { Staff } from '@/types/Staff'; // Pastikan path ini benar

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Sesuaikan dengan kebutuhan Anda
    },
  },
};

// Data staff yang disimpan di memori
let staffData: Staff[] = [
  {
    id: '1',
    name: 'Joko Prabowo, S.H.',
    image: 'https://i.pravatar.cc/150?img=52',
    position: 'Kepala Tata Usaha',
    nip: '197508202000011003',
  },
  {
    id: '2',
    name: 'Maria Ulfah, A.Md.',
    image: 'https://i.pravatar.cc/150?img=47',
    position: 'Staff Keuangan',
    nip: '198803152010022002',
  },
  {
    id: '3',
    name: 'Andi Nugroho, S.T.',
    image: 'https://i.pravatar.cc/150?img=26',
    position: 'Staff Sarana & Prasarana',
    nip: '198011252005031015',
  },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Staff[] | Staff | { message: string; id: string }>
) {
  // Hanya simulasi data di memori. Data akan hilang saat server restart.
  // Untuk data persisten, gunakan database.

  if (req.method === 'GET') {
    res.status(200).json(staffData);
  } else if (req.method === 'POST') {
    const { name, image, position, nip } = req.body as Partial<Staff>;

    const existingNumericIds = staffData
      .map(s => parseInt(s.id))
      .filter(id => !isNaN(id));

    const newId = (existingNumericIds.length > 0
      ? Math.max(...existingNumericIds) + 1
      : 1
    ).toString();

    const newStaff: Staff = {
      id: newId,
      name: name || 'Nama Staff Baru',
      image: image || 'https://i.pravatar.cc/150',
      position: position || 'Staff Administrasi',
      nip: nip,
    };
    staffData.push(newStaff);
    res.status(201).json(newStaff);
  } else if (req.method === 'PUT') {
    const { id, ...updatedFields } = req.body as Partial<Staff> & { id: string };
    const staffId = String(id);

    if (!staffId) {
      return res.status(400).json({ message: 'Staff ID is required for update.', id: '' });
    }

    let found = false;
    staffData = staffData.map(staff => {
      if (staff.id === staffId) {
        found = true;
        const updatedStaff: Staff = {
          ...staff,
          ...updatedFields,
          id: staff.id,
          name: updatedFields.name || staff.name,
          image: updatedFields.image || staff.image,
          position: updatedFields.position || staff.position,
          nip: updatedFields.nip !== undefined ? updatedFields.nip : staff.nip,
        };
        return updatedStaff;
      }
      return staff;
    });

    if (!found) {
      return res.status(404).json({ message: 'Staff not found.', id: staffId });
    }

    res.status(200).json({ message: 'Staff updated successfully', id: staffId });
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    const staffIdToDelete = Array.isArray(id) ? id[0] : String(id);

    if (!staffIdToDelete) {
      return res.status(400).json({ message: 'Staff ID is required for deletion.', id: '' });
    }

    const initialLength = staffData.length;
    staffData = staffData.filter(staff => staff.id !== staffIdToDelete);

    if (staffData.length === initialLength) {
      return res.status(404).json({ message: 'Staff not found.', id: staffIdToDelete });
    }

    res.status(200).json({ message: 'Staff deleted successfully', id: staffIdToDelete });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}