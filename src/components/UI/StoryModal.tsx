import React, { useState } from 'react';
import { ChevronRight, Play } from 'lucide-react';
import { getLocalizedChapter } from '../../narrative/storyData';
import { getTranslation, Language } from '../../utils/translations';

interface StoryModalProps {
  chapterId: number;
  lang?: Language;
  onConfirmStart: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ chapterId, lang = 'RU', onConfirmStart }) => {
  const activeLang: Language = (lang as Language) || 'RU';
  const chapter = getLocalizedChapter(chapterId, activeLang);
  const [lineIdx, setLineIdx] = useState(0);

  const handleNextLine = () => {
    if (lineIdx < chapter.storytellerLines.length - 1) {
      setLineIdx(lineIdx + 1);
    } else {
      onConfirmStart();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto bg-[#FDF6E3] border-2 border-[#D4AF37] rounded-2xl p-4 sm:p-5 text-[#2D2D2D] shadow-2xl flex flex-col justify-between">
        {/* Storyteller Avatar Header */}
        <div className="flex items-center gap-3 border-b border-[#D4AF37]/50 pb-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center text-[#8B4513] font-black text-lg sm:text-xl shadow-xs">
            ❖
          </div>
          <div>
            <h3 className="text-[#8B4513] font-bold text-xs uppercase tracking-widest">
              {getTranslation('wordOfStoryteller', activeLang)}
            </h3>
            <p className="text-[#2D2D2D] font-bold text-sm sm:text-base font-['Playfair_Display',serif]">{chapter.title}</p>
          </div>
        </div>

        {/* Poetic Lines Display */}
        <div className="my-4 sm:my-6 py-4 px-4 sm:px-5 bg-[#F5F5F0] rounded-2xl border border-[#D4AF37]/40 text-center min-h-[120px] flex flex-col items-center justify-center">
          <p className="text-[#8B4513] text-base sm:text-lg font-['Playfair_Display',serif] italic leading-relaxed">
            «{chapter.storytellerLines[lineIdx]}»
          </p>
        </div>

        {/* Progress Indicator Dots */}
        <div className="flex justify-center gap-1.5 mb-4">
          {chapter.storytellerLines.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === lineIdx ? 'w-6 bg-[#8B4513]' : 'w-2 bg-[#2D2D2D]/20'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNextLine}
          className="w-full py-3 bg-[#8B4513] hover:brightness-110 text-[#FDF6E3] font-black tracking-wider rounded-xl shadow-md border border-[#D4AF37] flex items-center justify-center gap-2 transition-all active:scale-95 text-xs sm:text-sm"
        >
          {lineIdx < chapter.storytellerLines.length - 1 ? (
            <>
              <span>{getTranslation('listenNext', activeLang)}</span>
              <ChevronRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>{getTranslation('startBattle', activeLang)}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
