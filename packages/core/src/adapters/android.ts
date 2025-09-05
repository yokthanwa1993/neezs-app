import { IosPlatformAdapter } from './ios';

export class AndroidPlatformAdapter extends IosPlatformAdapter {
  config = {
    ...this.config,
    name: 'android' as const,
    authMethods: ['email', 'google'] as const, // No Apple Sign In for Android
  };
}
