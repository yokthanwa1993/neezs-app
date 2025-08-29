import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  const features = [
    { name: "ค้นหางาน", path: "/seeker/jobs", description: "ค้นหางานที่ตรงกับทักษะของคุณ" },
    { name: "งานของฉัน", path: "/seeker/my-shifts", description: "ดูงานที่คุณได้สมัครไว้", requireAuth: true },
    { name: "กระเป๋าเงิน", path: "/seeker/wallet", description: "จัดการรายได้และการเงิน", requireAuth: true },
    { name: "โปรไฟล์", path: "/seeker/profile", description: "จัดการข้อมูลส่วนตัวของคุณ", requireAuth: true },
    { name: "การลงทะเบียน", path: "/seeker/onboarding", description: "ขั้นตอนการเริ่มต้นใช้งาน", requireAuth: true },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Gig Marketplace</h1>
          <p className="text-gray-600 mb-4">แพลตฟอร์มหางานฟรีแลนซ์สำหรับผู้มีทักษะหลากหลาย</p>
          
          {user && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-green-700">
                สวัสดี {user.name}! 👋
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="font-bold text-xl mb-4 text-center">คุณสมบัติหลัก</h2>
          <div className="space-y-4">
            {features.map((feature, index) => {
              const isLocked = feature.requireAuth && !user;
              
              return (
                <div key={index} className="relative">
                  {isLocked ? (
                    <div className="block bg-gray-50 rounded-lg p-4 opacity-75">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-gray-500">{feature.name}</h3>
                          <p className="text-gray-400 text-sm">{feature.description}</p>
                        </div>
                        <div className="text-gray-400">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">ต้องเข้าสู่ระบบเพื่อใช้งาน</p>
                    </div>
                  ) : (
                    <Link 
                      to={feature.path}
                      className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <h3 className="font-bold text-lg text-primary">{feature.name}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="font-bold text-xl mb-4 text-center">เกี่ยวกับ Gig Marketplace</h2>
          <p className="text-gray-700 mb-4">
            Gig Marketplace เป็นแพลตฟอร์มที่เชื่อมโยงผู้ที่ต้องการทำงานแบบฟรีแลนซ์กับผู้ที่ต้องการจ้างงาน 
            ช่วยให้คุณสามารถค้นหางานที่เหมาะสมกับทักษะของคุณได้ง่ายๆ
          </p>
          <p className="text-gray-700">
            ไม่ว่าจะเป็นงานบริการ งานด้านอาหาร เว้นความสะอาด หรืองานด้านขนส่ง 
            คุณสามารถค้นหาและสมัครงานได้ตามความต้องการของคุณ
          </p>
        </div>
        
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;