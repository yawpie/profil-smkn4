// src/pages/api/facilities.js
// This is a very simple API Route example using in-memory data.
// For a production application, you MUST connect to a proper database here.

let facilitiesData = [
  {
    id: 1,
    name: 'Lapangan Basket',
    image: 'https://images.unsplash.com/photo-1579952877140-fd1136b328a2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Lapangan outdoor untuk kegiatan basket.',
    location: 'Area Olahraga',
    status: 'Tersedia',
  },
  {
    id: 2,
    name: 'Laboratorium Komputer',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f787b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Dilengkapi 30 PC dan proyektor.',
    location: 'Gedung A, Lantai 2',
    status: 'Digunakan',
  },
  {
    id: 3,
    name: 'Perpustakaan',
    image: 'https://images.unsplash.com/photo-1521587765099-efb676f188fa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Koleksi buku lengkap, area baca nyaman.',
    location: 'Gedung B, Lantai 1',
    status: 'Tersedia',
  },
];

export default function handler(req, res) {
  // IMPORTANT: This data is stored ONLY in server memory.
  // It will reset every time your Next.js server restarts.
  // For persistent data, you must integrate a database.

  if (req.method === 'GET') {
    res.status(200).json(facilitiesData);
  } else if (req.method === 'POST') {
    const newFacility = {
      id: facilitiesData.length > 0 ? Math.max(...facilitiesData.map(f => f.id)) + 1 : 1,
      ...req.body,
    };
    facilitiesData.push(newFacility);
    res.status(201).json(newFacility);
  } else if (req.method === 'PUT') {
    const { id, ...updatedFields } = req.body;
    facilitiesData = facilitiesData.map(facility =>
      facility.id === id ? { ...facility, ...updatedFields } : facility
    );
    res.status(200).json({ message: 'Facility updated', id });
  } else if (req.method === 'DELETE') {
    const { id } = req.query; // For DELETE, ID often comes from query parameter
    facilitiesData = facilitiesData.filter(facility => facility.id !== parseInt(id));
    res.status(200).json({ message: 'Facility deleted', id });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}