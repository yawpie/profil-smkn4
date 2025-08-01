// Define interfaces for better type checking
export type Facility = {
    id: string | null; // ID can be string or null, optional
    name: string;
    image: string; // URL for the image
    description: string;
    location: string;
    status: 'Tersedia' | 'Digunakan' | 'Perbaikan'; // Specific literal types for status
  };