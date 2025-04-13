"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash, ChevronRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

/**
 * Categories Management Page
 * Allows admins to manage product categories
 */
export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryService, setCategoryService] = useState<any>(null);

  // Initialize the category service
  useEffect(() => {
    const initCategoryService = async () => {
      try {
        // Dynamically import to avoid SSR issues
        const { default: CategoryService } = await import(
          "@/services/categoryService"
        );
        const service = await CategoryService.getInstance();
        setCategoryService(service);
      } catch (error) {
        console.error("Failed to initialize category service:", error);
        toast.error(
          "Failed to connect to the database. Using local storage instead.",
        );
        // Set up a fallback service with localStorage
        setCategoryService({
          getCategories: async () => {
            const stored = localStorage.getItem("categories");
            return stored ? JSON.parse(stored) : [];
          },
          createCategory: async (category: any) => {
            const id = `local_${Date.now()}`;
            const newCat = { id, ...category, productCount: 0 };
            const stored = localStorage.getItem("categories");
            const cats = stored ? JSON.parse(stored) : [];
            cats.push(newCat);
            localStorage.setItem("categories", JSON.stringify(cats));
            return newCat;
          },
          deleteCategory: async (id: string) => {
            const stored = localStorage.getItem("categories");
            if (stored) {
              const cats = JSON.parse(stored).filter((c: any) => c.id !== id);
              localStorage.setItem("categories", JSON.stringify(cats));
            }
            return true;
          },
        });
      } finally {
        // Fetch categories after service initialization
        fetchCategories();
      }
    };

    initCategoryService();
  }, []);

  // Fetch categories from Supabase or fallback
  const fetchCategories = async () => {
    if (!categoryService) return;

    try {
      setIsLoading(true);
      const data = await categoryService.getCategories();

      if (!data || data.length === 0) {
        console.log("No categories found or all categories have been deleted");
      }

      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
      toast.error(
        `Failed to load categories: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle adding a new category
   */
  const handleAddCategory = async () => {
    if (!categoryService) {
      toast.error("Service not initialized");
      return;
    }

    if (!newCategory.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const createdCategory = await categoryService.createCategory({
        name: newCategory.name.trim(),
        description: newCategory.description.trim(),
      });

      // Add the new category to the local state immediately
      setCategories((prevCategories) => [
        ...prevCategories,
        {
          ...createdCategory,
          productCount: 0, // New categories have no products yet
        },
      ]);

      // Reset form
      setNewCategory({ name: "", description: "" });
      setIsAdding(false);

      toast.success(`Category "${createdCategory.name}" created successfully!`);

      // Also refresh the list to ensure everything is in sync
      setTimeout(() => fetchCategories(), 500);
    } catch (error) {
      console.error("Error creating category:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create category. Please try again.");
      }
    }
  };

  /**
   * Handle deleting a category
   */
  const handleDeleteCategory = async (id: string) => {
    if (!categoryService) {
      toast.error("Service not initialized");
      return;
    }

    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      // Get the category name for the success message
      const categoryToDelete = categories.find((cat) => cat.id === id);
      const categoryName = categoryToDelete?.name || id;

      // Delete the category
      const success = await categoryService.deleteCategory(id);

      if (success) {
        toast.success(`Category "${categoryName}" deleted successfully`);
        fetchCategories(); // Refresh the list
      } else {
        throw new Error("Unknown error occurred");
      }
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      toast.error(
        `Failed to delete category: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
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
          <Button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2"
          >
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
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                  >
                    Category Name
                  </label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    placeholder="e.g., Summer Collection"
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium mb-1"
                  >
                    Description
                  </label>
                  <Input
                    id="description"
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                      })
                    }
                    placeholder="Brief description of this category"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAdding(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCategory}>Save Category</Button>
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
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4">
                        Loading categories...
                      </td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4">
                        No categories found
                      </td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <tr key={category.id} className="border-b">
                        <td className="p-4 align-middle font-medium">
                          {category.name}
                        </td>
                        <td className="p-4 align-middle text-muted-foreground">
                          {category.description}
                        </td>
                        <td className="p-4 align-middle">
                          {category.productCount || 0}
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
                              <Link
                                href={`/admin/products?category=${category.id}`}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
