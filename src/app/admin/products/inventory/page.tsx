"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Upload, AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { productService } from "@/services/productService";
import CategoryService from "@/services/categoryService";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define an interface for the inventory updates state
interface InventoryUpdates {
  [productId: string]: number | string; // Allow string temporarily for input handling
}

export default function InventoryManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [inventoryUpdates, setInventoryUpdates] = useState<InventoryUpdates>({});
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkUpdateValue, setBulkUpdateValue] = useState<string>("");
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
      // Initialize inventoryUpdates with current values
      const initialUpdates: InventoryUpdates = {};
      data.forEach(p => {
        initialUpdates[p.id as string] = p.inventory ?? 0;
      });
      setInventoryUpdates(initialUpdates);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoryServiceInstance = await CategoryService.getInstance();
      const categoriesData = await categoryServiceInstance.public.getCategories();
      // Store both id and name for each category
      const formattedCategories = categoriesData.map((cat: any) => ({
        id: cat.id,
        name: cat.name
      }));
      setCategories(formattedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error("Failed to load categories");
    }
  };

  // Inventory summary
  const totalProducts = products.length;
  const inStock = products.filter(p => p.inventory > 10).length;
  const lowStock = products.filter(p => p.inventory > 0 && p.inventory <= 10).length;
  const outOfStock = products.filter(p => !p.inventory || p.inventory === 0).length;

  // Filtering
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    if (sortBy === "stock-asc") return (a.inventory ?? 0) - (b.inventory ?? 0);
    if (sortBy === "stock-desc") return (b.inventory ?? 0) - (a.inventory ?? 0);
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

  // Tab filtering
  const getTabProducts = (tab: string) => {
    if (tab === "all") return paginatedProducts;
    if (tab === "in-stock") return paginatedProducts.filter(p => p.inventory > 10);
    if (tab === "low-stock") return paginatedProducts.filter(p => p.inventory > 0 && p.inventory <= 10);
    if (tab === "out-of-stock") return paginatedProducts.filter(p => !p.inventory || p.inventory === 0);
    return paginatedProducts;
  };

  // Inventory status helper
  const getStatus = (inv: number) => {
    if (!inv || inv === 0) return "Out of Stock";
    if (inv <= 10) return "Low Stock";
    return "In Stock";
  };

  // Handle inventory input change
  const handleInventoryChange = (productId: string, value: string) => {
    setInventoryUpdates(prev => ({
      ...prev,
      [productId]: value // Keep as string until update
    }));
  };

  // Handle inventory update
  const handleUpdateInventory = async (productId: string) => {
    const newInventoryValue = inventoryUpdates[productId];
    const newInventory = parseInt(String(newInventoryValue), 10);

    if (isNaN(newInventory) || newInventory < 0) {
      toast.error("Invalid inventory value. Please enter a non-negative number.");
      // Optionally reset the input to the original value
      const originalProduct = products.find(p => p.id === productId);
      if (originalProduct) {
        setInventoryUpdates(prev => ({ ...prev, [productId]: originalProduct.inventory ?? 0 }));
      }
      return;
    }

    setUpdatingProductId(productId);
    try {
      // Assuming productService.updateProduct can handle partial updates
      // You might need to adjust this based on your actual service implementation
      await productService.updateProduct(productId, { inventory: newInventory });
      toast.success("Inventory updated successfully!");
      // Refresh products list to show updated data and status
      await fetchProducts();
    } catch (error) {
      console.error("Failed to update inventory:", error);
      toast.error("Failed to update inventory.");
      // Optionally revert the input change on error
      const originalProduct = products.find(p => p.id === productId);
       if (originalProduct) {
        setInventoryUpdates(prev => ({ ...prev, [productId]: originalProduct.inventory ?? 0 }));
      }
    } finally {
      setUpdatingProductId(null);
    }
  };

  // Handle product selection for bulk update
  const handleProductSelection = (productId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  // Handle bulk inventory update
  const handleBulkUpdate = async () => {
    const newInventory = parseInt(bulkUpdateValue, 10);

    if (isNaN(newInventory) || newInventory < 0) {
      toast.error("Invalid inventory value. Please enter a non-negative number.");
      return;
    }

    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product to update.");
      return;
    }

    setIsBulkUpdating(true);
    try {
      // Update each selected product
      const updatePromises = selectedProducts.map(productId =>
        productService.updateProduct(productId, { inventory: newInventory })
      );

      await Promise.all(updatePromises);

      toast.success(`Updated inventory for ${selectedProducts.length} products!`);
      // Clear selections and refresh products
      setSelectedProducts([]);
      setBulkUpdateValue("");
      await fetchProducts();
    } catch (error) {
      console.error("Failed to bulk update inventory:", error);
      toast.error("Failed to update inventory for some products.");
    } finally {
      setIsBulkUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="grid gap-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
            <p className="text-muted-foreground">Track and update your product inventory</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />Import
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />Export
            </Button>
            <Button onClick={fetchProducts}>Update Inventory</Button>
          </div>
        </div>{/* Inventory Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardContent className="p-6"><div className="flex flex-col space-y-2"><p className="text-sm font-medium text-muted-foreground">Total Products</p><h3 className="text-2xl font-bold">{loading ? "-" : totalProducts}</h3></div></CardContent></Card>
          <Card><CardContent className="p-6"><div className="flex flex-col space-y-2"><p className="text-sm font-medium text-muted-foreground">In Stock</p><h3 className="text-2xl font-bold">{loading ? "-" : inStock}</h3></div></CardContent></Card>
          <Card><CardContent className="p-6"><div className="flex flex-col space-y-2"><p className="text-sm font-medium text-muted-foreground">Low Stock</p><h3 className="text-2xl font-bold text-amber-500">{loading ? "-" : lowStock}</h3></div></CardContent></Card>
          <Card><CardContent className="p-6"><div className="flex flex-col space-y-2"><p className="text-sm font-medium text-muted-foreground">Out of Stock</p><h3 className="text-2xl font-bold text-red-500">{loading ? "-" : outOfStock}</h3></div></CardContent></Card>
        </div>
        {/* Search and filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search products..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2"><Filter className="h-4 w-4" />Filters</Button>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by: Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Sort by: Default</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="stock-asc">Stock (Low to High)</SelectItem>
                    <SelectItem value="stock-desc">Stock (High to Low)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card> {/* Inventory Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="in-stock">In Stock</TabsTrigger>
            <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
            <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
          </TabsList>
          {["all","in-stock","low-stock","out-of-stock"].map(tab => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              <Card>
                <CardHeader className="py-4">
                  <div className="flex justify-between items-center">
                    <CardTitle>{tab === "all" ? "All Products" : tab === "in-stock" ? "In Stock Products" : tab === "low-stock" ? "Low Stock Products" : "Out of Stock Products"}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {loading ? "Loading..." : `Showing ${startIndex + 1}-${Math.min(startIndex + productsPerPage, getTabProducts(tab).length)} of ${getTabProducts(tab).length} products`}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="border rounded-md overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-2 text-left font-medium text-xs w-10">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300"
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const currentTabProductIds = getTabProducts(tab).map(p => p.id);
                                if (isChecked) {
                                  setSelectedProducts(prev => [...new Set([...prev, ...currentTabProductIds])]);
                                } else {
                                  setSelectedProducts(prev => prev.filter(id => !currentTabProductIds.includes(id)));
                                }
                              }}
                              checked={getTabProducts(tab).length > 0 && getTabProducts(tab).every(p => selectedProducts.includes(p.id))}
                            />
                          </th>
                          <th className="p-2 text-left font-medium text-xs">Product</th>
                          <th className="p-2 text-left font-medium text-xs hidden md:table-cell">SKU</th>
                          <th className="p-2 text-left font-medium text-xs hidden md:table-cell">Category</th>
                          <th className="p-2 text-left font-medium text-xs">Stock</th>
                          <th className="p-2 text-left font-medium text-xs">Status</th>
                          <th className="p-2 text-left font-medium text-xs">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr><td colSpan={7} className="p-4 text-center text-muted-foreground">Loading products...</td></tr>
                        ) : getTabProducts(tab).length > 0 ? (
                          getTabProducts(tab).map(product => (
                            <tr key={product.id} className="border-b hover:bg-muted/50">
                              <td className="p-2">
                                <input
                                  type="checkbox"
                                  className="rounded border-gray-300"
                                  checked={selectedProducts.includes(product.id)}
                                  onChange={(e) => handleProductSelection(product.id, e.target.checked)}
                                />
                              </td>
                              <td className="p-2 font-medium">{product.name}</td>
                              <td className="p-2 text-muted-foreground hidden md:table-cell">{product.sku}</td>
                              <td className="p-2 text-muted-foreground hidden md:table-cell">{product.category_name || 'Uncategorized'}</td>
                              <td className="p-2">
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    value={inventoryUpdates[product.id] ?? ''} // Use state value
                                    onChange={(e) => handleInventoryChange(product.id, e.target.value)}
                                    className="w-20 h-8 text-center"
                                    min="0" // Prevent negative numbers in input
                                    disabled={updatingProductId === product.id} // Disable while updating this specific product
                                  />
                                  {getStatus(product.inventory) === "Low Stock" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                                </div>
                              </td>
                              <td className="p-2">
                                <Badge className={getStatus(product.inventory) === "In Stock" ? "bg-green-100 text-green-800 hover:bg-green-100" : getStatus(product.inventory) === "Low Stock" ? "bg-amber-100 text-amber-800 hover:bg-amber-100" : "bg-red-100 text-red-800 hover:bg-red-100"}>{getStatus(product.inventory)}</Badge>
                              </td>
                              <td className="p-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUpdateInventory(product.id)}
                                  disabled={updatingProductId === product.id || String(inventoryUpdates[product.id] ?? '') === String(product.inventory ?? 0)} // Disable if updating or value hasn't changed
                                >
                                  {updatingProductId === product.id ? 'Updating...' : 'Update'}
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={7} className="p-4 text-center text-muted-foreground">No products found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}>Previous</Button>
                    <div className="text-sm text-muted-foreground">Page {currentPage} of {Math.max(1, totalPages)}</div>
                    <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}>Next</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
        {/* Bulk Update Section */}
        <Card>
          <CardHeader>
            <CardTitle>Bulk Inventory Update</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Update inventory levels for multiple products at once. {selectedProducts.length > 0 &&
                  `${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''} selected.`
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="w-full max-w-xs">
                  <Label htmlFor="bulk-inventory" className="block text-sm font-medium mb-1">
                    Set Inventory Level
                  </Label>
                  <Input
                    id="bulk-inventory"
                    type="number"
                    min="0"
                    value={bulkUpdateValue}
                    onChange={(e) => setBulkUpdateValue(e.target.value)}
                    placeholder="Enter quantity"
                    className="w-full"
                  />
                </div>
                <Button
                  onClick={handleBulkUpdate}
                  disabled={isBulkUpdating || selectedProducts.length === 0 || !bulkUpdateValue.trim()}
                  className="whitespace-nowrap"
                >
                  {isBulkUpdating ? 'Updating...' : 'Update Selected'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedProducts([])}
                  disabled={selectedProducts.length === 0}
                  className="whitespace-nowrap"
                >
                  Clear Selection
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button variant="outline" className="flex items-center gap-2" disabled>
                  <Upload className="h-4 w-4" />Upload CSV
                </Button>
                <Button variant="outline" disabled>Download Template</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
