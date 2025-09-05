import { logger } from '@/shared/utils/logger';

export enum CircuitState {
  CLOSED = 'CLOSED',     // Normal operation
  OPEN = 'OPEN',         // Circuit is open, failing fast
  HALF_OPEN = 'HALF_OPEN' // Testing if service recovered
}

export interface CircuitBreakerConfig {
  failureThreshold: number;    // Number of failures before opening
  recoveryTimeout: number;     // Time to wait before trying again (ms)
  monitoringPeriod: number;    // Time window for failure counting (ms)
  successThreshold: number;    // Successes needed in half-open to close
}

export class AuthCircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number = 0;
  private successes: number = 0;
  private lastFailureTime: number = 0;
  private nextAttemptTime: number = 0;

  constructor(
    private config: CircuitBreakerConfig,
    private serviceName: string = 'AuthService'
  ) {
    logger.info(`AuthCircuitBreaker: Initialized for ${serviceName}`, {
      config: this.config,
      initialState: this.state
    });
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() < this.nextAttemptTime) {
        const remainingTime = this.nextAttemptTime - Date.now();
        logger.warn(`AuthCircuitBreaker: ${this.serviceName} circuit is OPEN, failing fast`, {
          remainingTime,
          failures: this.failures
        });
        throw new Error(`${this.serviceName}: Circuit breaker is OPEN`);
      } else {
        // Time to try again - move to half-open
        this.state = CircuitState.HALF_OPEN;
        this.successes = 0;
        logger.info(`AuthCircuitBreaker: ${this.serviceName} moving to HALF_OPEN state`);
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error);
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;

    if (this.state === CircuitState.HALF_OPEN) {
      this.successes++;
      if (this.successes >= this.config.successThreshold) {
        this.state = CircuitState.CLOSED;
        logger.info(`AuthCircuitBreaker: ${this.serviceName} circuit CLOSED after ${this.successes} successes`);
      }
    }

    logger.debug(`AuthCircuitBreaker: ${this.serviceName} success`, {
      state: this.state,
      successes: this.successes
    });
  }

  private onFailure(error: any): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.state === CircuitState.HALF_OPEN) {
      // Failed in half-open, go back to open
      this.state = CircuitState.OPEN;
      this.nextAttemptTime = Date.now() + this.config.recoveryTimeout;
      logger.warn(`AuthCircuitBreaker: ${this.serviceName} failed in HALF_OPEN, back to OPEN`, {
        error: error?.message,
        nextAttemptIn: this.config.recoveryTimeout
      });
    } else if (this.failures >= this.config.failureThreshold) {
      // Enough failures, open the circuit
      this.state = CircuitState.OPEN;
      this.nextAttemptTime = Date.now() + this.config.recoveryTimeout;
      logger.warn(`AuthCircuitBreaker: ${this.serviceName} circuit OPEN after ${this.failures} failures`, {
        threshold: this.config.failureThreshold,
        nextAttemptIn: this.config.recoveryTimeout
      });
    }

    // Clean up old failures outside monitoring period
    this.cleanupOldFailures();
  }

  private cleanupOldFailures(): void {
    const cutoffTime = Date.now() - this.config.monitoringPeriod;
    if (this.lastFailureTime < cutoffTime) {
      this.failures = Math.max(0, this.failures - 1);
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  getStats() {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      lastFailureTime: this.lastFailureTime,
      nextAttemptTime: this.nextAttemptTime,
      timeToNextAttempt: Math.max(0, this.nextAttemptTime - Date.now())
    };
  }

  // Force reset for testing or manual intervention
  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failures = 0;
    this.successes = 0;
    this.lastFailureTime = 0;
    this.nextAttemptTime = 0;
    logger.info(`AuthCircuitBreaker: ${this.serviceName} circuit manually reset`);
  }
}

// Factory for creating circuit breakers with sensible defaults
export class AuthCircuitBreakerFactory {
  static createAuthBreaker(serviceName: string = 'FirebaseAuth'): AuthCircuitBreaker {
    return new AuthCircuitBreaker({
      failureThreshold: 5,      // Open after 5 failures
      recoveryTimeout: 30000,   // Wait 30 seconds before retry
      monitoringPeriod: 60000,  // Monitor failures over 1 minute
      successThreshold: 2       // Need 2 successes to close
    }, serviceName);
  }

  static createLIFFBreaker(): AuthCircuitBreaker {
    return new AuthCircuitBreaker({
      failureThreshold: 3,      // Open after 3 failures
      recoveryTimeout: 15000,   // Wait 15 seconds before retry
      monitoringPeriod: 30000,  // Monitor over 30 seconds
      successThreshold: 1       // Need 1 success to close
    }, 'LINE LIFF');
  }
}
