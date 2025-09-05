import React from 'react';

type HeroWelcomeProps = {
  title?: string;
};

const logos = [
  { text: 'found', bg: 'from-emerald-200 to-emerald-300', textColor: 'text-emerald-700' },
  { text: 'AZ', bg: 'from-lime-200 to-lime-300', textColor: 'text-lime-700' },
  { text: 'PTT', bg: 'from-sky-200 to-sky-300', textColor: 'text-sky-700' },
  { text: 'EV', bg: 'from-blue-200 to-indigo-300', textColor: 'text-indigo-700' },
  { text: 'FIT', bg: 'from-cyan-200 to-cyan-300', textColor: 'text-cyan-700' },
  { text: 'Care', bg: 'from-teal-200 to-teal-300', textColor: 'text-teal-700' },
];

const HeroWelcome: React.FC<HeroWelcomeProps> = ({ title = 'ยินดีต้อนรับเข้าสู่ blueplus+' }) => {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-sky-100 to-blue-200 shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
      {/* sky gradient + soft light */}
      <div className="absolute inset-0">
        <span aria-hidden className="absolute right-10 top-6 h-40 w-40 rounded-full bg-white/40 blur-2xl" />
        <span aria-hidden className="absolute left-6 top-10 h-32 w-32 rounded-full bg-white/30 blur-xl" />
      </div>

      <div className="relative z-10 px-5 py-6">
        <h2 className="text-center text-xl font-extrabold text-white drop-shadow-sm">
          {title}
        </h2>

        {/* floating brand badges */}
        <div className="mt-4 flex items-center justify-between gap-2">
          {logos.map((l, i) => (
            <div
              key={i}
              className={`relative h-14 w-14 shrink-0 rounded-full bg-gradient-to-br ${l.bg} flex items-center justify-center ring-4 ring-white/60 shadow-[0_10px_24px_rgba(30,64,175,0.15)]`}
            >
              <div className={`text-xs font-bold ${l.textColor}`}>{l.text}</div>
              <span aria-hidden className="absolute inset-0 rounded-full bg-white/30 mix-blend-overlay" />
            </div>
          ))}
        </div>
      </div>

      {/* curved white wave bottom */}
      <svg
        className="absolute bottom-0 left-0 right-0 h-12 w-full text-white"
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

export default HeroWelcome;

