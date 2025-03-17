import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, Filter, Upload, Archive, Tag } from "lucide-react";

export default function ProductsManagement() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Product Management
            </h1>
            <p className="text-muted-foreground">
              Manage your product catalog, inventory, and categories
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import
            </Button>
          </div>
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
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Tag className="h-4 w-4" />
                  Categories
                </Button>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Archive className="h-4 w-4" />
                  View Archived
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Management Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md mb-4">
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
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
                        <th className="p-2 text-left font-medium text-xs w-10">
                          <Checkbox id="select-all" />
                        </th>
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
                          Price
                        </th>
                        <th className="p-2 text-left font-medium text-xs hidden md:table-cell">
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
                          price: "$1,299.99",
                          stock: 24,
                          status: "Active",
                        },
                        {
                          id: 2,
                          name: "Ethereal Silk Gown",
                          sku: "ESG-002",
                          category: "Gowns",
                          price: "$2,499.99",
                          stock: 8,
                          status: "Active",
                        },
                        {
                          id: 3,
                          name: "Quantum Leather Jacket",
                          sku: "QLJ-003",
                          category: "Outerwear",
                          price: "$899.99",
                          stock: 0,
                          status: "Out of Stock",
                        },
                        {
                          id: 4,
                          name: "Digital Weave Scarf",
                          sku: "DWS-004",
                          category: "Accessories",
                          price: "$349.99",
                          stock: 42,
                          status: "Active",
                        },
                        {
                          id: 5,
                          name: "Holographic Heels",
                          sku: "HH-005",
                          category: "Footwear",
                          price: "$799.99",
                          stock: 16,
                          status: "Active",
                        },
                      ].map((product) => (
                        <tr
                          key={product.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="p-2">
                            <Checkbox id={`select-${product.id}`} />
                          </td>
                          <td className="p-2 font-medium">{product.name}</td>
                          <td className="p-2 text-muted-foreground hidden md:table-cell">
                            {product.sku}
                          </td>
                          <td className="p-2 text-muted-foreground hidden md:table-cell">
                            {product.category}
                          </td>
                          <td className="p-2">{product.price}</td>
                          <td className="p-2 hidden md:table-cell">
                            <span
                              className={
                                product.stock === 0
                                  ? "text-red-500"
                                  : product.stock < 10
                                    ? "text-amber-500"
                                    : "text-green-500"
                              }
                            >
                              {product.stock}
                            </span>
                          </td>
                          <td className="p-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${product.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                            >
                              {product.status}
                            </span>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500"
                              >
                                Delete
                              </Button>
                            </div>
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

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Showing only active products that are currently available for
                  purchase.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Draft Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Products that are saved but not yet published to your store.
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
                  Products that are currently unavailable due to zero inventory.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
