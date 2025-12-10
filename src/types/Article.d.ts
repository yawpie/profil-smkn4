// src/types/Article.d.ts

// Raw backend shape from OpenAPI
export type ArticleApi = {
  articles_id: string;
  title: string;
  content: string;
  image_url: string | null;
  published_date: string | null;
  slug: string | null;
  status?: "DRAFT" | "PUBLISHED";
  admin?: { username: string } | null;
  category?: { name: string } | null;
  admin_id?: string;
  category_id?: string;
};

// Normalized shape used by the frontend components
export type Article = {
  id: string; // from articles_id
  title: string;
  image: string; // from image_url or fallback
  imageFile?: File | null;
  content: string;
  author: string; // from admin?.username or fallback
  publishDate: string; // from published_date or empty string
  summary?: string;
  slug?: string | null;
  status?: "DRAFT" | "PUBLISHED";
  categoryName?: string | null; // from category?.name
};

export type ArticlesApiEnvelope = {
  message: string;
  data: ArticleApi[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  // data: {
  // };
};
