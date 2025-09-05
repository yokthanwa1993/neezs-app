import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import LogoutButton from '@/shared/components/LogoutButton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Separator } from '@/shared/components/ui/separator';
import { useSeekerAuth } from '../contexts/SeekerAuthContext';

const SeekerSettingsPage: React.FC = () => {
  const { logout, user } = useSeekerAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <div className="p-4 space-y-4 max-w-mobile-lg mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600">Manage your seeker account preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="text-gray-900">{user?.email || 'Not available'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Account Type</label>
            <p className="text-gray-900">Job Seeker</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Notifications</span>
            <Button variant="outline" size="sm">Manage</Button>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span>Privacy Settings</span>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LogoutButton onLogout={logout} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SeekerSettingsPage;
