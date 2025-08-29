import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Clock, Phone, Mail, MessageCircle, Calendar, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import '@/styles/utilities.css';

const mockSeeker = {
  id: 1,
  name: 'Sky Boonkrajang',
  avatar: 'https://i.pravatar.cc/150?u=a',
  rating: 5.0,
  totalReviews: 47,
  location: 'กรุงเทพ',
  experience: '3 ปี',
  skills: ['Premiere Pro', 'After Effects', 'Photoshop', 'DaVinci Resolve', 'Motion Graphics'],
  hourlyRate: 800,
  isOnline: true,
  lastActive: '2 นาทีที่แล้ว',
  bio: 'นักตัดต่อวีดีโอที่มีประสบการณ์มากกว่า 3 ปี ทำงานกับลูกค้าทั่วไปและบริษัทขนาดใหญ่ เน้นคุณภาพและความรวดเร็ว',
  completedJobs: 156,
  responseRate: '98%',
  responseTime: 'ภายใน 1 ชั่วโมง',
  languages: ['ไทย', 'อังกฤษ'],
  education: 'ปริญญาตรี สาขาวิชาการออกแบบสื่อดิจิทัล',
  portfolio: [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80'
  ],
  reviews: [
    {
      id: 1,
      name: 'บริษัท ABC',
      rating: 5,
      comment: 'ทำงานได้ดีมาก ตรงเวลาและคุณภาพดี',
      date: '2 สัปดาห์ที่แล้ว'
    },
    {
      id: 2,
      name: 'ร้าน XYZ',
      rating: 5,
      comment: 'มีความคิดสร้างสรรค์สูง งานออกมาสวยงาม',
      date: '1 เดือนที่แล้ว'
    }
  ]
};

const EmployerSeekerProfile = () => {
  const { seekerId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">โปรไฟล์ผู้สมัคร</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white p-6 border-b border-gray-200">
        <div className="flex items-start space-x-6">
          {/* Avatar */}
          <div className="relative">
            <img
              src={mockSeeker.avatar}
              alt={mockSeeker.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white ${
              mockSeeker.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{mockSeeker.name}</h2>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {mockSeeker.isOnline ? 'ออนไลน์' : 'ออฟไลน์'}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-gray-900">{mockSeeker.rating}</span>
                <span className="text-gray-500">({mockSeeker.totalReviews} รีวิว)</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{mockSeeker.location}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>ประสบการณ์ {mockSeeker.experience}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>งานเสร็จแล้ว {mockSeeker.completedJobs} งาน</span>
              </div>
            </div>
          </div>

          {/* Hourly Rate */}
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">฿{mockSeeker.hourlyRate}</div>
            <div className="text-sm text-gray-500">ต่อชั่วโมง</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{mockSeeker.responseRate}</div>
              <div className="text-sm text-gray-500">อัตราการตอบกลับ</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{mockSeeker.responseTime}</div>
              <div className="text-sm text-gray-500">เวลาตอบกลับ</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{mockSeeker.languages.length}</div>
              <div className="text-sm text-gray-500">ภาษา</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content Sections */}
      <div className="p-4 space-y-6">
        {/* About */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">เกี่ยวกับ</h3>
            <p className="text-gray-700 leading-relaxed">{mockSeeker.bio}</p>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ทักษะ</h3>
            <div className="flex flex-wrap gap-2">
              {mockSeeker.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-yellow-100 text-yellow-800 px-3 py-2">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Portfolio */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ผลงาน</h3>
            <div className="grid grid-cols-3 gap-4">
              {mockSeeker.portfolio.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">รีวิวจากลูกค้า</h3>
            <div className="space-y-4">
              {mockSeeker.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    <div className="flex items-center space-x-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => navigate(`/employer/chat/${mockSeeker.id}`)}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            แชท
          </Button>
          <Button 
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
            onClick={() => navigate(`/employer/job/new?seeker=${mockSeeker.id}`)}
          >
            <Award className="w-5 h-5 mr-2" />
            จ้างงาน
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployerSeekerProfile;
