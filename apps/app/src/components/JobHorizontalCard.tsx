import React from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

type JobHorizontalCardProps = {
  image: string;
  title: string;
  location: string;
  price: string;
  onApply?: () => void;
};

const JobHorizontalCard: React.FC<JobHorizontalCardProps> = ({
  image,
  title,
  location,
  price,
  onApply,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden min-w-[300px] max-w-[320px] flex-shrink-0 mr-4">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/80 rounded-full p-1">
          <Bookmark className="text-yellow-400" fill="#fde047" />
        </div>
      </div>
      <div className="p-5 pb-4">
        <h3 className="font-bold text-lg text-gray-900 mb-1">{title}</h3>
        <div className="text-gray-500 text-sm mb-2">{location}</div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-red-600 font-bold text-lg">{price}</span>
          <Button
            className="bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-300 px-6"
            onClick={onApply}
          >
            สมัคร
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobHorizontalCard;