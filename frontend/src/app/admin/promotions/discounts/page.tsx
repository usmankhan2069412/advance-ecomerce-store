import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Copy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DiscountCodesPage() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Discount Codes</h1>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Create New Discount
          </Button>
        </div>

        <Card>
          <CardHeader>
            <Tabs defaultValue="active">
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="expired">Expired</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="active" className="space-y-4 mt-4">
              {[
                {
                  id: 1,
                  code: "SUMMER2024",
                  type: "Percentage",
                  value: "20% off",
                  minOrder: "$50",
                  startDate: "2024-06-01",
                  endDate: "2024-06-30",
                  usageLimit: "1 per customer",
                  usageCount: 128,
                },
                {
                  id: 2,
                  code: "WELCOME15",
                  type: "Percentage",
                  value: "15% off",
                  minOrder: "$0",
                  startDate: "2024-01-01",
                  endDate: "2024-12-31",
                  usageLimit: "New customers only",
                  usageCount: 342,
                },
                {
                  id: 3,
                  code: "FREESHIP",
                  type: "Free Shipping",
                  value: "Free shipping",
                  minOrder: "$100",
                  startDate: "2024-05-15",
                  endDate: "2024-06-15",
                  usageLimit: "Unlimited",
                  usageCount: 215,
                },
              ].map((discount) => (
                <div
                  key={discount.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{discount.code}</h3>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm font-medium text-primary">
                      {discount.value} ({discount.type})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Min. Order: {discount.minOrder} • Limit:{" "}
                      {discount.usageLimit}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {discount.startDate} to {discount.endDate}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium mr-2">
                        Usage Count:
                      </span>
                      <span className="text-sm font-bold">
                        {discount.usageCount}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
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
                  code: "FALL2024",
                  type: "Percentage",
                  value: "25% off",
                  minOrder: "$75",
                  startDate: "2024-09-01",
                  endDate: "2024-09-30",
                  usageLimit: "1 per customer",
                  status: "Ready",
                },
                {
                  id: 2,
                  code: "HOLIDAY30",
                  type: "Percentage",
                  value: "30% off",
                  minOrder: "$100",
                  startDate: "2024-11-25",
                  endDate: "2024-12-26",
                  usageLimit: "Unlimited",
                  status: "Ready",
                },
              ].map((discount) => (
                <div
                  key={discount.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{discount.code}</h3>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm font-medium text-primary">
                      {discount.value} ({discount.type})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Min. Order: {discount.minOrder} • Limit:{" "}
                      {discount.usageLimit}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {discount.startDate} to {discount.endDate}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs px-2 py-1 rounded-full mb-2 bg-green-100 text-green-800">
                      {discount.status}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="expired" className="space-y-4 mt-4">
              {[
                {
                  id: 1,
                  code: "SPRING2024",
                  type: "Percentage",
                  value: "15% off",
                  minOrder: "$50",
                  startDate: "2024-03-01",
                  endDate: "2024-04-15",
                  usageLimit: "1 per customer",
                  usageCount: 245,
                  revenue: "$18,450",
                },
                {
                  id: 2,
                  code: "EARTHDAY",
                  type: "Percentage",
                  value: "20% off sustainable items",
                  minOrder: "$0",
                  startDate: "2024-04-15",
                  endDate: "2024-04-25",
                  usageLimit: "Unlimited",
                  usageCount: 178,
                  revenue: "$12,680",
                },
              ].map((discount) => (
                <div
                  key={discount.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{discount.code}</h3>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm font-medium text-primary">
                      {discount.value} ({discount.type})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Min. Order: {discount.minOrder} • Limit:{" "}
                      {discount.usageLimit}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {discount.startDate} to {discount.endDate}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-sm font-medium mb-1">
                      Usage: {discount.usageCount}
                    </p>
                    <p className="text-sm font-medium mb-2">
                      Revenue: {discount.revenue}
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Reactivate
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
