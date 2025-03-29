'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const shippingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Valid ZIP code is required'),
});

const paymentSchema = z.object({
  cardNumber: z.string().min(16, 'Valid card number is required'),
  expiryDate: z.string().min(5, 'Valid expiry date is required'),
  cvv: z.string().min(3, 'Valid CVV is required'),
});

type CheckoutStep = 'shipping' | 'payment' | 'review';

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, total, subtotal, tax, shippingCost, promoCodeDiscount } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingData, setShippingData] = useState<z.infer<typeof shippingSchema> | null>(null);
  const [paymentData, setPaymentData] = useState<z.infer<typeof paymentSchema> | null>(null);

  const shippingForm = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
  });

  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
  });

  const handleShippingSubmit = (data: z.infer<typeof shippingSchema>) => {
    setShippingData(data);
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = (data: z.infer<typeof paymentSchema>) => {
    setPaymentData(data);
    setCurrentStep('review');
  };

  const handlePlaceOrder = () => {
    // Implement order submission logic here
    console.log('Order placed:', { shippingData, paymentData, cartItems, total });
    // You would typically make an API call here to process the order
    router.push('/order-confirmation');
  };

  const renderProgressBar = () => (
    <div className="flex items-center justify-between mb-8">
      {['shipping', 'payment', 'review'].map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === step
                ? 'bg-primary text-white'
                : index < ['shipping', 'payment', 'review'].indexOf(currentStep)
                ? 'bg-green-500 text-white'
                : 'bg-gray-200'
            }`}
          >
            {index + 1}
          </div>
          {index < 2 && (
            <div
              className={`h-1 w-24 ${
                index < ['shipping', 'payment', 'review'].indexOf(currentStep)
                  ? 'bg-green-500'
                  : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      {renderProgressBar()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6">
        {currentStep === 'shipping' && (
          <Form {...shippingForm}>
            <form onSubmit={shippingForm.handleSubmit(handleShippingSubmit)} className="space-y-4">
              <FormField
                control={shippingForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={shippingForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={shippingForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={shippingForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={shippingForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={shippingForm.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">Continue to Payment</Button>
            </form>
          </Form>
        )}

        {currentStep === 'payment' && (
          <Form {...paymentForm}>
            <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-4">
              <FormField
                control={paymentForm.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={paymentForm.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input placeholder="MM/YY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={paymentForm.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input type="password" maxLength={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setCurrentStep('shipping')}>Back</Button>
                <Button type="submit" className="flex-1">Continue to Review</Button>
              </div>
            </form>
          </Form>
        )}

        {currentStep === 'review' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Name:</p>
                  <p>{shippingData?.fullName}</p>
                </div>
                <div>
                  <p className="font-medium">Email:</p>
                  <p>{shippingData?.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium">Address:</p>
                  <p>{shippingData?.address}</p>
                  <p>{`${shippingData?.city}, ${shippingData?.state} ${shippingData?.zipCode}`}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
              <p>Card ending in {paymentData?.cardNumber.slice(-4)}</p>
              <p>Expires: {paymentData?.expiryDate}</p>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setCurrentStep('payment')}>Back</Button>
              <Button onClick={handlePlaceOrder} className="flex-1">Place Order</Button>
            </div>
          </div>
        )}
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {promoCodeDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${promoCodeDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}