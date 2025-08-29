import { useEffect } from 'react';
import { SafeArea } from 'capacitor-plugin-safe-area';

export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const useSafeArea = () => {
  useEffect(() => {
    const initializeSafeArea = async () => {
      try {
        // Get initial safe area insets
        const safeAreaData = await SafeArea.getSafeAreaInsets();
        const { insets } = safeAreaData;
        
        // Apply safe area insets as CSS variables
        for (const [key, value] of Object.entries(insets)) {
          document.documentElement.style.setProperty(
            `--safe-area-inset-${key}`,
            `${value}px`,
          );
        }
        
        // Listen for safe area changes
        const listener = await SafeArea.addListener('safeAreaChanged', (data) => {
          const { insets } = data;
          for (const [key, value] of Object.entries(insets)) {
            document.documentElement.style.setProperty(
              `--safe-area-inset-${key}`,
              `${value}px`,
            );
          }
        });
        
        // Cleanup listener on unmount
        return () => {
          listener.remove();
        };
      } catch (error) {
        console.warn('Safe area plugin not available:', error);
      }
    };
    
    initializeSafeArea();
  }, []);
}; 