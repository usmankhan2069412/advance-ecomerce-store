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
} from "@/components/ui/table";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  RefreshCcw,
  DollarSign,
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

// Define the refund form schema
const refundFormSchema = z.object({
  refundType: z.enum(["full", "partial"], {
    required_error: "Please select a refund type",
  }),
  refundAmount: z.string().optional(),
  refundReason: z.string().min(5, {
    message: "Refund reason must be at least 5 characters",
  }),
  itemsToRefund: z.array(z.string()).optional(),
  restockItems: z.boolean().default(false),
  notifyCustomer: z.boolean().default(true),
});

type RefundFormValues = z.infer<typeof refundFormSchema>;

export default function RefundPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [refundTotal, setRefundTotal] = useState<number>(0);

  // Initialize form
  const form = useForm<RefundFormValues>({
    resolver: zodResolver(refundFormSchema),
    defaultValues: {
      refundType: "full",
      refundAmount: "",
      refundReason: "",
      itemsToRefund: [],
      restockItems: true,
      notifyCustomer: true,
    },
  });

  // Watch for changes in refund type and selected items
  const refundType = form.watch("refundType");
  const itemsToRefund = form.watch("itemsToRefund");

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

        // Check if order is already refunded
        if (data.status === 'refunded') {
          setError('This order has already been refunded.');
        }

        setOrder(data);

        // Set default refund amount to total order amount
        form.setValue("refundAmount", data.total_amount.toFixed(2));
        setRefundTotal(data.total_amount);
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

  // Update refund amount when items are selected or refund type changes
  useEffect(() => {
    if (!order) return;

    if (refundType === "full") {
      setRefundTotal(order.total_amount);
      form.setValue("refundAmount", order.total_amount.toFixed(2));
    } else if (refundType === "partial" && itemsToRefund && itemsToRefund.length > 0) {
      // Calculate total for selected items
      const selectedItemsTotal = order.order_items
        .filter(item => itemsToRefund.includes(item.id))
        .reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Add proportional tax and shipping
      const proportion = selectedItemsTotal / order.subtotal;
      const proportionalTax = order.tax * proportion;
      const proportionalShipping = order.shipping_cost * proportion;

      const total = selectedItemsTotal + proportionalTax + proportionalShipping;
      setRefundTotal(total);
      form.setValue("refundAmount", total.toFixed(2));
    } else if (refundType === "partial") {
      // Default to 0 if no items selected
      setRefundTotal(0);
      form.setValue("refundAmount", "0.00");
    }
  }, [refundType, itemsToRefund, order, form]);

  const onSubmit = async (values: RefundFormValues) => {
    try {
      setIsProcessing(true);

      if (!order) {
        throw new Error("Order not found");
      }

      // Process the refund through the API
      const response = await fetch('/api/orders/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber: order.order_number,
          status: values.refundType === 'full' ? 'refunded' : 'partially_refunded',
          refundAmount: refundTotal.toString(),
          refundReason: values.refundReason,
          refundItems: values.itemsToRefund || [],
          restockItems: values.restockItems,
          notifyCustomer: values.notifyCustomer,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process refund');
      }

      const result = await response.json();

      toast.success("Refund processed successfully");

      // Redirect back to orders page
      router.push("/admin/orders");
    } catch (err: any) {
      console.error("Error processing refund:", err);
      toast.error(err.message || "Failed to process refund. Please try again.");
    } finally {
      setIsProcessing(false);
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
                <h1 className="text-2xl font-bold">Process Refund</h1>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Order #{order.order_number} • {formatDate(order.created_at)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Refund Details</CardTitle>
                    <CardDescription>
                      Process a refund for this order
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="refundType"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Refund Type</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="full" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Full Refund (${order.total_amount.toFixed(2)})
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="partial" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Partial Refund (Select items below)
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {refundType === "partial" && (
                          <div className="space-y-4">
                            <h3 className="font-medium">Select Items to Refund</h3>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-12"></TableHead>
                                  <TableHead>Product</TableHead>
                                  <TableHead className="text-right">Quantity</TableHead>
                                  <TableHead className="text-right">Price</TableHead>
                                  <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {order.order_items.map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell>
                                      <FormField
                                        control={form.control}
                                        name="itemsToRefund"
                                        render={({ field }) => (
                                          <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(item.id)}
                                                onCheckedChange={(checked) => {
                                                  const currentValue = field.value || [];
                                                  if (checked) {
                                                    field.onChange([...currentValue, item.id]);
                                                  } else {
                                                    field.onChange(
                                                      currentValue.filter((value) => value !== item.id)
                                                    );
                                                  }
                                                }}
                                              />
                                            </FormControl>
                                          </FormItem>
                                        )}
                                      />
                                    </TableCell>
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
                            </Table>
                          </div>
                        )}

                        <FormField
                          control={form.control}
                          name="refundAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Refund Amount</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    {...field}
                                    className="pl-9"
                                    value={refundTotal.toFixed(2)}
                                    readOnly={refundType === "full" || (refundType === "partial" && itemsToRefund && itemsToRefund.length > 0)}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      const value = parseFloat(e.target.value);
                                      if (!isNaN(value)) {
                                        setRefundTotal(value);
                                      }
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription>
                                {refundType === "full"
                                  ? "Full refund amount including tax and shipping"
                                  : "Amount will be calculated based on selected items"}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="refundReason"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reason for Refund</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Please provide a reason for this refund"
                                  className="min-h-32"
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
                            name="restockItems"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Restock Items</FormLabel>
                                  <FormDescription>
                                    Add the refunded items back to inventory
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
                                    Send an email notification to the customer about this refund
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
                            onClick={() => router.push("/admin/orders")}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={isProcessing}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {isProcessing ? (
                              <>
                                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>Process Refund</>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Customer</h3>
                      <p className="text-sm">
                        {order.shipping_address.fullName}<br />
                        {order.shipping_address.email}<br />
                        {order.shipping_address.phone}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Order Details</h3>
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
                          <span className="text-muted-foreground">Status:</span>
                          <span className="capitalize">{order.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payment:</span>
                          <span className="capitalize">{order.payment_status}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Order Totals</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal:</span>
                          <span>${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shipping:</span>
                          <span>${order.shipping_cost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tax:</span>
                          <span>${order.tax.toFixed(2)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Discount:</span>
                            <span>-${order.discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-medium pt-2">
                          <span>Total:</span>
                          <span>${order.total_amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Refund Summary</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Refund Type:</span>
                          <span className="capitalize">{refundType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Items to Refund:</span>
                          <span>
                            {refundType === "full"
                              ? "All Items"
                              : itemsToRefund?.length
                                ? `${itemsToRefund.length} items`
                                : "None selected"}
                          </span>
                        </div>
                        <div className="flex justify-between font-medium pt-2">
                          <span>Refund Amount:</span>
                          <span>${refundTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800">Important Note</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Refunds cannot be undone once processed. Please verify all details before proceeding.
                          </p>
                        </div>
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
