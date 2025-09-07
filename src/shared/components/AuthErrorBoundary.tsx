import React, { Component, ReactNode } from 'react';
import { logger } from '@/shared/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

export class AuthErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    const errorId = `auth-error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorId = this.state.errorId || `auth-error-${Date.now()}`;

    logger.error('AuthErrorBoundary: Authentication error caught', {
      errorId,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      retryCount: this.retryCount
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Auto-retry for recoverable errors
    if (this.isRecoverableError(error) && this.retryCount < this.maxRetries) {
      this.scheduleRetry();
    }
  }

  private isRecoverableError(error: Error): boolean {
    const recoverablePatterns = [
      'network',
      'timeout',
      'connection',
      'firebase',
      'auth/network-request-failed'
    ];

    return recoverablePatterns.some(pattern =>
      error.message.toLowerCase().includes(pattern)
    );
  }

  private scheduleRetry() {
    this.retryCount += 1;
    const delay = Math.pow(2, this.retryCount) * 1000; // Exponential backoff

    logger.info(`AuthErrorBoundary: Scheduling retry ${this.retryCount}/${this.maxRetries} in ${delay}ms`);

    this.retryTimeout = setTimeout(() => {
      this.setState({ hasError: false, error: undefined, errorId: undefined });
      logger.info('AuthErrorBoundary: Retrying after error recovery');
    }, delay);
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  private handleRetry = () => {
    logger.info('AuthErrorBoundary: Manual retry requested');
    this.setState({ hasError: false, error: undefined, errorId: undefined });
    this.retryCount = 0;
  };

  private handleReportError = () => {
    const errorId = this.state.errorId;
    const errorMessage = this.state.error?.message || 'Unknown error';

    // In a real app, this would send to error reporting service
    logger.info('AuthErrorBoundary: Error reported', { errorId, errorMessage });

    // You could integrate with services like Sentry, LogRocket, etc.
    // Example: Sentry.captureException(this.state.error);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
          <div className="bg-white p-4 rounded-2xl shadow-xl w-full max-w-mobile-lg text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              เกิดข้อผิดพลาดในการยืนยันตัวตน
            </h2>

            <p className="text-gray-600 mb-6">
              ระบบไม่สามารถดำเนินการต่อได้ กรุณาลองใหม่อีกครั้ง
            </p>

            {this.state.errorId && (
              <div className="bg-gray-50 p-3 rounded-lg mb-6">
                <p className="text-xs text-gray-500 mb-1">Error ID:</p>
                <p className="text-xs font-mono text-gray-700">{this.state.errorId}</p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                ลองใหม่
              </button>
              <button
                onClick={this.handleReportError}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                รายงานปัญหา
              </button>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              โหลดหน้าใหม่
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
