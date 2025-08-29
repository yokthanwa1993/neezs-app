import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MapView = () => {
  const navigate = useNavigate();

  // URL สำหรับ Google Maps Embed API (ตัวอย่าง: ปักหมุดที่กรุงเทพฯ)
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124036.7024497693!2d100.47959040000001!3d13.7383616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ed0231b1a13%3A0x401004207920190!2sBangkok%2C%20Thailand!5e0!3m2!1sen!2sus!4v1625841234567!5m2!1sen!2sus`;

  return (
    <div className="relative w-full h-screen">
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        title="Google Maps View"
      ></iframe>
      <div className="absolute top-4 left-4">
        <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-md"
            onClick={() => navigate(-1)}
        >
            <ArrowLeft className="h-6 w-6 text-gray-800" />
        </Button>
      </div>
    </div>
  );
};

export default MapView;