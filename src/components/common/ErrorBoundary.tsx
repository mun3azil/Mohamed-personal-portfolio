'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { handleComponentError, ErrorSeverity } from '@/lib/errorHandling';

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  severity?: ErrorSeverity;
  errorContext?: Record<string, any>;
  reportErrors?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  static defaultProps = {
    severity: ErrorSeverity.ERROR,
    reportErrors: true,
    errorContext: {}
  };
  
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { severity, errorContext, reportErrors, onError } = this.props;
    
    // Handle the error using our error handling utility
    handleComponentError(error, { componentStack: errorInfo.componentStack || '' }, {
      severity,
      context: {
        ...errorContext,
        componentStack: errorInfo.componentStack || ''
      },
      reportToService: reportErrors
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call optional error handler
    onError?.(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          const reset = () => this.setState({ hasError: false, error: undefined });
          return this.props.fallback(this.state.error!, reset);
        }
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-[400px] flex items-center justify-center bg-light-100 dark:bg-dark-200">
          <div className="text-center p-8 max-w-md mx-auto">
            <div className="mb-4">
              <svg 
                className="w-16 h-16 mx-auto text-red-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Something went wrong
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-32">
                  {this.state.error.message}
                  {'\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorHandler(options: {
  severity?: ErrorSeverity;
  errorContext?: Record<string, any>;
  reportErrors?: boolean;
} = {}) {
  const { severity = ErrorSeverity.ERROR, errorContext = {}, reportErrors = true } = options;
  
  return (error: Error, errorInfo?: ErrorInfo) => {
    // Use our error handling utility
    const safeErrorInfo = errorInfo ? { componentStack: errorInfo.componentStack || '' } : { componentStack: '' };
    handleComponentError(error, safeErrorInfo, {
      severity,
      context: errorContext,
      reportToService: reportErrors
    });
    
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by useErrorHandler:', error, errorInfo);
    }
  };
}

/**
 * HOC that wraps a component with an ErrorBoundary
 * 
 * @param Component The component to wrap
 * @param errorBoundaryProps Props for the ErrorBoundary
 * @returns Wrapped component with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps: Omit<Props, 'children'> = {}
): React.FC<P> {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
  
  WrappedComponent.displayName = `withErrorBoundary(${displayName})`;
  
  return WrappedComponent;
}
