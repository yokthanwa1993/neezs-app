import React, { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  images: string[];
  className?: string;
  heightClass?: string; // e.g. "h-64"
  imgClassName?: string;
  showArrows?: boolean;
  showDots?: boolean;
};

const ImageCarousel: React.FC<Props> = ({
  images,
  className = '',
  heightClass = 'h-64',
  imgClassName = 'object-cover',
  showArrows = true,
  showDots = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // Ensure stable refs length
  itemRefs.current = useMemo(() => new Array(images.length).fill(null), [images.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        let bestIndex = active;
        let bestRatio = 0;
        entries.forEach((entry) => {
          const indexAttr = entry.target.getAttribute('data-index');
          const index = indexAttr ? parseInt(indexAttr, 10) : 0;
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIndex = index;
          }
        });
        if (bestIndex !== active) setActive(bestIndex);
      },
      {
        root: container,
        threshold: [0.4, 0.6, 0.8],
      }
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
    // We intentionally depend only on images length; IntersectionObserver handles updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  const scrollToIndex = (index: number) => {
    const target = itemRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
  };

  const handlePrev = () => {
    const nextIndex = (active - 1 + images.length) % images.length;
    scrollToIndex(nextIndex);
  };

  const handleNext = () => {
    const nextIndex = (active + 1) % images.length;
    scrollToIndex(nextIndex);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Scroll container */}
      <div
        ref={containerRef}
        className={`w-full overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory`}
      >
        <div className="flex w-full">
          {images.map((src, i) => (
            <div
              key={i}
              data-index={i}
              ref={(el) => (itemRefs.current[i] = el)}
              className={`shrink-0 w-full ${heightClass} snap-start relative bg-gray-100`}
            >
              <img src={src} alt={`slide-${i + 1}`} className={`w-full h-full ${imgClassName}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {showArrows && images.length > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={handlePrev}
            className="absolute inset-y-0 left-2 my-auto h-10 w-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            aria-label="Next slide"
            onClick={handleNext}
            className="absolute inset-y-0 right-2 my-auto h-10 w-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 transition-all ${
                active === i ? 'w-5 bg-white' : 'w-2 bg-white/60'
              } rounded-full`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
