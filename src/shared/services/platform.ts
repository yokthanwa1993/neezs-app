export type PlatformType = 'line' | 'ios' | 'android' | 'web' | 'pwa';

export interface PlatformCapabilities {
  camera: boolean;
  location: boolean;
  pushNotifications: boolean;
  fileUpload: boolean;
  contacts: boolean;
  sharing: boolean;
  biometric: boolean;
  backgroundSync: boolean;
}

export class PlatformService {
  private static _instance: PlatformService;
  private _platform: PlatformType | null = null;
  private _capabilities: PlatformCapabilities | null = null;

  static getInstance(): PlatformService {
    if (!PlatformService._instance) {
      PlatformService._instance = new PlatformService();
    }
    return PlatformService._instance;
  }

  getPlatform(): PlatformType {
    if (this._platform) return this._platform;

    // Check if running in LINE LIFF
    if (typeof window !== 'undefined' && (window as any).liff) {
      this._platform = 'line';
      return this._platform;
    }
    
    // Check if running in Capacitor
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      const platform = (window as any).Capacitor.getPlatform();
      if (platform === 'ios') {
        this._platform = 'ios';
        return this._platform;
      }
      if (platform === 'android') {
        this._platform = 'android';
        return this._platform;
      }
    }

    // Check if PWA
    if (this.isPWA()) {
      this._platform = 'pwa';
      return this._platform;
    }

    this._platform = 'web';
    return this._platform;
  }

  isNative(): boolean {
    const platform = this.getPlatform();
    return platform === 'ios' || platform === 'android';
  }

  isLIFF(): boolean {
    return this.getPlatform() === 'line';
  }

  isWeb(): boolean {
    const platform = this.getPlatform();
    return platform === 'web' || platform === 'pwa';
  }

  isPWA(): boolean {
    if (typeof window === 'undefined') return false;
    
    // Check if running as PWA
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone ||
           document.referrer.includes('android-app://');
  }

  getCapabilities(): PlatformCapabilities {
    if (this._capabilities) return this._capabilities;

    const platform = this.getPlatform();

    switch (platform) {
      case 'ios':
      case 'android':
        this._capabilities = {
          camera: true,
          location: true,
          pushNotifications: true,
          fileUpload: true,
          contacts: true,
          sharing: true,
          biometric: true,
          backgroundSync: true,
        };
        break;
      
      case 'line':
        this._capabilities = {
          camera: true,
          location: true,
          pushNotifications: false, // LINE handles this
          fileUpload: true,
          contacts: false,
          sharing: true, // LINE sharing
          biometric: false,
          backgroundSync: false,
        };
        break;
      
      case 'pwa':
        this._capabilities = {
          camera: true,
          location: true,
          pushNotifications: true,
          fileUpload: true,
          contacts: false,
          sharing: navigator.share ? true : false,
          biometric: false,
          backgroundSync: true,
        };
        break;
      
      default: // web
        this._capabilities = {
          camera: navigator.mediaDevices ? true : false,
          location: navigator.geolocation ? true : false,
          pushNotifications: 'Notification' in window,
          fileUpload: true,
          contacts: false,
          sharing: navigator.share ? true : false,
          biometric: false,
          backgroundSync: false,
        };
    }

    return this._capabilities;
  }

  hasCapability(capability: keyof PlatformCapabilities): boolean {
    return this.getCapabilities()[capability];
  }

  async requestPermissions(permissions: Array<keyof PlatformCapabilities>): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    for (const permission of permissions) {
      try {
        switch (permission) {
          case 'camera':
            results[permission] = await this.requestCameraPermission();
            break;
          case 'location':
            results[permission] = await this.requestLocationPermission();
            break;
          case 'pushNotifications':
            results[permission] = await this.requestNotificationPermission();
            break;
          default:
            results[permission] = this.hasCapability(permission);
        }
      } catch (error) {
        console.warn(`Failed to request ${permission} permission:`, error);
        results[permission] = false;
      }
    }

    return results;
  }

  private async requestCameraPermission(): Promise<boolean> {
    if (!this.hasCapability('camera')) return false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Clean up
      return true;
    } catch {
      return false;
    }
  }

  private async requestLocationPermission(): Promise<boolean> {
    if (!this.hasCapability('location')) return false;

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false),
        { timeout: 5000 }
      );
    });
  }

  private async requestNotificationPermission(): Promise<boolean> {
    if (!this.hasCapability('pushNotifications')) return false;

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const platformService = PlatformService.getInstance();
