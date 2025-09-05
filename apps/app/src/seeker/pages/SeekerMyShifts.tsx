
import React, { useState } from 'react';
import { MapPin, Bookmark, Star, Clock, Calendar, TrendingUp, Award, DollarSign, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

interface Job {
  id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  isBookmarked: boolean;
  isUrgent?: boolean;
  status: 'online' | 'completed' | 'expired';
  completedAt?: string;
  rating?: number;
}

const SeekerMyShifts: React.FC = () => {
  const [activeTab, setActiveTab] = useState('online');

  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'ตัดต่อวีดีโอ',
      location: 'กทม',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
      isBookmarked: true,
      isUrgent: true,
      status: 'online'
    },
    {
      id: '2',
      title: 'ถ่ายภาพสินค้า',
      location: 'นนทบุรี',
      price: 8000,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80',
      isBookmarked: true,
      status: 'online'
    },
    {
      id: '3',
      title: 'ออกแบบโลโก้',
      location: 'กรุงเทพ',
      price: 12000,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
      isBookmarked: true,
      status: 'online'
    },
    {
      id: '4',
      title: 'เขียนบทความ',
      location: 'ระยอง',
      price: 5000,
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80',
      isBookmarked: false,
      status: 'completed',
      completedAt: '15 ม.ค. 2567',
      rating: 5
    },
    {
      id: '5',
      title: 'พัฒนาเว็บไซต์',
      location: 'ชลบุรี',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
      isBookmarked: false,
      status: 'expired'
    }
  ];

  const getJobsByStatus = (status: string) => {
    return mockJobs.filter(job => job.status === status);
  };

  const totalEarnings = mockJobs.filter(job => job.status === 'completed').reduce((sum, job) => sum + job.price, 0);

  const JobCard = ({ job }: { job: Job }) => (
    <Card className="mb-6 overflow-hidden rounded-3xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white via-yellow-50/30 to-white cursor-pointer hover:scale-[1.02] active:scale-[0.98] group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <CardContent className="p-0 relative z-10">
        <div className="relative overflow-hidden rounded-t-3xl">
          <img
            alt={job.title}
            className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
            src={job.image}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Bookmark Icon */}
          <div className="absolute top-4 right-4 z-20">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-yellow-400 transition-colors duration-300">
              <Bookmark 
                className={`w-5 h-5 transition-all duration-200 ${
                  job.isBookmarked 
                    ? 'text-yellow-500 fill-yellow-500' 
                    : 'text-gray-600 hover:text-yellow-500'
                }`}
              />
            </div>
          </div>

          {/* Status Badges */}
          <div className="absolute top-4 left-4 z-20">
            {job.isUrgent && (
              <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1.5 font-semibold rounded-full shadow-lg animate-pulse">
                <Clock className="w-3 h-3 mr-1" />
                ด่วน
              </Badge>
            )}
            {job.status === 'completed' && (
              <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-1.5 font-semibold rounded-full shadow-lg">
                <Award className="w-3 h-3 mr-1" />
                สำเร็จ
              </Badge>
            )}
            {job.status === 'expired' && (
              <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs px-3 py-1.5 font-semibold rounded-full shadow-lg">
                <Clock className="w-3 h-3 mr-1" />
                หมดเวลา
              </Badge>
            )}
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-4 left-4 z-20">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-2xl font-bold text-lg shadow-lg">
              ฿{job.price.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1">{job.title}</h3>
              
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-2 text-yellow-500" />
                <span className="text-sm font-medium">{job.location}</span>
              </div>
            </div>
          </div>

          {/* Completed job info */}
          {job.status === 'completed' && job.rating && (
            <div className="flex items-center justify-between mb-4 p-3 bg-green-50 rounded-2xl border border-green-100">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  {[...Array(job.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                  <span className="text-sm font-semibold text-green-700 ml-1">{job.rating}.0</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">{job.completedAt}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                job.status === 'online' ? 'bg-green-500 animate-pulse' : 
                job.status === 'completed' ? 'bg-green-600' : 'bg-gray-400'
              }`}></div>
              <span className="text-sm font-medium text-gray-600 capitalize">
                {job.status === 'online' ? 'กำลังดำเนินการ' : 
                 job.status === 'completed' ? 'เสร็จสิ้นแล้ว' : 'หมดเวลา'}
              </span>
            </div>
            
            <Button 
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-6 py-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {job.status === 'completed' ? 'ดูรีวิว' : job.status === 'expired' ? 'รายละเอียด' : 'ดูงาน'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10 max-w-mobile-lg mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">
                งานของฉัน
              </h1>
              <p className="text-black/80 text-lg">จัดการและติดตามงานทั้งหมด</p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm rounded-3xl px-6 py-4">
                <div className="text-2xl font-bold text-black">฿{totalEarnings.toLocaleString()}</div>
                <div className="text-black/80 text-sm">รายได้รวม</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-mobile-lg mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-6 shadow-xl border border-blue-100">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{getJobsByStatus('online').length}</div>
                <div className="text-sm text-gray-600">งานที่กำลังทำ</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl p-6 shadow-xl border border-green-100">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{getJobsByStatus('completed').length}</div>
                <div className="text-sm text-gray-600">งานที่เสร็จแล้ว</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-yellow-50 rounded-3xl p-6 shadow-xl border border-yellow-100">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-yellow-500 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">4.9</div>
                <div className="text-sm text-gray-600">คะแนนเฉลี่ย</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-mobile-lg mx-auto px-6 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Modern Tab Navigation */}
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm rounded-3xl p-2 mb-8 h-14 shadow-lg border border-yellow-200">
            <TabsTrigger 
              value="online" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-xl font-semibold transition-all duration-300 rounded-2xl text-sm"
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span>กำลังทำ ({getJobsByStatus('online').length})</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-xl font-semibold transition-all duration-300 rounded-2xl text-sm"
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span>เสร็จแล้ว ({getJobsByStatus('completed').length})</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="expired"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-yellow-500 data-[state=active]:text-black data-[state=active]:shadow-xl font-semibold transition-all duration-300 rounded-2xl text-sm"
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span>หมดเวลา ({getJobsByStatus('expired').length})</span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="online" className="mt-6">
            <div className="space-y-4">
              {getJobsByStatus('online').length > 0 ? (
                getJobsByStatus('online').map((job) => (
                  <JobCard key={job.id} job={job} />
                ))
              ) : (
                <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-3xl border border-yellow-200">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-10 h-10 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">ไม่มีงานที่กำลังดำเนินการ</h3>
                  <p className="text-gray-600 text-lg">เริ่มต้นหางานใหม่เพื่อเพิ่มรายได้</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="space-y-4">
              {getJobsByStatus('completed').length > 0 ? (
                getJobsByStatus('completed').map((job) => (
                  <JobCard key={job.id} job={job} />
                ))
              ) : (
                <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-3xl border border-green-200">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">ยังไม่มีงานที่เสร็จสิ้น</h3>
                  <p className="text-gray-600 text-lg">งานที่เสร็จสิ้นแล้วจะแสดงที่นี่</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="expired" className="mt-6">
            <div className="space-y-4">
              {getJobsByStatus('expired').length > 0 ? (
                getJobsByStatus('expired').map((job) => (
                  <JobCard key={job.id} job={job} />
                ))
              ) : (
                <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">ไม่มีงานที่หมดเวลา</h3>
                  <p className="text-gray-600 text-lg">งานที่หมดเวลาจะแสดงที่นี่</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SeekerMyShifts;
