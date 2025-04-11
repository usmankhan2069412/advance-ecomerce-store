import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Upload, AlertTriangle } from "lucide-react";

export default function InventoryManagement() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Inventory Management
            </h1>
            <p className="text-muted-foreground">
              Track and update your product inventory
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button>Update Inventory</Button>
          </div>
        </div>

        {/* Inventory Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Products
                </p>
                <h3 className="text-2xl font-bold">143</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  In Stock
                </p>
                <h3 className="text-2xl font-bold">112</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Low Stock
                </p>
                <h3 className="text-2xl font-bold text-amber-500">18</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Out of Stock
                </p>
                <h3 className="text-2xl font-bold text-red-500">13</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="">All Categories</option>
                  <option value="dresses">Dresses</option>
                  <option value="outerwear">Outerwear</option>
                  <option value="accessories">Accessories</option>
                  <option value="footwear">Footwear</option>
                </select>
              </div>
              <div className="flex justify-end">
                <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="">Sort by: Default</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="stock-asc">Stock (Low to High)</option>
                  <option value="stock-desc">Stock (High to Low)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="in-stock">In Stock</TabsTrigger>
            <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
            <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="py-4">
                <div className="flex justify-between items-center">
                  <CardTitle>All Products</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Showing 1-10 of 143 products
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium text-xs">
                          Product
                        </th>
                        <th className="p-2 text-left font-medium text-xs hidden md:table-cell">
                          SKU
                        </th>
                        <th className="p-2 text-left font-medium text-xs hidden md:table-cell">
                          Category
                        </th>
                        <th className="p-2 text-left font-medium text-xs">
                          Stock
                        </th>
                        <th className="p-2 text-left font-medium text-xs">
                          Status
                        </th>
                        <th className="p-2 text-left font-medium text-xs">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          id: 1,
                          name: "Neural Couture Dress",
                          sku: "NC-001",
                          category: "Dresses",
                          stock: 24,
                          status: "In Stock",
                        },
                        {
                          id: 2,
                          name: "Ethereal Silk Gown",
                          sku: "ESG-002",
                          category: "Gowns",
                          stock: 8,
                          status: "Low Stock",
                        },
                        {
                          id: 3,
                          name: "Quantum Leather Jacket",
                          sku: "QLJ-003",
                          category: "Outerwear",
                          stock: 0,
                          status: "Out of Stock",
                        },
                        {
                          id: 4,
                          name: "Digital Weave Scarf",
                          sku: "DWS-004",
                          category: "Accessories",
                          stock: 42,
                          status: "In Stock",
                        },
                        {
                          id: 5,
                          name: "Holographic Heels",
                          sku: "HH-005",
                          category: "Footwear",
                          stock: 6,
                          status: "Low Stock",
                        },
                        {
                          id: 6,
                          name: "Neon Pulse Sneakers",
                          sku: "NPS-006",
                          category: "Footwear",
                          stock: 0,
                          status: "Out of Stock",
                        },
                        {
                          id: 7,
                          name: "Cybernetic Sunglasses",
                          sku: "CS-007",
                          category: "Accessories",
                          stock: 15,
                          status: "In Stock",
                        },
                      ].map((product) => (
                        <tr
                          key={product.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-2 font-medium">{product.name}</td>
                          <td className="p-2 text-muted-foreground hidden md:table-cell">
                            {product.sku}
                          </td>
                          <td className="p-2 text-muted-foreground hidden md:table-cell">
                            {product.category}
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                defaultValue={product.stock}
                                className="w-20 h-8 text-center"
                              />
                              {product.status === "Low Stock" && (
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                              )}
                            </div>
                          </td>
                          <td className="p-2">
                            <Badge
                              className={`${
                                product.status === "In Stock"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : product.status === "Low Stock"
                                    ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                    : "bg-red-100 text-red-800 hover:bg-red-100"
                              }`}
                            >
                              {product.status}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <Button variant="outline" size="sm">
                              Update
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Page 1 of 15
                  </div>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="in-stock" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>In Stock Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Products with sufficient inventory levels.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="low-stock" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Products with inventory levels below the threshold.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="out-of-stock" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Out of Stock Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Products with zero inventory that need restocking.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bulk Update Section */}
        <Card>
          <CardHeader>
            <CardTitle>Bulk Inventory Update</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Update inventory levels for multiple products at once by
                uploading a CSV file or using the bulk edit tool.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload CSV
                </Button>
                <Button variant="outline">Download Template</Button>
                <Button>Bulk Edit Selected</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
