export interface PlatformConfig {
  name: 'web' | 'line' | 'ios' | 'android';
  supportsNotifications: boolean;
  supportsOffline: boolean;
  authMethods: ('email' | 'line' | 'google' | 'apple')[];
  storageType: 'localStorage' | 'nativeStorage' | 'limitedStorage';
}

export interface PlatformAdapter {
  config: PlatformConfig;
  auth: AuthAdapter;
  storage: StorageAdapter;
  navigation: NavigationAdapter;
  notifications?: NotificationAdapter;
}

export interface AuthAdapter {
  login(method: string): Promise<any>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<any>;
}

export interface StorageAdapter {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  remove(key: string): Promise<void>;
}

export interface NavigationAdapter {
  navigate(path: string): void;
  goBack(): void;
  replace(path: string): void;
}

export interface NotificationAdapter {
  requestPermission(): Promise<boolean>;
  sendLocal(message: string): Promise<void>;
  subscribe(topic: string): Promise<void>;
}
