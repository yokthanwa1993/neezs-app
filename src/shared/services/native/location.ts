import { Geolocation, Position, PositionOptions } from '@capacitor/geolocation';
import { platformService } from '../platform';

export interface LocationResult {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

export interface LocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export class LocationService {
  private static _instance: LocationService;
  private watchId: string | null = null;

  static getInstance(): LocationService {
    if (!LocationService._instance) {
      LocationService._instance = new LocationService();
    }
    return LocationService._instance;
  }

  async isAvailable(): Promise<boolean> {
    return platformService.hasCapability('location');
  }

  async getCurrentPosition(options: LocationOptions = {}): Promise<LocationResult> {
    const platform = platformService.getPlatform();

    switch (platform) {
      case 'ios':
      case 'android':
        return this.getCurrentPositionCapacitor(options);
      
      case 'line':
        return this.getCurrentPositionLIFF(options);
      
      default:
        return this.getCurrentPositionWeb(options);
    }
  }

  private async getCurrentPositionCapacitor(options: LocationOptions): Promise<LocationResult> {
    try {
      const position: Position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: options.enableHighAccuracy ?? true,
        timeout: options.timeout ?? 10000,
        maximumAge: options.maximumAge ?? 60000,
      });

      return this.mapPositionToResult(position);
    } catch (error) {
      console.error('Capacitor location error:', error);
      throw new Error('Failed to get current location');
    }
  }

  private async getCurrentPositionLIFF(options: LocationOptions): Promise<LocationResult> {
    try {
      // Check if LIFF is available
      if (!window.liff || !window.liff.getLocation) {
        throw new Error('LIFF location not available');
      }

      // Use LIFF location API
      const liffLocation = await window.liff.getLocation();
      
      return {
        latitude: liffLocation.latitude,
        longitude: liffLocation.longitude,
        accuracy: 10, // LIFF doesn't provide accuracy
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('LIFF location error:', error);
      // Fallback to web geolocation
      return this.getCurrentPositionWeb(options);
    }
  }

  private async getCurrentPositionWeb(options: LocationOptions): Promise<LocationResult> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude ?? undefined,
            altitudeAccuracy: position.coords.altitudeAccuracy ?? undefined,
            heading: position.coords.heading ?? undefined,
            speed: position.coords.speed ?? undefined,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          console.error('Web geolocation error:', error);
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: options.enableHighAccuracy ?? true,
          timeout: options.timeout ?? 10000,
          maximumAge: options.maximumAge ?? 60000,
        }
      );
    });
  }

  async watchPosition(
    callback: (position: LocationResult) => void,
    errorCallback?: (error: Error) => void,
    options: LocationOptions = {}
  ): Promise<string> {
    const platform = platformService.getPlatform();

    switch (platform) {
      case 'ios':
      case 'android':
        return this.watchPositionCapacitor(callback, errorCallback, options);
      
      default:
        return this.watchPositionWeb(callback, errorCallback, options);
    }
  }

  private async watchPositionCapacitor(
    callback: (position: LocationResult) => void,
    errorCallback?: (error: Error) => void,
    options: LocationOptions = {}
  ): Promise<string> {
    try {
      const watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: options.enableHighAccuracy ?? true,
          timeout: options.timeout ?? 10000,
        },
        (position, err) => {
          if (err) {
            errorCallback?.(new Error(err.message));
            return;
          }
          
          if (position) {
            callback(this.mapPositionToResult(position));
          }
        }
      );

      this.watchId = watchId;
      return watchId;
    } catch (error) {
      console.error('Capacitor watch position error:', error);
      throw new Error('Failed to watch position');
    }
  }

  private async watchPositionWeb(
    callback: (position: LocationResult) => void,
    errorCallback?: (error: Error) => void,
    options: LocationOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          callback({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude ?? undefined,
            altitudeAccuracy: position.coords.altitudeAccuracy ?? undefined,
            heading: position.coords.heading ?? undefined,
            speed: position.coords.speed ?? undefined,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          errorCallback?.(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: options.enableHighAccuracy ?? true,
          timeout: options.timeout ?? 10000,
          maximumAge: options.maximumAge ?? 60000,
        }
      );

      this.watchId = watchId.toString();
      resolve(this.watchId);
    });
  }

  async clearWatch(): Promise<void> {
    if (!this.watchId) return;

    const platform = platformService.getPlatform();

    try {
      if (platform === 'ios' || platform === 'android') {
        await Geolocation.clearWatch({ id: this.watchId });
      } else {
        navigator.geolocation.clearWatch(parseInt(this.watchId));
      }
      
      this.watchId = null;
    } catch (error) {
      console.error('Failed to clear location watch:', error);
    }
  }

  private mapPositionToResult(position: Position): LocationResult {
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude ?? undefined,
      altitudeAccuracy: position.coords.altitudeAccuracy ?? undefined,
      heading: position.coords.heading ?? undefined,
      speed: position.coords.speed ?? undefined,
      timestamp: position.timestamp,
    };
  }

  // Utility methods
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in kilometers
    return d;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  static formatLocation(location: LocationResult): string {
    return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
  }
}

// Export singleton instance
export const locationService = LocationService.getInstance();
