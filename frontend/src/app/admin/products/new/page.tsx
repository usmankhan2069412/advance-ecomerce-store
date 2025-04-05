"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm, { ProductFormData } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { toast } from "sonner";

/**
 * New Product Page
 * Allows admins to create new products
 */
export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle form submission
   * @param data - Product form data
   */
  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    console.log('Submitting product data:', { ...data, images: data.images.length > 0 ? [`${data.images[0].substring(0, 30)}...`] : [] });

    try {
      // Try to use Supabase, fall back to localStorage if it fails
      try {
        // Make sure we have at least one image
        if (!data.images || data.images.length === 0) {
          // Use a placeholder image if none provided
          data.images = ['https://placehold.co/600x400?text=No+Image'];
        }

        // Make sure the first image is used as the main image
        const mainImage = data.images[0];

        // Get the category name from the category ID
        let categoryName = data.category;
        try {
          const categories = await categoryService.getCategories();
          const selectedCategory = categories.find(cat => cat.id === data.category);
          if (selectedCategory) {
            categoryName = selectedCategory.name;
          }
        } catch (error) {
          console.warn('Error fetching category name:', error);
        }

        // Create product in Supabase
        const createdProduct = await productService.createProduct({
          name: data.name,
          description: data.description,
          price: data.price,
          compare_at_price: data.compareAtPrice,
          image: mainImage, // Set the main image
          images: data.images,
          category: categoryName, // Use the category name
          category_id: data.category, // Also store the category ID
          tags: data.tags,
          inventory: data.inventory,
          sku: data.sku,
          ai_match_score: data.aiMatchScore,
          ai_recommendation_reason: data.aiRecommendationReason,
          is_new: true, // Mark as new product
        });

        if (!createdProduct) {
          throw new Error('Failed to create product - no data returned');
        }

        console.log('Product created successfully:', createdProduct);

        // Show success toast
        toast.success("Product created successfully!");
      } catch (supabaseError) {
        console.error("Supabase error, falling back to localStorage:", supabaseError);

        // Fallback to localStorage
        const newProduct = {
          ...data,
          id: `prod_${Math.random().toString(36).substring(2, 10)}`,
          image: data.images && data.images.length > 0 ? data.images[0] : 'https://placehold.co/600x400?text=No+Image',
          isNew: true,
          createdAt: new Date().toISOString(),
        };

        const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
        localStorage.setItem('products', JSON.stringify([...existingProducts, newProduct]));

        // Show success toast for localStorage fallback
        toast.success("Product saved locally successfully!");
      }
      // Redirect to products list
      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create product. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle form cancellation
   */
  const handleCancel = () => {
    router.push("/admin/products");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Create New Product</h1>
            <p className="text-gray-600">Add a new product to your store</p>
          </div>

          <Button
            variant="outline"
            asChild
          >
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>

        <ProductForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </AdminLayout>
  );
}
