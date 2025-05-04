'use client';

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  FileText,
  Printer,
  Truck,
  RefreshCw,
  AlertCircle,
  MoreVertical,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

// Define types for order data
interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  product_image: string;
}

interface ShippingAddress {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

interface PaymentInfo {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
}

interface Order {
  id: string;
  order_number: string;
  profile_id: string;
  status: string;
  total_amount: number;
  subtotal: number;
  tax: number;
  shipping_cost: number;
  discount: number;
  payment_status: string;
  payment_method: string;
  shipping_method: string;
  shipping_address: ShippingAddress;
  payment_info: PaymentInfo;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

// Define history event type
interface HistoryEvent {
  date: string;
  status: string;
  note: string;
}

export default function OrderDetailsPage() {
  // Use the useParams hook to get the order ID from the URL
  const params = useParams();
  const orderNumber = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate order history based on order data
  const generateOrderHistory = (order: Order): HistoryEvent[] => {
    const history: HistoryEvent[] = [];

    // Order placed
    history.push({
      date: formatDate(order.created_at, true),
      status: "Order Placed",
      note: "Order successfully placed by customer",
    });

    // Payment confirmed
    history.push({
      date: formatDate(order.created_at, true, 15), // 15 minutes later
      status: "Payment Confirmed",
      note: `Payment successfully processed via ${order.payment_method}`,
    });

    // Add status-based events
    if (order.status === "processing" || order.status === "shipped" || order.status === "delivered") {
      history.push({
        date: formatDate(order.created_at, true, 180), // 3 hours later
        status: "Processing",
        note: "Order is being prepared for shipping",
      });
    }

    if (order.status === "shipped" || order.status === "delivered") {
      history.push({
        date: formatDate(order.updated_at, true),
        status: "Shipped",
        note: `Order has been shipped via ${order.shipping_method}`,
      });
    }

    if (order.status === "delivered") {
      // Add 2 days to shipping date for delivery
      const deliveryDate = new Date(order.updated_at);
      deliveryDate.setDate(deliveryDate.getDate() + 2);

      history.push({
        date: formatDate(deliveryDate.toISOString(), true),
        status: "Delivered",
        note: "Package was delivered successfully",
      });
    }

    if (order.status === "canceled") {
      history.push({
        date: formatDate(order.updated_at, true),
        status: "Canceled",
        note: "Order was canceled",
      });
    }

    if (order.status === "refunded") {
      history.push({
        date: formatDate(order.updated_at, true),
        status: "Refunded",
        note: "Payment was refunded to customer",
      });
    }

    return history;
  };

  // Format date for display
  const formatDate = (dateString: string, includeTime = false, addMinutes = 0): string => {
    const date = new Date(dateString);

    if (addMinutes) {
      date.setMinutes(date.getMinutes() + addMinutes);
    }

    if (includeTime) {
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fetch order data
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/orders?orderNumber=${orderNumber}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error response:', response.status, errorData);
          throw new Error(errorData.error || `Error fetching order: ${response.status}`);
        }

        const data = await response.json();

        if (!data) {
          console.warn('No data returned for order:', orderNumber);
          setError('Order not found. Please check the order number and try again.');
          return;
        }

        setOrder(data);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details. Please try again.');
        toast.error('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderNumber]);

  // Calculate item total
  const calculateItemTotal = (item: OrderItem) => {
    return item.quantity * item.price;
  };

  // Get formatted payment method
  const getFormattedPaymentMethod = (method: string, info: PaymentInfo) => {
    if (method === 'credit_card') {
      return `Credit Card (${info.cardNumber})`;
    }
    return method.charAt(0).toUpperCase() + method.slice(1).replace('_', ' ');
  };

  return (
    <AdminLayout>
      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading order details...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Error Loading Order</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : !order ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested order could not be found.</p>
            <Button asChild>
              <a href="/admin/orders">Back to Orders</a>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="md" asChild>
                  <a href="/admin/orders">
                    <ArrowLeft className="h-4 w-4" />
                  </a>
                </Button>
                <h1 className="text-2xl font-bold">Order {order.order_number}</h1>
                <Badge variant="outline" className="ml-2">
                  {order.status}
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Invoice
                </Button>
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Print Shipping Label
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      Update Status
                      <MoreVertical className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Mark as Pending</DropdownMenuItem>
                    <DropdownMenuItem>Mark as Processing</DropdownMenuItem>
                    <DropdownMenuItem>Mark as Shipped</DropdownMenuItem>
                    <DropdownMenuItem>Mark as Delivered</DropdownMenuItem>
                    <DropdownMenuItem>Mark as Canceled</DropdownMenuItem>
                    <DropdownMenuItem>Process Refund</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Order placed on {formatDate(order.created_at)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.order_items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.product_name}</TableCell>
                          <TableCell className="text-right">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            ${item.price.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            ${calculateItemTotal(item).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Subtotal
                        </TableCell>
                        <TableCell className="text-right">
                          ${order.subtotal.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Shipping
                        </TableCell>
                        <TableCell className="text-right">
                          ${order.shipping_cost.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Tax
                        </TableCell>
                        <TableCell className="text-right">
                          ${order.tax.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      {order.discount > 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-medium">
                            Discount
                          </TableCell>
                          <TableCell className="text-right">
                            -${order.discount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-bold">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          ${order.total_amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">{order.shipping_address.fullName}</p>
                      <p>{order.shipping_address.email}</p>
                      <p>{order.shipping_address.phone}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">Shipping Address:</p>
                      <p>{order.shipping_address.address}</p>
                      <p>
                        {order.shipping_address.city}, {order.shipping_address.state}{" "}
                        {order.shipping_address.zipCode}
                      </p>

                      <Separator className="my-4" />

                      <p className="font-medium">Shipping Method:</p>
                      <p>{order.shipping_method}</p>

                      {order.tracking_number && (
                        <>
                          <p className="font-medium mt-4">Tracking Number:</p>
                          <div className="flex items-center space-x-2">
                            <p>{order.tracking_number}</p>
                            <Button variant="ghost" size="sm">
                              <Truck className="h-4 w-4 mr-1" /> Track
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">Payment Method:</p>
                      <p>{getFormattedPaymentMethod(order.payment_method, order.payment_info)}</p>

                      <Separator className="my-4" />

                      <p className="font-medium">Billing Address:</p>
                      <p>{order.shipping_address.address}</p>
                      <p>
                        {order.shipping_address.city}, {order.shipping_address.state}{" "}
                        {order.shipping_address.zipCode}
                      </p>

                      <Separator className="my-4" />

                      <p className="font-medium">Payment Status:</p>
                      <p>{order.payment_status}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  Track the complete history of this order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {generateOrderHistory(order).map((event, index, array) => (
                    <div key={index} className="mb-8 flex items-start">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                        <div className="h-3 w-3 rounded-full bg-primary-foreground" />
                      </div>
                      {index < array.length - 1 && (
                        <div
                          className="absolute ml-4 h-full w-px bg-border"
                          style={{ top: "2rem", bottom: 0, left: 0 }}
                        />
                      )}
                      <div className="ml-4">
                        <p className="font-semibold">{event.status}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.date}
                        </p>
                        <p className="mt-2">{event.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
