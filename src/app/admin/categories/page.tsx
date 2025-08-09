"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash, ChevronRight } from "lucide-react";
import Link from "next/link";
import CategoryService from "@/services/categoryService";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Categories Management Page
 * Allows admins to manage product categories
 */
export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    type: ""
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryServiceInstance, setCategoryServiceInstance] = useState<CategoryService | null>(null);

  // Initialize CategoryService
  useEffect(() => {
    const initService = async () => {
      const instance = await CategoryService.getInstance();
      setCategoryServiceInstance(instance);
    };
    initService();
  }, []);

  // Load categories from Supabase on component mount
  useEffect(() => {
    if (categoryServiceInstance) {
      fetchCategories();
    }
  }, [categoryServiceInstance]);

  // Fetch categories from Supabase or fallback
  const fetchCategories = async () => {
    if (!categoryServiceInstance) return;

    try {
      const data = await categoryServiceInstance.public.getCategories();

      if (!data || data.length === 0) {
        console.log('No categories found or all categories have been deleted');
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // The categoryService.getCategories method should never throw now,
      // but just in case, we'll handle it gracefully
      setCategories([]);
      toast.error(`Failed to load categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  /**
   * Handle adding a new category
   */
  const handleAddCategory = async () => {
    if (!categoryServiceInstance) return;
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (!newCategory.type) {
      toast.error('Category type is required');
      return;
    }

    try {
      const createdCategory = await categoryServiceInstance.public.createCategory({
        name: newCategory.name.trim(),
        description: newCategory.description.trim(),
        type: newCategory.type.trim()
      });

      // Add the new category to the local state immediately
      // This ensures it shows up in the table right away
      setCategories(prevCategories => [
        ...prevCategories,
        {
          ...createdCategory,
          productCount: 0 // New categories have no products yet
        }
      ]);

      // Reset form
      setNewCategory({ name: "", description: "", type: "" });
      setIsAdding(false);

      toast.success(`Category "${createdCategory.name}" created successfully!`);

      // Also refresh the list to ensure everything is in sync
      // Use a small delay to ensure the UI updates first
      setTimeout(() => fetchCategories(), 500);
    } catch (error) {
      console.error('Error creating category:', error);
      // Display the specific error message from the service
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create category. Please try again.');
      }
    }
  };

  /**
   * Handle editing a category
   */
  const handleEditCategory = (category: any) => {
    setNewCategory({
      name: category.name,
      description: category.description || '',
      type: category.type || ''
    });
    setEditingCategoryId(category.id);
    setIsEditing(true);
    setIsAdding(false);
  };

  /**
   * Save edited category
   */
  const handleSaveEdit = async () => {
    if (!categoryServiceInstance || !editingCategoryId) return;
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const updatedCategory = await categoryServiceInstance.public.updateCategory(editingCategoryId, {
        name: newCategory.name.trim(),
        description: newCategory.description.trim(),
        type: newCategory.type.trim()
      });

      // Update the category in the local state
      setCategories(prevCategories =>
        prevCategories.map(cat =>
          cat.id === editingCategoryId ? { ...cat, ...updatedCategory } : cat
        )
      );

      // Reset form
      setNewCategory({ name: "", description: "", type: "" });
      setIsEditing(false);
      setEditingCategoryId(null);

      toast.success(`Category "${updatedCategory.name}" updated successfully!`);

      // Also refresh the list to ensure everything is in sync
      setTimeout(() => fetchCategories(), 500);
    } catch (error) {
      console.error('Error updating category:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to update category. Please try again.');
      }
    }
  };

  /**
   * Handle deleting a category
   */
  const handleDeleteCategory = async (id: string) => {
    if (!categoryServiceInstance) return;
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      // Get the category name for the success message
      const categoryToDelete = categories.find(cat => cat.id === id);
      const categoryName = categoryToDelete?.name || id;

      // Delete the category
      const success = await categoryServiceInstance.public.deleteCategory(id);

      if (success) {
        toast.success(`Category "${categoryName}" deleted successfully`);
        fetchCategories(); // Refresh the list
      } else {
        throw new Error('Unknown error occurred');
      }
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      toast.error(`Failed to delete category: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
                <div>
                  <label htmlFor="type" className="block text-sm font-medium mb-1">
                    Type
                  </label>
                  <Select
                    value={newCategory.type}
                    onValueChange={(value) => setNewCategory({ ...newCategory, type: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Man">Man</SelectItem>
                      <SelectItem value="Woman">Woman</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
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

        {/* Edit Category Form */}
        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>Edit Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium mb-1">
                    Category Name
                  </label>
                  <Input
                    id="edit-name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="e.g., Summer Collection"
                  />
                </div>
                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <Input
                    id="edit-description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    placeholder="Brief description of this category"
                  />
                </div>
                <div>
                  <label htmlFor="edit-type" className="block text-sm font-medium mb-1">
                    Type
                  </label>
                  <Select
                    value={newCategory.type}
                    onValueChange={(value) => setNewCategory({ ...newCategory, type: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Man">Man</SelectItem>
                      <SelectItem value="Woman">Woman</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {
                    setIsEditing(false);
                    setEditingCategoryId(null);
                    setNewCategory({ name: "", description: "", type: "" });
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit}>
                    Update Category
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
                      Type
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
                      <td className="p-4 align-middle text-muted-foreground">
                        {category.type || 'N/A'}
                      </td>
                      <td className="p-4 align-middle">
                        {category.productCount || 0}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditCategory(category)}
                          >
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