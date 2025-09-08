import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function isCacheValid(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_DURATION;
}

export const httpCacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next(req);
  }

  // Don't cache if Cache-Control: no-store is present
  if (req.headers.get('Cache-Control') === 'no-store') {
    return next(req);
  }

  const cacheKey = req.urlWithParams;
  const cachedEntry = cache.get(cacheKey);

  // Check if we have a valid cached entry
  if (cachedEntry && isCacheValid(cachedEntry)) {
    return of(new HttpResponse({ body: cachedEntry.data }));
  }

  // Make the request and cache the response
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        cache.set(cacheKey, {
          data: event.body,
          timestamp: Date.now(),
        });
      }
    })
  );
};
