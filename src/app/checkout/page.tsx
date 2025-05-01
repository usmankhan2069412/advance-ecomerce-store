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
    .refine((val) => {
      // More lenient validation for demo purposes
      const [month, year] = val.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      // Allow any future date for demo
      const inputYear = parseInt(year);
      const inputMonth = parseInt(month);
      
      return inputYear >= currentYear || (inputYear === currentYear && inputMonth >= currentMonth);
    }, 'Expiry date must be in the future'),
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

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, router]);

  const shippingForm = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
    },
  });

  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: '',
      cardholderName: '',
      expiryDate: '',
      cvv: '',
    },
  });

  const handleShippingSubmit = (data: z.infer<typeof shippingSchema>) => {
    setShippingData(data);
    setCurrentStep('payment');
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = async (data: z.infer<typeof paymentSchema>) => {
    try {
      // Basic validation
      if (!data.cardNumber || !data.cardholderName || !data.expiryDate || !data.cvv) {
        toast.error('Please fill in all payment fields');
        return;
      }

      // Format validation
      if (data.cardNumber.length < 16) {
        toast.error('Please enter a valid card number');
        return;
      }

      // More lenient expiry date validation for demo
      const [month, year] = data.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      const inputYear = parseInt(year);
      const inputMonth = parseInt(month);
      
      if (inputYear < currentYear || (inputYear === currentYear && inputMonth < currentMonth)) {
        toast.error('Please enter a future expiry date');
        return;
      }

      if (data.cvv.length < 3) {
        toast.error('Please enter a valid CVV');
        return;
      }

      // If all validations pass
      setPaymentData(data);
      setCurrentStep('review');
      window.scrollTo(0, 0);
    } catch (error) {
      toast.error('There was an error processing your payment information. Please try again.');
    }
  };

  const handleApplyPromoCode = () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }
    
    applyPromoCode(promoCode);
    setIsPromoApplied(true);
    toast.success('Promo code applied successfully!');
    setPromoCode('');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success
      router.push('/order-confirmation');
    } catch (error) {
      toast.error('There was an error processing your order. Please try again.');
      setIsProcessing(false);
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
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

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

  // Calculate final total
  const finalTotal = subtotal + getShippingCost() + tax - promoCodeDiscount;

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
      
      {/* Promo code */}
      {currentStep !== 'review' && (
        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleApplyPromoCode} size="md" variant={isPromoApplied ? "secondary" : "primary"}>
              {isPromoApplied ? <Check className="h-4 w-4" /> : <Gift className="h-4 w-4 mr-1" />}
              {isPromoApplied ? '' : 'Apply'}
            </Button>
          </div>
          {isPromoApplied && promoCodeDiscount > 0 && (
            <p className="text-xs text-green-600">Promo code applied successfully!</p>
          )}
        </div>
      )}
      
      {/* Shipping method selection */}
      {currentStep === 'shipping' && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Shipping Method</h3>
          <div className="space-y-2">
            <div
              className={`p-3 border rounded-md cursor-pointer ${
                shippingMethod === 'standard' ? 'border-primary bg-primary/5' : 'border-gray-200'
              }`}
              onClick={() => setShippingMethod('standard')}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">Standard Shipping</span>
                <span>$10.00</span>
              </div>
              <p className="text-xs text-gray-500">Delivery in 5-7 business days</p>
            </div>
            <div
              className={`p-3 border rounded-md cursor-pointer ${
                shippingMethod === 'express' ? 'border-primary bg-primary/5' : 'border-gray-200'
              }`}
              onClick={() => setShippingMethod('express')}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">Express Shipping</span>
                <span>$15.00</span>
              </div>
              <p className="text-xs text-gray-500">Delivery in 2-3 business days</p>
            </div>
            <div
              className={`p-3 border rounded-md cursor-pointer ${
                shippingMethod === 'overnight' ? 'border-primary bg-primary/5' : 'border-gray-200'
              }`}
              onClick={() => setShippingMethod('overnight')}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">Overnight Shipping</span>
                <span>$25.00</span>
              </div>
              <p className="text-xs text-gray-500">Next business day delivery</p>
            </div>
          </div>
        </div>
      )}
      
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
        {promoCodeDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${promoCodeDiscount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-lg pt-2">
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Action buttons based on step */}
      {currentStep === 'review' && (
        <Button 
          className="w-full" 
          size="lg" 
          onClick={handlePlaceOrder}
          isLoading={isProcessing}
          disabled={isProcessing}
        >
          Place Order
        </Button>
      )}
    </Card>
  );

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
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Shipping Method</h3>
                      <div className="space-y-4">
                        <div
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            shippingMethod === 'standard' ? 'border-primary bg-primary/5' : 'border-gray-200'
                          }`}
                          onClick={() => setShippingMethod('standard')}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Standard Shipping</h4>
                              <p className="text-sm text-gray-500">5-7 business days</p>
                            </div>
                            <span className="font-medium">$10.00</span>
                          </div>
                        </div>
                        
                        <div
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            shippingMethod === 'express' ? 'border-primary bg-primary/5' : 'border-gray-200'
                          }`}
                          onClick={() => setShippingMethod('express')}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Express Shipping</h4>
                              <p className="text-sm text-gray-500">2-3 business days</p>
                            </div>
                            <span className="font-medium">$15.00</span>
                          </div>
                        </div>
                        
                        <div
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            shippingMethod === 'overnight' ? 'border-primary bg-primary/5' : 'border-gray-200'
                          }`}
                          onClick={() => setShippingMethod('overnight')}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">Overnight Shipping</h4>
                              <p className="text-sm text-gray-500">Next business day</p>
                            </div>
                            <span className="font-medium">$25.00</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
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
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6 inline-flex items-center">
                    <CreditCard className="mr-3 h-6 w-6 text-primary" /> Payment Information
                  </h2>
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-sm text-blue-700">All transactions are secure and encrypted. Your payment information is protected.</p>
                  </div>
                  <Form {...paymentForm}>
                    <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-6">
                      <FormField
                        control={paymentForm.control}
                        name="cardholderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cardholder Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Name as shown on card"
                                className="h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={paymentForm.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="1234 5678 9012 3456"
                                value={formatCardNumber(field.value)}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\s/g, '');
                                  if (value.length <= 16 && /^\d*$/.test(value)) {
                                    field.onChange(value);
                                  }
                                }}
                                className="h-11"
                                maxLength={19}
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
                                <Input 
                                  {...field} 
                                  placeholder="MM/YY"
                                  value={formatExpiryDate(field.value)}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 4) {
                                      field.onChange(value);
                                    }
                                  }}
                                  className="h-11"
                                  maxLength={5}
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
                              <FormLabel>
                                <div className="flex items-center">
                                  CVV
                                  <span className="ml-1 text-gray-400 hover:text-gray-600 cursor-help" title="3 or 4 digit security code on the back of your card">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                </div>
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="password"
                                  placeholder="123"
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 4) {
                                      field.onChange(value);
                                    }
                                  }}
                                  className="h-11"
                                  maxLength={4}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="pt-6 flex gap-4">
                        <Button 
                          type="button"
                          variant="outline" 
                          onClick={() => setCurrentStep('shipping')}
                          className="px-6"
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button 
                          type="submit"
                          className="flex-1 bg-primary hover:bg-primary/90"
                        >
                          Continue to Review <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </Form>
                </Card>
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
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'} <Gift className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </Button>
                  </div>
                </div>
              )}
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