import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, ChevronRight } from "lucide-react";

export default function CategoriesManagement() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Categories & Tags
            </h1>
            <p className="text-muted-foreground">
              Organize your products with categories and tags
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories list */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Product Categories</CardTitle>
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search categories..."
                    className="pl-8 w-full"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium text-xs">
                          Name
                        </th>
                        <th className="p-2 text-left font-medium text-xs hidden md:table-cell">
                          Description
                        </th>
                        <th className="p-2 text-left font-medium text-xs">
                          Products
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
                          name: "Dresses",
                          description: "Elegant dresses for all occasions",
                          products: 24,
                          subcategories: [
                            { id: 101, name: "Evening Gowns", products: 8 },
                            { id: 102, name: "Casual Dresses", products: 16 },
                          ],
                        },
                        {
                          id: 2,
                          name: "Outerwear",
                          description: "Jackets, coats and outdoor apparel",
                          products: 18,
                        },
                        {
                          id: 3,
                          name: "Accessories",
                          description: "Bags, scarves, jewelry and more",
                          products: 42,
                          subcategories: [
                            { id: 301, name: "Bags", products: 15 },
                            { id: 302, name: "Jewelry", products: 27 },
                          ],
                        },
                        {
                          id: 4,
                          name: "Footwear",
                          description: "Shoes, boots and sandals",
                          products: 16,
                        },
                        {
                          id: 5,
                          name: "Tops",
                          description: "Blouses, shirts and tops",
                          products: 31,
                        },
                      ].map((category) => (
                        <React.Fragment key={category.id}>
                          <tr className="border-b hover:bg-muted/50">
                            <td className="p-2 font-medium">{category.name}</td>
                            <td className="p-2 text-muted-foreground hidden md:table-cell">
                              {category.description}
                            </td>
                            <td className="p-2">{category.products}</td>
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                {category.subcategories && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                          {category.subcategories?.map((sub) => (
                            <tr
                              key={sub.id}
                              className="border-b hover:bg-muted/50 bg-muted/20"
                            >
                              <td className="p-2 pl-6 font-medium text-sm">
                                <div className="flex items-center">
                                  <span className="text-muted-foreground mr-2">
                                    └
                                  </span>
                                  {sub.name}
                                </div>
                              </td>
                              <td className="p-2 text-muted-foreground hidden md:table-cell"></td>
                              <td className="p-2">{sub.products}</td>
                              <td className="p-2">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-500"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add/Edit Category Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Add New Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input id="category-name" placeholder="Enter category name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-description">Description</Label>
                  <Textarea
                    id="category-description"
                    placeholder="Enter category description"
                    className="min-h-20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parent-category">
                    Parent Category (Optional)
                  </Label>
                  <select
                    id="parent-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">None (Top Level Category)</option>
                    <option value="1">Dresses</option>
                    <option value="2">Outerwear</option>
                    <option value="3">Accessories</option>
                    <option value="4">Footwear</option>
                    <option value="5">Tops</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-image">
                    Category Image (Optional)
                  </Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <Button variant="outline" size="sm">
                      Upload Image
                    </Button>
                  </div>
                </div>
                <div className="pt-4">
                  <Button className="w-full">Save Category</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {[
                    "Luxury",
                    "Sustainable",
                    "Limited Edition",
                    "New Arrival",
                    "Sale",
                    "Bestseller",
                    "AI-Generated",
                    "Handcrafted",
                  ].map((tag) => (
                    <div
                      key={tag}
                      className="bg-muted rounded-full px-3 py-1 text-sm flex items-center gap-1 group"
                    >
                      {tag}
                      <button className="opacity-50 hover:opacity-100">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Add new tag" />
                  <Button variant="outline" size="sm">
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
