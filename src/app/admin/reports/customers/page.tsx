import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/Button";
import { BarChart3, Download, Calendar, Users } from "lucide-react";

export default function CustomerAnalyticsPage() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Customer Analytics</h1>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Date Range
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        {/* Customer Overview Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Customers
                  </p>
                  <h3 className="text-2xl font-bold">8,942</h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">vs last month</span>
                  <span className="text-green-500 font-medium">+8.2%</span>
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
                    New Customers
                  </p>
                  <h3 className="text-2xl font-bold">485</h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">vs last month</span>
                  <span className="text-green-500 font-medium">+12.5%</span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full mt-1">
                  <div className="w-[72%] h-1 bg-primary rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Repeat Purchase Rate
                  </p>
                  <h3 className="text-2xl font-bold">42.8%</h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">vs last month</span>
                  <span className="text-green-500 font-medium">+3.2%</span>
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
                    Avg. Customer Value
                  </p>
                  <h3 className="text-2xl font-bold">$1,250</h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">vs last month</span>
                  <span className="text-green-500 font-medium">+5.8%</span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full mt-1">
                  <div className="w-[58%] h-1 bg-primary rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <Tabs defaultValue="demographics">
              <TabsList>
                <TabsTrigger value="demographics">Demographics</TabsTrigger>
                <TabsTrigger value="behavior">Customer Behavior</TabsTrigger>
                <TabsTrigger value="segments">Customer Segments</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="demographics" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
                  <BarChart3 className="h-16 w-16 text-gray-300" />
                  <p className="ml-4 text-gray-500">Age distribution chart</p>
                </div>
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
                  <BarChart3 className="h-16 w-16 text-gray-300" />
                  <p className="ml-4 text-gray-500">
                    Gender distribution chart
                  </p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Geographic Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 px-4 text-left font-medium">
                            Country/Region
                          </th>
                          <th className="py-2 px-4 text-left font-medium">
                            Customers
                          </th>
                          <th className="py-2 px-4 text-left font-medium">
                            % of Total
                          </th>
                          <th className="py-2 px-4 text-left font-medium">
                            Revenue
                          </th>
                          <th className="py-2 px-4 text-left font-medium">
                            Avg. Order Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            region: "United States",
                            customers: 3845,
                            percentOfTotal: "43%",
                            revenue: "$78,450.00",
                            avgOrderValue: "$320.00",
                          },
                          {
                            region: "Europe",
                            customers: 2156,
                            percentOfTotal: "24%",
                            revenue: "$42,680.00",
                            avgOrderValue: "$310.00",
                          },
                          {
                            region: "Asia",
                            customers: 1842,
                            percentOfTotal: "21%",
                            revenue: "$38,840.00",
                            avgOrderValue: "$290.00",
                          },
                          {
                            region: "Australia/NZ",
                            customers: 624,
                            percentOfTotal: "7%",
                            revenue: "$12,480.00",
                            avgOrderValue: "$305.00",
                          },
                          {
                            region: "Other",
                            customers: 475,
                            percentOfTotal: "5%",
                            revenue: "$10,000.00",
                            avgOrderValue: "$285.00",
                          },
                        ].map((row, i) => (
                          <tr key={i} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-4">{row.region}</td>
                            <td className="py-2 px-4">{row.customers}</td>
                            <td className="py-2 px-4">{row.percentOfTotal}</td>
                            <td className="py-2 px-4">{row.revenue}</td>
                            <td className="py-2 px-4">{row.avgOrderValue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="behavior" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
                  <BarChart3 className="h-16 w-16 text-gray-300" />
                  <p className="ml-4 text-gray-500">Purchase frequency chart</p>
                </div>
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
                  <BarChart3 className="h-16 w-16 text-gray-300" />
                  <p className="ml-4 text-gray-500">Time between purchases</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Browsing Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 px-4 text-left font-medium">
                            Page/Section
                          </th>
                          <th className="py-2 px-4 text-left font-medium">
                            Visits
                          </th>
                          <th className="py-2 px-4 text-left font-medium">
                            Avg. Time Spent
                          </th>
                          <th className="py-2 px-4 text-left font-medium">
                            Conversion Rate
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            page: "Homepage",
                            visits: 24580,
                            timeSpent: "1m 45s",
                            conversionRate: "3.2%",
                          },
                          {
                            page: "Product Listings",
                            visits: 18450,
                            timeSpent: "2m 30s",
                            conversionRate: "4.5%",
                          },
                          {
                            page: "Product Details",
                            visits: 12840,
                            timeSpent: "3m 15s",
                            conversionRate: "8.7%",
                          },
                          {
                            page: "Shopping Cart",
                            visits: 6250,
                            timeSpent: "1m 20s",
                            conversionRate: "24.5%",
                          },
                          {
                            page: "Checkout",
                            visits: 4820,
                            timeSpent: "2m 50s",
                            conversionRate: "85.2%",
                          },
                        ].map((row, i) => (
                          <tr key={i} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-4">{row.page}</td>
                            <td className="py-2 px-4">{row.visits}</td>
                            <td className="py-2 px-4">{row.timeSpent}</td>
                            <td className="py-2 px-4">{row.conversionRate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="segments" className="mt-4">
              <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md mb-6">
                <BarChart3 className="h-16 w-16 text-gray-300" />
                <p className="ml-4 text-gray-500">Customer segments chart</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left font-medium">
                        Segment
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Customers
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        % of Total
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Avg. Order Value
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Purchase Frequency
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Lifetime Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        segment: "VIP Customers",
                        customers: 425,
                        percentOfTotal: "4.8%",
                        avgOrderValue: "$580.00",
                        purchaseFrequency: "5.2 orders/year",
                        lifetimeValue: "$4,850.00",
                      },
                      {
                        segment: "Regular Shoppers",
                        customers: 1850,
                        percentOfTotal: "20.7%",
                        avgOrderValue: "$320.00",
                        purchaseFrequency: "3.1 orders/year",
                        lifetimeValue: "$1,850.00",
                      },
                      {
                        segment: "Occasional Buyers",
                        customers: 3240,
                        percentOfTotal: "36.2%",
                        avgOrderValue: "$250.00",
                        purchaseFrequency: "1.5 orders/year",
                        lifetimeValue: "$850.00",
                      },
                      {
                        segment: "New Customers",
                        customers: 2150,
                        percentOfTotal: "24.0%",
                        avgOrderValue: "$210.00",
                        purchaseFrequency: "1.0 orders/year",
                        lifetimeValue: "$210.00",
                      },
                      {
                        segment: "At-Risk Customers",
                        customers: 1277,
                        percentOfTotal: "14.3%",
                        avgOrderValue: "$280.00",
                        purchaseFrequency: "0.5 orders/year",
                        lifetimeValue: "$420.00",
                      },
                    ].map((row, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{row.segment}</td>
                        <td className="py-2 px-4">{row.customers}</td>
                        <td className="py-2 px-4">{row.percentOfTotal}</td>
                        <td className="py-2 px-4">{row.avgOrderValue}</td>
                        <td className="py-2 px-4">{row.purchaseFrequency}</td>
                        <td className="py-2 px-4">{row.lifetimeValue}</td>
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
