// Platform Service
export { platformService, PlatformService } from './platform';
export type { PlatformType, PlatformCapabilities } from './platform';

// Native Services
export { cameraService, CameraService } from './native/camera';
export { locationService, LocationService } from './native/location';
export type { 
  CameraOptions, 
  CameraResult
} from './native/camera';
export type {
  LocationResult,
  LocationOptions 
} from './native/location';

// LIFF Services
export { liffService, LiffService } from './liff/auth';
export type { LiffProfile, LiffShareData } from './liff/auth';

// Configuration
export { configService, ConfigService, defaultConfig } from '../config/app';
export type { AppConfig, PlatformConfig } from '../config/app';
