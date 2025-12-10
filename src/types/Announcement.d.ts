export type AnnouncementApi = {
  id: string;
  title: string;
  content: string;
  date: string;
  image_url: string | null;
  status: "DRAFT" | "PUBLISHED";
};

// Normalized shape for frontend
export type Announcement = {
  id: string;
  title: string;
  content: string;
  // ISO date string from backend `date`
  publishDate: string;
  // Frontend-friendly status casing
  status: "Published" | "Draft";
  summary?: string;
  image?: string | null;
};

export type AnnouncementsApiEnvelope = {
  message: string;
  data: AnnouncementApi[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
    // data: {
    // };
};
