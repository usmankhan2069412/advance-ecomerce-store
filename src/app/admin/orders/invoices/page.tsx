import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
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
} from "lucide-react";

export default function InvoicesPage() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Invoice Management
          </h1>
          <div className="flex space-x-2">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search invoices..."
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
            <CardTitle>All Invoices</CardTitle>
            <CardDescription>
              Manage all customer invoices in one place.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.orderId}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>{invoice.status}</TableCell>
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
                              (window.location.href = `/admin/orders/invoices/${invoice.id}`)
                            }
                          >
                            View Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="mr-2 h-4 w-4" />
                            Print Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem>Send to Customer</DropdownMenuItem>
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
          <CardHeader>
            <CardTitle>Invoice Templates</CardTitle>
            <CardDescription>Manage your invoice templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockTemplates.map((template) => (
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

const mockInvoices = [
  {
    id: "INV-1234",
    orderId: "ORD-1234",
    date: "2023-05-15",
    customer: "Emma Wilson",
    amount: 1368.49,
    status: "Paid",
  },
  {
    id: "INV-1235",
    orderId: "ORD-1235",
    date: "2023-05-16",
    customer: "James Smith",
    amount: 492.05,
    status: "Pending",
  },
  {
    id: "INV-1236",
    orderId: "ORD-1236",
    date: "2023-05-16",
    customer: "Olivia Johnson",
    amount: 852.47,
    status: "Paid",
  },
  {
    id: "INV-1237",
    orderId: "ORD-1237",
    date: "2023-05-17",
    customer: "Noah Williams",
    amount: 2061.92,
    status: "Pending",
  },
  {
    id: "INV-1238",
    orderId: "ORD-1238",
    date: "2023-05-17",
    customer: "Sophia Brown",
    amount: 730.63,
    status: "Canceled",
  },
];

const mockTemplates = [
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
