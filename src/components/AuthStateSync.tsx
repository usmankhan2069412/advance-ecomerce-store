"use client";

import { useEffect } from 'react';
import { setCookie, deleteCookie } from 'cookies-next';
import { useAuth } from '@/contexts/AuthContext';

/**
 * AuthStateSync Component
 *
 * This component syncs the authentication state between localStorage and cookies
 * to ensure consistent auth state between client and server.
 */
export default function AuthStateSync() {
  const { isAuthenticated } = useAuth();

  // Sync auth state whenever isAuthenticated changes
  useEffect(() => {
    if (isAuthenticated) {
      // Set a cookie that the middleware can check
      setCookie('user-authenticated', 'true', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });

      // Also ensure localStorage is set
      if (typeof window !== 'undefined') {
        localStorage.setItem('userAuthenticated', 'true');
      }
    } else {
      // Remove the cookie if not authenticated
      deleteCookie('user-authenticated', { path: '/' });

      // Also ensure localStorage is cleared
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userAuthenticated');
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Function to sync auth state from localStorage to cookies
    const syncAuthState = () => {
      if (typeof window !== 'undefined') {
        const isAuthenticatedInStorage = localStorage.getItem('userAuthenticated') === 'true';

        if (isAuthenticatedInStorage) {
          // Set a cookie that the middleware can check
          setCookie('user-authenticated', 'true', {
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
          });
        } else {
          // Remove the cookie if not authenticated
          deleteCookie('user-authenticated', { path: '/' });
        }
      }
    };

    // Initial sync
    syncAuthState();

    // Set up event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userAuthenticated') {
        syncAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Set up interval to periodically sync auth state
    const intervalId = setInterval(syncAuthState, 60 * 1000); // Every minute

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  // This component doesn't render anything
  return null;
}
