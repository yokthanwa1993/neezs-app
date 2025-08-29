import React from 'react';
import { Mail, Phone, Globe } from 'lucide-react';

const EmployerProfileAboutTab = () => {
  const companyData = {
    email: 'contact@techsolutions.co',
    phone: '02-123-4567',
    website: 'https://techsolutions.co',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-gray-800 text-base font-bold mb-3">ข้อมูลการติดต่อ</h3>
        <div className="bg-gray-50 rounded-xl p-4 space-y-4">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-gray-500 mr-4" />
            <div>
              <p className="text-gray-500 text-xs">อีเมล</p>
              <p className="text-gray-800 font-medium">{companyData.email}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-gray-500 mr-4" />
            <div>
              <p className="text-gray-500 text-xs">เบอร์โทรศัพท์</p>
              <p className="text-gray-800 font-medium">{companyData.phone}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Globe className="h-5 w-5 text-gray-500 mr-4" />
            <div>
              <p className="text-gray-500 text-xs">เว็บไซต์</p>
              <p className="text-gray-800 font-medium">{companyData.website}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfileAboutTab;