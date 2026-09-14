// types/Staff.d.ts
export type Staff = {
  staff_id: string;
  name: string;
  jabatan: string;
  image_url: string | null;
  nip: string | null;
};

export type StaffPaginatedResponse = {
  message: string;
  data: Staff[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};
