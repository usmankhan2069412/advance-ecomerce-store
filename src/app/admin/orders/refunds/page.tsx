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
import { Search, Filter, MoreVertical, RefreshCw } from "lucide-react";

export default function RefundsPage() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Refund Management
          </h1>
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search refunds..."
              className="pl-8 w-full"
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
                {mockRefunds.map((refund) => (
                  <TableRow key={refund.id}>
                    <TableCell className="font-medium">{refund.id}</TableCell>
                    <TableCell>{refund.orderId}</TableCell>
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
                              (window.location.href = `/admin/orders/refunds/${refund.id}`)
                            }
                          >
                            View Details
                          </DropdownMenuItem>
                          {refund.status === "pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  console.log("Approve refund:", refund.id)
                                }
                              >
                                Approve Refund
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  console.log("Deny refund:", refund.id)
                                }
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Processed Refunds</CardTitle>
            <CardDescription>History of all processed refunds.</CardDescription>
          </CardHeader>
          <CardContent>
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
                {mockProcessedRefunds.map((refund) => (
                  <TableRow key={refund.id}>
                    <TableCell className="font-medium">{refund.id}</TableCell>
                    <TableCell>{refund.orderId}</TableCell>
                    <TableCell>{refund.dateProcessed}</TableCell>
                    <TableCell>{refund.customer}</TableCell>
                    <TableCell>${refund.amount.toFixed(2)}</TableCell>
                    <TableCell>{refund.processedBy}</TableCell>
                    <TableCell>
                      <RefundStatusBadge status={refund.status} />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
