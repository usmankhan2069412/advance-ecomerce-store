import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import SecurityComplianceDashboard from "@/components/admin/SecurityComplianceDashboard";

/**
 * Security & Compliance Admin Page
 * Displays security settings and compliance status
 */
export default function SecurityCompliancePage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Security & Compliance</h1>
          <p className="text-gray-600">
            Manage security settings and ensure regulatory compliance
          </p>
        </div>
        
        <SecurityComplianceDashboard />
      </div>
    </AdminLayout>
  );
} 