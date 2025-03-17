import React from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  MoreVertical,
  Printer,
  Truck,
  Package,
  RefreshCw,
} from "lucide-react";

export default function ShippingPage() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Shipping Management
          </h1>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Batch Print Labels
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
              placeholder="Search shipments..."
              className="pl-8 w-full"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending Shipments</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="all">All Shipments</TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Pending Shipments</CardTitle>
                <CardDescription>
                  Orders that need to be prepared for shipping.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Shipping Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockShipments
                      .filter((s) => s.status === "pending")
                      .map((shipment) => (
                        <TableRow key={shipment.orderId}>
                          <TableCell className="font-medium">
                            {shipment.orderId}
                          </TableCell>
                          <TableCell>{shipment.date}</TableCell>
                          <TableCell>{shipment.customer}</TableCell>
                          <TableCell>{shipment.shippingMethod}</TableCell>
                          <TableCell>
                            <ShippingStatusBadge status={shipment.status} />
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  View Order Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Printer className="mr-2 h-4 w-4" />
                                  Print Shipping Label
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Mark as Processing
                                </DropdownMenuItem>
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
          <TabsContent value="all" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>All Shipments</CardTitle>
                <CardDescription>
                  View and manage all shipments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Shipping Method</TableHead>
                      <TableHead>Tracking #</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockShipments.map((shipment) => (
                      <TableRow key={shipment.orderId}>
                        <TableCell className="font-medium">
                          {shipment.orderId}
                        </TableCell>
                        <TableCell>{shipment.date}</TableCell>
                        <TableCell>{shipment.customer}</TableCell>
                        <TableCell>{shipment.shippingMethod}</TableCell>
                        <TableCell>
                          {shipment.trackingNumber ? (
                            <div className="flex items-center">
                              <span className="mr-2">
                                {shipment.trackingNumber}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                              >
                                <Truck className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">
                              Not available
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <ShippingStatusBadge status={shipment.status} />
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                View Order Details
                              </DropdownMenuItem>
                              {shipment.status === "pending" && (
                                <>
                                  <DropdownMenuItem>
                                    <Printer className="mr-2 h-4 w-4" />
                                    Print Shipping Label
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Mark as Processing
                                  </DropdownMenuItem>
                                </>
                              )}
                              {shipment.status === "processing" && (
                                <DropdownMenuItem>
                                  Mark as Shipped
                                </DropdownMenuItem>
                              )}
                              {shipment.status === "shipped" && (
                                <DropdownMenuItem>
                                  Mark as Delivered
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
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Carriers</CardTitle>
            <CardDescription>
              Manage shipping carrier integrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockCarriers.map((carrier) => (
                <Card key={carrier.id} className="overflow-hidden">
                  <div className="p-6 flex items-center justify-center">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-center">{carrier.name}</h3>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                      {carrier.status}
                    </p>
                    <div className="mt-4 flex justify-center">
                      <Button size="sm">Configure</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

function ShippingStatusBadge({ status }: { status: string }) {
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
      default:
        return "outline";
    }
  };

  return <Badge variant={getVariant() as any}>{status}</Badge>;
}

const mockShipments = [
  {
    orderId: "ORD-1234",
    date: "2023-05-15",
    customer: "Emma Wilson",
    shippingMethod: "FedEx Express",
    trackingNumber: "FDX-123456789",
    status: "delivered",
  },
  {
    orderId: "ORD-1235",
    date: "2023-05-16",
    customer: "James Smith",
    shippingMethod: "UPS Ground",
    trackingNumber: "UPS-987654321",
    status: "shipped",
  },
  {
    orderId: "ORD-1236",
    date: "2023-05-16",
    customer: "Olivia Johnson",
    shippingMethod: "USPS Priority",
    trackingNumber: "USPS-456789123",
    status: "shipped",
  },
  {
    orderId: "ORD-1237",
    date: "2023-05-17",
    customer: "Noah Williams",
    shippingMethod: "DHL Express",
    trackingNumber: null,
    status: "processing",
  },
  {
    orderId: "ORD-1238",
    date: "2023-05-17",
    customer: "Sophia Brown",
    shippingMethod: "FedEx Ground",
    trackingNumber: null,
    status: "pending",
  },
  {
    orderId: "ORD-1239",
    date: "2023-05-18",
    customer: "Liam Davis",
    shippingMethod: "UPS Next Day Air",
    trackingNumber: null,
    status: "pending",
  },
];

const mockCarriers = [
  {
    id: "fedex",
    name: "FedEx",
    status: "Connected",
  },
  {
    id: "ups",
    name: "UPS",
    status: "Connected",
  },
  {
    id: "usps",
    name: "USPS",
    status: "Connected",
  },
  {
    id: "dhl",
    name: "DHL",
    status: "Not Connected",
  },
];
