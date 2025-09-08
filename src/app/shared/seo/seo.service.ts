import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { LinkService } from './link.service';

export interface SeoData {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  url?: string;
  locale?: string;
  noindex?: boolean;
  canonical?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly defaultOgImage = '/assets/img/logo.png';
  private readonly defaultLocale = 'ar_EG';
  private readonly siteName = 'الإتحاد المصري للسياحة';

  constructor(
    private title: Title,
    private meta: Meta,
    private linkService: LinkService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  updateSeo(data: SeoData): void {
    // Set page title
    this.title.setTitle(data.title);

    // Set meta description
    this.meta.updateTag({ name: 'description', content: data.description });

    // Set keywords if provided
    if (data.keywords) {
      this.meta.updateTag({ name: 'keywords', content: data.keywords });
    }

    // Set robots meta tag
    if (data.noindex) {
      this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    } else {
      this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    }

    // Set Open Graph meta tags
    this.setOpenGraphTags(data);

    // Set Twitter Card meta tags
    this.setTwitterCardTags(data);

    // Set canonical URL
    if (data.canonical || data.url) {
      this.linkService.updateCanonicalUrl(data.canonical || data.url!);
    }

    // Set hreflang tags for multilingual support
    if (isPlatformBrowser(this.platformId)) {
      this.setHreflangTags(data.url);
    }
  }

  private setOpenGraphTags(data: SeoData): void {
    const ogImage = data.ogImage || this.defaultOgImage;
    const ogUrl = data.url || this.getCurrentUrl();
    const ogType = data.ogType || 'website';
    const locale = data.locale || this.defaultLocale;

    this.meta.updateTag({ property: 'og:title', content: data.title });
    this.meta.updateTag({
      property: 'og:description',
      content: data.description,
    });
    this.meta.updateTag({
      property: 'og:image',
      content: this.getAbsoluteUrl(ogImage),
    });
    this.meta.updateTag({ property: 'og:url', content: ogUrl });
    this.meta.updateTag({ property: 'og:type', content: ogType });
    this.meta.updateTag({ property: 'og:locale', content: locale });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
  }

  private setTwitterCardTags(data: SeoData): void {
    const twitterCard = data.twitterCard || 'summary_large_image';
    const ogImage = data.ogImage || this.defaultOgImage;

    this.meta.updateTag({ name: 'twitter:card', content: twitterCard });
    this.meta.updateTag({ name: 'twitter:title', content: data.title });
    this.meta.updateTag({
      name: 'twitter:description',
      content: data.description,
    });
    this.meta.updateTag({
      name: 'twitter:image',
      content: this.getAbsoluteUrl(ogImage),
    });

    if (data.twitterSite) {
      this.meta.updateTag({ name: 'twitter:site', content: data.twitterSite });
    }

    if (data.twitterCreator) {
      this.meta.updateTag({
        name: 'twitter:creator',
        content: data.twitterCreator,
      });
    }
  }

  private setHreflangTags(url?: string): void {
    if (!url) return;

    const baseUrl = this.getBaseUrl();
    const currentPath = url.replace(baseUrl, '');

    // Add hreflang tags for Arabic and English
    this.linkService.addHreflangTag('ar', `${baseUrl}/ar${currentPath}`);
    this.linkService.addHreflangTag('en', `${baseUrl}/en${currentPath}`);
    this.linkService.addHreflangTag('x-default', `${baseUrl}${currentPath}`);
  }

  private getCurrentUrl(): string {
    if (isPlatformBrowser(this.platformId)) {
      return this.document.location.href;
    }
    return '';
  }

  private getBaseUrl(): string {
    if (isPlatformBrowser(this.platformId)) {
      return `${this.document.location.protocol}//${this.document.location.host}`;
    }
    return 'https://etf-egypt.com'; // Fallback for SSR
  }

  private getAbsoluteUrl(relativeUrl: string): string {
    if (relativeUrl.startsWith('http')) {
      return relativeUrl;
    }
    return `${this.getBaseUrl()}${relativeUrl}`;
  }
}
