import { Teacher, TeacherApi } from "./Teacher";
// Backend shape
export type MajorApi = {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
};

// Normalized shape for frontend
export type Major = {
  id?: string; // optional during create
  name: string;
  description: string;
  image: string; // normalized from image_url or preview URL
  imageFile?: File | null; // for uploads
};

// Envelope for list endpoint
export type MajorsApiEnvelope = {
  message: string;
  data: MajorApiResponse[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  // data: {
  // };
};

// TODO change type name to something better pls
export type MajorApiResponse = {
  message: string;
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  guru: TeacherApi[];
  // {
  //   guru_id: string;
  //   name: string;
  //   jabatan: string;
  //   nip: string | null;
  //   image_url: string | null;
  // }

  major_gallery_images: MajorGalleryImages[];
};
export type MajorGalleryImages = {
  id: string;
  title: string | null;
  image_url: string | null;
};

export type MajorImageApiRequest = {
  name: string;
  title: string;
  image_url: string | null;
};
