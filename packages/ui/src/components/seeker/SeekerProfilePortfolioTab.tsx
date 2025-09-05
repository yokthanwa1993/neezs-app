import React, { useState } from 'react';
import { Image, Play, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

const SeekerProfilePortfolioTab = () => {
  const [portfolioItems] = useState([
    {
      id: 1,
      title: 'งานล้างจานด่วน',
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
      description: 'งานล้างจานที่ร้านอาหารไทยบ้านเรา',
      date: '15 ธ.ค. 2024',
      rating: 5.0,
      earnings: 500
    },
    {
      id: 2,
      title: 'งานเสิร์ฟอาหาร',
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1516876437184-593fda40c7c4?w=400&h=400&fit=crop',
      description: 'งานเสิร์ฟที่ร้านกาแฟสไตล์ญี่ปุ่น',
      date: '10 ธ.ค. 2024',
      rating: 4.8,
      earnings: 800
    },
    {
      id: 3,
      title: 'งานจัดระเบียบสินค้า',
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=400&h=400&fit=crop',
      description: 'งานจัดระเบียบที่ร้านสะดวกซื้อ 7-Eleven',
      date: '5 ธ.ค. 2024',
      rating: 4.5,
      earnings: 600
    },
    {
      id: 4,
      title: 'งานช่วยจัดงานอีเวนต์',
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1496449903678-68ddcb189a24?w=400&h=400&fit=crop',
      description: 'งานช่วยจัดงานอีเวนต์ของบริษัท',
      date: '1 ธ.ค. 2024',
      rating: 4.9,
      earnings: 1200
    },
    {
      id: 5,
      title: 'งานถ่ายภาพสินค้า',
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?w=400&h=400&fit=crop',
      description: 'งานถ่ายภาพสินค้าสำหรับร้านออนไลน์',
      date: '28 พ.ย. 2024',
      rating: 4.7,
      earnings: 900
    },
    {
      id: 6,
      title: 'งานช่วยเหลือลูกค้า',
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop',
      description: 'งานช่วยเหลือลูกค้าที่ห้างสรรพสินค้า',
      date: '25 พ.ย. 2024',
      rating: 4.6,
      earnings: 750
    }
  ]);

  const handleAddPortfolio = () => {
    // TODO: เพิ่มฟังก์ชันเพิ่มผลงาน
    alert('เพิ่มผลงานใหม่');
  };

  const handleEditPortfolio = (id: number) => {
    // TODO: เพิ่มฟังก์ชันแก้ไขผลงาน
    alert(`แก้ไขผลงาน ID: ${id}`);
  };

  const handleDeletePortfolio = (id: number) => {
    // TODO: เพิ่มฟังก์ชันลบผลงาน
    if (confirm('ต้องการลบผลงานนี้หรือไม่?')) {
      alert(`ลบผลงาน ID: ${id}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">ประวัติการทำงาน</h3>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-2 gap-4">
        {portfolioItems.map((item) => (
          <div key={item.id} className="group relative bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Portfolio Image */}
            <div className="relative aspect-square">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleEditPortfolio(item.id)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeletePortfolio(item.id)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              {/* Type indicator */}
              {item.type === 'video' && (
                <div className="absolute top-2 right-2 bg-black/70 rounded-full p-1">
                  <Play className="h-3 w-3 text-white" />
                </div>
              )}
            </div>

            {/* Portfolio Info */}
            <div className="p-3">
              <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                {item.title}
              </h4>
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {item.description}
              </p>
              
              {/* Meta info */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-gray-500">
                  <span>{item.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{item.rating}</span>
                  </div>
                  <div className="text-green-600 font-semibold">
                    ฿{item.earnings.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Portfolio Stats */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3">สรุปประวัติการทำงาน</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{portfolioItems.length}</p>
            <p className="text-sm text-gray-600">งานทั้งหมด</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              ฿{portfolioItems.reduce((sum, item) => sum + item.earnings, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">รายได้รวม</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">
              {(portfolioItems.reduce((sum, item) => sum + item.rating, 0) / portfolioItems.length).toFixed(1)}
            </p>
            <p className="text-sm text-gray-600">คะแนนเฉลี่ย</p>
          </div>
        </div>
      </div>

      {/* Empty State (จะแสดงเมื่อไม่มีผลงาน) */}
      {portfolioItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Image className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-800">ยังไม่มีประวัติการทำงาน</h3>
          <p className="mt-1 text-sm max-w-xs mx-auto">เพิ่มประวัติการทำงานของคุณเพื่อแสดงความสามารถและประสบการณ์</p>
          <Button 
            onClick={handleAddPortfolio}
            className="mt-4 bg-primary text-white hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มประวัติการทำงานแรก
          </Button>
        </div>
      )}
    </div>
  );
};

export default SeekerProfilePortfolioTab;
