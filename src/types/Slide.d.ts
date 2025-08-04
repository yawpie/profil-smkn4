// src/types/SlideData.ts (Ini akan digunakan untuk CRUD)
export type Slide = {
  id: string; // ID unik untuk setiap slide
  image: string;
  alt: string;
  title: string;
  subtitle: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  order: number; // Sangat direkomendasikan untuk pengurutan
  isActive: boolean; // Sangat direkomendasikan untuk kontrol visibilitas
};