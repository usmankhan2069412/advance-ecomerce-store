'use client';

import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { Check, Package, Truck, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  useEffect(() => {
    // Clear cart when order is confirmed
    clearCart();
  }, [clearCart]);

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

        <motion.div variants={itemVariants}>
          <Card className="p-8 mb-8 border-2 border-green-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Order Number</h3>
                <p className="text-gray-600">{orderNumber}</p>
              </div>

              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Shipping Method</h3>
                <p className="text-gray-600">Standard Shipping</p>
              </div>

              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Estimated Delivery</h3>
                <p className="text-gray-600">{estimatedDelivery.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
          </Card>
        </motion.div>

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