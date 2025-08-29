import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { apiClient } from '@neeiz/api-client';
import { useAuth } from '@/contexts/AuthContext';

const TOTAL_STEPS = 4;

interface EmployerAddJobFormProps {
  onFinished: () => void;
}

const EmployerAddJobForm: React.FC<EmployerAddJobFormProps> = ({ onFinished }) => {
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    jobTitle: '',
    description: '',
    category: '',
    location: '',
    salary: '',
    jobType: '',
    images: [] as string[],
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleNext = async () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      return;
    }

    // Final submission -> call API
    try {
      const salaryNumber = formData.salary ? Number(formData.salary) : 0;
      await apiClient.post('/api/jobs', {
        title: formData.jobTitle,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        salary: salaryNumber,
        jobType: formData.jobType || 'full-time',
        status: 'active',
        employerId: user?.id || 'unknown',
        images: formData.images,
      });
      alert('ลงประกาศงานเรียบร้อยแล้ว!');
      onFinished();
    } catch (error) {
      console.error('Failed to post job:', error);
      alert('เกิดข้อผิดพลาดในการลงประกาศงาน กรุณาลองใหม่');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const uploadFile = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await apiClient.post('/api/jobs/upload', fd);
    return res.data.url as string;
  };

  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setIsUploading(true);
    try {
      const uploaded = await Promise.all(files.map(uploadFile));
      setFormData(prev => ({ ...prev, images: [...prev.images, ...uploaded] }));
    } catch (err) {
      console.error('Upload error:', err);
      alert('อัปโหลดรูปภาพไม่สำเร็จ กรุณาลองใหม่');
    } finally {
      setIsUploading(false);
      // reset value to allow re-selecting the same file(s)
      e.currentTarget.value = '';
    }
  };

  const removeImageAt = (idx: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-2">
        <Progress value={progress} className="w-full h-2" />
        <p className="text-sm text-gray-500 text-center mt-2">ขั้นตอนที่ {step} จาก {TOTAL_STEPS}</p>
      </div>

      <main className="flex-grow p-6 overflow-y-auto">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">เริ่มต้นด้วยข้อมูลพื้นฐาน</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="jobTitle" className="font-semibold">ชื่อตำแหน่งงาน</Label>
                <Input id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="เช่น บาริสต้า, พนักงานเสิร์ฟ" className="mt-1"/>
              </div>
              <div>
                <Label htmlFor="description" className="font-semibold">รายละเอียดงาน</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="อธิบายลักษณะงาน, ความรับผิดชอบ, และคุณสมบัติ" className="mt-1" rows={5}/>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">ถัดไป, เลือกประเภทของงาน</h3>
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">หมวดหมู่</Label>
                 <Select name="category" onValueChange={handleSelectChange('category')} value={formData.category}>
                    <SelectTrigger className="mt-1">
                        <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="accounting">บัญชีและการเงิน</SelectItem>
                        <SelectItem value="animal-care">ดูแลสัตว์</SelectItem>
                        <SelectItem value="arts-design">ศิลปะและการออกแบบ</SelectItem>
                        <SelectItem value="babysitting">ดูแลเด็ก</SelectItem>
                        <SelectItem value="beauty-wellness">ความงามและสุขภาพ</SelectItem>
                        <SelectItem value="cleaning">ทำความสะอาด</SelectItem>
                        <SelectItem value="other">อื่นๆ</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location" className="font-semibold">สถานที่</Label>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="เช่น กรุงเทพ, สมุทรปราการ" className="mt-1"/>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">มาคุยเรื่องค่าตอบแทนกัน</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="salary" className="font-semibold">เงินเดือน (บาทต่อเดือน)</Label>
                <Input id="salary" name="salary" type="number" value={formData.salary} onChange={handleChange} placeholder="เช่น 25000" className="mt-1"/>
              </div>
              <div>
                <Label className="font-semibold">ประเภทการจ้างงาน</Label>
                <Select name="jobType" onValueChange={handleSelectChange('jobType')} value={formData.jobType}>
                    <SelectTrigger className="mt-1">
                        <SelectValue placeholder="เลือกประเภทการจ้างงาน" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="full-time">งานประจำ</SelectItem>
                        <SelectItem value="part-time">พาร์ทไทม์</SelectItem>
                        <SelectItem value="contract">สัญญาจ้าง</SelectItem>
                        <SelectItem value="internship">ฝึกงาน</SelectItem>
                        <SelectItem value="freelance">ฟรีแลนซ์</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="images" className="font-semibold">อัปโหลดรูปภาพงาน</Label>
                <div className="mt-1">
                  <Input id="images" name="images" type="file" accept="image/*" multiple onChange={handleImagesChange} />
                  <p className="text-xs text-gray-500 mt-1">เลือกได้หลายรูป รองรับไฟล์ภาพจากเครื่องของคุณ</p>
                </div>
                {isUploading && <p className="text-sm text-gray-600 mt-2">กำลังอัปโหลดรูปภาพ...</p>}
                {formData.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {formData.images.map((url, idx) => (
                      <div key={idx} className="relative group">
                        <img src={url} alt={`job-${idx}`} className="w-full h-20 object-cover rounded" onError={(e)=>{(e.currentTarget as HTMLImageElement).src='/placeholder.svg'}} />
                        <button type="button" className="absolute top-1 right-1 bg-white/90 text-red-600 text-xs px-1 rounded opacity-0 group-hover:opacity-100" onClick={()=>removeImageAt(idx)}>ลบ</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">พร้อมที่จะประกาศงานหรือยัง?</h3>
            <p className="text-sm text-gray-600">ตรวจสอบรายละเอียดด้านล่างก่อนลงประกาศงานของคุณ</p>
            <Card className="bg-gray-50">
                <CardContent className="p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">ตำแหน่ง:</span>
                        <span className="font-semibold text-right">{formData.jobTitle || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">หมวดหมู่:</span>
                        <span className="font-semibold text-right">{formData.category || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">สถานที่:</span>
                        <span className="font-semibold text-right">{formData.location || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">เงินเดือน:</span>
                        <span className="font-semibold text-right">{formData.salary ? `${formData.salary} บาท` : '-'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">ประเภทงาน:</span>
                        <span className="font-semibold text-right">{formData.jobType || '-'}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">รูปภาพ (URL, ใส่ทีละบรรทัด)</span>
                        <p className="mt-1 font-mono whitespace-pre-wrap">{formData.images || '-'}</p>
                    </div>
                </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="p-4 bg-white border-t flex gap-2">
        {step > 1 && (
          <Button variant="outline" onClick={handleBack} className="w-1/3">
            ย้อนกลับ
          </Button>
        )}
        <Button onClick={handleNext} className="flex-grow">
          {step === TOTAL_STEPS ? 'ยืนยันและประกาศงาน' : 'ขั้นตอนถัดไป'}
        </Button>
      </footer>
    </div>
  );
};

export default EmployerAddJobForm;