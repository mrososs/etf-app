import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LinkService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  updateCanonicalUrl(url: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Remove existing canonical link
    this.removeCanonicalLink();

    // Add new canonical link
    const link = this.document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    this.document.head.appendChild(link);
  }

  addHreflangTag(lang: string, url: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Remove existing hreflang link for this language
    this.removeHreflangLink(lang);

    // Add new hreflang link
    const link = this.document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', lang);
    link.setAttribute('href', url);
    this.document.head.appendChild(link);
  }

  addHreflangTags(languages: { lang: string; url: string }[]): void {
    languages.forEach((language) => {
      this.addHreflangTag(language.lang, language.url);
    });
  }

  private removeCanonicalLink(): void {
    const existingCanonical = this.document.querySelector(
      'link[rel="canonical"]'
    );
    if (existingCanonical) {
      existingCanonical.remove();
    }
  }

  private removeHreflangLink(lang: string): void {
    const existingHreflang = this.document.querySelector(
      `link[hreflang="${lang}"]`
    );
    if (existingHreflang) {
      existingHreflang.remove();
    }
  }
}
