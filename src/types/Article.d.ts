// src/types/Article.d.ts

export type Article = {
  id: string; // Mengubah ke string untuk konsistensi di seluruh proyek
  title: string;
  image: string; // URL gambar artikel
  content: string;
  author: string;
  publishDate: string; // Tanggal publikasi dalam format string
  summary?: string; // Menambahkan ini jika Anda memiliki ringkasan di frontend
  slug?: string | null; // Menambahkan ini jika Anda menggunakan slug untuk URL
};