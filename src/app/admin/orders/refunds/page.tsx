'use client';

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  RefreshCw,
  AlertCircle,
  CheckCircle,
  DollarSign
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
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

interface Refund {
  id: string;
  orderId: string;
  orderNumber: string;
  dateRequested: string;
  customer: string;
  amount: number;
  reason: string;
  status: string;
  processedBy?: string;
  dateProcessed?: string;
}

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/orders');

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();

        // Filter orders that have refund status
        const refundedOrders = data.filter((order: Order) =>
          order.status === 'refunded' || order.status === 'partially_refunded'
        );

        // Transform orders into refunds
        const transformedRefunds = refundedOrders.map((order: Order) => ({
          id: `REF-${order.order_number.replace('ORD-', '')}`,
          orderId: order.id,
          orderNumber: order.order_number,
          dateRequested: new Date(order.updated_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          dateProcessed: new Date(order.updated_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          customer: order.shipping_address.fullName,
          amount: order.total_amount * 0.8, // Assuming 80% refund for demo purposes
          reason: "Customer request", // Default reason
          status: order.status === 'refunded' ? 'completed' : 'partially_refunded',
          processedBy: "Admin User",
        }));

        // Add some pending refunds for demo purposes
        const pendingRefunds = [
          {
            id: "REF-PENDING-1",
            orderId: "demo-order-1",
            orderNumber: "ORD-DEMO-1",
            dateRequested: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            customer: "Demo Customer 1",
            amount: 129.99,
            reason: "Item damaged during shipping",
            status: "pending",
          },
          {
            id: "REF-PENDING-2",
            orderId: "demo-order-2",
            orderNumber: "ORD-DEMO-2",
            dateRequested: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            customer: "Demo Customer 2",
            amount: 89.95,
            reason: "Wrong size ordered",
            status: "pending",
          }
        ];

        setRefunds([...transformedRefunds, ...pendingRefunds]);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'An error occurred while fetching orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter refunds based on search query
  const filteredRefunds = refunds.filter(refund =>
    refund.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    refund.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    refund.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    refund.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingRefunds = filteredRefunds.filter(refund => refund.status === 'pending');
  const processedRefunds = filteredRefunds.filter(refund => refund.status !== 'pending');

  const handleApproveRefund = (refundId: string) => {
    toast.success(`Refund ${refundId} approved`);
  };

  const handleDenyRefund = (refundId: string) => {
    toast.error(`Refund ${refundId} denied`);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Refetch orders
    fetch('/api/orders')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        return response.json();
      })
      .then(data => {
        // Filter orders that have refund status
        const refundedOrders = data.filter((order: Order) =>
          order.status === 'refunded' || order.status === 'partially_refunded'
        );

        // Transform orders into refunds
        const transformedRefunds = refundedOrders.map((order: Order) => ({
          id: `REF-${order.order_number.replace('ORD-', '')}`,
          orderId: order.id,
          orderNumber: order.order_number,
          dateRequested: new Date(order.updated_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          dateProcessed: new Date(order.updated_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          customer: order.shipping_address.fullName,
          amount: order.total_amount * 0.8, // Assuming 80% refund for demo purposes
          reason: "Customer request", // Default reason
          status: order.status === 'refunded' ? 'completed' : 'partially_refunded',
          processedBy: "Admin User",
        }));

        // Keep the demo pending refunds
        const pendingRefunds = [
          {
            id: "REF-PENDING-1",
            orderId: "demo-order-1",
            orderNumber: "ORD-DEMO-1",
            dateRequested: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            customer: "Demo Customer 1",
            amount: 129.99,
            reason: "Item damaged during shipping",
            status: "pending",
          },
          {
            id: "REF-PENDING-2",
            orderId: "demo-order-2",
            orderNumber: "ORD-DEMO-2",
            dateRequested: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            customer: "Demo Customer 2",
            amount: 89.95,
            reason: "Wrong size ordered",
            status: "pending",
          }
        ];

        setRefunds([...transformedRefunds, ...pendingRefunds]);
        toast.success('Refunds refreshed successfully');
      })
      .catch(err => {
        console.error('Error refreshing orders:', err);
        toast.error('Failed to refresh refunds');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Refund Management
          </h1>
          <Button onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by refund ID, order #, customer, or reason..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Refund Requests</CardTitle>
            <CardDescription>
              Manage all customer refund requests in one place.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>{error}</p>
                <Button onClick={handleRefresh} variant="outline" className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : pendingRefunds.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No pending refunds match your search' : 'No pending refunds found'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Refund ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date Requested</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRefunds.map((refund) => (
                    <TableRow key={refund.id}>
                      <TableCell className="font-medium">{refund.id}</TableCell>
                      <TableCell>{refund.orderNumber}</TableCell>
                      <TableCell>{refund.dateRequested}</TableCell>
                      <TableCell>{refund.customer}</TableCell>
                      <TableCell>${refund.amount.toFixed(2)}</TableCell>
                      <TableCell>{refund.reason}</TableCell>
                      <TableCell>
                        <RefundStatusBadge status={refund.status} />
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
                                (window.location.href = `/admin/orders/refunds/${refund.orderNumber}`)
                              }
                            >
                              View Details
                            </DropdownMenuItem>
                            {refund.status === "pending" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleApproveRefund(refund.id)}
                                >
                                  Approve Refund
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDenyRefund(refund.id)}
                                >
                                  Deny Refund
                                </DropdownMenuItem>
                              </>
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

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Processed Refunds</CardTitle>
            <CardDescription>History of all processed refunds.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>{error}</p>
              </div>
            ) : processedRefunds.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No processed refunds match your search' : 'No processed refunds found'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Refund ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date Processed</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Processed By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedRefunds.map((refund) => (
                    <TableRow key={refund.id}>
                      <TableCell className="font-medium">{refund.id}</TableCell>
                      <TableCell>{refund.orderNumber}</TableCell>
                      <TableCell>{refund.dateProcessed}</TableCell>
                      <TableCell>{refund.customer}</TableCell>
                      <TableCell>${refund.amount.toFixed(2)}</TableCell>
                      <TableCell>{refund.processedBy || 'Admin User'}</TableCell>
                      <TableCell>
                        <RefundStatusBadge status={refund.status} />
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
                                (window.location.href = `/admin/orders/refunds/${refund.orderNumber}`)
                              }
                            >
                              View Details
                            </DropdownMenuItem>
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
      </div>
    </AdminLayout>
  );
}

function RefundStatusBadge({ status }: { status: string }) {
  const getVariant = () => {
    switch (status) {
      case "pending":
        return "outline";
      case "approved":
        return "success";
      case "processing":
        return "secondary";
      case "completed":
        return "default";
      case "denied":
        return "destructive";
      default:
        return "outline";
    }
  };

  return <Badge variant={getVariant() as any}>{status}</Badge>;
}

const mockRefunds = [
  {
    id: "REF-001",
    orderId: "ORD-1234",
    dateRequested: "2023-05-20",
    customer: "Emma Wilson",
    amount: 850.99,
    reason: "Item damaged during shipping",
    status: "pending",
  },
  {
    id: "REF-002",
    orderId: "ORD-1235",
    dateRequested: "2023-05-21",
    customer: "James Smith",
    amount: 450.5,
    reason: "Wrong size delivered",
    status: "pending",
  },
  {
    id: "REF-003",
    orderId: "ORD-1240",
    dateRequested: "2023-05-22",
    customer: "Olivia Johnson",
    amount: 320.0,
    reason: "Changed mind about purchase",
    status: "pending",
  },
];

const mockProcessedRefunds = [
  {
    id: "REF-004",
    orderId: "ORD-1230",
    dateProcessed: "2023-05-19",
    customer: "Noah Williams",
    amount: 750.25,
    processedBy: "Admin User",
    status: "completed",
  },
  {
    id: "REF-005",
    orderId: "ORD-1231",
    dateProcessed: "2023-05-18",
    customer: "Sophia Brown",
    amount: 420.3,
    processedBy: "Admin User",
    status: "denied",
  },
  {
    id: "REF-006",
    orderId: "ORD-1232",
    dateProcessed: "2023-05-17",
    customer: "Liam Davis",
    amount: 350.0,
    processedBy: "Admin User",
    status: "approved",
  },
];
