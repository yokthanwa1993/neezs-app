import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

type ApplicantAvatarProps = {
  src?: string;
  alt?: string;
  rating?: number; // 0-5
};

const ApplicantAvatar: React.FC<ApplicantAvatarProps> = ({ src, alt = 'Applicant', rating = 0 }) => {
  const fallback = (alt?.[0] || 'A').toUpperCase();
  const stars = Array.from({ length: 5 }, (_, i) => i < rating);

  return (
    <div className="flex flex-col items-center flex-shrink-0 snap-start">
      {/* Instagram-like gradient ring with white gap */}
      <div className="rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-pink-500 to-fuchsia-600">
        <div className="rounded-full p-[2px] bg-white">
          <Avatar className="w-16 h-16 rounded-full overflow-hidden">
            <AvatarImage src={src} className="object-cover w-full h-full" />
            <AvatarFallback className="rounded-full">{fallback}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Stars below the avatar */}
      <div className="mt-1 flex items-center justify-center gap-0.5">
        {stars.map((filled, idx) => (
          <Star
            key={idx}
            className={filled ? 'h-3 w-3 text-yellow-500' : 'h-3 w-3 text-gray-300'}
            {...(filled ? { fill: 'currentColor' } : {})}
          />
        ))}
      </div>
    </div>
  );
};

export default ApplicantAvatar;