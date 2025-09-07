import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Pencil,
  User,
  Briefcase,
  Image,
  Star,
  Wallet,
  ChevronRight
} from 'lucide-react';
import { useSeekerAuth } from '../contexts/SeekerAuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import LogoutButton from '@/shared/components/LogoutButton';
import ProfileAboutTab from '@/seeker/components/SeekerProfileAboutTab';
import ProfileExperienceTab from '@/seeker/components/SeekerProfileExperienceTab';
import ProfilePortfolioTab from '@/seeker/components/SeekerProfilePortfolioTab';
import ProfileReviewsTab from '@/seeker/components/SeekerProfileReviewsTab';

const TabButton = ({ icon: Icon, isActive, onClick }: { icon: React.ElementType, isActive: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`py-4 flex-1 flex justify-center items-center transition-all duration-200 border-b-2 ${isActive ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}>
    <Icon className={`h-6 w-6`} />
  </button>
);

const ProfilePage: React.FC = () => {
  const { user, logout } = useSeekerAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const profileData = {
    username: 'tanwa_p',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    jobsApplied: 15,
    rating: 4.8,
    savedJobs: 5,
    bio: 'นักศึกษาจบใหม่ มีความสนใจในงานบริการและงานขาย มีความกระตือร้นและพร้อมเรียนรู้งาน',
  };

  const walletData = {
    balance: 7450,
  };

  const handleShare = async () => {
    const userName = user?.profile?.displayName || user?.displayName || 'ผู้ใช้';
    const userBio = profileData.bio || 'ดูโปรไฟล์ของฉันบนแอปของเราสิ!';
    
    const shareData = {
      title: `โปรไฟล์ของ ${userName}`,
      text: `${userBio}`,
      url: (import.meta.env.VITE_APP_DOMAIN || window.location.origin) + window.location.pathname,
    };

    try {
      // ใช้ Web Share API ถ้ามี
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } 
      // ใช้ Clipboard API ถ้ามี
      else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText((import.meta.env.VITE_APP_DOMAIN || window.location.origin) + window.location.pathname);
        alert('คัดลอกลิงก์โปรไฟล์แล้ว! คุณสามารถแชร์ลิงก์นี้ได้');
      } 
      // Fallback สำหรับเบราว์เซอร์เก่า
      else {
        // สร้าง input ซ่อนเพื่อคัดลอก
        const textArea = document.createElement('textarea');
        textArea.value = (import.meta.env.VITE_APP_DOMAIN || window.location.origin) + window.location.pathname;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('คัดลอกลิงก์โปรไฟล์แล้ว! คุณสามารถแชร์ลิงก์นี้ได้');
      }
    } catch (error) {
      console.error('Error sharing profile:', error);
      
      // Fallback สำหรับกรณีที่ Clipboard API ไม่ทำงาน
      try {
        const textArea = document.createElement('textarea');
        textArea.value = (import.meta.env.VITE_APP_DOMAIN || window.location.origin) + window.location.pathname;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('คัดลอกลิงก์โปรไฟล์แล้ว! คุณสามารถแชร์ลิงก์นี้ได้');
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
        alert('ไม่สามารถแชร์โปรไฟล์ได้ กรุณาลองใหม่อีกครั้ง');
      }
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="pb-24">
        <div className="px-4 pt-10">
          {/* Profile Summary */}
          <div className="flex items-center space-x-5 mb-4">
            <Avatar className="w-24 h-24 border-2 border-white shadow-sm">
              <AvatarImage src={user?.profile?.pictureUrl || user?.photoURL || localStorage.getItem('liff_picture_url') || profileData.profileImage} alt={user?.profile?.displayName || 'Guest'} />
              <AvatarFallback className="text-primary font-bold text-3xl bg-primary/10">
                {user?.profile?.displayName?.charAt(0) || user?.displayName?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center space-x-6 text-center">
              <div><p className="font-bold text-lg">{profileData.jobsApplied}</p><p className="text-sm text-gray-500">สมัครงาน</p></div>
              <div><p className="font-bold text-lg">{profileData.rating} ★</p><p className="text-sm text-gray-500">คะแนน</p></div>
              <div><p className="font-bold text-lg">{profileData.savedJobs}</p><p className="text-sm text-gray-500">บันทึก</p></div>
            </div>
          </div>

          {/* Name and Bio */}
          <div className="mb-4">
            <h2 className="text-gray-900 font-bold text-xl">{user?.profile?.displayName || user?.displayName || 'ผู้เยี่ยมชม'}</h2>
            <div className="flex items-start text-gray-600 mt-1 cursor-pointer group" onClick={() => navigate('/seeker/profile/edit')}>
              <p className="text-sm">{profileData.bio || 'เพิ่มคำอธิบายตัวตนของคุณ...'}</p>
              <Pencil className="h-3 w-3 ml-2 mt-1 flex-shrink-0 text-gray-400 group-hover:text-primary" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mb-6">
            <Button className="flex-1 font-semibold bg-black text-white hover:bg-black/90" onClick={() => navigate('/seeker/profile/edit')}>แก้ไขโปรไฟล์</Button>
            <Button className="flex-1 font-semibold bg-black text-white hover:bg-black/90" onClick={handleShare}>แชร์โปรไฟล์</Button>
          </div>
        </div>

        {/* Wallet Section */}
        <div className="px-4 mb-6">
            <div 
                onClick={() => navigate('/seeker/wallet')}
                className="bg-gray-50 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
            >
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                        <Wallet className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">กระเป๋าเงิน</p>
                        <p className="text-sm text-gray-500">ดูยอดเงินและธุรกรรม</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <span className="font-bold text-gray-800 mr-2">฿{walletData.balance.toLocaleString()}</span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="border-y border-gray-200">
          <div className="flex justify-around">
            {/* Order: Reviews (Star), Portfolio (Image), Experience (Briefcase), About (User) */}
            <TabButton icon={Star} isActive={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} />
            <TabButton icon={Image} isActive={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} />
            <TabButton icon={Briefcase} isActive={activeTab === 'experience'} onClick={() => setActiveTab('experience')} />
            <TabButton icon={User} isActive={activeTab === 'about'} onClick={() => setActiveTab('about')} />
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'about' && <ProfileAboutTab />}
          {activeTab === 'experience' && <ProfileExperienceTab />}
          {activeTab === 'portfolio' && <ProfilePortfolioTab />}
          {activeTab === 'reviews' && <ProfileReviewsTab />}
        </div>

        {/* Logout */}
        {activeTab === 'about' && (
          <div className="px-4 mb-4">
            <LogoutButton onLogout={logout} />
          </div>
        )}
      </div>
      
    </div>
  );
};

export default ProfilePage;
