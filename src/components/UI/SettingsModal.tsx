import React from 'react';
import { ArrowLeft, Volume2, VolumeX, Smartphone, RefreshCw, Globe, X } from 'lucide-react';
import { PlayerProfile } from '../../types/game';
import { getTranslation, Language } from '../../utils/translations';

interface SettingsModalProps {
  profile: PlayerProfile;
  onUpdateProfile: (profile: PlayerProfile) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  profile,
  onUpdateProfile,
  onResetProgress,
  onClose
}) => {
  const lang: Language = profile.settings.language || 'RU';

  const toggleMute = () => {
    const isMuted = profile.settings.soundVolume > 0;
    onUpdateProfile({
      ...profile,
      settings: {
        ...profile.settings,
        soundVolume: isMuted ? 0 : 0.8,
        musicVolume: isMuted ? 0 : 0.6
      }
    });
  };

  const setLanguage = (newLang: Language) => {
    onUpdateProfile({
      ...profile,
      settings: {
        ...profile.settings,
        language: newLang
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-lg max-h-[92vh] flex flex-col bg-[#FDF6E3] border-2 border-[#D4AF37] rounded-2xl shadow-2xl overflow-hidden text-[#2D2D2D]">
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
            {getTranslation('settingsTitle', lang)}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-[#2D2D2D]/10 text-[#2D2D2D] hover:bg-[#2D2D2D]/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
          {/* Language Picker Section */}
          <div className="bg-[#F5F5F0] border border-[#D4AF37]/50 rounded-2xl p-4 shadow-xs">
            <h3 className="text-xs font-bold text-[#8B4513] uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#8B4513]" />
              <span>{getTranslation('languageSelect', lang)}</span>
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'RU', name: 'Русский', flag: '🇷🇺' },
                { code: 'TYV', name: 'Тыва дыл', flag: '📐' },
                { code: 'EN', name: 'English', flag: '🇬🇧' }
              ].map((l) => {
                const isSelected = lang === l.code;
                return (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code as Language)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition-all ${
                      isSelected
                        ? 'bg-[#8B4513] text-[#FDF6E3] border-[#8B4513] shadow-xs scale-105'
                        : 'bg-[#FDF6E3] text-[#2D2D2D] border-[#2D2D2D]/20 hover:bg-[#EAEAE0]'
                    }`}
                  >
                    <span className="text-base">{l.flag}</span>
                    <span className="text-[11px] font-extrabold">{l.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audio Controls */}
          <div className="bg-[#F5F5F0] border border-[#D4AF37]/50 rounded-2xl p-4 shadow-xs">
            <h3 className="text-xs font-bold text-[#8B4513] uppercase tracking-widest mb-3">
              {getTranslation('soundTitle', lang)}
            </h3>

            <div className="flex items-center justify-between py-1">
              <span className="text-xs sm:text-sm font-bold text-[#2D2D2D]">{getTranslation('soundEffects', lang)}</span>
              <button
                onClick={toggleMute}
                className={`p-2 rounded-xl border flex items-center gap-1.5 font-bold text-xs transition-all ${
                  profile.settings.soundVolume > 0
                    ? 'bg-[#8B4513] text-[#FDF6E3] border-[#8B4513] shadow-xs'
                    : 'bg-[#2D2D2D]/10 text-[#2D2D2D]/60 border-[#2D2D2D]/20'
                }`}
              >
                {profile.settings.soundVolume > 0 ? (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>{getTranslation('soundOn', lang)}</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>{getTranslation('soundOff', lang)}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* PWA Mobile Installation Guide */}
          <div className="bg-[#F5F5F0] border border-[#D4AF37]/50 rounded-2xl p-4 shadow-xs">
            <h3 className="text-xs font-bold text-[#8B4513] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" />
              <span>PWA {getTranslation('installGuide', lang)}</span>
            </h3>
            <p className="text-xs text-[#2D2D2D]/85 leading-relaxed">
              Вы можете добавить «Алтын Даг» на домашний экран вашего смартфона (iOS Safari / Android Chrome) для автономной игры на весь экран!
            </p>
          </div>

          {/* Danger Zone / Reset Progress */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-red-700 uppercase tracking-widest mb-1">
              {getTranslation('resetProgress', lang)}
            </h3>
            <p className="text-xs text-[#2D2D2D]/80 mb-3">
              Сбросит все собранные жетоны, открытых коней и прогресс сюжетных глав.
            </p>
            <button
              onClick={() => {
                if (confirm('Вы уверены, что хотите сбросить весь прогресс игры?')) {
                  onResetProgress();
                }
              }}
              className="w-full py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{getTranslation('resetProgress', lang)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
