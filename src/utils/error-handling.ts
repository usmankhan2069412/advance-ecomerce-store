/**
 * Fallback error handling utility in case the external error handling script fails to load
 */

// Simple error logging function
export function logError(error: Error | unknown, context?: Record<string, any>): void {
  try {
    // Check if the external error handler is available
    if (typeof window !== 'undefined' && (window as any).tempoErrorHandler) {
      (window as any).tempoErrorHandler(error, context);
      return;
    }

    // Fallback error logging
    console.error('Application error:', error);
    if (context) {
      console.error('Error context:', context);
    }

    // In a production app, you might want to send this to a logging service
    // This is a simple fallback implementation
  } catch (loggingError) {
    // Last resort if even our error logging fails
    console.error('Failed to log error:', loggingError);
    console.error('Original error:', error);
  }
}

// Initialize error handlers
export function initErrorHandlers(): void {
  if (typeof window === 'undefined') return;

  // Set up global error handler
  window.addEventListener('error', (event) => {
    logError(event.error || new Error(event.message), {
      source: event.filename,
      line: event.lineno,
      column: event.colno
    });
  });

  // Set up unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    logError(event.reason || new Error('Unhandled Promise rejection'), {
      type: 'unhandledrejection'
    });
  });

  // Create a global function that can be called from anywhere
  (window as any).logAppError = logError;
}
