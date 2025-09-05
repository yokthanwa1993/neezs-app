import React, { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Star, Briefcase, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { apiClient } from '@neeiz/api-client';

type Job = {
  id: string;
  title: string;
  description?: string;
  location?: string;
  salary?: number;
  jobType?: string;
  category?: string;
  images?: string[];
};

const JobFeed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');

  const categories = ['ทั้งหมด','งานพาร์ทไทม์', 'งานประจำ', 'ฟรีแลนซ์', 'ฝึกงาน'];
  const [items, setItems] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get('/api/jobs?limit=50');
        setItems(res.data.items || []);
      } catch (e) {
        console.error('Failed to load jobs', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Sync category from query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) setActiveCategory(cat);
  }, [location.search]);

  const mapLabel = (jt?: string) => {
    switch ((jt || '').toLowerCase()) {
      case 'full-time': return 'งานประจำ';
      case 'part-time': return 'งานพาร์ทไทม์';
      case 'freelance': return 'ฟรีแลนซ์';
      case 'internship': return 'ฝึกงาน';
      default: return 'อื่นๆ';
    }
  };

  const filteredItems = useMemo(() => {
    if (activeCategory === 'ทั้งหมด') return items;
    return items.filter(j => (j.category || mapLabel(j.jobType)) === activeCategory);
  }, [items, activeCategory]);

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
          {loading ? (
            <div className="text-center text-gray-500 py-8">กำลังโหลดงาน...</div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredItems.length === 0 ? (
                <div className="text-center text-gray-500 py-8">ยังไม่มีงาน</div>
              ) : (
                filteredItems.map((job) => (
                  <Card
                    key={job.id}
                    className="rounded-2xl border-none bg-gray-50 overflow-hidden shadow-sm cursor-pointer"
                    onClick={() => navigate(`/job/${job.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-square bg-white rounded-xl mb-4 overflow-hidden">
                        <img
                          src={(job.images && job.images[0]) || 'https://placehold.co/400x300?text=Job'}
                          alt={job.title}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); navigate(`/job/${job.id}`); }}
                        />
                      </div>
                      <h3 className="font-bold text-gray-800 truncate">{job.title}</h3>
                      <p className="text-sm text-gray-500 truncate flex items-center">
                        <Briefcase className="h-3 w-3 mr-1.5" /> {job.location || '-'}
                      </p>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <span>{job.jobType || '-'}</span>
                          {typeof job.salary === 'number' && (
                            <span className="ml-3">฿{job.salary.toLocaleString('th-TH')}</span>
                          )}
                        </div>
                        <Button size="icon" className="bg-primary hover:bg-primary/90 rounded-full h-8 w-8">
                          <Plus className="h-5 w-5 text-white" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </section>
      </main>
      
    </div>
  );
};

export default JobFeed;
