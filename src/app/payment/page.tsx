'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, CreditCard, Truck, ShoppingBag, ChevronRight, ChevronLeft, Gift } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

// Payment form validation schema
const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(16, 'Card number must be at least 16 digits')
    .max(19, 'Card number too long')
    .refine(val => /^\d{16,19}$/.test(val.replace(/\s+/g, '')), 'Card number must contain only digits'),

  cardholderName: z
    .string()
    .min(2, 'Cardholder name is required'),

  expiryDate: z.string({
    required_error: 'Expiry date is required',
  }).refine((val) => {
    // Basic format validation
    if (!/^\d{2}\/\d{2}$/.test(val)) return false;

    // Extract month and year
    const [month, year] = val.split('/').map(part => parseInt(part, 10));

    // Validate month
    if (month < 1 || month > 12) return false;

    // Get current date
    const now = new Date();
    const currentYear = now.getFullYear() % 100; // Get last 2 digits of year
    const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed

    // Check if card is expired
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }

    return true;
  }, 'Please enter a valid expiry date (MM/YY)'),

  cvv: z
    .string()
    .regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
});

export default function PaymentPage() {
  const router = useRouter();
  const { items: cartItems, clearCart, subtotal, tax, promoCodeDiscount } = useCart();
  const [shippingData, setShippingData] = useState<any>(null);
  const [shippingMethod, setShippingMethod] = useState<string>('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [storedDiscount, setStoredDiscount] = useState(0);

  // Redirect to checkout if no shipping data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedShippingData = sessionStorage.getItem('shippingData');
      const storedShippingMethod = sessionStorage.getItem('shippingMethod');
      const storedPromoDiscount = sessionStorage.getItem('promoCodeDiscount');

      if (!storedShippingData) {
        router.push('/checkout');
        return;
      }

      setShippingData(JSON.parse(storedShippingData));

      if (storedShippingMethod) {
        setShippingMethod(storedShippingMethod);
      }

      if (storedPromoDiscount) {
        setStoredDiscount(parseFloat(storedPromoDiscount));
      }
    }
  }, [router]);

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, router]);

  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: '',
      cardholderName: '',
      expiryDate: '',
      cvv: '',
    },
  });

  // Calculate shipping cost based on method
  const getShippingCost = () => {
    switch (shippingMethod) {
      case 'express':
        return 15;
      case 'overnight':
        return 25;
      case 'standard':
      default:
        return 10;
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    // Remove non-digits
    const v = value.replace(/\D/g, '');

    if (v.length === 0) return '';

    // Get month (first 2 digits)
    let month = v.substring(0, 2);

    // Ensure month is between 01-12
    if (month.length === 2) {
      const monthNum = parseInt(month, 10);
      if (monthNum > 12) {
        month = '12';
      } else if (monthNum < 1) {
        month = '01';
      }
    }

    // Get year (next 2 digits)
    const year = v.substring(2, 4);

    // Format as MM/YY
    if (v.length > 2) {
      return `${month}/${year}`;
    } else {
      return month;
    }
  };

  const handlePaymentSubmit = async (data: z.infer<typeof paymentSchema>) => {
    setIsProcessing(true);

    try {
      // Calculate final total
      const finalTotal = subtotal + getShippingCost() + tax - (storedDiscount || promoCodeDiscount);

      // Check if user is logged in and get their profile
      let userProfile = null;
      try {
        // Import the AuthService dynamically to avoid circular dependencies
        const { AuthService } = await import('@/services/auth-service');
        const { user } = await AuthService.getCurrentUser();
        userProfile = user;
      } catch (authError) {
        console.error('Error getting current user:', authError);
        // Continue with guest checkout
      }

      // Save order to database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          shippingData,
          paymentData: {
            cardholderName: data.cardholderName,
            cardNumber: data.cardNumber,
            expiryDate: data.expiryDate,
          },
          shippingMethod,
          subtotal,
          tax,
          shippingCost: getShippingCost(),
          discount: storedDiscount || promoCodeDiscount,
          promoCode: storedDiscount > 0 ? 'DISCOUNT20' : null,
          totalAmount: finalTotal,
          // Pass the user profile if available
          userProfile: userProfile,
          // Flag to indicate if this is a guest checkout
          isGuestCheckout: !userProfile || userProfile.id.startsWith('temp-')
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create order');
      }

      // Clear cart and session storage
      clearCart();
      sessionStorage.removeItem('shippingData');
      sessionStorage.removeItem('shippingMethod');
      sessionStorage.removeItem('promoCodeDiscount');

      // Success - redirect to order confirmation with order number
      router.push(`/order-confirmation?orderNumber=${result.orderNumber}`);
    } catch (error) {
      console.error('Order error:', error);
      toast.error('There was an error processing your order. Please try again.');
      setIsProcessing(false);
    }
  };

  // Calculate final total
  const finalTotal = subtotal + getShippingCost() + tax - (storedDiscount || promoCodeDiscount);

  const renderOrderSummary = () => (
    <Card className="p-6 sticky top-4">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      {/* Items */}
      <div className="max-h-60 overflow-y-auto mb-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-2 border-b">
            <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{item.name}</h4>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  ${item.price.toFixed(2)} × {item.quantity}
                  {item.size && <span className="ml-2">Size: {item.size}</span>}
                </p>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shipping method display */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Shipping Method</h3>
        <div className="p-3 border rounded-md bg-primary/5 border-primary">
          <div className="flex justify-between items-center">
            <span className="font-medium">
              {shippingMethod === 'standard' && 'Standard Shipping'}
              {shippingMethod === 'express' && 'Express Shipping'}
              {shippingMethod === 'overnight' && 'Overnight Shipping'}
            </span>
            <span>${getShippingCost().toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500">
            {shippingMethod === 'standard' && 'Delivery in 5-7 business days'}
            {shippingMethod === 'express' && 'Delivery in 2-3 business days'}
            {shippingMethod === 'overnight' && 'Next business day delivery'}
          </p>
        </div>
      </div>

      {/* Cost breakdown */}
      <div className="space-y-2 py-4 border-t border-b mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span>${getShippingCost().toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        {(storedDiscount > 0 || promoCodeDiscount > 0) && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${(storedDiscount || promoCodeDiscount).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-lg pt-2">
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <h1 className="text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 animate-gradient-x transition-colors duration-700">Payment Information</h1>
        <p className="text-center text-gray-700 mb-10 max-w-xl mx-auto transition-colors duration-500">Complete your purchase securely</p>

        {/* Progress steps */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-gray-200 rounded-full"></div>
          <div className="relative flex items-center justify-between">
            {[
              { step: 'shipping', label: 'Shipping', icon: <Truck className="h-5 w-5" /> },
              { step: 'payment', label: 'Payment', icon: <CreditCard className="h-5 w-5" /> },
            ].map((item, index) => {
              const isActive = item.step === 'payment' || (item.step === 'shipping' && index === 0);
              const isCurrent = item.step === 'payment';

              return (
                <div key={item.step} className="flex flex-col items-center relative z-10">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      shadow-lg transform transition-all duration-300
                      ${isCurrent ? 'scale-110 ring-4 ring-primary/20' : ''}
                      ${isActive ?
                        'bg-gradient-to-br from-primary to-blue-600 text-white' :
                        'bg-white text-gray-400 border border-gray-200'}
                    `}
                  >
                    {item.step === 'shipping' ? <Check className="h-6 w-6" /> : item.icon}
                  </div>
                  <span
                    className={`
                      mt-2 font-medium text-sm
                      ${isActive ? 'text-primary' : 'text-gray-400'}
                    `}
                  >
                    {item.label}
                  </span>
                  {/* Progress line */}
                  {index < 1 && (
                    <div
                      className="absolute top-6 left-12 right-0 h-1 w-[calc(100%-24px)] bg-gradient-to-r from-primary to-blue-600"
                      style={{ left: '3rem', width: 'calc(100% - 6rem)' }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          <div className="lg:col-span-2">
            <Card className="p-8 border-0 shadow-xl rounded-2xl bg-white backdrop-blur-sm bg-opacity-95 transition-shadow duration-500">
              <h2 className="text-2xl font-bold mb-6 inline-flex items-center">
                <CreditCard className="mr-3 h-6 w-6 text-primary" /> Payment Information
              </h2>
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm text-blue-700">All transactions are secure and encrypted. Your payment information is protected.</p>
              </div>
              <Form {...paymentForm}>
                <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-6">
                  {/* Cardholder Name */}
                  <FormField
                    control={paymentForm.control}
                    name="cardholderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Cardholder Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Name as shown on card"
                            className="h-12 rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all duration-200 shadow-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  {/* Card Number */}
                  <FormField
                    control={paymentForm.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Card Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="1234 5678 9012 3456"
                              value={formatCardNumber(field.value)}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 19) field.onChange(value);
                              }}
                              className="h-12 pl-10 rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all duration-200 shadow-sm"
                              maxLength={19}
                            />
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs mt-1" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-6">
                    {/* Expiry Date */}
                    <FormField
                      control={paymentForm.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Expiry Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                onChange={(e) => {
                                  const formatted = formatExpiryDate(e.target.value);
                                  field.onChange(formatted);
                                }}
                                value={field.value}
                                placeholder="MM/YY"
                                className="h-12 rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all duration-200 shadow-sm"
                                maxLength={5}
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                                MM/YY
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />

                    {/* CVV */}
                    <FormField
                      control={paymentForm.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            <div className="flex items-center">
                              CVV
                              <span
                                className="ml-1 text-gray-400 hover:text-gray-600 cursor-help"
                                title="3 or 4 digit security code on the back of your card"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="•••"
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 4) field.onChange(value);
                              }}
                              className="h-12 rounded-lg border-gray-300 focus:border-primary focus:ring focus:ring-primary/20 transition-all duration-200 shadow-sm"
                              maxLength={4}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Shipping Information Summary */}
                  {shippingData && (
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                          <Truck className="h-4 w-4 mr-2 text-gray-500" /> Shipping To
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push('/checkout')}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">{shippingData.fullName}</p>
                        <p>{shippingData.address}</p>
                        <p>{`${shippingData.city}, ${shippingData.state} ${shippingData.zipCode}`}</p>
                        <p>{shippingData.email}</p>
                        <p>{shippingData.phone}</p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="pt-8 flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/checkout')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back to Shipping
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Complete Purchase'} <ShoppingBag className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                  </div>
                </form>
              </Form>
            </Card>
          </div>

          <div className="lg:col-span-1">
            {renderOrderSummary()}
          </div>
        </div>
      </div>
    </div>
  );
}
