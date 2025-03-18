"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Search, Edit, Trash, Shield, ArrowLeft, Users } from "lucide-react";

/**
 * Roles Management Page
 * Allows admins to manage user roles and permissions
 */
export default function RolesManagement() {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [newRole, setNewRole] = useState({ name: "", description: "" });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Load roles and permissions from localStorage on component mount
  useEffect(() => {
    // Load or create default roles
    const storedRoles = JSON.parse(localStorage.getItem('roles') || '[]');
    if (storedRoles.length === 0) {
      const defaultRoles = [
        { 
          id: "role_1", 
          name: "Admin", 
          description: "Full access to all resources",
          permissions: ["all"],
          userCount: 1
        },
        { 
          id: "role_2", 
          name: "Manager", 
          description: "Can manage products and orders",
          permissions: ["products:read", "products:write", "orders:read", "orders:write", "customers:read"],
          userCount: 2
        },
        { 
          id: "role_3", 
          name: "Customer", 
          description: "Regular customer account",
          permissions: ["profile:read", "profile:write", "orders:own"],
          userCount: 15
        },
      ];
      localStorage.setItem('roles', JSON.stringify(defaultRoles));
      setRoles(defaultRoles);
    } else {
      setRoles(storedRoles);
    }
    
    // Load or create default permissions
    const storedPermissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    if (storedPermissions.length === 0) {
      const defaultPermissions = [
        { id: "perm_1", name: "products:read", description: "View products" },
        { id: "perm_2", name: "products:write", description: "Create and edit products" },
        { id: "perm_3", name: "orders:read", description: "View all orders" },
        { id: "perm_4", name: "orders:write", description: "Update order status" },
        { id: "perm_5", name: "orders:own", description: "View own orders" },
        { id: "perm_6", name: "customers:read", description: "View customer data" },
        { id: "perm_7", name: "customers:write", description: "Edit customer data" },
        { id: "perm_8", name: "users:read", description: "View users" },
        { id: "perm_9", name: "users:write", description: "Create and edit users" },
        { id: "perm_10", name: "profile:read", description: "View own profile" },
        { id: "perm_11", name: "profile:write", description: "Edit own profile" },
        { id: "perm_12", name: "all", description: "Full access to all resources" },
      ];
      localStorage.setItem('permissions', JSON.stringify(defaultPermissions));
      setPermissions(defaultPermissions);
    } else {
      setPermissions(storedPermissions);
    }
  }, []);

  /**
   * Handle adding a new role
   */
  const handleAddRole = () => {
    if (!newRole.name.trim()) return;

    const newRoleItem = {
      id: `role_${Math.random().toString(36).substring(2, 10)}`,
      name: newRole.name,
      description: newRole.description,
      permissions: selectedPermissions,
      userCount: 0
    };

    const updatedRoles = [...roles, newRoleItem];
    setRoles(updatedRoles);
    localStorage.setItem('roles', JSON.stringify(updatedRoles));

    // Reset form
    setNewRole({ name: "", description: "" });
    setSelectedPermissions([]);
    setIsAdding(false);
  };

  /**
   * Handle permission checkbox change
   */
  const handlePermissionChange = (permissionName: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionName]);
    } else {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permissionName));
    }
  };

  /**
   * Handle role deletion
   */
  const handleDeleteRole = (id: string) => {
    // Don't allow deleting the Admin role
    const roleToDelete = roles.find(role => role.id === id);
    if (roleToDelete.name === "Admin") {
      alert("The Admin role cannot be deleted.");
      return;
    }

    if (confirm("Are you sure you want to delete this role?")) {
      const updatedRoles = roles.filter(role => role.id !== id);
      setRoles(updatedRoles);
      localStorage.setItem('roles', JSON.stringify(updatedRoles));
    }
  };

  /**
   * Filter roles based on search term
   */
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="grid gap-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Role Management
            </h1>
            <p className="text-muted-foreground">
              Manage user roles and permissions
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2"
              disabled={isAdding}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
            <Button variant="outline" asChild className="flex items-center gap-2">
              <Link href="/admin/users">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Users
              </Link>
            </Button>
          </div>
        </div>

        {/* Add Role Form */}
        {isAdding && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Role</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="roleName">Role Name</Label>
                    <Input
                      id="roleName"
                      value={newRole.name}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                      placeholder="e.g., Editor"
                    />
                  </div>
                  <div>
                    <Label htmlFor="roleDescription">Description</Label>
                    <Input
                      id="roleDescription"
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                      placeholder="Brief description of this role"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Permissions</Label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.id}
                          checked={selectedPermissions.includes(permission.name)}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission.name, checked as boolean)
                          }
                        />
                        <Label htmlFor={permission.id} className="text-sm font-normal">
                          {permission.description}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAdding(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddRole}>
                    Save Role
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search roles..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Roles List */}
        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Role
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Description
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Permissions
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Users
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoles.map((role) => (
                    <tr key={role.id} className="border-b">
                      <td className="p-4 align-middle font-medium">
                        {role.name}
                      </td>
                      <td className="p-4 align-middle text-muted-foreground">
                        {role.description}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.includes("all") ? (
                            <Badge variant="default">All Permissions</Badge>
                          ) : (
                            role.permissions.slice(0, 3).map((perm: string, index: number) => {
                              const permission = permissions.find(p => p.name === perm);
                              return (
                                <Badge key={index} variant="outline">
                                  {permission ? permission.description : perm}
                                </Badge>
                              );
                            })
                          )}
                          {role.permissions.length > 3 && (
                            <Badge variant="outline">+{role.permissions.length - 3} more</Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{role.userCount}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleDeleteRole(role.id)}
                            disabled={role.name === "Admin"}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
} 