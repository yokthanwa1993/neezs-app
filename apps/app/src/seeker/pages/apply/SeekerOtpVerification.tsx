import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { ArrowLeft, ShieldCheck, RefreshCw } from 'lucide-react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/shared/components/ui/input-otp";
import { RecaptchaVerifier, linkWithPhoneNumber, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { seekerAuth } from '../../lib/seekerFirebase';

const SeekerOtpVerification: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { jobId } = location.state || {};
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [error, setError] = useState<string>('');
    const [resendIn, setResendIn] = useState<number>(0);
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const confirmationRef = useRef<ConfirmationResult | null>(null);
    const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

    const isValidPhone = useMemo(() => phone.replace(/\D/g, '').length === 10, [phone]);
    const isValidOtp = useMemo(() => otp.length === 6, [otp]);

    const formatThaiPhone = (digits: string) => {
        // group as 3-3-4: 081 234 5678
        const d = digits.replace(/\D/g, '').slice(0, 10);
        const p1 = d.slice(0, 3);
        const p2 = d.slice(3, 6);
        const p3 = d.slice(6, 10);
        return [p1, p2, p3].filter(Boolean).join(' ');
    };

    const ensureRecaptcha = () => {
        if (recaptchaRef.current) return recaptchaRef.current;
        recaptchaRef.current = new RecaptchaVerifier(seekerAuth, 'recaptcha-container', { size: 'invisible' });
        return recaptchaRef.current;
    };

    const toE164TH = (local: string) => {
        const d = local.replace(/\D/g, '').slice(0, 10);
        if (d.length === 10 && d.startsWith('0')) return `+66${d.slice(1)}`;
        if (/^\+?66\d{8,9}$/.test(local)) return local.startsWith('+') ? local : `+${local}`;
        return `+66${d}`;
    };

    const handleSendOtp = async () => {
        const digits = phone.replace(/\D/g, '');
        if (digits.length !== 10) {
            setError('กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก');
            return;
        }
        setError('');
        setSending(true);
        try {
            const appVerifier = ensureRecaptcha();
            const phoneNumber = toE164TH(digits);
            if (seekerAuth.currentUser) {
                confirmationRef.current = await linkWithPhoneNumber(seekerAuth.currentUser, phoneNumber, appVerifier);
            } else {
                confirmationRef.current = await signInWithPhoneNumber(seekerAuth, phoneNumber, appVerifier);
            }
            setStep('otp');
            setResendIn(30);
        } catch (e: any) {
            console.error('Failed to send OTP', e);
            setError(e?.message || 'ส่งรหัสไม่สำเร็จ โปรดลองอีกครั้ง');
            try { recaptchaRef.current?.clear(); recaptchaRef.current = null; } catch {}
        } finally {
            setSending(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!isValidOtp || !confirmationRef.current) return;
        setVerifying(true);
        try {
            const credential = await confirmationRef.current.confirm(otp);
            console.log('✅ Phone verified for uid:', credential.user?.uid);
            navigate('/seeker/apply/ekyc-id', { state: { jobId, phone } });
        } catch (e: any) {
            console.error('Invalid OTP', e);
            setError('รหัสไม่ถูกต้อง โปรดลองอีกครั้ง');
        } finally {
            setVerifying(false);
        }
    };

    // Countdown for resend
    useEffect(() => {
        if (step !== 'otp' || resendIn <= 0) return;
        const t = setInterval(() => setResendIn((s) => (s > 0 ? s - 1 : 0)), 1000);
        return () => clearInterval(t);
    }, [step, resendIn]);

    return (
        <div className="bg-gray-50 flex flex-col min-h-screen">
            <main className="w-full max-w-mobile-lg mx-auto p-4 flex-1 flex items-center justify-center">
                <Card className="w-full max-w-mobile-lg border-2 border-slate-200 shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="text-center p-6 bg-black text-white">
                        <div className="mb-2 text-sm font-medium text-white/70">ขั้นตอน {step === 'phone' ? '1' : '2'} จาก 2</div>
                        <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">ยินดีต้อนรับสู่ NEEZS</CardTitle>
                        <CardDescription className="text-sm text-white/80 mt-2">
                            {step === 'phone' ? (
                                <span>เพื่อความปลอดภัย โปรดยืนยันเบอร์โทรศัพท์ก่อนเริ่มสมัครงาน</span>
                            ) : (
                                <span>เราได้ส่งรหัส OTP ไปที่เบอร์ {formatThaiPhone(phone)} กรุณากรอกเพื่อยืนยัน</span>
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5 p-6">
                        {step === 'phone' ? (
                            <div className="max-w-sm mx-auto w-full">
                                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">เบอร์โทรศัพท์</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pr-3 pointer-events-none text-slate-500">
                                        <span className="text-base">+66</span>
                                    </div>
                                    <Input
                                        id="phone"
                                        inputMode="numeric"
                                        type="tel"
                                        placeholder="081 234 5678"
                                        aria-label="เบอร์โทรศัพท์"
                                        value={formatThaiPhone(phone)}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value.length <= 10) {
                                                setPhone(value);
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!isValidPhone && phone.length > 0) {
                                                setError('กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก');
                                            } else {
                                                setError('');
                                            }
                                        }}
                                        className={`h-16 text-2xl pl-16 text-center tracking-widest ${error ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                                        disabled={sending}
                                    />
                                </div>
                                <div className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-500">
                                    <ShieldCheck className="h-4 w-4" />
                                    <span>เราใช้ข้อมูลนี้เพื่อยืนยันตัวตนเท่านั้น</span>
                                </div>
                                {error && (
                                    <p className="mt-2 text-center text-sm text-red-500">{error}</p>
                                )}
                            </div>
                        ) : (
                            <div className="max-w-sm mx-auto w-full">
                                <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-3 text-center">
                                    กรอกรหัส OTP (6 หลัก)
                                </label>
                                <div className="flex justify-center">
                                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                        <InputOTPGroup className="gap-2">
                                            <InputOTPSlot index={0} className="h-12 w-12 rounded-xl text-xl" />
                                            <InputOTPSlot index={1} className="h-12 w-12 rounded-xl text-xl" />
                                            <InputOTPSlot index={2} className="h-12 w-12 rounded-xl text-xl" />
                                            <InputOTPSlot index={3} className="h-12 w-12 rounded-xl text-xl" />
                                            <InputOTPSlot index={4} className="h-12 w-12 rounded-xl text-xl" />
                                            <InputOTPSlot index={5} className="h-12 w-12 rounded-xl text-xl" />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                <div className="mt-4 flex items-center justify-center gap-3 text-sm">
                                    <button
                                        type="button"
                                        className="text-slate-600 underline-offset-4 hover:underline"
                                        onClick={() => setStep('phone')}
                                    >
                                        เปลี่ยนเบอร์
                                    </button>
                                    <span className="text-slate-300">•</span>
                                    {resendIn > 0 ? (
                                        <span className="text-slate-500">ส่งรหัสอีกครั้งใน {String(Math.floor(resendIn / 60)).padStart(2, '0')}:{String(resendIn % 60).padStart(2, '0')}</span>
                                    ) : (
                                        <button
                                            type="button"
                                            className="text-slate-900 font-medium hover:underline inline-flex items-center gap-1"
                                            onClick={() => setResendIn(30)}
                                        >
                                            <RefreshCw className="h-4 w-4" /> ส่งรหัสอีกครั้ง
                                        </button>
                                    )}
                                </div>
                                <p className="mt-2 text-center text-xs text-slate-400">หากไม่ได้รับรหัสภายใน 2 นาที โปรดลองส่งอีกครั้ง</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
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
                        aria-label="ย้อนกลับ"
                        onClick={() => step === 'otp' ? setStep('phone') : navigate(-1)}
                        className="h-12 w-12 rounded-full bg-gray-200 text-black hover:bg-gray-300"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <Button
                        onClick={step === 'phone' ? handleSendOtp : handleVerifyOtp}
                        className="flex-1 h-12 text-lg font-bold rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-500 hover:to-yellow-600 disabled:opacity-50"
                        disabled={(step === 'phone' && !isValidPhone) || (step === 'otp' && !isValidOtp)}
                    >
                        {step === 'phone' ? (sending ? 'กำลังส่ง...' : 'ถัดไป') : (verifying ? 'กำลังยืนยัน...' : 'ยืนยัน')}
                    </Button>
                </div>
            </div>
            {/* Invisible reCAPTCHA container for Firebase Phone Auth */}
            <div id="recaptcha-container" style={{ position: 'absolute', left: -9999, top: -9999 }} />
        </div>
    );
};

export default SeekerOtpVerification;
