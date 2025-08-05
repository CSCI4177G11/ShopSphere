/**
 * Secure authentication storage utility
 * Provides a unified interface for token storage with fallback support
 */

interface AuthData {
  token: string;
  user: any;
}

class AuthStorage {
  private static instance: AuthStorage;
  private isSecureCookieSupported: boolean = false;
  
  private constructor() {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      this.checkCookieSupport();
    }
  }

  static getInstance(): AuthStorage {
    if (!AuthStorage.instance) {
      AuthStorage.instance = new AuthStorage();
    }
    return AuthStorage.instance;
  }

  private checkCookieSupport(): void {
    // Check if cookies are enabled and if we're on HTTPS
    this.isSecureCookieSupported = 
      typeof document !== 'undefined' && 
      navigator.cookieEnabled &&
      window.location.protocol === 'https:';
  }

  /**
   * Store authentication token with fallback support
   */
  async setToken(token: string): Promise<void> {
    if (this.isSecureCookieSupported) {
      // Try to set httpOnly cookie via API
      try {
        const response = await fetch('/api/auth/set-cookie', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        
        if (!response.ok) {
          console.warn('Failed to set httpOnly cookie, using fallback');
        }
      } catch (error) {
        console.warn('Error setting httpOnly cookie:', error);
      }
      
      // Also store in client-readable cookie for immediate access
      this.setSecureCookie('token', token);
    }
    
    // Always store in localStorage as fallback for now
    // This ensures backward compatibility during migration
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('token', token);
    }
  }

  /**
   * Retrieve authentication token with fallback support
   */
  getToken(): string | null {
    // First try to get from cookie
    if (this.isSecureCookieSupported) {
      const cookieToken = this.getSecureCookie('token');
      if (cookieToken) return cookieToken;
    }
    
    // Fallback to localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    
    return null;
  }

  /**
   * Remove authentication token from all storage
   */
  async removeToken(): Promise<void> {
    // Remove httpOnly cookie via API
    if (this.isSecureCookieSupported) {
      try {
        await fetch('/api/auth/clear-cookie', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.warn('Error clearing httpOnly cookie:', error);
      }
      
      // Also remove client-readable cookie
      this.removeSecureCookie('token');
    }
    
    // Remove from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
    }
  }

  /**
   * Store user data
   */
  setUser(user: any): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  /**
   * Retrieve user data
   */
  getUser(): any | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Remove user data
   */
  removeUser(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('user');
    }
  }

  /**
   * Clear all authentication data
   */
  async clearAll(): Promise<void> {
    await this.removeToken();
    this.removeUser();
  }

  /**
   * Helper method to set secure cookie (client-side readable cookie)
   * For httpOnly cookies, we'll need server-side implementation
   */
  private setSecureCookie(name: string, value: string): void {
    if (typeof document !== 'undefined') {
      // Set cookie with secure flags (not httpOnly since we need to read it)
      // HttpOnly will be set by the server response
      const expires = new Date();
      expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
      
      let cookieString = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
      
      // Only add Secure flag if on HTTPS
      if (window.location.protocol === 'https:') {
        cookieString += '; Secure';
      }
      
      document.cookie = cookieString;
    }
  }

  /**
   * Helper method to get cookie value
   */
  private getSecureCookie(name: string): string | null {
    if (typeof document !== 'undefined') {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';').shift();
        return cookieValue || null;
      }
    }
    return null;
  }

  /**
   * Helper method to remove cookie
   */
  private removeSecureCookie(name: string): void {
    if (typeof document !== 'undefined') {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Export singleton instance
export const authStorage = AuthStorage.getInstance();