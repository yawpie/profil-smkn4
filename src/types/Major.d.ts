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
  data: MajorApi[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  // data: {
  // };
};
