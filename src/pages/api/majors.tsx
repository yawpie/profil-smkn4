// src/pages/api/majors.tsx
// This is a very simple API Route example using in-memory data.
// For a production application, you MUST connect to a proper database here.

// import { NextApiRequest, NextApiResponse } from 'next';
// import type { Major } from '@/types/Major';

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: '10mb', // Sesuaikan dengan kebutuhan Anda
//     },
//   },
// };

// // In-memory data store for majors
// // let majorsData: Major[] = [
// //   {
// //     id: '1',
// //     name: 'Perhotelan',
// //     image: 'https://images.unsplash.com/photo-1549294413-26f195200c3c?q=80&w=2070&auto=format&fit=crop',
// //     description: 'Mempelajari manajemen operasional hotel, pelayanan tamu, tata hidang, serta industri pariwisata secara profesional.',
// //     slug: 'perhotelan',
// //   },
// //   {
// //     id: '2',
// //     name: 'Kuliner',
// //     image: 'https://images.unsplash.com/photo-1556910906-8c909618b746?q=80&w=2070&auto=format&fit=crop',
// //     description: 'Mengasah kreativitas dalam mengolah makanan, teknik memasak, patiseri, dan kewirausahaan di bidang kuliner.',
// //     slug: 'kuliner',
// //   },
// //   {
// //     id: '3',
// //     name: 'Usaha Perjalanan Wisata',
// //     image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=2070&auto=format&fit=crop',
// //     description: 'Membekali siswa dengan keahlian dalam perencanaan, pemasaran, dan operasional paket perjalanan wisata.',
// //     slug: 'usaha-perjalanan-wisata',
// //   },
// //   {
// //     id: '4',
// //     name: 'Tata Busana',
// //     image: 'https://images.unsplash.com/photo-1581452140409-7756f17e06a8?q=80&w=2070&auto=format&fit=crop',
// //     description: 'Mempelajari desain, pola, dan teknik menjahit busana sesuai tren terkini untuk siap berkarir di industri fashion.',
// //     slug: 'tata-busana',
// //   },
// //   {
// //     id: '5',
// //     name: 'Kecantikan & SPA',
// //     image: 'https://images.unsplash.com/photo-1629131666497-6a4574944985?q=80&w=2070&auto=format&fit=crop',
// //     description: 'Fokus pada teknik tata rias, perawatan kulit, tata rambut, dan keahlian di bidang industri kecantikan dan spa.',
// //     slug: 'kecantikan-dan-spa',
// //   },
// // ];

// // Helper function to generate a slug (optional, but good for consistency)
// const generateSlug = (name: string): string => {
//   const cleanName = name || '';
//   if (!cleanName) return `major-${Date.now()}`; // Fallback to a unique ID
//   return cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
// };

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Major[] | Major | { message: string; id: string | null }> // Response type for messages now also supports `id: string | null`
// ) {
//   if (req.method === 'GET') {
//     const { id } = req.query;
  
//     // Jika ada query ID, kembalikan satu jurusan
//     if (id) {
//       const majorId = Array.isArray(id) ? id[0] : id;
//       const foundMajor = majorsData.find((major) => major.id === majorId);
//       if (foundMajor) {
//         return res.status(200).json(foundMajor);
//       } else {
//         return res.status(404).json({ message: 'Jurusan tidak ditemukan', id: majorId });
//       }
//     }
  
//     // Jika tidak ada ID, kembalikan semua jurusan
//     return res.status(200).json(majorsData);

//   } else if (req.method === 'POST') {
//     // Cast req.body to Partial<Major> for type safety
//     const { name, image, description, slug } = req.body as Partial<Major>;

//     // Generate a new unique ID as a string
//     const existingNumericIds = majorsData
//       .map(m => (m.id !== null ? parseInt(m.id) : 0))
//       .filter(id => !isNaN(id));

//     const newId = (existingNumericIds.length > 0
//       ? Math.max(...existingNumericIds) + 1
//       : 1
//     ).toString();

//     // Create the new major object, ensuring all required fields have a fallback
//     const newMajor: Major = {
//       id: newId,
//       name: name || 'Jurusan Baru',
//       image: image || '/images/default_major.jpg',
//       description: description || '',
//       slug: slug || generateSlug(name || ''),
//     };

//     majorsData.push(newMajor);
//     res.status(201).json(newMajor);
//   } else if (req.method === 'PUT') {
//     // For PUT, `id` is expected to be part of the body and is required.
//     const { id, ...updatedFields } = req.body as Partial<Major> & { id: string };
//     const majorId = String(id);

//     if (!majorId) {
//       return res.status(400).json({ message: 'Major ID is required for update.', id: null });
//     }

//     let found = false;
//     majorsData = majorsData.map(major => {
//       if (major.id === majorId) {
//         found = true;
//         const updatedMajor: Major = {
//           ...major,
//           ...updatedFields,
//           id: major.id,
//           name: updatedFields.name || major.name,
//           image: updatedFields.image || major.image,
//           description: updatedFields.description || major.description,
//           slug: updatedFields.name ? generateSlug(updatedFields.name) : (updatedFields.slug || major.slug),
//         };
//         return updatedMajor;
//       }
//       return major;
//     });

//     if (!found) {
//       return res.status(404).json({ message: 'Major not found.', id: majorId });
//     }

//     res.status(200).json({ message: 'Major updated successfully', id: majorId });
//   } else if (req.method === 'DELETE') {
//     // For DELETE, ID typically comes from query parameter
//     const { id } = req.query;
//     const majorIdToDelete = Array.isArray(id) ? id[0] : (id ? String(id) : null);

//     if (!majorIdToDelete) {
//       return res.status(400).json({ message: 'Major ID is required for deletion.', id: null });
//     }

//     const initialLength = majorsData.length;
//     majorsData = majorsData.filter(major => major.id !== majorIdToDelete);

//     if (majorsData.length === initialLength) {
//       return res.status(404).json({ message: 'Major not found.', id: majorIdToDelete });
//     }

//     res.status(200).json({ message: 'Major deleted successfully', id: majorIdToDelete });
//   } else {
//     // Method Not Allowed for other HTTP methods
//     res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }