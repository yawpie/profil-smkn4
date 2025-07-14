// src/pages/api/articles.js
// Ini adalah contoh API Route yang sangat sederhana dengan data di memori
// Untuk aplikasi produksi, Anda akan terhubung ke database di sini.

let articlesData = [
  {
    id: 1,
    title: 'Manfaat Belajar Coding Sejak Dini',
    image: 'https://images.unsplash.com/photo-1517694711087-ea256799863a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: 'Belajar coding di usia muda dapat melatih logika dan pemecahan masalah. Banyak platform edukasi yang kini menyediakan kurikulum coding interaktif untuk anak-anak.',
    author: 'Budi Setiawan',
    publishDate: '2025-06-10',
  },
  {
    id: 2,
    title: 'Tips Efektif Menghadapi Ujian Nasional',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: 'Persiapan yang matang adalah kunci. Mulai dari membuat jadwal belajar, memahami materi, hingga menjaga kesehatan fisik dan mental.',
    author: 'Dewi Lestari',
    publishDate: '2025-05-20',
  },
  {
    id: 3,
    title: 'Pentingnya Kegiatan Ekstrakurikuler di Sekolah',
    image: 'https://images.unsplash.com/photo-1517840131491-11d7f6b5f9c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: 'Ekstrakurikuler tidak hanya mengisi waktu luang, tetapi juga mengembangkan bakat, minat, dan soft skill siswa yang tidak didapatkan di kelas.',
    author: 'Agus Salim',
    publishDate: '2025-07-01',
  },
];

export default function handler(req, res) {
  // PENTING: Data ini hanya disimpan di memori server.
  // Data akan direset setiap kali server Next.js di-restart.
  // Untuk data persisten, Anda HARUS mengintegrasikan database.

  if (req.method === 'GET') {
    res.status(200).json(articlesData);
  } else if (req.method === 'POST') {
    const newArticle = {
      id: articlesData.length > 0 ? Math.max(...articlesData.map(a => a.id)) + 1 : 1,
      ...req.body,
    };
    articlesData.push(newArticle);
    res.status(201).json(newArticle);
  } else if (req.method === 'PUT') {
    const { id, ...updatedFields } = req.body;
    articlesData = articlesData.map(art =>
      art.id === id ? { ...art, ...updatedFields } : art
    );
    res.status(200).json({ message: 'Article updated', id });
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    articlesData = articlesData.filter(art => art.id !== parseInt(id));
    res.status(200).json({ message: 'Article deleted', id });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}