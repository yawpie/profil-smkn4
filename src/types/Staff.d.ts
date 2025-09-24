// types/Staff.ts
export type Staff = {
    id: string;
    name: string;
    position: string; // e.g., "Kepala Tata Usaha", "Staff Administrasi", "Pustakawan"
    image?: string; // Optional image URL
    nip?: string; // NIP (Nomor Induk Pegawai) - optional
  };

export type StaffApiResponse = {
    data: Staff[];
    totalCount: number;
  };