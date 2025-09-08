import {
  Injectable,
  Inject,
  PLATFORM_ID,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class StructuredDataService {
  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  addStructuredData(scriptContent: string, id?: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Remove existing structured data with the same ID if provided
    if (id) {
      this.removeStructuredData(id);
    }

    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = scriptContent;

    if (id) {
      script.id = id;
    }

    this.renderer.appendChild(this.document.head, script);
  }

  removeStructuredData(id: string): void {
    const existingScript = this.document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }
  }

  addOrganizationSchema(data: {
    name: string;
    url: string;
    logo: string;
    description?: string;
    address?: any;
    contactPoint?: any;
    sameAs?: string[];
  }): void {
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: data.name,
      url: data.url,
      logo: data.logo,
      ...(data.description && { description: data.description }),
      ...(data.address && { address: data.address }),
      ...(data.contactPoint && { contactPoint: data.contactPoint }),
      ...(data.sameAs && { sameAs: data.sameAs }),
    };

    this.addStructuredData(
      JSON.stringify(organizationSchema),
      'organization-schema'
    );
  }

  addServiceSchema(data: {
    name: string;
    description: string;
    provider: {
      name: string;
      url: string;
    };
    areaServed?: string;
    serviceType?: string;
  }): void {
    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: data.name,
      description: data.description,
      provider: {
        '@type': 'Organization',
        name: data.provider.name,
        url: data.provider.url,
      },
      ...(data.areaServed && { areaServed: data.areaServed }),
      ...(data.serviceType && { serviceType: data.serviceType }),
    };

    this.addStructuredData(
      JSON.stringify(serviceSchema),
      `service-schema-${data.name.replace(/\s+/g, '-').toLowerCase()}`
    );
  }

  addArticleSchema(data: {
    headline: string;
    description: string;
    author: {
      name: string;
      url?: string;
    };
    publisher: {
      name: string;
      logo: string;
    };
    datePublished: string;
    dateModified?: string;
    image?: string;
    url: string;
  }): void {
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.headline,
      description: data.description,
      author: {
        '@type': 'Person',
        name: data.author.name,
        ...(data.author.url && { url: data.author.url }),
      },
      publisher: {
        '@type': 'Organization',
        name: data.publisher.name,
        logo: {
          '@type': 'ImageObject',
          url: data.publisher.logo,
        },
      },
      datePublished: data.datePublished,
      ...(data.dateModified && { dateModified: data.dateModified }),
      ...(data.image && { image: data.image }),
      url: data.url,
    };

    this.addStructuredData(
      JSON.stringify(articleSchema),
      `article-schema-${data.headline.replace(/\s+/g, '-').toLowerCase()}`
    );
  }

  addBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): void {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: breadcrumb.name,
        item: breadcrumb.url,
      })),
    };

    this.addStructuredData(
      JSON.stringify(breadcrumbSchema),
      'breadcrumb-schema'
    );
  }
}
