import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { getTranslation, Language } from '../../utils/translations';

interface CreditsCardProps {
  compact?: boolean;
  lang?: Language;
}

export const CreditsCard: React.FC<CreditsCardProps> = ({ compact = false, lang = 'RU' }) => {
  return (
    <div className={`w-full bg-[#F5F5F0] border border-[#D4AF37]/60 rounded-2xl p-2.5 sm:p-3 shadow-sm text-left ${compact ? 'my-1' : 'my-2'}`}>
      <div className="flex items-center gap-3">
        {/* Logo Image */}
        <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl border border-[#D4AF37]/40 p-1 flex items-center justify-center shadow-xs overflow-hidden">
          <img
            src="/logo_immersive_theatre.png"
            alt="Иммерсивный Театр Народов России"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Info Text */}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] sm:text-[11px] font-bold text-[#8B4513] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#8B4513]" />
            <span>{getTranslation('createdLabel', lang)}</span>
          </div>
          <h4 className="text-xs sm:text-sm font-extrabold text-[#2D2D2D] font-['Playfair_Display',serif] leading-tight">
            Иммерсивный театр народов России
          </h4>
          <div className="flex items-center gap-2 mt-0.5 text-[10px] sm:text-[11px]">
            <a
              href="https://max.ru/id671203793990_biz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-[#8B4513] hover:text-[#A0522D] hover:underline font-bold transition-colors"
            >
              <span>MAX</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span className="text-[#8B4513]/50">•</span>
            <a
              href="https://t.me/immersivetheatr_narody"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-[#8B4513] hover:text-[#A0522D] hover:underline font-bold transition-colors"
            >
              <span>ТГ</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          <div className="mt-1 pt-0.5 border-t border-[#2D2D2D]/10">
            <div className="text-[8px] sm:text-[9px] font-medium text-[#8B4513] uppercase tracking-wider">
              {getTranslation('gameDevLabel', lang)}
            </div>
            <a
              href="https://kalyk-shynyk-web-studio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold text-[#8B4513] hover:text-[#A0522D] hover:underline transition-colors leading-tight group"
            >
              <span>КАЛЫК ШЫНЫК WEB STUDIO & GAMIFICATION</span>
              <ExternalLink className="w-2.5 h-2.5 text-[#8B4513] shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
