export interface MediaCenterItem {
  title: { value: string };
  titleEn: { value: string };
  description: { value: string };
  descriptionAr: { value: string };
  link: { value: string };
  type: { value: number }; // 0 = image, 1 = video
}

export interface MediaCenterResponse {
  events: MediaCenterItem[];
  albums: MediaCenterItem[];
  activities: MediaCenterItem[];
  [key: string]: any; // For other properties we don't use
}

