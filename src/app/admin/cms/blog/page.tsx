import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BlogManagement() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Blog Management</h1>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Create New Post
          </Button>
        </div>

        <Card>
          <CardHeader>
            <Tabs defaultValue="posts">
              <TabsList>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="authors">Authors</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="posts" className="space-y-4 mt-4">
              {[
                {
                  id: 1,
                  title: "The Future of AI in Fashion Design",
                  author: "Elena Vega",
                  category: "Technology",
                  date: "2024-05-20",
                  status: "Published",
                  image:
                    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",
                },
                {
                  id: 2,
                  title: "Sustainable Practices in Luxury Fashion",
                  author: "Marcus Chen",
                  category: "Sustainability",
                  date: "2024-05-15",
                  status: "Published",
                  image:
                    "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&q=80",
                },
                {
                  id: 3,
                  title: "Summer 2024 Fashion Trends",
                  author: "Sophia Williams",
                  category: "Trends",
                  date: "2024-05-10",
                  status: "Draft",
                  image:
                    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
                },
              ].map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-16 w-24 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        By {post.author} in {post.category}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                          {post.date}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${post.status === "Published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                        >
                          {post.status}
                        </span>
                      </div>
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
            </TabsContent>

            <TabsContent value="categories" className="space-y-4 mt-4">
              {[
                { id: 1, name: "Technology", posts: 12 },
                { id: 2, name: "Sustainability", posts: 8 },
                { id: 3, name: "Trends", posts: 15 },
                { id: 4, name: "Designer Spotlight", posts: 6 },
                { id: 5, name: "Fashion Events", posts: 9 },
              ].map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white"
                >
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.posts} posts
                    </p>
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
              <Button
                variant="outline"
                className="flex items-center gap-2 mt-4"
              >
                <PlusCircle className="h-4 w-4" /> Add Category
              </Button>
            </TabsContent>

            <TabsContent value="authors" className="space-y-4 mt-4">
              {[
                {
                  id: 1,
                  name: "Elena Vega",
                  role: "Fashion Technology Editor",
                  posts: 8,
                  image:
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
                },
                {
                  id: 2,
                  name: "Marcus Chen",
                  role: "Sustainability Correspondent",
                  posts: 6,
                  image:
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
                },
                {
                  id: 3,
                  name: "Sophia Williams",
                  role: "Trend Analyst",
                  posts: 10,
                  image:
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
                },
              ].map((author) => (
                <div
                  key={author.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={author.image}
                      alt={author.name}
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium">{author.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {author.role}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {author.posts} posts
                      </p>
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
              <Button
                variant="outline"
                className="flex items-center gap-2 mt-4"
              >
                <PlusCircle className="h-4 w-4" /> Add Author
              </Button>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
