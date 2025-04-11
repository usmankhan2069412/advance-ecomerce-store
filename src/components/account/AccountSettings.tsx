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
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-medium">Change Password</h3>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm New Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {passwordError && (
            <Alert variant="destructive">
              <AlertDescription>{passwordError}</AlertDescription>
            </Alert>
          )}
          <Button type="submit">Update Password</Button>
        </form>
      </Card>

      {/* Email Preferences Section */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Mail className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-medium">Email Preferences</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Order Updates</label>
              <p className="text-sm text-gray-600">Receive updates about your orders</p>
            </div>
            <Switch
              checked={emailPreferences.orderUpdates}
              onCheckedChange={() => handlePreferenceChange('orderUpdates')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Product Alerts</label>
              <p className="text-sm text-gray-600">Get notified about price drops and back in stock items</p>
            </div>
            <Switch
              checked={emailPreferences.productAlerts}
              onCheckedChange={() => handlePreferenceChange('productAlerts')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Newsletter</label>
              <p className="text-sm text-gray-600">Receive our weekly newsletter</p>
            </div>
            <Switch
              checked={emailPreferences.newsletter}
              onCheckedChange={() => handlePreferenceChange('newsletter')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Marketing</label>
              <p className="text-sm text-gray-600">Receive marketing emails about our products and services</p>
            </div>
            <Switch
              checked={emailPreferences.marketing}
              onCheckedChange={() => handlePreferenceChange('marketing')}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}