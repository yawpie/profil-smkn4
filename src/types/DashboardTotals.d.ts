export type DashboardTotals = {
  achievements: number;
  announcements: number;
  articles: number;
  extracurriculars: number;
  facilities: number;
  teachers: number;
  majors: number;
};

export type DashboardTotalsResponse = {
  message: string;
  data: DashboardTotals;
};

/*
achievement: countResult[0],
      announcements: countResult[1],
      articles: countResult[2],
      extracurriculars: countResult[3],
      facilities: countResult[4],
      teachers: countResult[5],
      majors: countResult[6],
*/
