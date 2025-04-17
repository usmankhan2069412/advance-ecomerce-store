import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
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
} from "lucide-react";

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // In a real app, you would fetch the order details based on the ID
  const orderId = params.id;
  const order = {
    id: orderId,
    date: "2023-05-15",
    customer: "Emma Wilson",
    email: "emma.wilson@example.com",
    phone: "+1 (555) 123-4567",
    items: [
      {
        id: "PROD-001",
        name: "Designer Silk Dress",
        quantity: 1,
        price: 850.99,
        total: 850.99,
      },
      {
        id: "PROD-002",
        name: "Luxury Leather Handbag",
        quantity: 1,
        price: 320.0,
        total: 320.0,
      },
      {
        id: "PROD-003",
        name: "Premium Cashmere Scarf",
        quantity: 1,
        price: 80.0,
        total: 80.0,
      },
    ],
    subtotal: 1250.99,
    shipping: 15.0,
    tax: 102.5,
    total: 1368.49,
    status: "delivered",
    shippingAddress: {
      street: "123 Fashion Ave",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
    },
    billingAddress: {
      street: "123 Fashion Ave",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
    },
    paymentMethod: "Credit Card (Visa ending in 4567)",
    trackingNumber: "TRK-9876543210",
    carrier: "FedEx",
    history: [
      {
        date: "2023-05-15 09:30 AM",
        status: "Order Placed",
        note: "Order successfully placed by customer",
      },
      {
        date: "2023-05-15 10:15 AM",
        status: "Payment Confirmed",
        note: "Payment successfully processed",
      },
      {
        date: "2023-05-15 02:30 PM",
        status: "Processing",
        note: "Order is being prepared for shipping",
      },
      {
        date: "2023-05-16 11:45 AM",
        status: "Shipped",
        note: "Order has been shipped via FedEx",
      },
      {
        date: "2023-05-18 02:20 PM",
        status: "Delivered",
        note: "Package was delivered successfully",
      },
    ],
  };

  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="md" asChild>
              <a href="/admin/orders">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <h1 className="text-2xl font-bold">Order {order.id}</h1>
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
              <CardDescription>Order placed on {order.date}</CardDescription>
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
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.total.toFixed(2)}
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
                      ${order.shipping.toFixed(2)}
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
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      ${order.total.toFixed(2)}
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
                  <p className="font-medium">{order.customer}</p>
                  <p>{order.email}</p>
                  <p>{order.phone}</p>
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
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zip}
                  </p>
                  <p>{order.shippingAddress.country}</p>

                  <Separator className="my-4" />

                  <p className="font-medium">Shipping Method:</p>
                  <p>{order.carrier}</p>

                  {order.trackingNumber && (
                    <>
                      <p className="font-medium mt-4">Tracking Number:</p>
                      <div className="flex items-center space-x-2">
                        <p>{order.trackingNumber}</p>
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
                  <p>{order.paymentMethod}</p>

                  <Separator className="my-4" />

                  <p className="font-medium">Billing Address:</p>
                  <p>{order.billingAddress.street}</p>
                  <p>
                    {order.billingAddress.city}, {order.billingAddress.state}{" "}
                    {order.billingAddress.zip}
                  </p>
                  <p>{order.billingAddress.country}</p>
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
              {order.history.map((event, index) => (
                <div key={index} className="mb-8 flex items-start">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <div className="h-3 w-3 rounded-full bg-primary-foreground" />
                  </div>
                  {index < order.history.length - 1 && (
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
      </div>
    </AdminLayout>
  );
}
