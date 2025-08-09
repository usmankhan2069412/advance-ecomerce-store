import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, MoveUp, MoveDown } from "lucide-react";

export default function FeaturedCollectionsPage() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Featured Collections</h1>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Add Collection
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Featured Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  title: "Summer Essentials",
                  products: 12,
                  image:
                    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
                  position: 1,
                },
                {
                  id: 2,
                  title: "Sustainable Fashion",
                  products: 8,
                  image:
                    "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=80",
                  position: 2,
                },
                {
                  id: 3,
                  title: "New Arrivals",
                  products: 15,
                  image:
                    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80",
                  position: 3,
                },
              ].map((collection) => (
                <div
                  key={collection.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={collection.image}
                      alt={collection.title}
                      className="h-16 w-24 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium">{collection.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {collection.products} products
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Position: {collection.position}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="md">
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="md">
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="md">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="md">
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
