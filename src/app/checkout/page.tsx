'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { CheckoutInput } from '@/components/ui/CheckoutInput';
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

const shippingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Valid ZIP code is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
});

const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(16, 'Valid card number is required')
    .max(19, 'Card number too long')
    .refine((val) => /^[0-9\s]+$/.test(val), 'Card number can only contain digits'),
  cardholderName: z.string().min(2, 'Cardholder name is required'),
  expiryDate: z
    .string()
    .min(5, 'Valid expiry date is required')
    .refine((val) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(val), 'Expiry date must be in MM/YY format'),
  cvv: z
    .string()
    .min(3, 'Valid CVV is required')
    .max(4, 'CVV too long')
    .refine((val) => /^\d+$/.test(val), 'CVV can only contain digits'),
});

type CheckoutStep = 'shipping' | 'payment' | 'review';
type ShippingMethod = 'standard' | 'express' | 'overnight';

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, updateQuantity, removeItem, total, subtotal, tax, shippingCost, promoCodeDiscount, applyPromoCode } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingData, setShippingData] = useState<z.infer<typeof shippingSchema> | null>(null);
  const [paymentData, setPaymentData] = useState<z.infer<typeof paymentSchema> | null>(null);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApplyPromoCode = () => {
    if (promoCode.trim() !== '') {
      // Call the applyPromoCode function from CartContext
      applyPromoCode(promoCode);
      setIsPromoApplied(true);
      toast.success('Promo code applied successfully!');
    } else {
      toast.error('Please enter a valid promo code');
    }
  };

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, router]);

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
    <div className="relative max-w-2xl mx-auto mb-12">
      <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-gray-200 rounded-full"></div>
      <div className="relative flex items-center justify-between">
        {[
          { step: 'shipping', label: 'Shipping', icon: <Truck className="h-5 w-5" /> },
          { step: 'payment', label: 'Payment', icon: <CreditCard className="h-5 w-5" /> },
          { step: 'review', label: 'Review', icon: <ShoppingBag className="h-5 w-5" /> },
        ].map((item, index) => {
          const isActive = index <= ['shipping', 'payment', 'review'].indexOf(currentStep);
          const isCurrent = item.step === currentStep;

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
                {index < ['shipping', 'payment', 'review'].indexOf(currentStep) ? (
                  <Check className="h-6 w-6" />
                ) : (
                  item.icon
                )}
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
              {index < 2 && (
                <div
                  className={`
                    absolute top-6 left-12 right-0 h-1 w-[calc(100%-24px)]
                    ${index < ['shipping', 'payment', 'review'].indexOf(currentStep) ?
                      'bg-gradient-to-r from-primary to-blue-600' : 'bg-gray-200'}
                  `}
                  style={{ left: '3rem', width: 'calc(100% - 6rem)' }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
  // end of renderProgressBar

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <h1 className="text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 animate-gradient-x transition-colors duration-700">Complete Your Purchase</h1>
        <p className="text-center text-gray-700 mb-10 max-w-xl mx-auto transition-colors duration-500">You're just a few steps away from experiencing our premium products</p>
        {renderProgressBar()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          <div className="lg:col-span-2">
            <Card className="p-8 border-0 shadow-xl rounded-2xl bg-white backdrop-blur-sm bg-opacity-95 transition-shadow duration-500">
              {currentStep === 'shipping' && (
                <Form {...shippingForm}>
                  <h2 className="text-2xl font-bold mb-6 inline-flex items-center"><Truck className="mr-3 h-6 w-6 text-primary" /> Shipping Information</h2>
                  <form onSubmit={shippingForm.handleSubmit(handleShippingSubmit)} className="space-y-6">
                    <FormField
                      control={shippingForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <CheckoutInput {...field} />
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
                            <CheckoutInput type="email" {...field} />
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
                            <CheckoutInput {...field} />
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
                              <CheckoutInput {...field} />
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
                              <CheckoutInput {...field} />
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
                              <CheckoutInput {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={shippingForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <CheckoutInput type="tel" placeholder="(123) 456-7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full py-6 mt-4 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-primary/30"
                    >
                      Continue to Payment <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </form>
                </Form>
        )}

              {currentStep === 'payment' && (
                <Form {...paymentForm}>
                  <h2 className="text-2xl font-bold mb-6 inline-flex items-center"><CreditCard className="mr-3 h-6 w-6 text-primary" /> Payment Information</h2>
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-sm text-blue-700">All transactions are secure and encrypted. Your personal information is protected.</p>
                  </div>
                  <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-6">
                    <FormField
                      control={paymentForm.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <CheckoutInput
                              {...field}
                              className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                            />
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
                              <CheckoutInput
                                placeholder="MM/YY"
                                {...field}
                                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                              />
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
                              <CheckoutInput
                                type="password"
                                maxLength={4}
                                {...field}
                                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex gap-4 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep('shipping')}
                        className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
                      >
                        Continue to Review <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </form>
                </Form>
              )}

              {currentStep === 'review' && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold mb-6 inline-flex items-center"><ShoppingBag className="mr-3 h-6 w-6 text-primary" /> Review Your Order</h2>

                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center"><Truck className="h-5 w-5 mr-2 text-primary" /> Shipping Information</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep('shipping')}
                        className="text-primary hover:text-primary/80 hover:bg-blue-100/50"
                      >
                        Edit
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">Full Name</p>
                        <p className="font-medium">{shippingData?.fullName}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="font-medium">{shippingData?.email}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                        <p className="font-medium">{shippingData?.phone}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm col-span-1 md:col-span-2">
                        <p className="text-xs text-gray-500 mb-1">Address</p>
                        <p className="font-medium">{shippingData?.address}</p>
                        <p>{`${shippingData?.city}, ${shippingData?.state} ${shippingData?.zipCode}`}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center"><CreditCard className="h-5 w-5 mr-2 text-purple-600" /> Payment Information</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep('payment')}
                        className="text-purple-600 hover:text-purple-600/80 hover:bg-purple-100/50"
                      >
                        Edit
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">Cardholder</p>
                        <p className="font-medium">{paymentData?.cardholderName}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">Card Number</p>
                        <p className="font-medium">•••• •••• •••• {paymentData?.cardNumber.slice(-4)}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">Expiry Date</p>
                        <p className="font-medium">{paymentData?.expiryDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-medium rounded-xl shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30"
                    >
                      Place Order <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('payment')}
                      className="px-6 py-3 border-2 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      <ChevronLeft className="mr-2 h