import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Shield, Lock, FileText, UserX, CreditCard, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";

export default function SecurityCompliance() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Security & Compliance</h1>
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh Status
          </Button>
        </div>

        {/* GDPR/CCPA Compliance */}
        <Card>
          <CardHeader>
            <CardTitle>GDPR/CCPA Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="dashboard">
              <TabsList className="mb-4">
                <TabsTrigger value="dashboard">Compliance Dashboard</TabsTrigger>
                <TabsTrigger value="requests">Data Deletion Requests</TabsTrigger>
                <TabsTrigger value="settings">Compliance Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <ComplianceStatusCard />
                  <ComplianceMetricsCard />
                  <RecentActivityCard />
                </div>
              </TabsContent>

              <TabsContent value="requests">
                <DataDeletionRequestsCard />
              </TabsContent>

              <TabsContent value="settings">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <AutomatedComplianceSettingsCard />
                  <DataProcessingConfigurationCard />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Fraud Detection */}
        <Card>
          <CardHeader>
            <CardTitle>Fraud Detection</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="dashboard">
              <TabsList className="mb-4">
                <TabsTrigger value="dashboard">Fraud Dashboard</TabsTrigger>
                <TabsTrigger value="alerts">Recent Alerts</TabsTrigger>
                <TabsTrigger value="settings">ML Model Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <FraudDetectionSummaryCard />
                  <FraudMetricsCard />
                  <FraudPatternsCard />
                </div>
              </TabsContent>

              <TabsContent value="alerts">
                <RecentAlertsCard />
              </TabsContent>

              <TabsContent value="settings">
                <MLModelConfigurationCard />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

const ComplianceStatusCard = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col items-center justify-center py-6">
        <div className="h-32 w-32 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <Shield className="h-16 w-16 text-green-600" />
        </div>
        <Badge className="bg-green-500 mb-2">Compliant</Badge>
        <p className="text-sm text-center">All systems meet GDPR and CCPA requirements</p>
        <p className="text-xs text-muted-foreground mt-2">Last audit: November 10, 2023</p>
      </div>
    </CardContent>
  </Card>
);

const ComplianceMetricsCard = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">Compliance Metrics</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          { label: "GDPR Compliance", value: 98 },
          { label: "CCPA Compliance", value: 100 },
          { label: "Data Request Response Time", value: 92, unit: "12 hours avg." },
          { label: "Data Mapping Completeness", value: 96 },
        ].map((metric, i) => (
          <div key={i}>
            <div className="flex justify-between mb-2">
              <p className="text-sm">{metric.label}</p>
              <p className="text-sm font-medium">{metric.unit || `${metric.value}%`}</p>
            </div>
            <Progress value={metric.value} className="h-2" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const RecentActivityCard = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          {
            action: "Data deletion completed",
            time: "2 hours ago",
            details: "User ID: 78293 - All data removed",
            icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          },
          {
            action: "Privacy policy updated",
            time: "1 day ago",
            details: "Changes to section 3.2 regarding data processing",
            icon: <FileText className="h-4 w-4 text-blue-500" />,
          },
          {
            action: "Data access request",
            time: "2 days ago",
            details: "User ID: 77104 - Fulfilled within 4 hours",
            icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          },
          {
            action: "Consent management update",
            time: "3 days ago",
            details: "Added granular consent options for marketing",
            icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          },
        ].map((item, i) => (
          <div key={i} className="flex items-start">
            <div className="mr-2 mt-0.5">{item.icon}</div>
            <div>
              <p className="text-sm font-medium">{item.action}</p>
              <p className="text-xs text-muted-foreground">{item.details}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const DataDeletionRequestsCard = () => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Data Deletion Requests</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="rounded-full">
            Auto-Delete Enabled
          </Badge>
          <Button size="sm">New Request</Button>
        </div>
      </div>
      <div className="space-y-4">
        {[
          {
            id: "REQ-3892",
            user: "john.doe@example.com",
            date: "2023-11-12",
            status: "Completed",
            type: "GDPR",
            completionTime: "4 hours",
          },
          {
            id: "REQ-3891",
            user: "sarah.smith@example.com",
            date: "2023-11-11",
            status: "In Progress",
            type: "CCPA",
            completionTime: "2 hours (estimated)",
          },
          {
            id: "REQ-3890",
            user: "michael.brown@example.com",
            date: "2023-11-10",
            status: "Completed",
            type: "GDPR",
            completionTime: "6 hours",
          },
          {
            id: "REQ-3889",
            user: "emily.johnson@example.com",
            date: "2023-11-09",
            status: "Completed",
            type: "CCPA",
            completionTime: "5 hours",
          },
        ].map((request, i) => (
          <div key={i} className="p-4 border rounded-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center">
                  <h4 className="font-medium">{request.id}</h4>
                  <Badge variant={request.status === "Completed" ? "outline" : "secondary"} className="ml-2">
                    {request.status}
                  </Badge>
                  <Badge variant="outline" className="ml-2">
                    {request.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{request.user}</p>
              </div>
              <div className="flex items-center mt-2 md:mt-0">
                <div className="flex items-center mr-4">
                  <UserX className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm">Full Account Deletion</span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm">{request.completionTime}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const AutomatedComplianceSettingsCard = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">Automated Compliance Settings</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          { label: "Auto-Delete User Data", description: "Automatically process deletion requests" },
          { label: "Data Retention Limits", description: "Auto-delete data older than 24 months" },
          { label: "Consent Expiration", description: "Prompt users to renew consent annually" },
          { label: "Automated Compliance Reports", description: "Generate monthly compliance reports" },
        ].map((setting, i) => (
          <div key={i} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{setting.label}</p>
              <p className="text-xs text-muted-foreground">{setting.description}</p>
            </div>
            <div className="flex h-5 items-center">
              <input id={`setting-${i}`} type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const DataProcessingConfigurationCard = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">Data Processing Configuration</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          { label: "Data Deletion Response Time", options: ["12 hours (recommended)", "24 hours", "48 hours", "72 hours (maximum)"] },
          { label: "Data Retention Period", options: ["6 months", "12 months", "24 months (recommended)", "36 months"] },
          { label: "User Data Anonymization", options: ["Full anonymization", "Partial anonymization (analytics only)", "No anonymization"] },
        ].map((config, i) => (
          <div key={i}>
            <label className="text-sm font-medium">{config.label}</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              {config.options.map((option, j) => (
                <option key={j}>{option}</option>
              ))}
            </select>
          </div>
        ))}
        <div className="pt-4">
          <Button className="w-full">Save Settings</Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const FraudDetectionSummaryCard = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">Fraud Detection Summary</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col items-center justify-center py-6">
        <div className="h-32 w-32 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <Lock className="h-16 w-16 text-blue-600" />
        </div>
        <p className="text-xl font-bold">98.7%</p>
        <p className="text-sm text-center">Fraud detection accuracy</p>
        <p className="text-xs text-green-500 mt-2">+1.2% from previous month</p>
      </div>
    </CardContent>
  </Card>
);

const FraudMetricsCard = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">Fraud Metrics</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          { label: "Transactions Analyzed", value: "24,892" },
          { label: "Flagged as Suspicious", value: "342 (1.4%)", color: "text-amber-500" },
          { label: "Confirmed Fraud", value: "87 (0.3%)", color: "text-red-500" },
          { label: "False Positives", value: "43 (12.6%)" },
          { label: "Prevented Loss", value: "$142,876", color: "text-green-500" },
        ].map((metric, i) => (
          <div key={i} className="flex items-center justify-between">
            <p className="text-sm">{metric.label}</p>
            <p className={`text-sm font-bold ${metric.color}`}>{metric.value}</p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const FraudPatternsCard = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">Fraud Patterns</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          { pattern: "Multiple Failed Payments", percentage: "38%", trend: "up" },
          { pattern: "Unusual Location", percentage: "27%", trend: "up" },
          { pattern: "Rapid Multiple Purchases", percentage: "18%", trend: "down" },
          { pattern: "Account Takeover Attempts", percentage: "12%", trend: "up" },
          { pattern: "Other Patterns", percentage: "5%", trend: "stable" },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <p className="text-sm">{item.pattern}</p>
            <div className="flex items-center">
              <p className="text-sm font-bold">{item.percentage}</p>
              {item.trend === "up" && <TrendingUp className="h-4 w-4 ml-1 text-red-500" />}
              {item.trend === "down" && <TrendingDown className="h-4 w-4 ml-1 text-green-500" />}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const RecentAlertsCard = () => (
  <Card>
    <CardContent className="pt-6">
      <div className="space-y-6">
        {[
          {
            id: "ALERT-4721",
            time: "2 hours ago",
            type: "Multiple Failed Payments",
            risk: "High",
            user: "IP: 185.243.XX.XX",
            details: "5 failed payment attempts with different cards",
            action: "Account temporarily locked",
          },
          {
            id: "ALERT-4720",
            time: "5 hours ago",
            type: "Unusual Location",
            risk: "Medium",
            user: "customer@example.com",
            details: "Login from unusual location (Brazil) - Previous logins from US",
            action: "Additional verification required",
          },
          {
            id: "ALERT-4719",
            time: "1 day ago",
            type: "Rapid Multiple Purchases",
            risk: "Medium",
            user: "john.smith@example.com",
            details: "12 purchases in 5 minutes totaling $4,892",
            action: "Transaction held for review",
          },
          {
            id: "ALERT-4718",
            time: "1 day ago",
            type: "Account Takeover Attempt",
            risk: "High",
            user: "sarah.jones@example.com",
            details: "Multiple password reset attempts from unrecognized device",
            action: "Account locked, customer notified",
          },
        ].map((alert, i) => (
          <div key={i} className="p-4 border rounded-md">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center">
                  <h4 className="font-medium">{alert.id}</h4>
                  <Badge variant={alert.risk === "High" ? "destructive" : "secondary"} className="ml-2">
                    {alert.risk} Risk
                  </Badge>
                </div>
                <p className="text-sm font-medium mt-2">{alert.type}</p>
                <p className="text-sm text-muted-foreground">{alert.user}</p>
                <p className="text-sm mt-2">{alert.details}</p>
                <div className="mt-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                  <p className="text-sm font-medium">{alert.action}</p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 md:ml-4 md:text-right">
                <p className="text-sm text-muted-foreground">{alert.time}</p>
                <div className="mt-4 flex md:justify-end gap-2">
                  <Button size="sm" variant="outline">Dismiss</Button>
                  <Button size="sm">Review</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const MLModelConfigurationCard = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">ML Model Configuration</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          { label: "Detection Sensitivity", options: ["High", "Medium", "Low"] },
          { label: "Model Update Frequency", options: ["Daily", "Weekly", "Monthly"] },
          { label: "Data Source", options: ["Internal Data", "External Data", "Both"] },
        ].map((config, i) => (
          <div key={i}>
            <label className="text-sm font-medium">{config.label}</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              {config.options.map((option, j) => (
                <option key={j}>{option}</option>
              ))}
            </select>
          </div>
        ))}
        <div className="pt-4">
          <Button className="w-full">Save Settings</Button>
        </div>
      </div>
    </CardContent>
  </Card>
);
