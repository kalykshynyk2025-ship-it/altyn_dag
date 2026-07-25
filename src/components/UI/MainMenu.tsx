import React from 'react';
import { Play, BookOpen, Shield, Settings, FileText, Sparkles, Box, Globe, Scroll, Feather } from 'lucide-react';
import { PlayerProfile } from '../../types/game';
import { STORY_CHAPTERS, getLocalizedChapter } from '../../narrative/storyData';
import { getTranslation, Language } from '../../utils/translations';
import { CreditsCard } from './CreditsCard';

interface MainMenuProps {
  profile: PlayerProfile;
  onStartRun: () => void;
  onOpenStoryLore: () => void;
  onOpenUpgrades: () => void;
  onOpenGDD: () => void;
  onOpenSettings: () => void;
  onOpenGuide: () => void;
  onSelectChapter: (chapterId: number) => void;
  onUpdateProfile: (profile: PlayerProfile) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  profile,
  onStartRun,
  onOpenStoryLore,
  onOpenUpgrades,
  onOpenSettings,
  onOpenGuide,
  onSelectChapter,
  onUpdateProfile
}) => {
  const lang: Language = profile.settings.language || 'RU';
  const currentChapter = getLocalizedChapter(profile.currentChapter, lang);

  // Maximum unlocked chapter is based on highest completed chapter
  const maxUnlockedChapter = Math.max(
    1,
    ...(profile.completedChapters || []).map(id => id + 1),
    profile.currentChapter
  );

  const handleLanguageChange = (newLang: Language) => {
    onUpdateProfile({
      ...profile,
      settings: {
        ...profile.settings,
        language: newLang
      }
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-2 sm:p-4 bg-[#FDF6E3] text-[#2D2D2D] overflow-y-auto font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Decorative Golden Border */}
      <div className="absolute inset-1.5 sm:inset-2 border-2 border-[#D4AF37]/30 rounded-2xl sm:rounded-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 flex justify-between items-center w-full max-w-xl mx-auto border-b border-[#2D2D2D]/15 pb-1.5 sm:pb-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#8B4513] font-bold text-xs sm:text-base shadow-xs">
            ❖
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-extrabold text-[#2D2D2D] font-['Playfair_Display',serif] leading-tight">{profile.name}</h2>
            <p className="text-[10px] sm:text-[11px] text-[#8B4513] font-medium leading-tight">{getTranslation('heroRole', lang)}</p>
          </div>
        </div>

        {/* Currency & Language Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1 bg-[#F5F5F0] border border-[#D4AF37]/60 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs shadow-xs">
            <span className="text-[#8B732A] font-extrabold">❖ {profile.tokens}</span>
          </div>

          {/* Quick Language Toggle */}
          <div className="flex items-center bg-[#F5F5F0] border border-[#2D2D2D]/20 p-0.5 rounded-full text-[9px] sm:text-[10px] font-bold">
            {(['RU', 'TYV', 'EN'] as Language[]).map(l => (
              <button
                key={l}
                onClick={() => handleLanguageChange(l)}
                className={`px-1 sm:px-1.5 py-0.5 rounded-full transition-all ${
                  lang === l
                    ? 'bg-[#8B4513] text-[#FDF6E3]'
                    : 'text-[#2D2D2D]/70 hover:text-[#2D2D2D]'
                }`}
              >
                {l === 'TYV' ? 'ТЫВА' : l}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenSettings}
            className="p-1 sm:p-1.5 bg-[#F5F5F0] hover:bg-[#EAEAE0] rounded-full border border-[#2D2D2D]/20 transition-colors"
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2D2D2D]" />
          </button>
        </div>
      </div>

      {/* Main Branding & Hero Graphic */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto py-1 sm:py-2 max-w-md mx-auto w-full min-h-0 flex-1 justify-center">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/50 text-[#8B4513] text-[10px] sm:text-xs font-bold">
            <Sparkles className="w-3 h-3" />
            <span>{getTranslation('tagline', lang)}</span>
          </div>
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#2D2D2D] text-[#FDF6E3] text-[8px] sm:text-[9px] font-black tracking-widest uppercase">
            <Box className="w-2.5 h-2.5 text-[#D4AF37]" />
            <span>3D Engine</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-[#2D2D2D] font-['Cinzel',serif] tracking-tight drop-shadow-xs leading-none">
          {getTranslation('appTitle', lang)}
        </h1>
        <p className="text-[10px] sm:text-xs text-[#8B4513] font-serif italic font-semibold mt-0.5">
          {getTranslation('appSubtitle', lang)}
        </p>

        {/* Creator & Developer Credits Card */}
        <CreditsCard compact lang={lang} />

        {/* Storyteller Quote Card ("Слово Сказителя") */}
        <div className="w-full bg-[#F5F5F0] border-l-4 border-l-[#8B4513] border border-[#2D2D2D]/10 rounded-xl p-2 sm:p-2.5 my-1.5 text-left shadow-xs">
          <div className="text-[9px] sm:text-[10px] font-bold text-[#8B4513] uppercase tracking-wider mb-0.5">
            {getTranslation('wordOfStoryteller', lang)}
          </div>
          <p className="text-[11px] sm:text-xs italic text-[#2D2D2D] font-serif leading-tight sm:leading-snug">
            {getTranslation('storyQuote', lang)}
          </p>
        </div>

        {/* Story Chapter Preview Card */}
        <div className="w-full bg-[#F5F5F0] border border-[#D4AF37]/50 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-xs text-left my-1">
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#8B4513]">
              {getTranslation('currentStory', lang)}
            </span>
            <span className="text-[10px] sm:text-xs text-[#2D2D2D]/60 font-mono">
              {getTranslation('chapter', lang)} {currentChapter.id} {getTranslation('of7', lang)}
            </span>
          </div>
          <h3 className="text-xs sm:text-base font-bold text-[#2D2D2D] font-['Playfair_Display',serif]">{currentChapter.title}</h3>
          <p className="text-[10px] sm:text-xs text-[#2D2D2D]/80 mt-0.5 leading-tight sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
            {currentChapter.summary}
          </p>

          {/* Chapter Selector Buttons */}
          <div className="flex gap-1 mt-1.5 overflow-x-auto pb-0.5">
            {STORY_CHAPTERS.map(ch => {
              const isCurrent = ch.id === profile.currentChapter;
              const isUnlocked = ch.id <= maxUnlockedChapter;
              return (
                <button
                  key={ch.id}
                  onClick={() => isUnlocked && onSelectChapter(ch.id)}
                  disabled={!isUnlocked}
                  className={`px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${
                    isCurrent
                      ? 'bg-[#8B4513] text-[#FDF6E3] border border-[#D4AF37] shadow-xs'
                      : isUnlocked
                      ? 'bg-[#EAEAE0] text-[#2D2D2D] border border-[#2D2D2D]/20 hover:bg-[#D1D1CB]'
                      : 'bg-[#2D2D2D]/10 text-[#2D2D2D]/40 border border-[#2D2D2D]/10 cursor-not-allowed'
                  }`}
                >
                  {getTranslation('chapter', lang)} {ch.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Game & Guide Buttons */}
        <div className="flex gap-2 w-full my-1.5">
          <button
            onClick={onOpenGuide}
            className="px-3.5 py-2.5 sm:py-3.5 bg-[#F5F5F0] hover:bg-[#EAEAE0] text-[#8B4513] font-extrabold text-xs sm:text-sm rounded-xl sm:rounded-2xl border-2 border-[#D4AF37] flex items-center justify-center gap-1.5 shadow-sm transition-all"
            title="Инструкция"
          >
            <BookOpen className="w-4 h-4 text-[#8B4513]" />
            <span className="hidden sm:inline">Инструкция</span>
          </button>

          <button
            onClick={onStartRun}
            className="flex-1 py-2.5 sm:py-3.5 bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#8B4513] hover:brightness-110 text-[#FDF6E3] font-black text-xs sm:text-base tracking-wider rounded-xl sm:rounded-2xl shadow-md border-2 border-[#D4AF37] flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-[#FDF6E3]" />
            <span>{getTranslation('startRun', lang)}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Footer */}
      <div className="relative z-10 grid grid-cols-3 gap-1.5 max-w-md mx-auto w-full pt-1.5 border-t border-[#2D2D2D]/15">
        <button
          onClick={onOpenStoryLore}
          className="flex flex-col items-center justify-center p-1.5 sm:p-2 bg-[#F5F5F0] hover:bg-[#EAEAE0] rounded-xl border border-[#2D2D2D]/15 text-[#2D2D2D] transition-all hover:border-[#8B4513]"
        >
          <Feather className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8B4513] mb-0.5" />
          <span className="text-[9px] sm:text-[10px] font-bold">{getTranslation('navLore', lang)}</span>
        </button>

        <button
          onClick={onOpenUpgrades}
          className="flex flex-col items-center justify-center p-1.5 sm:p-2 bg-[#F5F5F0] hover:bg-[#EAEAE0] rounded-xl border border-[#2D2D2D]/15 text-[#2D2D2D] transition-all hover:border-[#8B4513]"
        >
          <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8B4513] mb-0.5" />
          <span className="text-[9px] sm:text-[10px] font-bold">{getTranslation('navStable', lang)}</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center justify-center p-1.5 sm:p-2 bg-[#F5F5F0] hover:bg-[#EAEAE0] rounded-xl border border-[#2D2D2D]/15 text-[#2D2D2D] transition-all hover:border-[#8B4513]"
        >
          <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2D2D2D] mb-0.5" />
          <span className="text-[9px] sm:text-[10px] font-bold">{getTranslation('navSettings', lang)}</span>
        </button>
      </div>
    </div>
  );
};

