import React, { useState, useCallback, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import useEmblaCarousel from 'embla-carousel-react';
import { DotButton } from '@/shared/components/EmblaCarouselButtons';
import { useSeekerAuth } from '../contexts/SeekerAuthContext';
import { logger } from '@/shared/utils/logger';
import { apiClient } from '@neeiz/api-client';
import LoadingScreen from '@/shared/components/LoadingScreen';
import { useQuery } from '@tanstack/react-query';

type Job = {
    id: string;
    title: string;
    description?: string;
    location?: string;
    salary?: number;
    jobType?: string;
    images?: string[];
};

const bannerSlides = [
  {
    title: 'โดดเด่นกว่าใครในการค้นหา',
    description: 'ผู้สมัครที่มีป้ายทักษะมีโอกาสถูกจ้างงานมากกว่า 20%',
    buttonText: 'ทำแบบทดสอบทักษะ',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=auto',
    bgColor: 'bg-yellow-400',
  },
  {
    title: 'หางานที่ใช่ได้ในไม่กี่นาที',
    description: 'ค้นพบโอกาสงานใหม่ๆ ที่ตรงกับความสามารถของคุณได้ง่ายขึ้น',
    buttonText: 'ค้นหางาน',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=auto',
    bgColor: 'bg-amber-400',
  },
];

const SeekerHome = () => {
    const navigate = useNavigate();
    const { isLoading: authLoading, user } = useSeekerAuth();
    
    logger.info('SeekerHome: Component rendered for authenticated user', {
        user: user ? `${user.uid} (${user.email})` : 'null'
    });
    
    // All hooks must be called before any conditional returns
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    const { data, isLoading: listLoading, isFetching } = useQuery({
        queryKey: ['jobs', 20],
        queryFn: async () => {
            const res = await apiClient.get('/api/jobs?limit=20');
            return (res.data?.items || []) as Job[];
        },
        staleTime: 1000 * 60 * 5, // 5 minutes: consider fresh, no refetch on remount
        gcTime: 1000 * 60 * 10,   // keep cache 10 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: false,    // do not refetch when navigating back
        keepPreviousData: true,
    });


    if (authLoading || (listLoading && !data)) {
        return <LoadingScreen title="กำลังเตรียมความพร้อม..." subtitle="กำลังตรวจสอบสถานะและโหลดรายการงาน"/>;
    }

    const toProxiedImage = (url?: string) => {
        if (!url) return undefined;
        try {
            // Expect firebase download url: https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<ENCODED_PATH>?...
            const m = url.match(/\/o\/([^?]+)\?/);
            if (m && m[1]) {
                const path = decodeURIComponent(m[1]);
                return `/api/images?path=${encodeURIComponent(path)}`;
            }
        } catch {}
        return url; // fallback to original
    };

    return (
        <main className="flex-grow pb-[76px] flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white px-4 pt-4 pb-3 sticky top-0 z-30">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-black">NEEZS</h1>
                    <Button variant="ghost" size="icon" className="rounded-full group" onClick={() => navigate('/map-view')}>
                        <MapPin className="h-6 w-6 text-gray-500 group-hover:text-yellow-500 group-hover:fill-yellow-200" />
                    </Button>
                </div>
            </header>

            {/* Banner Carousel */}
            <section className="px-4 py-4">
                <div className="overflow-hidden relative" ref={emblaRef}>
                    <div className="flex">
                        {bannerSlides.map((slide, index) => (
                            <div className="flex-[0_0_100%] min-w-0" key={index}>
                                {index === 0 ? (
                                    // Dynamic popular-jobs banner
                                    <div
                                      className={`bg-yellow-400 rounded-2xl p-6 flex items-center text-white relative h-48 overflow-hidden cursor-pointer`}
                                      onClick={() => navigate('/seeker/jobs')}
                                    >
                                      <div className="w-1/2 z-10">
                                        <h2 className="text-xl font-bold">งานยอดนิยม</h2>
                                        <p className="text-xs mt-2 mb-3">สำรวจหมวดหมู่งานที่คนหามากที่สุด</p>
                                        {/* Top categories quick view */}
                                        <div className="flex flex-col gap-1 mb-3">
                                          {(() => {
                                            // Build quick top-3 popular categories summary
                                            const counts: Record<string, number> = {};
                                            const mapLabel = (jt?: string) => {
                                              switch ((jt || '').toLowerCase()) {
                                                case 'full-time': return 'งานประจำ';
                                                case 'part-time': return 'งานพาร์ทไทม์';
                                                case 'freelance': return 'ฟรีแลนซ์';
                                                case 'internship': return 'ฝึกงาน';
                                                default: return 'อื่นๆ';
                                              }
                                            };
                                            (data || []).forEach((j:any) => {
                                              const label = (j.category as string) || mapLabel(j.jobType);
                                              counts[label] = (counts[label] || 0) + 1;
                                            });
                                            const top = Object.entries(counts)
                                              .sort((a,b) => b[1]-a[1])
                                              .slice(0,3);
                                            const short = (n:number) => {
                                              if (n >= 100000) return 'แสน+ งาน';
                                              if (n >= 10000) return 'หมื่น+ งาน';
                                              return `${n.toLocaleString('th-TH')} งาน`;
                                            };
                                            return top.length === 0 ? (
                                              <span className="text-[11px] text-white/80">ยังไม่มีข้อมูลหมวดหมู่ยอดนิยม</span>
                                            ) : (
                                              top.map(([label, cnt]) => (
                                                <div key={label} className="text-[11px] bg-white/15 rounded-full px-2 py-1 w-max">
                                                  <span className="font-semibold text-white">{label}</span>
                                                  <span className="mx-1">•</span>
                                                  <span className="text-white/90">{short(cnt)}</span>
                                                </div>
                                              ))
                                            );
                                          })()}
                                        </div>
                                        <Button className="bg-white text-black hover:bg-gray-200 rounded-full text-sm px-5 py-2 h-auto" onClick={(e) => { e.stopPropagation(); navigate('/seeker/jobs'); }}>
                                          เลือกหมวดหมู่งาน
                                        </Button>
                                      </div>
                                      <div className="absolute right-0 bottom-0 w-1/2 h-full">
                                        <img src={slide.imageUrl} alt={slide.title} className="absolute bottom-0 right-[-20px] h-[110%] w-auto object-contain" />
                                      </div>
                                    </div>
                                ) : (
                                    <div className={`${slide.bgColor} rounded-2xl p-6 flex items-center text-white relative h-48 overflow-hidden`}>
                                      <div className="w-1/2 z-10">
                                        <h2 className="text-xl font-bold">{slide.title}</h2>
                                        <p className="text-xs mt-2 mb-4">{slide.description}</p>
                                        <Button className="bg-white text-black hover:bg-gray-200 rounded-full text-sm px-5 py-2 h-auto">
                                          {slide.buttonText}
                                        </Button>
                                      </div>
                                      <div className="absolute right-0 bottom-0 w-1/2 h-full">
                                        <img src={slide.imageUrl} alt={slide.title} className="absolute bottom-0 right-[-20px] h-[110%] w-auto object-contain" />
                                      </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center">
                        {scrollSnaps.map((_, index) => (
                            <DotButton
                                key={index}
                                selected={index === selectedIndex}
                                onClick={() => emblaApi && emblaApi.scrollTo(index)}
                            />
                        ))}
                    </div>
                </div>
            </section>


            {/* Job Listings */}
            <section className="pt-2 pb-6 px-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">งานล่าสุด</h2>
                    <button onClick={() => navigate('/seeker/jobs')} className="text-sm text-primary font-semibold">
                        ดูทั้งหมด
                    </button>
                </div>
                <div className="flex flex-col gap-4">
                    {(data?.length || 0) === 0 ? (
                        <div className="text-center text-gray-500 py-8">ยังไม่มีงาน</div>
                    ) : (
                        data!.map((job) => (
                            <Card key={job.id} className="overflow-hidden rounded-2xl shadow-lg border-none group w-full cursor-pointer" onClick={() => navigate(`/seeker/job/${job.id}`)}>
                                <div className="relative">
                                    <img src={toProxiedImage((job.images && job.images[0])) || 'https://placehold.co/800x300?text=Job'} alt={job.title} className="w-full h-32 object-cover" />
                                </div>
                                <CardContent className="p-3">
                                    <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1 truncate">{job.location || '-'}</p>
                                    <div className="flex justify-between items-center mt-3">
                                        <span className="text-lg font-bold text-green-600">
                                            {typeof job.salary === 'number' ? `฿${job.salary.toLocaleString('th-TH')}` : ''}
                                        </span>
                                        <Button size="sm" className="bg-primary text-white hover:bg-primary/90 rounded-lg text-xs px-4 py-2 h-auto">
                                            สมัคร
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
                {isFetching && (
                    <div className="text-center text-gray-400 text-xs mt-2">อัปเดตรายการงาน...</div>
                )}
            </section>
        </main>
    );
};

export default SeekerHome;
