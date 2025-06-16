// pages/api/teachers.js

export default function handler(req, res) {

    if (req.method === 'GET') {
      const daftarTeachersData = [
        { id: 1, name: 'Prof. Sonia Wandari S.pd', role: 'Kepala Sekolah', image: '/images/guru1.jpg' },
        { id: 2, name: 'Bu Lestari', role: 'Guru Bahasa Inggris', image: '/images/guru2.jpg' },
        { id: 3, name: 'Pak Deni', role: 'Guru TIK', image: '/images/guru3.jpg' },
        { id: 4, name: 'Bu Santi', role: 'Guru Biologi', image: '/images/guru4.jpg' },
        { id: 5, name: 'Pak Budi', role: 'Guru Fisika', image: '/images/guru5.jpg' },
        { id: 6, name: 'Bu Wulan', role: 'Guru Kimia', image: '/images/guru6.jpg' },
        { id: 7, name: 'Pak Agus', role: 'Guru PJOK', image: '/images/guru7.jpg' },
        { id: 8, name: 'Bu Indah', role: 'Guru Sejarah', image: '/images/guru8.jpg' },
        { id: 9, name: 'Pak Adi', role: 'Guru Matematika', image: '/images/guru9.jpg' },
        { id: 10, name: 'Bu Nina', role: 'Guru Seni Budaya', image: '/images/guru10.jpg' },
      ];
  
      res.status(200).json(daftarTeachersData);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }