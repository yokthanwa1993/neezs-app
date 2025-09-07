export interface PlatformConfig {
  name: string;
  enabled: boolean;
  features: {
    camera: boolean;
    location: boolean;
    pushNotifications: boolean;
    sharing: boolean;
    biometric: boolean;
    backgroundSync: boolean;
  };
  settings: Record<string, any>;
}

export interface AppConfig {
  platforms: {
    web: PlatformConfig;
    pwa: PlatformConfig;
    ios: PlatformConfig;
    android: PlatformConfig;
    line: PlatformConfig;
  };
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  firebase: {
    projectId: string;
    apiKey: string;
    authDomain: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
  };
  liff: {
    seekerId: string;
    employerId: string;
    enabled: boolean;
  };
  capacitor: {
    enabled: boolean;
    plugins: string[];
  };
  features: {
    analytics: boolean;
    crashReporting: boolean;
    performanceMonitoring: boolean;
    debugging: boolean;
  };
  ui: {
    theme: 'light' | 'dark' | 'auto';
    animations: boolean;
    reducedMotion: boolean;
  };
}

const defaultConfig: AppConfig = {
  platforms: {
    web: {
      name: 'Web',
      enabled: true,
      features: {
        camera: true,
        location: true,
        pushNotifications: true,
        sharing: true,
        biometric: false,
        backgroundSync: false,
      },
      settings: {
        serviceWorker: true,
        webComponents: true,
      },
    },
    pwa: {
      name: 'PWA',
      enabled: true,
      features: {
        camera: true,
        location: true,
        pushNotifications: true,
        sharing: true,
        biometric: false,
        backgroundSync: true,
      },
      settings: {
        installPrompt: true,
        offline: true,
        manifest: '/manifest.json',
      },
    },
    ios: {
      name: 'iOS',
      enabled: true,
      features: {
        camera: true,
        location: true,
        pushNotifications: true,
        sharing: true,
        biometric: true,
        backgroundSync: true,
      },
      settings: {
        statusBarStyle: 'default',
        keyboardResize: 'body',
        hideKeyboardAccessoryBar: true,
        allowsLinkPreview: false,
      },
    },
    android: {
      name: 'Android',
      enabled: true,
      features: {
        camera: true,
        location: true,
        pushNotifications: true,
        sharing: true,
        biometric: true,
        backgroundSync: true,
      },
      settings: {
        statusBarStyle: 'default',
        keyboardResize: 'body',
        allowMixedContent: false,
      },
    },
    line: {
      name: 'LINE LIFF',
      enabled: true,
      features: {
        camera: true,
        location: true,
        pushNotifications: false, // LINE handles this
        sharing: true,
        biometric: false,
        backgroundSync: false,
      },
      settings: {
        autoLogin: true,
        scanQR: true,
        shareTarget: true,
      },
    },
  },
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    timeout: 30000,
    retries: 3,
  },
  firebase: {
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'neeiz-01',
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'neeiz-01.firebaseapp.com',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'neeiz-01.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  },
  liff: {
    seekerId: import.meta.env.VITE_LIFF_ID_SEEKER || '',
    employerId: import.meta.env.VITE_LIFF_ID_EMPLOYER || '',
    enabled: !!(import.meta.env.VITE_LIFF_ID_SEEKER || import.meta.env.VITE_LIFF_ID_EMPLOYER),
  },
  capacitor: {
    enabled: typeof window !== 'undefined' && !!(window as any).Capacitor,
    plugins: ['Camera', 'Geolocation', 'PushNotifications', 'LocalNotifications', 'StatusBar', 'Keyboard'],
  },
  features: {
    analytics: import.meta.env.VITE_ANALYTICS_ENABLED === 'true',
    crashReporting: import.meta.env.VITE_CRASH_REPORTING_ENABLED === 'true',
    performanceMonitoring: import.meta.env.VITE_PERFORMANCE_MONITORING_ENABLED === 'true',
    debugging: import.meta.env.DEV === true,
  },
  ui: {
    theme: (import.meta.env.VITE_DEFAULT_THEME as 'light' | 'dark' | 'auto') || 'auto',
    animations: import.meta.env.VITE_ANIMATIONS_ENABLED !== 'false',
    reducedMotion: false, // Will be detected at runtime
  },
};

export class ConfigService {
  private static _instance: ConfigService;
  private config: AppConfig;

  private constructor() {
    this.config = { ...defaultConfig };
    this.detectRuntimeSettings();
  }

  static getInstance(): ConfigService {
    if (!ConfigService._instance) {
      ConfigService._instance = new ConfigService();
    }
    return ConfigService._instance;
  }

  private detectRuntimeSettings(): void {
    if (typeof window !== 'undefined') {
      // Detect reduced motion preference
      this.config.ui.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Update Capacitor status
      this.config.capacitor.enabled = !!(window as any).Capacitor;
    }
  }

  getConfig(): AppConfig {
    return { ...this.config };
  }

  getPlatformConfig(platform?: string): PlatformConfig {
    const currentPlatform = platform || this.detectPlatform();
    return this.config.platforms[currentPlatform as keyof typeof this.config.platforms] || this.config.platforms.web;
  }

  getApiConfig() {
    return this.config.api;
  }

  getFirebaseConfig() {
    return this.config.firebase;
  }

  getLiffConfig() {
    return this.config.liff;
  }

  getCapacitorConfig() {
    return this.config.capacitor;
  }

  getFeaturesConfig() {
    return this.config.features;
  }

  getUIConfig() {
    return this.config.ui;
  }

  private detectPlatform(): string {
    if (typeof window === 'undefined') return 'web';
    
    if ((window as any).liff) return 'line';
    if ((window as any).Capacitor) {
      const platform = (window as any).Capacitor.getPlatform();
      return platform === 'ios' || platform === 'android' ? platform : 'web';
    }
    if (window.matchMedia('(display-mode: standalone)').matches) return 'pwa';
    
    return 'web';
  }

  updateConfig(updates: Partial<AppConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.config.features[feature];
  }

  isPlatformEnabled(platform: keyof AppConfig['platforms']): boolean {
    return this.config.platforms[platform].enabled;
  }

  getPlatformFeature(platform: string, feature: keyof PlatformConfig['features']): boolean {
    const platformConfig = this.getPlatformConfig(platform);
    return platformConfig.features[feature];
  }

  // Environment helpers
  isDevelopment(): boolean {
    return import.meta.env.DEV;
  }

  isProduction(): boolean {
    return import.meta.env.PROD;
  }

  getEnvironment(): string {
    return import.meta.env.MODE || 'development';
  }

  // Validation
  validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check required Firebase config
    if (!this.config.firebase.apiKey) {
      errors.push('Firebase API key is missing');
    }
    if (!this.config.firebase.projectId) {
      errors.push('Firebase project ID is missing');
    }

    // Check LIFF config if enabled
    if (this.config.liff.enabled) {
      if (!this.config.liff.seekerId && !this.config.liff.employerId) {
        errors.push('LIFF is enabled but no LIFF IDs are configured');
      }
    }

    // Check API config
    if (!this.config.api.baseUrl) {
      errors.push('API base URL is missing');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const configService = ConfigService.getInstance();

// Export default config for reference
export { defaultConfig };
