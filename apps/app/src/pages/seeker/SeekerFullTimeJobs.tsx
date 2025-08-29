import React, { useState } from 'react';
import { Search, MapPin, Clock, DollarSign, Star, Bookmark, ChevronRight } from 'lucide-react';
import BottomNavigation from '../../components/shared/BottomNavigation';

const FullTimeJobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('ทั้งหมด');

  // Mock data for full-time jobs
  const fullTimeJobs = [
    {
      id: 1,
      title: 'นักพัฒนาซอฟต์แวร์',
      company: 'Tech Solutions Co.',
      location: 'กรุงเทพฯ',
      salary: '35,000 - 50,000',
      type: 'งานประจำ',
      experience: '2-5 ปี',
      category: 'เทคโนโลยี',
      rating: 4.5,
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center',
      description: 'พัฒนาและดูแลระบบซอฟต์แวร์ ทำงานร่วมกับทีมพัฒนา',
      benefits: ['ประกันสุขภาพ', 'โบนัสประจำปี', 'วันหยุดพักผ่อน'],
      isBookmarked: false
    },
    {
      id: 2,
      title: 'เจ้าหน้าที่การตลาด',
      company: 'Marketing Plus Ltd.',
      location: 'กรุงเทพฯ',
      salary: '25,000 - 35,000',
      type: 'งานประจำ',
      experience: '1-3 ปี',
      category: 'การตลาด',
      rating: 4.2,
      logo: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=100&h=100&fit=crop&crop=center',
      description: 'วางแผนและดำเนินกิจกรรมทางการตลาด บริหารโซเชียลมีเดีย',
      benefits: ['ค่าคอมมิชชั่น', 'ประกันสุขภาพ', 'อบรมพัฒนาทักษะ'],
      isBookmarked: true
    },
    {
      id: 3,
      title: 'นักบัญชี',
      company: 'Finance Expert Co.',
      location: 'นนทบุรี',
      salary: '28,000 - 40,000',
      type: 'งานประจำ',
      experience: '2-4 ปี',
      category: 'การเงิน',
      rating: 4.3,
      logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center',
      description: 'จัดทำบัญชี ตรวจสอบเอกสารทางการเงิน จัดทำรายงาน',
      benefits: ['ประกันสุขภาพ', 'โบนัสประจำปี', 'ลาพักร้อน'],
      isBookmarked: false
    },
    {
      id: 4,
      title: 'ผู้จัดการฝ่ายขาย',
      company: 'Sales Pro Company',
      location: 'กรุงเทพฯ',
      salary: '40,000 - 60,000',
      type: 'งานประจำ',
      experience: '3-7 ปี',
      category: 'ขาย',
      rating: 4.6,
      logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop&crop=center',
      description: 'บริหารทีมขาย วางแผนกลยุทธ์การขาย ดูแลลูกค้า',
      benefits: ['ค่าคอมมิชชั่นสูง', 'รถประจำตำแหน่ง', 'ประกันสุขภาพ'],
      isBookmarked: false
    },
    {
      id: 5,
      title: 'นักออกแบบกราฟิก',
      company: 'Creative Studio',
      location: 'กรุงเทพฯ',
      salary: '22,000 - 32,000',
      type: 'งานประจำ',
      experience: '1-3 ปี',
      category: 'ออกแบบ',
      rating: 4.4,
      logo: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=100&h=100&fit=crop&crop=center',
      description: 'ออกแบบสื่อโฆษณา โบรชัวร์ และสื่อดิจิทัล',
      benefits: ['สภาพแวดล้อมสร้างสรรค์', 'อุปกรณ์ทันสมัย', 'ประกันสุขภาพ'],
      isBookmarked: true
    }
  ];

  const locations = ['ทั้งหมด', 'กรุงเทพฯ', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ'];

  const filteredJobs = fullTimeJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocation === 'ทั้งหมด' || job.location === selectedLocation;
    
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      

      {/* Search and Filter Section */}
      <div className="bg-white p-4 shadow-sm">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="ค้นหาตำแหน่งงานหรือบริษัท..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Location Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">สถานที่</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {locations.map((location) => (
              <button
                key={location}
                onClick={() => setSelectedLocation(location)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedLocation === location
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {location}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="px-4 py-3 bg-gray-50">
        <p className="text-sm text-gray-600">
          พบงานประจำ {filteredJobs.length} ตำแหน่ง
        </p>
      </div>

      {/* Job Listings */}
      <div className="px-4 py-2 space-y-4">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
            {/* Company Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <img
                  src={job.logo}
                  alt={job.company}
                  className="w-12 h-12 rounded-xl object-cover mr-3"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/100x100?text=Logo';
                  }}
                />
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{job.title}</h3>
                  <p className="text-gray-600 text-sm">{job.company}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bookmark 
                  className={`w-5 h-5 ${job.isBookmarked ? 'fill-primary text-primary' : 'text-gray-400'}`} 
                />
              </button>
            </div>

            {/* Job Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{job.location}</span>
                <span className="mx-2">•</span>
                <Clock className="w-4 h-4 mr-2" />
                <span>{job.experience}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                <span className="font-semibold text-green-600">฿{job.salary}</span>
                <span className="mx-2 text-gray-400">•</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-600">{job.rating}</span>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <p className="text-gray-700 text-sm mb-3 line-clamp-2">
              {job.description}
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap gap-2 mb-4">
              {job.benefits.slice(0, 3).map((benefit, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                >
                  {benefit}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors">
                สมัครงาน
              </button>
              <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">ไม่พบงานที่ตรงกับการค้นหา</h3>
          <p className="text-gray-600 text-center">
            ลองเปลี่ยนคำค้นหาหรือปรับเงื่อนไขการกรองใหม่
          </p>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default FullTimeJobs;