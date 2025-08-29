import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type LocationDetails = { lat: number; lng: number; address: string } | null;

const EmployerJobSchedule: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { aiPrompt, images, locationMode, locationDetails } = (location.state || {}) as {
    aiPrompt?: string;
    images?: string[];
    locationMode?: 'onsite' | 'online' | null;
    locationDetails?: LocationDetails;
  };

  // ฟอร์มสำหรับ วัน เวลา
  const [dateStr, setDateStr] = useState<string>('');
  const [timeStr, setTimeStr] = useState<string>('');

  // ป้องกันเข้าหน้านี้โดยตรงโดยไม่มีข้อมูลก่อนหน้า
  useEffect(() => {
    if (!aiPrompt || !locationMode) {
      navigate('/employer/home', { replace: true });
    }
  }, [aiPrompt, locationMode, navigate]);

  const isValid = useMemo(() => {
    // ต้องมีวัน เวลาไม่บังคับ
    return Boolean(dateStr);
  }, [dateStr]);

  const handleNext = () => {
    if (!isValid) return;

    const date: Date | null = dateStr ? new Date(dateStr) : null;

    navigate('/employer/job-wage', {
      state: {
        aiPrompt,
        images,
        locationMode,
        locationDetails: (locationDetails || null) as LocationDetails,
        date,
        time: timeStr || undefined,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">เลือกวันและเวลา</CardTitle>
            <CardDescription>ระบุวันที่และเวลา จากนั้นไปตั้งค่าค่าจ้าง</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="date">วันที่ทำงาน</Label>
                <Input
                  id="date"
                  type="date"
                  className="mt-1"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="time">เวลา (ไม่บังคับ)</Label>
                <Input
                  id="time"
                  type="time"
                  className="mt-1"
                  value={timeStr}
                  onChange={(e) => setTimeStr(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="w-1/3"
                onClick={() => navigate(-1)}
              >
                ย้อนกลับ
              </Button>
              <Button
                className="flex-1"
                onClick={handleNext}
                disabled={!isValid}
              >
                ไปตั้งค่าค่าจ้าง
              </Button>
            </div>
          </CardContent>
      </Card>
    </div>
  );
};

export default EmployerJobSchedule;
