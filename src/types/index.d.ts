export type TotalsData = {
    teachers: number;
    articles: number;
    majors: number;
    extracurriculars: number;
    facilities: number;
    announcements: number;
    students: number;
  };
  
  export type MonthlyDataItem = {
    name: string;
    students: number;
    teachers: number;
    articles: number;
  };
  
  export type MajorDistributionItem = {
    name: string;
    value: number;
  };
  
  export type DataCardProps = {
    title: string;
    value: number;
    icon: React.ElementType;
    gradient: string;
    iconBg: string;
    shadowColor: string;
  };
  
  export type AnimatedCounterProps = {
    from: number;
    to: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
  };
  