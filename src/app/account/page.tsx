'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import OrderHistory from '@/components/account/OrderHistory';
import Wishlist from '@/components/account/Wishlist';
import AccountSettings from '@/components/account/AccountSettings';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function AccountDashboard() {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 890',
    address: '123 Main St, City, Country'
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // TODO: Implement profile update logic
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Please log in to view your account</h2>
          <Button>Log In</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" role="main">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">My Account</h1>
      
      <Tabs defaultValue="profile" className="w-full" role="tablist">
        <TabsList className="mb-8">
          <TabsTrigger value="profile" aria-label="Profile tab">Profile</TabsTrigger>
          <TabsTrigger value="orders" aria-label="Orders tab">Orders</TabsTrigger>
          <TabsTrigger value="wishlist" aria-label="Wishlist tab">Wishlist</TabsTrigger>
          <TabsTrigger value="settings" aria-label="Settings tab">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" role="tabpanel" aria-label="Profile information">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="w-24 h-24" role="img" aria-label="User profile picture" />
              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="flex-1 space-y-4" role="form" aria-label="Edit profile form">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-gray-100">Name</label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      aria-label="Enter your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-900 dark:text-gray-100">Email</label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      aria-label="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-900 dark:text-gray-100">Phone</label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      aria-label="Enter your phone number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium text-gray-900 dark:text-gray-100">Address</label>
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      aria-label="Enter your address"
                      required
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button type="submit" aria-label="Save profile changes">Save Changes</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      aria-label="Cancel editing"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex-1" role="region" aria-label="Profile details">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-semibold mb-1 text-gray-900 dark:text-gray-100">{profile.name}</h2>
                      <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
                    </div>
                    <Button onClick={() => setIsEditing(true)} aria-label="Edit profile">Edit Profile</Button>
                  </div>
                  <div className="grid gap-4">
                    <div>
                      <h3 className="font-medium mb-1 text-gray-900 dark:text-gray-100">Phone</h3>
                      <p className="text-gray-600 dark:text-gray-400">{profile.phone}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1 text-gray-900 dark:text-gray-100">Address</h3>
                      <p className="text-gray-600 dark:text-gray-400">{profile.address}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <OrderHistory orders={[]} />
        </TabsContent>

        <TabsContent value="wishlist">
          <Wishlist items={[]} onRemove={(id) => console.log('Remove item:', id)} />
        </TabsContent>

        <TabsContent value="settings">
          <AccountSettings
            onPasswordChange={async (oldPassword, newPassword) => {
              console.log('Change password:', { oldPassword, newPassword });
            }}
            onEmailPreferencesChange={async (preferences) => {
              console.log('Update email preferences:', preferences);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}