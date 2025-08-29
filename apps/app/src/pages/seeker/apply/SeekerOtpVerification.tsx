import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

const SeekerOtpVerification: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { jobId } = location.state || {};
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'phone' | 'otp'>('phone');

    const handleSendOtp = () => {
        console.log(`Sending OTP to ${phone} for job ${jobId}`);
        setStep('otp');
    };

    const handleVerifyOtp = () => {
        console.log(`Verifying OTP ${otp}`);
        navigate('/seeker/apply/ekyc-id', { state: { jobId, phone } });
    };

    return (
        <div className="bg-gray-50 flex flex-col">
            <main className="w-full max-w-lg mx-auto p-4 flex-1 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center p-5">
                        <CardTitle className="text-3xl font-extrabold tracking-tight">ยินดีต้อนรับสู่ NEEZS!</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            เนื่องจากเป็นการสมัครงานครั้งแรก<br/>กรุณายืนยันเบอร์โทรศัพท์เพื่อสร้างโปรไฟล์ที่ปลอดภัยและน่าเชื่อถือ
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                        {step === 'phone' ? (
                            <div>
                                <div className="relative max-w-sm mx-auto">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pr-3 pointer-events-none">
                                        <span className="text-gray-500 text-xl">+66</span>
                                    </div>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="081 234 5678"
                                        value={phone}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value.length <= 10) {
                                                setPhone(value);
                                            }
                                        }}
                                        className="h-16 text-2xl pl-16 text-center tracking-widest"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="otp" className="block text-base font-medium text-gray-700 mb-2 text-center">
                                    รหัส OTP (6 หลัก)
                                </label>
                                <div className="flex justify-center">
                                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                        <InputOTPGroup className="gap-2">
                                            <InputOTPSlot index={0} className="h-12 w-12 rounded-full text-xl" />
                                            <InputOTPSlot index={1} className="h-12 w-12 rounded-full text-xl" />
                                            <InputOTPSlot index={2} className="h-12 w-12 rounded-full text-xl" />
                                            <InputOTPSlot index={3} className="h-12 w-12 rounded-full text-xl" />
                                            <InputOTPSlot index={4} className="h-12 w-12 rounded-full text-xl" />
                                            <InputOTPSlot index={5} className="h-12 w-12 rounded-full text-xl" />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
            {/* Floating actions above bottom navbar */}
            <div className="fixed left-1/2 -translate-x-1/2 bottom-20 w-full max-w-md px-4 z-40">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => step === 'otp' ? setStep('phone') : navigate(-1)}
                        className="h-12 w-12 rounded-full bg-gray-200 text-black hover:bg-gray-300"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <Button
                        onClick={step === 'phone' ? handleSendOtp : handleVerifyOtp}
                        className="flex-1 h-12 text-lg font-bold rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-500 hover:to-yellow-600"
                        disabled={(step === 'phone' && phone.length < 10) || (step === 'otp' && otp.length < 6)}
                    >
                        {step === 'phone' ? 'ถัดไป' : 'ยืนยัน'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SeekerOtpVerification;

