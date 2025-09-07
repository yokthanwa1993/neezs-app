// Simple logging utility to write logs to file via backend API
class Logger {
  private async writeLog(level: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data: data ? JSON.stringify(data, null, 2) : undefined
    };

    try {
      // Send log to backend to write to file
      await fetch('/api/logs/write', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logFile: 'auth.log',
          entry: `[${timestamp}] [${level}] ${message}${data ? '\n' + JSON.stringify(data, null, 2) : ''}\n`
        })
      });
    } catch (error) {
      // Fallback to console if API fails
      console.log(`[${timestamp}] [${level}] ${message}`, data || '');
    }
  }

  info(message: string, data?: any) {
    this.writeLog('INFO', message, data);
  }

  error(message: string, data?: any) {
    this.writeLog('ERROR', message, data);
  }

  warn(message: string, data?: any) {
    this.writeLog('WARN', message, data);
  }

  debug(message: string, data?: any) {
    this.writeLog('DEBUG', message, data);
  }
}

export const logger = new Logger();
