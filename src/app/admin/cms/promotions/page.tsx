import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PromotionsPage() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Promotions & Campaigns</h1>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Create New Campaign
          </Button>
        </div>

        <Card>
          <CardHeader>
            <Tabs defaultValue="active">
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="active" className="space-y-4 mt-4">
              {[
                {
                  id: 1,
                  name: "Summer Sale 2024",
                  discount: "20% off",
                  startDate: "2024-06-01",
                  endDate: "2024-06-30",
                  products: 45,
                  conversions: "12.5%",
                },
                {
                  id: 2,
                  name: "New Customer Discount",
                  discount: "15% off first order",
                  startDate: "2024-01-01",
                  endDate: "2024-12-31",
                  products: "All",
                  conversions: "8.2%",
                },
                {
                  id: 3,
                  name: "Limited Edition Collection Launch",
                  discount: "Free shipping",
                  startDate: "2024-05-15",
                  endDate: "2024-06-15",
                  products: 12,
                  conversions: "18.7%",
                },
              ].map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white"
                >
                  <div>
                    <h3 className="font-medium">{campaign.name}</h3>
                    <p className="text-sm font-medium text-primary">
                      {campaign.discount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {campaign.startDate} to {campaign.endDate}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Products: {campaign.products}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium mr-2">
                        Conversion Rate:
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        {campaign.conversions}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="md">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="md">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="md">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-4 mt-4">
              {[
                {
                  id: 1,
                  name: "Fall Collection Preview",
                  discount: "Early access + 10% off",
                  startDate: "2024-08-15",
                  endDate: "2024-09-15",
                  products: 30,
                  status: "Ready",
                },
                {
                  id: 2,
                  name: "Holiday Season Sale",
                  discount: "Up to 30% off",
                  startDate: "2024-11-25",
                  endDate: "2024-12-26",
                  products: 120,
                  status: "In preparation",
                },
              ].map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white"
                >
                  <div>
                    <h3 className="font-medium">{campaign.name}</h3>
                    <p className="text-sm font-medium text-primary">
                      {campaign.discount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {campaign.startDate} to {campaign.endDate}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Products: {campaign.products}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className={`text-xs px-2 py-1 rounded-full mb-2 ${campaign.status === "Ready" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                    >
                      {campaign.status}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="md">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="md">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4 mt-4">
              {[
                {
                  id: 1,
                  name: "Spring Collection Launch",
                  discount: "15% off",
                  startDate: "2024-03-01",
                  endDate: "2024-04-15",
                  products: 40,
                  revenue: "$125,450",
                  conversions: "14.2%",
                },
                {
                  id: 2,
                  name: "Earth Day Special",
                  discount: "20% off sustainable items",
                  startDate: "2024-04-15",
                  endDate: "2024-04-25",
                  products: 25,
                  revenue: "$42,680",
                  conversions: "11.8%",
                },
              ].map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white"
                >
                  <div>
                    <h3 className="font-medium">{campaign.name}</h3>
                    <p className="text-sm font-medium text-primary">
                      {campaign.discount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {campaign.startDate} to {campaign.endDate}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Products: {campaign.products}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-sm font-medium mb-1">
                      Revenue: {campaign.revenue}
                    </p>
                    <p className="text-sm font-medium mb-2">
                      Conversion: {campaign.conversions}
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="md">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
