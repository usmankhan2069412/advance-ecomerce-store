"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm, { ProductFormData } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { productService } from "@/services/productService";
import { toast } from "sonner";

/**
 * Edit Product Page
 * Allows admins to edit existing products
 */
export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<ProductFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const productData = await productService.getProductById(productId);
        
        if (!productData) {
          toast.error("Product not found");
          router.push("/admin/products");
          return;
        }

        // Transform product data to match ProductFormData
        const formData: ProductFormData = {
          id: productData.id,
          name: productData.name,
          description: productData.description || "",
          price: productData.price,
          compareAtPrice: productData.compare_at_price,
          images: productData.images || [],
          category: productData.category_id || "",
          type: productData.type || "",
          tags: productData.tags || [],
          inventory: productData.inventory || 0,
          sku: productData.sku || "",
          aiMatchScore: 0,
          aiRecommendationReason: "",
        };

        setProduct(formData);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product data");
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);

  /**
   * Handle form submission
   * @param data - Product form data
   */
  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

    try {
      // Prepare product data for update
      const productToUpdate = {
        name: data.name,
        description: data.description,
        price: data.price,
        compare_at_price: data.compareAtPrice,
        images: data.images,
        category_id: data.category,
        type: data.type as 'Man' | 'Woman' | 'Accessories',
        tags: data.tags,
        inventory: data.inventory,
        sku: data.sku,
      };

      // Update product
      const updatedProduct = await productService.updateProduct(productId, productToUpdate);

      if (!updatedProduct) {
        throw new Error('Failed to update product');
      }

      toast.success("Product updated successfully!");

      // Redirect to products list after a short delay
      setTimeout(() => {
        router.push("/admin/products");
      }, 1000);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading product data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <p className="text-gray-600">Update product information</p>
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

        {product && (
          <ProductForm
            initialData={product}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </div>
    </AdminLayout>
  );
}
