import { useState, useCallback } from 'react';
import { cameraService, CameraOptions, CameraResult } from '../services/native/camera';
import { usePlatform } from './use-platform';

export interface UseCameraReturn {
  takePhoto: (options?: CameraOptions) => Promise<CameraResult>;
  selectFromGallery: (options?: CameraOptions) => Promise<CameraResult>;
  selectFromFileInput: () => Promise<CameraResult>;
  isAvailable: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useCamera(): UseCameraReturn {
  const { hasCapability } = usePlatform();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const takePhoto = useCallback(async (options: CameraOptions = {}): Promise<CameraResult> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!hasCapability('camera')) {
        throw new Error('Camera not available on this platform');
      }

      const result = await cameraService.takePhoto(options);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to take photo';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [hasCapability]);

  const selectFromGallery = useCallback(async (options: CameraOptions = {}): Promise<CameraResult> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!hasCapability('camera')) {
        throw new Error('Camera/Gallery not available on this platform');
      }

      const result = await cameraService.selectFromGallery(options);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to select from gallery';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [hasCapability]);

  const selectFromFileInput = useCallback(async (): Promise<CameraResult> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await cameraService.selectFromFileInput();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to select file';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    takePhoto,
    selectFromGallery,
    selectFromFileInput,
    isAvailable: hasCapability('camera'),
    isLoading,
    error,
  };
}
