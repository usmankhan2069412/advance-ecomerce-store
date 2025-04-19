"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash, Tag, X, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AttributeService, { Attribute, AttributeValue } from "@/services/attributeService";

/**
 * Product Attributes Management Page
 * Allows admins to manage product attributes like size, color, etc.
 */
export default function AttributesPage() {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [filteredAttributes, setFilteredAttributes] = useState<Attribute[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newAttribute, setNewAttribute] = useState({ name: "", description: "", values: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editAttribute, setEditAttribute] = useState({ name: "", description: "", values: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load attributes on component mount
  useEffect(() => {
    fetchAttributes();
  }, []);

  // Filter attributes when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAttributes(attributes);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = attributes.filter(attr => {
      // Check if name matches
      if (attr.name.toLowerCase().includes(query)) return true;

      // Check if description matches
      if (attr.description?.toLowerCase().includes(query)) return true;

      // Check if any value matches
      if (attr.values.some((val: any) => {
        if (typeof val === 'string') {
          return val.toLowerCase().includes(query);
        } else if (typeof val === 'object' && val.value) {
          return val.value.toLowerCase().includes(query);
        }
        return false;
      })) return true;

      return false;
    });

    setFilteredAttributes(filtered);
  }, [searchQuery, attributes]);

  /**
   * Fetch attributes from the service
   */
  const fetchAttributes = async () => {
    setIsLoading(true);
    try {
      const attributeService = AttributeService.getInstance();
      const data = await attributeService.getAttributes();
      setAttributes(data);
      setFilteredAttributes(data);
    } catch (error) {
      console.error('Error fetching attributes:', error);
      toast.error('Failed to load attributes');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle adding a new attribute
   */
  const handleAddAttribute = async () => {
    if (!newAttribute.name.trim() || !newAttribute.values.trim()) {
      toast.error('Name and values are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const attributeService = AttributeService.getInstance();
      const attributeData = {
        name: newAttribute.name.trim(),
        description: newAttribute.description.trim(),
        values: newAttribute.values.split(',').map(value => value.trim()),
        is_active: true
      };

      const createdAttribute = await attributeService.createAttribute(attributeData);

      // Update the attributes list
      setAttributes(prev => [...prev, createdAttribute]);

      // Reset form
      setNewAttribute({ name: "", description: "", values: "" });
      setIsAdding(false);

      toast.success('Attribute created successfully');
    } catch (error) {
      console.error('Error creating attribute:', error);
      toast.error('Failed to create attribute');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle editing an attribute
   */
  const handleEditAttribute = async () => {
    if (!isEditing) return;
    if (!editAttribute.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const attributeService = AttributeService.getInstance();
      const attributeData: Partial<Attribute> = {
        name: editAttribute.name.trim(),
        description: editAttribute.description.trim()
      };

      // Only include values if they were changed
      if (editAttribute.values) {
        attributeData.values = editAttribute.values.split(',').map(value => value.trim());
      }

      const updatedAttribute = await attributeService.updateAttribute(isEditing, attributeData);

      if (updatedAttribute) {
        // Update the attributes list
        setAttributes(prev => prev.map(attr =>
          attr.id === isEditing ? updatedAttribute : attr
        ));

        // Reset form
        setEditAttribute({ name: "", description: "", values: "" });
        setIsEditing(null);

        toast.success('Attribute updated successfully');
      } else {
        throw new Error('Failed to update attribute');
      }
    } catch (error) {
      console.error('Error updating attribute:', error);
      toast.error('Failed to update attribute');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Start editing an attribute
   */
  const startEditAttribute = (attribute: Attribute) => {
    setIsEditing(attribute.id);

    // Convert values to comma-separated string
    const valuesString = attribute.values.map((val: any) => {
      if (typeof val === 'string') return val;
      if (typeof val === 'object' && val.value) return val.value;
      return '';
    }).join(', ');

    setEditAttribute({
      name: attribute.name,
      description: attribute.description || '',
      values: valuesString
    });
  };

  /**
   * Handle deleting an attribute
   */
  const handleDeleteAttribute = async (id: string) => {
    if (!confirm("Are you sure you want to delete this attribute?")) return;

    try {
      const attributeService = AttributeService.getInstance();
      const success = await attributeService.deleteAttribute(id);

      if (success) {
        // Update the attributes list
        setAttributes(prev => prev.filter(attr => attr.id !== id));
        toast.success('Attribute deleted successfully');
      } else {
        throw new Error('Failed to delete attribute');
      }
    } catch (error) {
      console.error('Error deleting attribute:', error);
      toast.error('Failed to delete attribute');
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
          <Button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2"
            disabled={isAdding || isEditing !== null}
          >
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description (Optional)
                  </label>
                  <Textarea
                    id="description"
                    value={newAttribute.description}
                    onChange={(e) => setNewAttribute({ ...newAttribute, description: e.target.value })}
                    placeholder="Describe what this attribute is used for"
                    rows={3}
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
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAdding(false);
                      setNewAttribute({ name: "", description: "", values: "" });
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddAttribute}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>Add Attribute</>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Attribute Form */}
        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>Edit Attribute</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium mb-1">
                    Attribute Name
                  </label>
                  <Input
                    id="edit-name"
                    value={editAttribute.name}
                    onChange={(e) => setEditAttribute({ ...editAttribute, name: e.target.value })}
                    placeholder="e.g., Size, Color, Material"
                  />
                </div>
                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium mb-1">
                    Description (Optional)
                  </label>
                  <Textarea
                    id="edit-description"
                    value={editAttribute.description}
                    onChange={(e) => setEditAttribute({ ...editAttribute, description: e.target.value })}
                    placeholder="Describe what this attribute is used for"
                    rows={3}
                  />
                </div>
                <div>
                  <label htmlFor="edit-values" className="block text-sm font-medium mb-1">
                    Attribute Values
                  </label>
                  <Input
                    id="edit-values"
                    value={editAttribute.values}
                    onChange={(e) => setEditAttribute({ ...editAttribute, values: e.target.value })}
                    placeholder="Comma-separated values, e.g., Red, Blue, Green"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter values separated by commas
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(null);
                      setEditAttribute({ name: "", description: "", values: "" });
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEditAttribute}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
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
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading attributes...</span>
              </div>
            ) : filteredAttributes.length === 0 ? (
              <div className="text-center p-8">
                {searchQuery ? (
                  <>
                    <p className="text-lg font-medium">No attributes found</p>
                    <p className="text-muted-foreground">Try a different search term</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-medium">No attributes yet</p>
                    <p className="text-muted-foreground">Create your first attribute to get started</p>
                    <Button
                      onClick={() => setIsAdding(true)}
                      className="mt-4"
                      disabled={isAdding}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Attribute
                    </Button>
                  </>
                )}
              </div>
            ) : (
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
                    {filteredAttributes.map((attribute) => (
                      <tr key={attribute.id} className="border-b">
                        <td className="p-4 align-middle">
                          <div className="font-medium">{attribute.name}</div>
                          {attribute.description && (
                            <div className="text-sm text-muted-foreground mt-1">{attribute.description}</div>
                          )}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-wrap gap-1">
                            {attribute.values.map((value: any, index: number) => {
                              const valueText = typeof value === 'string' ? value : value.value;
                              return (
                                <span
                                  key={index}
                                  className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                                >
                                  {valueText}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          {attribute.product_count || 0}
                        </td>
                        <td className="p-4 align-middle text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEditAttribute(attribute)}
                              disabled={isEditing !== null || isAdding}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteAttribute(attribute.id)}
                              disabled={isEditing !== null || isAdding}
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
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}