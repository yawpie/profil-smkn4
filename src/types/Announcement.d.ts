export type Announcement = {
  id: string; // ID diubah menjadi string agar konsisten dengan ekspektasi frontend
  slug?: string; // Opsional, seperti yang digunakan di frontend
  title: string;
  content: string;
  publishDate: string;
  status: 'Published' | 'Draft'; // Contoh status
  summary?: string; // Opsional, seperti yang digunakan di frontend
};