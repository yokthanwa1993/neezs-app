import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Camera, Save } from 'lucide-react';

const SeekerProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    location: '',
    skills: '',
    experience: '',
    education: '',
    portfolio: ''
  });
  
  const [profileImage, setProfileImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // ดึงข้อมูลจาก localStorage
    const savedName = localStorage.getItem('user_name') || '';
    const savedBio = localStorage.getItem('user_bio') || 'เพิ่มคำอธิบายตัวตนของคุณ...';
    const savedPhone = localStorage.getItem('user_phone') || '';
    const savedLocation = localStorage.getItem('user_location') || '';
    const savedSkills = localStorage.getItem('user_skills') || '[]';
    const savedExperience = localStorage.getItem('user_experience') || '';
    const savedEducation = localStorage.getItem('user_education') || '';
    const savedPortfolio = localStorage.getItem('user_portfolio') || '';
    const savedProfileImage = localStorage.getItem('user_profile_image') || '';

    // โหลดรูปโปรไฟล์
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }

    try {
      const skillsArray = JSON.parse(savedSkills);
      setFormData({
        name: savedName,
        bio: savedBio,
        phone: savedPhone,
        location: savedLocation,
        skills: Array.isArray(skillsArray) ? skillsArray.join(', ') : '',
        experience: savedExperience,
        education: savedEducation,
        portfolio: savedPortfolio
      });
    } catch (error) {
      setFormData({
        name: savedName,
        bio: savedBio,
        phone: savedPhone,
        location: savedLocation,
        skills: '',
        experience: savedExperience,
        education: savedEducation,
        portfolio: savedPortfolio
      });
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // ตรวจสอบประเภทไฟล์
      if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }
      
      // ตรวจสอบขนาดไฟล์ (ไม่เกิน 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('ขนาดไฟล์ต้องไม่เกิน 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
        // บันทึกลง localStorage
        localStorage.setItem('user_profile_image', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // แยก skills เป็น array
      const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      
      // บันทึกลง localStorage
      localStorage.setItem('user_name', formData.name);
      localStorage.setItem('user_bio', formData.bio);
      localStorage.setItem('user_phone', formData.phone);
      localStorage.setItem('user_location', formData.location);
      localStorage.setItem('user_skills', JSON.stringify(skillsArray));
      localStorage.setItem('user_experience', formData.experience);
      localStorage.setItem('user_education', formData.education);
      localStorage.setItem('user_portfolio', formData.portfolio);

      alert('บันทึกข้อมูลเรียบร้อยแล้ว');
      navigate('/seeker/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">


      <div className="p-4 space-y-6">
        {/* Profile Image */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage 
                src={profileImage || localStorage.getItem('liff_picture_url') || ''} 
                alt="Profile" 
              />
              <AvatarFallback className="text-primary font-bold text-3xl bg-primary/10">
                {formData.name.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <label htmlFor="profile-image-upload" className="cursor-pointer">
              <Button
                size="icon"
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-white hover:bg-primary/90"
                asChild
              >
                <div>
                  <Camera className="h-4 w-4" />
                </div>
              </Button>
            </label>
            <input
              id="profile-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ชื่อ
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="ชื่อของคุณ"
              className="w-full"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เกี่ยวกับตัวคุณ
            </label>
            <Textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="บอกเล่าเกี่ยวกับตัวคุณ..."
              rows={3}
              className="w-full"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เบอร์โทรศัพท์
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="081-234-5678"
              className="w-full"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ที่อยู่
            </label>
            <Input
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="กรุงเทพมหานคร"
              className="w-full"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ทักษะ (คั่นด้วยเครื่องหมายจุลภาค)
            </label>
            <Input
              value={formData.skills}
              onChange={(e) => handleInputChange('skills', e.target.value)}
              placeholder="Video Editing, Photoshop, After Effects"
              className="w-full"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ประสบการณ์การทำงาน
            </label>
            <Textarea
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              placeholder="ประสบการณ์การทำงานของคุณ..."
              rows={3}
              className="w-full"
            />
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              การศึกษา
            </label>
            <Textarea
              value={formData.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
              placeholder="ประวัติการศึกษา..."
              rows={3}
              className="w-full"
            />
          </div>

          {/* Portfolio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Portfolio URL
            </label>
            <Input
              value={formData.portfolio}
              onChange={(e) => handleInputChange('portfolio', e.target.value)}
              placeholder="https://your-portfolio.com"
              className="w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/seeker/profile')}
          >
            ยกเลิก
          </Button>
          <Button
            className="flex-1 bg-primary text-white hover:bg-primary/90"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeekerProfileEditPage;
