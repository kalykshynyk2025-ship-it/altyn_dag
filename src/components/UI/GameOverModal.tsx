import React from 'react';
import { RotateCcw, Home, Award, ArrowUpCircle } from 'lucide-react';
import { getTranslation, Language } from '../../utils/translations';

interface GameOverModalProps {
  reason: string;
  distanceRun: number;
  tokensCollected: number;
  score: number;
  highScore: number;
  lang?: Language;
  onRetry: () => void;
  onReturnMenu: () => void;
  onOpenUpgrades: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  reason,
  distanceRun,
  tokensCollected,
  score,
  highScore,
  lang = 'RU',
  onRetry,
  onReturnMenu,
  onOpenUpgrades
}) => {
  const activeLang: Language = (lang as Language) || 'RU';
  const isNewHighScore = score >= highScore && score > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="relative w-full max-w-sm max-h-[92vh] overflow-y-auto bg-[#FDF6E3] border-2 border-[#D4AF37] rounded-2xl p-4 sm:p-5 text-[#2D2D2D] shadow-2xl flex flex-col justify-between">
        {/* Top Header */}
        <div className="text-center border-b border-[#D4AF37]/50 pb-2.5">
          <span className="text-xs font-bold text-red-700 uppercase tracking-widest">
            {getTranslation('runEnded', activeLang)}
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#2D2D2D] font-['Playfair_Display',serif] mt-0.5">{reason}</h2>
        </div>

        {/* New Record Banner */}
        {isNewHighScore && (
          <div className="my-2.5 py-1.5 bg-[#D4AF37]/20 border border-[#D4AF37] rounded-xl text-center flex items-center justify-center gap-1.5 text-[#8B4513] font-black text-xs uppercase tracking-wider">
            <Award className="w-4 h-4 text-[#8B4513]" />
            <span>{getTranslation('newRecord', activeLang)}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 my-3">
          <div className="bg-[#F5F5F0] p-2 rounded-xl border border-[#D4AF37]/40 text-center">
            <span className="text-[11px] text-[#2D2D2D]/70 font-semibold block">{getTranslation('distRun', activeLang)}</span>
            <span className="text-lg font-black text-[#8B4513] font-mono">{distanceRun} {getTranslation('meters', activeLang)}</span>
          </div>

          <div className="bg-[#F5F5F0] p-2 rounded-xl border border-[#D4AF37]/40 text-center">
            <span className="text-[11px] text-[#2D2D2D]/70 font-semibold block">{getTranslation('tokensCollected', activeLang)}</span>
            <span className="text-lg font-black text-[#8B732A]">❖ {tokensCollected}</span>
          </div>

          <div className="bg-[#F5F5F0] p-2 rounded-xl border border-[#D4AF37]/40 text-center col-span-2">
            <span className="text-[11px] text-[#2D2D2D]/70 font-semibold block">{getTranslation('finalScore', activeLang)}</span>
            <span className="text-xl font-black text-[#2D2D2D] font-mono">{score}</span>
            <span className="text-[10px] text-[#2D2D2D]/60 block mt-0.5">{getTranslation('bestScore', activeLang)}: {highScore}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-2">
          <button
            onClick={onRetry}
            className="w-full py-3 bg-[#8B4513] hover:brightness-110 text-[#FDF6E3] font-black tracking-wider rounded-xl shadow-md border border-[#D4AF37] flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{getTranslation('tryAgain', activeLang)}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenUpgrades}
              className="py-2.5 bg-[#F5F5F0] hover:bg-[#EAEAE0] text-[#8B4513] font-bold text-xs rounded-xl border border-[#D4AF37]/60 flex items-center justify-center gap-1.5"
            >
              <ArrowUpCircle className="w-4 h-4 text-[#8B4513]" />
              <span>{getTranslation('upgradesBtn', activeLang)}</span>
            </button>

            <button
              onClick={onReturnMenu}
              className="py-2.5 bg-[#2D2D2D] hover:bg-[#1A1A1A] text-[#FDF6E3] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
            >
              <Home className="w-4 h-4" />
              <span>{getTranslation('mainMenu', activeLang)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
