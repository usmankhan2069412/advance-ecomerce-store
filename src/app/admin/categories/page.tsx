"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash, ChevronRight } from "lucide-react";
import Link from "next/link";

/**
 * Categories Management Page
 * Allows admins to manage product categories
 */
export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [isAdding, setIsAdding] = useState(false);

  // Load categories from localStorage on component mount
  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem('categories') || '[]');
    if (storedCategories.length === 0) {
      // Add some default categories if none exist
      const defaultCategories = [
        { id: "cat_1", name: "Clothing", description: "All clothing items", productCount: 12 },
        { id: "cat_2", name: "Accessories", description: "Bags, jewelry, and more", productCount: 8 },
        { id: "cat_3", name: "Footwear", description: "Shoes, boots, and sandals", productCount: 5 },
      ];
      localStorage.setItem('categories', JSON.stringify(defaultCategories));
      setCategories(defaultCategories);
    } else {
      setCategories(storedCategories);
    }
  }, []);

  /**
   * Handle adding a new category
   */
  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;

    const newCategoryItem = {
      id: `cat_${Math.random().toString(36).substring(2, 10)}`,
      name: newCategory.name,
      description: newCategory.description,
      productCount: 0,
    };

    const updatedCategories = [...categories, newCategoryItem];
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    
    // Reset form
    setNewCategory({ name: "", description: "" });
    setIsAdding(false);
  };

  /**
   * Handle deleting a category
   */
  const handleDeleteCategory = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      const updatedCategories = categories.filter(category => category.id !== id);
      setCategories(updatedCategories);
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
    }
  };

  return (
    <AdminLayout>
      <div className="grid gap-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Category Management
            </h1>
            <p className="text-muted-foreground">
              Organize your products with categories
            </p>
          </div>
          <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search categories..."
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>

        {/* Add Category Form */}
        {isAdding && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Category Name
                  </label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="e.g., Summer Collection"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <Input
                    id="description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    placeholder="Brief description of this category"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAdding(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCategory}>
                    Save Category
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Categories List */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Description
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Products
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b">
                      <td className="p-4 align-middle font-medium">
                        {category.name}
                      </td>
                      <td className="p-4 align-middle text-muted-foreground">
                        {category.description}
                      </td>
                      <td className="p-4 align-middle">
                        {category.productCount}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/admin/products?category=${category.id}`}>
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
} 