/**
 * SuburbMates V1.1 - Structured Logging
 * Centralized logging with context and levels
 */

import { PLATFORM } from './constants';

// ============================================================================
// LOG LEVELS
// ============================================================================

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

const LOG_LEVEL_PRIORITY = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
  [LogLevel.FATAL]: 4,
};

// ============================================================================
// LOG ENTRY
// ============================================================================

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  metadata?: {
    userId?: string;
    vendorId?: string;
    requestId?: string;
    ip?: string;
    userAgent?: string;
  };
}

// ============================================================================
// LOGGER CONFIGURATION
// ============================================================================

interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableStructured: boolean;
  includeTimestamp: boolean;
  includeStack: boolean;
}

const DEFAULT_CONFIG: LoggerConfig = {
  minLevel: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  enableConsole: true,
  enableStructured: process.env.NODE_ENV === 'production',
  includeTimestamp: true,
  includeStack: process.env.NODE_ENV === 'development',
};

let currentConfig: LoggerConfig = { ...DEFAULT_CONFIG };

/**
 * Configure logger settings
 */
export function configureLogger(config: Partial<LoggerConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

// ============================================================================
// LOGGER CLASS
// ============================================================================

export class Logger {
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  /**
   * Create child logger with specific context
   */
  child(context: string): Logger {
    const childContext = this.context ? `${this.context}:${context}` : context;
    return new Logger(childContext);
  }

  /**
   * Log debug message
   */
  debug(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * Log info message
   */
  info(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | unknown, data?: Record<string, unknown>): void {
    const errorData = error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: currentConfig.includeStack ? error.stack : undefined,
        }
      : undefined;

    this.log(LogLevel.ERROR, message, data, errorData);
  }

  /**
   * Log fatal error (critical system failure)
   */
  fatal(message: string, error?: Error | unknown, data?: Record<string, unknown>): void {
    const errorData = error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack, // Always include stack for fatal errors
        }
      : undefined;

    this.log(LogLevel.FATAL, message, data, errorData);
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    data?: Record<string, unknown>,
    error?: { name: string; message: string; stack?: string }
  ): void {
    // Check if this level should be logged
    if (LOG_LEVEL_PRIORITY[level] < LOG_LEVEL_PRIORITY[currentConfig.minLevel]) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.context,
      data,
      error,
    };

    if (currentConfig.enableStructured) {
      this.logStructured(entry);
    }

    if (currentConfig.enableConsole) {
      this.logConsole(entry);
    }
  }

  /**
   * Log structured JSON (for production)
   */
  private logStructured(entry: LogEntry): void {
    console.log(JSON.stringify(entry));
  }

  /**
   * Log to console with formatting (for development)
   */
  private logConsole(entry: LogEntry): void {
    const { level, message, context, data, error } = entry;
    const timestamp = currentConfig.includeTimestamp
      ? `[${new Date(entry.timestamp).toLocaleTimeString()}]`
      : '';

    const contextStr = context ? `[${context}]` : '';
    const levelStr = `[${level.toUpperCase()}]`;

    // Color coding for different levels
    const colors = {
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.INFO]: '\x1b[32m',  // Green
      [LogLevel.WARN]: '\x1b[33m',  // Yellow
      [LogLevel.ERROR]: '\x1b[31m', // Red
      [LogLevel.FATAL]: '\x1b[35m', // Magenta
    };
    const reset = '\x1b[0m';
    const color = colors[level];

    const logMessage = `${color}${timestamp}${levelStr}${contextStr}${reset} ${message}`;

    // Choose appropriate console method
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, data || '');
        break;
      case LogLevel.INFO:
        console.info(logMessage, data || '');
        break;
      case LogLevel.WARN:
        console.warn(logMessage, data || '');
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(logMessage, data || '');
        if (error) {
          console.error(`  Error: ${error.name}: ${error.message}`);
          if (error.stack) {
            console.error(`  Stack: ${error.stack}`);
          }
        }
        break;
    }
  }
}

// ============================================================================
// DEFAULT LOGGER INSTANCE
// ============================================================================

export const logger = new Logger(PLATFORM.NAME);

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Create logger with specific context
 */
export function createLogger(context: string): Logger {
  return new Logger(context);
}

/**
 * Log debug message
 */
export function debug(message: string, data?: Record<string, unknown>): void {
  logger.debug(message, data);
}

/**
 * Log info message
 */
export function info(message: string, data?: Record<string, unknown>): void {
  logger.info(message, data);
}

/**
 * Log warning message
 */
export function warn(message: string, data?: Record<string, unknown>): void {
  logger.warn(message, data);
}

/**
 * Log error message
 */
export function error(message: string, err?: Error | unknown, data?: Record<string, unknown>): void {
  logger.error(message, err, data);
}

/**
 * Log fatal error
 */
export function fatal(message: string, err?: Error | unknown, data?: Record<string, unknown>): void {
  logger.fatal(message, err, data);
}

// ============================================================================
// PERFORMANCE LOGGING
// ============================================================================

/**
 * Measure and log execution time
 */
export async function measureAsync<T>(
  operation: string,
  fn: () => Promise<T>,
  context?: string
): Promise<T> {
  const log = context ? new Logger(context) : logger;
  const start = Date.now();
  
  try {
    log.debug(`Starting: ${operation}`);
    const result = await fn();
    const duration = Date.now() - start;
    log.info(`Completed: ${operation}`, { durationMs: duration });
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    log.error(`Failed: ${operation}`, error, { durationMs: duration });
    throw error;
  }
}

/**
 * Measure sync function execution time
 */
export function measure<T>(
  operation: string,
  fn: () => T,
  context?: string
): T {
  const log = context ? new Logger(context) : logger;
  const start = Date.now();
  
  try {
    log.debug(`Starting: ${operation}`);
    const result = fn();
    const duration = Date.now() - start;
    log.info(`Completed: ${operation}`, { durationMs: duration });
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    log.error(`Failed: ${operation}`, error, { durationMs: duration });
    throw error;
  }
}

// ============================================================================
// REQUEST LOGGING
// ============================================================================

export interface RequestLogData {
  method: string;
  url: string;
  statusCode?: number;
  durationMs?: number;
  userId?: string;
  ip?: string;
  userAgent?: string;
  error?: string;
}

/**
 * Log HTTP request
 */
export function logRequest(data: RequestLogData): void {
  const { method, url, statusCode, durationMs } = data;
  const message = `${method} ${url} ${statusCode || '---'}`;
  
  if (statusCode && statusCode >= 500) {
    logger.error(message, undefined, data as unknown as Record<string, unknown>);
  } else if (statusCode && statusCode >= 400) {
    logger.warn(message, data as unknown as Record<string, unknown>);
  } else {
    logger.info(message, data as unknown as Record<string, unknown>);
  }
}

// ============================================================================
// BUSINESS EVENT LOGGING
// ============================================================================

export enum BusinessEvent {
  USER_SIGNUP = 'user.signup',
  USER_LOGIN = 'user.login',
  VENDOR_CREATED = 'vendor.created',
  VENDOR_APPROVED = 'vendor.approved',
  VENDOR_SUSPENDED = 'vendor.suspended',
  PRODUCT_CREATED = 'product.created',
  PRODUCT_PUBLISHED = 'product.published',
  ORDER_CREATED = 'order.created',
  ORDER_COMPLETED = 'order.completed',
  REFUND_REQUESTED = 'refund.requested',
  REFUND_PROCESSED = 'refund.processed',
  DISPUTE_CREATED = 'dispute.created',
  DISPUTE_RESOLVED = 'dispute.resolved',
  APPEAL_SUBMITTED = 'appeal.submitted',
  APPEAL_DECIDED = 'appeal.decided',
  FEATURED_SLOT_PURCHASED = 'featured_slot.purchased',
}

/**
 * Log business event
 */
export function logEvent(event: BusinessEvent, data?: Record<string, unknown>): void {
  logger.info(`Event: ${event}`, data);
}

// ============================================================================
// SECURITY LOGGING
// ============================================================================

export enum SecurityEvent {
  AUTH_FAILED = 'security.auth_failed',
  AUTH_SUCCESS = 'security.auth_success',
  PERMISSION_DENIED = 'security.permission_denied',
  SUSPICIOUS_ACTIVITY = 'security.suspicious_activity',
  RATE_LIMIT_EXCEEDED = 'security.rate_limit_exceeded',
}

/**
 * Log security event
 */
export function logSecurityEvent(
  event: SecurityEvent,
  data?: Record<string, unknown>
): void {
  const log = new Logger('Security');
  log.warn(`Security Event: ${event}`, data);
}

// ============================================================================
// AUDIT LOGGING
// ============================================================================

export interface AuditLogData {
  actor: string; // userId or system
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  reason?: string;
}

/**
 * Log audit trail
 */
export function logAudit(data: AuditLogData): void {
  const log = new Logger('Audit');
  const { actor, action, resource, resourceId } = data;
  const message = `${actor} ${action} ${resource}${resourceId ? ` (${resourceId})` : ''}`;
  log.info(message, data as unknown as Record<string, unknown>);
}

// ============================================================================
// EXPORT DEFAULT LOGGER
// ============================================================================

export default logger;
