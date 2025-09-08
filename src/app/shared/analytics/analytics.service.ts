import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private measurementId = 'G-XXXXXXXXXX'; // Replace with your Google Analytics measurement ID

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  init(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadGoogleAnalytics();
    }
  }

  private loadGoogleAnalytics(): void {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', this.measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }

  trackEvent(eventName: string, parameters?: any): void {
    if (isPlatformBrowser(this.platformId) && window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  }

  trackPageView(pageTitle: string, pagePath: string): void {
    if (isPlatformBrowser(this.platformId) && window.gtag) {
      window.gtag('config', this.measurementId, {
        page_title: pageTitle,
        page_location: window.location.origin + pagePath,
      });
    }
  }

  setUserId(userId: string): void {
    if (isPlatformBrowser(this.platformId) && window.gtag) {
      window.gtag('config', this.measurementId, {
        user_id: userId,
      });
    }
  }
}
