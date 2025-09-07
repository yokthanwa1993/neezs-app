export type PlatformType = 'line' | 'ios' | 'android' | 'web';

export class PlatformDetector {
  static detect(): PlatformType {
    // Check if running in LINE
    if (typeof window !== 'undefined' && (window as any).liff) {
      return 'line';
    }
    
    // Check if running in Capacitor
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      const platform = (window as any).Capacitor.getPlatform();
      if (platform === 'ios') return 'ios';
      if (platform === 'android') return 'android';
    }
    
    return 'web';
  }
  
  static isNative(): boolean {
    return this.detect() === 'ios' || this.detect() === 'android';
  }
  
  static isLINE(): boolean {
    return this.detect() === 'line';
  }
  
  static getConfig() {
    const platform = this.detect();
    return {
      platform,
      isNative: this.isNative(),
      isLINE: this.isLINE(),
      supportsCamera: platform !== 'web',
      supportsPushNotifications: this.isNative(),
      supportsStatusBar: this.isNative()
    };
  }
}
