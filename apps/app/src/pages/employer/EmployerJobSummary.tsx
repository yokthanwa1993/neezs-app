import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useJobs } from '@/contexts/JobContext';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

const EmployerJobSummary: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addJob } = useJobs();
    const { aiPrompt, locationMode, locationDetails, wage, wageType, date, time, images } = location.state || {};

    const handlePostJob = () => {
        const getWageTypeText = () => {
            switch(wageType) {
                case 'per_hour': return '/ชั่วโมง';
                case 'per_day': return '/วัน';
                case 'lump_sum': return 'เหมา';
                default: return '';
            }
        }
        
        const newJob = {
            title: aiPrompt.substring(0, 30) + (aiPrompt.length > 30 ? '...' : ''),
            description: `${aiPrompt}\n\nวันที่: ${date ? format(new Date(date), "PPP", { locale: th }) : 'N/A'}\nเวลา: ${time || 'N/A'}`,
            location: locationDetails?.address || 'Online',
            price: `฿${wage} ${getWageTypeText()}`,
            lat: locationDetails?.lat || 0,
            lng: locationDetails?.lng || 0,
            images,
        };
        
        addJob(newJob);
        alert('ประกาศงานเรียบร้อยแล้ว!');
        navigate('/employer/add-job', { replace: true });
    };

    if (!aiPrompt) {
        React.useEffect(() => {
            navigate('/employer/home');
        }, [navigate]);
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 flex flex-col justify-center">
             <Card className="w-full max-w-lg mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">สรุปข้อมูลประกาศงาน</CardTitle>
                    <CardDescription>กรุณาตรวจสอบความถูกต้องก่อนยืนยัน</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold">รายละเอียดงาน</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{aiPrompt}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">ตำแหน่ง</h3>
                        <p className="text-gray-700">{locationDetails?.address || 'Online'}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">วันและเวลา</h3>
                        <p className="text-gray-700">{date ? format(new Date(date), "PPP", { locale: th }) : 'N/A'} {time && `เวลา ${time}`}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">ค่าจ้าง</h3>
                        <p className="text-gray-700">
                            {wage} บาท 
                            {wageType === 'per_hour' && '/ชั่วโมง'}
                            {wageType === 'per_day' && '/วัน'}
                            {wageType === 'lump_sum' && ' (เหมา)'}
                        </p>
                    </div>
                    {images && images.length > 0 && (
                        <div>
                            <h3 className="font-semibold">รูปภาพ</h3>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {images.map((url: string, idx: number) => (
                                    <img key={idx} src={url} alt={`preview ${idx}`} className="w-full h-auto object-cover rounded-md" />
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            <footer className="sticky bottom-0 w-full bg-white border-t p-4 mt-4">
                <div className="max-w-md mx-auto flex items-center gap-4">
                    <Button variant="outline" onClick={() => navigate(-1)} className="w-1/3">
                        แก้ไข
                    </Button>
                    <Button onClick={handlePostJob} className="w-2/3">
                        ยืนยันการประกาศงาน
                    </Button>
                </div>
            </footer>
        </div>
    );
};

export default EmployerJobSummary;
