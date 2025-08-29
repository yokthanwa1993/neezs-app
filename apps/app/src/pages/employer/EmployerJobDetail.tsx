import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, User, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import '@/styles/utilities.css';

const mockJobDetail = {
  id: 1,
  title: 'ตัดต่อวีดีโอ',
  location: 'กทม',
  price: 15000,
  duration: '2-3 วัน',
  description: 'ต้องการคนที่มีประสบการณ์ในการตัดต่อวีดีโอสำหรับงานโฆษณา ต้องมีความคิดสร้างสรรค์และสามารถทำงานได้รวดเร็ว',
  requirements: [
    'มีประสบการณ์ตัดต่อวีดีโออย่างน้อย 2 ปี',
    'ใช้ Premiere Pro, After Effects ได้',
    'มีความคิดสร้างสรรค์',
    'ทำงานได้รวดเร็วและตรงเวลา'
  ],
  image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
  employer: {
    name: 'บริษัท ABC',
    rating: 4.8,
    totalJobs: 25,
    avatar: 'https://i.pravatar.cc/150?img=1'
  }
};

const EmployerJobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

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
          <h1 className="text-lg font-semibold text-gray-900">รายละเอียดงาน</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Job Image */}
      <div className="relative">
        <img
          src={mockJobDetail.image}
          alt={mockJobDetail.title}
          className="w-full h-64 object-cover"
        />
      </div>

      {/* Job Content */}
      <div className="p-4 space-y-6">
        {/* Job Title & Price */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">{mockJobDetail.title}</h1>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{mockJobDetail.location}</span>
          </div>
          <div className="text-3xl font-bold text-red-600">฿{mockJobDetail.price.toLocaleString()}</div>
        </div>

        {/* Job Info Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gray-50 border-0">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">ระยะเวลา</p>
                  <p className="font-semibold text-gray-900">{mockJobDetail.duration}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50 border-0">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <User className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">ประเภทงาน</p>
                  <p className="font-semibold text-gray-900">งานออนไลน์</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employer Info */}
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <img
                src={mockJobDetail.employer.avatar}
                alt={mockJobDetail.employer.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{mockJobDetail.employer.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-gray-600">{mockJobDetail.employer.rating}</span>
                  <span className="text-sm text-gray-500">({mockJobDetail.employer.totalJobs} งาน)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Description */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">รายละเอียดงาน</h3>
          <p className="text-gray-700 leading-relaxed">{mockJobDetail.description}</p>
        </div>

        {/* Requirements */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">คุณสมบัติที่ต้องการ</h3>
          <ul className="space-y-2">
            {mockJobDetail.requirements.map((req, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Apply Button */}
        <div className="pt-4 pb-8">
          <Button 
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg py-4 rounded-xl shadow-lg"
            size="lg"
          >
            สมัครงาน
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployerJobDetail;
