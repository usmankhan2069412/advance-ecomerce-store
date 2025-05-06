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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  ArrowLeft,
  Printer,
  RefreshCcw,
  Truck,
  Package,
  BarChart,
  Mail,
  Download,
} from "lucide-react";
import { toast } from "sonner";

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

// Define the shipping form schema
const shippingFormSchema = z.object({
  carrier: z.string({
    required_error: "Please select a shipping carrier",
  }),
  trackingNumber: z.string().min(5, {
    message: "Tracking number must be at least 5 characters",
  }),
  shippingDate: z.string().min(1, {
    message: "Please select a shipping date",
  }),
  packageWeight: z.string().min(1, {
    message: "Please enter the package weight",
  }),
  packageDimensions: z.string().optional(),
  shippingMethod: z.string({
    required_error: "Please select a shipping method",
  }),
  additionalNotes: z.string().optional(),
  notifyCustomer: z.boolean().default(true),
  updateOrderStatus: z.boolean().default(true),
});

type ShippingFormValues = z.infer<typeof shippingFormSchema>;

export default function ShippingLabelPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [labelGenerated, setLabelGenerated] = useState(false);

  // Initialize form
  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      carrier: "",
      trackingNumber: "",
      shippingDate: new Date().toISOString().split('T')[0],
      packageWeight: "",
      packageDimensions: "",
      shippingMethod: "",
      additionalNotes: "",
      notifyCustomer: true,
      updateOrderStatus: true,
    },
  });

  // Fetch order data
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/orders?orderNumber=${orderId}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error response:', response.status, errorData);
          throw new Error(errorData.error || `Error fetching order: ${response.status}`);
        }

        const data = await response.json();

        if (!data) {
          console.warn('No data returned for order:', orderId);
          setError('Order not found. Please check the order number and try again.');
          return;
        }

        setOrder(data);

        // Set default shipping method based on order
        form.setValue("shippingMethod", data.shipping_method);

        // If tracking number already exists, pre-fill it
        if (data.tracking_number) {
          form.setValue("trackingNumber", data.tracking_number);
          setLabelGenerated(true);
        }
      } catch (err: any) {
        console.error('Error fetching order details:', err);
        setError(err.message || 'An error occurred while fetching the order details');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, form]);

  const onSubmit = async (values: ShippingFormValues) => {
    try {
      setIsProcessing(true);

      if (!order) {
        throw new Error("Order not found");
      }

      // Update the order with shipping information through the API
      const response = await fetch('/api/orders/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber: order.order_number,
          status: values.updateOrderStatus ? 'shipped' : order.status,
          trackingNumber: values.trackingNumber,
          carrier: values.carrier,
          shippingMethod: values.shippingMethod,
          notifyCustomer: values.notifyCustomer,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update shipping information');
      }

      const result = await response.json();

      // Store the form values in the form state for display
      form.setValue('trackingNumber', values.trackingNumber);
      form.setValue('carrier', values.carrier);
      form.setValue('shippingMethod', values.shippingMethod);

      setLabelGenerated(true);
      toast.success("Shipping label generated successfully");
    } catch (err: any) {
      console.error("Error generating shipping label:", err);
      toast.error(err.message || "Failed to generate shipping label. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintLabel = () => {
    window.print();
  };

  const handleDownloadLabel = () => {
    // In a real application, this would download a PDF
    toast.success("Shipping label downloaded successfully");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate estimated package weight based on items
  const calculateEstimatedWeight = () => {
    if (!order || !order.order_items) return "0.5";

    // In a real app, you would have weight data for each product
    // Here we're just estimating based on number of items
    const totalItems = order.order_items.reduce((sum, item) => sum + item.quantity, 0);
    return (totalItems * 0.5).toFixed(1); // Assume 0.5 lbs per item
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
              <a href="/admin/orders">Back to Orders</a>
            </Button>
          </div>
        ) : !order ? (
          <div className="flex flex-col items-center justify-center h-64">
            <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
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
                <h1 className="text-2xl font-bold">Shipping Label</h1>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Order #{order.order_number} • {formatDate(order.created_at)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                {labelGenerated ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Shipping Label Generated</CardTitle>
                      <CardDescription>
                        Your shipping label has been generated successfully
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-100 p-8 rounded-lg border border-gray-200 flex flex-col items-center">
                        <div className="w-full max-w-md bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-bold text-lg">Your Company Name</h3>
                              <p className="text-xs text-gray-500">123 Business St, Suite 100<br />New York, NY 10001</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-bold">{form.getValues("carrier") || "USPS"}</p>
                              <p className="text-xs">{form.getValues("shippingMethod") || order.shipping_method}</p>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div className="mb-4">
                            <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">Ship To:</h4>
                            <p className="font-bold">{order.shipping_address.fullName}</p>
                            <p className="text-sm">{order.shipping_address.address}</p>
                            <p className="text-sm">{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
                            <p className="text-sm">{order.shipping_address.phone}</p>
                          </div>

                          <div className="mb-4">
                            <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">Order Information:</h4>
                            <p className="text-sm">Order #: {order.order_number}</p>
                            <p className="text-sm">Date: {formatDate(order.created_at)}</p>
                          </div>

                          <div className="mb-4">
                            <h4 className="text-xs font-bold uppercase text-gray-500 mb-1">Tracking Number:</h4>
                            <p className="font-mono text-lg font-bold">{form.getValues("trackingNumber")}</p>
                          </div>

                          <div className="flex justify-center mb-4">
                            {/* This would be a real barcode in a production app */}
                            <div className="bg-gray-800 h-16 w-64"></div>
                          </div>

                          <div className="text-xs text-center text-gray-500">
                            <p>Weight: {form.getValues("packageWeight")} lbs</p>
                            {form.getValues("packageDimensions") && (
                              <p>Dimensions: {form.getValues("packageDimensions")}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex space-x-4 mt-6">
                          <Button variant="outline" onClick={handlePrintLabel}>
                            <Printer className="mr-2 h-4 w-4" />
                            Print Label
                          </Button>
                          <Button onClick={handleDownloadLabel}>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => setLabelGenerated(false)}>
                        Edit Shipping Details
                      </Button>
                      <Button variant="outline" asChild>
                        <a href={`/admin/orders/${orderId}`}>
                          View Order Details
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Shipping Details</CardTitle>
                      <CardDescription>
                        Generate a shipping label for this order
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="carrier"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Shipping Carrier</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a carrier" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="usps">USPS</SelectItem>
                                      <SelectItem value="ups">UPS</SelectItem>
                                      <SelectItem value="fedex">FedEx</SelectItem>
                                      <SelectItem value="dhl">DHL</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="shippingMethod"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Shipping Method</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a shipping method" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="standard">Standard Shipping</SelectItem>
                                      <SelectItem value="express">Express Shipping</SelectItem>
                                      <SelectItem value="overnight">Overnight Shipping</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="trackingNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Tracking Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter tracking number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="shippingDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Shipping Date</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="packageWeight"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Package Weight (lbs)</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter weight in pounds"
                                      {...field}
                                      value={field.value || calculateEstimatedWeight()}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Estimated weight based on items
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="packageDimensions"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Package Dimensions (optional)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="L x W x H in inches" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Format: 12 x 10 x 8
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="additionalNotes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Additional Notes (optional)</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Add any special instructions or notes"
                                    className="min-h-20"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="updateOrderStatus"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Update Order Status</FormLabel>
                                    <FormDescription>
                                      Automatically update order status to "Shipped"
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="notifyCustomer"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Notify Customer</FormLabel>
                                    <FormDescription>
                                      Send an email notification with tracking information
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="pt-4 flex justify-end space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => router.push(`/admin/orders/${orderId}`)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              disabled={isProcessing}
                            >
                              {isProcessing ? (
                                <>
                                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Truck className="mr-2 h-4 w-4" />
                                  Generate Shipping Label
                                </>
                              )}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-medium mb-2">Recipient</h3>
                        <p className="text-sm">
                          {order.shipping_address.fullName}<br />
                          {order.shipping_address.address}<br />
                          {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}<br />
                          {order.shipping_address.phone}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Order Summary</h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Order Number:</span>
                            <span>{order.order_number}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date:</span>
                            <span>{formatDate(order.created_at)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Items:</span>
                            <span>{order.order_items.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total:</span>
                            <span>${order.total_amount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-medium mb-2">Items in Order</h3>
                        <ul className="space-y-2">
                          {order.order_items.map((item) => (
                            <li key={item.id} className="text-sm flex justify-between">
                              <span>{item.product_name} × {item.quantity}</span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-medium mb-2">Shipping Method</h3>
                        <p className="text-sm capitalize">{order.shipping_method.replace('_', ' ')}</p>
                        {order.tracking_number && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Tracking Number:</p>
                            <p className="text-sm font-mono">{order.tracking_number}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
