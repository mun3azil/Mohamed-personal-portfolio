/**
 * Error handling utilities for consistent error management across the application
 */

// Define error severity levels
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

// Interface for error context data
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  requestId?: string;
  url?: string;
  [key: string]: unknown; // Allow for additional context properties
}

// Interface for error reporting options
export interface ErrorReportingOptions {
  severity?: ErrorSeverity;
  context?: ErrorContext;
  silent?: boolean; // If true, don't show to user
  reportToService?: boolean; // If true, send to error reporting service
}

// Default options for error reporting
const defaultOptions: ErrorReportingOptions = {
  severity: ErrorSeverity.ERROR,
  silent: false,
  reportToService: true,
};

/**
 * Format an error message with additional context
 * 
 * @param error The error object or message
 * @param context Additional context about the error
 * @returns Formatted error message
 */
export function formatErrorMessage(error: Error | string, context?: ErrorContext): string {
  const errorMessage = error instanceof Error ? error.message : error;
  
  if (!context) {
    return errorMessage;
  }
  
  const contextString = Object.entries(context as Record<string, unknown>)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
  
  return contextString ? `${errorMessage} (${contextString})` : errorMessage;
}

/**
 * Log an error with consistent formatting
 * 
 * @param error The error object or message
 * @param options Options for error reporting
 */
export function logError(
  error: Error | string,
  options: ErrorReportingOptions = {}
): void {
  const mergedOptions = { ...defaultOptions, ...options };
  const { severity, context, silent } = mergedOptions;
  
  // Format the error message
  const formattedMessage = formatErrorMessage(error, context);
  
  // Log to console based on severity
  switch (severity) {
    case ErrorSeverity.INFO:
      console.info(`[INFO] ${formattedMessage}`);
      break;
    case ErrorSeverity.WARNING:
      console.warn(`[WARNING] ${formattedMessage}`);
      break;
    case ErrorSeverity.CRITICAL:
      console.error(`[CRITICAL] ${formattedMessage}`);
      break;
    case ErrorSeverity.ERROR:
    default:
      console.error(`[ERROR] ${formattedMessage}`);
      break;
  }
  
  // Here you would integrate with error reporting services like Sentry
  if (mergedOptions.reportToService) {
    // Example: sendToErrorReportingService(error, severity, context);
  }
  
  // Show user-facing error if not silent
  if (!silent) {
    // This could trigger a toast notification or other UI feedback
    // Example: showErrorNotification(formattedMessage, severity);
  }
}

/**
 * Create a wrapped version of a function that catches and handles errors
 * 
 * @param fn The function to wrap with error handling
 * @param options Options for error reporting
 * @returns Wrapped function with error handling
 */
export function withErrorHandling<T extends (...args: unknown[]) => unknown>(
  fn: T,
  options: ErrorReportingOptions = {}
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  return (...args: Parameters<T>): ReturnType<T> | undefined => {
    try {
      return fn(...args) as ReturnType<T>;
    } catch (error) {
      logError(error instanceof Error ? error : String(error), options);
      return undefined;
    }
  };
}

/**
 * Wrap an async function with error handling
 * 
 * @param fn The async function to wrap
 * @param options Error reporting options
 * @returns Wrapped async function with error handling
 */
export function withAsyncErrorHandling<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  options: ErrorReportingOptions = {}
) {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args) as Awaited<ReturnType<T>>;
    } catch (error) {
      logError(error instanceof Error ? error : String(error), options);
      return undefined;
    }
  };
}

/**
 * Handle errors in React components
 * 
 * @param error The error that was caught
 * @param info React error info
 * @param options Options for error reporting
 */
export function handleComponentError(
  error: Error,
  info: { componentStack: string },
  options: ErrorReportingOptions = {}
): void {
  const context = {
    ...options.context,
    componentStack: info.componentStack,
  };
  
  logError(error, { ...options, context });
}

/**
 * Create a custom error with additional metadata
 * 
 * @param message Error message
 * @param code Error code
 * @param metadata Additional error metadata
 * @returns Custom error with metadata
 */
export function createError(
  message: string,
  code?: string,
  metadata?: Record<string, unknown>
): Error & { code?: string; metadata?: Record<string, unknown> } {
  const error = new Error(message) as Error & { code?: string; metadata?: Record<string, unknown> };
  if (code) error.code = code;
  if (metadata) error.metadata = metadata;
  return error;
}