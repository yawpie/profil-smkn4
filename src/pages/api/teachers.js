// src/pages/api/teachers.js
// Ini adalah contoh API Route yang sangat sederhana dengan data di memori
// Untuk aplikasi produksi, Anda akan terhubung ke database di sini.

let teachersData = [
  {
    id: 1,
    name: 'Budi Santoso, S.Pd.',
    image: 'https://i.pravatar.cc/150?img=68',
    subject: 'Matematika',
    nip: '198001012005011001',
    position: 'Guru Mata Pelajaran',
  },
  {
    id: 2,
    name: 'Siti Aminah, M.Pd.',
    image: 'https://i.pravatar.cc/150?img=33',
    subject: 'Bahasa Indonesia',
    nip: '198505102010022005',
    position: 'Guru Bahasa',
  },
  {
    id: 3,
    name: 'Agus Salim, S.Kom.',
    image: 'https://i.pravatar.cc/150?img=12',
    subject: 'Informatika',
    nip: '197503151999031010',
    position: 'Waka Kurikulum',
  },
];

export default function handler(req, res) {
  // Hanya simulasi data di memori. Data akan hilang saat server restart.
  // Untuk data persisten, gunakan database.

  if (req.method === 'GET') {
    res.status(200).json(teachersData);
  } else if (req.method === 'POST') {
    const newTeacher = {
      id: teachersData.length > 0 ? Math.max(...teachersData.map(t => t.id)) + 1 : 1,
      ...req.body,
    };
    teachersData.push(newTeacher);
    res.status(201).json(newTeacher);
  } else if (req.method === 'PUT') {
    const { id, ...updatedFields } = req.body;
    teachersData = teachersData.map(teacher =>
      teacher.id === id ? { ...teacher, ...updatedFields } : teacher
    );
    res.status(200).json({ message: 'Teacher updated', id });
  } else if (req.method === 'DELETE') {
    const { id } = req.query; // Untuk DELETE, ID biasanya dari query parameter
    teachersData = teachersData.filter(teacher => teacher.id !== parseInt(id));
    res.status(200).json({ message: 'Teacher deleted', id });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}