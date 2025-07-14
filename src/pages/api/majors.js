// src/pages/api/majors.js
// Ini adalah contoh API Route yang sangat sederhana dengan data di memori
// Untuk aplikasi produksi, Anda akan terhubung ke database di sini.

let majorsData = [
  {
    id: 1,
    name: 'IPA (Ilmu Pengetahuan Alam)',
    image: 'https://images.unsplash.com/photo-1577896825222-be16c3182885?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Fokus pada Fisika, Kimia, Biologi, dan Matematika.'
  },
  {
    id: 2,
    name: 'IPS (Ilmu Pengetahuan Sosial)',
    image: 'https://images.unsplash.com/photo-1543286300-349079a40a01?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Fokus pada Sejarah, Geografi, Sosiologi, dan Ekonomi.'
  },
  {
    id: 3,
    name: 'Bahasa dan Budaya',
    image: 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Fokus pada berbagai bahasa asing dan kebudayaan.'
  },
];

export default function handler(req, res) {
  // PENTING: Data ini hanya disimpan di memori server.
  // Data akan direset setiap kali server Next.js di-restart.
  // Untuk data persisten, Anda HARUS mengintegrasikan database.

  if (req.method === 'GET') {
    res.status(200).json(majorsData);
  } else if (req.method === 'POST') {
    const newMajor = {
      id: majorsData.length > 0 ? Math.max(...majorsData.map(m => m.id)) + 1 : 1,
      ...req.body,
    };
    majorsData.push(newMajor);
    res.status(201).json(newMajor);
  } else if (req.method === 'PUT') {
    const { id, ...updatedFields } = req.body;
    majorsData = majorsData.map(major =>
      major.id === id ? { ...major, ...updatedFields } : major
    );
    res.status(200).json({ message: 'Major updated', id });
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    majorsData = majorsData.filter(major => major.id !== parseInt(id));
    res.status(200).json({ message: 'Major deleted', id });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}