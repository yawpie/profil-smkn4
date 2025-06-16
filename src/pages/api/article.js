// pages/api/articles.js

export default function handler(req, res) {

    if (req.method === 'GET') {
      const daftarArticlesData = [
        {
          id: 1,
          title: "Cara Memilih Ekstrakurikuler yang cocok untuk kami",
          categories: "BASKET BELAJAR SEPAK BOLA",
          date: "January 28, 2024",
          image: "/public/images/tes.png",
          link: "/artikel/cara-memilih-ekstrakurikuler",
        },
        {
          id: 2,
          title: "Rumus matematika yang sering di pakai dan di lupakan",
          categories: "MATEMATIKA TIPS DAN TRIK",
          date: "January 28, 2024",
          image: "/uploads/artikel/math-formula.jpg",
          link: "/artikel/rumus-matematika",
        },
        {
          id: 3,
          title: "Manfaat dari Belajar Berkelompok Secara Rutin",
          categories: "BELAJAR TIPS DAN TRIK",
          date: "January 28, 2024",
          image: "/uploads/artikel/group-study.jpg",
          link: "/artikel/belajar-berkelompok",
        },
        {
          id: 4,
          title: "Cara Belajar Berhitung yang Mudah dan Cepat",
          categories: "TIPS DAN TRIK",
          date: "January 28, 2024",
          image: "/uploads/artikel/counting.jpg",
          link: "/artikel/cara-belajar-berhitung",
        },
        {
          id: 5,
          title: "Sosok guru yang humoris calon guru terbaik 2022-2023",
          categories: "ALUMNI BERITA",
          date: "January 27, 2024",
          image: "/uploads/artikel/humorous-teacher.jpg",
          link: "/artikel/guru-humoris",
        },
        {
          id: 6,
          title: "Tips Sukses Menghadapi Ujian Nasional",
          categories: "BELAJAR TIPS DAN TRIK",
          date: "January 27, 2024",
          image: "/uploads/artikel/exam-tips.jpg",
          link: "/artikel/tips-ujian-nasional",
        },
        // Anda bisa menambahkan lebih banyak data artikel dummy di sini
      ];
  
      // Mengirimkan data artikel dengan status 200 OK
      res.status(200).json(daftarArticlesData);
    } else {
      // Jika metode HTTP selain GET, kirimkan status 405 Method Not Allowed
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }