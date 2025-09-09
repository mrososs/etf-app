import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ImagePreloadService {
  private preloadedImages = new Set<string>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Preload critical images for better LCP
   */
  preloadCriticalImages(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const criticalImages = [
      '/assets/img/logo.png',
      '/assets/img/aboutUnion.jpeg',
      '/assets/img/logoBackground.jpg',
      '/assets/img/carusol1.jpeg',
      '/assets/img/carusol2.jpeg',
    ];

    criticalImages.forEach((src) => this.preloadImage(src));
  }

  /**
   * Preload images for a specific route
   */
  preloadRouteImages(route: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const routeImages: { [key: string]: string[] } = {
      home: [
        '/assets/img/logo.png',
        '/assets/img/aboutUnion.jpeg',
        '/assets/img/logoBackground.jpg',
      ],
      training: [
        '/assets/img/trainingBackground.jpg',
        '/assets/img/road.jpg',
        '/assets/img/t3lym.jpg',
      ],
      news: ['/assets/img/newsBackground.jpg'],
      'contact-us': ['/assets/img/contactUsBackground.jpg'],
    };

    const images = routeImages[route] || [];
    images.forEach((src) => this.preloadImage(src));
  }

  /**
   * Preload member images
   */
  preloadMemberImages(members: any[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    members.forEach((member) => {
      if (member.image) {
        this.preloadImage(member.image);
      }
    });
  }

  /**
   * Preload news images with better error handling
   */
  preloadNewsImages(news: any[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    news.slice(0, 6).forEach((item) => {
      // Only preload first 6 news images
      if (item.imageUrl) {
        const fullImageUrl = this.getCompleteImageUrl(item.imageUrl);
        if (this.isValidImageUrl(fullImageUrl)) {
          this.preloadImage(fullImageUrl);
        }
      }
    });
  }

  /**
   * Get complete image URL for news items
   */
  private getCompleteImageUrl(imageUrl: string): string {
    if (!imageUrl) {
      return '';
    }

    // If it's already a complete URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    // If it's a relative path starting with /uploads/, construct the full URL
    if (imageUrl.startsWith('/uploads/')) {
      return `https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net${imageUrl}`;
    }

    // For other relative paths, assume they're asset paths
    return imageUrl;
  }

  /**
   * Check if image URL is valid
   */
  private isValidImageUrl(url: string): boolean {
    try {
      new URL(url);
      return url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) !== null;
    } catch {
      return false;
    }
  }

  /**
   * Preload a single image with timeout and better error handling
   */
  private preloadImage(src: string): void {
    if (this.preloadedImages.has(src)) {
      return;
    }

    const img = new Image();
    const timeout = setTimeout(() => {
      console.warn(`Image preload timeout: ${src}`);
      img.src = '';
    }, 10000); // 10 second timeout

    img.onload = () => {
      clearTimeout(timeout);
      this.preloadedImages.add(src);
    };

    img.onerror = () => {
      clearTimeout(timeout);
      console.warn(`Failed to preload image: ${src}`);
    };

    img.src = src;
  }

  /**
   * Check if an image is already preloaded
   */
  isImagePreloaded(src: string): boolean {
    return this.preloadedImages.has(src);
  }
}
