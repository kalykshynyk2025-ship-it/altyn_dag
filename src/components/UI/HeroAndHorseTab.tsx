import React from 'react';
import { ArrowLeft, Shield, Check, Lock, ArrowUpCircle } from 'lucide-react';
import { PlayerProfile } from '../../types/game';
import { HORSE_BREEDS } from '../../narrative/storyData';
import { getTranslation, Language } from '../../utils/translations';

interface HeroAndHorseTabProps {
  profile: PlayerProfile;
  onUpdateProfile: (updated: PlayerProfile) => void;
  onClose: () => void;
}

export const HeroAndHorseTab: React.FC<HeroAndHorseTabProps> = ({
  profile,
  onUpdateProfile,
  onClose
}) => {
  const lang: Language = profile.settings.language || 'RU';

  // Upgrade Hero Level
  const heroUpgradeCost = profile.heroLevel * 100;
  const handleUpgradeHero = () => {
    if (profile.tokens >= heroUpgradeCost) {
      onUpdateProfile({
        ...profile,
        tokens: profile.tokens - heroUpgradeCost,
        heroLevel: profile.heroLevel + 1
      });
    }
  };

  // Upgrade Bow Level
  const bowUpgradeCost = profile.bowLevel * 120;
  const handleUpgradeBow = () => {
    if (profile.tokens >= bowUpgradeCost) {
      onUpdateProfile({
        ...profile,
        tokens: profile.tokens - bowUpgradeCost,
        bowLevel: profile.bowLevel + 1,
        arrowsCount: profile.arrowsCount + 10
      });
    }
  };

  // Equip / Unlock Horse
  const handleHorseAction = (horseId: string, costTokens: number) => {
    const isUnlocked = profile.unlockedHorses.includes(horseId);
    if (isUnlocked) {
      onUpdateProfile({ ...profile, equippedHorseId: horseId });
    } else if (profile.tokens >= costTokens) {
      onUpdateProfile({
        ...profile,
        tokens: profile.tokens - costTokens,
        unlockedHorses: [...profile.unlockedHorses, horseId],
        equippedHorseId: horseId
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-3xl max-h-[92vh] sm:max-h-[88vh] flex flex-col bg-[#FDF6E3] border-2 border-[#D4AF37] rounded-2xl shadow-2xl overflow-hidden text-[#2D2D2D]">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-[#D4AF37]/50 bg-[#F5F5F0]">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-[#8B4513] font-bold text-xs sm:text-sm hover:underline"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{getTranslation('back', lang)}</span>
          </button>
          <h2 className="text-sm sm:text-base font-black text-[#2D2D2D] font-['Playfair_Display',serif] text-center">
            {getTranslation('navStable', lang)}
          </h2>
          <div className="flex items-center gap-1 text-xs font-bold text-[#8B732A] bg-[#F5F5F0] px-2.5 py-1 rounded-full border border-[#D4AF37]/60 shadow-xs">
            <span>❖ {profile.tokens}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
          {/* HERO UPGRADES SECTION */}
          <div className="bg-[#F5F5F0] border border-[#D4AF37]/50 rounded-2xl p-4 shadow-xs">
            <h3 className="text-xs font-bold text-[#8B4513] uppercase tracking-widest mb-3">
              {getTranslation('heroTitle', lang)}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Hero Level */}
              <div className="bg-[#FDF6E3] p-3 rounded-xl border border-[#2D2D2D]/15 flex justify-between items-center">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-[#2D2D2D]">{getTranslation('heroLevel', lang)}</span>
                  <p className="text-[11px] text-[#8B4513] font-mono mt-0.5">Уровень {profile.heroLevel}</p>
                  <p className="text-[10px] text-[#2D2D2D]/70 font-medium">
                    Скорость: +{(profile.heroLevel - 1) * 5}% | Скольжение & Выносливость
                  </p>
                </div>
                <button
                  onClick={handleUpgradeHero}
                  disabled={profile.tokens < heroUpgradeCost}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                    profile.tokens >= heroUpgradeCost
                      ? 'bg-[#8B4513] text-[#FDF6E3] hover:brightness-110 shadow-xs'
                      : 'bg-[#2D2D2D]/10 text-[#2D2D2D]/40 cursor-not-allowed'
                  }`}
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  <span>{getTranslation('upgrade', lang)} (❖ {heroUpgradeCost})</span>
                </button>
              </div>

              {/* Bow Master */}
              <div className="bg-[#FDF6E3] p-3 rounded-xl border border-[#2D2D2D]/15 flex justify-between items-center">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-[#2D2D2D]">{getTranslation('bowMastery', lang)}</span>
                  <p className="text-[11px] text-[#8B4513] font-mono mt-0.5">Уровень {profile.bowLevel}</p>
                  <p className="text-[10px] text-[#2D2D2D]/70 font-medium">
                    Урон стрел: {1 + (profile.bowLevel - 1) * 0.5} HP | Запас: +{15 + (profile.bowLevel - 1) * 5} стрел
                  </p>
                </div>
                <button
                  onClick={handleUpgradeBow}
                  disabled={profile.tokens < bowUpgradeCost}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                    profile.tokens >= bowUpgradeCost
                      ? 'bg-[#8B4513] text-[#FDF6E3] hover:brightness-110 shadow-xs'
                      : 'bg-[#2D2D2D]/10 text-[#2D2D2D]/40 cursor-not-allowed'
                  }`}
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  <span>{getTranslation('upgrade', lang)} (❖ {bowUpgradeCost})</span>
                </button>
              </div>
            </div>
          </div>

          {/* HORSE BREEDS SELECTION */}
          <div>
            <h3 className="text-xs font-bold text-[#8B4513] uppercase tracking-widest mb-2.5">
              {getTranslation('steedsTitle', lang)}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {HORSE_BREEDS.map(horse => {
                const isUnlocked = profile.unlockedHorses.includes(horse.id);
                const isEquipped = profile.equippedHorseId === horse.id;

                return (
                  <div
                    key={horse.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isEquipped
                        ? 'bg-[#F5F5F0] border-2 border-[#D4AF37] shadow-md'
                        : isUnlocked
                        ? 'bg-[#FDF6E3] border-[#2D2D2D]/20'
                        : 'bg-[#2D2D2D]/5 border-[#2D2D2D]/10 opacity-80'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-base font-bold text-[#2D2D2D] font-['Playfair_Display',serif]">{horse.name}</h4>
                          <span className="text-xs text-[#8B4513] font-semibold">{horse.title}</span>
                        </div>

                        {/* Color Preview Swatch */}
                        <div
                          className="w-7 h-7 rounded-full border-2 border-[#D4AF37] shadow-xs flex items-center justify-center text-xs font-bold text-[#2D2D2D]"
                          style={{ backgroundColor: horse.colorPrimary }}
                        >
                          ❖
                        </div>
                      </div>

                      <p className="text-xs text-[#2D2D2D]/80 mt-1.5 leading-relaxed">
                        {horse.description}
                      </p>

                      {/* Horse Attributes Badges */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="px-2 py-0.5 bg-[#8B4513]/10 border border-[#8B4513]/20 rounded text-[10px] font-bold text-[#8B4513]">
                          ⚡ Скорость x{horse.baseSpeed.toFixed(2)}
                        </span>
                        <span className="px-2 py-0.5 bg-[#8B4513]/10 border border-[#8B4513]/20 rounded text-[10px] font-bold text-[#8B4513]">
                          ⬆ Прыжок x{horse.baseJumpHeight.toFixed(2)}
                        </span>
                        <span className="px-2 py-0.5 bg-[#8B4513]/10 border border-[#8B4513]/20 rounded text-[10px] font-bold text-[#8B4513]">
                          ❤ Энергия {horse.baseStamina}
                        </span>
                      </div>

                      <div className="mt-2 py-1 px-2.5 bg-[#F5F5F0] rounded-lg text-[11px] text-[#8B4513] font-semibold border border-[#D4AF37]/40 shadow-2xs">
                        ❖ {horse.specialTrait}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#2D2D2D]/15 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#2D2D2D]/70">
                        {isUnlocked ? 'Доступен' : `Стоимость: ❖ ${horse.costTokens}`}
                      </span>

                      <button
                        onClick={() => handleHorseAction(horse.id, horse.costTokens)}
                        disabled={!isUnlocked && profile.tokens < horse.costTokens}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          isEquipped
                            ? 'bg-[#2D2D2D] text-[#FDF6E3] cursor-default'
                            : isUnlocked
                            ? 'bg-[#8B4513] hover:brightness-110 text-[#FDF6E3]'
                            : profile.tokens >= horse.costTokens
                            ? 'bg-[#8B4513] hover:brightness-110 text-[#FDF6E3]'
                            : 'bg-[#2D2D2D]/10 text-[#2D2D2D]/40 cursor-not-allowed'
                        }`}
                      >
                        {isEquipped ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{getTranslation('equipped', lang)}</span>
                          </>
                        ) : isUnlocked ? (
                          <span>{getTranslation('equip', lang)}</span>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>{getTranslation('unlock', lang)}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
