// src/pages/api/facilities.tsx
// This is a very simple API Route example using in-memory data.
// For a production application, you MUST connect to a proper database here.

import { NextApiRequest, NextApiResponse } from 'next';
import type { Facility } from '@/types/Facility'; // Ensure this path is correct

// Tambahkan konfigurasi ini untuk meningkatkan batas ukuran payload
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Sesuaikan dengan kebutuhan Anda
    },
  },
};

// In-memory data store for facilities
let facilitiesData: Facility[] = [
  {
    id: '1', // Changed to string ID for consistency
    name: 'Lapangan Basket',
    image: 'https://images.unsplash.com/photo-1579952877140-fd1136b328a2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Lapangan outdoor untuk kegiatan basket.',
    location: 'Area Olahraga',
    status: 'Tersedia',
  },
  {
    id: '2', // Changed to string ID
    name: 'Laboratorium Komputer',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f787b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Dilengkapi 30 PC dan proyektor.',
    location: 'Gedung A, Lantai 2',
    status: 'Digunakan',
  },
  {
    id: '3', // Changed to string ID
    name: 'Perpustakaan',
    image: 'https://images.unsplash.com/photo-1521587765099-efb676f188fa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Koleksi buku lengkap, area baca nyaman.',
    location: 'Gedung B, Lantai 1',
    status: 'Tersedia',
  },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Facility[] | Facility | { message: string; id: string | null }>
) {
  if (req.method === 'GET') {
    res.status(200).json(facilitiesData);
  } else if (req.method === 'POST') {
    const { name, image, description, location, status } = req.body as Partial<Facility>;

    // Validasi input
    if (!name || !location || !status) {
      return res.status(400).json({ message: 'Nama Fasilitas, Lokasi, dan Status wajib diisi!', id: null });
    }

    // Generate a new unique ID
    const newId = (Date.now() + Math.floor(Math.random() * 1000)).toString();

    // Create the new facility object, ensuring all required fields have a fallback
    const newFacility: Facility = {
      id: newId,
      name: name,
      image: image || 'https://images.unsplash.com/photo-1586348902889-437aa5a670fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fG5vJTIwaW1hZ2V8ZW58MHx8MHx8&auto=format&fit=crop&w=1920&q=90',
      description: description || '',
      location: location,
      status: status,
    };

    facilitiesData.push(newFacility);
    res.status(201).json(newFacility);
  } else if (req.method === 'PUT') {
    const { id, ...updatedFields } = req.body as Partial<Facility> & { id: string };
    const facilityId = String(id);

    if (!facilityId) {
      return res.status(400).json({ message: 'Facility ID is required for update.', id: null });
    }

    let found = false;
    facilitiesData = facilitiesData.map(facility => {
      if (facility.id === facilityId) {
        found = true;
        const updatedFacility: Facility = {
          ...facility,
          ...updatedFields,
          id: facility.id,
          name: updatedFields.name || facility.name,
          image: updatedFields.image || facility.image,
          description: updatedFields.description || facility.description,
          location: updatedFields.location || facility.location,
          status: updatedFields.status || facility.status,
        };
        return updatedFacility;
      }
      return facility;
    });

    if (!found) {
      return res.status(404).json({ message: 'Facility not found.', id: facilityId });
    }

    res.status(200).json({ message: 'Facility updated successfully', id: facilityId });
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    const facilityIdToDelete = Array.isArray(id) ? id[0] : (id ? String(id) : null);

    if (!facilityIdToDelete) {
      return res.status(400).json({ message: 'Facility ID is required for deletion.', id: null });
    }

    const initialLength = facilitiesData.length;
    facilitiesData = facilitiesData.filter(facility => facility.id !== facilityIdToDelete);

    if (facilitiesData.length === initialLength) {
      return res.status(404).json({ message: 'Facility not found.', id: facilityIdToDelete });
    }

    res.status(200).json({ message: 'Facility deleted successfully', id: facilityIdToDelete });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}