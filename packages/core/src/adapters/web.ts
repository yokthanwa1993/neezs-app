import { PlatformAdapter, PlatformConfig, AuthAdapter, StorageAdapter, NavigationAdapter } from '../platform';

class WebAuthAdapter implements AuthAdapter {
  async login(method: string) {
    // Web-specific login logic
    if (method === 'email') {
      // Firebase Auth email login
    } else if (method === 'google') {
      // Google OAuth
    }
  }
  
  async logout() {
    // Web logout
  }
  
  async getCurrentUser() {
    // Get current user from Firebase
    return null;
  }
}

class WebStorageAdapter implements StorageAdapter {
  async get(key: string) {
    return JSON.parse(localStorage.getItem(key) || 'null');
  }
  
  async set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  
  async remove(key: string) {
    localStorage.removeItem(key);
  }
}

class WebNavigationAdapter implements NavigationAdapter {
  navigate(path: string) {
    window.location.href = path;
  }
  
  goBack() {
    window.history.back();
  }
  
  replace(path: string) {
    window.location.replace(path);
  }
}

export class WebPlatformAdapter implements PlatformAdapter {
  config: PlatformConfig = {
    name: 'web',
    supportsNotifications: true,
    supportsOffline: true,
    authMethods: ['email', 'google'],
    storageType: 'localStorage'
  };
  
  auth = new WebAuthAdapter();
  storage = new WebStorageAdapter();
  navigation = new WebNavigationAdapter();
}
