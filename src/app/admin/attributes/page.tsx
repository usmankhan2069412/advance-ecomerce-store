"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash, Tag } from "lucide-react";

/**
 * Product Attributes Management Page
 * Allows admins to manage product attributes like size, color, etc.
 */
export default function AttributesPage() {
  const [attributes, setAttributes] = useState<any[]>([]);
  const [newAttribute, setNewAttribute] = useState({ name: "", values: "" });
  const [isAdding, setIsAdding] = useState(false);

  // Load attributes from localStorage on component mount
  useEffect(() => {
    const storedAttributes = JSON.parse(localStorage.getItem('attributes') || '[]');
    if (storedAttributes.length === 0) {
      // Add some default attributes if none exist
      const defaultAttributes = [
        { 
          id: "attr_1", 
          name: "Size", 
          values: ["XS", "S", "M", "L", "XL", "XXL"],
          productCount: 15 
        },
        { 
          id: "attr_2", 
          name: "Color", 
          values: ["Red", "Blue", "Green", "Black", "White"],
          productCount: 20 
        },
        { 
          id: "attr_3", 
          name: "Material", 
          values: ["Cotton", "Polyester", "Wool", "Silk", "Linen"],
          productCount: 8 
        },
      ];
      localStorage.setItem('attributes', JSON.stringify(defaultAttributes));
      setAttributes(defaultAttributes);
    } else {
      setAttributes(storedAttributes);
    }
  }, []);

  /**
   * Handle adding a new attribute
   */
  const handleAddAttribute = () => {
    if (!newAttribute.name.trim() || !newAttribute.values.trim()) return;

    const newAttributeItem = {
      id: `attr_${Math.random().toString(36).substring(2, 10)}`,
      name: newAttribute.name,
      values: newAttribute.values.split(',').map(value => value.trim()),
      productCount: 0,
    };

    const updatedAttributes = [...attributes, newAttributeItem];
    setAttributes(updatedAttributes);
    localStorage.setItem('attributes', JSON.stringify(updatedAttributes));
    
    // Reset form
    setNewAttribute({ name: "", values: "" });
    setIsAdding(false);
  };

  /**
   * Handle deleting an attribute
   */
  const handleDeleteAttribute = (id: string) => {
    if (confirm("Are you sure you want to delete this attribute?")) {
      const updatedAttributes = attributes.filter(attribute => attribute.id !== id);
      setAttributes(updatedAttributes);
      localStorage.setItem('attributes', JSON.stringify(updatedAttributes));
    }
  };

  return (
    <AdminLayout>
      <div className="grid gap-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Product Attributes
            </h1>
            <p className="text-muted-foreground">
              Manage attributes like size, color, and material
            </p>
          </div>
          <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Attribute
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search attributes..."
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>

        {/* Add Attribute Form */}
        {isAdding && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Attribute</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Attribute Name
                  </label>
                  <Input
                    id="name"
                    value={newAttribute.name}
                    onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
                    placeholder="e.g., Size, Color, Material"
                  />
                </div>
                <div>
                  <label htmlFor="values" className="block text-sm font-medium mb-1">
                    Attribute Values
                  </label>
                  <Input
                    id="values"
                    value={newAttribute.values}
                    onChange={(e) => setNewAttribute({ ...newAttribute, values: e.target.value })}
                    placeholder="Comma-separated values, e.g., Red, Blue, Green"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter values separated by commas
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAdding(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAttribute}>
                    Save Attribute
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attributes List */}
        <Card>
          <CardHeader>
            <CardTitle>Attributes</CardTitle>
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
                      Values
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
                  {attributes.map((attribute) => (
                    <tr key={attribute.id} className="border-b">
                      <td className="p-4 align-middle font-medium">
                        {attribute.name}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-wrap gap-1">
                          {attribute.values.map((value: string, index: number) => (
                            <span 
                              key={index}
                              className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                            >
                              {value}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        {attribute.productCount}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleDeleteAttribute(attribute.id)}
                          >
                            <Trash className="h-4 w-4" />
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