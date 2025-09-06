import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';

// Fallback mock (keeps UI working without backend yet)
const mockJobDetail = {
  id: 1,
  title: 'ตัดต่อวีดีโอ',
  location: 'กทม',
  price: 15000,
  duration: '2-3 วัน',
  description:
    'ต้องการคนที่มีประสบการณ์ในการตัดต่อวีดีโอสำหรับงานโฆษณา ต้องมีความคิดสร้างสรรค์และสามารถทำงานได้รวดเร็ว',
  requirements: [
    'มีประสบการณ์ตัดต่อวีดีโออย่างน้อย 2 ปี',
    'ใช้ Premiere Pro, After Effects ได้',
    'มีความคิดสร้างสรรค์',
    'ทำงานได้รวดเร็วและตรงเวลา',
  ],
  images: [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
  ],
  employer: {
    name: 'บริษัท ABC',
    rating: 4.8,
    totalJobs: 25,
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
};

const EmployerJobEdit: React.FC = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Prefer incoming state (when coming from detail), else fallback to mock
  const initial = useMemo(() => {
    const incoming = (location.state as any)?.job;
    return incoming ?? mockJobDetail;
  }, [location.state]);

  const [title, setTitle] = useState<string>(initial.title || '');
  const [locationText, setLocationText] = useState<string>(initial.location || '');
  const [price, setPrice] = useState<number>(Number(initial.price) || 0);
  const [duration, setDuration] = useState<string>(initial.duration || '');
  const [description, setDescription] = useState<string>(initial.description || '');
  const [requirementsText, setRequirementsText] = useState<string>((initial.requirements || []).join('\n'));
  const [jobType, setJobType] = useState<string>((initial as any).jobType || 'งานออนไลน์');
  const [employerName, setEmployerName] = useState<string>(initial.employer?.name || '');
  const [employerRating, setEmployerRating] = useState<number>(Number(initial.employer?.rating || 0));
  const [employerTotalJobs, setEmployerTotalJobs] = useState<number>(Number(initial.employer?.totalJobs || 0));
  const [employerAvatar, setEmployerAvatar] = useState<string>(initial.employer?.avatar || '');
  const [coverImage, setCoverImage] = useState<string>((initial.images && initial.images[0]) || '');

  const onSave = () => {
    const updated = {
      id: Number(jobId ?? initial.id),
      title,
      location: locationText,
      price: Number(price) || 0,
      duration,
      description,
      jobType,
      requirements: requirementsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      images: coverImage ? [coverImage] : initial.images,
      employer: {
        name: employerName,
        rating: Number(employerRating) || 0,
        totalJobs: Number(employerTotalJobs) || 0,
        avatar: employerAvatar,
      },
    };

    // For now, pass data via navigation state back to detail page
    navigate(`/employer/job/${jobId}/detail`, { state: { job: updated } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-mobile-lg mx-auto p-4 pb-24 bottom-nav-spacing">
        <h1 className="text-2xl font-bold mb-4">แก้ไขงาน</h1>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>ข้อมูลงาน</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">หัวข้องาน</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="เช่น ตัดต่อวีดีโอ" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">สถานที่</label>
                <Input value={locationText} onChange={(e) => setLocationText(e.target.value)} placeholder="กทม" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ราคา (บาท)</label>
                <Input type="number" inputMode="numeric" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ระยะเวลา</label>
              <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="2-3 วัน" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ประเภทงาน</label>
              <Input value={jobType} onChange={(e) => setJobType(e.target.value)} placeholder="งานออนไลน์" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">รายละเอียดงาน</label>
              <Textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="อธิบายรายละเอียดงาน" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">คุณสมบัติที่ต้องการ (บรรทัดละ 1 ข้อ)</label>
              <Textarea rows={4} value={requirementsText} onChange={(e) => setRequirementsText(e.target.value)} placeholder={"ตัวอย่าง\nมีประสบการณ์ 2 ปี\nใช้ Premiere Pro ได้"} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">รูปหน้าปก (ลิงก์รูปภาพ)</label>
              <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>ข้อมูลผู้ว่าจ้าง</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">ชื่อบริษัท</label>
              <Input value={employerName} onChange={(e) => setEmployerName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">เรตติ้ง</label>
                <Input type="number" step="0.1" value={employerRating} onChange={(e) => setEmployerRating(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">จำนวนงานทั้งหมด</label>
                <Input type="number" value={employerTotalJobs} onChange={(e) => setEmployerTotalJobs(Number(e.target.value))} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">รูปโปรไฟล์ (ลิงก์รูปภาพ)</label>
              <Input value={employerAvatar} onChange={(e) => setEmployerAvatar(e.target.value)} placeholder="https://..." />
            </div>
          </CardContent>
        </Card>

        <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-3">
          <Button
            variant="secondary"
            className="flex-1 h-12"
            onClick={() => navigate(-1)}
          >
            ยกเลิก
          </Button>
          <Button
            className="flex-1 h-12 bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
            onClick={onSave}
          >
            บันทึกการแก้ไข
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployerJobEdit;
