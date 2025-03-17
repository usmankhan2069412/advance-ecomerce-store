import React from "react";
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
  ArrowLeft,
  Mail,
  Edit,
  Lock,
  Trash2,
  MapPin,
  CreditCard,
  ShoppingBag,
} from "lucide-react";

export default function CustomerDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // In a real app, you would fetch the customer details based on the ID
  const customerId = parseInt(params.id);
  const customer =
    mockCustomers.find((c) => c.id === customerId) || mockCustomers[0];

  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" asChild>
              <a href="/admin/customers">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <h1 className="text-2xl font-bold">Customer Profile</h1>
            <Badge
              variant={customer.status === "active" ? "success" : "secondary"}
            >
              {customer.status}
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Email Customer
            </Button>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl mb-4">
                  {customer.name.charAt(0)}
                </div>
                <h2 className="text-xl font-bold">{customer.name}</h2>
                <p className="text-muted-foreground">{customer.email}</p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Customer ID
                  </p>
                  <p>{customer.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone Number
                  </p>
                  <p>{customer.phone || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Member Since
                  </p>
                  <p>{customer.joined}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Account Status
                  </p>
                  <p className="capitalize">{customer.status}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Orders</span>
                  <span className="font-medium">{customer.orders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Spent</span>
                  <span className="font-medium">
                    ${customer.totalSpent.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Average Order Value
                  </span>
                  <span className="font-medium">
                    ${(customer.totalSpent / customer.orders).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Button className="w-full" variant="outline">
                  <Lock className="mr-2 h-4 w-4" />
                  Reset Password
                </Button>
                {customer.status === "active" ? (
                  <Button className="w-full" variant="outline">
                    Disable Account
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline">
                    Enable Account
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="orders">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="payment">Payment Methods</TabsTrigger>
                <TabsTrigger value="activity">Activity Log</TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>
                      View all orders placed by this customer.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">
                              {order.id}
                            </TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>{order.items}</TableCell>
                            <TableCell>${order.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  order.status === "delivered"
                                    ? "success"
                                    : order.status === "shipped"
                                      ? "default"
                                      : order.status === "processing"
                                        ? "secondary"
                                        : "outline"
                                }
                              >
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" asChild>
                                <a href={`/admin/orders/${order.id}`}>View</a>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addresses" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Addresses</CardTitle>
                    <CardDescription>
                      Manage customer's shipping and billing addresses.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {mockAddresses.map((address) => (
                        <Card key={address.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                <h3 className="font-medium">
                                  {address.type} Address
                                </h3>
                              </div>
                              {address.default && (
                                <Badge variant="outline">Default</Badge>
                              )}
                            </div>
                            <div className="space-y-1 text-sm">
                              <p>{address.name}</p>
                              <p>{address.street}</p>
                              <p>
                                {address.city}, {address.state} {address.zip}
                              </p>
                              <p>{address.country}</p>
                              {address.phone && <p>Phone: {address.phone}</p>}
                            </div>
                            <div className="flex justify-end mt-4 space-x-2">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm">
                                Delete
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>
                      View and manage customer's saved payment methods.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockPaymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className="flex justify-between items-center p-4 border rounded-md"
                        >
                          <div className="flex items-center">
                            <CreditCard className="h-5 w-5 mr-3 text-muted-foreground" />
                            <div>
                              <p className="font-medium">
                                {method.type} ending in {method.last4}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Expires {method.expMonth}/{method.expYear}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {method.default && (
                              <Badge variant="outline">Default</Badge>
                            )}
                            <Button variant="ghost" size="sm">
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Log</CardTitle>
                    <CardDescription>
                      Recent account activity and changes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {mockActivityLog.map((activity, index) => (
                        <div key={index} className="mb-8 flex items-start">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                            <div className="h-3 w-3 rounded-full bg-primary-foreground" />
                          </div>
                          {index < mockActivityLog.length - 1 && (
                            <div
                              className="absolute ml-4 h-full w-px bg-border"
                              style={{ top: "2rem", bottom: 0, left: 0 }}
                            />
                          )}
                          <div className="ml-4">
                            <p className="font-semibold">{activity.action}</p>
                            <p className="text-sm text-muted-foreground">
                              {activity.date}
                            </p>
                            <p className="mt-2">{activity.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

const mockCustomers = [
  {
    id: 1,
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    orders: 8,
    totalSpent: 3250.75,
    joined: "2023-01-15",
  },
  {
    id: 2,
    name: "James Smith",
    email: "james.smith@example.com",
    phone: "+1 (555) 987-6543",
    status: "active",
    orders: 5,
    totalSpent: 1890.5,
    joined: "2023-02-20",
  },
];

const mockOrders = [
  {
    id: "ORD-1234",
    date: "2023-05-15",
    items: 3,
    total: 850.99,
    status: "delivered",
  },
  {
    id: "ORD-1235",
    date: "2023-04-22",
    items: 1,
    total: 450.5,
    status: "delivered",
  },
  {
    id: "ORD-1236",
    date: "2023-03-10",
    items: 2,
    total: 780.25,
    status: "delivered",
  },
  {
    id: "ORD-1237",
    date: "2023-02-28",
    items: 1,
    total: 320.0,
    status: "delivered",
  },
  {
    id: "ORD-1238",
    date: "2023-01-15",
    items: 4,
    total: 849.01,
    status: "delivered",
  },
];

const mockAddresses = [
  {
    id: 1,
    type: "Shipping",
    default: true,
    name: "Emma Wilson",
    street: "123 Fashion Ave",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "USA",
    phone: "+1 (555) 123-4567",
  },
  {
    id: 2,
    type: "Billing",
    default: true,
    name: "Emma Wilson",
    street: "123 Fashion Ave",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "USA",
    phone: null,
  },
  {
    id: 3,
    type: "Shipping",
    default: false,
    name: "Emma Wilson",
    street: "456 Work Plaza",
    city: "New York",
    state: "NY",
    zip: "10022",
    country: "USA",
    phone: "+1 (555) 987-6543",
  },
];

const mockPaymentMethods = [
  {
    id: 1,
    type: "Visa",
    last4: "4567",
    expMonth: "05",
    expYear: "2025",
    default: true,
  },
  {
    id: 2,
    type: "Mastercard",
    last4: "8901",
    expMonth: "09",
    expYear: "2024",
    default: false,
  },
];

const mockActivityLog = [
  {
    action: "Order Placed",
    date: "2023-05-15 09:30 AM",
    details: "Customer placed order #ORD-1234 for $850.99",
  },
  {
    action: "Account Login",
    date: "2023-05-15 09:15 AM",
    details: "Customer logged in from IP 192.168.1.1 using Chrome on Windows",
  },
  {
    action: "Password Changed",
    date: "2023-04-10 02:45 PM",
    details: "Customer changed their account password",
  },
  {
    action: "Address Added",
    date: "2023-03-22 11:20 AM",
    details: "Customer added a new shipping address",
  },
  {
    action: "Account Created",
    date: "2023-01-15 10:00 AM",
    details: "Customer created their account",
  },
];
