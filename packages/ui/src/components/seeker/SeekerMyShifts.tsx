import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from '../shared/BottomNavigation';

interface Shift {
  id: number;
  title: string;
  company: string;
  date: string;
  time: string;
  location: string;
  status: 'confirmed' | 'pending' | 'completed';
}

const MyShifts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect to home if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Show loading while checking auth
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  // Mock shift data
  const shifts: Shift[] = [
    {
      id: 1,
      title: 'พนักงานเสิร์ฟ',
      company: 'ร้านอาหารสยาม',
      date: '15 พ.ย. 2023',
      time: '10:00-14:00',
      location: 'สยามสแควร์',
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'พนักงานเก็บเงิน',
      company: 'ร้านสะดวกซื้อ 7-11',
      date: '18 พ.ย. 2023',
      time: '16:00-22:00',
      location: 'ลาดพร้าว',
      status: 'pending'
    },
    {
      id: 3,
      title: 'พนักงานทำความสะอาด',
      company: 'โรงแรมบางกอก',
      date: '20 พ.ย. 2023',
      time: '08:00-16:00',
      location: 'ราชเทวี',
      status: 'completed'
    }
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'ยืนยันแล้ว';
      case 'pending': return 'รอการยืนยัน';
      case 'completed': return 'เสร็จสิ้น';
      default: return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600';
      case 'pending': return 'text-primary';
      case 'completed': return 'text-gray-600';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      
      {/* Shifts List */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">งานที่กำลังจะมาถึง</h2>
          <span className="text-gray-500 text-sm">{shifts.length} งาน</span>
        </div>
        
        <div className="space-y-4">
          {shifts.map((shift) => (
            <div key={shift.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">{shift.title}</h3>
                  <p className="text-gray-600">{shift.company}</p>
                </div>
                <span className={`font-bold ${getStatusColor(shift.status)}`}>
                  {getStatusText(shift.status)}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <Calendar className="mr-2" size={16} />
                  <span>{shift.date}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="mr-2" size={16} />
                  <span>{shift.time}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="mr-2" size={16} />
                  <span>{shift.location}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <button className="flex-1 bg-gray-100 rounded-full py-2 text-sm">
                  ดูรายละเอียด
                </button>
                <button className="flex-1 bg-primary rounded-full py-2 text-sm font-bold text-primary-foreground">
                  ติดต่อผู้จ้างงาน
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default MyShifts;