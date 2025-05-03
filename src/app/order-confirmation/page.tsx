'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { Check, Package, Truck, Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface OrderDetails {
  order_number: string;
  status: string;
  shipping_method: string;
  created_at: string;
  total_amount: number;
  shipping_address: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  order_items: Array<{
    product_name: string;
    quantity: number;
    price: number;
    product_image: string;
  }>;
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  useEffect(() => {
    // Clear cart when order is confirmed
    clearCart();

    // Get order number from URL
    const orderNumberParam = searchParams.get('orderNumber');

    if (orderNumberParam) {
      setOrderNumber(orderNumberParam);

      // Fetch order details from API
      const fetchOrderDetails = async () => {
        try {
          const response = await fetch(`/api/orders?orderNumber=${orderNumberParam}`);

          if (!response.ok) {
            throw new Error('Failed to fetch order details');
          }

          const data = await response.json();
          setOrderDetails(data);
        } catch (error) {
          console.error('Error fetching order details:', error);
          setError('Unable to load order details. Please contact customer support.');
          toast.error('Error loading order details');
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrderDetails();
    } else {
      // Fallback if no order number in URL
      setError('Order number not found');
      setIsLoading(false);
    }
  }, [clearCart, searchParams]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-3xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg max-w-lg mx-auto">
            Thank you for your purchase. We'll send you an email with your order details
            and tracking information once your order ships.
          </p>
        </motion.div>

        {isLoading ? (
          <motion.div variants={itemVariants} className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </motion.div>
        ) : error ? (
          <motion.div variants={itemVariants}>
            <Card className="p-8 mb-8 border-2 border-red-100 bg-red-50">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold mb-1 text-red-700">Error</h3>
                <p className="text-red-600">{error}</p>
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => router.push('/')}
                >
                  Return to Home
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            <Card className="p-8 mb-8 border-2 border-green-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">Order Number</h3>
                  <p className="text-gray-600 font-mono">{orderNumber}</p>
                </div>

                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">Shipping Method</h3>
                  <p className="text-gray-600">
                    {orderDetails?.shipping_method === 'standard' && 'Standard Shipping'}
                    {orderDetails?.shipping_method === 'express' && 'Express Shipping'}
                    {orderDetails?.shipping_method === 'overnight' && 'Overnight Shipping'}
                    {!orderDetails?.shipping_method && 'Standard Shipping'}
                  </p>
                </div>

                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">Estimated Delivery</h3>
                  <p className="text-gray-600">{estimatedDelivery.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>

              {orderDetails && orderDetails.order_items && orderDetails.order_items.length > 0 && (
                <div className="mt-8 border-t pt-6">
                  <h3 className="font-semibold mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {orderDetails.order_items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        {item.product_image && (
                          <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden relative flex-shrink-0">
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product_name}</h4>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-right">
                    <p className="text-lg font-semibold">Total: ${orderDetails.total_amount.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4">
          <Button
            className="flex-1 py-6"
            onClick={() => router.push('/')}
          >
            Continue Shopping
          </Button>

          <Button
            variant="outline"
            className="flex-1 py-6"
            onClick={() => router.push('/account/orders')}
          >
            View Order History <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}