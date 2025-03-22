import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar, FileSpreadsheet, FileText } from "lucide-react";

const dataExports = [
  {
    title: "Sales Data",
    items: [
      {
        name: "Complete Sales Report",
        description: "All sales data including orders, products, revenue",
        icon: <FileSpreadsheet className="h-8 w-8 text-green-600 mr-3" />, 
      },
      {
        name: "Product Performance",
        description: "Sales by product, including units sold and revenue",
        icon: <FileSpreadsheet className="h-8 w-8 text-green-600 mr-3" />, 
      },
      {
        name: "Sales by Category",
        description: "Revenue and units sold grouped by product category",
        icon: <FileSpreadsheet className="h-8 w-8 text-green-600 mr-3" />, 
      },
    ],
  },
  {
    title: "Customer Data",
    items: [
      {
        name: "Customer List",
        description: "All registered customers with contact information",
        icon: <FileText className="h-8 w-8 text-blue-600 mr-3" />,
      },
      {
        name: "Customer Orders",
        description: "Order history and purchase details for each customer",
        icon: <FileText className="h-8 w-8 text-blue-600 mr-3" />,
      },
    ],
  },
];

export default function DataExportPage() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Data Export</h1>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Date Range
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dataExports.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {item.icon}
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Download className="h-3 w-3" /> CSV
                          </Button>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Download className="h-3 w-3" /> Excel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
