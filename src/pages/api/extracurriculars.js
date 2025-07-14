// src/pages/api/extracurriculars.js
// Ini adalah contoh API Route yang sangat sederhana dengan data di memori
// Untuk aplikasi produksi, Anda akan terhubung ke database di sini.

let extracurricularsData = [
  {
    id: 1,
    name: 'Futsal',
    image: 'https://images.unsplash.com/photo-1547347963-f09b537c3527?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Ekstrakurikuler olahraga futsal untuk mengembangkan bakat dan sportivitas.',
    coach: 'Budi Santoso',
    schedule: 'Senin, 15.00-17.00',
  },
  {
    id: 2,
    name: 'Pramuka',
    image: 'https://images.unsplash.com/photo-1549497914-46c927329b3c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Ekstrakurikuler kepanduan untuk melatih kemandirian dan kepemimpinan.',
    coach: 'Siti Aminah',
    schedule: 'Rabu, 14.00-16.00',
  },
  {
    id: 3,
    name: 'Paskibra',
    image: 'https://images.unsplash.com/photo-1596700676451-87771765c82a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Ekstrakurikuler baris-berbaris untuk kedisiplinan dan kekompakan.',
    coach: 'Agus Salim',
    schedule: 'Jumat, 16.00-18.00',
  },
];

export default function handler(req, res) {
  // PENTING: Data ini hanya disimpan di memori server.
  // Data akan direset setiap kali server Next.js di-restart.
  // Untuk data persisten, Anda HARUS mengintegrasikan database.

  if (req.method === 'GET') {
    res.status(200).json(extracurricularsData);
  } else if (req.method === 'POST') {
    const newExtracurricular = {
      id: extracurricularsData.length > 0 ? Math.max(...extracurricularsData.map(e => e.id)) + 1 : 1,
      ...req.body,
    };
    extracurricularsData.push(newExtracurricular);
    res.status(201).json(newExtracurricular);
  } else if (req.method === 'PUT') {
    const { id, ...updatedFields } = req.body;
    extracurricularsData = extracurricularsData.map(ext =>
      ext.id === id ? { ...ext, ...updatedFields } : ext
    );
    res.status(200).json({ message: 'Ekstrakurikuler updated', id });
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    extracurricularsData = extracurricularsData.filter(ext => ext.id !== parseInt(id));
    res.status(200).json({ message: 'Ekstrakurikuler deleted', id });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}