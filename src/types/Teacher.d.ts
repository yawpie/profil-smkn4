// src/types/Teacher.d.ts

export type Teacher = {
  id: string; // ID guru (wajib string)
  name: string;
  image: string; // URL gambar
  subject: string;
  nip: string | null; // NIP bisa string atau null
  position: string; // Jabatan guru
};

export type TeachersApiResponse = {
  data: Teacher[]; // Array guru untuk halaman saat ini
  totalCount: number; // Total jumlah guru yang tersedia di database
};

// Interface untuk pesan modal kustom
export type ModalMessage = {
  message: string;
  type: 'error' | 'info';
};