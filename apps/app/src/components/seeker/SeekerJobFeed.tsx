import React, { useState } from 'react';
import { Search, SlidersHorizontal, Star, Briefcase, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../shared/BottomNavigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const JobFeed = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('งานพาร์ทไทม์');

  const categories = ['งานพาร์ทไทม์', 'งานประจำ', 'ฟรีแลนซ์', 'ฝึกงาน'];

  const jobs = [
    { id: 1, name: 'พนักงานเสิร์ฟ', company: 'ร้านอาหารสยาม', rating: 4.8, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop', category: 'งานพาร์ทไทม์', location: 'สยามสแควร์' },
    { id: 2, name: 'พนักงานเก็บเงิน', company: '7-Eleven', rating: 4.8, image: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=400&h=300&fit=crop', category: 'งานพาร์ทไทม์', location: 'ลาดพร้าว' },
    { id: 3, name: 'พนักงานทำความสะอาด', company: 'โรงแรมบางกอก', rating: 4.9, image: 'https://images.unsplash.com/photo-1581578021424-ebdc493aeee7?w=400&h=300&fit=crop', category: 'งานพาร์ทไทม์', location: 'ราชเทวี' },
    { id: 4, name: 'วิศวกรซอฟต์แวร์', company: 'เทคสตาร์ทอัพ', rating: 4.9, image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop', category: 'งานประจำ', location: 'เชียงใหม่' },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      

      <main className="px-4">
        <section className="py-6">
          <h1 className="text-4xl font-bold text-gray-800 leading-tight">
            ค้นหางาน
          </h1>
          <h2 className="text-4xl font-bold text-gray-800 leading-tight">
            ที่ <span className="text-primary">ใช่</span> สำหรับคุณ
          </h2>
        </section>

        <section className="pb-4">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-gray-400" />
            <Input
              placeholder="ค้นหางาน..."
              className="w-full pl-12 pr-14 py-6 bg-gray-100 border-none rounded-xl"
            />
            <Button variant="ghost" size="icon" className="absolute right-2 bg-white rounded-lg">
              <SlidersHorizontal className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </section>

        <section className="py-4">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? 'default' : 'ghost'}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full whitespace-nowrap ${activeCategory === cat ? 'bg-primary hover:bg-primary/90' : 'text-gray-500'}`}
              >
                {cat}
              </Button>
            ))}
            <Button variant="link" className="text-primary">ดูทั้งหมด</Button>
          </div>
        </section>

        <section className="py-4">
          <div className="flex flex-col gap-4">
            {jobs.filter(p => p.category === activeCategory).map((job) => (
              <Card 
                key={job.id} 
                className="rounded-2xl border-none bg-gray-50 overflow-hidden shadow-sm cursor-pointer"
                onClick={() => navigate(`/job/${job.id}`)}
              >
                <CardContent className="p-4">
                  <div className="aspect-square bg-white rounded-xl mb-4 overflow-hidden">
                    <img
                      src={job.image}
                      alt={job.name}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); navigate(`/job/${job.id}`); }}
                    />
                  </div>
                  <h3 className="font-bold text-gray-800 truncate">{job.name}</h3>
                  <p className="text-sm text-gray-500 truncate flex items-center">
                    <Briefcase className="h-3 w-3 mr-1.5" /> {job.company}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="text-sm font-bold">{job.rating}</span>
                    </div>
                    <Button size="icon" className="bg-primary hover:bg-primary/90 rounded-full h-8 w-8">
                      <Plus className="h-5 w-5 text-white" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default JobFeed;
