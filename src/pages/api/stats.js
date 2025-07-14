
export default function handler(req, res) {

    const schoolStats = {
      totalStudents: 1250, // Angka ini akan Anda ambil dari database (misal: COUNT siswa aktif)
      totalMajors: 10,     // Angka ini akan Anda ambil dari database (misal: COUNT jurusan aktif)
      totalTeachers: 85    // Angka ini akan Anda ambil dari database (misal: COUNT guru aktif)
    };
  
    res.status(200).json(schoolStats);
  }