'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Package, ExternalLink } from 'lucide-react';

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

interface OrderHistoryProps {
  orders: Order[];
}

const statusColors = {
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-yellow-100 text-yellow-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrderHistory({ orders = [] }: OrderHistoryProps) {
  if (orders.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium mb-2">No orders yet</h3>
        <p className="text-gray-600 mb-4">When you place an order, it will appear here</p>
        <Button onClick={() => window.location.href = '/'}>Start Shopping</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="p-6">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Order #{order.id}</p>
              <p className="text-sm text-gray-600">{order.date}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm ${statusColors[order.status]}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <span className="text-lg font-medium">${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-b py-4 my-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-2">
                <div className="relative w-16 h-16 bg-gray-100 rounded">
                  {/* Add Image component when implementing */}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            {order.trackingNumber ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Tracking number:</span>
                <span className="font-medium">{order.trackingNumber}</span>
                <Button variant="ghost" size="sm" className="gap-1">
                  Track Order <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div />
            )}
            <Button variant="outline">View Details</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}