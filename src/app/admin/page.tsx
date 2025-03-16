import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Users,
  ShoppingBag,
  TrendingUp,
  DollarSign,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="p-6 flex flex-row items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </p>
                <h3 className="text-2xl font-bold">$45,231.89</h3>
                <p className="text-xs text-green-500 mt-1">
                  +20.1% from last month
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-row items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  New Customers
                </p>
                <h3 className="text-2xl font-bold">+2,350</h3>
                <p className="text-xs text-green-500 mt-1">
                  +18.2% from last month
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-row items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Orders
                </p>
                <h3 className="text-2xl font-bold">+12,234</h3>
                <p className="text-xs text-green-500 mt-1">
                  +12.2% from last month
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-row items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Artists
                </p>
                <h3 className="text-2xl font-bold">+573</h3>
                <p className="text-xs text-green-500 mt-1">
                  +7.4% from last month
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
                <BarChart3 className="h-16 w-16 text-gray-300" />
                <p className="ml-4 text-gray-500">Sales chart visualization</p>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "New order #1092",
                    time: "2 minutes ago",
                    description: "Customer purchased Ethereal Silk Gown",
                  },
                  {
                    title: "New artist application",
                    time: "1 hour ago",
                    description: "Marcus Rivera submitted portfolio",
                  },
                  {
                    title: "Inventory alert",
                    time: "3 hours ago",
                    description: "Low stock on Cashmere Oversized Coat",
                  },
                  {
                    title: "Customer review",
                    time: "5 hours ago",
                    description: "5-star review on Neural Couture Collection",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <div className="h-2 w-2 mt-2 rounded-full bg-primary mr-3" />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="analytics">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
                <TabsTrigger value="artists">Artist Management</TabsTrigger>
                <TabsTrigger value="security">
                  Security & Compliance
                </TabsTrigger>
              </TabsList>
              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Predictive Inventory
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        ML-powered demand forecasting for upcoming season
                      </p>
                      <div className="mt-2 flex justify-end">
                        <a
                          href="/admin/analytics"
                          className="text-xs text-primary hover:underline"
                        >
                          View details →
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Sentiment Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Brand perception across social media and reviews
                      </p>
                      <div className="mt-2 flex justify-end">
                        <a
                          href="/admin/analytics"
                          className="text-xs text-primary hover:underline"
                        >
                          View details →
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="artists" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        AI Plagiarism Checker
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Detect copied designs using image hashing technology
                      </p>
                      <div className="mt-2 flex justify-end">
                        <a
                          href="/admin/artists"
                          className="text-xs text-primary hover:underline"
                        >
                          View details →
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Trend Forecasting
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Identify emerging styles via social media analysis
                      </p>
                      <div className="mt-2 flex justify-end">
                        <a
                          href="/admin/artists"
                          className="text-xs text-primary hover:underline"
                        >
                          View details →
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="security" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        GDPR/CCPA Compliance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Automated data deletion requests and compliance
                      </p>
                      <div className="mt-2 flex justify-end">
                        <a
                          href="/admin/security"
                          className="text-xs text-primary hover:underline"
                        >
                          View details →
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Fraud Detection
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        ML models to flag suspicious transactions
                      </p>
                      <div className="mt-2 flex justify-end">
                        <a
                          href="/admin/security"
                          className="text-xs text-primary hover:underline"
                        >
                          View details →
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
