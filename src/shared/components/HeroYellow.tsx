import React from 'react';
import { Wallet, Briefcase, Users, Grid } from 'lucide-react';

type HeroYellowProps = {
  title?: string;
  showTitle?: boolean;
  className?: string;
};

/**
 * Soft yellow hero banner inspired by blueplus layout.
 * Rounded block with subtle amber gradient, glow orbs, icon bubbles, and white wave bottom.
 */
const HeroYellow: React.FC<HeroYellowProps> = ({ title = 'ยินดีต้อนรับเข้าสู่ blueplus+', showTitle = false, className = '' }) => {
  const circleClass = 'relative h-14 w-14 shrink-0 rounded-full bg-white/90 backdrop-blur flex items-center justify-center ring-4 ring-white/80 shadow-[0_10px_24px_rgba(234,179,8,0.18)]';

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-amber-50 to-yellow-100 shadow-[0_12px_32px_rgba(0,0,0,0.08)] ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(to bottom, var(--tw-gradient-from), var(--tw-gradient-to)), radial-gradient(circle at 20% 10%, rgba(245,200,66,0.18), transparent 35%), radial-gradient(circle at 85% 15%, rgba(250,204,21,0.14), transparent 40%), radial-gradient(circle at 50% 100%, rgba(234,179,8,0.12), transparent 45%)',
      }}
    >
      {/* Glows */}
      <div className="absolute inset-0">
        <span aria-hidden className="absolute right-10 top-6 h-40 w-40 rounded-full bg-amber-200/40 blur-2xl" />
        <span aria-hidden className="absolute left-6 top-10 h-32 w-32 rounded-full bg-yellow-200/30 blur-xl" />
      </div>

      <div className="relative z-10 px-5 py-6">
        {showTitle && (
          <h2 className="text-center text-xl font-extrabold text-gray-900">{title}</h2>
        )}
        {/* Icon bubbles row */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className={circleClass}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Amazon_Coffee_Logo.svg" alt="brand" className="h-7 w-7 object-contain opacity-90" />
          </div>
          <div className={circleClass}>
            <Wallet className="w-7 h-7 text-yellow-600" />
          </div>
          <div className={circleClass}>
            <Briefcase className="w-7 h-7 text-yellow-600" />
          </div>
          <div className={circleClass}>
            <Users className="w-7 h-7 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* White wave bottom */}
      <svg
        className="absolute bottom-0 left-0 right-0 h-12 w-full text-[#F2C116]"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0,96L48,90.7C96,85,192,75,288,69.3C384,64,480,64,576,74.7C672,85,768,107,864,117.3C960,128,1056,128,1152,117.3C1248,107,1344,85,1392,74.7L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        />
      </svg>
    </div>
  );
};

export default HeroYellow;
