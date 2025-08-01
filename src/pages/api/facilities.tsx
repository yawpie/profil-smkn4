// src/pages/api/facilities.tsx
// This is a very simple API Route example using in-memory data.
// For a production application, you MUST connect to a proper database here.

import { NextApiRequest, NextApiResponse } from 'next';
import type { Facility } from '@/types/Facility'; // Ensure this path is correct

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
  // IMPORTANT: This data is stored ONLY in server memory.
  // It will reset every time your Next.js server restarts.
  // For persistent data, you must integrate a database.

  if (req.method === 'GET') {
    res.status(200).json(facilitiesData);
  } else if (req.method === 'POST') {
    // Cast req.body to Partial<Facility> for type safety
    const { name, image, description, location, status } = req.body as Partial<Facility>;

    // Generate a new unique ID as a string. Filter out null IDs before finding max.
    const existingNumericIds = facilitiesData
      .map(f => (f.id !== null ? parseInt(f.id) : 0))
      .filter(id => !isNaN(id)); // Filter out any NaN from parseInt errors

    const newId = (existingNumericIds.length > 0
      ? Math.max(...existingNumericIds) + 1
      : 1
    ).toString();

    // Create the new facility object, ensuring all required fields have a fallback
    const newFacility: Facility = {
      id: newId, // New ID is always a string
      name: name || 'Nama Fasilitas Baru',
      image: image || '/images/default_facility.jpg', // Provide a default image URL
      description: description || '',
      location: location || 'Lokasi Tidak Diketahui',
      // Ensure status is one of the literal types, with a default fallback
      status: status || 'Tersedia', // Default status if not provided
    };

    facilitiesData.push(newFacility);
    res.status(201).json(newFacility);
  } else if (req.method === 'PUT') {
    // For PUT, `id` is expected to be part of the body and is required.
    // Cast req.body to include `id: string` specifically for PUT.
    const { id, ...updatedFields } = req.body as Partial<Facility> & { id: string };
    const facilityId = String(id); // Ensure ID is a string for comparison

    if (!facilityId) {
      return res.status(400).json({ message: 'Facility ID is required for update.', id: null });
    }

    let found = false;
    facilitiesData = facilitiesData.map(facility => {
      if (facility.id === facilityId) {
        found = true;
        // Construct the updated facility, providing fallbacks for required fields
        const updatedFacility: Facility = {
          ...facility, // Start with existing facility data
          ...updatedFields, // Overlay updated fields
          // Ensure all required fields remain typed correctly, even if undefined in updatedFields
          id: facility.id, // ID remains unchanged
          name: updatedFields.name || facility.name,
          image: updatedFields.image || facility.image,
          description: updatedFields.description || facility.description,
          location: updatedFields.location || facility.location,
          status: updatedFields.status || facility.status, // Ensure valid status type
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
    // For DELETE, ID typically comes from query parameter
    const { id } = req.query;
    // Ensure ID is a single string for comparison
    const facilityIdToDelete = Array.isArray(id) ? id[0] : (id ? String(id) : null);

    if (!facilityIdToDelete) {
      return res.status(400).json({ message: 'Facility ID is required for deletion.', id: null });
    }

    const initialLength = facilitiesData.length;
    // Filter facilities based on string ID
    facilitiesData = facilitiesData.filter(facility => facility.id !== facilityIdToDelete);

    if (facilitiesData.length === initialLength) {
      return res.status(404).json({ message: 'Facility not found.', id: facilityIdToDelete });
    }

    res.status(200).json({ message: 'Facility deleted successfully', id: facilityIdToDelete });
  } else {
    // Method Not Allowed for other HTTP methods
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}