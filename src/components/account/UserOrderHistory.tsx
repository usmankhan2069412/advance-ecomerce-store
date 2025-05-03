'use client';

import React, { useState, useEffect } from 'react';
import OrderHistory from '@/components/account/OrderHistory';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  trackingNumber?: string;
}

export default function UserOrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setIsLoading(true);

        // Add a timeout to the fetch to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
          const response = await fetch(`/api/orders?userOrders=true`, {
            signal: controller.signal,
            // Add cache: 'no-store' to prevent caching issues
            cache: 'no-store' as RequestCache
          });

          // Clear the timeout since the request completed
          clearTimeout(timeoutId);

          // Check for different response statuses
          if (response.status === 404) {
            // No orders found - this is not an error, just an empty state
            setOrders([]);
            return;
          } else if (response.status === 401) {
            // Unauthorized - user might not be logged in or session expired
            console.log('Authentication issue detected, showing empty orders instead of error');
            // Just show empty orders instead of an error message
            setOrders([]);
            return;
          } else if (!response.ok) {
            // Other error statuses
            console.error('Server error:', response.status, response.statusText);
            // Just show empty orders instead of an error for any server issues
            setOrders([]);
            return;
          }

          // If we get here, the response is OK
          const data = await response.json();

          // Check if data is an array
          if (Array.isArray(data)) {
            setOrders(data);
          } else {
            // Handle unexpected response format
            console.error('Unexpected response format:', data);
            setOrders([]);
          }
        } catch (fetchError: any) {
          // Handle fetch errors (network, timeout, etc.)
          if (fetchError.name === 'AbortError') {
            console.error('Fetch request timed out');
          } else {
            console.error('Fetch error:', fetchError);
          }
          // Show empty orders instead of an error
          setOrders([]);
        }
      } catch (error: any) {
        // Handle any other errors
        console.error('Error in order fetching process:', error);
        // Show empty orders instead of an error
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading your orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-primary hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return <OrderHistory orders={orders} />;
}
