export default function handler(req, res) {
    const dashboardTotals = {
      students: 1250,        // Contoh: Total siswa aktif
      teachers: 85,          // Contoh: Total guru dan staf pengajar
      majors: 10,            // Contoh: Total jurusan atau program studi
      articles: 42,          // Contoh: Total artikel blog
      extracurriculars: 8,   // Contoh: Total kegiatan ekstrakurikuler
      facilities: 15,        // Contoh: Total fasilitas sekolah (ruang kelas, lab, lapangan)
      announcements: 7       // Contoh: Total pengumuman aktif
    };
  
    res.status(200).json(dashboardTotals);
  }