import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import '@/styles/utilities.css';

const mockSeekers = [
  {
    id: 1,
    name: 'Sky Boonkrajang',
    avatar: 'https://i.pravatar.cc/150?u=a',
    rating: 5.0,
    location: 'กรุงเทพ',
    experience: '3 ปี',
    skills: ['Premiere Pro', 'After Effects', 'Photoshop'],
    hourlyRate: 800,
    isOnline: true,
    lastActive: '2 นาทีที่แล้ว'
  },
  {
    id: 2,
    name: 'Trustchai Champ',
    avatar: 'https://i.pravatar.cc/150?u=b',
    rating: 4.8,
    location: 'นนทบุรี',
    experience: '5 ปี',
    skills: ['Premiere Pro', 'DaVinci Resolve', 'Motion Graphics'],
    hourlyRate: 1000,
    isOnline: true,
    lastActive: '5 นาทีที่แล้ว'
  },
  {
    id: 3,
    name: 'gxlfntw6119',
    avatar: 'https://i.pravatar.cc/150?u=c',
    rating: 4.5,
    location: 'สมุทรปราการ',
    experience: '2 ปี',
    skills: ['Premiere Pro', 'After Effects'],
    hourlyRate: 600,
    isOnline: false,
    lastActive: '1 ชั่วโมงที่แล้ว'
  },
  {
    id: 4,
    name: 'คมกริช จงไกรจักร',
    avatar: 'https://i.pravatar.cc/150?u=d',
    rating: 4.2,
    location: 'ปทุมธานี',
    experience: '4 ปี',
    skills: ['Premiere Pro', 'Final Cut Pro', 'Color Grading'],
    hourlyRate: 900,
    isOnline: true,
    lastActive: '10 นาทีที่แล้ว'
  },
  {
    id: 5,
    name: 'ปู ฟองเบียร์',
    avatar: 'https://i.pravatar.cc/150?u=e',
    rating: 4.9,
    location: 'กรุงเทพ',
    experience: '6 ปี',
    skills: ['Premiere Pro', 'After Effects', 'Cinema 4D'],
    hourlyRate: 1200,
    isOnline: false,
    lastActive: '30 นาทีที่แล้ว'
  }
];

const mockJob = {
  id: 1,
  title: 'ตัดต่อวีดีโอ',
  location: 'กทม',
  price: 15000,
  duration: '2-3 วัน',
  image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80'
};

const EmployerSeekerSelection = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const handleSelectSeeker = (seekerId: number) => {
    navigate(`/employer/seeker/${seekerId}/profile`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">เลือกผู้สมัคร</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Job Summary */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <img
            src={mockJob.image}
            alt={mockJob.title}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">{mockJob.title}</h2>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{mockJob.location}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xl font-bold text-red-600">฿{mockJob.price.toLocaleString()}</span>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                <span>{mockJob.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seekers List */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">ผู้สมัคร ({mockSeekers.length})</h3>
          <span className="text-sm text-gray-500">เรียงตามคะแนน</span>
        </div>

        {mockSeekers.map((seeker) => (
          <Card 
            key={seeker.id} 
            className="border border-gray-200 hover:border-yellow-400 hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => handleSelectSeeker(seeker.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={seeker.avatar}
                    alt={seeker.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    seeker.isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>

                {/* Seeker Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 truncate">{seeker.name}</h4>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">{seeker.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{seeker.location}</span>
                    <span className="mx-2">•</span>
                    <span>ประสบการณ์ {seeker.experience}</span>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {seeker.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">฿{seeker.hourlyRate}/ชม.</span>
                    <span className={`text-xs ${
                      seeker.isOnline ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {seeker.isOnline ? 'ออนไลน์' : seeker.lastActive}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Info */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="text-center text-sm text-gray-500">
          เลือกผู้สมัครที่ต้องการเพื่อดูรายละเอียดเพิ่มเติม
        </div>
      </div>
    </div>
  );
};

export default EmployerSeekerSelection;
