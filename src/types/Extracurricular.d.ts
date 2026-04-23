// Raw backend shape from OpenAPI
export type ExtracurricularApi = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  guru: {name: string | null} | null;
};

// Normalized shape used by the frontend
export type Extracurricular = {
  id: string;
  name: string;
  description: string;
  image?: string; // from image_url or fallback
  coach?: string | null; // legacy field kept optional for UI compatibility
  schedule?: string; // legacy field kept optional for UI compatibility
};

export type ExtracurricularsApiEnvelope = {
  message: string;
  data: ExtracurricularApi[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  // data: {
  // };
};
