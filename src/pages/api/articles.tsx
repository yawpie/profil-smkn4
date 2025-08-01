// src/pages/api/articles.tsx
// Ini adalah contoh API Route yang sangat sederhana dengan data di memori
// Untuk aplikasi produksi, Anda akan terhubung ke database di sini.

import { NextApiRequest, NextApiResponse } from 'next';
import type { Article } from '@/types/Article'; // Pastikan path ini benar

// Data artikel yang disimpan di memori
let articlesData: Article[] = [
  {
    id: '1', // ID diubah menjadi string
    title: 'Manfaat Belajar Coding Sejak Dini',
    image: 'https://images.unsplash.com/photo-1517694711087-ea256799863a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: 'Belajar coding di usia muda dapat melatih logika dan pemecahan masalah. Banyak platform edukasi yang kini menyediakan kurikulum coding interaktif untuk anak-anak.',
    author: 'Budi Setiawan',
    publishDate: '2025-06-10',
    summary: 'Melatih logika dan pemecahan masalah sejak dini melalui coding.', // Contoh summary
    slug: 'manfaat-belajar-coding-sejak-dini', // Contoh slug
  },
  {
    id: '2',
    title: 'Tips Efektif Menghadapi Ujian Nasional',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: 'Persiapan yang matang adalah kunci. Mulai dari membuat jadwal belajar, memahami materi, hingga menjaga kesehatan fisik dan mental.',
    author: 'Dewi Lestari',
    publishDate: '2025-05-20',
    summary: 'Kunci sukses ujian: persiapan matang, jadwal belajar, materi, dan kesehatan.',
    slug: 'tips-efektif-menghadapi-ujian-nasional',
  },
  {
    id: '3',
    title: 'Pentingnya Kegiatan Ekstrakurikuler di Sekolah',
    image: 'https://images.unsplash.com/photo-1517840131491-11d7f6b5f9c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    content: 'Ekstrakurikuler tidak hanya mengisi waktu luang, tetapi juga mengembangkan bakat, minat, dan soft skill siswa yang tidak didapatkan di kelas.',
    author: 'Agus Salim',
    publishDate: '2025-07-01',
    summary: 'Ekstrakurikuler: kembangkan bakat, minat, dan soft skill di luar jam pelajaran.',
    slug: 'pentingnya-kegiatan-ekstrakurikuler-di-sekolah',
  },
];

// Fungsi helper untuk membuat slug
const generateSlug = (title: string): string => {
  const cleanTitle = title || '';
  if (!cleanTitle) return `article-${Date.now()}`; // Fallback yang lebih unik jika judul kosong
  return cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
};

// Handler untuk rute API
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Article[] | Article | { message: string; id: string }>
) {
  // PENTING: Data ini hanya disimpan di memori server.
  // Data akan direset setiap kali server Next.js di-restart.
  // Untuk data persisten, Anda HARUS mengintegrasikan database.

  if (req.method === 'GET') {
    res.status(200).json(articlesData);
  } else if (req.method === 'POST') {
    // Mendapatkan properti dari body request dan menipekannya
    const { title, image, content, author, publishDate, summary, slug } = req.body as Partial<Article>;

    // Menghasilkan ID unik baru sebagai string
    const newId = (articlesData.length > 0
      ? Math.max(...articlesData.map(a => parseInt(a.id))) + 1
      : 1
    ).toString();

    const newArticle: Article = {
      id: newId,
      title: title || 'Judul Artikel Baru', // Pastikan title selalu string
      image: image || '/images/default_article.jpg', // Fallback gambar default
      content: content || '',
      author: author || 'Admin',
      publishDate: publishDate || new Date().toISOString().slice(0, 10),
      summary: summary || (content ? content.substring(0, 150) + '...' : ''),
      slug: slug || generateSlug(title || ''), // Pastikan title adalah string
    };
    articlesData.push(newArticle);
    res.status(201).json(newArticle);
  } else if (req.method === 'PUT') {
    // Mendapatkan id dan field yang diperbarui
    const { id, ...updatedFields } = req.body as Partial<Article> & { id: string };
    const articleId = id ? String(id) : null;

    if (!articleId) {
      return res.status(400).json({ message: 'ID artikel diperlukan untuk pembaruan.', id: '' });
    }

    let found = false;
    articlesData = articlesData.map(art => {
      if (art.id === articleId) {
        found = true;
        // Menyusun objek secara manual untuk memastikan tipe yang benar
        const updatedArticle: Article = {
          ...art, // Mulai dari artikel yang sudah ada
          ...updatedFields, // Timpa dengan field yang diperbarui
          // Pastikan properti wajib yang mungkin tidak disediakan tetap ada
          id: art.id, // ID tidak berubah
          title: updatedFields.title || art.title,
          image: updatedFields.image || art.image,
          content: updatedFields.content || art.content,
          author: updatedFields.author || art.author,
          publishDate: updatedFields.publishDate || art.publishDate,
          summary: updatedFields.summary || art.summary,
          // Slug bisa diperbarui jika title berubah di updatedFields
          slug: updatedFields.title ? generateSlug(updatedFields.title) : (updatedFields.slug || art.slug),
        };
        return updatedArticle;
      }
      return art;
    });

    if (!found) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan.', id: articleId });
    }

    res.status(200).json({ message: 'Artikel diperbarui', id: articleId });
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    const articleIdToDelete = Array.isArray(id) ? id[0] : String(id);

    if (!articleIdToDelete) {
      return res.status(400).json({ message: 'ID artikel diperlukan untuk penghapusan.', id: '' });
    }

    const initialLength = articlesData.length;
    articlesData = articlesData.filter(art => art.id !== articleIdToDelete);

    if (articlesData.length === initialLength) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan.', id: articleIdToDelete });
    }

    res.status(200).json({ message: 'Artikel dihapus', id: articleIdToDelete });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}