import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, Calendar, TrendingUp } from "lucide-react";

export default function RevenueReportsPage() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Revenue Analytics</h1>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Date Range
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        {/* Revenue Overview Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Revenue
                  </p>
                  <h3 className="text-2xl font-bold">$182,450</h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">vs last month</span>
                  <span className="text-green-500 font-medium">+12.5%</span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full mt-1">
                  <div className="w-[65%] h-1 bg-primary rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Profit Margin
                  </p>
                  <h3 className="text-2xl font-bold">42.8%</h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">vs last month</span>
                  <span className="text-green-500 font-medium">+2.3%</span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full mt-1">
                  <div className="w-[42.8%] h-1 bg-primary rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Average Order Value
                  </p>
                  <h3 className="text-2xl font-bold">$298.50</h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">vs last month</span>
                  <span className="text-green-500 font-medium">+5.2%</span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full mt-1">
                  <div className="w-[58%] h-1 bg-primary rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Customer Lifetime Value
                  </p>
                  <h3 className="text-2xl font-bold">$1,250</h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">vs last month</span>
                  <span className="text-green-500 font-medium">+8.7%</span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full mt-1">
                  <div className="w-[72%] h-1 bg-primary rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <Tabs defaultValue="trends">
              <TabsList>
                <TabsTrigger value="trends">Revenue Trends</TabsTrigger>
                <TabsTrigger value="channels">Revenue by Channel</TabsTrigger>
                <TabsTrigger value="products">Top Revenue Products</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="trends" className="mt-4">
              <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-md mb-6">
                <BarChart3 className="h-16 w-16 text-gray-300" />
                <p className="ml-4 text-gray-500">Revenue trends chart</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Monthly Growth Rate
                    </h4>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold">+12.5%</span>
                      <span className="ml-2 text-xs text-green-500">
                        +2.1% vs prev
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Quarterly Projection
                    </h4>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold">$580K</span>
                      <span className="ml-2 text-xs text-green-500">
                        On target
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Year-over-Year
                    </h4>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold">+32.8%</span>
                      <span className="ml-2 text-xs text-green-500">
                        Exceeding goal
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="channels" className="mt-4">
              <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-md mb-6">
                <BarChart3 className="h-16 w-16 text-gray-300" />
                <p className="ml-4 text-gray-500">Revenue by channel chart</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left font-medium">
                        Channel
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Revenue
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        % of Total
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Growth (MoM)
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Avg. Order Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        channel: "Direct Website",
                        revenue: "$98,450.00",
                        percentOfTotal: "54%",
                        growth: "+15.2%",
                        avgOrderValue: "$320.00",
                      },
                      {
                        channel: "Mobile App",
                        revenue: "$42,680.00",
                        percentOfTotal: "23%",
                        growth: "+28.5%",
                        avgOrderValue: "$285.00",
                      },
                      {
                        channel: "Marketplace Partners",
                        revenue: "$25,840.00",
                        percentOfTotal: "14%",
                        growth: "+8.3%",
                        avgOrderValue: "$275.00",
                      },
                      {
                        channel: "Social Media",
                        revenue: "$12,480.00",
                        percentOfTotal: "7%",
                        growth: "+42.1%",
                        avgOrderValue: "$260.00",
                      },
                      {
                        channel: "Retail Locations",
                        revenue: "$3,000.00",
                        percentOfTotal: "2%",
                        growth: "-5.2%",
                        avgOrderValue: "$350.00",
                      },
                    ].map((row, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{row.channel}</td>
                        <td className="py-2 px-4">{row.revenue}</td>
                        <td className="py-2 px-4">{row.percentOfTotal}</td>
                        <td className="py-2 px-4">
                          <span
                            className={`${row.growth.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                          >
                            {row.growth}
                          </span>
                        </td>
                        <td className="py-2 px-4">{row.avgOrderValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="products" className="mt-4">
              <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-md mb-6">
                <BarChart3 className="h-16 w-16 text-gray-300" />
                <p className="ml-4 text-gray-500">Top revenue products chart</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left font-medium">
                        Product
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Revenue
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Units Sold
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Profit Margin
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Growth (MoM)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        product: "Ethereal Silk Gown",
                        revenue: "$16,800.00",
                        unitsSold: 28,
                        profitMargin: "42%",
                        growth: "+18.5%",
                      },
                      {
                        product: "Neural Couture Jacket",
                        revenue: "$15,400.00",
                        unitsSold: 22,
                        profitMargin: "38%",
                        growth: "+22.3%",
                      },
                      {
                        product: "Quantum Weave Scarf",
                        revenue: "$9,000.00",
                        unitsSold: 45,
                        profitMargin: "55%",
                        growth: "+12.8%",
                      },
                      {
                        product: "Digital Dream Dress",
                        revenue: "$12,600.00",
                        unitsSold: 18,
                        profitMargin: "40%",
                        growth: "+8.2%",
                      },
                      {
                        product: "Holographic Heels",
                        revenue: "$11,520.00",
                        unitsSold: 32,
                        profitMargin: "48%",
                        growth: "+15.7%",
                      },
                    ].map((row, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{row.product}</td>
                        <td className="py-2 px-4">{row.revenue}</td>
                        <td className="py-2 px-4">{row.unitsSold}</td>
                        <td className="py-2 px-4">{row.profitMargin}</td>
                        <td className="py-2 px-4">
                          <span className="text-green-500">{row.growth}</span>
                        </td>
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
