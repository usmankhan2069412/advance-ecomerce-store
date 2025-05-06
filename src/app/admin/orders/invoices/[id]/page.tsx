'use client';

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Download,
  Printer,
  Mail,
  Copy,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

// Define types for order data
interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  product_image?: string;
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

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-6)}`);

  // Fetch order data
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/orders?orderNumber=${invoiceId}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error response:', response.status, errorData);
          throw new Error(errorData.error || `Error fetching order: ${response.status}`);
        }

        const data = await response.json();

        if (!data) {
          console.warn('No data returned for order:', invoiceId);
          setError('Order not found. Please check the order number and try again.');
          return;
        }

        setOrder(data);
        // Generate a unique invoice number based on order number
        setInvoiceNumber(`INV-${data.order_number.replace('ORD-', '')}`);
      } catch (err: any) {
        console.error('Error fetching order details:', err);
        setError(err.message || 'An error occurred while fetching the order details');
      } finally {
        setIsLoading(false);
      }
    };

    if (invoiceId) {
      fetchOrderDetails();
    }
  }, [invoiceId]);

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleDownloadInvoice = async () => {
    try {
      // In a real application, this would generate a PDF
      // For now, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice");
    }
  };

  const handleEmailInvoice = async () => {
    try {
      if (!order) return;

      // In a real application, this would send an email with the invoice
      // For now, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success(`Invoice sent to ${order.shipping_address.email}`);
    } catch (error) {
      console.error("Error sending invoice:", error);
      toast.error("Failed to send invoice");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button asChild>
              <a href="/admin/orders/invoices">Back to Invoices</a>
            </Button>
          </div>
        ) : !order ? (
          <div className="flex flex-col items-center justify-center h-64">
            <h2 className="text-xl font-semibold mb-2">Invoice Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested invoice could not be found.</p>
            <Button asChild>
              <a href="/admin/orders/invoices">Back to Invoices</a>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="md" asChild>
                  <a href="/admin/orders/invoices">
                    <ArrowLeft className="h-4 w-4" />
                  </a>
                </Button>
                <h1 className="text-2xl font-bold">Invoice {invoiceNumber}</h1>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleEmailInvoice}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email Invoice
                </Button>
                <Button variant="outline" onClick={handleDownloadInvoice}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button onClick={handlePrintInvoice}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Invoice
                </Button>
              </div>
            </div>

            <div className="print:block" id="invoice-content">
              <Card className="border-0 shadow-lg print:shadow-none">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-3xl font-bold">INVOICE</CardTitle>
                      <CardDescription className="mt-1">
                        {invoiceNumber}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <h3 className="text-xl font-bold">Your Company Name</h3>
                      <p className="text-sm text-muted-foreground">
                        123 Business Street, Suite 100<br />
                        New York, NY 10001<br />
                        contact@yourcompany.com<br />
                        (555) 123-4567
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Bill To:</h3>
                      <p>
                        {order.shipping_address.fullName}<br />
                        {order.shipping_address.address}<br />
                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}<br />
                        {order.shipping_address.email}<br />
                        {order.shipping_address.phone}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="font-medium">Invoice Date:</span>
                          <span>{formatDate(order.created_at)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Order Number:</span>
                          <span>{order.order_number}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Payment Status:</span>
                          <span className="capitalize">{order.payment_status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Payment Method:</span>
                          <span className="capitalize">{order.payment_method.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.order_items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              {item.product_image && (
                                <div className="relative w-10 h-10 rounded overflow-hidden">
                                  <Image
                                    src={item.product_image}
                                    alt={item.product_name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <span>{item.product_name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">Subtotal</TableCell>
                        <TableCell className="text-right">${order.subtotal.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">Shipping ({order.shipping_method})</TableCell>
                        <TableCell className="text-right">${order.shipping_cost.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">Tax</TableCell>
                        <TableCell className="text-right">${order.tax.toFixed(2)}</TableCell>
                      </TableRow>
                      {order.discount > 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-medium">Discount</TableCell>
                          <TableCell className="text-right">-${order.discount.toFixed(2)}</TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-semibold text-lg">Total</TableCell>
                        <TableCell className="text-right font-semibold text-lg">${order.total_amount.toFixed(2)}</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>

                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Notes:</h3>
                    <p className="text-sm">
                      Thank you for your business! Payment is due within 30 days. Please make checks payable to Your Company Name or use the payment method specified on this invoice.
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between border-t pt-6">
                  <div className="text-sm text-muted-foreground">
                    <p>Questions? Contact our support at support@yourcompany.com</p>
                  </div>
                  {order.payment_status === 'paid' && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-medium">PAID</span>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
