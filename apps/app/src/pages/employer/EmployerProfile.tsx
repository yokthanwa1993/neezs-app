import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Share,
  Pencil
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import EmployerProfileSettingsTab from './EmployerProfileSettingsTab';

const EmployerProfile: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const companyProfile = {
    name: user?.name || 'เทค โซลูชั่นส์ จำกัด',
    logo: user?.picture || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop&crop=center',
    bio: 'สร้างสรรค์โซลูชั่นดิจิทัลนวัตกรรมสำหรับธุรกิจทั่วโลก เรากำลังมองหาคนรุ่นใหม่มาร่วมทีม!',
    stats: {
      jobsPosted: 15,
      rating: 4.8,
      applicants: 258,
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>กำลังโหลด...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold mb-4">กรุณาเข้าสู่ระบบ</h2>
        <p className="text-gray-600 mb-6">คุณต้องเข้าสู่ระบบเพื่อดูโปรไฟล์ของคุณ</p>
        <Button onClick={() => navigate('/employer-login')}>
          ไปที่หน้าเข้าสู่ระบบ
        </Button>
      </div>
    );
  }

  const handleShare = async () => {
    const shareData = {
      title: `โปรไฟล์บริษัท ${companyProfile.name}`,
      text: `ดูโปรไฟล์ของ ${companyProfile.name} และตำแหน่งงานที่เปิดรับสมัคร`,
      url: (import.meta.env.VITE_APP_DOMAIN || window.location.origin) + window.location.pathname,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText((import.meta.env.VITE_APP_DOMAIN || window.location.origin) + window.location.pathname);
        alert('คัดลอกลิงก์โปรไฟล์แล้ว!');
      }
    } catch (error) {
      console.error('Error sharing profile:', error);
      alert('ไม่สามารถแชร์โปรไฟล์ได้');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="px-4 pt-8 space-y-4">
        {/* Profile Info */}
        <div className="flex items-center space-x-5 p-4 bg-white rounded-xl shadow-sm">
          <Avatar className="w-24 h-24 border-2 border-white shadow-sm">
            <AvatarImage src={companyProfile.logo} alt={companyProfile.name} />
            <AvatarFallback>{companyProfile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex items-center space-x-6 text-center">
            <div><p className="font-bold text-lg">{companyProfile.stats.jobsPosted}</p><p className="text-sm text-gray-500">ประกาศ</p></div>
            <div><p className="font-bold text-lg">{companyProfile.stats.rating} ★</p><p className="text-sm text-gray-500">คะแนน</p></div>
            <div><p className="font-bold text-lg">{companyProfile.stats.applicants}</p><p className="text-sm text-gray-500">ผู้สมัคร</p></div>
          </div>
        </div>

        {/* Name and Bio */}
        <div className="p-4 bg-white rounded-xl shadow-sm">
          <h2 className="text-gray-900 font-bold text-xl">{companyProfile.name}</h2>
          <div className="flex items-start text-gray-600 mt-1 cursor-pointer group" onClick={() => navigate('/employer/edit-profile')}>
            <p className="text-sm">{companyProfile.bio}</p>
            <Pencil className="h-3 w-3 ml-2 mt-1 flex-shrink-0 text-gray-400 group-hover:text-primary" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            className="flex-1 bg-black text-white font-semibold hover:bg-black/80" 
            onClick={() => navigate('/employer/edit-profile')}
          >
            แก้ไขโปรไฟล์
          </Button>
          <Button 
            className="flex-1 bg-black text-white font-semibold hover:bg-black/80"
            onClick={handleShare}
          >
            <Share className="w-4 h-4 mr-2" />
            แชร์โปรไฟล์
          </Button>
        </div>
      </div>

      {/* Settings Content */}
      <div className="p-4">
        <EmployerProfileSettingsTab />
      </div>
    </div>
  );
};

export default EmployerProfile;