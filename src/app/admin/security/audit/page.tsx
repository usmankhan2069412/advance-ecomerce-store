import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import {
  Download,
  Calendar,
  Search,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

export default function SecurityAuditPage() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Security Audit Logs</h1>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Date Range
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search audit logs..."
              className="w-full rounded-md border border-input pl-8 pr-4 py-2 text-sm"
            />
          </div>
          <Button variant="outline">Filter</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  timestamp: "2024-05-25 14:32:45",
                  user: "admin@aetheria.com",
                  action: "User Login",
                  details: "Successful login from IP 192.168.1.1",
                  severity: "info",
                },
                {
                  id: 2,
                  timestamp: "2024-05-25 13:45:12",
                  user: "marcus@aetheria.com",
                  action: "Product Updated",
                  details: "Updated product 'Neural Couture Jacket' (ID: 1245)",
                  severity: "info",
                },
                {
                  id: 3,
                  timestamp: "2024-05-25 12:18:33",
                  user: "elena@aetheria.com",
                  action: "Order Status Changed",
                  details:
                    "Order #12458 status changed from 'Processing' to 'Shipped'",
                  severity: "info",
                },
                {
                  id: 4,
                  timestamp: "2024-05-25 11:05:27",
                  user: "system",
                  action: "Failed Login Attempt",
                  details:
                    "Multiple failed login attempts for user 'admin@aetheria.com' from IP 203.0.113.1",
                  severity: "warning",
                },
                {
                  id: 5,
                  timestamp: "2024-05-25 10:42:19",
                  user: "sophia@aetheria.com",
                  action: "Permission Changed",
                  details:
                    "Added 'Manage Payouts' permission to role 'Artist Coordinator'",
                  severity: "info",
                },
                {
                  id: 6,
                  timestamp: "2024-05-25 09:15:08",
                  user: "admin@aetheria.com",
                  action: "User Created",
                  details:
                    "Created new user 'james@aetheria.com' with role 'Content Manager'",
                  severity: "info",
                },
                {
                  id: 7,
                  timestamp: "2024-05-25 08:30:52",
                  user: "system",
                  action: "Security Alert",
                  details:
                    "Unusual access pattern detected from IP 198.51.100.1",
                  severity: "critical",
                },
                {
                  id: 8,
                  timestamp: "2024-05-24 17:45:33",
                  user: "admin@aetheria.com",
                  action: "System Settings Changed",
                  details: "Updated password policy settings",
                  severity: "info",
                },
                {
                  id: 9,
                  timestamp: "2024-05-24 16:22:15",
                  user: "olivia@aetheria.com",
                  action: "Bulk Action",
                  details: "Exported customer data for marketing campaign",
                  severity: "warning",
                },
                {
                  id: 10,
                  timestamp: "2024-05-24 15:10:41",
                  user: "ethan@aetheria.com",
                  action: "API Access",
                  details:
                    "Generated new API key for integration with marketing platform",
                  severity: "info",
                },
              ].map((log) => (
                <div
                  key={log.id}
                  className="flex items-start p-4 border rounded-lg bg-white"
                >
                  <div className="mr-3 mt-0.5">
                    {log.severity === "critical" && (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                    {log.severity === "warning" && (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    )}
                    {log.severity === "info" && (
                      <Info className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{log.action}</h3>
                      <span className="text-xs text-muted-foreground">
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {log.details}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      User: {log.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <Button variant="outline">Load More</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  timestamp: "2024-05-25 08:30:52",
                  title: "Unusual Access Pattern Detected",
                  description:
                    "Multiple rapid requests from IP 198.51.100.1 targeting admin endpoints.",
                  status: "Open",
                  severity: "High",
                },
                {
                  id: 2,
                  timestamp: "2024-05-24 11:05:27",
                  title: "Multiple Failed Login Attempts",
                  description:
                    "5 failed login attempts for user 'admin@aetheria.com' from IP 203.0.113.1.",
                  status: "Under Investigation",
                  severity: "Medium",
                },
                {
                  id: 3,
                  timestamp: "2024-05-23 14:18:05",
                  title: "Sensitive Data Export",
                  description:
                    "Large customer data export performed by user 'olivia@aetheria.com'.",
                  status: "Resolved",
                  severity: "Low",
                },
              ].map((alert) => (
                <div key={alert.id} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {alert.severity === "High" && (
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      {alert.severity === "Medium" && (
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                      )}
                      {alert.severity === "Low" && (
                        <Info className="h-5 w-5 text-blue-500 mr-2" />
                      )}
                      <h3 className="font-medium">{alert.title}</h3>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${alert.status === "Open" ? "bg-red-100 text-red-800" : alert.status === "Under Investigation" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}
                    >
                      {alert.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {alert.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-muted-foreground">
                      {alert.timestamp}
                    </span>
                    <div className="flex space-x-2">
                      {alert.status !== "Resolved" && (
                        <Button variant="outline" size="sm">
                          Mark as Resolved
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
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
