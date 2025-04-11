import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AIDocumentation from "@/components/admin/AIDocumentation";
import MachineReadableDocumentation from "@/components/admin/MachineReadableDocumentation";
import AIModelSpecifications from "@/components/admin/AIModelSpecifications";

/**
 * AI Documentation Admin Page
 * Displays comprehensive documentation for AI features
 */
export default function AIDocumentationPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Documentation</h1>
          <p className="text-gray-600">
            Comprehensive documentation for AI agents, APIs, and implementation details
          </p>
        </div>
        
        <AIDocumentation />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MachineReadableDocumentation />
          <AIModelSpecifications />
        </div>
      </div>
    </AdminLayout>
  );
} 