"use client";

import React from 'react';
import { Star as StarIcon } from 'lucide-react';

type StarRatingProps = {
  value: number; // 0 - 5
  size?: number; // px
  count?: number; // optional: number of reviews
  className?: string;
};

const StarRating: React.FC<StarRatingProps> = ({ value, size = 18, count, className }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className={`flex items-center gap-1 ${className || ""}`} aria-label={`เรทติ้ง ${value} จาก 5`}>
      {stars.map((i) => {
        const fillPercent = Math.max(0, Math.min(1, value - i)) * 100;
        return (
          <div key={i} className="relative" style={{ width: size, height: size }}>
            <StarIcon
              className="text-gray-300"
              size={size}
              strokeWidth={1.75}
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercent}%` }}
            >
              <StarIcon
                className="text-yellow-500"
                size={size}
                strokeWidth={1.75}
                fill="currentColor"
              />
            </div>
          </div>
        );
      })}
      <span className="ml-1 text-sm text-gray-600">
        {value.toFixed(1)}{typeof count === 'number' ? ` (${count})` : ""}
      </span>
    </div>
  );
};

export default StarRating;