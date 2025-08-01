export type Major = {
  id: string; // Changed to string ID for consistency
  name: string;
  image: string; // URL for the image
  description: string;
  slug?: string | null; // Optional slug for friendly URLs
  fastFacts?: string[]; // Array string untuk fakta cepat, opsional
  careerProspects?: string[]; // Array string untuk prospek karir, opsional
};