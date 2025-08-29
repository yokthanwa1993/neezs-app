import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "ฉันจะแก้ไขโปรไฟล์บริษัทได้อย่างไร?",
    answer: "คุณสามารถแก้ไขโปรไฟล์ได้โดยไปที่หน้าโปรไฟล์ของคุณและคลิกที่ปุ่ม 'แก้ไขโปรไฟล์' จากนั้นคุณจะสามารถอัปเดตข้อมูลต่างๆ เช่น ชื่อบริษัท, โลโก้, และคำอธิบายได้"
  },
  {
    question: "จะเกิดอะไรขึ้นเมื่อฉันบันทึกผู้สมัคร?",
    answer: "เมื่อคุณบันทึกผู้สมัคร โปรไฟล์ของพวกเขาจะถูกเพิ่มไปยังแท็บ 'บันทึกแล้ว' ในหน้าโปรไฟล์ของคุณ ทำให้คุณสามารถกลับมาดูและพิจารณาผู้สมัครที่น่าสนใจในภายหลังได้อย่างง่ายดาย"
  },
  {
    question: "ฉันจะเติมเงินเข้า Wallet ได้อย่างไร?",
    answer: "ในหน้าโปรไฟล์ของคุณ จะมีส่วนของ Wallet ที่แสดงยอดเงินคงเหลือ คุณสามารถคลิกที่ปุ่ม 'เติมเงิน' เพื่อไปยังหน้าชำระเงินและเพิ่มเงินเข้าสู่ระบบได้"
  }
]

const HelpCenterPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center p-4 bg-white border-b sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-bold text-center flex-1 mr-10">ศูนย์ช่วยเหลือ</h1>
      </header>
      <main className="p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">คำถามที่พบบ่อย</h2>
        <Accordion type="single" collapsible className="w-full bg-white rounded-lg p-2 border">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
    </div>
  );
};

export default HelpCenterPage;