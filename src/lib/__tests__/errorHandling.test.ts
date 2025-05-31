import {
  ErrorSeverity,
  formatErrorMessage,
  logError,
  withErrorHandling,
  withAsyncErrorHandling,
  handleComponentError,
  createError
} from '../errorHandling';

describe('Error Handling Utilities', () => {
  // Spy on console methods
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatErrorMessage', () => {
    it('formats error message with Error object', () => {
      const error = new Error('Test error');
      expect(formatErrorMessage(error)).toBe('Test error');
    });

    it('formats error message with string', () => {
      expect(formatErrorMessage('Test error')).toBe('Test error');
    });

    it('includes context in formatted message', () => {
      const context = { component: 'TestComponent', action: 'testAction' };
      expect(formatErrorMessage('Test error', context))
        .toBe('Test error (component: TestComponent, action: testAction)');
    });

    it('filters out undefined context values', () => {
      const context = { component: 'TestComponent', action: undefined, userId: null };
      expect(formatErrorMessage('Test error', context))
        .toBe('Test error (component: TestComponent, userId: null)');
    });
  });

  describe('logError', () => {
    it('logs error with default severity', () => {
      logError('Test error');
      expect(console.error).toHaveBeenCalledWith('[ERROR] Test error');
    });

    it('logs error with INFO severity', () => {
      logError('Test info', { severity: ErrorSeverity.INFO });
      expect(console.info).toHaveBeenCalledWith('[INFO] Test info');
    });

    it('logs error with WARNING severity', () => {
      logError('Test warning', { severity: ErrorSeverity.WARNING });
      expect(console.warn).toHaveBeenCalledWith('[WARNING] Test warning');
    });

    it('logs error with CRITICAL severity', () => {
      logError('Test critical', { severity: ErrorSeverity.CRITICAL });
      expect(console.error).toHaveBeenCalledWith('[CRITICAL] Test critical');
    });

    it('includes context in logged message', () => {
      logError('Test error', { context: { component: 'TestComponent' } });
      expect(console.error).toHaveBeenCalledWith('[ERROR] Test error (component: TestComponent)');
    });
  });

  describe('withErrorHandling', () => {
    it('returns function result when no error occurs', () => {
      const testFn = (a: number, b: number) => a + b;
      const wrappedFn = withErrorHandling(testFn);
      expect(wrappedFn(2, 3)).toBe(5);
    });

    it('catches and logs errors', () => {
      const testFn = () => { throw new Error('Test function error'); };
      const wrappedFn = withErrorHandling(testFn);
      expect(wrappedFn()).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith('[ERROR] Test function error');
    });

    it('passes options to logError', () => {
      const testFn = () => { throw new Error('Test function error'); };
      const wrappedFn = withErrorHandling(testFn, { 
        severity: ErrorSeverity.WARNING,
        context: { component: 'TestComponent' }
      });
      wrappedFn();
      expect(console.warn).toHaveBeenCalledWith('[WARNING] Test function error (component: TestComponent)');
    });
  });

  describe('withAsyncErrorHandling', () => {
    it('returns promise result when no error occurs', async () => {
      const testFn = async (a: number, b: number) => a + b;
      const wrappedFn = withAsyncErrorHandling(testFn);
      expect(await wrappedFn(2, 3)).toBe(5);
    });

    it('catches and logs errors in async functions', async () => {
      const testFn = async () => { throw new Error('Test async error'); };
      const wrappedFn = withAsyncErrorHandling(testFn);
      expect(await wrappedFn()).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith('[ERROR] Test async error');
    });

    it('passes options to logError for async functions', async () => {
      const testFn = async () => { throw new Error('Test async error'); };
      const wrappedFn = withAsyncErrorHandling(testFn, { 
        severity: ErrorSeverity.INFO,
        context: { action: 'asyncAction' }
      });
      await wrappedFn();
      expect(console.info).toHaveBeenCalledWith('[INFO] Test async error (action: asyncAction)');
    });
  });

  describe('handleComponentError', () => {
    it('logs component errors with stack trace', () => {
      const error = new Error('Component error');
      const info = { componentStack: 'at Component\nat App' };
      handleComponentError(error, info);
      expect(console.error).toHaveBeenCalledWith('[ERROR] Component error (componentStack: at Component\nat App)');
    });

    it('merges component stack with existing context', () => {
      const error = new Error('Component error');
      const info = { componentStack: 'at Component\nat App' };
      const options = {
        context: { component: 'TestComponent' },
        severity: ErrorSeverity.CRITICAL
      };
      handleComponentError(error, info, options);
      expect(console.error).toHaveBeenCalledWith(
        '[CRITICAL] Component error (component: TestComponent, componentStack: at Component\nat App)'
      );
    });
  });

  describe('createError', () => {
    it('creates an error with a message', () => {
      const error = createError('Custom error');
      expect(error.message).toBe('Custom error');
      expect(error instanceof Error).toBe(true);
    });

    it('creates an error with a code', () => {
      const error = createError('Custom error', 'ERR_CUSTOM');
      expect(error.message).toBe('Custom error');
      expect(error.code).toBe('ERR_CUSTOM');
    });

    it('creates an error with metadata', () => {
      const metadata = { userId: '123', requestId: 'abc' };
      const error = createError('Custom error', 'ERR_CUSTOM', metadata);
      expect(error.message).toBe('Custom error');
      expect(error.code).toBe('ERR_CUSTOM');
      expect(error.metadata).toEqual(metadata);
    });
  });
});