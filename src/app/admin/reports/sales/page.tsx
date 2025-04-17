import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/Button";
import { BarChart3, Download, Calendar } from "lucide-react";

export default function SalesReportsPage() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sales Reports</h1>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Date Range
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <Tabs defaultValue="by-date">
              <TabsList>
                <TabsTrigger value="by-date">By Date</TabsTrigger>
                <TabsTrigger value="by-product">By Product</TabsTrigger>
                <TabsTrigger value="by-category">By Category</TabsTrigger>
                <TabsTrigger value="by-customer">By Customer</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="by-date" className="mt-4">
              <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-md mb-6">
                <BarChart3 className="h-16 w-16 text-gray-300" />
                <p className="ml-4 text-gray-500">Sales by date chart</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left font-medium">Date</th>
                      <th className="py-2 px-4 text-left font-medium">
                        Orders
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Revenue
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Avg. Order Value
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Conversion Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        date: "May 25, 2024",
                        orders: 42,
                        revenue: "$12,450.00",
                        avgOrderValue: "$296.43",
                        conversionRate: "3.8%",
                      },
                      {
                        date: "May 24, 2024",
                        orders: 38,
                        revenue: "$10,825.00",
                        avgOrderValue: "$284.87",
                        conversionRate: "3.5%",
                      },
                      {
                        date: "May 23, 2024",
                        orders: 45,
                        revenue: "$13,680.00",
                        avgOrderValue: "$304.00",
                        conversionRate: "4.1%",
                      },
                      {
                        date: "May 22, 2024",
                        orders: 36,
                        revenue: "$9,890.00",
                        avgOrderValue: "$274.72",
                        conversionRate: "3.2%",
                      },
                      {
                        date: "May 21, 2024",
                        orders: 41,
                        revenue: "$11,950.00",
                        avgOrderValue: "$291.46",
                        conversionRate: "3.7%",
                      },
                    ].map((row, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{row.date}</td>
                        <td className="py-2 px-4">{row.orders}</td>
                        <td className="py-2 px-4">{row.revenue}</td>
                        <td className="py-2 px-4">{row.avgOrderValue}</td>
                        <td className="py-2 px-4">{row.conversionRate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="by-product" className="mt-4">
              <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-md mb-6">
                <BarChart3 className="h-16 w-16 text-gray-300" />
                <p className="ml-4 text-gray-500">Sales by product chart</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left font-medium">
                        Product
                      </th>
                      <th className="py-2 px-4 text-left font-medium">SKU</th>
                      <th className="py-2 px-4 text-left font-medium">
                        Units Sold
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Revenue
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Profit Margin
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        product: "Ethereal Silk Gown",
                        sku: "ESG-001",
                        unitsSold: 28,
                        revenue: "$16,800.00",
                        profitMargin: "42%",
                      },
                      {
                        product: "Neural Couture Jacket",
                        sku: "NCJ-002",
                        unitsSold: 22,
                        revenue: "$15,400.00",
                        profitMargin: "38%",
                      },
                      {
                        product: "Quantum Weave Scarf",
                        sku: "QWS-003",
                        unitsSold: 45,
                        revenue: "$9,000.00",
                        profitMargin: "55%",
                      },
                      {
                        product: "Digital Dream Dress",
                        sku: "DDD-004",
                        unitsSold: 18,
                        revenue: "$12,600.00",
                        profitMargin: "40%",
                      },
                      {
                        product: "Holographic Heels",
                        sku: "HH-005",
                        unitsSold: 32,
                        revenue: "$11,520.00",
                        profitMargin: "48%",
                      },
                    ].map((row, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{row.product}</td>
                        <td className="py-2 px-4">{row.sku}</td>
                        <td className="py-2 px-4">{row.unitsSold}</td>
                        <td className="py-2 px-4">{row.revenue}</td>
                        <td className="py-2 px-4">{row.profitMargin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="by-category" className="mt-4">
              <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-md mb-6">
                <BarChart3 className="h-16 w-16 text-gray-300" />
                <p className="ml-4 text-gray-500">Sales by category chart</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left font-medium">
                        Category
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Products
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Units Sold
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Revenue
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        % of Total Sales
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        category: "Dresses",
                        products: 24,
                        unitsSold: 86,
                        revenue: "$51,600.00",
                        percentOfTotal: "28%",
                      },
                      {
                        category: "Outerwear",
                        products: 18,
                        unitsSold: 62,
                        revenue: "$43,400.00",
                        percentOfTotal: "24%",
                      },
                      {
                        category: "Accessories",
                        products: 32,
                        unitsSold: 128,
                        revenue: "$32,000.00",
                        percentOfTotal: "18%",
                      },
                      {
                        category: "Footwear",
                        products: 15,
                        unitsSold: 54,
                        revenue: "$29,700.00",
                        percentOfTotal: "16%",
                      },
                      {
                        category: "Sustainable Collection",
                        products: 12,
                        unitsSold: 48,
                        revenue: "$24,000.00",
                        percentOfTotal: "14%",
                      },
                    ].map((row, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{row.category}</td>
                        <td className="py-2 px-4">{row.products}</td>
                        <td className="py-2 px-4">{row.unitsSold}</td>
                        <td className="py-2 px-4">{row.revenue}</td>
                        <td className="py-2 px-4">{row.percentOfTotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="by-customer" className="mt-4">
              <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-md mb-6">
                <BarChart3 className="h-16 w-16 text-gray-300" />
                <p className="ml-4 text-gray-500">Sales by customer chart</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left font-medium">
                        Customer
                      </th>
                      <th className="py-2 px-4 text-left font-medium">Email</th>
                      <th className="py-2 px-4 text-left font-medium">
                        Total Orders
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Total Spent
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Avg. Order Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        customer: "Olivia Chen",
                        email: "olivia.chen@example.com",
                        totalOrders: 8,
                        totalSpent: "$4,850.00",
                        avgOrderValue: "$606.25",
                      },
                      {
                        customer: "James Wilson",
                        email: "james.wilson@example.com",
                        totalOrders: 6,
                        totalSpent: "$3,720.00",
                        avgOrderValue: "$620.00",
                      },
                      {
                        customer: "Sophia Martinez",
                        email: "sophia.m@example.com",
                        totalOrders: 5,
                        totalSpent: "$2,950.00",
                        avgOrderValue: "$590.00",
                      },
                      {
                        customer: "Ethan Johnson",
                        email: "ethan.j@example.com",
                        totalOrders: 4,
                        totalSpent: "$2,480.00",
                        avgOrderValue: "$620.00",
                      },
                      {
                        customer: "Isabella Kim",
                        email: "isabella.k@example.com",
                        totalOrders: 7,
                        totalSpent: "$4,130.00",
                        avgOrderValue: "$590.00",
                      },
                    ].map((row, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{row.customer}</td>
                        <td className="py-2 px-4">{row.email}</td>
                        <td className="py-2 px-4">{row.totalOrders}</td>
                        <td className="py-2 px-4">{row.totalSpent}</td>
                        <td className="py-2 px-4">{row.avgOrderValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
