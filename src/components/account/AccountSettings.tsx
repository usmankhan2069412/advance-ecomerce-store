'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Mail, Bell } from 'lucide-react';

interface AccountSettingsProps {
  onPasswordChange: (oldPassword: string, newPassword: string) => Promise<void>;
  onEmailPreferencesChange: (preferences: EmailPreferences) => Promise<void>;
}

interface EmailPreferences {
  marketing: boolean;
  orderUpdates: boolean;
  newsletter: boolean;
  productAlerts: boolean;
}

export default function AccountSettings({
  onPasswordChange,
  onEmailPreferencesChange,
}: AccountSettingsProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailPreferences, setEmailPreferences] = useState<EmailPreferences>({
    marketing: true,
    orderUpdates: true,
    newsletter: false,
    productAlerts: true,
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    try {
      await onPasswordChange(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordError('Failed to update password. Please try again.');
    }
  };

  const handlePreferenceChange = async (key: keyof EmailPreferences) => {
    const newPreferences = {
      ...emailPreferences,
      [key]: !emailPreferences[key],
    };
    setEmailPreferences(newPreferences);
    await onEmailPreferencesChange(newPreferences);
  };

  return (
    <div className="space-y-6">
      {/* Password Change Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-[#2D2D2D]" />
          <h3 className="text-lg font-medium font-serif text-[#2D2D2D]">Change Password</h3>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium font-sans text-gray-700">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="font-sans"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium font-sans text-gray-700">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="font-sans"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium font-sans text-gray-700">Confirm New Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="font-sans"
              required
            />
          </div>
          {passwordError && (
            <Alert variant="destructive">
              <AlertDescription>{passwordError}</AlertDescription>
            </Alert>
          )}
          <Button
            type="submit"
            className="bg-[#2D2D2D] hover:bg-[#1a1a1a] text-white font-sans flex items-center gap-2"
          >
            <Lock className="h-4 w-4" />
            Update Password
          </Button>
        </form>
      </div>

      {/* Email Preferences Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Mail className="w-5 h-5 text-[#2D2D2D]" />
          <h3 className="text-lg font-medium font-serif text-[#2D2D2D]">Email Preferences</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium font-sans text-[#2D2D2D]">Order Updates</label>
              <p className="text-sm text-gray-600 font-sans">Receive updates about your orders</p>
            </div>
            <Switch
              checked={emailPreferences.orderUpdates}
              onCheckedChange={() => handlePreferenceChange('orderUpdates')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium font-sans text-[#2D2D2D]">Product Alerts</label>
              <p className="text-sm text-gray-600 font-sans">Get notified about price drops and back in stock items</p>
            </div>
            <Switch
              checked={emailPreferences.productAlerts}
              onCheckedChange={() => handlePreferenceChange('productAlerts')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium font-sans text-[#2D2D2D]">Newsletter</label>
              <p className="text-sm text-gray-600 font-sans">Receive our weekly newsletter</p>
            </div>
            <Switch
              checked={emailPreferences.newsletter}
              onCheckedChange={() => handlePreferenceChange('newsletter')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium font-sans text-[#2D2D2D]">Marketing</label>
              <p className="text-sm text-gray-600 font-sans">Receive marketing emails about our products and services</p>
            </div>
            <Switch
              checked={emailPreferences.marketing}
              onCheckedChange={() => handlePreferenceChange('marketing')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}