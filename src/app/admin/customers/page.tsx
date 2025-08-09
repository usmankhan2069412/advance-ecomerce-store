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
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  MoreVertical,
  Mail,
  User,
  Lock,
  Trash2,
} from "lucide-react";

export default function CustomersPage() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Customer Management
          </h1>
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Email All Customers
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search customers..."
              className="pl-8 w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="">All Customers</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="new">New (Last 30 days)</option>
            </select>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>All Customers</CardTitle>
            <CardDescription>
              Manage your customer accounts and view their details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.name}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          customer.status === "active" ? "secondary" : "secondary" // Change "success" to "secondary"
                        }
                      >
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{customer.orders}</TableCell>
                    <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                    <TableCell>{customer.joined}</TableCell>
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
                              (window.location.href = `/admin/customers/${customer.id}`)
                            }
                          >
                            <User className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Lock className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          {customer.status === "active" ? (
                            <DropdownMenuItem>Disable Account</DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>Enable Account</DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>100</strong> customers
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Customers</span>
                  <span className="font-medium">1,245</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Active Customers
                  </span>
                  <span className="font-medium">1,180</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">New This Month</span>
                  <span className="font-medium">64</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average Orders</span>
                  <span className="font-medium">3.2</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCustomers.slice(0, 5).map((customer, index) => (
                  <div
                    key={customer.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-2">
                        {index + 1}
                      </div>
                      <span>{customer.name}</span>
                    </div>
                    <span className="font-medium">
                      ${customer.totalSpent.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Signups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCustomers
                  .sort(
                    (a, b) =>
                      new Date(b.joined).getTime() -
                      new Date(a.joined).getTime(),
                  )
                  .slice(0, 5)
                  .map((customer) => (
                    <div
                      key={customer.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {customer.email}
                        </p>
                      </div>
                      <span className="text-sm">{customer.joined}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
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
    status: "active",
    orders: 8,
    totalSpent: 3250.75,
    joined: "2023-01-15",
  },
  {
    id: 2,
    name: "James Smith",
    email: "james.smith@example.com",
    status: "active",
    orders: 5,
    totalSpent: 1890.5,
    joined: "2023-02-20",
  },
  {
    id: 3,
    name: "Olivia Johnson",
    email: "olivia.johnson@example.com",
    status: "active",
    orders: 12,
    totalSpent: 4780.25,
    joined: "2022-11-05",
  },
  {
    id: 4,
    name: "Noah Williams",
    email: "noah.williams@example.com",
    status: "inactive",
    orders: 3,
    totalSpent: 890.75,
    joined: "2023-03-10",
  },
  {
    id: 5,
    name: "Sophia Brown",
    email: "sophia.brown@example.com",
    status: "active",
    orders: 7,
    totalSpent: 2670.3,
    joined: "2022-12-18",
  },
  {
    id: 6,
    name: "Liam Davis",
    email: "liam.davis@example.com",
    status: "active",
    orders: 4,
    totalSpent: 1350.0,
    joined: "2023-04-05",
  },
  {
    id: 7,
    name: "Ava Miller",
    email: "ava.miller@example.com",
    status: "active",
    orders: 6,
    totalSpent: 2150.45,
    joined: "2023-01-30",
  },
  {
    id: 8,
    name: "Ethan Wilson",
    email: "ethan.wilson@example.com",
    status: "inactive",
    orders: 2,
    totalSpent: 750.2,
    joined: "2023-03-22",
  },
  {
    id: 9,
    name: "Isabella Taylor",
    email: "isabella.taylor@example.com",
    status: "active",
    orders: 9,
    totalSpent: 3450.6,
    joined: "2022-10-15",
  },
  {
    id: 10,
    name: "Mason Anderson",
    email: "mason.anderson@example.com",
    status: "active",
    orders: 5,
    totalSpent: 1950.8,
    joined: "2023-02-08",
  },
];
