import React from 'react';
import { Wallet, Briefcase, Users, TrendingUp } from 'lucide-react';

type DashboardSummaryProps = {
  walletBalance: number;
  jobsCount: number;
  visitorsToday: number;
  visitorsChange?: number; // percentage, can be negative
  className?: string;
};

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  walletBalance,
  jobsCount,
  visitorsToday,
  visitorsChange = 0,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-3 gap-3 ${className}`}>
      {/* Wallet card */}
      <div className="relative rounded-3xl border border-gray-100 bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-0.5">
        <span className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-yellow-200/40 blur-2xl" />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="text-sm font-semibold text-primary">Wallet</div>
            <div className="mt-2 text-xs text-gray-500">ยอดคงเหลือ</div>
            <div className="text-xl font-bold text-gray-900 font-mono tracking-tight">
              ฿{walletBalance.toLocaleString()}
            </div>
          </div>
          <div className="shrink-0 rounded-2xl p-2.5 bg-gradient-to-br from-yellow-200 to-yellow-400 ring-1 ring-yellow-300/40 shadow-inner">
            <Wallet className="w-6 h-6 text-black" />
          </div>
        </div>
      </div>

      {/* Jobs card */}
      <div className="relative rounded-3xl border border-gray-100 bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-0.5">
        <span className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-yellow-200/30 blur-2xl" />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="text-sm font-semibold text-primary">งาน</div>
            <div className="mt-2 text-xs text-gray-500">งานที่เคยโพสต์</div>
            <div className="text-xl font-bold text-gray-900">{jobsCount}</div>
          </div>
          <div className="shrink-0 rounded-2xl p-2.5 bg-gradient-to-br from-yellow-200 to-yellow-400 ring-1 ring-yellow-300/40 shadow-inner">
            <Briefcase className="w-6 h-6 text-black" />
          </div>
        </div>
      </div>

      {/* Visitors card */}
      <div className="relative rounded-3xl border border-gray-100 bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-0.5">
        <span className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-yellow-200/30 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="text-sm font-semibold text-primary">ผู้เข้าชม</div>
            <div className="shrink-0 rounded-2xl p-2.5 bg-gradient-to-br from-yellow-200 to-yellow-400 ring-1 ring-yellow-300/40 shadow-inner">
              <Users className="w-6 h-6 text-black" />
            </div>
          </div>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <div className="text-xs text-gray-500">วันนี้</div>
              <div className="text-xl font-bold text-gray-900">{visitorsToday}</div>
            </div>
            <div className={`flex items-center gap-1 text-xs ${visitorsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="w-4 h-4" />
              {visitorsChange >= 0 ? '+' : ''}{visitorsChange}%
            </div>
          </div>
          <div className="mt-2 grid grid-cols-6 gap-1 h-8 items-end">
            {[4, 6, 3, 7, 5, 8].map((h, i) => (
              <div key={i} className="bg-yellow-200 rounded-sm" style={{ height: `${h * 8}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
