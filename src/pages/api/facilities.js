// pages/api/facilities.js

export default function handler(req, res) {
    // Simulasikan data fasilitas yang akan datang dari database atau CMS
    const facilitiesData = [
      {
        id: 'perpustakaan',
        name: 'Perpustakaan',
        title: 'Perpustakaan Modern',
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nec dictum massa. Proin nec lacus accumsan, fringilla orci in, fermentum nunc. Duis et est cursus, volutpat sapien sed, viverra ante. Donec ex libero, tristique eu mattis sit amet, fringilla a elit. Aenean ultrices volutpat luctus.\n\nMaecenas et lobortis tellus. Phasellus et mauris eleifend, blandit diam eu, fermentum enim. Etiam consectetur eget eros eget tristique. Aliquam a dui eleifend, pellentesque nulla eget, malesuada mauris. Vivamus est metus, rutrum at leo at, bibendum ullamcorper eros. Vivamus in metus at ipsum faucibus auctor nec quis turpis. Nulla facilisi. Curabitur malesuada elit at ligula vehicula dictum. Nunc in lacus ac mauris sodales cursus. Suspendisse sed rutrum risus, ac porta velit. In placerat eros ut tortor lobortis mattis.`,
        image: '/images/perpustakaan.webp',
      },
      {
        id: 'musholla',
        name: 'Musholla',
        title: 'Taman Bermain yang Luar Biasa', // Mengubah sedikit teks agar berbeda
        description: `Taman bermain kami dirancang untuk mendukung perkembangan fisik dan sosial siswa. Dilengkapi dengan berbagai wahana yang aman dan interaktif, taman ini menjadi tempat ideal bagi siswa untuk melepaskan energi dan belajar melalui permainan. Kami percaya bahwa lingkungan yang menyenangkan akan mendorong kreativitas dan kebahagiaan anak-anak.`,
        image: '/images/img10.webp',
      },
      {
        id: 'ruang_kelas',
        name: 'Ruang Kelas',
        title: 'Ruang Kelas yang Nyaman dan Modern', // Mengubah sedikit teks agar berbeda
        description: `Ruang kelas kami didesain untuk menciptakan lingkungan belajar yang kondusif dan inspiratif. Dilengkapi dengan teknologi proyektor, papan interaktif, dan pendingin udara, setiap kelas mendukung metode pengajaran modern. Tata letak yang fleksibel memungkinkan berbagai aktivitas pembelajaran, mulai dari diskusi kelompok hingga presentasi individu.`,
        image: '/images/profile-hero.webp',
      },
      {
        id: 'full_wifi',
        name: 'Full Wifi',
        title: 'Akses Internet Cepat di Seluruh Area Sekolah', // Mengubah sedikit teks agar berbeda
        description: `Kami menyediakan akses Wi-Fi berkecepatan tinggi di seluruh area sekolah untuk mendukung kebutuhan belajar dan riset siswa serta staf. Dengan koneksi yang stabil, siswa dapat mengakses sumber daya online, mengerjakan tugas, dan berkolaborasi secara efektif. Fasilitas ini adalah bagian dari komitmen kami untuk menyediakan lingkungan belajar yang terhubung.`,
        image: '/images/img10.webp', // Menggunakan gambar yang sama seperti taman bermain
      },
      {
        id: 'Balai_Tari',
        name: 'Balai Tari',
        title: 'Akses Internet Cepat di Seluruh Area Sekolah', // Mengubah sedikit teks agar berbeda
        description: `Kami menyediakan akses Wi-Fi berkecepatan tinggi di seluruh area sekolah untuk mendukung kebutuhan belajar dan riset siswa serta staf. Dengan koneksi yang stabil, siswa dapat mengakses sumber daya online, mengerjakan tugas, dan berkolaborasi secara efektif. Fasilitas ini adalah bagian dari komitmen kami untuk menyediakan lingkungan belajar yang terhubung.`,
        image: '/images/img10.webp', // Menggunakan gambar yang sama seperti taman bermain
      },
    ];
  
    if (req.method === 'GET') {
      res.status(200).json(facilitiesData);
    } else {
      // Handle other HTTP methods if necessary (POST, PUT, DELETE)
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }