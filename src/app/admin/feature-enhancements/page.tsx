import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import FeatureEnhancementsDashboard from "@/components/admin/FeatureEnhancementsDashboard";

/**
 * Feature Enhancements Admin Page
 * Displays planned improvements to AI features
 */
export default function FeatureEnhancementsPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Feature Improvements</h1>
          <p className="text-gray-600">
            Explore upcoming enhancements and improvements to our AI features
          </p>
        </div>
        
        <FeatureEnhancementsDashboard />
      </div>
    </AdminLayout>
  );
} 