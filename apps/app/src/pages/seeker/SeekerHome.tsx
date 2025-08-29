import React, { useState, useCallback } from 'react';
import { Star, Bell, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jobs } from '@/data/mockJobs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useEmblaCarousel from 'embla-carousel-react';
import { DotButton } from '@/components/shared/EmblaCarouselButtons';

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
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    React.useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    return (
        <main className="flex-grow pb-[76px] flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white px-4 pt-4 pb-3 sticky top-0 z-30">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-yellow-500">NEEZS</h1>
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
                    {jobs.slice(0, 20).map((job) => (
                        <Card key={job.id} className="overflow-hidden rounded-2xl shadow-lg border-none group w-full cursor-pointer" onClick={() => navigate(`/seeker/job/${job.id}`)}>
                            <div className="relative">
                                <img src={job.imageUrls[0]} alt={job.title} className="w-full h-32 object-cover" />
                            </div>
                            <CardContent className="p-3">
                                <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
                                <p className="text-sm text-gray-500 mt-1 truncate">{job.company}</p>
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-lg font-bold text-green-600">฿{job.earnings.toLocaleString()}</span>
                                    <Button size="sm" className="bg-primary text-white hover:bg-primary/90 rounded-lg text-xs px-4 py-2 h-auto">
                                        สมัคร
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default SeekerHome;