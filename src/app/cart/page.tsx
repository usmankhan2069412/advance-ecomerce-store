'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

// Using the CartItem interface from the context
import { CartItem } from '@/contexts/CartContext';

export default function CartPage() {
  const router = useRouter();
  const { items: cartItems, updateQuantity, applyPromoCode, subtotal, total, shippingCost, tax, promoCodeDiscount } = useCart();
  const [promoCode, setPromoCode] = useState('');



  const handleApplyPromoCode = () => {
    applyPromoCode(promoCode);
    setPromoCode('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Add some products to your cart to see them here.</p>
              <Button onClick={() => router.push('/products')}>Continue Shopping</Button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow mb-4 p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>

                    {/* Display size and color if available */}
                    <div className="text-sm text-gray-500 mt-1">
                      {item.size && <span className="mr-3">Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-1">
          {cartItems.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>

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

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button onClick={handleApplyPromoCode}>Apply</Button>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => router.push('/checkout')}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}