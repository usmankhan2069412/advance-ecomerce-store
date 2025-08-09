'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckoutInput } from '@/components/ui/CheckoutInput';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, CreditCard, Truck, ChevronRight, Gift } from 'lucide-react';
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

type CheckoutStep = 'shipping' | 'review';
type ShippingMethod = 'standard' | 'express' | 'overnight';

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, updateQuantity, removeItem, total, subtotal, tax, shippingCost, promoCodeDiscount, applyPromoCode } = useCart();
  const [currentStep] = useState<CheckoutStep>('shipping');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
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
  const handleShippingSubmit = (data: z.infer<typeof shippingSchema>) => {
    // Store shipping data in sessionStorage to pass to payment page
    sessionStorage.setItem('shippingData', JSON.stringify(data));
    sessionStorage.setItem('shippingMethod', shippingMethod);

    // Store promo code information if applied
    if (isPromoApplied && promoCodeDiscount > 0) {
      sessionStorage.setItem('promoCodeDiscount', promoCodeDiscount.toString());
    }

    // Redirect to payment page
    router.push('/payment');
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
        ].map((item, index) => {
          const isActive = item.step === 'shipping';
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
                {item.icon}
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
                  className={`
                    absolute top-6 left-12 right-0 h-1 w-[calc(100%-24px)]
                    ${isActive ? 'bg-gradient-to-r from-primary to-blue-600' : 'bg-gray-200'}
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

      {/* Shipping method selection */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Shipping Method</h3>
        <div className="space-y-2">
          <div
            className={`p-3 border rounded-md cursor-pointer ${shippingMethod === 'standard' ? 'border-primary bg-primary/5' : 'border-gray-200'
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
            className={`p-3 border rounded-md cursor-pointer ${shippingMethod === 'express' ? 'border-primary bg-primary/5' : 'border-gray-200'
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
            className={`p-3 border rounded-md cursor-pointer ${shippingMethod === 'overnight' ? 'border-primary bg-primary/5' : 'border-gray-200'
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
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${shippingMethod === 'standard' ? 'border-primary bg-primary/5' : 'border-gray-200'
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
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${shippingMethod === 'express' ? 'border-primary bg-primary/5' : 'border-gray-200'
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
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${shippingMethod === 'overnight' ? 'border-primary bg-primary/5' : 'border-gray-200'
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
