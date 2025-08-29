import React from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import BottomNavbar from '@/components/BottomNavbar';

const faqItems = [
  {
    question: "ฉันจะลงประกาศงานได้อย่างไร?",
    answer: "คุณสามารถลงประกาศงานได้โดยไปที่หน้าหลักของผู้จ้างงานและคลิกที่ปุ่ม 'ลงประกาศงาน' จากนั้นกรอกรายละเอียดตามขั้นตอน"
  },
  {
    question: "มีค่าใช้จ่ายในการลงประกาศงานหรือไม่?",
    answer: "เรามีแพ็กเกจฟรีให้คุณสามารถลงประกาศงานได้ 1 ตำแหน่งต่อเดือน หากต้องการลงประกาศมากกว่านั้น คุณสามารถอัปเกรดเป็นแพ็กเกจ Pro ได้"
  },
  {
    question: "ฉันจะดูผู้สมัครได้อย่างไร?",
    answer: "เมื่อมีผู้สมัครงานในตำแหน่งที่คุณประกาศ คุณจะได้รับการแจ้งเตือนและสามารถดูโปรไฟล์ของผู้สมัครได้ในหน้า 'งานของฉัน'"
  },
  {
    question: "ฉันจะแก้ไขข้อมูลบริษัทได้อย่างไร?",
    answer: "ไปที่หน้าโปรไฟล์ของคุณ และเลือกเมนู 'แก้ไขข้อมูลบริษัท' เพื่ออัปเดตรายละเอียดต่างๆ"
  }
]

const SupportPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <main className="p-4 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">คำถามที่พบบ่อย</h2>
          <p className="text-gray-500">ค้นหาคำตอบที่คุณต้องการได้ที่นี่</p>
        </div>
        <Accordion type="single" collapsible className="w-full bg-white p-4 rounded-lg shadow-sm">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center pt-4">
            <h3 className="font-semibold">ไม่พบคำตอบที่คุณต้องการ?</h3>
            <p className="text-gray-500 text-sm mb-4">ติดต่อทีมงานของเราเพื่อรับความช่วยเหลือ</p>
            <Button>
                <Mail className="w-4 h-4 mr-2" />
                ติดต่อฝ่ายสนับสนุน
            </Button>
        </div>
      </main>
      <BottomNavbar />
    </div>
  );
};

export default SupportPage;