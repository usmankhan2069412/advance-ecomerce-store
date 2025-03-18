"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm, { ProductFormData } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { productService } from "@/services/productService";

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
    
    try {
      // Try to use Supabase, fall back to localStorage if it fails
      try {
        // Create product in Supabase
        await productService.createProduct({
          name: data.name,
          description: data.description,
          price: data.price,
          compare_at_price: data.compareAtPrice,
          images: data.images,
          category: data.category,
          tags: data.tags,
          inventory: data.inventory,
          sku: data.sku,
          ai_match_score: data.aiMatchScore,
          ai_recommendation_reason: data.aiRecommendationReason,
        });
      } catch (supabaseError) {
        console.error("Supabase error, falling back to localStorage:", supabaseError);
        
        // Fallback to localStorage
        const newProduct = {
          ...data,
          id: `prod_${Math.random().toString(36).substring(2, 10)}`,
          createdAt: new Date().toISOString(),
        };
        
        const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
        localStorage.setItem('products', JSON.stringify([...existingProducts, newProduct]));
      }
      
      // Show success message
      alert("Product created successfully!");
      
      // Redirect to products list
      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product. Please try again.");
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
