import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, KeyRound, Smartphone, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const EmployerSecurityPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">ความปลอดภัย</h1>
      </header>
      <main className="p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>การยืนยันตัวตน</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center">
                <KeyRound className="w-5 h-5 mr-4 text-gray-500" />
                <div>
                  <p className="font-medium">รหัสผ่าน</p>
                  <p className="text-sm text-gray-500">เปลี่ยนรหัสผ่านของคุณเป็นประจำ</p>
                </div>
              </div>
              <Button variant="outline">เปลี่ยน</Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center">
                <ShieldCheck className="w-5 h-5 mr-4 text-gray-500" />
                <div>
                  <p className="font-medium">การยืนยันตัวตนสองขั้นตอน</p>
                  <p className="text-sm text-gray-500">เพิ่มความปลอดภัยให้บัญชีของคุณ</p>
                </div>
              </div>
              <Switch id="2fa-switch" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>อุปกรณ์ที่เข้าสู่ระบบ</CardTitle>
            <CardDescription>นี่คือรายการอุปกรณ์ที่กำลังเข้าถึงบัญชีของคุณ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center">
                <Smartphone className="w-5 h-5 mr-4 text-gray-700" />
                <div>
                  <p className="font-medium">iPhone 15 Pro</p>
                  <p className="text-sm text-green-600">กำลังใช้งาน</p>
                </div>
              </div>
              <Button variant="link" className="text-red-500">ออกจากระบบ</Button>
            </div>
             <div className="flex items-center justify-between p-3">
              <div className="flex items-center">
                <Smartphone className="w-5 h-5 mr-4 text-gray-500" />
                <div>
                  <p className="font-medium">Chrome on Windows</p>
                  <p className="text-sm text-gray-500">กรุงเทพ, ประเทศไทย</p>
                </div>
              </div>
              <Button variant="link" className="text-red-500">ออกจากระบบ</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EmployerSecurityPage;