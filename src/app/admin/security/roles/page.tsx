import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Users, Shield } from "lucide-react";

export default function UserRolesPage() {
  return (
    <AdminLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Roles & Permissions</h1>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Create New Role
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  name: "Super Admin",
                  description:
                    "Full access to all system features and settings",
                  users: 2,
                  permissions: "All permissions",
                },
                {
                  id: 2,
                  name: "Content Manager",
                  description: "Manage content, blog posts, and static pages",
                  users: 5,
                  permissions: "CMS, Blog, Media Library",
                },
                {
                  id: 3,
                  name: "Product Manager",
                  description: "Manage products, categories, and inventory",
                  users: 4,
                  permissions: "Products, Categories, Inventory",
                },
                {
                  id: 4,
                  name: "Order Manager",
                  description: "Manage orders, shipping, and refunds",
                  users: 3,
                  permissions: "Orders, Shipping, Refunds",
                },
                {
                  id: 5,
                  name: "Artist Coordinator",
                  description: "Manage artist submissions and payouts",
                  users: 2,
                  permissions: "Artists, Designs, Payouts",
                },
                {
                  id: 6,
                  name: "Analytics Viewer",
                  description: "View reports and analytics data",
                  users: 8,
                  permissions: "Reports, Analytics (read-only)",
                },
              ].map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white"
                >
                  <div>
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-primary" />
                      <h3 className="font-medium">{role.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {role.description}
                    </p>
                    <div className="flex items-center mt-1">
                      <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {role.users} users
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="font-medium">Permissions:</span>{" "}
                      {role.permissions}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    {role.name !== "Super Admin" && (
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permission Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  name: "Content Management",
                  permissions: [
                    "View CMS",
                    "Edit Pages",
                    "Publish Pages",
                    "Manage Blog",
                    "Manage Media",
                  ],
                },
                {
                  id: 2,
                  name: "Product Management",
                  permissions: [
                    "View Products",
                    "Create Products",
                    "Edit Products",
                    "Delete Products",
                    "Manage Categories",
                    "Manage Inventory",
                  ],
                },
                {
                  id: 3,
                  name: "Order Management",
                  permissions: [
                    "View Orders",
                    "Process Orders",
                    "Issue Refunds",
                    "Manage Shipping",
                    "View Customer Data",
                  ],
                },
                {
                  id: 4,
                  name: "Artist Management",
                  permissions: [
                    "View Artists",
                    "Approve Designs",
                    "Reject Designs",
                    "Process Payouts",
                    "Manage Artist Accounts",
                  ],
                },
                {
                  id: 5,
                  name: "Analytics & Reporting",
                  permissions: [
                    "View Reports",
                    "Export Data",
                    "View Sales Analytics",
                    "View Customer Analytics",
                    "View Revenue Analytics",
                  ],
                },
                {
                  id: 6,
                  name: "System Administration",
                  permissions: [
                    "Manage Users",
                    "Manage Roles",
                    "View Audit Logs",
                    "System Settings",
                    "Security Settings",
                  ],
                },
              ].map((group) => (
                <div key={group.id} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{group.name}</h3>
                    <Button variant="outline" size="sm">
                      Edit Permissions
                    </Button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.permissions.map((permission, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                      >
                        {permission}
                      </span>
                    ))}
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
