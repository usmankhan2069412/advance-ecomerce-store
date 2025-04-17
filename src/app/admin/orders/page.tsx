import React from "react";
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
} from "lucide-react";

export default function OrdersPage() {
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
            <Button>
              <RefreshCw className="mr-2 h-4 w-4" />
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
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="canceled">Canceled</TabsTrigger>
            <TabsTrigger value="refunded">Refunded</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>All Orders</CardTitle>
                <CardDescription>
                  Manage all customer orders in one place.
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                    {mockOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.items}</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
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
                                  (window.location.href = `/admin/orders/${order.id}`)
                                }
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  (window.location.href = `/admin/orders/${order.id}/edit`)
                                }
                              >
                                Edit Order
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  (window.location.href = `/admin/orders/${order.id}/invoice`)
                                }
                              >
                                Generate Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  (window.location.href = `/admin/orders/${order.id}/shipping`)
                                }
                              >
                                Shipping Label
                              </DropdownMenuItem>
                              {order.status !== "refunded" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    (window.location.href = `/admin/orders/${order.id}/refund`)
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
              </CardContent>
            </Card>
          </TabsContent>
          {/* Other tab contents would be similar but filtered by status */}
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

const mockOrders = [
  {
    id: "ORD-1234",
    date: "2023-05-15",
    customer: "Emma Wilson",
    items: 3,
    total: 1250.99,
    status: "delivered",
  },
  {
    id: "ORD-1235",
    date: "2023-05-16",
    customer: "James Smith",
    items: 1,
    total: 450.5,
    status: "processing",
  },
  {
    id: "ORD-1236",
    date: "2023-05-16",
    customer: "Olivia Johnson",
    items: 2,
    total: 780.25,
    status: "shipped",
  },
  {
    id: "ORD-1237",
    date: "2023-05-17",
    customer: "Noah Williams",
    items: 5,
    total: 1890.75,
    status: "pending",
  },
  {
    id: "ORD-1238",
    date: "2023-05-17",
    customer: "Sophia Brown",
    items: 2,
    total: 670.3,
    status: "canceled",
  },
  {
    id: "ORD-1239",
    date: "2023-05-18",
    customer: "Liam Davis",
    items: 1,
    total: 350.0,
    status: "refunded",
  },
];
