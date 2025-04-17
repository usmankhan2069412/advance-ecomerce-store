'use client';

import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function OrderConfirmationPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear cart or perform other cleanup actions here
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto p-8 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. We'll send you an email with your order details
            and tracking information once your order ships.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full"
            onClick={() => router.push('/')}
          >
            Continue Shopping
          </Button>
        </div>
      </Card>
    </div>
  );
}