// pages/api/articles/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import type { Article } from '@/types/Article';

// Data dummy pengumuman (in-memory, akan hilang saat server restart)
let articlesData: Article[] = [
  {
    id: '1',
    title: 'Manfaat Belajar Coding Sejak Dini',
    image: 'https://images.unsplash.com/photo-1517694711087-ea256799863a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: `
      <p>Belajar coding di usia muda dapat melatih logika dan pemecahan masalah. Ini bukan hanya tentang menjadi seorang programmer, tetapi juga tentang mengembangkan pola pikir komputasi yang sangat berguna di berbagai bidang kehidupan. Siswa akan belajar bagaimana memecah masalah besar menjadi bagian-bagian yang lebih kecil dan mengidentifikasi langkah-langkah logis untuk menyelesaikannya.</p>
      <p>Selain itu, coding juga mengajarkan kreativitas. Dengan coding, seseorang bisa menciptakan aplikasi, game, website, atau bahkan seni digital. Ini membuka pintu bagi ekspresi diri yang unik dan memungkinkan ide-ide abstrak untuk diwujudkan dalam bentuk digital.</p>
      <p>Dunia kerja di masa depan akan semakin bergantung pada teknologi. Memiliki pemahaman dasar tentang coding memberikan keunggulan kompetitif. Ini mempersiapkan individu untuk berbagai profesi, mulai dari pengembang perangkat lunak, analis data, hingga desainer UX/UI. Keterampilan ini juga penting untuk bidang non-teknologi yang kini banyak menggunakan otomatisasi dan data.</p>
      <p>Beberapa manfaat spesifik:</p>
      <ul>
        <li>Meningkatkan kemampuan pemecahan masalah.</li>
        <li>Mengembangkan kreativitas dan inovasi.</li>
        <li>Melatih berpikir logis dan sistematis.</li>
        <li>Membuka peluang karir di industri teknologi.</li>
        <li>Memahami cara kerja teknologi di sekitar kita.</li>
      </ul>
      <p>Oleh karena itu, mendorong anak-anak dan remaja untuk belajar coding sejak dini adalah investasi berharga untuk masa depan mereka.</p>
    `,
    author: 'Budi Setiawan',
    publishDate: '2025-06-10T10:00:00Z',
    summary: 'Melatih logika dan pemecahan masalah sejak dini melalui coding.',
    // Slug dihapus karena tidak digunakan
  },
  {
    id: '2',
    title: 'Tips Efektif Menghadapi Ujian Nasional',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: `
      <p>Persiapan yang matang adalah kunci utama untuk menghadapi Ujian Nasional dengan tenang dan percaya diri. Banyak siswa merasa tertekan menjelang ujian besar ini, tetapi dengan strategi yang tepat, Anda bisa mengurangi kecemasan dan meningkatkan peluang keberhasilan.</p>
      <h3>Strategi Belajar Efektif:</h3>
      <ul>
        <li><strong>Pahami Materi, Jangan Hanya Menghafal:</strong> Fokus pada pemahaman konsep dasar.</li>
        <li><strong>Latihan Soal:</strong> Kerjakan soal-soal tahun sebelumnya untuk membiasakan diri dengan format dan jenis pertanyaan.</li>
        <li><strong>Diskusi Kelompok:</strong> Belajar bersama teman dapat membantu memahami materi yang sulit.</li>
        <li><strong>Jaga Kesehatan:</strong> Tidur cukup, makan bergizi, dan olahraga ringan penting untuk menjaga konsentrasi.</li>
        <li><strong>Kelola Stres:</strong> Lakukan aktivitas yang Anda nikmati untuk meredakan stres.</li>
      </ul>
      <p>Ingatlah bahwa Ujian Nasional adalah bagian dari perjalanan belajar Anda, bukan satu-satunya penentu masa depan. Berikan yang terbaik, dan percaya pada kemampuan diri.</p>
    `,
    author: 'Dewi Lestari',
    publishDate: '2025-05-20T10:00:00Z',
    summary: 'Kunci sukses ujian: persiapan matang, jadwal belajar, materi, dan kesehatan.',
    // Slug dihapus
  },
  {
    id: '3',
    title: 'Pentingnya Kegiatan Ekstrakurikuler di Sekolah',
    image: 'https://images.unsplash.com/photo-1517840131491-11d7f6b5f9c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: `
      <p>Kegiatan ekstrakurikuler (ekskul) seringkali dianggap sekadar pengisi waktu luang setelah jam pelajaran. Namun, peran ekskul jauh lebih penting dari itu. Ekskul merupakan wadah yang efektif bagi siswa untuk mengembangkan bakat, minat, dan keterampilan non-akademik yang tidak selalu terakomodasi dalam kurikulum formal.</p>
      <p>Melalui ekskul, siswa dapat menemukan passion baru, belajar bekerja sama dalam tim, meningkatkan kepercayaan diri, dan mengembangkan soft skills seperti kepemimpinan, komunikasi, dan disiplin. Misalnya, di klub olahraga, siswa belajar tentang kerja keras dan sportivitas. Di klub seni, mereka mengasah kreativitas dan ekspresi diri.</p>
      <h3>Manfaat Ekskul Bagi Siswa:</h3>
      <ul>
        <li><strong>Mengembangkan bakat dan minat di luar pelajaran.</strong></li>
        <li><strong>Meningkatkan keterampilan sosial dan kerja tim.</strong></li>
        <li><strong>Membangun rasa percaya diri dan kepemimpinan.</strong></li>
        <li><strong>Membantu mengatasi stres akademik.</strong></li>
        <li><strong>Menciptakan jaringan pertemanan baru.</strong></li>
      </ul>
      <p>Bagi SMKN 4 Mataram, ekskul adalah bagian integral dari pengembangan siswa secara holistik. Kami mendorong setiap siswa untuk aktif berpartisipasi dalam berbagai pilihan ekskul yang kami tawarkan, karena kami percaya bahwa pengalaman di ekskul akan sangat berharga bagi masa depan mereka.</p>
    `,
    author: 'Agus Salim',
    publishDate: '2025-07-01T10:00:00Z',
    summary: 'Ekstrakurikuler: kembangkan bakat, minat, dan soft skill.',
    // Slug dihapus
  },
  {
    id: '4',
    title: 'Perkembangan Teknologi Pendidikan di SMKN 4',
    image: 'https://images.unsplash.com/photo-1546410531-bb4439c2c62c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: `<p>SMKN 4 Mataram terus beradaptasi dengan perkembangan teknologi dalam dunia pendidikan. Kami telah mengintegrasikan berbagai platform pembelajaran daring dan alat digital untuk mendukung proses belajar mengajar yang lebih interaktif dan efektif. Penggunaan proyektor interaktif, tablet untuk siswa, serta akses ke e-book dan jurnal online menjadi bagian dari komitmen kami.</p>
    <p>Kami juga mengadakan pelatihan rutin bagi guru-guru untuk memastikan mereka mahir dalam memanfaatkan teknologi ini. Tujuannya adalah untuk menciptakan lingkungan belajar yang relevan dengan tuntutan zaman, mempersiapkan siswa menghadapi tantangan digital di masa depan.</p>`,
    author: 'Retno Wulandari',
    publishDate: '2025-07-15T09:30:00Z',
    summary: 'Inovasi teknologi pendidikan di SMKN 4 Mataram untuk pembelajaran yang lebih efektif.',
    // Slug dihapus
  },
  {
    id: '5',
    title: 'Prestasi Siswa SMKN 4 di Lomba Desain Grafis Nasional',
    image: 'https://images.unsplash.com/photo-1526374965328-8742f0f04c00?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: `<p>Selamat kepada tim desain grafis SMKN 4 Mataram yang berhasil meraih juara kedua dalam Lomba Desain Grafis Tingkat Nasional! Prestasi ini merupakan bukti kerja keras, dedikasi, dan bimbingan dari para guru pembimbing.</p>
    <p>Lomba ini diikuti oleh ratusan peserta dari berbagai sekolah kejuruan di seluruh Indonesia. Keberhasilan ini tidak hanya mengharumkan nama sekolah, tetapi juga memotivasi siswa lain untuk terus berprestasi di bidang yang mereka minati. Kami bangga dengan pencapaian luar biasa ini!</p>`,
    author: 'Kepala Sekolah',
    publishDate: '2025-07-28T14:00:00Z',
    summary: 'Tim desain grafis SMKN 4 Mataram meraih juara kedua di lomba tingkat nasional.',
    // Slug dihapus
  },
];

// Helper untuk membuat slug URL-friendly (tetap ada di sini, tapi tidak digunakan dalam logika)
const generateSlug = (title: string): string => {
  if (!title) return `article-${Date.now()}`;
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// API Handler
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Article[] | Article | { message: string; id?: string }>
) {
  if (req.method === 'GET') {
    const { id } = req.query; // Ambil 'id' dari query parameter

    if (id && typeof id === 'string') {
      // Hanya mencari berdasarkan ID
      const foundArticle = articlesData.find((a) => a.id === id);

      if (foundArticle) {
        return res.status(200).json(foundArticle);
      } else {
        return res.status(404).json({ message: 'Artikel tidak ditemukan.' });
      }
    } else {
      // Jika tidak ada 'id' di query, kembalikan semua artikel, diurutkan terbaru dahulu
      const sortedArticles = [...articlesData].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
      return res.status(200).json(sortedArticles);
    }

  } else if (req.method === 'POST') {
    const { title, image, content, author, publishDate, summary } = req.body as Partial<Article>;

    if (!title || !content) {
      return res.status(400).json({ message: 'Judul dan konten wajib diisi.' });
    }

    const newId = (
      articlesData.length > 0
        ? (Math.max(...articlesData.map((a) => parseInt(a.id))) + 1)
        : 1
    ).toString();

    const newArticle: Article = {
      id: newId,
      title,
      image: image || '/images/default_article.jpg',
      content,
      author: author || 'Admin',
      publishDate: publishDate || new Date().toISOString(),
      summary: summary || content.substring(0, 150) + '...',
      // Slug tidak dibuat lagi
    };

    articlesData.push(newArticle);
    return res.status(201).json(newArticle);

  } else if (req.method === 'PUT') {
    const { id, ...updatedFields } = req.body as Partial<Article> & { id: string };

    if (!id) {
      return res.status(400).json({ message: 'ID artikel diperlukan untuk pembaruan.' });
    }

    let found = false;
    articlesData = articlesData.map(art => {
      if (art.id === id) {
        found = true;
        const updatedArt: Article = {
          ...art,
          ...updatedFields,
          id: art.id,
          title: updatedFields.title || art.title,
          image: updatedFields.image || art.image,
          content: updatedFields.content || art.content,
          author: updatedFields.author || art.author,
          publishDate: updatedFields.publishDate || art.publishDate,
          summary: updatedFields.summary || art.summary,
        };
        return updatedArt;
      }
      return art;
    });

    if (!found) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan.', id });
    }

    const returnedArticle = articlesData.find(a => a.id === id);
    return res.status(200).json(returnedArticle || { message: 'Artikel diperbarui', id });

  } else if (req.method === 'DELETE') {
    const { id } = req.body as { id: string };

    if (!id) {
      return res.status(400).json({ message: 'ID artikel diperlukan untuk penghapusan.' });
    }

    const initialLength = articlesData.length;
    articlesData = articlesData.filter((a) => a.id !== id);

    if (articlesData.length === initialLength) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan.', id });
    }

    return res.status(200).json({ message: 'Artikel dihapus', id });

  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}