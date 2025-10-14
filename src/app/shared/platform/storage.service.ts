import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface StorageItemWithExpiry {
  value: string;
  expiry: number;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }

  setItem(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    }
  }

  /**
   * Set item with expiry time
   * @param key Storage key
   * @param value Value to store
   * @param expiryInHours Expiry time in hours (default: 24 hours)
   */
  setItemWithExpiry(
    key: string,
    value: string,
    expiryInHours: number = 24
  ): void {
    if (isPlatformBrowser(this.platformId)) {
      const now = new Date();
      const item: StorageItemWithExpiry = {
        value: value,
        expiry: now.getTime() + expiryInHours * 60 * 60 * 1000, // Convert hours to milliseconds
      };
      localStorage.setItem(key, JSON.stringify(item));
    }
  }

  /**
   * Get item with expiry check
   * @param key Storage key
   * @returns Value if not expired, null otherwise
   */
  getItemWithExpiry(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) {
        return null;
      }

      try {
        const item: StorageItemWithExpiry = JSON.parse(itemStr);
        const now = new Date();

        // Check if item has expired
        if (now.getTime() > item.expiry) {
          localStorage.removeItem(key);
          return null;
        }

        return item.value;
      } catch (error) {
        // If parsing fails, it might be a regular string, return as is
        return itemStr;
      }
    }
    return null;
  }

  /**
   * Check if item has expired and remove it if it has
   * @param key Storage key
   * @returns true if expired, false otherwise
   */
  checkAndRemoveExpired(key: string): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) {
        return false;
      }

      try {
        const item: StorageItemWithExpiry = JSON.parse(itemStr);
        const now = new Date();

        if (now.getTime() > item.expiry) {
          localStorage.removeItem(key);
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    }
    return false;
  }

  removeItem(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }

  clear(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
  }

  getSessionItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem(key);
    }
    return null;
  }

  setSessionItem(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(key, value);
    }
  }

  removeSessionItem(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(key);
    }
  }

  clearSession(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.clear();
    }
  }
}
