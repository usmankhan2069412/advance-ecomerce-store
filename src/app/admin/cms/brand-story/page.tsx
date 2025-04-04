import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Save } from "lucide-react";

export default function BrandStoryPage() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Brand Story</h1>
          <Button className="flex items-center gap-2">
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Brand Story</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full p-2 border rounded-md"
                  defaultValue="Our Journey in Luxury Fashion"
                />
              </div>

              <div>
                <label
                  htmlFor="subtitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subtitle
                </label>
                <input
                  type="text"
                  id="subtitle"
                  className="w-full p-2 border rounded-md"
                  defaultValue="Crafting the Future of Fashion with AI and Artistry"
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  rows={10}
                  className="w-full p-2 border rounded-md"
                  defaultValue={`Founded in 2020, AETHERIA emerged from a vision to blend cutting-edge AI technology with traditional craftsmanship in luxury fashion. Our journey began with a simple question: How can we create fashion that is both innovative and timeless?

Our team of designers, technologists, and artisans work together to create pieces that push the boundaries of what's possible in fashion. Each collection is a testament to our commitment to sustainability, innovation, and exceptional quality.

We believe that the future of fashion lies at the intersection of human creativity and artificial intelligence. By harnessing the power of AI, we're able to create designs that are not only beautiful but also sustainable and ethical.

Join us on our journey as we continue to redefine luxury fashion for the modern era.`}
                />
              </div>

              <div>
                <label
                  htmlFor="featured-image"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Featured Image
                </label>
                <div className="flex items-center space-x-4">
                  <img
                    src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80"
                    alt="Brand story featured image"
                    className="h-32 w-48 object-cover rounded"
                  />
                  <Button variant="outline">Change Image</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
