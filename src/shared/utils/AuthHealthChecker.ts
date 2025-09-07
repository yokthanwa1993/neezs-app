import { logger } from '@/shared/utils/logger';

export interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  lastChecked: number;
  error?: string;
  details?: any;
}

export class AuthHealthChecker {
  private static instance: AuthHealthChecker;
  private healthChecks: Map<string, HealthCheckResult> = new Map();
  private checkInterval: NodeJS.Timeout | null = null;

  static getInstance(): AuthHealthChecker {
    if (!AuthHealthChecker.instance) {
      AuthHealthChecker.instance = new AuthHealthChecker();
    }
    return AuthHealthChecker.instance;
  }

  startMonitoring(intervalMs: number = 30000) { // Check every 30 seconds
    // Skip health monitoring in development mode
    if (import.meta.env.DEV) {
      logger.info('AuthHealthChecker: Skipping monitoring in development mode');
      return;
    }

    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(() => {
      this.performHealthChecks();
    }, intervalMs);

    logger.info('AuthHealthChecker: Started monitoring', { intervalMs });
  }

  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    logger.info('AuthHealthChecker: Stopped monitoring');
  }

  private async performHealthChecks() {
    const checks = [
      this.checkFirebaseConnectivity(),
      this.checkNetworkConnectivity(),
      this.checkLocalStorage(),
      this.checkSessionIntegrity()
    ];

    await Promise.allSettled(checks);
  }

  private async checkFirebaseConnectivity(): Promise<void> {
    const startTime = Date.now();

    try {
      // Simple connectivity check - in real app, you'd check Firebase services
      const isOnline = navigator.onLine;

      const result: HealthCheckResult = {
        service: 'Firebase Connectivity',
        status: isOnline ? 'healthy' : 'unhealthy',
        responseTime: Date.now() - startTime,
        lastChecked: Date.now(),
        details: { isOnline }
      };

      this.healthChecks.set('firebase', result);

      if (!isOnline) {
        logger.warn('AuthHealthChecker: Firebase connectivity degraded');
      }
    } catch (error) {
      const result: HealthCheckResult = {
        service: 'Firebase Connectivity',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        lastChecked: Date.now(),
        error: error.message
      };

      this.healthChecks.set('firebase', result);
      logger.error('AuthHealthChecker: Firebase connectivity check failed', { error: error.message });
    }
  }

  private async checkNetworkConnectivity(): Promise<void> {
    const startTime = Date.now();

    try {
      // Skip network check in development mode
      if (import.meta.env.DEV) {
        const result: HealthCheckResult = {
          service: 'Network Connectivity',
          status: 'healthy',
          responseTime: Date.now() - startTime,
          lastChecked: Date.now(),
          details: { isDev: true, skipped: true }
        };
        this.healthChecks.set('network', result);
        return;
      }

      // Check network connectivity with a lightweight request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('/api/health', {
        method: 'HEAD',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const result: HealthCheckResult = {
        service: 'Network Connectivity',
        status: response.ok ? 'healthy' : 'degraded',
        responseTime: Date.now() - startTime,
        lastChecked: Date.now(),
        details: { statusCode: response.status }
      };

      this.healthChecks.set('network', result);
    } catch (error) {
      const result: HealthCheckResult = {
        service: 'Network Connectivity',
        status: error.name === 'AbortError' ? 'degraded' : 'unhealthy',
        responseTime: Date.now() - startTime,
        lastChecked: Date.now(),
        error: error.message
      };

      this.healthChecks.set('network', result);
      logger.warn('AuthHealthChecker: Network connectivity issue', { error: error.message });
    }
  }

  private async checkLocalStorage(): Promise<void> {
    const startTime = Date.now();

    try {
      // Check localStorage availability and integrity
      const testKey = '__health_check_test__';
      const testValue = `test_${Date.now()}`;

      localStorage.setItem(testKey, testValue);
      const retrievedValue = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      const isHealthy = retrievedValue === testValue;

      const result: HealthCheckResult = {
        service: 'Local Storage',
        status: isHealthy ? 'healthy' : 'unhealthy',
        responseTime: Date.now() - startTime,
        lastChecked: Date.now(),
        details: { testPassed: isHealthy }
      };

      this.healthChecks.set('localStorage', result);

      if (!isHealthy) {
        logger.error('AuthHealthChecker: Local storage integrity check failed');
      }
    } catch (error) {
      const result: HealthCheckResult = {
        service: 'Local Storage',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        lastChecked: Date.now(),
        error: error.message
      };

      this.healthChecks.set('localStorage', result);
      logger.error('AuthHealthChecker: Local storage check failed', { error: error.message });
    }
  }

  private async checkSessionIntegrity(): Promise<void> {
    const startTime = Date.now();

    try {
      // Check session data integrity
      const sessionId = localStorage.getItem('sessionId');
      const lastActivity = localStorage.getItem('lastActivity');

      let isHealthy = true;
      const details: any = {};

      if (sessionId) {
        details.hasSessionId = true;
        // Check if session ID is valid format (you can add more validation)
        details.sessionIdValid = sessionId.length > 10;
        isHealthy = isHealthy && details.sessionIdValid;
      } else {
        details.hasSessionId = false;
      }

      if (lastActivity) {
        const lastActivityTime = parseInt(lastActivity);
        const now = Date.now();
        const timeSinceActivity = now - lastActivityTime;

        details.hasLastActivity = true;
        details.timeSinceActivity = timeSinceActivity;
        details.activityWithin24h = timeSinceActivity < 24 * 60 * 60 * 1000;

        // Session is degraded if inactive for more than 24 hours
        if (!details.activityWithin24h) {
          isHealthy = false;
        }
      } else {
        details.hasLastActivity = false;
      }

      const result: HealthCheckResult = {
        service: 'Session Integrity',
        status: isHealthy ? 'healthy' : 'degraded',
        responseTime: Date.now() - startTime,
        lastChecked: Date.now(),
        details
      };

      this.healthChecks.set('session', result);

      if (!isHealthy) {
        logger.warn('AuthHealthChecker: Session integrity issues detected', details);
      }
    } catch (error) {
      const result: HealthCheckResult = {
        service: 'Session Integrity',
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        lastChecked: Date.now(),
        error: error.message
      };

      this.healthChecks.set('session', result);
      logger.error('AuthHealthChecker: Session integrity check failed', { error: error.message });
    }
  }

  getHealthStatus(): Map<string, HealthCheckResult> {
    return new Map(this.healthChecks);
  }

  getOverallHealth(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: HealthCheckResult[];
    lastChecked: number;
  } {
    const services = Array.from(this.healthChecks.values());
    const lastChecked = Math.max(...services.map(s => s.lastChecked));

    // Determine overall status
    const hasUnhealthy = services.some(s => s.status === 'unhealthy');
    const hasDegraded = services.some(s => s.status === 'degraded');

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (hasUnhealthy) {
      status = 'unhealthy';
    } else if (hasDegraded) {
      status = 'degraded';
    }

    return {
      status,
      services,
      lastChecked
    };
  }

  // Manual health check trigger
  async checkNow(): Promise<void> {
    logger.info('AuthHealthChecker: Manual health check triggered');
    await this.performHealthChecks();
  }
}

// Export singleton instance
export const authHealthChecker = AuthHealthChecker.getInstance();
