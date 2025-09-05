import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import EmblaCarousel from '@/shared/components/EmblaCarousel';
import { apiClient } from '@neeiz/api-client';
import { useSeekerAuth } from '../contexts/SeekerAuthContext';

type JobDetail = {
    id: string;
    title: string;
    description?: string;
    location?: string;
    salary?: number;
    jobType?: string;
    images?: string[];
    createdAt?: any;
};

const SeekerJobDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [job, setJob] = useState<JobDetail | null>(null);
    const { user } = useSeekerAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                if (!id) return;
                const res = await apiClient.get(`/api/jobs/${id}`);
                setJob(res.data || null);
            } catch (e) {
                console.error('Failed to load job detail', e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen text-gray-500">กำลังโหลด...</div>;
    }

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
                {(() => {
                    const toProxiedImage = (url?: string) => {
                        if (!url) return url;
                        try {
                            const m = url.match(/\/o\/([^?]+)\?/);
                            if (m && m[1]) {
                                const path = decodeURIComponent(m[1]);
                                return `/api/images?path=${encodeURIComponent(path)}`;
                            }
                        } catch {}
                        return url;
                    };
                    const slides = (job.images || []).map((u) => toProxiedImage(u) || u);
                    return <EmblaCarousel slides={slides} />;
                })()}
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-full cursor-pointer" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-6 w-6 text-gray-800" />
                </div>
            </div>

            <div className="p-6 pb-24">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>

                <div className="flex items-center gap-6 text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        <span>{job.location || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        <span>{typeof job.salary === 'number' ? `฿${job.salary.toLocaleString('th-TH')}` : ''}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">รายละเอียดงาน</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                </div>
                
                {/* Apply Section moved here */}
                <div className="pt-6 border-t flex items-center justify-between">
                    <div className="text-left">
                        <p className="text-sm text-gray-500">ค่าตอบแทน</p>
                        <p className="text-2xl font-bold text-green-600">{typeof job.salary === 'number' ? `฿${job.salary.toLocaleString('th-TH')}` : ''}</p>
                    </div>
                    <Button 
                        className="h-12 text-lg font-semibold bg-primary text-white hover:bg-primary/90 rounded-lg px-4"
                        onClick={() => {
                            const phoneE164 = user?.phoneNumber || '';
                            const toLocal10 = (e164?: string) => {
                                if (!e164) return '';
                                if (e164.startsWith('+66')) return '0' + e164.slice(3);
                                return e164;
                            };
                            const localPhone = toLocal10(phoneE164);
                            if (user && user.phoneNumber) {
                                // Phone already verified; skip OTP and proceed to eKYC
                                navigate('/seeker/apply/ekyc-id', { state: { jobId: job.id, phone: localPhone } });
                            } else {
                                navigate('/seeker/apply/otp', { state: { jobId: job.id } });
                            }
                        }}
                    >
                        สมัครงาน
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SeekerJobDetail;
