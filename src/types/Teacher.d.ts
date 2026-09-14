// src/types/Teacher.d.ts

export type TeacherStatus = "DRAFT" | "PUBLISHED"; // placeholder if backend adds status later

// Raw shape from backend API (/teacher/)
export type TeacherApi = {
  guru_id: string;
  name: string;
  jabatan: string;
  nip: string | null;
  image_url: string | null;
  mata_pelajaran: string | null;
  major_id: string | null;
};

// {
//   guru_id: string;
//   name: string;
//   jabatan: string;
//   nip: string | null;
//   image_url: string | null;
//   mata_pelajaran: string | null;
// }
// Normalized shape used throughout the frontend
export type Teacher = {
  id: string; // maps from guru_id
  name: string;
  image: string; // normalized URL (from image_url or fallback)
  subject: string; // kept for UI compatibility; can be derived from jabatan if needed
  nip: string | null;
  position: string; // maps from jabatan,
  imageFile?: File | null;
  major_id: string | null;
  major_name?: string | null;
};

export type TeacherRequestBody = {
  name: string;
  jabatan: string;
  nip: string;
  image: File | null;
  mata_pelajaran: string | null;
  major_id: string | null;
};

// Outer envelope from backend for list endpoint
export type TeachersApiEnvelope = {
  message: string;
  data: TeacherApi[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  // data: {
  // };
};

// Interface untuk pesan modal kustom
export type ModalMessage = {
  message: string;
  type: "error" | "info";
};
