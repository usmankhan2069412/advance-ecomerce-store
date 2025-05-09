'use client';

import { Toaster } from 'sonner';

export function SonnerToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        className: 'border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg',
        style: {
          background: 'white',
          color: 'black',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
      }}
    />
  );
}