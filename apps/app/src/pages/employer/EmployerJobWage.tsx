import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type LocationDetails = { lat: number; lng: number; address: string } | null;

const EmployerJobWage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { aiPrompt, images, locationMode, locationDetails, date, time } = (location.state || {}) as {
    aiPrompt?: string;
    images?: string[];
    locationMode?: 'onsite' | 'online' | null;
    locationDetails?: LocationDetails;
    date?: Date | null;
    time?: string | undefined;
  };

  const [wage, setWage] = useState<string>('');
  const [wageType, setWageType] = useState<'per_hour' | 'per_day' | 'lump_sum'>('per_hour');

  useEffect(() => {
    if (!aiPrompt || !locationMode || !date) {
      navigate('/employer/home', { replace: true });
    }
  }, [aiPrompt, locationMode, date, navigate]);

  const isValid = useMemo(() => {
    return wage.trim() !== '' && !Number.isNaN(Number(wage));
  }, [wage]);

  const handleNext = () => {
    if (!isValid) return;
    navigate('/employer/job-summary', {
      state: {
        aiPrompt,
        images,
        locationMode,
        locationDetails: (locationDetails || null) as LocationDetails,
        wage: Number(wage),
        wageType,
        date,
        time,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">ตั้งค่าค่าจ้าง</CardTitle>
            <CardDescription>ระบุจำนวนเงินและเลือกประเภทค่าจ้าง</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="wage">ค่าจ้าง</Label>
              <div className="mt-1 flex items-center gap-2">
                <Input
                  id="wage"
                  type="number"
                  inputMode="decimal"
                  placeholder="เช่น 250"
                  value={wage}
                  onChange={(e) => setWage(e.target.value)}
                />
                <Select value={wageType} onValueChange={(v) => setWageType(v as typeof wageType)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="ประเภท" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="per_hour">บาท/ชั่วโมง</SelectItem>
                    <SelectItem value="per_day">บาท/วัน</SelectItem>
                    <SelectItem value="lump_sum">เหมารวม</SelectItem>
                  </SelectContent>
                </Select>
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
                ไปอัปโหลดรูปภาพ
              </Button>
            </div>
          </CardContent>
      </Card>
    </div>
  );
};

export default EmployerJobWage;


