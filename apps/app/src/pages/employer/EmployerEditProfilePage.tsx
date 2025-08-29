import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Building, Globe, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast"

const EmployerEditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [companyData, setCompanyData] = useState({
    name: 'Tech Solutions Co.',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop&crop=center',
    description: 'เราคือบริษัทเทคโนโลยีที่มุ่งมั่นในการสร้างสรรค์โซลูชันดิจิทัลที่ทันสมัยสำหรับธุรกิจทุกขนาด ด้วยทีมงานผู้เชี่ยวชาญและประสบการณ์ที่ยาวนาน',
    website: 'https://techsolutions.co',
    email: 'contact@techsolutions.co',
    phone: '02-123-4567',
    location: 'กรุงเทพมหานคร',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In a real app, you would send this data to your backend API
    console.log('Saving data:', companyData);
    toast({
      title: "บันทึกสำเร็จ",
      description: "ข้อมูลบริษัทของคุณได้รับการอัปเดตแล้ว",
    });
    navigate(-1); // Go back to the profile page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-800">แก้ไขข้อมูลบริษัท</h1>
        </div>
        <Button onClick={handleSave}>บันทึก</Button>
      </header>

      <main className="p-4 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                  <AvatarImage src={companyData.logo} alt={companyData.name} />
                  <AvatarFallback>
                    <Building className="w-10 h-10 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="logo-upload" className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input id="logo-upload" type="file" className="hidden" accept="image/*" />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="name">ชื่อบริษัท</Label>
              <Input id="name" name="name" value={companyData.name} onChange={handleInputChange} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="description">เกี่ยวกับบริษัท</Label>
              <Textarea id="description" name="description" value={companyData.description} onChange={handleInputChange} className="mt-1" rows={4} />
            </div>
             <div>
              <Label htmlFor="location">ที่อยู่</Label>
              <Input id="location" name="location" value={companyData.location} onChange={handleInputChange} className="mt-1" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 space-y-4">
             <h3 className="font-semibold text-lg">ข้อมูลติดต่อ</h3>
            <div>
              <Label htmlFor="website">เว็บไซต์</Label>
              <div className="relative mt-1">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input id="website" name="website" type="url" value={companyData.website} onChange={handleInputChange} className="pl-9" placeholder="https://example.com" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">อีเมลติดต่อ</Label>
               <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input id="email" name="email" type="email" value={companyData.email} onChange={handleInputChange} className="pl-9" placeholder="contact@example.com" />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input id="phone" name="phone" type="tel" value={companyData.phone} onChange={handleInputChange} className="pl-9" placeholder="0X-XXX-XXXX" />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EmployerEditProfilePage;