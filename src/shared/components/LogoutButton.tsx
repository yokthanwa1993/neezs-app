import React from 'react';
import { LogOut } from 'lucide-react';
import { MobileButton, type MobileButtonProps } from '@/shared/components/ui/mobile-button';
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

type LogoutButtonProps = {
  onLogout: () => Promise<void> | void;
  label?: string;
  confirmTitle?: string;
  confirmDescription?: string;
  /** Additional classes for the button */
  className?: string;
  /** Pass-through overrides for MobileButton */
  buttonProps?: Omit<MobileButtonProps, 'onClick' | 'children' | 'variant' | 'size'>;
};

/**
 * Shared LogoutButton with confirm dialog for both Seeker and Employer.
 * Uses MobileButton and shadcn AlertDialog. Large, full-width by default.
 */
const LogoutButton: React.FC<LogoutButtonProps> = ({
  onLogout,
  label = 'Logout',
  confirmTitle = 'ยืนยันการออกจากระบบ',
  confirmDescription = 'คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบตอนนี้?',
  className,
  buttonProps,
}) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onLogout();
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <MobileButton
        variant="destructive"
        size="lg"
        className={`w-full justify-center text-lg font-semibold h-14 ${className || ''}`}
        leftIcon={<LogOut className="w-6 h-6" />}
        onClick={() => setOpen(true)}
        loading={loading}
        {...buttonProps}
      >
        {label}
      </MobileButton>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-sm mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={loading}>
              ยืนยันออกจากระบบ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LogoutButton;
