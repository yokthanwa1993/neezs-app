import { platformService } from '../platform';

export interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export interface LiffShareData {
  type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'location' | 'sticker' | 'imagemap' | 'template' | 'flex';
  text?: string;
  packageId?: string;
  stickerId?: string;
  originalContentUrl?: string;
  previewImageUrl?: string;
  title?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export class LiffService {
  private static _instance: LiffService;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  static getInstance(): LiffService {
    if (!LiffService._instance) {
      LiffService._instance = new LiffService();
    }
    return LiffService._instance;
  }

  async isAvailable(): Promise<boolean> {
    return platformService.isLIFF() && typeof window !== 'undefined' && !!window.liff;
  }

  async initialize(liffId?: string): Promise<void> {
    if (this.isInitialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.doInitialize(liffId);
    await this.initPromise;
  }

  private async doInitialize(liffId?: string): Promise<void> {
    try {
      if (!await this.isAvailable()) {
        throw new Error('LIFF not available');
      }

      if (!liffId) {
        // Try to get LIFF ID from environment or config
        liffId = import.meta.env.VITE_LIFF_ID_SEEKER || import.meta.env.VITE_LIFF_ID_EMPLOYER;
      }

      if (!liffId) {
        throw new Error('LIFF ID not provided');
      }

      await window.liff.init({ liffId });
      this.isInitialized = true;
      console.log('✅ LIFF initialized successfully');
    } catch (error) {
      console.error('❌ LIFF initialization failed:', error);
      throw error;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    if (!await this.isAvailable()) return false;
    await this.initialize();
    return window.liff.isLoggedIn();
  }

  async login(): Promise<void> {
    if (!await this.isAvailable()) {
      throw new Error('LIFF not available');
    }

    await this.initialize();

    if (!window.liff.isLoggedIn()) {
      window.liff.login({
        redirectUri: window.location.href
      });
    }
  }

  async logout(): Promise<void> {
    if (!await this.isAvailable()) return;
    await this.initialize();

    if (window.liff.isLoggedIn()) {
      window.liff.logout();
    }
  }

  async getProfile(): Promise<LiffProfile> {
    if (!await this.isAvailable()) {
      throw new Error('LIFF not available');
    }

    await this.initialize();

    if (!window.liff.isLoggedIn()) {
      throw new Error('User not logged in');
    }

    try {
      const profile = await window.liff.getProfile();
      return {
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage,
      };
    } catch (error) {
      console.error('Failed to get LIFF profile:', error);
      throw new Error('Failed to get user profile');
    }
  }

  async getAccessToken(): Promise<string> {
    if (!await this.isAvailable()) {
      throw new Error('LIFF not available');
    }

    await this.initialize();

    if (!window.liff.isLoggedIn()) {
      throw new Error('User not logged in');
    }

    return window.liff.getAccessToken();
  }

  async shareMessage(data: LiffShareData): Promise<void> {
    if (!await this.isAvailable()) {
      throw new Error('LIFF not available');
    }

    await this.initialize();

    try {
      const message = this.formatShareMessage(data);
      await window.liff.shareTargetPicker([message]);
    } catch (error) {
      console.error('Failed to share message:', error);
      throw new Error('Failed to share message');
    }
  }

  async sendMessageToCurrentChat(data: LiffShareData): Promise<void> {
    if (!await this.isAvailable()) {
      throw new Error('LIFF not available');
    }

    await this.initialize();

    if (!window.liff.isInClient()) {
      throw new Error('Not in LINE client');
    }

    try {
      const message = this.formatShareMessage(data);
      await window.liff.sendMessages([message]);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw new Error('Failed to send message');
    }
  }

  private formatShareMessage(data: LiffShareData): any {
    switch (data.type) {
      case 'text':
        return {
          type: 'text',
          text: data.text || '',
        };

      case 'location':
        return {
          type: 'location',
          title: data.title || 'Location',
          address: data.address || '',
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
        };

      case 'image':
        return {
          type: 'image',
          originalContentUrl: data.originalContentUrl || '',
          previewImageUrl: data.previewImageUrl || data.originalContentUrl || '',
        };

      case 'sticker':
        return {
          type: 'sticker',
          packageId: data.packageId || '',
          stickerId: data.stickerId || '',
        };

      default:
        return {
          type: 'text',
          text: data.text || 'Shared from NEEZS app',
        };
    }
  }

  async openWindow(url: string, external = false): Promise<void> {
    if (!await this.isAvailable()) {
      // Fallback to regular window.open
      window.open(url, external ? '_blank' : '_self');
      return;
    }

    await this.initialize();

    if (external) {
      window.liff.openWindow({
        url,
        external: true,
      });
    } else {
      window.location.href = url;
    }
  }

  async closeWindow(): Promise<void> {
    if (!await this.isAvailable()) {
      window.close();
      return;
    }

    await this.initialize();
    window.liff.closeWindow();
  }

  async getContext(): Promise<any> {
    if (!await this.isAvailable()) return null;
    await this.initialize();
    return window.liff.getContext();
  }

  async getLanguage(): Promise<string> {
    if (!await this.isAvailable()) {
      return navigator.language || 'en';
    }

    await this.initialize();
    return window.liff.getLanguage();
  }

  async getVersion(): Promise<string> {
    if (!await this.isAvailable()) return 'not-available';
    await this.initialize();
    return window.liff.getVersion();
  }

  async isInClient(): Promise<boolean> {
    if (!await this.isAvailable()) return false;
    await this.initialize();
    return window.liff.isInClient();
  }

  async isApiAvailable(apiName: string): Promise<boolean> {
    if (!await this.isAvailable()) return false;
    await this.initialize();
    return window.liff.isApiAvailable(apiName);
  }

  // Utility methods
  getLiffId(): string | null {
    return import.meta.env.VITE_LIFF_ID_SEEKER || 
           import.meta.env.VITE_LIFF_ID_EMPLOYER || 
           null;
  }

  async scanQRCode(): Promise<{ value: string }> {
    if (!await this.isAvailable()) {
      throw new Error('LIFF not available');
    }

    await this.initialize();

    if (!await this.isApiAvailable('scanCode')) {
      throw new Error('QR code scanning not available');
    }

    try {
      return await window.liff.scanCode();
    } catch (error) {
      console.error('QR code scan failed:', error);
      throw new Error('Failed to scan QR code');
    }
  }
}

// Export singleton instance
export const liffService = LiffService.getInstance();
