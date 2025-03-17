import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react";

export default function AIAnalyticsDashboard() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Analytics Dashboard</h1>
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Refresh Data
          </Button>
        </div>

        {/* Predictive Inventory Management */}
        <Card>
          <CardHeader>
            <CardTitle>Predictive Inventory Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="forecast">
              <TabsList className="mb-4">
                <TabsTrigger value="forecast">Demand Forecast</TabsTrigger>
                <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
                <TabsTrigger value="recommendations">
                  Recommendations
                </TabsTrigger>
              </TabsList>

              <TabsContent value="forecast">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Predicted Demand (Next 30 Days)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-md">
                        <LineChart className="h-12 w-12 text-gray-300" />
                        <p className="ml-4 text-gray-500">
                          Demand forecast chart
                        </p>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Highest Demand
                          </p>
                          <p className="text-lg font-bold">
                            Silk Evening Gowns
                          </p>
                          <p className="text-xs text-green-500">
                            +24% expected growth
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Lowest Demand
                          </p>
                          <p className="text-lg font-bold">
                            Winter Accessories
                          </p>
                          <p className="text-xs text-red-500">
                            -12% expected decline
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Inventory Risk Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-md">
                        <PieChart className="h-12 w-12 text-gray-300" />
                        <p className="ml-4 text-gray-500">
                          Risk assessment chart
                        </p>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm">Overstocked Items</p>
                          <p className="text-sm font-bold">12 products</p>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm">Understocked Items</p>
                          <p className="text-sm font-bold">8 products</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm">Optimal Stock</p>
                          <p className="text-sm font-bold">143 products</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        ML Model Accuracy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-md">
                        <BarChart3 className="h-12 w-12 text-gray-300" />
                        <p className="ml-4 text-gray-500">
                          Accuracy metrics chart
                        </p>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm">Current Model Accuracy</p>
                          <p className="text-sm font-bold">92.7%</p>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm">Previous Month</p>
                          <p className="text-sm font-bold">89.3%</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm">Improvement</p>
                          <p className="text-sm font-bold text-green-500">
                            +3.4%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="trends">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Emerging Product Categories
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            name: "Sustainable Luxury",
                            growth: "+42%",
                            trend: "up",
                          },
                          {
                            name: "AI Co-Created Pieces",
                            growth: "+38%",
                            trend: "up",
                          },
                          {
                            name: "Modular Fashion",
                            growth: "+27%",
                            trend: "up",
                          },
                          {
                            name: "Heritage Crafts",
                            growth: "+18%",
                            trend: "up",
                          },
                          {
                            name: "Fast Fashion",
                            growth: "-12%",
                            trend: "down",
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between"
                          >
                            <p className="text-sm font-medium">{item.name}</p>
                            <div className="flex items-center">
                              <p
                                className={`text-sm font-bold ${item.trend === "up" ? "text-green-500" : "text-red-500"}`}
                              >
                                {item.growth}
                              </p>
                              {item.trend === "up" ? (
                                <TrendingUp className="h-4 w-4 ml-1 text-green-500" />
                              ) : (
                                <TrendingDown className="h-4 w-4 ml-1 text-red-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Seasonal Trend Forecast
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
                        <LineChart className="h-12 w-12 text-gray-300" />
                        <p className="ml-4 text-gray-500">
                          Seasonal trend chart
                        </p>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Summer Collection
                          </p>
                          <p className="text-sm">
                            Focus on lightweight sustainable fabrics and modular
                            designs
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Fall Collection
                          </p>
                          <p className="text-sm">
                            Emphasis on AI-generated patterns and heritage
                            craftsmanship
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="recommendations">
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        AI-Generated Inventory Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 border border-green-100 rounded-md">
                          <h3 className="font-medium text-green-800">
                            Increase Production
                          </h3>
                          <p className="text-sm text-green-700 mt-1">
                            Increase Silk Evening Gown production by 30% to meet
                            projected demand spike in next 45 days.
                          </p>
                          <div className="flex justify-end mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                            >
                              Apply Recommendation
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-md">
                          <h3 className="font-medium text-amber-800">
                            Adjust Pricing
                          </h3>
                          <p className="text-sm text-amber-700 mt-1">
                            Consider 15% discount on Winter Accessories to
                            reduce excess inventory before season end.
                          </p>
                          <div className="flex justify-end mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                            >
                              Apply Recommendation
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
                          <h3 className="font-medium text-blue-800">
                            New Collection Opportunity
                          </h3>
                          <p className="text-sm text-blue-700 mt-1">
                            Data suggests high demand for sustainable luxury
                            items with AI-generated patterns. Consider new
                            collection.
                          </p>
                          <div className="flex justify-end mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                            >
                              Explore Opportunity
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Sentiment Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Analysis Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Brand Perception</TabsTrigger>
                <TabsTrigger value="products">Product Sentiment</TabsTrigger>
                <TabsTrigger value="social">Social Media Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Overall Brand Sentiment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="h-32 w-32 rounded-full bg-green-100 flex items-center justify-center mb-4">
                          <p className="text-3xl font-bold text-green-600">
                            87%
                          </p>
                        </div>
                        <p className="text-sm text-center">
                          Positive sentiment across all channels
                        </p>
                        <p className="text-xs text-green-500 mt-2">
                          +5.2% from previous month
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Sentiment by Channel
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-md">
                        <BarChart3 className="h-12 w-12 text-gray-300" />
                        <p className="ml-4 text-gray-500">
                          Channel sentiment chart
                        </p>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm">Instagram</p>
                          <p className="text-sm font-bold text-green-500">
                            92% positive
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm">Twitter</p>
                          <p className="text-sm font-bold text-green-500">
                            78% positive
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm">Product Reviews</p>
                          <p className="text-sm font-bold text-green-500">
                            89% positive
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Key Sentiment Drivers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-green-600">
                            Positive Factors
                          </p>
                          <ul className="mt-2 space-y-1">
                            <li className="text-sm flex items-center">
                              <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                              Product quality (mentioned in 78% of positive
                              reviews)
                            </li>
                            <li className="text-sm flex items-center">
                              <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                              Sustainability efforts (65%)
                            </li>
                            <li className="text-sm flex items-center">
                              <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                              Unique designs (59%)
                            </li>
                          </ul>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-red-600">
                            Negative Factors
                          </p>
                          <ul className="mt-2 space-y-1">
                            <li className="text-sm flex items-center">
                              <div className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                              Pricing concerns (mentioned in 42% of negative
                              reviews)
                            </li>
                            <li className="text-sm flex items-center">
                              <div className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                              Shipping delays (38%)
                            </li>
                            <li className="text-sm flex items-center">
                              <div className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                              Size inconsistency (27%)
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="products">
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Product Sentiment Rankings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            name: "Neural Couture Collection",
                            sentiment: 96,
                            reviews: 342,
                            trend: "up",
                          },
                          {
                            name: "Ethereal Silk Gown",
                            sentiment: 94,
                            reviews: 287,
                            trend: "up",
                          },
                          {
                            name: "Quantum Silk Series",
                            sentiment: 91,
                            reviews: 203,
                            trend: "up",
                          },
                          {
                            name: "Digital Renaissance Collection",
                            sentiment: 88,
                            reviews: 176,
                            trend: "up",
                          },
                          {
                            name: "Structured Wool Blazer",
                            sentiment: 72,
                            reviews: 154,
                            trend: "down",
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                          >
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.reviews} reviews analyzed
                              </p>
                            </div>
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                <p className="text-sm font-bold text-green-600">
                                  {item.sentiment}%
                                </p>
                              </div>
                              {item.trend === "up" ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="social">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Social Media Engagement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-md">
                        <LineChart className="h-12 w-12 text-gray-300" />
                        <p className="ml-4 text-gray-500">
                          Engagement metrics chart
                        </p>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">
                            Mentions
                          </p>
                          <p className="text-lg font-bold">12.4K</p>
                          <p className="text-xs text-green-500">+18%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">
                            Impressions
                          </p>
                          <p className="text-lg font-bold">3.2M</p>
                          <p className="text-xs text-green-500">+24%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">
                            Engagement
                          </p>
                          <p className="text-lg font-bold">427K</p>
                          <p className="text-xs text-green-500">+32%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Trending Hashtags
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { tag: "#AetheriaStyle", count: "8.2K posts" },
                          { tag: "#AIFashion", count: "6.7K posts" },
                          { tag: "#NeuralCouture", count: "5.9K posts" },
                          { tag: "#SustainableLuxury", count: "4.3K posts" },
                          { tag: "#DigitalRenaissance", count: "3.8K posts" },
                          { tag: "#QuantumSilk", count: "3.2K posts" },
                          { tag: "#FashionFuture", count: "2.9K posts" },
                          { tag: "#ArtistCollabs", count: "2.7K posts" },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="px-3 py-2 bg-gray-100 rounded-full"
                          >
                            <p className="text-sm font-medium">{item.tag}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.count}
                            </p>
                          </div>
                        ))}
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
