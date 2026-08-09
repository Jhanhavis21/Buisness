type LogLevel = 'info' | 'warn' | 'error';

class Logger {
  private formatMessage(level: LogLevel, message: string, metadata?: Record<string, unknown>): string {
    const base = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;
    if (!metadata || Object.keys(metadata).length === 0) {
      return base;
    }

    return `${base} ${JSON.stringify(metadata)}`;
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    console.info(this.formatMessage('info', message, metadata));
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    console.warn(this.formatMessage('warn', message, metadata));
  }

  error(message: string, metadata?: Record<string, unknown>): void {
    console.error(this.formatMessage('error', message, metadata));
  }
}

export const logger = new Logger();
