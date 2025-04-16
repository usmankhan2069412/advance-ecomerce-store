"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm, { ProductFormData } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { productService } from "@/services/productService";
import categoryService  from "@/services/categoryService";
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

    // Prevent double submission
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitButton) {
      submitButton.disabled = true;
    }

    console.log('Submitting product data:', { 
      ...data, 
      images: data.images.length > 0 ? [`${data.images[0].substring(0, 30)}...`] : [] 
    });

    try {
      // Validate required fields first
      if (!data.name || !data.price || !data.category || !data.type) {
        throw new Error('Name, price, category and type are required fields');
      }

      // Validate price is a positive number
      if (isNaN(data.price) || data.price <= 0) {
        throw new Error('Price must be a positive number');
      }

      // Validate type
      const validTypes = ['Man', 'Woman', 'Accessories'];
      if (!validTypes.includes(data.type)) {
        throw new Error(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
      }

      // Make sure we have at least one image
      if (!data.images || data.images.length === 0) {
        // Use a placeholder image if none provided
        data.images = ['https://placehold.co/600x400?text=No+Image'];
      }

      // Make sure the first image is used as the main image
      const mainImage = data.images[0];

      // Create a unique client-side ID to help prevent duplicates
      const clientId = `temp_${Date.now()}`;

      // Get the category name from the category ID
     // This resolves category name from ID
let categoryName = data.category;
try {
  const service = await categoryService.getInstance();
  const categories = await service.public.getCategories();
  const selectedCategory = categories.find((cat: { id: string }) => cat.id === data.category);
  if (selectedCategory) {
    categoryName = selectedCategory.name;
  }
} catch (error) {
  console.warn('Error fetching category name:', error);
}


      // Try to use Supabase, fall back to localStorage if it fails
      try {
        // Create product in Supabase
        const productToCreate = {
          name: data.name,
          description: data.description,
          price: data.price,
          compare_at_price: data.compareAtPrice,
          image: mainImage,
          images: data.images,
          category_id: data.category,
          category_name: categoryName,
          type: data.type as ProductType, // Cast the type here
          tags: data.tags,
          inventory: data.inventory,
          sku: data.sku,
          is_new: true,
          client_id: clientId,
        };

        console.log('Creating product with data:', {
          ...productToCreate,
          image: 'Image URL (truncated)',
          images: productToCreate.images ? `${productToCreate.images.length} images` : 'No images'
        });

        const createdProduct = await productService.createProduct(productToCreate);

        if (!createdProduct) {
          throw new Error('Failed to create product - no data returned');
        }

        console.log('Product created successfully:', {
          id: createdProduct.id,
          name: createdProduct.name,
          price: createdProduct.price
        });

        // Show success toast
        toast.success("Product created successfully!");

        // Redirect to products list after a short delay to allow the toast to be seen
        setTimeout(() => {
          router.push("/admin/products");
        }, 1000);
      } catch (supabaseError) {
        console.error("Error creating product in Supabase:", supabaseError);

        // Try to create the product using localStorage fallback
        try {
          // In the fallback section
          const fallbackProduct = await productService.createProduct({
            name: data.name,
            description: data.description,
            price: data.price,
            compare_at_price: data.compareAtPrice,
            image: mainImage,
            images: data.images,
            category_id: data.category,
            category_name: categoryName, // Added category_name
            type: data.type as 'Man' | 'Woman' | 'Accessories',
            tags: data.tags,
            inventory: data.inventory,
            sku: data.sku,
            is_new: true,
            client_id: clientId,
          });

          if (fallbackProduct) {
            console.log('Product saved to localStorage successfully:', {
              id: fallbackProduct.id,
              name: fallbackProduct.name
            });

            // Show success toast for fallback
            toast.success("Product saved locally successfully!");

            // Redirect to products list after a short delay
            setTimeout(() => {
              router.push("/admin/products");
            }, 1000);
          } else {
            throw new Error('Failed to create product in localStorage');
          }
        } catch (fallbackError) {
          console.error("Error creating product in localStorage:", fallbackError);
          toast.error("Failed to create product. Please try again.");
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      console.error("Error creating product:", error);

      // Provide a more detailed error message
      let errorMessage = 'Failed to create product';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        try {
          errorMessage = `${errorMessage}: ${JSON.stringify(error)}`;
        } catch (e) {
          // If JSON stringify fails
          errorMessage = `${errorMessage}: ${Object.prototype.toString.call(error)}`;
        }
      }

      // Check for common issues
      if (errorMessage.includes('Supabase')) {
        errorMessage += '\nCheck your Supabase connection and environment variables.';
      }

      toast.error(errorMessage);

      // Enable the submit button again
      const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = false;
      }
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
