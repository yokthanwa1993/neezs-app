import React from 'react';
import { Wallet, Rocket } from 'lucide-react';

type PromoGridProps = {
  onPrimaryAction?: () => void;
  primaryTitle?: string;
  primarySubtitle?: string;
  primaryDescription?: string;
  primaryCta?: string;
  walletTitle?: string;
  walletSubtitle?: string;
  missionsTitle?: string;
  missionsSubtitle?: string;
  theme?: 'brand' | 'blue';
  walletTheme?: 'brand' | 'blue' | 'yellow';
  missionsTheme?: 'brand' | 'blue' | 'yellow';
};

const PromoGrid: React.FC<PromoGridProps> = ({
  onPrimaryAction,
  primaryTitle = 'blueplus+',
  primarySubtitle = 'เข้าสู่ระบบ /\nสมัครสมาชิก',
  primaryDescription = 'เพื่อรับสิทธิประโยชน์มากมาย',
  primaryCta = 'เข้าสู่ระบบ',
  walletTitle = 'Wallet',
  walletSubtitle = 'จ่ายเงินสะดวกสบาย',
  missionsTitle = 'Missions',
  missionsSubtitle = 'ภารกิจพิเศษรออยู่',
  theme = 'brand',
  walletTheme,
  missionsTheme,
}) => {
  const accentText = theme === 'blue' ? 'text-blue-600' : 'text-primary';
  const glowBg = theme === 'blue' ? 'bg-blue-200/40' : 'bg-yellow-200/40';
  const glowBgSoft = theme === 'blue' ? 'bg-blue-200/30' : 'bg-yellow-200/30';
  const pillGradient = theme === 'blue' ? 'from-blue-400 to-indigo-500' : 'from-yellow-300 to-yellow-500';
  const ctaGradient = theme === 'blue' ? 'from-blue-100 to-blue-200' : 'from-yellow-100 to-yellow-200';
  const ringColor = theme === 'blue' ? 'ring-blue-300/50' : 'ring-yellow-300/50';
  const ringSoft = theme === 'blue' ? 'ring-blue-200/60' : 'ring-yellow-200/60';
  const logoGradient = theme === 'blue' ? 'from-blue-300 via-blue-400 to-indigo-500' : 'from-yellow-300 via-yellow-400 to-yellow-500';
  
  // Wallet-specific theming
  const walletActualTheme = walletTheme || theme;
  const walletAccentText = walletActualTheme === 'blue' ? 'text-blue-600' : walletActualTheme === 'yellow' ? 'text-yellow-600' : 'text-primary';
  const walletGlowBgSoft = walletActualTheme === 'blue' ? 'bg-blue-200/30' : walletActualTheme === 'yellow' ? 'bg-yellow-200/30' : 'bg-yellow-200/30';
  const walletPillGradient = walletActualTheme === 'blue' ? 'from-blue-400 to-indigo-500' : walletActualTheme === 'yellow' ? 'from-yellow-400 to-yellow-500' : 'from-yellow-300 to-yellow-500';
  const walletRingSoft = walletActualTheme === 'blue' ? 'ring-blue-200/60' : walletActualTheme === 'yellow' ? 'ring-yellow-300/60' : 'ring-yellow-200/60';
  
  // Missions-specific theming
  const missionsActualTheme = missionsTheme || theme;
  const missionsAccentText = missionsActualTheme === 'blue' ? 'text-blue-600' : missionsActualTheme === 'yellow' ? 'text-yellow-600' : 'text-primary';
  const missionsGlowBgSoft = missionsActualTheme === 'blue' ? 'bg-blue-200/30' : missionsActualTheme === 'yellow' ? 'bg-yellow-200/30' : 'bg-yellow-200/30';
  const missionsPillGradient = missionsActualTheme === 'blue' ? 'from-blue-400 to-indigo-500' : missionsActualTheme === 'yellow' ? 'from-yellow-400 to-yellow-500' : 'from-yellow-300 to-yellow-500';
  const missionsRingSoft = missionsActualTheme === 'blue' ? 'ring-blue-200/60' : missionsActualTheme === 'yellow' ? 'ring-yellow-300/60' : 'ring-yellow-200/60';
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-3">
      {/* Left big card */}
      <div className="relative col-span-2 row-span-2 h-full rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
        {/* glow */}
        <span aria-hidden className={`pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full ${glowBg} blur-2xl`} />

        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className={`text-2xl font-extrabold ${accentText} leading-none`}>{primaryTitle}</div>
              <div className="text-base font-semibold text-gray-900 whitespace-pre-line leading-tight">{primarySubtitle}</div>
              <div className="text-sm text-gray-600">{primaryDescription}</div>
            </div>
            {/* circular logo */}
            <div className={`shrink-0 h-10 w-10 rounded-full bg-gradient-to-br ${logoGradient} text-white flex items-center justify-center font-bold`}>b+</div>
          </div>

          {/* CTA area */}
          <button
            onClick={onPrimaryAction}
            className={`mt-4 w-full h-12 rounded-2xl bg-gradient-to-b ${ctaGradient} text-black font-bold flex items-center justify-between px-4 ring-1 ${ringColor} hover:brightness-105 active:brightness-95`}
          >
            <span>{primaryCta}</span>
            <span className="text-xl">→</span>
          </button>
        </div>
      </div>

      {/* Top-right card: Wallet */}
      <div className="relative h-full overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 min-h-[96px] shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
        <span aria-hidden className={`pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full ${walletGlowBgSoft} blur-2xl`} />
        {/* icon placed beside text, not behind */}
        <div className="relative z-10 h-full flex items-center gap-4">
          <div className={`shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br ${walletPillGradient} ring-2 ${walletRingSoft} shadow-[0_6px_18px_rgba(0,0,0,0.12)] flex items-center justify-center`}>
            <Wallet className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-xl font-bold text-gray-900 leading-tight`}>{walletTitle}</div>
            <div className="mt-2 text-base text-gray-600 whitespace-pre-line leading-snug">{walletSubtitle}</div>
          </div>
        </div>
      </div>

      {/* Bottom-right card: Missions */}
      <div className="relative h-full overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 min-h-[96px] shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
        <span aria-hidden className={`pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full ${missionsGlowBgSoft} blur-2xl`} />
        {/* icon placed beside text, themeable */}
        <div className="relative z-10 h-full flex items-center gap-4">
          <div className={`shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br ${missionsPillGradient} ring-2 ${missionsRingSoft} shadow-[0_6px_18px_rgba(0,0,0,0.12)] flex items-center justify-center`}>
            <Rocket className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className={`text-xl font-bold text-gray-900 leading-tight`}>{missionsTitle}</div>
            <div className="mt-2 text-base text-gray-600 whitespace-pre-line leading-snug">{missionsSubtitle}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoGrid;
