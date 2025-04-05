"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";

/**
 * Admin Home Page
 * Displays overview statistics and key metrics
 */
export default function AdminHomePage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome to your admin dashboard</p>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Sales</p>
                  <h3 className="text-2xl font-bold mt-1">$24,780</h3>
                  <p className="text-xs text-green-500 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.5% from last month
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Orders</p>
                  <h3 className="text-2xl font-bold mt-1">342</h3>
                  <p className="text-xs text-green-500 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8.2% from last month
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Customers</p>
                  <h3 className="text-2xl font-bold mt-1">1,249</h3>
                  <p className="text-xs text-green-500 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5.3% from last month
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                  <h3 className="text-2xl font-bold mt-1">3.2%</h3>
                  <p className="text-xs text-red-500 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    -0.4% from last month
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">No recent activity to display.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
