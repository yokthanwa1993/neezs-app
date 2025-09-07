import React from 'react';

type StoryCardProps = {
  background: string;
  avatar: string;
  name: string;
  isCreate?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

const StoryCard: React.FC<StoryCardProps> = ({ avatar, name, className = '', style }) => {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden flex-shrink-0 snap-start bg-black w-full h-48 sm:h-56 ${className}`}
      style={style}
    >
      <img
        src={avatar}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
};

export default StoryCard;