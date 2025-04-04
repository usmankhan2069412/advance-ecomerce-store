import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, MessageSquare, Eye } from "lucide-react";

export default function ArtistDesignsPage() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Artist Design Management</h1>
          <div className="flex gap-2">
            <Button variant="outline">Filter</Button>
            <Button variant="outline">Sort</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <Tabs defaultValue="pending">
              <TabsList>
                <TabsTrigger value="pending">Pending Review</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="pending" className="space-y-4 mt-4">
              {[
                {
                  id: 1,
                  title: "Neural Couture Dress",
                  artist: "Elena Vega",
                  submittedDate: "2024-05-20",
                  category: "Dresses",
                  image:
                    "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80",
                },
                {
                  id: 2,
                  title: "Quantum Weave Jacket",
                  artist: "Marcus Chen",
                  submittedDate: "2024-05-18",
                  category: "Outerwear",
                  image:
                    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80",
                },
                {
                  id: 3,
                  title: "Digital Dream Scarf",
                  artist: "Sophia Williams",
                  submittedDate: "2024-05-15",
                  category: "Accessories",
                  image:
                    "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&q=80",
                },
              ].map((design) => (
                <div
                  key={design.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={design.image}
                      alt={design.title}
                      className="h-20 w-20 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium">{design.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        By {design.artist}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Submitted: {design.submittedDate} • Category:{" "}
                        {design.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="md">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      className="text-green-600"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      className="text-red-600"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="md">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4 mt-4">
              {[
                {
                  id: 1,
                  title: "Ethereal Silk Gown",
                  artist: "Elena Vega",
                  approvedDate: "2024-05-10",
                  category: "Dresses",
                  status: "In Production",
                  image:
                    "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80",
                },
                {
                  id: 2,
                  title: "Holographic Heels",
                  artist: "Marcus Chen",
                  approvedDate: "2024-05-08",
                  category: "Footwear",
                  status: "Live",
                  image:
                    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
                },
                {
                  id: 3,
                  title: "Sustainable Denim Jacket",
                  artist: "Sophia Williams",
                  approvedDate: "2024-05-05",
                  category: "Outerwear",
                  status: "Live",
                  image:
                    "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
                },
              ].map((design) => (
                <div
                  key={design.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={design.image}
                      alt={design.title}
                      className="h-20 w-20 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium">{design.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        By {design.artist}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                          Approved: {design.approvedDate} • Category:{" "}
                          {design.category}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${design.status === "Live" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                        >
                          {design.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="md">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit Details
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4 mt-4">
              {[
                {
                  id: 1,
                  title: "Neon Bodysuit",
                  artist: "James Wilson",
                  rejectedDate: "2024-05-12",
                  category: "Activewear",
                  reason: "Does not align with brand aesthetic",
                  image:
                    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
                },
                {
                  id: 2,
                  title: "Metallic Bomber Jacket",
                  artist: "Olivia Chen",
                  rejectedDate: "2024-05-09",
                  category: "Outerwear",
                  reason: "Similar design already in production",
                  image:
                    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
                },
              ].map((design) => (
                <div
                  key={design.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={design.image}
                      alt={design.title}
                      className="h-20 w-20 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium">{design.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        By {design.artist}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Rejected: {design.rejectedDate} • Category:{" "}
                        {design.category}
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        Reason: {design.reason}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="md">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      Reconsider
                    </Button>
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
