'use client';

import { useEffect } from 'react';

export default function ErrorHandlingScript() {
  useEffect(() => {
    // Enhanced error handling setup with better filtering
    const handleGlobalError = (event: ErrorEvent) => {
      const error = event.error || event.message;
      const filename = event.filename || 'unknown';
      const lineno = event.lineno || 0;
      const colno = event.colno || 0;

      // Filter out script loading errors that we can't control
      const errorMessage = error?.message || error?.toString() || '';
      
      // Skip logging external script loading errors to prevent noise
      if (errorMessage.includes('Error loading external script') ||
          errorMessage.includes('tempolabs.ai') ||
          errorMessage.includes('tempo-public-assets')) {
        return true; // Prevent default handling but don't log
      }

      console.error('Global error caught:', {
        message: errorMessage,
        filename,
        lineno,
        colno,
        stack: error?.stack
      });

      // Send error to analytics if available (but not for script loading errors)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'exception', {
          description: errorMessage,
          fatal: false
        });
      }

      // Prevent the default browser error handling
      return true;
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const reasonMessage = reason?.message || reason?.toString() || '';
      
      // Filter out script loading promise rejections
      if (reasonMessage.includes('Error loading external script') ||
          reasonMessage.includes('tempolabs.ai') ||
          reasonMessage.includes('tempo-public-assets')) {
        event.preventDefault();
        return;
      }
      
      console.error('Unhandled promise rejection:', {
        reason: reasonMessage,
        stack: reason?.stack
      });

      // Send error to analytics if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'exception', {
          description: `Unhandled Promise: ${reasonMessage}`,
          fatal: false
        });
      }

      // Prevent the default browser error handling
      event.preventDefault();
    };

    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && target.tagName) {
        const src = (target as any).src || (target as any).href || '';
        
        // Filter out external script loading errors
        if (src.includes('tempolabs.ai') || src.includes('tempo-public-assets')) {
          return; // Don't log these errors
        }
        
        console.error('Resource loading error:', {
          tagName: target.tagName,
          src,
          message: 'Failed to load resource'
        });
      }
    };

    // Add event listeners
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Listen for resource loading errors (images, scripts, etc.)
    document.addEventListener('error', handleResourceError, true);

    // Cleanup function
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      document.removeEventListener('error', handleResourceError, true);
    };
  }, []);

  // No external script needed - all error handling is done in the useEffect
  return null;
}
