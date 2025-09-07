import React, { useEffect, useMemo, useRef, useState } from 'react';

type BannerCarouselProps = {
  images: string[];
  interval?: number; // ms
  className?: string;
};

const BannerCarousel: React.FC<BannerCarouselProps> = ({ images, interval = 3500, className = '' }) => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const count = useMemo(() => images.length, [images]);

  const next = () => setIndex((i) => (i + 1) % count);
  const prev = () => setIndex((i) => (i - 1 + count) % count);

  useEffect(() => {
    if (count <= 1) return;
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(next, interval);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [count, interval]);

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchStartX.current = e.touches[0].clientX;
    if (timerRef.current) window.clearInterval(timerRef.current);
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (touchStartX.current == null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(diff) > 40) {
      if (diff < 0) next();
      else prev();
    }
    timerRef.current = window.setInterval(next, interval);
  };

  if (count === 0) return null;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl shadow-md ${className}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((_, i) => (
          <div key={i} className="min-w-full" />
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`ไปยังสไลด์ที่ ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-white' : 'w-2 bg-white/60'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;