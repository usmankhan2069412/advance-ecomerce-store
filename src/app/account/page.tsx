'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { AuthService } from '@/services/auth-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import OrderHistory from '@/components/account/OrderHistory';
import UserOrderHistory from '@/components/account/UserOrderHistory';
import Wishlist from '@/components/account/Wishlist';
import AccountSettings from '@/components/account/AccountSettings';
import Link from 'next/link';
import { User, Settings, ShoppingBag, Heart, LogOut, Edit, Check, X } from 'lucide-react';

// Import Google font
import { Cormorant_Garamond, Inter } from "next/font/google";

// Initialize fonts
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function AccountDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, userProfile, logout, resendConfirmationEmail, isLoading } = useAuth();
  const { favorites, removeFavorite } = useFavorites();
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  // Get the tab from URL query parameters
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['profile', 'orders', 'wishlist', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);

      // Update URL to reflect the current tab without causing a page reload
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tabParam);
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  // Update URL when tab changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', activeTab);
      window.history.replaceState({}, '', url.toString());
    }
  }, [activeTab]);

  // Load user profile data
  useEffect(() => {
    if (userProfile) {
      console.log('Loading user profile data:', userProfile);

      // Get data from the profile
      let phone = userProfile.phone || '';
      let address = userProfile.address || '';

      // Check localStorage for fallback values only if needed
      if (typeof window !== 'undefined') {
        if (!phone && localStorage.getItem('user_phone')) {
          phone = localStorage.getItem('user_phone') || '';
        }

        if (!address && localStorage.getItem('user_address')) {
          address = localStorage.getItem('user_address') || '';
        }
      }

      setProfile(prev => ({
        ...prev,
        name: userProfile.name || '',
        email: userProfile.email || '',
        phone: phone,
        address: address,
        profile_user_id: userProfile.profile_user_id
      }));
    }
  }, [userProfile]);

  // Handle welcome toast
  useEffect(() => {
    // Only show the toast if we just arrived at the account page
    if (isAuthenticated && typeof window !== 'undefined' && window.location.pathname === "/account") {
      const justArrived = sessionStorage.getItem('justLoggedIn');
      if (justArrived === 'true') {
        toast.success("Welcome to your account dashboard!", {
          duration: 3000,
          position: "top-center"
        });
        // Clear the flag so we don't show the toast again on page refresh
        sessionStorage.removeItem('justLoggedIn');
      }
    }
  }, [isAuthenticated]);

  // Redirect if not authenticated
  useEffect(() => {
    // Skip if still loading
    if (isLoading) {
      console.log('Account page: Auth state is still loading, waiting...');
      return;
    }

    // Redirect if not authenticated
    if (!isAuthenticated) {
      console.log('Account page: User not authenticated, redirecting to auth page');
      try {
        // Use replace instead of push for a more forceful navigation
        router.replace('/auth');
      } catch (routerError) {
        console.error('Navigation error in account page:', routerError);
        // Use direct window location as a fallback
        if (typeof window !== 'undefined') {
          window.location.href = "/auth";
        }
      }
    } else {
      console.log('Account page: User is authenticated');
    }
  }, [isAuthenticated, isLoading, router]);

  /**
   * Handle profile update
   */
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateError('');

    try {
      if (!userProfile?.id) {
        throw new Error('User profile not found');
      }

      // Call the AuthService to update the profile
      const { user, error } = await AuthService.updateProfile(userProfile.id, {
        name: profile.name,
        // Don't update email as it requires verification
        // email: profile.email,
        phone: profile.phone,
        address: profile.address,
        profile_user_id: userProfile?.profile_user_id
      });

      if (error) {
        console.error('Profile update error:', error);
        setUpdateError(error.message);
        toast.error('Failed to update profile');
      } else if (user) {
        setIsEditing(false);
        toast.success('Profile updated successfully');

        // Clear any localStorage fallbacks as we now have proper database storage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user_phone');
          localStorage.removeItem('user_address');
        }
      }
    } catch (err: any) {
      console.error('Profile update error:', err);
      setUpdateError(err.message || 'An error occurred while updating your profile');
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
      toast.success('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to log out');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${serif.variable} ${sans.variable}`}>
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D2D2D]"></div>
              <h2 className="font-serif text-xl font-semibold text-[#2D2D2D]">Loading your account...</h2>
              <p className="text-gray-600 text-sm font-sans">Please wait while we retrieve your information</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${serif.variable} ${sans.variable}`}>
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <h2 className="font-serif text-2xl font-semibold mb-4 text-[#2D2D2D]">Please log in to view your account</h2>
            <p className="text-gray-600 mb-6 font-sans">You need to be logged in to access your account dashboard</p>
            <Button asChild className="bg-[#2D2D2D] hover:bg-[#1a1a1a] text-white transition-all duration-300 font-sans">
              <Link href="/auth">Log In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-12 ${serif.variable} ${sans.variable}`} role="main">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between pb-12 items-start md:items-center mb-12">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2 text-[#2D2D2D]">My Account</h1>
            <p className="text-gray-600  font-sans">Welcome back, {profile.name}</p>
          </div>
          <Button
            variant="outline"
            className="mt-4 md:mt-0 font-sans flex items-center gap-2 border-gray-300 hover:bg-gray-100"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" role="tablist">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 shrink-0">
              <TabsList className="flex flex-row md:flex-col w-full p-0 bg-transparent space-y-0 md:space-y-1 overflow-x-auto md:overflow-x-visible">
                <TabsTrigger
                  value="profile"
                  className="w-full justify-start gap-3 p-3 font-sans data-[state=active]:bg-gray-100 data-[state=active]:text-[#2D2D2D] data-[state=active]:font-medium rounded-md"
                >
                  <User className="h-5 w-5" />
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="orders"
                  className="w-full justify-start gap-3 p-3 font-sans data-[state=active]:bg-gray-100 data-[state=active]:text-[#2D2D2D] data-[state=active]:font-medium rounded-md"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Orders
                </TabsTrigger>
                <TabsTrigger
                  value="wishlist"
                  className="w-full justify-start gap-3 p-3 font-sans data-[state=active]:bg-gray-100 data-[state=active]:text-[#2D2D2D] data-[state=active]:font-medium rounded-md"
                >
                  <Heart className="h-5 w-5" />
                  Wishlist
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="w-full justify-start gap-3 p-3 font-sans data-[state=active]:bg-gray-100 data-[state=active]:text-[#2D2D2D] data-[state=active]:font-medium rounded-md"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Content */}
            <div className="flex-1">
              <TabsContent value="profile" role="tabpanel" className="mt-0">
                <Card className="border-0 shadow-md overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b pb-4">
                    <CardTitle className="font-serif text-xl text-[#2D2D2D]">Personal Information</CardTitle>
                    <CardDescription className="font-sans text-gray-600">Manage your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {updateError && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                        {updateError}
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row items-start gap-8">
                      <div className="w-full md:w-auto flex flex-col items-center mb-6 md:mb-0">
                        <Avatar className="w-32 h-32 border-4 border-white shadow-md" role="img" aria-label="User profile picture">
                          <div className="w-full h-full flex items-center justify-center bg-[#2D2D2D] text-white text-2xl font-serif">
                            {profile.name ? profile.name.charAt(0).toUpperCase() : 'A'}
                          </div>
                        </Avatar>
                      </div>

                      {isEditing ? (
                        <form onSubmit={handleProfileUpdate} className="flex-1 space-y-6 w-full" role="form">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-2">
                              <label htmlFor="name" className="text-sm font-medium font-sans text-gray-700">Full Name</label>
                              <Input
                                id="name"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="font-sans"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="email" className="text-sm font-medium font-sans text-gray-700">Email Address</label>
                              <Input
                                id="email"
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                className="font-sans bg-gray-50"
                                disabled
                                title="Email cannot be changed"
                              />
                              <p className="text-xs text-gray-500 font-sans">Email cannot be changed</p>
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="phone" className="text-sm font-medium font-sans text-gray-700">Phone Number</label>
                              <Input
                                id="phone"
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                className="font-sans"
                                placeholder="+1 (555) 123-4567"
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="address" className="text-sm font-medium font-sans text-gray-700">Shipping Address</label>
                              <Input
                                id="address"
                                value={profile.address}
                                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                className="font-sans"
                                placeholder="123 Main St, City, Country"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3 pt-6">
                            <Button
                              type="submit"
                              className="bg-[#2D2D2D] hover:bg-[#1a1a1a] text-white font-sans flex items-center gap-2"
                              disabled={isUpdating}
                            >
                              {isUpdating ? (
                                <>
                                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Check className="h-4 w-4" />
                                  Save Changes
                                </>
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsEditing(false)}
                              className="font-sans border-gray-300 flex items-center gap-2"
                              disabled={isUpdating}
                            >
                              <X className="h-4 w-4" />
                              Cancel
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex-1 w-full" role="region">
                          <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
                            <div>
                              <h2 className="font-serif text-2xl font-semibold mb-1 text-[#2D2D2D]">{profile.name || 'Your Name'}</h2>
                              <p className="text-gray-600 font-sans">{profile.email || 'your.email@example.com'}</p>
                            </div>
                            <Button
                              onClick={() => setIsEditing(true)}
                              className="mt-4 sm:mt-0 bg-[#2D2D2D] hover:bg-[#1a1a1a] text-white font-sans flex items-center gap-2"
                            >
                              <Edit className="h-4 w-4" />
                              Edit Profile
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8">
                            <div className="p-5 bg-gray-50 rounded-lg shadow-sm">
                              <h3 className="font-sans font-medium mb-2 text-[#2D2D2D] flex items-center gap-2">
                                <span className="flex w-5 h-5 rounded-full bg-gray-200 items-center justify-center text-gray-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                </span>
                                Phone Number
                              </h3>
                              <p className="text-gray-700 font-sans pl-7">{profile.phone || 'Not provided'}</p>
                            </div>
                            <div className="p-5 bg-gray-50 rounded-lg shadow-sm">
                              <h3 className="font-sans font-medium mb-2 text-[#2D2D2D] flex items-center gap-2">
                                <span className="flex w-5 h-5 rounded-full bg-gray-200 items-center justify-center text-gray-500">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </span>
                                Shipping Address
                              </h3>
                              <p className="text-gray-700 font-sans pl-7">{profile.address || 'Not provided'}</p>
                            </div>
                          </div>

                          {/* Email Verification Section */}
                          <div className="mt-8 p-5 border border-amber-200 bg-amber-50 rounded-lg shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                              <div>
                                <h3 className="font-sans font-medium mb-1 text-amber-800">Email Verification</h3>
                                <p className="text-amber-700 font-sans text-sm">
                                  Verify your email address to secure your account
                                </p>
                              </div>
                              <Button
                                onClick={async () => {
                                  if (!profile.email) return;
                                  setIsResendingEmail(true);
                                  try {
                                    const success = await resendConfirmationEmail(profile.email);
                                    if (success) {
                                      toast.success('Verification email sent! Please check your inbox.');
                                    }
                                  } catch (err) {
                                    toast.error('Failed to send verification email');
                                  } finally {
                                    setIsResendingEmail(false);
                                  }
                                }}
                                className="mt-4 sm:mt-0 bg-amber-600 hover:bg-amber-700 text-white font-sans text-sm"
                                disabled={isResendingEmail}
                              >
                                {isResendingEmail ? (
                                  <>
                                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                                    Sending...
                                  </>
                                ) : (
                                  'Send Verification Email'
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="mt-0">
                <Card className="border-0 shadow-md overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b pb-4">
                    <CardTitle className="font-serif text-xl text-[#2D2D2D]">Order History</CardTitle>
                    <CardDescription className="font-sans text-gray-600">View and track your orders</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <UserOrderHistory />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="wishlist" className="mt-0">
                <Card className="border-0 shadow-md overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b pb-4">
                    <CardTitle className="font-serif text-xl text-[#2D2D2D]">My Wishlist</CardTitle>
                    <CardDescription className="font-sans text-gray-600">Items you've saved for later</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Wishlist
                      items={favorites.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        inStock: true // Assuming all items are in stock by default
                      }))}
                      onRemove={(id) => removeFavorite(id)}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-0">
                <Card className="border-0 shadow-md overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b pb-4">
                    <CardTitle className="font-serif text-xl text-[#2D2D2D]">Account Settings</CardTitle>
                    <CardDescription className="font-sans text-gray-600">Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <AccountSettings
                      onPasswordChange={async (oldPassword, newPassword) => {
                        try {
                          const { error } = await AuthService.updatePassword(oldPassword, newPassword);
                          if (error) {
                            toast.error(error.message || 'Failed to update password');
                            return Promise.reject(error);
                          }
                          toast.success('Password updated successfully');
                          return Promise.resolve();
                        } catch (err: any) {
                          toast.error(err.message || 'An error occurred');
                          return Promise.reject(err);
                        }
                      }}
                      onEmailPreferencesChange={async (preferences) => {
                        // This would typically update user preferences in the database
                        toast.success('Email preferences updated');
                        return Promise.resolve();
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
