import React, { useState } from 'react';
import { MapPin, Bookmark, Clock, User, Calendar, DollarSign, X, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import '@/styles/utilities.css';

type Seeker = { src: string; rating?: number; name?: string };

const mockJobs = {
  online: [
    { 
      id: 1, 
      title: 'ตัดต่อวีดีโอ', 
      location: 'กทม', 
      price: 15000,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
      isBookmarked: true,
      description: 'ต้องการคนที่มีประสบการณ์ในการตัดต่อวีดีโอสำหรับงานโฆษณา ต้องมีความคิดสร้างสรรค์และสามารถทำงานได้รวดเร็ว',
      requirements: [
        'มีประสบการณ์ตัดต่อวีดีโออย่างน้อย 2 ปี',
        'ใช้ Premiere Pro, After Effects ได้',
        'มีความคิดสร้างสรรค์',
        'ทำงานได้รวดเร็วและตรงเวลา'
      ],
      duration: '2-3 วัน',
      category: 'งานออนไลน์',
      postedDate: '2024-01-15',
      applicants: 12,
      urgent: true
    },
    { 
      id: 2, 
      title: 'ถ่ายภาพสินค้า', 
      location: 'นนทบุรี', 
      price: 8000,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80',
      isBookmarked: true,
      description: 'ต้องการช่างภาพที่มีประสบการณ์ในการถ่ายภาพสินค้า เน้นความสวยงามและดึงดูดลูกค้า',
      requirements: [
        'มีประสบการณ์ถ่ายภาพสินค้าอย่างน้อย 1 ปี',
        'ใช้กล้อง DSLR ได้',
        'มีความคิดสร้างสรรค์ในการจัดวาง',
        'สามารถแก้ไขภาพด้วย Photoshop ได้'
      ],
      duration: '1-2 วัน',
      category: 'งานออนไลน์',
      postedDate: '2024-01-14',
      applicants: 8,
      urgent: false
    },
    { 
      id: 3, 
      title: 'ออกแบบโลโก้', 
      location: 'กรุงเทพ', 
      price: 12000,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
      isBookmarked: true,
      description: 'ต้องการนักออกแบบที่มีความคิดสร้างสรรค์ในการออกแบบโลโก้ให้กับแบรนด์ใหม่',
      requirements: [
        'มีประสบการณ์ออกแบบโลโก้อย่างน้อย 3 ปี',
        'ใช้ Illustrator, Photoshop ได้',
        'มีความคิดสร้างสรรค์สูง',
        'สามารถทำงานได้หลายสไตล์'
      ],
      duration: '3-5 วัน',
      category: 'งานออนไลน์',
      postedDate: '2024-01-13',
      applicants: 15,
      urgent: false
    },
  ],
  completed: [
    { 
      id: 4, 
      title: 'เขียนบทความ', 
      location: 'เชียงใหม่', 
      price: 5000,
      image: 'https://images.unsplash.com/photo-1511920183276-5941b6fb4513?w=1200&q=80',
      isBookmarked: false,
      description: 'ต้องการนักเขียนที่มีประสบการณ์ในการเขียนบทความเกี่ยวกับการท่องเที่ยว',
      requirements: [
        'มีประสบการณ์เขียนบทความอย่างน้อย 2 ปี',
        'เขียนภาษาไทยได้ดี',
        'มีความรู้เรื่องการท่องเที่ยว',
        'สามารถส่งงานได้ตรงเวลา'
      ],
      duration: '1 สัปดาห์',
      category: 'งานออนไลน์',
      postedDate: '2024-01-10',
      applicants: 6,
      urgent: false
    },
  ],
  expired: [
    { 
      id: 5, 
      title: 'แปลเอกสาร', 
      location: 'ภูเก็ต', 
      price: 3000,
      image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=1200&q=80',
      isBookmarked: false,
      description: 'ต้องการนักแปลที่มีความแม่นยำในการแปลเอกสารจากภาษาอังกฤษเป็นไทย',
      requirements: [
        'มีประสบการณ์แปลเอกสารอย่างน้อย 1 ปี',
        'ภาษาอังกฤษและไทยดี',
        'มีความแม่นยำสูง',
        'สามารถส่งงานได้ตรงเวลา'
      ],
      duration: '2-3 วัน',
      category: 'งานออนไลน์',
      postedDate: '2024-01-08',
      applicants: 4,
      urgent: false
    },
  ],
};

// Bottom Sheet Component
const JobDetailBottomSheet = ({ job, isOpen, onClose }: { job: any; isOpen: boolean; onClose: () => void }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleViewSeekers = () => {
    onClose();
    navigate(`/employer/job/${job.id}/seekers`);
  };

  const handleEditJob = () => {
    onClose();
    navigate(`/employer/job/${job.id}/edit`);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-50 ${
          isOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[9999] transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Content */}
        <div className="px-6 pb-8 max-h-[80vh] overflow-y-auto">
          {/* Header Image */}
          <div className="relative mb-6">
            <img
              src={job.image}
              alt={job.title}
              className="w-full h-48 object-cover rounded-2xl"
            />
            {job.isBookmarked && (
              <div className="absolute top-3 right-3">
                <Bookmark className="w-6 h-6 text-yellow-400 fill-yellow-400 stroke-black stroke-1" />
              </div>
            )}
            {job.urgent && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                  ด่วน
                </Badge>
              </div>
            )}
          </div>

          {/* Job Title & Location */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="w-5 h-5 mr-2" />
            <span className="text-lg">{job.location}</span>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-red-600 mb-6">฿{job.price.toLocaleString()}</div>

          {/* Job Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-3 text-gray-600">
              <Clock className="w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">ระยะเวลา</p>
                <p className="font-medium">{job.duration}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <User className="w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">ประเภท</p>
                <p className="font-medium">{job.category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <Calendar className="w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">ลงประกาศ</p>
                <p className="font-medium">{job.postedDate}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <DollarSign className="w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">ผู้สมัคร</p>
                <p className="font-medium">{job.applicants} คน</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">รายละเอียดงาน</h3>
            <p className="text-gray-700 leading-relaxed">{job.description}</p>
          </div>

          {/* Requirements */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">คุณสมบัติที่ต้องการ</h3>
            <ul className="space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start space-x-3 text-gray-700">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 h-12"
              onClick={handleViewSeekers}
            >
              ดูผู้สมัคร
            </Button>
            <Button 
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold h-12"
              onClick={handleEditJob}
            >
              แก้ไขงาน
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

const JobCard = ({ job }: { job: any }) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    // นำไปยังหน้า seeker selection
    navigate(`/employer/job/${job.id}/seekers`);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation(); // ป้องกันการ trigger card click
    setIsBottomSheetOpen(true);
  };

  return (
    <>
      <Card 
        className="mb-4 overflow-hidden rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 bg-white cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        onClick={handleCardClick}
      >
        <div className="relative">
          <img
            src={job.image}
            alt={job.title}
            className="w-full h-48 object-cover"
          />
          {job.isBookmarked && (
            <div className="absolute top-3 right-3">
              <Bookmark className="w-6 h-6 text-yellow-400 fill-yellow-400 stroke-black stroke-1" />
            </div>
          )}
          {job.urgent && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                ด่วน
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2">{job.title}</h3>
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{job.location}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-red-600">฿{job.price.toLocaleString()}</span>
            <Button 
              onClick={handleViewDetails}
              variant="ghost"
              className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
            >
              ดูรายละเอียด
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Sheet */}
      <JobDetailBottomSheet 
        job={job} 
        isOpen={isBottomSheetOpen} 
        onClose={() => setIsBottomSheetOpen(false)} 
      />
    </>
  );
};

const EmployerMyJobsPage = () => {
  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="p-4">
        <Tabs defaultValue="online" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg p-1 mb-6">
            <TabsTrigger value="online" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              งานที่ออนไลน์ ({mockJobs.online.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              งานที่จบแล้ว ({mockJobs.completed.length})
            </TabsTrigger>
            <TabsTrigger value="expired" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              งานที่หมดเวลา ({mockJobs.expired.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="online" className="mt-4">
            {mockJobs.online.length > 0 ? (
              mockJobs.online.map((job: any) => <JobCard key={job.id} job={job} />)
            ) : (
              <p className="text-center text-gray-500 mt-12">ไม่มีงานที่ออนไลน์</p>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-4">
            {mockJobs.completed.length > 0 ? (
              mockJobs.completed.map((job: any) => <JobCard key={job.id} job={job} />)
            ) : (
              <p className="text-center text-gray-500 mt-12">ไม่มีงานที่จบแล้ว</p>
            )}
          </TabsContent>
          
          <TabsContent value="expired" className="mt-4">
            {mockJobs.expired.length > 0 ? (
              mockJobs.expired.map((job: any) => <JobCard key={job.id} job={job} />)
            ) : (
              <p className="text-center text-gray-500 mt-12">ไม่มีงานที่หมดเวลา</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployerMyJobsPage;