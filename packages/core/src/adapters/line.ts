import { PlatformAdapter, PlatformConfig, AuthAdapter, StorageAdapter, NavigationAdapter } from '../platform';

class LineAuthAdapter implements AuthAdapter {
  async login(method: string) {
    if (method === 'line') {
      const liff = (window as any).liff;
      if (!liff.isLoggedIn()) {
        liff.login();
      }
      return liff.getProfile();
    }
  }
  
  async logout() {
    const liff = (window as any).liff;
    liff.logout();
  }
  
  async getCurrentUser() {
    const liff = (window as any).liff;
    if (liff.isLoggedIn()) {
      return liff.getProfile();
    }
    return null;
  }
}

class LineStorageAdapter implements StorageAdapter {
  async get(key: string) {
    // LINE has limited storage - use sessionStorage
    return JSON.parse(sessionStorage.getItem(key) || 'null');
  }
  
  async set(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
  
  async remove(key: string) {
    sessionStorage.removeItem(key);
  }
}

class LineNavigationAdapter implements NavigationAdapter {
  navigate(path: string) {
    // Use React Router for LINE Mini App
    window.history.pushState({}, '', path);
  }
  
  goBack() {
    const liff = (window as any).liff;
    if (liff.isInClient()) {
      liff.closeWindow();
    } else {
      window.history.back();
    }
  }
  
  replace(path: string) {
    window.history.replaceState({}, '', path);
  }
}

export class LinePlatformAdapter implements PlatformAdapter {
  config: PlatformConfig = {
    name: 'line',
    supportsNotifications: false,
    supportsOffline: false,
    authMethods: ['line'],
    storageType: 'limitedStorage'
  };
  
  auth = new LineAuthAdapter();
  storage = new LineStorageAdapter();
  navigation = new LineNavigationAdapter();
}
