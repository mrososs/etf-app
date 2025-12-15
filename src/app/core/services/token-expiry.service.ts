import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { StorageService } from '../../shared/platform/storage.service';

@Injectable({
  providedIn: 'root',
})
export class TokenExpiryService {
  private readonly TOKEN_KEY = 'auth_token';
  private checkInterval: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private storageService: StorageService,
    private router: Router
  ) {}

  /**
   * Initialize token expiry checking
   * This should be called when the app starts
   */
  initTokenExpiryCheck(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Check immediately on init
    this.checkTokenExpiry();

    // Check every hour (3600000 ms)
    this.checkInterval = setInterval(() => {
      this.checkTokenExpiry();
    }, 3600000); // 1 hour
  }

  /**
   * Check if token has expired and clear it
   */
  private checkTokenExpiry(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const isExpired = this.storageService.checkAndRemoveExpired(this.TOKEN_KEY);

    if (isExpired) {
      this.handleExpiredToken();
    }
  }

  /**
   * Handle expired token - clear all auth data and redirect to login
   */
  private handleExpiredToken(): void {
    console.log('Token has expired, clearing auth data...');

    // Clear localStorage
    this.storageService.removeItem(this.TOKEN_KEY);
    this.storageService.removeItem('user_role');

    // Clear cookies
    if (isPlatformBrowser(this.platformId)) {
      document.cookie =
        'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie =
        'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.itechpro-eg.com;';

      // Dispatch events to notify other components
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: this.TOKEN_KEY,
          newValue: null,
          url: window.location.href,
        })
      );

      window.dispatchEvent(
        new CustomEvent('loginStateChanged', {
          detail: { isLoggedIn: false, token: null },
        })
      );

      // Redirect to login page
      this.router.navigate(['/landing-page/login']);
    }
  }

  /**
   * Store token with 24-hour expiry
   */
  storeTokenWithExpiry(token: string, expiryInHours: number = 24): void {
    this.storageService.setItemWithExpiry(this.TOKEN_KEY, token, expiryInHours);
  }

  /**
   * Get token if not expired
   */
  getValidToken(): string | null {
    return this.storageService.getItemWithExpiry(this.TOKEN_KEY);
  }

  /**
   * Clean up interval when service is destroyed
   */
  ngOnDestroy(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
}
