import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, PlayCircle, UserCheck, Grid, Clapperboard, UserSquare2, Briefcase, MessageCircle, Phone, Star, Video, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/StarRating';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Types
type PortfolioItem = {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
};

type Applicant = {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  reviews: number;
  distance: string;
  location: string;
  title: string;
  bio: string;
  skills: string[];
  portfolio: PortfolioItem[];
};

// Mock data for all applicants
const applicantsData: Record<string, Applicant> = {
  '1': {
    id: '1',
    name: 'น้องมายด์',
    avatarUrl: 'https://i.pravatar.cc/150?u=applicant-1',
    rating: 4.8,
    reviews: 25,
    distance: '1.2 km',
    location: 'กรุงเทพมหานคร',
    title: 'นักตัดต่อวิดีโอ & ช่างภาพ',
    bio: 'สวัสดีค่ะ มายด์เป็นฟรีแลนซ์ตัดต่อวิดีโอและช่างภาพ มีประสบการณ์ 3 ปีในการสร้างสรรค์คอนเทนต์สำหรับโซเชียลมีเดียและงานอีเวนต์ค่ะ',
    skills: ['Video Editing', 'After Effects', 'Premiere Pro'],
    portfolio: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1516876437184-593fda40c7c4?w=800&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=800&q=80' },
      { type: 'video', url: 'https://videos.pexels.com/video-files/3209828/3209828-hd_1280_720_25fps.mp4', thumbnail: 'https://images.pexels.com/videos/3209828/pictures/preview.jpg' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1496449903678-68ddcb189a24?w=800&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?w=800&q=80' },
    ]
  },
  '2': {
    id: '2',
    name: 'พี่เก่ง',
    avatarUrl: 'https://i.pravatar.cc/150?u=applicant-2',
    rating: 4.5,
    reviews: 18,
    distance: '3.5 km',
    location: 'กรุงเทพมหานคร',
    title: 'นักผลิตวิดีโอ & Motion Graphics',
    bio: 'สวัสดีครับ ผมเป็นนักผลิตวิดีโอและ Motion Graphics มีประสบการณ์ 5 ปี ทำงานกับบริษัทใหญ่หลายแห่งครับ',
    skills: ['Video Production', 'Motion Graphics'],
    portfolio: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1516876437184-593fda40c7c4?w=800&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=800&q=80' },
    ]
  },
  '3': {
    id: '3',
    name: 'คุณสมศักดิ์',
    avatarUrl: 'https://i.pravatar.cc/150?u=applicant-3',
    rating: 5.0,
    reviews: 32,
    distance: '5.1 km',
    location: 'กรุงเทพมหานคร',
    title: 'ผู้เชี่ยวชาญการตัดต่อ & Color Grading',
    bio: 'สวัสดีครับ ผมเป็นผู้เชี่ยวชาญด้านการตัดต่อวิดีโอและ Color Grading มีประสบการณ์ 7 ปี ทำงานในวงการภาพยนตร์ครับ',
    skills: ['Professional Editing', 'Color Grading', 'Sound Design'],
    portfolio: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1516876437184-593fda40c7c4?w=800&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=800&q=80' },
    ]
  },
  '4': {
    id: '4',
    name: 'น้องฝน',
    avatarUrl: 'https://i.pravatar.cc/150?u=applicant-4',
    rating: 4.2,
    reviews: 12,
    distance: '8.0 km',
    location: 'กรุงเทพมหานคร',
    title: 'นักตัดต่อวิดีโอ & Content Creator',
    bio: 'สวัสดีค่ะ ฝนเป็นนักตัดต่อวิดีโอและ Content Creator มีประสบการณ์ 2 ปี เน้นงาน YouTube และโซเชียลมีเดียค่ะ',
    skills: ['Basic Editing', 'YouTube Content'],
    portfolio: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1516876437184-593fda40c7c4?w=800&q=80' },
    ]
  },
  '5': {
    id: '5',
    name: 'คุณวิชัย',
    avatarUrl: 'https://i.pravatar.cc/150?u=applicant-5',
    rating: 4.9,
    reviews: 28,
    distance: '0.8 km',
    location: 'กรุงเทพมหานคร',
    title: 'Creative Director & 3D Artist',
    bio: 'สวัสดีครับ ผมเป็น Creative Director และ 3D Artist มีประสบการณ์ 6 ปี ทำงานในวงการโฆษณาและภาพยนตร์ครับ',
    skills: ['Cinema 4D', 'Advanced Effects', 'Creative Direction'],
    portfolio: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1516876437184-593fda40c7c4?w=800&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=800&q=80' },
    ]
  },
  '6': {
    id: '6',
    name: 'น้องน้ำ',
    avatarUrl: 'https://i.pravatar.cc/150?u=applicant-6',
    rating: 4.7,
    reviews: 15,
    distance: '2.1 km',
    location: 'กรุงเทพมหานคร',
    title: 'Social Media Content Creator',
    bio: 'สวัสดีค่ะ น้ำเป็น Social Media Content Creator มีประสบการณ์ 4 ปี เน้นงาน TikTok และ Instagram ค่ะ',
    skills: ['Social Media Content', 'TikTok Editing'],
    portfolio: [
      { type: 'image', url: 'https://i.pravatar.cc/150?u=applicant-6' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1516876437184-593fda40c7c4?w=800&q=80' },
    ]
  }
};

const EmployerApplicantProfilePage = () => {
  const { applicantId } = useParams<{ applicantId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about');


  // Get applicant data based on applicantId
  const applicant = applicantsData[applicantId as keyof typeof applicantsData] || applicantsData['1'];

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="p-4 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-2">เกี่ยวกับฉัน</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{applicant.bio}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-3">ทักษะ</h3>
              <div className="flex flex-wrap gap-2">
                {applicant.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-base px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
                 <div className="mt-4">
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
                  ยืนยัน
                </Button>
              </div>
            </div>
          </div>
        );
      case 'portfolio':
        return (
          <div className="grid grid-cols-3 gap-1">
            {applicant.portfolio.map((item, index) => (
              <div key={index} className="relative aspect-square">
                <img src={item.type === 'video' ? (item.thumbnail ?? item.url) : item.url} alt={`Portfolio item ${index + 1}`} className="w-full h-full object-cover" />
                {item.type === 'video' && (
                  <div className="absolute top-1 right-1">
                    <Clapperboard className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      case 'reviews':
        return (
          <div className="p-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-3">รีวิว (25)</h3>
              {/* Add review items here */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src="https://i.pravatar.cc/150?u=a04258114e29026702d" alt="Reviewer" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">John Doe</p>
                        <div className="flex items-center">
                            <Star size={16} className="text-yellow-500 fill-yellow-500" />
                            <Star size={16} className="text-yellow-500 fill-yellow-500" />
                            <Star size={16} className="text-yellow-500 fill-yellow-500" />
                            <Star size={16} className="text-yellow-500 fill-yellow-500" />
                            <Star size={16} className="text-gray-300" />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">ทำงานดีมากครับ ส่งงานตรงเวลา</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-24">
        {/* Profile Header */}
        <div className="bg-white pb-4">
          <div className="p-4">
            <div className="flex items-center">
              <Avatar className="w-24 h-24 border-2 border-white shadow-md">
                <AvatarImage src={applicant.avatarUrl} alt={applicant.name} />
                <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 ml-2 flex justify-around items-center">
                <div className="text-center px-2">
                  <p className="font-bold text-lg">15</p>
                  <p className="text-sm text-gray-500">งานที่สำเร็จ</p>
                </div>
                <div className="text-center px-2">
                  <p className="font-bold text-lg">4.8</p>
                  <p className="text-sm text-gray-500">คะแนนรีวิว</p>
                </div>
                <div className="text-center px-2">
                  <p className="font-bold text-lg">25</p>
                  <p className="text-sm text-gray-500">ผู้ติดตาม</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h1 className="font-bold text-xl">{applicant.name}</h1>
              <p className="text-gray-600 text-sm">{applicant.title}</p>
              <div className="flex items-center text-gray-500 text-xs mt-1">
                <MapPin size={14} className="mr-1" />
                <span>{applicant.location}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <Button variant="outline" size="icon" className="w-16 h-16 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 flex flex-col items-center justify-center">
                <MessageCircle size={32} strokeWidth={2.5} />
              </Button>
              <Button variant="outline" size="icon" className="w-16 h-16 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 flex flex-col items-center justify-center">
                <Phone size={32} strokeWidth={2.5} />
              </Button>
              <Button variant="outline" size="icon" className="w-16 h-16 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 flex flex-col items-center justify-center">
                <Video size={32} strokeWidth={2.5} />
              </Button>
              <Button variant="outline" size="icon" className="w-16 h-16 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 flex flex-col items-center justify-center">
                <Share2 size={32} strokeWidth={2.5} />
              </Button>
              <Button variant="outline" size="icon" className="w-16 h-16 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 flex flex-col items-center justify-center">
                <Star size={32} strokeWidth={2.5} />
              </Button>
            </div>
          </div>
          
          {/* Profile Tabs */}
          <div className="border-t border-gray-200 mt-4">
              <div className="flex justify-around">
                  <button onClick={() => setActiveTab('about')} className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'about' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}>
                      เกี่ยวกับ
                  </button>
                  <button onClick={() => setActiveTab('portfolio')} className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'portfolio' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}>
                      ผลงาน
                  </button>
                  <button onClick={() => setActiveTab('reviews')} className={`flex-1 py-3 text-sm font-semibold ${activeTab === 'reviews' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}>
                      รีวิว
                  </button>
              </div>
          </div>
        </div>

        {renderContent()}
        
      </main>



    </div>
  );
};

export default EmployerApplicantProfilePage;