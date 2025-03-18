import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import FutureEnhancementsDashboard from "@/components/admin/FutureEnhancementsDashboard";

/**
 * Future Enhancements Admin Page
 * Displays the roadmap for upcoming features and innovations
 */
export default function FutureEnhancementsPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Future Enhancements</h1>
          <p className="text-gray-600">
            Explore our roadmap for upcoming features and platform innovations
          </p>
        </div>
        
        <FutureEnhancementsDashboard />
      </div>
    </AdminLayout>
  );
} 