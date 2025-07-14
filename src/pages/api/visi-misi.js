// pages/api/visi-misi.js

export default function handler(req, res) {
    // Anda bisa mendapatkan data ini dari database, file JSON, atau sumber data lainnya.
    // Untuk contoh ini, kita akan menggunakan data statis.
  
    const visiMisiData = {
      visi: "Mewujudkan lulusan yang beriman, bertakwa, berakhlak mulia, cerdas, terampil, mandiri, dan berwawasan global.",
      misi: [
        "Mengembangkan karakter siswa yang religius, jujur, disiplin, dan bertanggung jawab.",
        "Melaksanakan pembelajaran yang inovatif dan berpusat pada siswa untuk mengembangkan potensi akademik dan non-akademik.",
        "Meningkatkan kompetensi guru dan tenaga kependidikan secara berkelanjutan.",
        "Menciptakan lingkungan sekolah yang aman, nyaman, bersih, dan kondusif untuk belajar.",
        "Menjalin kerja sama yang harmonis dengan orang tua, masyarakat, dan dunia industri."
      ]
    };
  
    res.status(200).json(visiMisiData);
  }