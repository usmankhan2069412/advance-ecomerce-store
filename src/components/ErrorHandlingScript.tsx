'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export default function ErrorHandlingScript() {
  useEffect(() => {
    // Set up basic error handlers
    window.addEventListener('error', function(event) {
      console.error('Global error caught:', event.error || event.message);
    });

    window.addEventListener('unhandledrejection', function(event) {
      console.error('Unhandled promise rejection:', event.reason);
    });
  }, []);

  return (
    <Script
      id="error-handling-script"
      src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js"
      strategy="lazyOnload"
      onError={(e) => {
        console.error('Error loading external script:', e);
      }}
      onLoad={() => {
        console.log('External error handling script loaded successfully');
      }}
    />
  );
}
