import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { MobileButton } from '@/shared/components/ui/mobile-button';
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
import { useEmployerAuth } from '../contexts/EmployerAuthContext';

const EmployerSettingsPage: React.FC = () => {
  const { logout, user } = useEmployerAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <div className="p-4 space-y-4 max-w-mobile-lg mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600">Manage your employer account preferences</p>
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
            <p className="text-gray-900">Employer</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Company Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Company Profile</span>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span>Job Templates</span>
            <Button variant="outline" size="sm">Manage</Button>
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
          <MobileButton 
            variant="destructive"
            size="full"
            loading={isLoggingOut}
            onClick={() => setConfirmOpen(true)}
          >
            ออกจากระบบ
          </MobileButton>

          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogContent className="max-w-sm mx-auto">
              <AlertDialogHeader>
                <AlertDialogTitle>ยืนยันการออกจากระบบ</AlertDialogTitle>
                <AlertDialogDescription>
                  คุณต้องการออกจากระบบหรือไม่?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoggingOut}>ยกเลิก</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    setIsLoggingOut(true);
                    try {
                      await logout();
                    } finally {
                      setIsLoggingOut(false);
                      setConfirmOpen(false);
                    }
                  }}
                >
                  ยืนยันออกจากระบบ
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerSettingsPage;
