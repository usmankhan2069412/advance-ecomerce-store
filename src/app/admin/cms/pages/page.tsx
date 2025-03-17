import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Eye } from "lucide-react";

export default function StaticPagesManagement() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Static Pages</h1>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Create New Page
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  title: "About Us",
                  slug: "/about",
                  lastUpdated: "2024-05-15",
                  status: "Published",
                },
                {
                  id: 2,
                  title: "Contact Us",
                  slug: "/contact",
                  lastUpdated: "2024-05-10",
                  status: "Published",
                },
                {
                  id: 3,
                  title: "Terms of Service",
                  slug: "/terms",
                  lastUpdated: "2024-04-20",
                  status: "Published",
                },
                {
                  id: 4,
                  title: "Privacy Policy",
                  slug: "/privacy",
                  lastUpdated: "2024-04-20",
                  status: "Published",
                },
                {
                  id: 5,
                  title: "Shipping & Returns",
                  slug: "/shipping-returns",
                  lastUpdated: "2024-05-22",
                  status: "Draft",
                },
              ].map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white"
                >
                  <div>
                    <h3 className="font-medium">{page.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Slug: {page.slug}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        Last updated: {page.lastUpdated}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${page.status === "Published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                      >
                        {page.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
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
