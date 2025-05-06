"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Search, Filter, Edit, Trash, Mail, RefreshCw, UserSearch } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  createdAt: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  source?: string;
}

/**
 * User Management Page
 * Allows admins to manage users and their permissions
 */
export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // User check dialog state
  const [checkEmail, setCheckEmail] = useState("");
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [checkResult, setCheckResult] = useState<any>(null);
  const [checkError, setCheckError] = useState<string | null>(null);

  // Debug state
  const [debugMode, setDebugMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/users');

      if (!response.ok) {
        const errorMessage = `Error fetching users: ${response.status}`;
        console.error(errorMessage);
        setError(errorMessage);
        toast.error('Failed to load users');
        return;
      }

      const data = await response.json();

      if (!data.success) {
        const errorMessage = data.message || 'Failed to fetch users';
        console.error('API error:', errorMessage);
        if (data.details) {
          console.error('Error details:', data.details);
        }
        setError(errorMessage);
        toast.error('Failed to load users');
        return;
      }

      // Check if data.data exists and is an array
      if (!data.data || !Array.isArray(data.data)) {
        console.warn('API returned invalid data format:', data);
        setUsers([]);
        setError('Invalid data format received from server');
        toast.error('Invalid data format received');
        return;
      }

      setUsers(data.data);

      // Log debug information if available
      if (data.debug) {
        console.log('Debug info from API:', data.debug);
        setDebugInfo(data.debug);

        // Show toast with source information
        const sourcesInfo = [];
        if (data.debug.profiles.count > 0) {
          sourcesInfo.push(`${data.debug.profiles.count} from profiles`);
        }
        if (data.debug.auth.count > 0) {
          sourcesInfo.push(`${data.debug.auth.count} from auth`);
        }
        if (data.debug.profile_users.count > 0) {
          sourcesInfo.push(`${data.debug.profile_users.count} from profile_users`);
        }
        if (data.debug.localStorage.count > 0) {
          sourcesInfo.push(`${data.debug.localStorage.count} from localStorage`);
        }

        if (sourcesInfo.length > 0) {
          toast.info(`User sources: ${sourcesInfo.join(', ')}`);
        } else {
          toast.info('No users found in any data source');
        }

        // Show errors if any
        if (data.debug.profiles.error || data.debug.auth.error || data.debug.profile_users.error) {
          console.warn('API reported errors in data fetching:', {
            profiles: data.debug.profiles.error,
            auth: data.debug.auth.error,
            profile_users: data.debug.profile_users.error
          });

          // Show toast with error information
          const errorSources = [];
          if (data.debug.profiles.error) errorSources.push('profiles');
          // Only add auth errors if they're not the expected admin privileges error
          if (data.debug.auth.error && !data.debug.auth.error.includes('expected')) {
            errorSources.push('auth');
          }
          if (data.debug.profile_users.error) errorSources.push('profile_users');

          if (errorSources.length > 0) {
            toast.error(`Errors fetching from: ${errorSources.join(', ')}`);
          }
        }
      } else {
        setDebugInfo(null);
      }

      if (data.isMockData) {
        toast.info('Using demo data for users. Real user data could not be loaded.');
        console.warn('Using mock data due to API error:', data.error);
      } else if (data.data.length === 0) {
        toast.info('No users found in the system');
      } else {
        toast.success(`${data.data.length} users loaded successfully`);

        // Log the source of users for debugging
        const sources: Record<string, number> = {};
        data.data.forEach((user: User) => {
          if (user.source) {
            sources[user.source] = (sources[user.source] || 0) + 1;
          }
        });
        console.log('User sources:', sources);
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'An error occurred while fetching users');
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * Handle user deletion
   */
  const handleDeleteUser = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      // In a real application, you would call an API to delete the user
      // For now, we'll just filter them out of the local state
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
      toast.success('User deleted successfully');
    }
  };

  /**
   * Filter users based on search term
   */
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  /**
   * Check if a specific user exists in the database
   */
  const checkUserExists = async () => {
    if (!checkEmail || !checkEmail.trim()) {
      setCheckError("Please enter an email address");
      return;
    }

    try {
      setIsCheckingUser(true);
      setCheckError(null);
      setCheckResult(null);

      const response = await fetch('/api/users/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: checkEmail.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setCheckError(data.message || 'Failed to check user');
        return;
      }

      setCheckResult(data);

      if (data.found) {
        toast.success(`User with email ${checkEmail} was found!`);
      } else {
        toast.info(`User with email ${checkEmail} was not found in the database.`);
      }
    } catch (err: any) {
      console.error('Error checking user:', err);
      setCheckError(err.message || 'An error occurred while checking the user');
    } finally {
      setIsCheckingUser(false);
    }
  };

  return (
    <AdminLayout>
      <div className="grid gap-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              User Management
            </h1>
            <div>
              <p className="text-muted-foreground">
                View and manage users who have signed up
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                If users aren't appearing, use the "Check User" button to verify their existence in the database.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={fetchUsers}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <UserSearch className="h-4 w-4" />
                    Check User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Check User Existence</DialogTitle>
                    <DialogDescription>
                      Enter an email address to check if a user exists in the database.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <span className="text-sm font-medium leading-none">Email Address</span>
                      <Input
                        id="email"
                        placeholder="user@example.com"
                        value={checkEmail}
                        onChange={(e) => setCheckEmail(e.target.value)}
                      />
                    </div>

                    {checkError && (
                      <div className="text-sm text-red-500">{checkError}</div>
                    )}

                    {checkResult && (
                      <div className="rounded-md bg-muted p-4">
                        <div className="font-medium">
                          {checkResult.found ? 'User Found!' : 'User Not Found'}
                        </div>

                        {checkResult.found && (
                          <div className="mt-2 text-sm">
                            <p>Found in:</p>
                            <ul className="list-disc pl-5 mt-1">
                              {checkResult.locations.profiles && <li>Profiles table</li>}
                              {checkResult.locations.auth && <li>Auth users table</li>}
                              {checkResult.locations.profile_users && <li>Profile users table</li>}
                            </ul>

                            {checkResult.userData && (
                              <div className="mt-2">
                                <p className="font-medium">User Data:</p>
                                <pre className="text-xs mt-1 bg-gray-100 p-2 rounded overflow-x-auto">
                                  {JSON.stringify(checkResult.userData, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}

                        {!checkResult.found && (
                          <p className="mt-2 text-sm">
                            This user does not exist in any of the database tables.
                            They may not have signed up, or there might be an issue with the registration process.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button
                      onClick={checkUserExists}
                      disabled={isCheckingUser}
                      className="flex items-center gap-2"
                    >
                      {isCheckingUser ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Checking...
                        </>
                      ) : (
                        <>
                          <UserSearch className="h-4 w-4" />
                          Check User
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
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
                <Button
                  variant={debugMode ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setDebugMode(!debugMode)}
                >
                  {debugMode ? "Hide Debug Info" : "Show Debug Info"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debug Info Panel */}
        {debugMode && debugInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Data Sources:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div className="border rounded-md p-3">
                      <div className="font-medium">Profiles Table</div>
                      <div className="text-sm mt-1">
                        {debugInfo.profiles.count > 0 ? (
                          <Badge className="bg-green-500 text-white">{debugInfo.profiles.count} users found</Badge>
                        ) : (
                          <Badge variant="outline">No users found</Badge>
                        )}
                      </div>
                      {debugInfo.profiles.error && (
                        <div className="text-xs text-red-500 mt-1">{debugInfo.profiles.error}</div>
                      )}
                    </div>
                    <div className="border rounded-md p-3">
                      <div className="font-medium">Auth Users Table</div>
                      <div className="text-sm mt-1">
                        {debugInfo.auth.count > 0 ? (
                          <Badge className="bg-green-500 text-white">{debugInfo.auth.count} users found</Badge>
                        ) : (
                          <Badge variant="outline">No users found</Badge>
                        )}
                      </div>
                      {debugInfo.auth.error && (
                        <div className={`text-xs mt-1 ${debugInfo.auth.error.includes('expected') ? 'text-amber-500' : 'text-red-500'}`}>
                          {debugInfo.auth.error}
                        </div>
                      )}
                    </div>
                    <div className="border rounded-md p-3">
                      <div className="font-medium">Profile Users Table</div>
                      <div className="text-sm mt-1">
                        {debugInfo.profile_users.count > 0 ? (
                          <Badge className="bg-green-500 text-white">{debugInfo.profile_users.count} users found</Badge>
                        ) : (
                          <Badge variant="outline">No users found</Badge>
                        )}
                      </div>
                      {debugInfo.profile_users.error && (
                        <div className="text-xs text-red-500 mt-1">{debugInfo.profile_users.error}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium">Troubleshooting:</h3>
                  <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                    <li>If no users are found in any table, check that users are properly signing up</li>
                    <li>The "Auth Users Table" error about admin privileges is expected and not a problem</li>
                    <li>Users should appear in the "Profile Users Table" when they sign up</li>
                    <li>Use the "Check User" feature to verify if a specific user exists in the database</li>
                    <li>Check the browser console for more detailed error messages</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>{error}</p>
                <Button onClick={fetchUsers} variant="outline" className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : (
              <>
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
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          Source
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.length > 0 ? (
                        currentUsers.map((user) => (
                          <tr key={user.id} className="border-b">
                            <td className="p-4 align-middle font-medium">
                              {user.name || 'Unknown'}
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
                              <Badge variant={user.status === "Active" ? "destructive" : "outline"}>
                                {user.status}
                              </Badge>
                            </td>
                            <td className="p-4 align-middle text-muted-foreground">
                              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                            </td>
                            <td className="p-4 align-middle">
                              <Badge variant={user.source === "mock" ? "destructive" : user.source === "auth.users" ? "secondary" : "outline"}>
                                {user.source || 'unknown'}
                              </Badge>
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
                          <td colSpan={7} className="p-4 text-center text-muted-foreground">
                            {searchTerm ? 'No users match your search' : (
                              <div className="space-y-2">
                                <p>No users found. Users who sign up on the website should appear here.</p>
                                <p className="text-sm">
                                  If you've created accounts but don't see them here, try refreshing the page.
                                  The system checks multiple sources to find all registered users.
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <Button
                                    onClick={fetchUsers}
                                    variant="outline"
                                    size="sm"
                                  >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Refresh Users
                                  </Button>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <UserSearch className="h-4 w-4 mr-2" />
                                        Check Specific User
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Check User Existence</DialogTitle>
                                        <DialogDescription>
                                          Enter an email address to check if a user exists in the database.
                                        </DialogDescription>
                                      </DialogHeader>

                                      <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                          <span className="text-sm font-medium leading-none">Email Address</span>
                                          <Input
                                            id="email"
                                            placeholder="user@example.com"
                                            value={checkEmail}
                                            onChange={(e) => setCheckEmail(e.target.value)}
                                          />
                                        </div>

                                        {checkError && (
                                          <div className="text-sm text-red-500">{checkError}</div>
                                        )}

                                        {checkResult && (
                                          <div className="rounded-md bg-muted p-4">
                                            <div className="font-medium">
                                              {checkResult.found ? 'User Found!' : 'User Not Found'}
                                            </div>

                                            {checkResult.found && (
                                              <div className="mt-2 text-sm">
                                                <p>Found in:</p>
                                                <ul className="list-disc pl-5 mt-1">
                                                  {checkResult.locations.profiles && <li>Profiles table</li>}
                                                  {checkResult.locations.auth && <li>Auth users table</li>}
                                                  {checkResult.locations.profile_users && <li>Profile users table</li>}
                                                </ul>
                                              </div>
                                            )}

                                            {!checkResult.found && (
                                              <p className="mt-2 text-sm">
                                                This user does not exist in any of the database tables.
                                                They may not have signed up, or there might be an issue with the registration process.
                                              </p>
                                            )}
                                          </div>
                                        )}
                                      </div>

                                      <DialogFooter>
                                        <Button
                                          onClick={checkUserExists}
                                          disabled={isCheckingUser}
                                        >
                                          {isCheckingUser ? (
                                            <>
                                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                              Checking...
                                            </>
                                          ) : (
                                            <>
                                              <UserSearch className="h-4 w-4 mr-2" />
                                              Check User
                                            </>
                                          )}
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between items-center p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {Math.max(1, totalPages)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}