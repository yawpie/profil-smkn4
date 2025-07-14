// src/pages/api/announcements.js
// Ini adalah contoh API Route yang sangat sederhana dengan data di memori
// Untuk aplikasi produksi, Anda akan terhubung ke database di sini.

let announcementsData = [
    {
      id: 1,
      title: 'Libur Hari Raya Idul Fitri 1446 H',
      content: 'Diberitahukan kepada seluruh siswa dan staf bahwa kegiatan belajar mengajar akan diliburkan dari tanggal 1 hingga 7 April 2025 dalam rangka Hari Raya Idul Fitri.',
      publishDate: '2025-03-25',
      status: 'Published',
    },
    {
      id: 2,
      title: 'Rapat Orang Tua Murid Kelas X',
      content: 'Akan diadakan rapat orang tua murid kelas X pada hari Sabtu, 15 April 2025, pukul 09.00 WIB di Aula Sekolah. Diharapkan kehadiran Bapak/Ibu sekalian.',
      publishDate: '2025-04-05',
      status: 'Draft',
    },
    {
      id: 3,
      title: 'Perlombaan Kreativitas Siswa',
      content: 'Dalam rangka memperingati Hari Pendidikan Nasional, sekolah akan mengadakan perlombaan kreativitas siswa. Pendaftaran dibuka mulai tanggal 10 April 2025.',
      publishDate: '2025-04-08',
      status: 'Published',
    },
  ];
  
  export default function handler(req, res) {
    // PENTING: Data ini hanya disimpan di memori server.
    // Data akan direset setiap kali server Next.js di-restart.
    // Untuk data persisten, Anda HARUS mengintegrasikan database.
  
    if (req.method === 'GET') {
      res.status(200).json(announcementsData);
    } else if (req.method === 'POST') {
      const newAnnouncement = {
        id: announcementsData.length > 0 ? Math.max(...announcementsData.map(a => a.id)) + 1 : 1,
        ...req.body,
      };
      announcementsData.push(newAnnouncement);
      res.status(201).json(newAnnouncement);
    } else if (req.method === 'PUT') {
      const { id, ...updatedFields } = req.body;
      announcementsData = announcementsData.map(ann =>
        ann.id === id ? { ...ann, ...updatedFields } : ann
      );
      res.status(200).json({ message: 'Announcement updated', id });
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      announcementsData = announcementsData.filter(ann => ann.id !== parseInt(id));
      res.status(200).json({ message: 'Announcement deleted', id });
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }     