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
   * Preload news images
   */
  preloadNewsImages(news: any[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    news.slice(0, 6).forEach((item) => {
      // Only preload first 6 news images
      if (item.imageUrl) {
        this.preloadImage(item.imageUrl);
      }
    });
  }

  /**
   * Preload a single image
   */
  private preloadImage(src: string): void {
    if (this.preloadedImages.has(src)) {
      return;
    }

    const img = new Image();
    img.onload = () => {
      this.preloadedImages.add(src);
    };
    img.onerror = () => {
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
