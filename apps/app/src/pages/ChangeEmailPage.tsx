import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { showSuccess, showError } from '@/utils/toast';
import BottomNavbar from '@/components/BottomNavbar';

const changeEmailSchema = z.object({
  newEmail: z.string().email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
  password: z.string().min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }),
});

type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>;

const ChangeEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(changeEmailSchema),
  });

  const onSubmit = async (data: ChangeEmailFormValues) => {
    try {
      // This is a mock function. In a real app, you would call your backend API here.
      console.log("Changing email...", data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess("ส่งคำขอเปลี่ยนอีเมลสำเร็จแล้ว โปรดตรวจสอบอีเมลของคุณ");
      navigate(-1);
    } catch (error) {
      showError("เกิดข้อผิดพลาดในการเปลี่ยนอีเมล");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <main className="p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg border">
          <div>
            <Label htmlFor="currentEmail">อีเมลปัจจุบัน</Label>
            <Input id="currentEmail" type="email" value={user?.email || ''} disabled className="bg-gray-100 mt-1" />
          </div>
          <div>
            <Label htmlFor="newEmail">อีเมลใหม่</Label>
            <Input id="newEmail" type="email" {...register("newEmail")} className="mt-1" />
            {errors.newEmail && <p className="text-red-500 text-sm mt-1">{errors.newEmail.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">รหัสผ่านเพื่อยืนยัน</Label>
            <Input id="password" type="password" {...register("password")} className="mt-1" />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'กำลังดำเนินการ...' : 'ยืนยันการเปลี่ยนอีเมล'}
          </Button>
        </form>
      </main>
      <BottomNavbar />
    </div>
  );
};

export default ChangeEmailPage;