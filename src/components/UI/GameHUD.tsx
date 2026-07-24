import React from 'react';
import { Play, Pause, Zap, Target, Volume2, Shield, Feather, Compass, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import { ActivePowerUpState, PlayerProfile } from '../../types/game';
import { GAME_CONFIG } from '../../config/gameConfig';
import { getTranslation, Language } from '../../utils/translations';

interface GameHUDProps {
  distance: number;
  score: number;
  tokens: number;
  arrows: number;
  speed: number;
  chapterProgressPct: number;
  chapterTitle: string;
  activePowerUps: ActivePowerUpState[];
  profile: PlayerProfile;
  onPauseToggle: () => void;
  onShootBow: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onJump: () => void;
  onSlide: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  distance,
  score,
  tokens,
  arrows,
  speed,
  chapterProgressPct,
  chapterTitle,
  activePowerUps,
  profile,
  onPauseToggle,
  onShootBow,
  onMoveLeft,
  onMoveRight,
  onJump,
  onSlide
}) => {
  const lang: Language = profile.settings.language || 'RU';

  const getPowerUpIcon = (type: string) => {
    switch (type) {
      case 'SPEED_WIND': return <Zap className="w-4 h-4 text-amber-500 animate-pulse" />;
      case 'EAGLE_WINGS': return <Feather className="w-4 h-4 text-sky-500 animate-bounce" />;
      case 'HERO_VOICE': return <Volume2 className="w-4 h-4 text-red-600 animate-ping" />;
      case 'CELESTIAL_ARROW': return <Target className="w-4 h-4 text-purple-600" />;
      case 'SHIELD_SPIRIT': return <Shield className="w-4 h-4 text-emerald-600" />;
      case 'ANCESTRAL_PATH': return <Compass className="w-4 h-4 text-amber-600" />;
      default: return <Zap className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-30 pointer-events-none flex flex-col justify-between p-2.5 sm:p-4 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header Bar */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex justify-between items-center bg-[#FDF6E3]/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border-2 border-[#D4AF37] text-[#2D2D2D] shadow-lg pointer-events-auto">
          {/* Chapter Title & Meter */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold text-[#8B4513] tracking-widest uppercase font-['Playfair_Display',serif]">
                {chapterTitle}
              </span>
              <span className="bg-[#2D2D2D] text-[#FDF6E3] px-1.5 py-0.5 rounded text-[9px] font-bold">3D</span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-[#2D2D2D] font-mono tracking-tight">
                {distance} <span className="text-xs font-bold text-[#8B4513]">{getTranslation('meters', lang)}</span>
              </span>
              <span className="text-xs text-[#2D2D2D]/70 font-bold">
                {score} {getTranslation('points', lang)}
              </span>
            </div>
          </div>

          {/* Tokens & Arrows Counters */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Gold Tokens */}
            <div className="flex items-center gap-1 bg-[#F5F5F0] px-2 py-1 rounded-xl border border-[#D4AF37]/80 shadow-xs">
              <div className="w-3.5 h-3.5 rounded-full bg-[#D4AF37] text-[#2D2D2D] flex items-center justify-center text-[9px] font-bold">
                ❖
              </div>
              <span className="font-extrabold text-[#8B732A] text-xs sm:text-sm">{tokens}</span>
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-1 bg-[#F5F5F0] px-2 py-1 rounded-xl border border-red-500/40 shadow-xs">
              <Target className="w-3.5 h-3.5 text-red-600" />
              <span className="font-extrabold text-red-700 text-xs sm:text-sm">{arrows}</span>
            </div>

            {/* Pause Button */}
            <button
              onClick={onPauseToggle}
              className="p-1.5 sm:p-2 bg-[#2D2D2D] hover:bg-[#1A1A1A] rounded-xl border border-[#D4AF37]/50 text-[#FDF6E3] transition-colors active:scale-95"
            >
              <Pause className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chapter Progress Bar */}
        <div className="w-full bg-[#2D2D2D]/20 rounded-full h-2 border border-[#D4AF37]/40 overflow-hidden bg-[#F5F5F0]">
          <div
            className="bg-gradient-to-r from-[#8B4513] via-[#D4AF37] to-[#8B4513] h-full transition-all duration-300 shadow-xs"
            style={{ width: `${chapterProgressPct}%` }}
          />
        </div>
      </div>

      {/* Active PowerUps Display - Positioned lower on screen above bottom controls */}
      {activePowerUps.length > 0 && (
        <div className="flex flex-col gap-1.5 items-start max-w-xs pointer-events-auto mt-auto mb-2">
          {activePowerUps.map((p) => {
            const pDef = GAME_CONFIG.POWERUPS[p.type];
            const pct = Math.max(0, (p.remainingTime / p.maxTime) * 100);
            return (
              <div
                key={p.type}
                className="flex items-center gap-2 bg-[#FDF6E3]/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-[#D4AF37] text-xs text-[#2D2D2D] shadow-md w-44 sm:w-52"
              >
                {getPowerUpIcon(p.type)}
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-[#8B4513] text-[10px] sm:text-[11px] truncate">
                      {pDef ? pDef.name : p.type}
                    </span>
                    {p.charges !== undefined && (
                      <span className="text-[10px] font-black text-amber-800 bg-amber-200/80 px-1.5 py-0.2 rounded-md border border-amber-400 ml-1">
                        x{p.charges}
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-[#2D2D2D]/15 rounded-full h-1 mt-0.5 overflow-hidden">
                    <div
                      className="bg-[#8B4513] h-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Controls Area (Touch Movement Pad & Shoot Button with Mobile Safe-Area Elevation) */}
      <div className="flex justify-between items-end w-full pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] sm:pb-4 px-1 pointer-events-auto z-40">
        {/* On-Screen Touch Movement Pad */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Move Left Button */}
          <button
            onTouchStart={(e) => { e.stopPropagation(); onMoveLeft(); }}
            onClick={(e) => { e.stopPropagation(); onMoveLeft(); }}
            className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-[#FDF6E3]/95 border-2 border-[#D4AF37] text-[#8B4513] shadow-xl flex items-center justify-center active:scale-90 transition-all"
            title="Move Left"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
          </button>

          {/* Move Right Button */}
          <button
            onTouchStart={(e) => { e.stopPropagation(); onMoveRight(); }}
            onClick={(e) => { e.stopPropagation(); onMoveRight(); }}
            className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-[#FDF6E3]/95 border-2 border-[#D4AF37] text-[#8B4513] shadow-xl flex items-center justify-center active:scale-90 transition-all"
            title="Move Right"
          >
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
          </button>

          {/* Jump Button */}
          <button
            onTouchStart={(e) => { e.stopPropagation(); onJump(); }}
            onClick={(e) => { e.stopPropagation(); onJump(); }}
            className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-[#FDF6E3]/90 border border-[#2D2D2D]/20 text-[#2D2D2D] shadow-md flex items-center justify-center active:scale-90 transition-all text-[11px] font-bold"
            title="Jump"
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          {/* Slide Button */}
          <button
            onTouchStart={(e) => { e.stopPropagation(); onSlide(); }}
            onClick={(e) => { e.stopPropagation(); onSlide(); }}
            className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-[#FDF6E3]/90 border border-[#2D2D2D]/20 text-[#2D2D2D] shadow-md flex items-center justify-center active:scale-90 transition-all text-[11px] font-bold"
            title="Slide"
          >
            <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Archery Shoot Touch Button - High Visibility & Instant Mobile Touch Response */}
        <button
          onTouchStart={(e) => {
            e.stopPropagation();
            if (arrows > 0) onShootBow();
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (arrows > 0) onShootBow();
          }}
          disabled={arrows <= 0}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center border-2 border-[#D4AF37] shadow-2xl transition-all active:scale-90 z-50 ${
            arrows > 0
              ? 'bg-gradient-to-b from-[#A52A2A] via-[#8B4513] to-[#5C2E0B] text-[#FDF6E3] ring-4 ring-[#D4AF37]/40 shadow-red-900/50'
              : 'bg-[#2D2D2D]/60 border-[#2D2D2D]/40 text-[#FDF6E3]/40 opacity-70'
          }`}
          title="Shoot Bow"
          aria-label="Shoot Bow"
        >
          <Target className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-md" />
          <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-tighter mt-0.5 drop-shadow">
            {getTranslation('shoot', lang)} ({arrows})
          </span>
        </button>
      </div>
    </div>
  );
};
