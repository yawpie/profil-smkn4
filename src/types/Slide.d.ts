// src/types/SlideData.ts (Ini akan digunakan untuk CRUD)
export type Slide = {
  id: string; // ID unik untuk setiap slide
  image: string;
  alt: string = "default alt text";
  title: string;
  subtitle: string;
  description: string;
  gradientFrom: string = "defaultGradientFrom";
  gradientTo: string = "defaultGradientTo";
  order: number; // Sangat direkomendasikan untuk pengurutan
  isActive: boolean; // Sangat direkomendasikan untuk kontrol visibilitas
  imageFile?: File | null;
};

export type SlideApi = {
  id: string; // ID unik untuk setiap slide
  image_url: string;
  alt: string;
  title: string;
  subtitle: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  order: number;
  isActive: boolean;
};

export type SlidesApiEnvelope = {
  message: string;
  data: SlideApi[];
};