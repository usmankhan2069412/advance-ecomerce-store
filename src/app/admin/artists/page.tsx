import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Image,
  TrendingUp,
  Calendar,
} from "lucide-react";

export default function ArtistManagement() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Artist Management</h1>
          <Button className="flex items-center gap-2">
            <span className="hidden sm:inline">New Artist</span>
            <span className="sm:hidden">+</span>
          </Button>
        </div>

        {/* AI Plagiarism Checker */}
        <Card>
          <CardHeader>
            <CardTitle>AI Plagiarism Checker</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="dashboard">
              <TabsList className="mb-4">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="scan">New Scan</TabsTrigger>
                <TabsTrigger value="history">Scan History</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Plagiarism Detection Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="h-32 w-32 rounded-full bg-green-100 flex items-center justify-center mb-4">
                          <p className="text-3xl font-bold text-green-600">
                            98.2%
                          </p>
                        </div>
                        <p className="text-sm text-center">
                          Original designs verified
                        </p>
                        <p className="text-xs text-green-500 mt-2">
                          +1.3% from previous month
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Recent Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            design: "Pattern #A2947",
                            artist: "Marcus Rivera",
                            similarity: "87% match",
                            status: "Under Review",
                          },
                          {
                            design: "Textile #B1038",
                            artist: "Sophia Chen",
                            similarity: "76% match",
                            status: "Cleared",
                          },
                          {
                            design: "Motif #C3821",
                            artist: "Amara Johnson",
                            similarity: "92% match",
                            status: "Flagged",
                          },
                        ].map((item, i) => (
                          <div key={i} className="p-3 bg-gray-50 rounded-md">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{item.design}</p>
                                <p className="text-xs text-muted-foreground">
                                  By {item.artist}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  item.status === "Flagged"
                                    ? "destructive"
                                    : item.status === "Cleared"
                                      ? "outline"
                                      : "secondary"
                                }
                              >
                                {item.status}
                              </Badge>
                            </div>
                            <p className="text-sm mt-2">
                              <AlertTriangle className="h-4 w-4 inline-block mr-1 text-amber-500" />
                              {item.similarity} with existing designs
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        System Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium">
                            Image Hashing Accuracy
                          </p>
                          <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                            <div
                              className="h-2 bg-green-500 rounded-full"
                              style={{ width: "94%" }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <p className="text-xs text-muted-foreground">
                              Current
                            </p>
                            <p className="text-xs font-medium">94%</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium">
                            False Positive Rate
                          </p>
                          <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                            <div
                              className="h-2 bg-amber-500 rounded-full"
                              style={{ width: "3.2%" }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <p className="text-xs text-muted-foreground">
                              Current
                            </p>
                            <p className="text-xs font-medium">3.2%</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium">Processing Time</p>
                          <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                            <div
                              className="h-2 bg-blue-500 rounded-full"
                              style={{ width: "87%" }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <p className="text-xs text-muted-foreground">
                              Average
                            </p>
                            <p className="text-xs font-medium">
                              1.3 seconds per image
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="scan">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-10 text-center">
                        <Image className="h-10 w-10 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium">
                          Upload Design for Plagiarism Check
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 mb-4">
                          Drag and drop image files or click to browse
                        </p>
                        <Button>Upload Files</Button>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">
                          Scan Settings
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="text-sm font-medium">
                              Similarity Threshold
                            </label>
                            <div className="flex items-center mt-2">
                              <Input
                                type="range"
                                min="50"
                                max="100"
                                defaultValue="75"
                                className="w-full"
                              />
                              <span className="ml-2 text-sm font-medium">
                                75%
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">
                              Database Selection
                            </label>
                            <div className="flex gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                              >
                                Internal Only
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                              >
                                Global Database
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Start Scan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search scan history..."
                          className="pl-8"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Filter className="h-4 w-4" />
                        Filter
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          id: "SCAN-7829",
                          date: "2023-11-12",
                          designs: 24,
                          flagged: 1,
                          artist: "Sophia Chen",
                          collection: "Neural Couture Collection",
                        },
                        {
                          id: "SCAN-7814",
                          date: "2023-11-08",
                          designs: 18,
                          flagged: 0,
                          artist: "Marcus Rivera",
                          collection: "Quantum Silk Series",
                        },
                        {
                          id: "SCAN-7802",
                          date: "2023-11-05",
                          designs: 32,
                          flagged: 2,
                          artist: "Amara Johnson",
                          collection: "Digital Renaissance",
                        },
                        {
                          id: "SCAN-7791",
                          date: "2023-10-29",
                          designs: 15,
                          flagged: 0,
                          artist: "Sophia Chen",
                          collection: "Neural Couture Collection",
                        },
                      ].map((scan, i) => (
                        <div key={i} className="p-4 border rounded-md">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-medium">{scan.id}</h3>
                                <Badge
                                  variant={
                                    scan.flagged > 0 ? "destructive" : "outline"
                                  }
                                  className="ml-2"
                                >
                                  {scan.flagged > 0
                                    ? `${scan.flagged} Flagged`
                                    : "All Clear"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {scan.collection} by {scan.artist}
                              </p>
                            </div>
                            <div className="flex items-center mt-2 md:mt-0">
                              <div className="flex items-center mr-4">
                                <Image className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span className="text-sm">
                                  {scan.designs} designs
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span className="text-sm">{scan.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Trend Forecasting */}
        <Card>
          <CardHeader>
            <CardTitle>Trend Forecasting</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="trends">
              <TabsList className="mb-4">
                <TabsTrigger value="trends">Emerging Trends</TabsTrigger>
                <TabsTrigger value="social">Social Media Insights</TabsTrigger>
                <TabsTrigger value="recommendations">
                  Design Recommendations
                </TabsTrigger>
              </TabsList>

              <TabsContent value="trends">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Trending Design Elements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            name: "Biomimetic Patterns",
                            growth: "+58%",
                            trend: "up",
                          },
                          {
                            name: "Quantum-Inspired Textures",
                            growth: "+42%",
                            trend: "up",
                          },
                          {
                            name: "Sustainable Dyes",
                            growth: "+37%",
                            trend: "up",
                          },
                          {
                            name: "Heritage Craftsmanship",
                            growth: "+29%",
                            trend: "up",
                          },
                          {
                            name: "Modular Components",
                            growth: "+24%",
                            trend: "up",
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                          >
                            <p className="text-sm font-medium">{item.name}</p>
                            <div className="flex items-center">
                              <p className="text-sm font-bold text-green-500">
                                {item.growth}
                              </p>
                              <TrendingUp className="h-4 w-4 ml-1 text-green-500" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Trend Forecast Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="relative pl-6 border-l-2 border-gray-200 pb-6">
                          <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-blue-500"></div>
                          <h3 className="text-sm font-medium">
                            Current Season (Fall 2023)
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            Dominant: AI-generated patterns, sustainable luxury,
                            heritage crafts
                          </p>
                        </div>

                        <div className="relative pl-6 border-l-2 border-gray-200 pb-6">
                          <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-green-500"></div>
                          <h3 className="text-sm font-medium">
                            Emerging (Winter 2023-2024)
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            Rising: Biomimetic patterns, quantum-inspired
                            textures, modular designs
                          </p>
                        </div>

                        <div className="relative pl-6 border-l-2 border-gray-200 pb-6">
                          <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-amber-500"></div>
                          <h3 className="text-sm font-medium">
                            Future Forecast (Spring 2024)
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            Predicted: Adaptive textiles, neural architecture
                            influences, carbon-negative materials
                          </p>
                        </div>

                        <div className="relative pl-6">
                          <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-purple-500"></div>
                          <h3 className="text-sm font-medium">
                            Long-term Prediction (Summer 2024)
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            Emerging signals: Biotech fabrication,
                            climate-responsive designs, digital-physical hybrids
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="social">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Social Media Trend Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
                        <TrendingUp className="h-12 w-12 text-gray-300" />
                        <p className="ml-4 text-gray-500">
                          Social media trend visualization
                        </p>
                      </div>
                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-sm font-medium">Top Platforms</p>
                          <ul className="mt-2 space-y-1">
                            <li className="text-sm flex items-center justify-between">
                              <span>Instagram</span>
                              <span className="font-medium">42%</span>
                            </li>
                            <li className="text-sm flex items-center justify-between">
                              <span>TikTok</span>
                              <span className="font-medium">28%</span>
                            </li>
                            <li className="text-sm flex items-center justify-between">
                              <span>Pinterest</span>
                              <span className="font-medium">18%</span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <p className="text-sm font-medium">Key Influencers</p>
                          <ul className="mt-2 space-y-1">
                            <li className="text-sm flex items-center justify-between">
                              <span>Fashion Tech</span>
                              <span className="font-medium">37%</span>
                            </li>
                            <li className="text-sm flex items-center justify-between">
                              <span>Sustainable</span>
                              <span className="font-medium">32%</span>
                            </li>
                            <li className="text-sm flex items-center justify-between">
                              <span>AI Artists</span>
                              <span className="font-medium">24%</span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <p className="text-sm font-medium">Content Types</p>
                          <ul className="mt-2 space-y-1">
                            <li className="text-sm flex items-center justify-between">
                              <span>Video</span>
                              <span className="font-medium">54%</span>
                            </li>
                            <li className="text-sm flex items-center justify-between">
                              <span>Images</span>
                              <span className="font-medium">32%</span>
                            </li>
                            <li className="text-sm flex items-center justify-between">
                              <span>Stories</span>
                              <span className="font-medium">14%</span>
                            </li>
                          </ul>
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
                      <div className="space-y-3">
                        {[
                          { tag: "#AIFashion", posts: "1.2M", growth: "+128%" },
                          {
                            tag: "#SustainableLuxury",
                            posts: "842K",
                            growth: "+87%",
                          },
                          {
                            tag: "#DigitalCouture",
                            posts: "623K",
                            growth: "+74%",
                          },
                          { tag: "#BioDesign", posts: "418K", growth: "+62%" },
                          {
                            tag: "#QuantumFashion",
                            posts: "356K",
                            growth: "+58%",
                          },
                          {
                            tag: "#NeuralPatterns",
                            posts: "289K",
                            growth: "+52%",
                          },
                          {
                            tag: "#FashionTech",
                            posts: "1.8M",
                            growth: "+47%",
                          },
                          {
                            tag: "#EthicalStyle",
                            posts: "1.1M",
                            growth: "+43%",
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <p className="text-sm font-medium">{item.tag}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.posts} posts
                              </p>
                            </div>
                            <p className="text-sm font-bold text-green-500">
                              {item.growth}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="recommendations">
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        AI-Generated Design Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="p-4 border rounded-md">
                          <h3 className="font-medium">Biomimetic Collection</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Designs inspired by natural structures and
                            processes, combined with AI pattern generation
                          </p>
                          <div className="mt-4 space-y-2">
                            <p className="text-xs font-medium">Key Elements:</p>
                            <ul className="text-xs space-y-1">
                              <li>• Coral reef textures</li>
                              <li>• Neural network-enhanced patterns</li>
                              <li>• Biodegradable materials</li>
                              <li>• Adaptive structural elements</li>
                            </ul>
                          </div>
                          <div className="mt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                            >
                              Generate Concepts
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 border rounded-md">
                          <h3 className="font-medium">Quantum Textiles</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Fabrics with patterns inspired by quantum physics
                            visualizations and computational design
                          </p>
                          <div className="mt-4 space-y-2">
                            <p className="text-xs font-medium">Key Elements:</p>
                            <ul className="text-xs space-y-1">
                              <li>• Wave function patterns</li>
                              <li>• Interference-inspired textures</li>
                              <li>• Color-shifting properties</li>
                              <li>• Modular construction techniques</li>
                            </ul>
                          </div>
                          <div className="mt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                            >
                              Generate Concepts
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 border rounded-md">
                          <h3 className="font-medium">Heritage Fusion</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Traditional craftsmanship techniques enhanced with
                            AI-generated patterns and sustainable materials
                          </p>
                          <div className="mt-4 space-y-2">
                            <p className="text-xs font-medium">Key Elements:</p>
                            <ul className="text-xs space-y-1">
                              <li>• Hand-woven base materials</li>
                              <li>• AI-enhanced traditional motifs</li>
                              <li>• Cultural storytelling elements</li>
                              <li>• Artisanal finishing techniques</li>
                            </ul>
                          </div>
                          <div className="mt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                            >
                              Generate Concepts
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
      </div>
    </AdminLayout>
  );
}
