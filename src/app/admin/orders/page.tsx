'use client';

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Search,
  Filter,
  MoreVertical,
  FileText,
  Printer,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

// Define the Order type based on the database schema
interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  shipping_address: {
    fullName: string;
    email: string;
  };
  order_items: OrderItem[];
  total_amount: number;
  status: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Fetch orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/orders');

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Error response:', response.status, errorData);
          throw new Error(errorData.error || `Error fetching orders: ${response.status}`);
        }

        const data = await response.json();

        // Check if data is an array
        if (Array.isArray(data)) {
          setOrders(data);
          setFilteredOrders(data);
        } else {
          console.warn('Unexpected data format:', data);
          // Try to handle the data anyway if it has items
          if (data && typeof data === 'object') {
            setOrders([data]);
            setFilteredOrders([data]);
          } else {
            setOrders([]);
            setFilteredOrders([]);
          }
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again.');
        toast.error('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on search term and active tab
  useEffect(() => {
    let result = orders;

    // Filter by status if not "all"
    if (activeTab !== 'all') {
      result = result.filter(order => order.status === activeTab);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order =>
        order.order_number.toLowerCase().includes(term) ||
        order.shipping_address.fullName?.toLowerCase().includes(term) ||
        order.shipping_address.email?.toLowerCase().includes(term)
      );
    }

    setFilteredOrders(result);
  }, [orders, searchTerm, activeTab]);

  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/orders');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', response.status, errorData);
        throw new Error(errorData.error || `Error refreshing orders: ${response.status}`);
      }

      const data = await response.json();

      // Check if data is an array
      if (Array.isArray(data)) {
        setOrders(data);
        setFilteredOrders(data);
        toast.success('Orders refreshed successfully');
      } else {
        console.warn('Unexpected data format:', data);
        toast.warning('Received unexpected data format');
        // Try to handle the data anyway if it has items
        if (data && typeof data === 'object') {
          setOrders([data]);
          setFilteredOrders([data]);
        }
      }
    } catch (error) {
      console.error('Error refreshing orders:', error);
      setError('Failed to refresh orders. Please try again.');
      toast.error('Failed to refresh orders');
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Count total items in an order
  const countItems = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Get customer name from shipping address
  const getCustomerName = (order: Order) => {
    return order.shipping_address?.fullName || 'Anonymous Customer';
  };

  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Order Management
          </h1>
          <div className="flex space-x-2">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button onClick={handleRefresh} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="canceled">Canceled</TabsTrigger>
            <TabsTrigger value="refunded">Refunded</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{activeTab === 'all' ? 'All Orders' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Orders`}</CardTitle>
                <CardDescription>
                  Manage all customer orders in one place.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading orders...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                    <p className="text-destructive">{error}</p>
                    <Button onClick={handleRefresh} variant="outline" className="mt-4">
                      Try Again
                    </Button>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No orders found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.order_number}
                          </TableCell>
                          <TableCell>{formatDate(order.created_at)}</TableCell>
                          <TableCell>{getCustomerName(order)}</TableCell>
                          <TableCell>{countItems(order.order_items)}</TableCell>
                          <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <OrderStatusBadge status={order.status} />
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    (window.location.href = `/admin/orders/${order.order_number}`)
                                  }
                                >
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    (window.location.href = `/admin/orders/${order.order_number}/edit`)
                                  }
                                >
                                  Edit Order
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    (window.location.href = `/admin/orders/${order.order_number}/invoice`)
                                  }
                                >
                                  Generate Invoice
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    (window.location.href = `/admin/orders/${order.order_number}/shipping`)
                                  }
                                >
                                  Shipping Label
                                </DropdownMenuItem>
                                {order.status !== "refunded" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      (window.location.href = `/admin/orders/${order.order_number}/refund`)
                                    }
                                  >
                                    Process Refund
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const getVariant = () => {
    switch (status) {
      case "pending":
        return "outline";
      case "processing":
        return "secondary";
      case "shipped":
        return "default";
      case "delivered":
        return "success";
      case "canceled":
        return "destructive";
      case "refunded":
        return "warning";
      default:
        return "outline";
    }
  };

  return <Badge variant={getVariant() as any}>{status}</Badge>;
}
