"use client";

import { useEffect } from 'react';
import { initAnalytics, trackPageView } from "@/lib/analytics";

interface AnalyticsInitializerProps {
  pageName?: string;
}

/**
 * Client component that initializes analytics
 * Separated to avoid hydration issues in server components
 */
export default function AnalyticsInitializer({ pageName = "Home" }: AnalyticsInitializerProps) {
  useEffect(() => {
    // Initialize analytics on client side only
    initAnalytics();
    trackPageView(pageName);
    
    // Log for debugging
    console.log(`Analytics initialized for: ${pageName}`);
  }, [pageName]);
  
  // This component doesn't render anything
  return null;
}
