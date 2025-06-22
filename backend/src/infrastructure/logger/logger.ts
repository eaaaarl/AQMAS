enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogEntry {
  level: LogLevel;
  timestamp: string;
  message: string;
  meta?: Record<string, any>;
}

class Logger {
  private serviceName: string;

  constructor(serviceName: string = 'Application') {
    this.serviceName = serviceName;
  }

  private log(level: LogLevel, message: string, meta?: Record<string, any>): void {
    const logEntry: LogEntry = {
      level,
      timestamp: new Date().toISOString(),
      message,
      meta: {
        ...meta,
        service: this.serviceName,
      },
    };

    const output = JSON.stringify(logEntry, null, 2);
    
    switch (level) {
      case LogLevel.ERROR:
        console.error(output);
        break;
      case LogLevel.WARN:
        console.warn(output);
        break;
      case LogLevel.INFO:
        console.info(output);
        break;
      case LogLevel.DEBUG:
      default:
        console.log(output);
        break;
    }
  }

  debug(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, meta);
  }

  info(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, meta);
  }

  warn(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, meta);
  }

  error(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, meta);
  }
}

export const logger = new Logger('AQMAS-Backend'); 