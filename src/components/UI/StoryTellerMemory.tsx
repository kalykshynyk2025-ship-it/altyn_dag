import React, { useState } from 'react';
import { Feather, Lock, ArrowLeft, CheckCircle, Sparkles, HelpCircle, Scroll } from 'lucide-react';
import { PlayerProfile } from '../../types/game';
import { LORE_FRAGMENTS } from '../../narrative/storyData';
import { Language } from '../../utils/translations';

interface StoryTellerMemoryProps {
  profile: PlayerProfile;
  onClose: () => void;
}

export const StoryTellerMemory: React.FC<StoryTellerMemoryProps> = ({ profile, onClose }) => {
  const [selectedFragmentId, setSelectedFragmentId] = useState<string>(LORE_FRAGMENTS[0].id);
  const lang: Language = profile.settings.language || 'RU';

  const selectedFragment = LORE_FRAGMENTS.find(f => f.id === selectedFragmentId) || LORE_FRAGMENTS[0];
  const isUnlocked = profile.unlockedLoreIds.includes(selectedFragment.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] flex flex-col bg-[#FDF6E3] border-2 border-[#D4AF37] rounded-2xl shadow-2xl overflow-hidden text-[#2D2D2D]">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-[#D4AF37]/50 bg-[#F5F5F0]">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-[#8B4513] font-bold text-xs sm:text-sm hover:underline"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{lang === 'TYV' ? 'Дедир' : lang === 'EN' ? 'Back' : 'Назад'}</span>
          </button>
          <div className="flex items-center gap-2">
            <Feather className="w-5 h-5 text-[#8B4513]" />
            <h2 className="text-sm sm:text-base font-black text-[#2D2D2D] font-['Playfair_Display',serif]">
              {lang === 'TYV' ? 'Ыраажының Сактыышкыны' : lang === 'EN' ? 'Storyteller Memory' : 'Память Сказителя'}
            </h2>
          </div>
          <div className="w-8" />
        </div>

        {/* Chapter Unlock Rules Banner */}
        <div className="bg-[#8B4513]/10 border-b border-[#D4AF37]/40 px-3 py-2 sm:px-5 sm:py-2.5 flex items-start gap-2 text-xs">
          <HelpCircle className="w-4 h-4 text-[#8B4513] shrink-0 mt-0.5" />
          <div className="text-[11px] sm:text-xs text-[#2D2D2D] font-medium leading-tight">
            <strong className="font-extrabold text-[#8B4513] block sm:inline mr-1">
              {lang === 'TYV' ? 'Эгелерни канчаар ажыдары?' : lang === 'EN' ? 'How to unlock Chapters 1 to 7?' : 'Как открываются Главы с 1 по 7?'}
            </strong>
            {lang === 'TYV'
              ? 'Чаа эгелерни (1-ден 7-ге чедир) ажыдарынга чашпакка берилген дистанцияны эртип алыңар. Удур эгелер ажытынып каар!'
              : lang === 'EN'
              ? 'Complete the required distance in the current chapter to automatically unlock the next Chapter (Chapters I – VII).'
              : 'Чтобы открыть новую главу (с 1 по 7), необходимо преодолеть дистанцию забега в текущей главе. Пройденные главы всегда доступны для повторного прохождения!'}
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-3 sm:p-5 gap-3">
          {/* Fragment Selector List */}
          <div className="w-full md:w-80 flex flex-col gap-2 overflow-y-auto pr-1">
            <h3 className="text-xs font-bold text-[#8B4513] uppercase tracking-widest mb-1 flex items-center justify-between">
              <span>{lang === 'TYV' ? 'Тоолдар чыындызы' : lang === 'EN' ? 'Lore Collection' : 'Коллекция сказаний'}</span>
              <span className="font-mono text-[11px] text-[#2D2D2D]/70">
                ({profile.unlockedLoreIds.length} / {LORE_FRAGMENTS.length})
              </span>
            </h3>

            {LORE_FRAGMENTS.map(fragment => {
              const unlocked = profile.unlockedLoreIds.includes(fragment.id);
              const isSelected = fragment.id === selectedFragmentId;

              return (
                <button
                  key={fragment.id}
                  onClick={() => setSelectedFragmentId(fragment.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#8B4513] border-[#D4AF37] text-[#FDF6E3] shadow-md scale-[1.01]'
                      : unlocked
                      ? 'bg-[#F5F5F0] border-[#D4AF37]/40 text-[#2D2D2D] hover:bg-[#EAEAE0]'
                      : 'bg-[#2D2D2D]/5 border-[#2D2D2D]/10 text-[#2D2D2D]/50 opacity-70'
                  }`}
                >
                  <div className="mt-0.5">
                    {unlocked ? (
                      <Scroll className="w-4 h-4 text-[#D4AF37]" />
                    ) : (
                      <Lock className="w-4 h-4 text-[#2D2D2D]/40" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold leading-snug">
                      {unlocked ? fragment.title : (lang === 'TYV' ? 'Дуглаан бижик' : lang === 'EN' ? 'Locked Fragment' : 'Заблокированная запись')}
                    </span>
                    <span className="text-[10px] opacity-80 mt-1 font-semibold">
                      {lang === 'TYV' ? 'Эге' : lang === 'EN' ? 'Chapter' : 'Глава'} {fragment.chapterId} {lang === 'TYV' ? '7-ден' : lang === 'EN' ? 'of 7' : 'из 7'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Content Details Reader */}
          <div className="flex-1 bg-[#F5F5F0] border border-[#D4AF37]/50 rounded-2xl p-4 sm:p-6 overflow-y-auto flex flex-col justify-between">
            {isUnlocked ? (
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B4513]/10 border border-[#8B4513]/30 text-[#8B4513] text-xs font-bold mb-3">
                  <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{lang === 'TYV' ? 'Бижик ажытытты' : lang === 'EN' ? 'Fragment Unlocked' : 'Запись в сказаниях открыта'}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-[#8B4513] font-['Playfair_Display',serif] mb-3">
                  {selectedFragment.title}
                </h2>

                <p className="text-[#2D2D2D] text-sm sm:text-base leading-relaxed mb-5 font-serif">
                  {selectedFragment.content}
                </p>

                <div className="bg-[#FDF6E3] border border-[#D4AF37]/40 p-3.5 sm:p-4 rounded-xl shadow-xs">
                  <h4 className="text-xs font-bold text-[#8B4513] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{lang === 'TYV' ? 'Культура дугайында' : lang === 'EN' ? 'Cultural & Historical Insight' : 'Культурно-историческая справка'}</span>
                  </h4>
                  <p className="text-[#2D2D2D]/90 text-xs sm:text-sm leading-relaxed">
                    {selectedFragment.culturalNote}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center my-auto py-12">
                <Lock className="w-12 h-12 text-[#8B4513]/40 mb-3" />
                <h3 className="text-base sm:text-lg font-bold text-[#8B4513]">
                  {lang === 'TYV' ? 'Бижик дугланган' : lang === 'EN' ? 'Fragment Locked' : 'Фрагмент не открыт'}
                </h3>
                <p className="text-xs text-[#2D2D2D]/70 max-w-xs mt-1">
                  {lang === 'TYV'
                    ? 'Эгелерни эртип чыткаш, оруктан свитками чыып алыңар!'
                    : lang === 'EN'
                    ? 'Complete running distance in Chapters 1–7 to collect story scrolls and reveal this legend!'
                    : 'Проходите главы с 1 по 7 и добегайте до нужной дистанции, чтобы открыть эту запись сказителя!'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
