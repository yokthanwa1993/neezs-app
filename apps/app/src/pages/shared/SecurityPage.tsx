import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, KeyRound, Smartphone, ShieldCheck, Laptop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

const SecurityPage: React.FC = () => {
  const navigate = useNavigate();

  const loggedInDevices = [
    {
      id: 1,
      icon: Smartphone,
      device: 'iPhone 15 Pro',
      location: 'กรุงเทพ, ประเทศไทย',
      isCurrent: true,
    },
    {
      id: 2,
      icon: Laptop,
      device: 'Chrome on Windows',
      location: 'เชียงใหม่, ประเทศไทย',
      isCurrent: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">ความปลอดภัย</h1>
      </header>
      <main className="p-4 space-y-6 pb-20">
        <Card>
          <CardHeader>
            <CardTitle>การยืนยันตัวตน</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center">
                <KeyRound className="w-5 h-5 mr-4 text-gray-500" />
                <div>
                  <p className="font-medium">รหัสผ่าน</p>
                  <p className="text-sm text-gray-500">อัปเดตล่าสุดเมื่อ 3 เดือนที่แล้ว</p>
                </div>
              </div>
              <Button variant="outline" size="sm">เปลี่ยน</Button>
            </div>
            <div className="flex items-center justify-between pt-4">
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
            {loggedInDevices.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border">
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-4 text-gray-700" />
                    <div>
                      <p className="font-medium">{item.device}</p>
                      <p className="text-sm text-gray-500">{item.location}</p>
                    </div>
                  </div>
                  {item.isCurrent ? (
                     <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">กำลังใช้งาน</Badge>
                  ) : (
                    <Button variant="link" size="sm" className="text-red-500 hover:text-red-600 p-0 h-auto">ออกจากระบบ</Button>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
        
        <Button variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600">
          ออกจากระบบทุกอุปกรณ์
        </Button>
      </main>
    </div>
  );
};

export default SecurityPage;