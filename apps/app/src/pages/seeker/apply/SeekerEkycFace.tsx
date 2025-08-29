import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const SeekerEkycFace: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(13);
  const [status, setStatus] = useState('กำลังเตรียมการ...');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    setStatus('กำลังวิเคราะห์ใบหน้า...');
    const timer = setTimeout(() => setProgress(66), 500);
    const timer2 = setTimeout(() => {
      setProgress(100);
      setStatus('การยืนยันสำเร็จ!');
      setIsVerified(true);
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  const handleFinish = () => {
    console.log('eKYC data:', location.state);
    navigate('/seeker/home', { replace: true });
  };

  return (
    <div className="bg-gray-50 flex flex-col">
      <main className="w-full max-w-lg mx-auto p-4 flex-1 flex flex-col items-center justify-center text-center">
        <div className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight">ยืนยันตัวตน (e-KYC)</h1>
          <p className="text-muted-foreground mt-1">ขั้นตอนที่ 2: ยืนยันใบหน้า</p>
        </div>

        <div className="relative w-64 h-64 rounded-full overflow-hidden border-8 border-white shadow-2xl mb-6">
          <img src="https://via.placeholder.com/300" alt="Face Scan" className="w-full h-full object-cover" />
          <div className={`absolute inset-0 rounded-full border-4 ${isVerified ? 'border-green-400' : 'border-yellow-400'} animate-pulse`}></div>
        </div>

        {isVerified ? (
          <div className="flex flex-col items-center text-green-600">
            <CheckCircle className="w-16 h-16 mb-3" />
            <p className="text-2xl font-bold">{status}</p>
          </div>
        ) : (
          <div className="w-full px-8">
            <Progress value={progress} className="w-full mb-3 h-3" />
            <p className="text-lg font-semibold text-gray-700">{status}</p>
            <p className="text-sm text-gray-500 mt-1">กรุณามองตรงและตรวจสอบให้แน่ใจว่ามีแสงสว่างเพียงพอ</p>
          </div>
        )}
      </main>

      {/* Floating CTA above bottom navbar */}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-20 w-full max-w-md px-4 z-40">
        <Button
          onClick={handleFinish}
          disabled={!isVerified}
          className="w-full h-12 text-lg font-bold rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-500 hover:to-yellow-600 disabled:bg-gray-200 disabled:text-gray-500"
        >
          เสร็จสิ้นและสมัครงาน
        </Button>
      </div>
    </div>
  );
};

export default SeekerEkycFace;


