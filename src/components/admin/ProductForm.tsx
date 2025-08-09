"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X, Upload, Plus, Trash } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import CategoryService from "@/services/categoryService";
import AttributeService, { Attribute } from "@/services/attributeService";

/**
 * Product form interface
 */
interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

/**
 * Product attribute value structure
 */
export interface ProductAttributeValue {
  attribute_id: string;
  attribute_name: string;
  value_id: string;
  value: string;
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
  type: string;
  tags: string[];
  inventory: number;
  sku: string;
  attributes: ProductAttributeValue[];
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
      type: "",
      tags: [],
      inventory: 0,
      sku: "",
      attributes: [],
      aiMatchScore: 0,
      aiRecommendationReason: "",
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[]>>({});

  // Function to fetch categories
  const fetchCategories = async () => {
    try {
      const service = await getCategoryService();
      const data = await service.public.getCategories();
      console.log('Fetched categories:', data);
      setCategories(data || []);
    } catch (error) {
      console.error('Unexpected error fetching categories:', error);
      setCategories([]);
      toast.error('Failed to load categories. Please try again.');
    }
  };

  // Function to fetch attributes
  const fetchAttributes = async () => {
    try {
      const attributeService = AttributeService.getInstance();
      const data = await attributeService.getAttributes();
      console.log('Fetched attributes:', data);
      setAttributes(data || []);

      // Initialize selected attributes from formData if editing
      if (initialData?.attributes?.length) {
        const selected: Record<string, string[]> = {};
        initialData.attributes.forEach(attr => {
          if (!selected[attr.attribute_id]) {
            selected[attr.attribute_id] = [];
          }
          selected[attr.attribute_id].push(attr.value_id);
        });
        setSelectedAttributes(selected);
      }
    } catch (error) {
      console.error('Unexpected error fetching attributes:', error);
      setAttributes([]);
      toast.error('Failed to load attributes. Please try again.');
    }
  };

  // Load categories and attributes on component mount
  useEffect(() => {
    // Initial fetch
    fetchCategories();
    fetchAttributes();

    // Set up a refresh interval to keep data in sync
    const categoriesIntervalId = setInterval(fetchCategories, 5000); // Refresh every 5 seconds
    const attributesIntervalId = setInterval(fetchAttributes, 5000); // Refresh every 5 seconds

    // Clean up the intervals when the component unmounts
    return () => {
      clearInterval(categoriesIntervalId);
      clearInterval(attributesIntervalId);
    };
  }, []);

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
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Process each file
    Array.from(files).forEach(file => {
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

        console.log('Image added to form data:', imageUrl.substring(0, 50) + '...');
      };
      reader.readAsDataURL(file);
    });

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
   * Handle attribute selection
   */
  const handleAttributeChange = (attributeId: string, valueId: string, checked: boolean) => {
    setSelectedAttributes(prev => {
      const updated = { ...prev };

      if (!updated[attributeId]) {
        updated[attributeId] = [];
      }

      if (checked) {
        // Add the value if it's not already in the array
        if (!updated[attributeId].includes(valueId)) {
          updated[attributeId] = [...updated[attributeId], valueId];
        }
      } else {
        // Remove the value
        updated[attributeId] = updated[attributeId].filter(id => id !== valueId);
      }

      return updated;
    });
  };

  /**
   * Convert selected attributes to ProductAttributeValue array
   */
  const prepareAttributesForSubmission = (): ProductAttributeValue[] => {
    const result: ProductAttributeValue[] = [];

    Object.entries(selectedAttributes).forEach(([attributeId, valueIds]) => {
      const attribute = attributes.find(attr => attr.id === attributeId);
      if (!attribute) return;

      valueIds.forEach(valueId => {
        const valueObj = attribute.values.find((val: any) => {
          if (typeof val === 'string') return false; // Skip string values
          return val.id === valueId;
        });

        if (!valueObj) return;

        result.push({
          attribute_id: attributeId,
          attribute_name: attribute.name,
          value_id: valueId,
          value: valueObj.value
        });
      });
    });

    return result;
  };

  /**
   * Validate the form before submission
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
      toast.error('Product name is required');
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      toast.error('Description is required');
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than zero';
      toast.error('Price must be greater than zero');
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
      toast.error('Category is required');
    }

    if (!formData.type) {
      newErrors.type = 'Type is required';
      toast.error('Type is required');
    }

    // Validate type value
    const validTypes = ['Man', 'Woman', 'Accessories'];
    if (formData.type && !validTypes.includes(formData.type)) {
      newErrors.type = 'Invalid type selected';
      toast.error('Invalid type selected');
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
      toast.error('SKU is required');
    }

    if (formData.inventory < 0) {
      newErrors.inventory = 'Inventory cannot be negative';
      toast.error('Inventory cannot be negative');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  /**
   * Compress image data to reduce storage size
   */
  const compressImages = (images: string[]): string[] => {
    return images.map(image => {
      // If it's not a data URL, return as is
      if (!image.startsWith('data:image')) return image;

      // Basic compression by reducing quality
      const canvas = document.createElement('canvas');
      const img = document.createElement('img');
      img.src = image;
      canvas.width = Math.min(800, img.width); // Max width 800px
      canvas.height = (img.height * canvas.width) / img.width;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.7); // Reduce quality to 70%
    });
  };

  /**
   * Clean up old products if storage is near limit
   */
  const cleanupStorage = (currentProducts: ProductFormData[]): ProductFormData[] => {
    const MAX_PRODUCTS = 50; // Maximum number of products to keep
    if (currentProducts.length > MAX_PRODUCTS) {
      return currentProducts.slice(-MAX_PRODUCTS); // Keep only the latest products
    }
    return currentProducts;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        // Generate a unique ID for new products
        if (!formData.id) {
          formData.id = Date.now().toString();
        }

        // Prepare attributes and compress images before saving
        const compressedFormData = {
          ...formData,
          images: compressImages(formData.images),
          attributes: prepareAttributesForSubmission()
        };

        // Let the productService handle localStorage
        // This prevents duplicate products from being created

        // Show success message based on whether we're updating or creating
        if (initialData) {
          toast.success('Product updated successfully!');
        } else {
          toast.success('Product created successfully!');
        }

        onSubmit(compressedFormData);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Failed to save product: ${error.message}`);
        } else {
          toast.error('Failed to save product. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6 bg-white">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700 ">
                  Product Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData?.name || ""}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="description" className="block text-sm font-medium text-gray-700 ">
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
                <Label htmlFor="price" className="block text-sm font-medium text-gray-700 ">
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
                <Label htmlFor="compareAtPrice" className="block text-sm font-medium text-gray-700 ">
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
                <div key={index} className="relative aspect-square rounded-md border border-gray-200 bg-gray-50 ">

                  <Image
                    src={image}
                    alt={`Product image ${index + 1}`}
                    width={300}
                    height={300}
                    className="h-full w-full rounded-md object-cover"
                    priority={index === 0} // Priority load for first image
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

              <div className="flex aspect-square items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 ">
                <label htmlFor="image-upload" className="flex cursor-pointer flex-col items-center justify-center p-4">
                  <Upload className="mb-2 h-6 w-6 text-gray-400" />
                  <span className="text-sm text-gray-500">Upload Image</span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
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
                <Label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </Label>
                <div className="relative">
                  <div className="flex items-center space-x-2 mb-2">
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                    <SelectTrigger
                      className={`w-full h-10 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.category ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'} flex-grow`}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <SelectItem
                            key={category.id}        // Using category.id as unique key
                            value={category.id}      // Using ID as value
                            className="py-2 px-3 text-sm hover:bg-gray-100 cursor-pointer"
                          >
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="py-2 px-3 text-sm text-gray-500 italic">No categories available</div>
                      )}
                    </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        fetchCategories();
                        toast.success('Categories refreshed');
                      }}
                      className="flex items-center justify-center p-2 h-10 w-10"
                      title="Refresh Categories"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                      </svg>
                    </Button>
                  </div>
                </div>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
              </div>

              <div>
                <Label htmlFor="type" className="block cursor-pointer  text-sm font-medium text-gray-700 mb-1">
                  Type
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger
                    className={`w-full h-10 px-3 py-2 text-sm border cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.type ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                  >
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Man">Man</SelectItem>
                    <SelectItem value="Woman">Woman</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
              </div>

              <div>
                <Label htmlFor="tags" className="block text-sm font-medium text-gray-700 ">
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
                    <div key={index} className="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm ">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-gray-500 hover:text-gray-700 "
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Attributes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Attributes</h3>

            {attributes.length === 0 ? (
              <div className="text-sm text-gray-500 italic">
                No attributes available. <a href="/admin/attributes" className="text-primary underline">Create attributes</a> to add them to products.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {attributes.map(attribute => (
                  <div key={attribute.id} className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">{attribute.name}</h4>
                    {attribute.description && (
                      <p className="text-sm text-gray-500 mb-3">{attribute.description}</p>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {attribute.values.map((value: any, index: number) => {
                        const valueId = typeof value === 'string' ? `value_${index}` : value.id;
                        const valueText = typeof value === 'string' ? value : value.value;
                        const isChecked = selectedAttributes[attribute.id]?.includes(valueId) || false;

                        return (
                          <label key={valueId} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => handleAttributeChange(attribute.id, valueId, e.target.checked)}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm">{valueText}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Inventory */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Inventory</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="sku" className="block text-sm font-medium text-gray-700 ">
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
                <Label htmlFor="inventory" className="block text-sm font-medium text-gray-700 ">
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
                <Label htmlFor="aiMatchScore" className="block text-sm font-medium text-gray-700 ">
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
                <Label htmlFor="aiRecommendationReason" className="block text-sm font-medium text-gray-700 ">
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
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Saving...' : (initialData ? "Update Product" : "Create Product")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;

// Add the initialization function
const getCategoryService = async () => {
  return await CategoryService.getInstance();
};