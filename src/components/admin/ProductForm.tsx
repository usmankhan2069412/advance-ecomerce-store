"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, X, Upload, Plus, Trash } from "lucide-react";
import Image from "next/image";

/**
 * Product form interface
 */
interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

/**
 * Product form data structure
 */
export interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  inventory: number;
  sku: string;
  aiMatchScore?: number;
  aiRecommendationReason?: string;
}

/**
 * ProductForm component for creating and editing products
 * @param initialData - Initial product data for editing (optional)
 * @param onSubmit - Function to handle form submission
 * @param onCancel - Function to handle cancellation
 */
const ProductForm = ({ initialData, onSubmit, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
      name: "",
      description: "",
      price: 0,
      compareAtPrice: undefined,
      images: [],
      category: "",
      tags: [],
      inventory: 0,
      sku: "",
      aiMatchScore: 0,
      aiRecommendationReason: "",
    }
  );
  
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  /**
   * Handle input change for form fields
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle numeric inputs
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? '' : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  /**
   * Add a new tag to the product
   */
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };
  
  /**
   * Remove a tag from the product
   */
  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  /**
   * Handle image upload
   */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, you would upload to a server
    // For demo, we'll use a data URL
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      setImagePreview(imageUrl);
      
      // Add to images array
      setFormData({
        ...formData,
        images: [...formData.images, imageUrl]
      });
    };
    reader.readAsDataURL(file);
    
    // Reset the input
    e.target.value = '';
  };
  
  /**
   * Remove an image from the product
   */
  const removeImage = (imageToRemove: string) => {
    setFormData({
      ...formData,
      images: formData.images.filter(image => image !== imageToRemove)
    });
  };
  
  /**
   * Validate the form before submission
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than zero';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }
    
    if (formData.inventory < 0) {
      newErrors.inventory = 'Inventory cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Product Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              
              <div>
                <Label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>
            </div>
          </div>
          
          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pricing</h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Price ($)
                </Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
              </div>
              
              <div>
                <Label htmlFor="compareAtPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Compare at Price ($)
                </Label>
                <Input
                  type="number"
                  id="compareAtPrice"
                  name="compareAtPrice"
                  min="0"
                  step="0.01"
                  value={formData.compareAtPrice || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Images</h3>
            
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-md border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="h-full w-full rounded-md object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(image)}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              <div className="flex aspect-square items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <label htmlFor="image-upload" className="flex cursor-pointer flex-col items-center justify-center p-4">
                  <Upload className="mb-2 h-6 w-6 text-gray-400" />
                  <span className="text-sm text-gray-500">Upload Image</span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
          
          {/* Organization */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Organization</h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="">Select a category</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Home">Home</option>
                  <option value="Electronics">Electronics</option>
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
              </div>
              
              <div>
                <Label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tags
                </Label>
                <div className="flex">
                  <Input
                    type="text"
                    id="tags"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="rounded-r-none"
                    placeholder="Add a tag"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    className="rounded-l-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm dark:bg-gray-700">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Inventory */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Inventory</h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="sku" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  SKU (Stock Keeping Unit)
                </Label>
                <Input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className={errors.sku ? "border-red-500" : ""}
                />
                {errors.sku && <p className="mt-1 text-sm text-red-500">{errors.sku}</p>}
              </div>
              
              <div>
                <Label htmlFor="inventory" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Inventory Quantity
                </Label>
                <Input
                  type="number"
                  id="inventory"
                  name="inventory"
                  min="0"
                  value={formData.inventory}
                  onChange={handleChange}
                  className={errors.inventory ? "border-red-500" : ""}
                />
                {errors.inventory && <p className="mt-1 text-sm text-red-500">{errors.inventory}</p>}
              </div>
            </div>
          </div>
          
          {/* AI Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">AI Features</h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="aiMatchScore" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  AI Match Score (0-100)
                </Label>
                <Input
                  type="number"
                  id="aiMatchScore"
                  name="aiMatchScore"
                  min="0"
                  max="100"
                  value={formData.aiMatchScore || ""}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="aiRecommendationReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  AI Recommendation Reason
                </Label>
                <Input
                  type="text"
                  id="aiRecommendationReason"
                  name="aiRecommendationReason"
                  value={formData.aiRecommendationReason || ""}
                  onChange={handleChange}
                  placeholder="e.g., Based on your style preferences"
                />
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {initialData ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm; 