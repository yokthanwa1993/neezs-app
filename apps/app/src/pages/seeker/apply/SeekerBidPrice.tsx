import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

const SeekerBidPrice: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [price, setPrice] = useState<string>('');

  const isValid = price.trim() !== '' && !Number.isNaN(Number(price)) && Number(price) > 0;

  const handleSubmit = () => {
    const bid = Number(price);
    // TODO: POST bid to API when available
    console.log('Submitting bid:', { bid, applyContext: location.state });
    alert('ส่งข้อเสนอราคาเรียบร้อย');
    navigate('/seeker/home', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 w-full max-w-lg mx-auto p-4 pt-12 pb-24">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">เสนอราคาค่าจ้าง</h1>
          <p className="text-base text-gray-600 mt-1">ระบุจำนวนเงินที่คุณต้องการสำหรับงานนี้</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border p-5">
          <label htmlFor="bid" className="block text-sm font-medium text-gray-700">ราคาเสนอ (บาท)</label>
          <div className="mt-2 flex items-center gap-2">
            <Input
              id="bid"
              type="number"
              inputMode="decimal"
              placeholder="เช่น 300"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-12 text-lg"
            />
            <span className="text-gray-600">บาท</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">เคล็ดลับ: ตั้งราคาให้เหมาะกับประสบการณ์และระยะเวลา</p>
        </div>
      </main>

      <footer className="sticky bottom-0 w-full bg-white/80 backdrop-blur-sm border-t p-4">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-12 w-12 rounded-full bg-gray-200 text-black hover:bg-gray-300"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="flex-1 h-12 text-lg font-bold rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-500 hover:to-yellow-600 disabled:bg-gray-200 disabled:text-gray-500"
          >
            ยืนยันราคาและสมัครงาน
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default SeekerBidPrice;
