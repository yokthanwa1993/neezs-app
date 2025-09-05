import React from 'react';
import { Mail, Phone, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ProfileAboutTab = () => {
  const { user } = useAuth();
  const profileData = {
    phone: '081-234-5678',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Account Details */}
      <div>
        <h3 className="text-gray-800 text-base font-bold mb-3">ข้อมูลการติดต่อ</h3>
        <div className="bg-gray-50 rounded-xl p-4 space-y-4">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-gray-500 mr-4" />
            <div>
              <p className="text-gray-500 text-xs">อีเมล</p>
              <p className="text-gray-800 font-medium">{user?.email || 'ไม่ระบุ'}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-gray-500 mr-4" />
            <div>
              <p className="text-gray-500 text-xs">เบอร์โทรศัพท์</p>
              <p className="text-gray-800 font-medium">{profileData.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Linked Accounts */}
      <div>
        <h3 className="text-gray-800 text-base font-bold mb-3">บัญชีที่เชื่อมต่อ</h3>
        <div className="bg-gray-50 rounded-xl p-3 space-y-1">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <span className="text-gray-800 font-medium">LINE</span>
            </div>
            <span className="text-green-700 font-semibold text-sm">เชื่อมต่อแล้ว</span>
          </div>
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.19,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.19,22C17.6,22 21.54,18.33 21.54,12.81C21.54,11.76 21.35,11.1 21.35,11.1Z" />
                </svg>
              </div>
              <span className="text-gray-800 font-medium">Google</span>
            </div>
            <button className="text-primary font-semibold text-sm hover:underline">เชื่อมต่อ</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAboutTab;