import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, Clock, User, Star, MapPin, XCircle, CheckCircle2 } from 'lucide-react';

// Mock data to simulate job applicants (match reference UI)
const applicants = [
    {
        id: '1',
        name: 'น้องมายด์',
        avatarUrl: 'https://i.pravatar.cc/150?u=applicant-1',
        experienceYears: 3,
        status: 'pending_review', // รอการตรวจสอบ
        rating: 4.8,
        distance: '1.2 km',
        appliedAgo: 'สมัครเมื่อ 2 วันที่แล้ว',
        skills: ['Video Editing', 'After Effects', 'Premiere Pro'],
    },
    {
        id: '2',
        name: 'พี่เก่ง',
        avatarUrl: 'https://i.pravatar.cc/150?u=applicant-2',
        experienceYears: 5,
        status: 'verified', // ตรวจสอบแล้ว
        rating: 4.5,
        distance: '3.5 km',
        appliedAgo: 'สมัครเมื่อ 1 วันที่แล้ว',
        skills: ['Video Production', 'Motion Graphics'],
    },
    {
        id: '3',
        name: 'คุณสมศักดิ์',
        avatarUrl: 'https://i.pravatar.cc/150?u=applicant-3',
        experienceYears: 7,
        status: 'pending_review',
        rating: 5.0,
        distance: '5.1 km',
        appliedAgo: 'สมัครเมื่อ 3 ชั่วโมงที่แล้ว',
        skills: ['Professional Editing', 'Color Grading', 'Sound Design'],
    },
    {
        id: '4',
        name: 'น้องฝน',
        avatarUrl: 'https://i.pravatar.cc/150?u=applicant-4',
        experienceYears: 2,
        status: 'pending_review',
        rating: 4.2,
        distance: '8.0 km',
        appliedAgo: 'สมัครเมื่อ 5 วันที่แล้ว',
        skills: ['Basic Editing', 'YouTube Content'],
    },
    {
        id: '5',
        name: 'คุณวิชัย',
        avatarUrl: 'https://i.pravatar.cc/150?u=applicant-5',
        experienceYears: 6,
        status: 'selected', // คัดเลือกแล้ว
        rating: 4.9,
        distance: '0.8 km',
        appliedAgo: 'สมัครเมื่อ 1 วันที่แล้ว',
        skills: ['Cinema 4D', 'Advanced Effects', 'Creative Direction'],
    },
    {
        id: '6',
        name: 'น้องน้ำ',
        avatarUrl: 'https://i.pravatar.cc/150?u=applicant-6',
        experienceYears: 4,
        status: 'pending_review',
        rating: 4.7,
        distance: '2.1 km',
        appliedAgo: 'สมัครเมื่อ 4 ชั่วโมงที่แล้ว',
        skills: ['Social Media Content', 'TikTok Editing'],
    },
];

const EmployerJobApplicants: React.FC = () => {
    const navigate = useNavigate();

    const renderStatus = (status: string) => {
        switch (status) {
            case 'pending_review':
                return (
                    <div className="flex items-center text-amber-600 text-sm font-medium">
                        <Clock className="w-4 h-4 mr-1" /> รอการตรวจสอบ
                    </div>
                );
            case 'verified':
                return (
                    <div className="flex items-center text-emerald-700 text-sm font-medium">
                        <Check className="w-4 h-4 mr-1" /> ตรวจสอบแล้ว
                    </div>
                );
            case 'selected':
                return (
                    <div className="flex items-center text-blue-700 text-sm font-medium">
                        <User className="w-4 h-4 mr-1" /> คัดเลือกแล้ว
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <header className="bg-white border-b sticky top-0 z-10">
            </header>
            <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
                <div className="space-y-2">
                    {applicants.map((applicant) => (
                        <Card
                            key={applicant.id}
                            className="border rounded-xl overflow-hidden cursor-pointer"
                            onClick={() => navigate(`/employer/applicant/${applicant.id}`)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-16 h-28 flex-shrink-0">
                                        <img 
                                            src={applicant.avatarUrl} 
                                            alt={applicant.name}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-gray-900 text-base">{applicant.name}</h3>
                                            <span className="text-sm text-gray-600">ประสบการณ์ {applicant.experienceYears} ปี</span>
                                        </div>
                                        <div className="mt-1">{renderStatus(applicant.status)}</div>

                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-700">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="font-medium">{applicant.rating}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4 text-gray-500" />
                                                <span>{applicant.distance}</span>
                                            </div>
                                        </div>

                                        <div className="mt-2 text-sm text-gray-700">
                                            <span>{applicant.appliedAgo} </span>
                                            <span className="whitespace-pre-wrap">{applicant.skills.join(' ')}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button
                                            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border text-sm text-gray-700 hover:bg-gray-50"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <XCircle className="w-4 h-4 mr-1" /> ปฏิเสธผู้สมัคร
                                        </button>
                                        <button
                                            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-yellow-400 text-black text-sm font-semibold hover:bg-yellow-500"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-1" /> ยืนยันผู้สมัคร
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default EmployerJobApplicants;