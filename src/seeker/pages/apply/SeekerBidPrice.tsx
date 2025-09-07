import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { seekerAuth } from '../../lib/seekerFirebase';
import { apiClient } from '@neeiz/api-client';

type JobDetail = {
  id: string;
  title: string;
  salary?: number;
};

const SeekerBidPrice: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [price, setPrice] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [job, setJob] = useState<JobDetail | null>(null);
  const state = (location.state || {}) as any;
  const jobId = state?.jobId as string | undefined;
  const startingPrice = typeof job?.salary === 'number' ? job!.salary : undefined;

  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (!jobId) return;
        const res = await apiClient.get(`/api/jobs/${jobId}`);
        const j = res.data as JobDetail;
        setJob(j);
        // Prefill price once if empty and job has salary
        if (!price && typeof j?.salary === 'number') {
          setPrice(String(j.salary));
        }
      } catch (e) {
        // silent; user can still input price manually
      }
    };
    fetchJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const isValid = price.trim() !== '' && !Number.isNaN(Number(price)) && Number(price) > 0;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    try {
      const bid = Number(price);
      const state = (location.state || {}) as any;
      const jobId = state?.jobId as string | undefined;
      const phone = state?.phone as string | undefined;
      let idCardImageUrl: string | undefined = undefined;
      const idCardImage = state?.idCardImage as string | undefined;
      const selectedCategories = (state?.selectedCategories as string[] | undefined) || [];

      if (!jobId) throw new Error('Missing jobId in context');
      if (!phone) throw new Error('Missing phone in context');

      // If ID card image is a data URL, upload it using multipart/form-data to avoid JSON size limits
      if (idCardImage && idCardImage.startsWith('data:')) {
        const blob = await (await fetch(idCardImage)).blob();
        const form = new FormData();
        form.append('file', blob, 'idcard.jpg');
        const resp = await fetch('/api/jobs/upload', {
          method: 'POST',
          body: form,
        });
        if (!resp.ok) {
          const e = await resp.json().catch(() => ({}));
          throw new Error(e.message || 'Failed to upload ID card image');
        }
        const data = await resp.json();
        idCardImageUrl = data.url as string;
      }

      const idToken = await seekerAuth.currentUser?.getIdToken(true);
      const appResp = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ jobId, bid, phoneNumber: phone, idCardImageUrl, selectedCategories }),
      });
      if (!appResp.ok) {
        const e = await appResp.json().catch(() => ({}));
        throw new Error(e.message || 'Failed to submit application');
      }
      // Success: go back to home
      navigate('/seeker/home', { replace: true });
    } catch (e: any) {
      alert(e?.message || 'เกิดข้อผิดพลาดในการสมัครงาน');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 w-full max-w-mobile-lg mx-auto p-4 pt-12 pb-24">
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
              min={startingPrice !== undefined ? startingPrice : undefined}
            />
            <span className="text-gray-600">บาท</span>
          </div>
          <div className="mt-2 text-xs text-gray-600 flex items-center justify-between">
            <span>เคล็ดลับ: ตั้งราคาให้เหมาะกับประสบการณ์และระยะเวลา</span>
            {startingPrice !== undefined && (
              <span className="font-semibold text-gray-800">ราคาเริ่มต้น: ฿{startingPrice.toLocaleString('th-TH')}</span>
            )}
          </div>
        </div>
      </main>

      {/* Floating actions above bottom navbar */}
      <div
        className="fixed left-1/2 -translate-x-1/2 w-full max-w-mobile-lg px-4 z-40"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 100px)' }}
      >
        <div className="flex items-center gap-4">
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
            disabled={!isValid || submitting}
            className="flex-1 h-12 text-lg font-bold rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-500 hover:to-yellow-600 disabled:bg-gray-200 disabled:text-gray-500"
          >
            {submitting ? 'กำลังส่ง...' : 'ยืนยันราคาและสมัครงาน'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeekerBidPrice;
