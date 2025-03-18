"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Search, Filter, Edit, Trash, UserPlus, Mail, Shield } from "lucide-react";

/**
 * User Management Page
 * Allows admins to manage users and their permissions
 */
export default function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Load users from localStorage on component mount
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (storedUsers.length === 0) {
      // Add some default users if none exist
      const defaultUsers = [
        { 
          id: "usr_1", 
          name: "John Doe", 
          email: "john@example.com", 
          role: "Admin",
          status: "Active",
          lastLogin: "2023-05-15T10:30:00Z",
          createdAt: "2023-01-10T08:15:00Z"
        },
        { 
          id: "usr_2", 
          name: "Jane Smith", 
          email: "jane@example.com", 
          role: "Customer",
          status: "Active",
          lastLogin: "2023-05-20T14:45:00Z",
          createdAt: "2023-02-05T11:20:00Z"
        },
        { 
          id: "usr_3", 
          name: "Robert Johnson", 
          email: "robert@example.com", 
          role: "Manager",
          status: "Inactive",
          lastLogin: "2023-04-10T09:15:00Z",
          createdAt: "2023-03-15T16:30:00Z"
        },
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
      setUsers(defaultUsers);
    } else {
      setUsers(storedUsers);
    }
  }, []);

  /**
   * Handle user deletion
   */
  const handleDeleteUser = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  /**
   * Filter users based on search term
   */
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="grid gap-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage users, permissions, and roles
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="flex items-center gap-2">
              <Link href="/admin/users/add">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex items-center gap-2">
              <Link href="/admin/roles">
                <Shield className="h-4 w-4 mr-2" />
                Manage Roles
              </Link>
            </Button>
          </div>
        </div>

        {/* Search and filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Email
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Role
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Last Login
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="p-4 align-middle font-medium">
                          {user.name}
                        </td>
                        <td className="p-4 align-middle text-muted-foreground">
                          {user.email}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant={user.role === "Admin" ? "default" : user.role === "Manager" ? "secondary" : "outline"}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant={user.status === "Active" ? "success" : "destructive"}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle text-muted-foreground">
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </td>
                        <td className="p-4 align-middle text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" asChild>
                              <Link href={`/admin/users/${user.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-muted-foreground">
                        No users found. Create your first user!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center p-4">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">
                Page 1 of {Math.max(1, Math.ceil(filteredUsers.length / 10))}
              </div>
              <Button variant="outline" size="sm" disabled={filteredUsers.length <= 10}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
} 