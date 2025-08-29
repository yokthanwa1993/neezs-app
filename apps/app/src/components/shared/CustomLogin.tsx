import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface CustomLoginProps {
  onLoginSuccess: () => void;
}

const CustomLogin: React.FC<CustomLoginProps> = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        loginData.email, 
        loginData.password
      );
      
      const user = userCredential.user;
      
      // Set user data in context
      setUser({
        id: user.uid,
        name: user.displayName || 'ผู้ใช้',
        email: user.email || '',
        picture: user.photoURL || undefined
      });

      onLoginSuccess();
    } catch (error: any) {
      console.error('Login error:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (registerData.password !== registerData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerData.email,
        registerData.password
      );

      const user = userCredential.user;

      // Update user profile with name
      await updateProfile(user, {
        displayName: registerData.name
      });

      // Set user data in context
      setUser({
        id: user.uid,
        name: registerData.name,
        email: user.email || '',
        picture: user.photoURL || undefined
      });

      onLoginSuccess();
    } catch (error: any) {
      console.error('Register error:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'ไม่พบผู้ใช้นี้ในระบบ';
      case 'auth/wrong-password':
        return 'รหัสผ่านไม่ถูกต้อง';
      case 'auth/email-already-in-use':
        return 'อีเมลนี้ถูกใช้งานแล้ว';
      case 'auth/weak-password':
        return 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
      case 'auth/invalid-email':
        return 'รูปแบบอีเมลไม่ถูกต้อง';
      case 'auth/too-many-requests':
        return 'มีการพยายามเข้าสู่ระบบมากเกินไป กรุณาลองใหม่ภายหลัง';
      default:
        return 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            Gig Marketplace
          </CardTitle>
          <CardDescription>
            เข้าสู่ระบบหรือสร้างบัญชีใหม่
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">เข้าสู่ระบบ</TabsTrigger>
              <TabsTrigger value="register">สมัครสมาชิก</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">อีเมล</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="กรอกอีเมลของคุณ"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">รหัสผ่าน</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="กรอกรหัสผ่าน"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    required
                  />
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">ชื่อ-นามสกุล</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="กรอกชื่อ-นามสกุล"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">อีเมล</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="กรอกอีเมลของคุณ"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">รหัสผ่าน</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="กรอกรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">ยืนยันรหัสผ่าน</Label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                    required
                  />
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'กำลังสร้างบัญชี...' : 'สร้างบัญชี'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            การสมัครสมาชิกแสดงว่าคุณยอมรับ
            <br />
            เงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomLogin;