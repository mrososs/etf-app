import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  get isServer(): boolean {
    return isPlatformServer(this.platformId);
  }

  /**
   * Execute a function only in the browser
   */
  runInBrowser<T>(fn: () => T): T | null {
    if (this.isBrowser) {
      return fn();
    }
    return null;
  }

  /**
   * Execute a function only on the server
   */
  runInServer<T>(fn: () => T): T | null {
    if (this.isServer) {
      return fn();
    }
    return null;
  }
}
