import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

export default function BannersPage() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Banner Management</h1>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Add New Banner
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Banners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  title: "Summer Collection 2024",
                  image:
                    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
                  status: "Active",
                  startDate: "2024-06-01",
                  endDate: "2024-08-31",
                },
                {
                  id: 2,
                  title: "New Arrivals - Autumn Essentials",
                  image:
                    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
                  status: "Scheduled",
                  startDate: "2024-09-01",
                  endDate: "2024-10-31",
                },
                {
                  id: 3,
                  title: "Limited Edition Collection",
                  image:
                    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
                  status: "Active",
                  startDate: "2024-05-15",
                  endDate: "2024-07-15",
                },
              ].map((banner) => (
                <div
                  key={banner.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="h-16 w-24 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium">{banner.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {banner.startDate} to {banner.endDate}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${banner.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                      >
                        {banner.status}
                      </span>
                    </div>
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
