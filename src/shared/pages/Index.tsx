import React from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const features = [
    { name: "ค้นหางาน", path: "/seeker/jobs", description: "ค้นหางานที่ตรงกับทักษะของคุณ" },
    { name: "งานของฉัน", path: "/seeker/my-shifts", description: "ดูงานที่คุณได้สมัครไว้" },
    { name: "กระเป๋าเงิน", path: "/seeker/wallet", description: "จัดการรายได้และการเงิน" },
    { name: "โปรไฟล์", path: "/seeker/profile", description: "จัดการข้อมูลส่วนตัวของคุณ" },
    { name: "การลงทะเบียน", path: "/seeker/onboarding", description: "ขั้นตอนการเริ่มต้นใช้งาน" },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-2">NEEZS</h1>
        <p className="text-blue-100 mb-4">แพลตฟอร์มหางานฟรีแลนซ์สำหรับผู้มีทักษะหลากหลาย</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="font-bold text-xl mb-4 text-center">คุณสมบัติหลัก</h2>
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="block bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-primary">{feature.name}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
