import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera, RefreshCw, Upload, CreditCard } from 'lucide-react';

const SeekerEkycId: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hasPermission, setHasPermission] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [idCardImage, setIdCardImage] = useState<string | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setHasPermission(true);
    } catch (err) {
      setErrorMsg('ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตการใช้กล้อง หรือใช้อัปโหลดแทน');
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const captureIdCard = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Target aspect ratio for ID card
    const aspect = 1.6; // ~16:10
    const vw = video.videoWidth || 1280;
    const vh = video.videoHeight || 720;
    const videoAspect = vw / vh;

    let cw = 0;
    let ch = 0;
    if (videoAspect > aspect) {
      ch = vh;
      cw = Math.round(ch * aspect);
    } else {
      cw = vw;
      ch = Math.round(cw / aspect);
    }
    const sx = Math.floor((vw - cw) / 2);
    const sy = Math.floor((vh - ch) / 2);

    const outWidth = 960;
    const outHeight = Math.round(outWidth / aspect);

    canvas.width = outWidth;
    canvas.height = outHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, sx, sy, cw, ch, 0, 0, outWidth, outHeight);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setIdCardImage(dataUrl);
    stopCamera();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdCardImage(reader.result as string);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const retake = () => {
    setIdCardImage(null);
    if (!streamRef.current) startCamera();
  };

  const handleNext = () => {
    navigate('/seeker/apply/ekyc-face', { state: { ...location.state, idCardImage } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 w-full max-w-lg mx-auto p-4 pt-12 pb-24 flex flex-col">
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 shadow">
            <CreditCard className="h-6 w-6 text-black" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-2">ยืนยันตัวตน (ขั้นตอนที่ 1/2)</h1>
          <p className="text-sm text-gray-600 mt-1">กรุณาถ่ายภาพบัตรประชาชนให้ชัดเจน</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
          {!idCardImage ? (
            <div className="w-full">
              <div className="relative rounded-xl overflow-hidden bg-black">
                <video ref={videoRef} className="w-full aspect-square object-cover" playsInline muted />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="w-[85%] h-[56%] rounded-xl border-2 border-yellow-400/90" />
                </div>
              </div>
              {errorMsg && <div className="mt-3 text-sm text-red-600">{errorMsg}</div>}

              <div className="mt-4 grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  onClick={captureIdCard}
                  disabled={isLoading || !hasPermission}
                  className="col-span-2 h-11 rounded-full font-semibold bg-black text-white hover:bg-black/90"
                >
                  <Camera className="h-4 w-4 mr-2" /> ถ่ายบัตร
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-11 rounded-full font-semibold"
                >
                  <Upload className="h-4 w-4 mr-2" /> อัปโหลด
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <ul className="text-left text-gray-500 text-xs mt-4 list-disc list-inside space-y-1">
                <li>วางบัตรบนพื้นหลังสีเรียบ ให้ข้อมูลอ่านได้ชัดเจน</li>
                <li>หลีกเลี่ยงแสงสะท้อนบนบัตร</li>
                <li>ตรวจสอบให้แน่ใจว่าบัตรยังไม่หมดอายุ</li>
              </ul>
            </div>
          ) : (
            <div className="w-full">
              <img src={idCardImage} alt="ID Card Preview" className="w-full rounded-xl border" />
              <div className="mt-3 flex justify-center">
                <Button type="button" variant="outline" onClick={retake} className="h-11 rounded-full font-semibold">
                  <RefreshCw className="h-4 w-4 mr-2" /> ถ่ายใหม่
                </Button>
                {/* Removed inline Next button as requested */}
              </div>
            </div>
          )}
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
            onClick={handleNext}
            className="w-full h-12 text-lg font-bold flex-1 bg-yellow-400 text-black hover:bg-yellow-500 rounded-lg shadow-md hover:shadow-lg"
            disabled={!idCardImage}
          >
            ถัดไป
          </Button>
        </div>
      </footer>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default SeekerEkycId;


