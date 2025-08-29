import React from 'react';
import { Star, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SeekerProfileExperienceTab = () => {
  const completedJobs = [
    {
      id: 1,
      title: 'งานล้างจานด่วน',
      company: 'งานล้างจานที่ร้านอาหารไทยบ้านเรา',
      date: '15 ธ.ค. 2024',
      rating: 5,
      earnings: 500,
      imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
    },
    {
      id: 2,
      title: 'งานเสิร์ฟอาหาร',
      company: 'งานเสิร์ฟที่ร้านกาแฟสไตล์ญี่ปุ่น',
      date: '10 ธ.ค. 2024',
      rating: 4.8,
      earnings: 800,
      imageUrl: 'https://images.unsplash.com/photo-1516876437184-593fda40c7c4?w=400&h=400&fit=crop',
    },
    {
      id: 3,
      title: 'งานจัดระเบียบสินค้า',
      company: 'งานจัดระเบียบที่ร้านสะดวกซื้อ 7-Eleven',
      date: '5 ธ.ค. 2024',
      rating: 4.5,
      earnings: 600,
      imageUrl: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=400&h=400&fit=crop',
    },
    {
      id: 4,
      title: 'งานช่วยจัดงานอีเวนต์',
      company: 'งานช่วยจัดงานอีเวนต์ของบริษัท',
      date: '1 ธ.ค. 2024',
      rating: 4.9,
      earnings: 1200,
      imageUrl: 'https://images.unsplash.com/photo-1496449903678-68ddcb189a24?w=400&h=400&fit=crop',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">ผลงานของฉัน</h2>
        <Button className="bg-yellow-400 text-white hover:bg-yellow-500 rounded-lg">
          <Plus className="mr-2 h-4 w-4" /> เพิ่มผลงาน
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {completedJobs.map((job) => (
          <div key={job.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <img src={job.imageUrl} alt={job.title} className="w-full h-32 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{job.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{job.company}</p>
              <div className="flex items-center justify-between mt-4 text-sm">
                <span className="text-gray-500">{job.date}</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-semibold text-gray-800">{job.rating}</span>
                  </div>
                  <span className="font-semibold text-green-600">฿{job.earnings}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeekerProfileExperienceTab;