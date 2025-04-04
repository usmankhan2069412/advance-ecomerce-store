import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Calendar, DollarSign, FileText } from "lucide-react";

export default function ArtistPayoutsPage() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Artist Payouts</h1>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Date Range
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> Process Payouts
            </Button>
          </div>
        </div>

        {/* Artist Earnings Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Pending Payouts
                  </p>
                  <h3 className="text-2xl font-bold">$24,850</h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">vs last month</span>
                  <span className="text-green-500 font-medium">+12.5%</span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full mt-1">
                  <div className="w-[65%] h-1 bg-primary rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Artists to Pay
                  </p>
                  <h3 className="text-2xl font-bold">28</h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">vs last month</span>
                  <span className="text-green-500 font-medium">+8.3%</span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full mt-1">
                  <div className="w-[58%] h-1 bg-primary rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Payouts This Month
                  </p>
                  <h3 className="text-2xl font-bold">$18,450</h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">vs last month</span>
                  <span className="text-green-500 font-medium">+15.2%</span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full mt-1">
                  <div className="w-[72%] h-1 bg-primary rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg. Payout per Artist
                  </p>
                  <h3 className="text-2xl font-bold">$887</h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">vs last month</span>
                  <span className="text-green-500 font-medium">+3.8%</span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full mt-1">
                  <div className="w-[45%] h-1 bg-primary rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <Tabs defaultValue="pending">
              <TabsList>
                <TabsTrigger value="pending">Pending Payouts</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="pending" className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left font-medium">
                        Artist
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Amount
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Items Sold
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Period
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Status
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        id: 1,
                        artist: "Elena Vega",
                        amount: "$1,850.00",
                        itemsSold: 28,
                        period: "May 1-15, 2024",
                        status: "Ready for Payment",
                      },
                      {
                        id: 2,
                        artist: "Marcus Chen",
                        amount: "$1,240.00",
                        itemsSold: 18,
                        period: "May 1-15, 2024",
                        status: "Ready for Payment",
                      },
                      {
                        id: 3,
                        artist: "Sophia Williams",
                        amount: "$980.00",
                        itemsSold: 15,
                        period: "May 1-15, 2024",
                        status: "Ready for Payment",
                      },
                      {
                        id: 4,
                        artist: "James Wilson",
                        amount: "$720.00",
                        itemsSold: 12,
                        period: "May 1-15, 2024",
                        status: "Pending Review",
                      },
                      {
                        id: 5,
                        artist: "Olivia Chen",
                        amount: "$650.00",
                        itemsSold: 10,
                        period: "May 1-15, 2024",
                        status: "Pending Review",
                      },
                    ].map((row, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{row.artist}</td>
                        <td className="py-2 px-4 font-medium">{row.amount}</td>
                        <td className="py-2 px-4">{row.itemsSold}</td>
                        <td className="py-2 px-4">{row.period}</td>
                        <td className="py-2 px-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${row.status === "Ready for Payment" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <FileText className="h-3 w-3" /> Details
                            </Button>
                            {row.status === "Ready for Payment" && (
                              <Button
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                <DollarSign className="h-3 w-3" /> Pay
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="processing" className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left font-medium">
                        Artist
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Amount
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Payment Method
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Initiated
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Status
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        id: 1,
                        artist: "Ethan Johnson",
                        amount: "$1,450.00",
                        paymentMethod: "Bank Transfer",
                        initiated: "May 16, 2024",
                        status: "Processing",
                      },
                      {
                        id: 2,
                        artist: "Isabella Kim",
                        amount: "$980.00",
                        paymentMethod: "PayPal",
                        initiated: "May 16, 2024",
                        status: "Processing",
                      },
                    ].map((row, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{row.artist}</td>
                        <td className="py-2 px-4 font-medium">{row.amount}</td>
                        <td className="py-2 px-4">{row.paymentMethod}</td>
                        <td className="py-2 px-4">{row.initiated}</td>
                        <td className="py-2 px-4">
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            {row.status}
                          </span>
                        </td>
                        <td className="py-2 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <FileText className="h-3 w-3" /> Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left font-medium">
                        Artist
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Amount
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Payment Method
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Completed
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Reference
                      </th>
                      <th className="py-2 px-4 text-left font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        id: 1,
                        artist: "Elena Vega",
                        amount: "$1,650.00",
                        paymentMethod: "Bank Transfer",
                        completed: "May 2, 2024",
                        reference: "PAY-2024050201",
                      },
                      {
                        id: 2,
                        artist: "Marcus Chen",
                        amount: "$1,120.00",
                        paymentMethod: "PayPal",
                        completed: "May 2, 2024",
                        reference: "PAY-2024050202",
                      },
                      {
                        id: 3,
                        artist: "Sophia Williams",
                        amount: "$890.00",
                        paymentMethod: "Bank Transfer",
                        completed: "May 2, 2024",
                        reference: "PAY-2024050203",
                      },
                    ].map((row, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{row.artist}</td>
                        <td className="py-2 px-4 font-medium">{row.amount}</td>
                        <td className="py-2 px-4">{row.paymentMethod}</td>
                        <td className="py-2 px-4">{row.completed}</td>
                        <td className="py-2 px-4">
                          <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                            {row.reference}
                          </span>
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <FileText className="h-3 w-3" /> Receipt
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Download className="h-3 w-3" /> Export
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
