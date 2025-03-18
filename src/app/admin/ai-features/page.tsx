import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AIRoadmapDashboard from "@/components/admin/AIRoadmapDashboard";
import VirtualTryOn from "@/components/ai/VirtualTryOn";

/**
 * AI Features Admin Page
 * Displays the AI roadmap and demo implementations
 */
export default function AIFeaturesPage() {
  // Sample product data for the virtual try-on demo
  const sampleProduct = {
    id: "prod_123",
    name: "Classic White T-Shirt",
    image: "/images/products/tshirt-white.jpg" // This should be a path to an actual product image
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Features</h1>
          <p className="text-gray-600">
            Manage and monitor AI features implementation across the platform
          </p>
        </div>
        
        <AIRoadmapDashboard />
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Feature Demos</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Virtual Try-On (MVP)</h3>
            <p className="text-gray-600 mb-4">
              Test our basic virtual try-on feature using image segmentation
            </p>
            
            <VirtualTryOn 
              productId={sampleProduct.id} 
              productImage={sampleProduct.image} 
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 