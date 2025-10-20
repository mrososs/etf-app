export interface MultimediaItem {
  id: number;
  type: 'course' | 'video' | 'playlist' | 'gallery' | 'youtube';
  category: 'training' | 'awareness' | 'events' | 'gallery';
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  thumbnail: string;
  videos?: MultimediaVideo[];
  images?: GalleryImage[];
  youtubeVideos?: YouTubeVideo[];
}

export interface MultimediaVideo {
  videoId: string;
  title: { ar: string; en: string };
  duration?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: { ar: string; en: string };
  description?: { ar: string; en: string };
}

export interface YouTubeVideo {
  videoId: string;
  title: { ar: string; en: string };
  thumbnail: string;
  duration?: string;
  publishedAt?: string;
}
