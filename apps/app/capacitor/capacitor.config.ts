import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.neeiz.jobtoday',
  appName: 'NEEIZ',
  webDir: 'dist',
  plugins: {
    PushNotifications: {},
    LocalNotifications: {},
    Camera: {},
    StatusBar: {
      style: "default"
    },
    Keyboard: {
      resize: "body"
    }
  }
};

export default config;
