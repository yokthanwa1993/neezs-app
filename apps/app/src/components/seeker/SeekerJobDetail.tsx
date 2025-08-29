import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobs } from '@/data/mockJobs';
import { ArrowLeft, Star, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmblaCarousel from '@/components/shared/EmblaCarousel';

const SeekerJobDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const job = jobs.find(j => j.id.toString() === id);

    if (!job) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-2xl font-bold mb-4">ไม่พบงานที่ค้นหา</h2>
                <Button onClick={() => navigate('/seeker/home')}>กลับสู่หน้าหลัก</Button>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="relative">
                <EmblaCarousel slides={job.imageUrls} />
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-full cursor-pointer" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-6 w-6 text-gray-800" />
                </div>
            </div>

            <div className="p-6 pb-24">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <p className="text-lg text-gray-600 mb-4">{job.company}</p>

                <div className="flex items-center gap-6 text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        <span>{job.date}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                        <span className="font-bold text-gray-800">{job.rating}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">รายละเอียดงาน</h2>
                    <p className="text-gray-700 leading-relaxed">{job.description}</p>
                </div>
                
                {/* Apply Section moved here */}
                <div className="pt-6 border-t flex items-center justify-between">
                    <div className="text-left">
                        <p className="text-sm text-gray-500">ค่าตอบแทน</p>
                        <p className="text-2xl font-bold text-green-600">฿{job.earnings.toLocaleString()}</p>
                    </div>
                    <Button 
                        className="h-12 text-lg font-semibold bg-primary text-white hover:bg-primary/90 rounded-lg px-8"
                        onClick={() => navigate('/seeker/apply/otp', { state: { jobId: job.id } })}
                    >
                        สมัครงาน
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SeekerJobDetail;