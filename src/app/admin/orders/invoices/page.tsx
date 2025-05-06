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
  Download,
  Printer,
  RefreshCw,
  Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

interface Invoice {
  id: string;
  orderId: string;
  orderNumber: string;
  date: string;
  customer: string;
  amount: number;
  status: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
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

        // Transform orders into invoices
        const transformedInvoices = data.map((order: Order) => ({
          id: `INV-${order.order_number.replace('ORD-', '')}`,
          orderId: order.id,
          orderNumber: order.order_number,
          date: new Date(order.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          customer: order.shipping_address.fullName,
          amount: order.total_amount,
          status: order.payment_status === 'paid' ? 'Paid' : 'Pending',
        }));

        setInvoices(transformedInvoices);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'An error occurred while fetching orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter invoices based on search query
  const filteredInvoices = invoices.filter(invoice =>
    invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Invoice ${invoiceId} downloaded successfully`);
  };

  const handlePrintInvoice = (invoiceId: string) => {
    toast.success(`Preparing to print invoice ${invoiceId}`);
  };

  const handleSendInvoice = (invoiceId: string, customer: string) => {
    toast.success(`Invoice ${invoiceId} sent to ${customer}`);
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
        // Transform orders into invoices
        const transformedInvoices = data.map((order: Order) => ({
          id: `INV-${order.order_number.replace('ORD-', '')}`,
          orderId: order.id,
          orderNumber: order.order_number,
          date: new Date(order.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          customer: order.shipping_address.fullName,
          amount: order.total_amount,
          status: order.payment_status === 'paid' ? 'Paid' : 'Pending',
        }));

        setInvoices(transformedInvoices);
        toast.success('Invoices refreshed successfully');
      })
      .catch(err => {
        console.error('Error refreshing orders:', err);
        toast.error('Failed to refresh invoices');
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
            Invoice Management
          </h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by invoice #, order #, or customer..."
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
            <CardTitle>All Invoices</CardTitle>
            <CardDescription>
              Manage all customer invoices in one place.
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
            ) : filteredInvoices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No invoices match your search' : 'No invoices found'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Order #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.orderNumber}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.customer}</TableCell>
                      <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            invoice.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {invoice.status}
                        </Badge>
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
                                (window.location.href = `/admin/orders/invoices/${invoice.orderNumber}`)
                              }
                            >
                              View Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadInvoice(invoice.id)}>
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePrintInvoice(invoice.id)}>
                              <Printer className="mr-2 h-4 w-4" />
                              Print Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendInvoice(invoice.id, invoice.customer)}>
                              <Mail className="mr-2 h-4 w-4" />
                              Send to Customer
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

        <Card>
          <CardHeader>
            <CardTitle>Invoice Templates</CardTitle>
            <CardDescription>Manage your invoice templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {invoiceTemplates.map((template) => (
                <Card key={template.id} className="overflow-hidden">
                  <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                    <div className="mt-4 flex justify-between">
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                      <Button size="sm">Use Template</Button>
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

const invoiceTemplates = [
  {
    id: "TEMP-1",
    name: "Standard Invoice",
    description: "Default invoice template with company branding",
  },
  {
    id: "TEMP-2",
    name: "Luxury Template",
    description: "Premium design for high-end purchases",
  },
  {
    id: "TEMP-3",
    name: "Minimal Design",
    description: "Clean, simple layout focusing on essential information",
  },
];


