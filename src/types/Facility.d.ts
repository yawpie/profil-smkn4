// Raw backend shape from OpenAPI
export type FacilityApi = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  status: "TERSEDIA" | "PERBAIKAN" | "DIGUNAKAN" | "TIDAK_TERSEDIA";
  image_url: string | null;
};

// Normalized shape used by the frontend
export type Facility = {
  id: string | null;
  name: string;
  image: string; // from image_url or fallback
  description: string;
  location: string;
  status: "Tersedia" | "Digunakan" | "Perbaikan" | "Tidak Tersedia"; // localized labels
};

// Envelope for list endpoint responses
export type FacilitiesApiEnvelope = {
  message: string;
  data: FacilityApi[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  // data: {
  // };
};
