import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { platformService } from '../platform';

export interface CameraOptions {
  quality?: number;
  allowEditing?: boolean;
  resultType?: 'base64' | 'uri';
  source?: 'camera' | 'gallery' | 'prompt';
}

export interface CameraResult {
  base64String?: string;
  dataUrl?: string;
  format: string;
  saved: boolean;
}

export class CameraService {
  private static _instance: CameraService;

  static getInstance(): CameraService {
    if (!CameraService._instance) {
      CameraService._instance = new CameraService();
    }
    return CameraService._instance;
  }

  async isAvailable(): Promise<boolean> {
    return platformService.hasCapability('camera');
  }

  async takePhoto(options: CameraOptions = {}): Promise<CameraResult> {
    const platform = platformService.getPlatform();

    switch (platform) {
      case 'ios':
      case 'android':
        return this.takePhotoCapacitor(options);
      
      case 'line':
        return this.takePhotoLIFF(options);
      
      default:
        return this.takePhotoWeb(options);
    }
  }

  private async takePhotoCapacitor(options: CameraOptions): Promise<CameraResult> {
    try {
      const image = await Camera.getPhoto({
        quality: options.quality || 90,
        allowEditing: options.allowEditing || false,
        resultType: options.resultType === 'base64' ? CameraResultType.Base64 : CameraResultType.Uri,
        source: this.mapCameraSource(options.source),
      });

      return {
        base64String: image.base64String,
        dataUrl: image.dataUrl,
        format: image.format,
        saved: image.saved || false,
      };
    } catch (error) {
      console.error('Capacitor camera error:', error);
      throw new Error('Failed to take photo with camera');
    }
  }

  private async takePhotoLIFF(options: CameraOptions): Promise<CameraResult> {
    try {
      // Check if LIFF is available
      if (!window.liff) {
        throw new Error('LIFF not available');
      }

      // Use LIFF camera API (if available in newer versions)
      // For now, fallback to web camera
      return this.takePhotoWeb(options);
    } catch (error) {
      console.error('LIFF camera error:', error);
      throw new Error('Failed to take photo in LINE');
    }
  }

  private async takePhotoWeb(options: CameraOptions): Promise<CameraResult> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Rear camera by default
        } 
      });

      return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        video.srcObject = stream;
        video.play();

        video.onloadedmetadata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // Take photo after 1 second (or implement click capture)
          setTimeout(() => {
            if (context) {
              context.drawImage(video, 0, 0);
              const dataUrl = canvas.toDataURL('image/jpeg', (options.quality || 90) / 100);
              const base64String = dataUrl.split(',')[1];

              // Stop camera stream
              stream.getTracks().forEach(track => track.stop());

              resolve({
                base64String,
                dataUrl,
                format: 'jpeg',
                saved: false,
              });
            } else {
              reject(new Error('Canvas context not available'));
            }
          }, 1000);
        };

        video.onerror = () => {
          stream.getTracks().forEach(track => track.stop());
          reject(new Error('Video stream error'));
        };
      });
    } catch (error) {
      console.error('Web camera error:', error);
      throw new Error('Failed to access camera');
    }
  }

  private mapCameraSource(source?: string): CameraSource {
    switch (source) {
      case 'camera':
        return CameraSource.Camera;
      case 'gallery':
        return CameraSource.Photos;
      case 'prompt':
        return CameraSource.Prompt;
      default:
        return CameraSource.Prompt;
    }
  }

  async selectFromGallery(options: CameraOptions = {}): Promise<CameraResult> {
    return this.takePhoto({
      ...options,
      source: 'gallery',
    });
  }

  // File input fallback for web
  async selectFromFileInput(): Promise<CameraResult> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
          reject(new Error('No file selected'));
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          const base64String = dataUrl.split(',')[1];

          resolve({
            base64String,
            dataUrl,
            format: file.type.split('/')[1] || 'jpeg',
            saved: false,
          });
        };

        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
      };

      input.click();
    });
  }
}

// Export singleton instance
export const cameraService = CameraService.getInstance();
