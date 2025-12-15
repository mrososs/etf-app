import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  [key: string]: any;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
  exp?: number;
  iss?: string;
  aud?: string;
}

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  /**
   * Decode JWT token
   */
  decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Get role from token
   */
  getRoleFromToken(token: string): string | null {
    const decoded = this.decodeToken(token);
    if (decoded && decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) {
      return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    }
    return null;
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    const expiryTime = decoded.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiryTime;
  }
}

