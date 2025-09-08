# SEO & Performance Guide

This guide explains how to maintain and extend the SEO and performance optimizations implemented in the ETF Angular application.

## 🚀 Quick Start

### Development with SSR

```bash
npm run dev:ssr
```

### Production Build with SEO

```bash
npm run build:seo
```

### Prerender Static Routes

```bash
npm run prerender
```

## 📋 SEO Implementation

### 1. SEO Service Usage

The `SeoService` automatically handles meta tags, Open Graph, Twitter Cards, and canonical URLs.

#### Adding SEO to a New Route

```typescript
// In your routing module
{
  path: 'new-page',
  component: NewPageComponent,
  data: {
    seo: {
      title: 'Page Title - الإتحاد المصري للسياحة',
      description: 'Page description for search engines',
      keywords: 'keyword1, keyword2, keyword3',
      ogImage: '/assets/img/page-image.jpg',
      url: 'https://etf-egypt.com/landing-page/new-page'
    }
  }
}
```

#### Manual SEO Updates in Components

```typescript
import { SeoService } from "../shared/seo/seo.service";

export class MyComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.updateSeo({
      title: "Dynamic Title",
      description: "Dynamic description",
      ogImage: "/assets/img/dynamic-image.jpg",
    });
  }
}
```

### 2. Structured Data

The `StructuredDataService` automatically adds organization schema. For additional schemas:

```typescript
import { StructuredDataService } from "../shared/seo/structured-data.service";

// Add service schema
this.structuredDataService.addServiceSchema({
  name: "Service Name",
  description: "Service description",
  provider: {
    name: "الإتحاد المصري للسياحة",
    url: "https://etf-egypt.com",
  },
});

// Add article schema
this.structuredDataService.addArticleSchema({
  headline: "Article Title",
  description: "Article description",
  author: { name: "Author Name" },
  publisher: {
    name: "الإتحاد المصري للسياحة",
    logo: "https://etf-egypt.com/assets/img/logo.png",
  },
  datePublished: "2024-01-01",
  url: "https://etf-egypt.com/article-url",
});
```

### 3. Image Optimization

Use the `DeferImgDirective` for optimized images:

```html
<!-- Priority image (above the fold) -->
<img appDeferImg="/assets/img/hero.jpg" [priority]="true" width="1200" height="600" alt="Hero image description" />

<!-- Lazy loaded image -->
<img appDeferImg="/assets/img/content.jpg" width="800" height="400" alt="Content image description" />
```

## 🔧 Performance Optimizations

### 1. HTTP Caching

The `HttpCacheInterceptor` automatically caches GET requests for 5 minutes. To disable caching for specific requests:

```typescript
// In your service
getData() {
  return this.http.get('/api/data', {
    headers: { 'Cache-Control': 'no-store' }
  });
}
```

### 2. SSR Safety

Always use the `PlatformService` when accessing browser APIs:

```typescript
import { PlatformService } from "../shared/platform/platform.service";

export class MyComponent {
  constructor(private platformService: PlatformService) {}

  someMethod() {
    // Safe browser API access
    const origin = this.platformService.runInBrowser(() => window.location.origin) || "https://etf-egypt.com";
  }
}
```

### 3. Storage Service

Use the `StorageService` instead of direct localStorage/sessionStorage:

```typescript
import { StorageService } from "../shared/platform/storage.service";

export class MyComponent {
  constructor(private storageService: StorageService) {}

  saveData() {
    this.storageService.setItem("key", "value");
  }

  getData() {
    return this.storageService.getItem("key");
  }
}
```

## 📊 Monitoring & Analytics

### Google Search Console

Add your verification meta tag to `src/index.html`:

```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

### Google Analytics (Optional)

To add Google Analytics, create a service:

```typescript
// src/app/shared/analytics/analytics.service.ts
import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class AnalyticsService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  init(measurementId: string) {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize Google Analytics
      // Implementation depends on your preferred method
    }
  }
}
```

## 🛠️ Build Configuration

### Production Build Settings

The following optimizations are enabled in `angular.json`:

- `optimization: true` - Enables tree shaking and minification
- `vendorChunk: false` - Reduces bundle size
- `buildOptimizer: true` - Additional optimizations
- Bundle size limits: 300kb warning, 500kb error

### Prerendering

Static routes are defined in `prerender-routes.json`. To add new routes:

```json
["/landing-page/home", "/landing-page/union", "/landing-page/new-page"]
```

## 📁 File Structure

```
src/app/
├── shared/
│   ├── seo/
│   │   ├── seo.service.ts          # Main SEO service
│   │   ├── link.service.ts         # Canonical and hreflang management
│   │   └── structured-data.service.ts # JSON-LD schema management
│   ├── platform/
│   │   ├── platform.service.ts     # SSR safety checks
│   │   └── storage.service.ts      # Safe storage abstraction
│   └── directives/
│       └── defer-img.directive.ts  # Image optimization directive
├── core/
│   └── interceptors/
│       └── http-cache.interceptor.ts # HTTP response caching
└── features/
    └── landing-page/
        └── components/
            └── not-found/          # 404 page component
```

## 🚨 Common Issues & Solutions

### 1. SSR Hydration Errors

If you see hydration errors, ensure all browser API access is wrapped with `PlatformService`:

```typescript
// ❌ Wrong
const data = localStorage.getItem("key");

// ✅ Correct
const data = this.storageService.getItem("key");
```

### 2. Image Loading Issues

Ensure all images have proper dimensions and alt text:

```html
<!-- ❌ Wrong -->
<img src="/assets/img/image.jpg" />

<!-- ✅ Correct -->
<img appDeferImg="/assets/img/image.jpg" width="800" height="400" alt="Descriptive alt text" />
```

### 3. SEO Meta Tags Not Updating

Ensure your route data includes the `seo` property:

```typescript
// ❌ Wrong
data: { title: 'Page Title' }

// ✅ Correct
data: {
  seo: {
    title: 'Page Title',
    description: 'Page description'
  }
}
```

## 📈 Performance Monitoring

### Lighthouse Scores

Target scores for production:

- Performance: ≥ 90
- SEO: ≥ 100
- Accessibility: ≥ 90
- Best Practices: ≥ 90

### Core Web Vitals

Monitor these metrics:

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## 🔄 Maintenance

### Regular Tasks

1. **Update sitemap**: Run `npm run generate-sitemap` after adding new routes
2. **Check bundle size**: Monitor build output for size warnings
3. **Test SSR**: Run `npm run dev:ssr` to ensure server-side rendering works
4. **Validate structured data**: Use Google's Rich Results Test tool

### Adding New Features

When adding new features:

1. Add SEO data to route definitions
2. Use platform-safe services for browser APIs
3. Optimize images with the defer directive
4. Add appropriate structured data schemas
5. Update sitemap if adding new public routes

## 📞 Support

For questions about SEO and performance implementation, refer to:

- [Angular Universal Documentation](https://angular.io/guide/universal)
- [Angular SEO Guide](https://angular.io/guide/seo)
- [Web.dev Performance Guide](https://web.dev/performance/)
