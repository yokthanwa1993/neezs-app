import React, { useState } from 'react';
import { Camera, User, MapPin, Briefcase } from 'lucide-react';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Progress Indicator */}
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={prevStep}
            className={`text-sm ${step === 1 ? 'text-gray-400' : 'text-primary'}`}
            disabled={step === 1}
          >
            ย้อนกลับ
          </button>
          <span className="text-sm text-gray-500">{step} จาก {totalSteps}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        {step === 1 && <PersonalInfoStep />}
        {step === 2 && <LocationStep />}
        {step === 3 && <SkillsStep />}
        {step === 4 && <DocumentsStep />}
      </div>

      {/* Navigation */}
      <div className="p-4 bg-white border-t">
        <button 
          onClick={nextStep}
          className="bg-primary w-full rounded-full py-3 font-bold text-primary-foreground"
        >
          {step === totalSteps ? 'เริ่มใช้งาน' : 'ถัดไป'}
        </button>
      </div>
    </div>
  );
};

const PersonalInfoStep = () => {
  return (
    <div>
      <h1 className="font-bold text-xl mb-2">ข้อมูลส่วนตัว</h1>
      <p className="text-gray-600 mb-6">กรุณากรอกข้อมูลส่วนตัวของคุณ</p>
      
      {/* Avatar Upload */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
          <Camera className="text-gray-500" size={32} />
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
          อัปโหลดรูปโปรไฟล์
        </button>
      </div>
      
      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">ชื่อ-นามสกุล</label>
          <input 
            type="text" 
            className="w-full bg-gray-100 rounded-md p-3 text-sm"
            placeholder="กรอกชื่อ-นามสกุล"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">เบอร์โทรศัพท์</label>
          <input 
            type="tel" 
            className="w-full bg-gray-100 rounded-md p-3 text-sm"
            placeholder="กรอกเบอร์โทรศัพท์"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">อีเมล</label>
          <input 
            type="email" 
            className="w-full bg-gray-100 rounded-md p-3 text-sm"
            placeholder="กรอกอีเมล"
          />
        </div>
      </div>
    </div>
  );
};

const LocationStep = () => {
  return (
    <div>
      <h1 className="font-bold text-xl mb-2">ที่อยู่ของคุณ</h1>
      <p className="text-gray-600 mb-6">กรุณากรอกที่อยู่ของคุณเพื่อความสะดวกในการค้นหางาน</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">ที่อยู่</label>
          <input 
            type="text" 
            className="w-full bg-gray-100 rounded-md p-3 text-sm"
            placeholder="กรอกที่อยู่"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">เขต/อำเภอ</label>
          <input 
            type="text" 
            className="w-full bg-gray-100 rounded-md p-3 text-sm"
            placeholder="กรอกเขต/อำเภอ"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">จังหวัด</label>
          <input 
            type="text" 
            className="w-full bg-gray-100 rounded-md p-3 text-sm"
            placeholder="กรอกจังหวัด"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">รหัสไปรษณีย์</label>
          <input 
            type="text" 
            className="w-full bg-gray-100 rounded-md p-3 text-sm"
            placeholder="กรอกรหัสไปรษณีย์"
          />
        </div>
      </div>
    </div>
  );
};

const SkillsStep = () => {
  const skills = [
    'พนักงานเสิร์ฟ',
    'พนักงานเก็บเงิน',
    'ทำความสะอาด',
    'จัดส่งอาหาร',
    'พนักงานขาย',
    'พนักงานรักษาความปลอดภัย',
    'พนักงานขับรถ',
    'พนักงานคลังสินค้า'
  ];
  
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  return (
    <div>
      <h1 className="font-bold text-xl mb-2">ทักษะและความสามารถ</h1>
      <p className="text-gray-600 mb-6">เลือกทักษะที่คุณมีเพื่อช่วยให้เราค้นหางานที่เหมาะสมให้คุณ</p>
      
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <button
            key={index}
            onClick={() => toggleSkill(skill)}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedSkills.includes(skill)
                ? 'bg-primary text-primary-foreground'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {skill}
          </button>
        ))}
      </div>
    </div>
  );
};

const DocumentsStep = () => {
  return (
    <div>
      <h1 className="font-bold text-xl mb-2">เอกสารประกอบ</h1>
      <p className="text-gray-600 mb-6">กรุณาอัปโหลดเอกสารที่จำเป็นสำหรับการสมัครงาน</p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm mb-3">บัตรประชาชน</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Camera className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-gray-500 text-sm mb-3">อัปโหลดรูปภาพบัตรประชาชน</p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
              เลือกไฟล์
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm mb-3">ใบสมัครงาน</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Briefcase className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-gray-500 text-sm mb-3">อัปโหลดใบสมัครงาน (ถ้ามี)</p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
              เลือกไฟล์
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;