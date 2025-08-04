// src/pages/api/majors.tsx
// This is a very simple API Route example using in-memory data.
// For a production application, you MUST connect to a proper database here.

import { NextApiRequest, NextApiResponse } from 'next';
import type { Major } from '@/types/Major'; // Ensure this path is correct

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb', // Sesuaikan dengan kebutuhan Anda
    },
  },
};

// In-memory data store for majors
let majorsData: Major[] = [
  {
    id: '1', // Changed to string ID for consistency
    name: 'IPA (Ilmu Pengetahuan Alam)',
    image: 'https://images.unsplash.com/photo-1577896825222-be16c3182885?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Fokus pada Fisika, Kimia, Biologi, dan Matematika.Jurusan ini mengajarkan tentang software engineering.\n\nSiswa akan belajar coding, database, dan UI/UX.' ,
    slug: 'ipa', // Example slug
  },
  {
    id: '2', // Changed to string ID
    name: 'IPS (Ilmu Pengetahuan Sosial)',
    image: 'https://images.unsplash.com/photo-1543286300-349079a40a01?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Fokus pada Sejarah, Geografi, Sosiologi, dan Ekonomi.',
    slug: 'ips', // Example slug
  },
  {
    id: '3', // Changed to string ID
    name: 'Bahasa dan Budaya',
    image: 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Fokus pada berbagai bahasa asing dan kebudayaan.',
    slug: 'bahasa-dan-budaya', // Example slug
  },
];

// Helper function to generate a slug (optional, but good for consistency)
const generateSlug = (name: string): string => {
  const cleanName = name || '';
  if (!cleanName) return `major-${Date.now()}`; // Fallback to a unique ID
  return cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Major[] | Major | { message: string; id: string | null }> // Response type for messages now also supports `id: string | null`
) {
  if (req.method === 'GET') {
    const { id } = req.query;
  
    // Jika ada query ID, kembalikan satu jurusan
    if (id) {
      const majorId = Array.isArray(id) ? id[0] : id;
      const foundMajor = majorsData.find((major) => major.id === majorId);
      if (foundMajor) {
        return res.status(200).json(foundMajor);
      } else {
        return res.status(404).json({ message: 'Jurusan tidak ditemukan', id: majorId });
      }
    }
  
    // Jika tidak ada ID, kembalikan semua jurusan
    return res.status(200).json(majorsData);

  } else if (req.method === 'POST') {
    // Cast req.body to Partial<Major> for type safety
    const { name, image, description, slug } = req.body as Partial<Major>;

    // Generate a new unique ID as a string
    const existingNumericIds = majorsData
      .map(m => (m.id !== null ? parseInt(m.id) : 0)) // Handle potential nulls in existing data
      .filter(id => !isNaN(id)); // Filter out any NaN from parseInt errors

    const newId = (existingNumericIds.length > 0
      ? Math.max(...existingNumericIds) + 1
      : 1
    ).toString();

    // Create the new major object, ensuring all required fields have a fallback
    const newMajor: Major = {
      id: newId, // New ID is always a string
      name: name || 'Jurusan Baru',
      image: image || '/images/default_major.jpg', // Provide a default image URL
      description: description || '',
      slug: slug || generateSlug(name || ''), // Generate slug if not provided
    };

    majorsData.push(newMajor);
    res.status(201).json(newMajor);
  } else if (req.method === 'PUT') {
    // For PUT, `id` is expected to be part of the body and is required.
    const { id, ...updatedFields } = req.body as Partial<Major> & { id: string };
    const majorId = String(id); // Ensure ID is a string for comparison

    if (!majorId) {
      return res.status(400).json({ message: 'Major ID is required for update.', id: null });
    }

    let found = false;
    majorsData = majorsData.map(major => {
      if (major.id === majorId) {
        found = true;
        // Construct the updated major, providing fallbacks for required fields
        const updatedMajor: Major = {
          ...major, // Start with existing major data
          ...updatedFields, // Overlay updated fields
          // Ensure all required fields remain typed correctly, even if undefined in updatedFields
          id: major.id, // ID remains unchanged
          name: updatedFields.name || major.name,
          image: updatedFields.image || major.image,
          description: updatedFields.description || major.description,
          slug: updatedFields.name ? generateSlug(updatedFields.name) : (updatedFields.slug || major.slug), // Re-generate slug if name changes
        };
        return updatedMajor;
      }
      return major;
    });

    if (!found) {
      return res.status(404).json({ message: 'Major not found.', id: majorId });
    }

    res.status(200).json({ message: 'Major updated successfully', id: majorId });
  } else if (req.method === 'DELETE') {
    // For DELETE, ID typically comes from query parameter
    const { id } = req.query;
    // Ensure ID is a single string for comparison
    const majorIdToDelete = Array.isArray(id) ? id[0] : (id ? String(id) : null);

    if (!majorIdToDelete) {
      return res.status(400).json({ message: 'Major ID is required for deletion.', id: null });
    }

    const initialLength = majorsData.length;
    // Filter majors based on string ID
    majorsData = majorsData.filter(major => major.id !== majorIdToDelete);

    if (majorsData.length === initialLength) {
      return res.status(404).json({ message: 'Major not found.', id: majorIdToDelete });
    }

    res.status(200).json({ message: 'Major deleted successfully', id: majorIdToDelete });
  } else {
    // Method Not Allowed for other HTTP methods
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}