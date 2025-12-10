export type Achievement = {
    id: string;
    title: string;
    publishDate: string;
    description: string;
    content: string;
    image: string;
  };  

export type AchievementApi = {
    id: string;
    title: string;
    publishDate: string;
    description: string;
    content: string;
    image_url: string | null;
}
export type AchievementsApiEnvelope = {
    message: string;
    data: AchievementApi[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}