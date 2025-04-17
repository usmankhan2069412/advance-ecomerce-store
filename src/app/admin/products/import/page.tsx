import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Download,
  ArrowRight,
  Check,
  AlertTriangle,
  X,
} from "lucide-react";

export default function ProductImport() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Import Products</h1>
          <p className="text-muted-foreground">
            Upload product data in bulk using CSV files
          </p>
        </div>

        {/* Import Steps */}
        <div className="relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-border" />
          <div className="relative flex justify-between">
            {[
              { step: 1, title: "Upload File", status: "current" },
              { step: 2, title: "Map Fields", status: "upcoming" },
              { step: 3, title: "Validate Data", status: "upcoming" },
              { step: 4, title: "Import", status: "upcoming" },
            ].map((step) => (
              <div
                key={step.step}
                className="flex flex-col items-center relative z-10"
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step.status === "completed"
                      ? "bg-green-100 text-green-600"
                      : step.status === "current"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.status === "completed" ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{step.step}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-sm ${
                    step.status === "completed"
                      ? "text-green-600"
                      : step.status === "current"
                        ? "font-medium"
                        : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md mb-4">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="map" disabled>
              Map Fields
            </TabsTrigger>
            <TabsTrigger value="validate" disabled>
              Validate
            </TabsTrigger>
            <TabsTrigger value="import" disabled>
              Import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload CSV File</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed rounded-lg p-10 text-center">
                  <div className="mx-auto flex flex-col items-center justify-center gap-1">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <h3 className="font-medium text-lg">
                      Drag & drop your CSV file here
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      or click to browse files from your computer
                    </p>
                    <Button>Select File</Button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Template
                    </Button>
                  </div>
                  <Button className="flex items-center gap-2">
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Import Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      <span className="font-medium">
                        Use the correct format:
                      </span>{" "}
                      Your CSV file should have headers in the first row that
                      match our system fields.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      <span className="font-medium">Required fields:</span>{" "}
                      Product Name, SKU, Price, and Category are required for
                      all products.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      <span className="font-medium">Images:</span> For multiple
                      images, separate URLs with a pipe character (|).
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      <span className="font-medium">Variants:</span> Each
                      variant should be on a separate row with the same parent
                      SKU.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      <span className="font-medium">File size limit:</span>{" "}
                      Maximum file size is 10MB.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Map CSV Fields to Product Attributes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Map the columns from your CSV file to the corresponding
                  product attributes in our system.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="validate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Validate Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Review any errors or warnings before proceeding with the
                  import.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Import Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Start the import process and monitor progress.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Sample Data Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Sample CSV Format</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  {[
                    "product_name",
                    "sku",
                    "description",
                    "price",
                    "compare_price",
                    "cost",
                    "quantity",
                    "category",
                    "tags",
                    "images",
                    "weight",
                    "variant_name",
                    "variant_values",
                  ].map((header) => (
                    <th
                      key={header}
                      className="p-2 text-left text-xs font-medium border"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border text-sm">Neural Couture Dress</td>
                  <td className="p-2 border text-sm">NC-001</td>
                  <td className="p-2 border text-sm">
                    AI-designed luxury dress...
                  </td>
                  <td className="p-2 border text-sm">1299.99</td>
                  <td className="p-2 border text-sm">1499.99</td>
                  <td className="p-2 border text-sm">650.00</td>
                  <td className="p-2 border text-sm">24</td>
                  <td className="p-2 border text-sm">Dresses</td>
                  <td className="p-2 border text-sm">Luxury,AI-Generated</td>
                  <td className="p-2 border text-sm">
                    https://example.com/image1.jpg|https://example.com/image2.jpg
                  </td>
                  <td className="p-2 border text-sm">0.5</td>
                  <td className="p-2 border text-sm">Size</td>
                  <td className="p-2 border text-sm">S,M,L</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="p-2 border text-sm">Neural Couture Dress</td>
                  <td className="p-2 border text-sm">NC-001-S</td>
                  <td className="p-2 border text-sm">
                    AI-designed luxury dress...
                  </td>
                  <td className="p-2 border text-sm">1299.99</td>
                  <td className="p-2 border text-sm">1499.99</td>
                  <td className="p-2 border text-sm">650.00</td>
                  <td className="p-2 border text-sm">8</td>
                  <td className="p-2 border text-sm">Dresses</td>
                  <td className="p-2 border text-sm">Luxury,AI-Generated</td>
                  <td className="p-2 border text-sm">
                    https://example.com/image1.jpg
                  </td>
                  <td className="p-2 border text-sm">0.5</td>
                  <td className="p-2 border text-sm">Size</td>
                  <td className="p-2 border text-sm">S</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
