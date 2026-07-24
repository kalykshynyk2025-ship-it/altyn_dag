import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { GAME_TITLE_ALTERNATIVES } from '../../narrative/storyData';

interface GDDModalProps {
  onClose: () => void;
}

export const GDDModal: React.FC<GDDModalProps> = ({ onClose }) => {
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
            <span>Назад</span>
          </button>
          <h2 className="text-sm sm:text-base font-black text-[#2D2D2D] font-['Playfair_Display',serif] text-center">
            GDD & Архитектура Игры
          </h2>
          <div className="w-8" />
        </div>

        {/* Main Document Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-[#2D2D2D] leading-relaxed">
          {/* ЧАСТЬ 1 */}
          <div className="space-y-3 bg-[#F5F5F0] p-4 rounded-xl border border-[#D4AF37]/40">
            <h3 className="text-lg sm:text-xl font-black text-[#8B4513] border-b border-[#D4AF37]/30 pb-1.5 font-['Playfair_Display',serif]">
              ЧАСТЬ 1 — GAME DESIGN DOCUMENT (GDD)
            </h3>

            <div>
              <h4 className="text-xs font-bold text-[#8B4513] uppercase tracking-widest mt-2">1. НАЗВАНИЕ И АЛЬТЕРНАТИВЫ</h4>
              <p className="text-xs text-[#2D2D2D] mt-1">
                Основное название: <strong>«Алтын Даг» / «Золотая степь»</strong>.
              </p>
              <ul className="list-disc pl-5 text-xs text-[#2D2D2D]/90 space-y-1 mt-1.5">
                {GAME_TITLE_ALTERNATIVES.map((alt, i) => (
                  <li key={i}>
                    <strong>{alt.ru} ({alt.tuvan}):</strong> {alt.desc}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#8B4513] uppercase tracking-widest mt-3">2. ЖАНР И УНИКАЛЬНОЕ ТОРГОВОЕ ПРЕДЛОЖЕНИЕ (УТП)</h4>
              <p className="text-xs text-[#2D2D2D]/90 leading-relaxed mt-1">
                Мобильный 2.5D endless runner с богатырским сюжетом, стрельбой из лука, верным конем, сменой биомов и культурно-историческим сборником сказаний «Память сказителя».
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#8B4513] uppercase tracking-widest mt-3">3. ИГРОВОЙ ЦИКЛ (CORE LOOP)</h4>
              <p className="text-xs text-[#2D2D2D]/90 mt-1">
                Забег по 3 дорожкам → Уклонение от барьеров & Стрельба из лука → Сбор золотых орнаментальных жетонов и фрагментов эпоса → Улучшение богатыря и коня → Прохождение сюжетной главы.
              </p>
            </div>
          </div>

          {/* ЧАСТЬ 2 */}
          <div className="space-y-3 bg-[#F5F5F0] p-4 rounded-xl border border-[#D4AF37]/40">
            <h3 className="text-lg sm:text-xl font-black text-[#8B4513] border-b border-[#D4AF37]/30 pb-1.5 font-['Playfair_Display',serif]">
              ЧАСТЬ 2 — ART DIRECTION & ВИЗУАЛЬНЫЙ СТИЛЬ
            </h3>

            <p className="text-xs text-[#2D2D2D]/90 leading-relaxed">
              Стилизованная 2.5D векторно-процедурная графика на Canvas HTML5. Атмосфера передает естественную красоту тувинских степей, Саянских гор, войлочных юрт и национального орнамента.
            </p>

            <div className="bg-[#FDF6E3] p-3 rounded-xl border border-[#D4AF37]/50 mt-2">
              <h4 className="text-[11px] font-bold text-[#8B4513] uppercase tracking-wider mb-2">Цветовая Палитра</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                <div className="p-2 rounded-lg bg-[#D97706] text-white font-bold shadow-xs">Охра & Золото</div>
                <div className="p-2 rounded-lg bg-[#0284C7] text-white font-bold shadow-xs">Небесный Синий</div>
                <div className="p-2 rounded-lg bg-[#475569] text-white font-bold shadow-xs">Горный Сланец</div>
                <div className="p-2 rounded-lg bg-[#B91C1C] text-white font-bold shadow-xs">Этнический Красный</div>
              </div>
            </div>
          </div>

          {/* ЧАСТЬ 3 */}
          <div className="space-y-2 bg-[#F5F5F0] p-4 rounded-xl border border-[#D4AF37]/40">
            <h3 className="text-lg sm:text-xl font-black text-[#8B4513] border-b border-[#D4AF37]/30 pb-1.5 font-['Playfair_Display',serif]">
              ЧАСТЬ 3 — UX/UI СТРУКТУРА & WIREFRAMES
            </h3>

            <p className="text-xs text-[#2D2D2D]/90 leading-relaxed">
              Одноручное портретное управление для смартфонов: свайп влево/вправо (смена полосы), свайп вверх (прыжок), свайп вниз (скольжение), круглая кнопка выстрела из лука.
            </p>
          </div>

          {/* ЧАСТЬ 4 */}
          <div className="space-y-2 bg-[#F5F5F0] p-4 rounded-xl border border-[#D4AF37]/40">
            <h3 className="text-lg sm:text-xl font-black text-[#8B4513] border-b border-[#D4AF37]/30 pb-1.5 font-['Playfair_Display',serif]">
              ЧАСТЬ 4 — ТЕХНИЧЕСКАЯ АРХИТЕКТУРА & МОДУЛИ
            </h3>

            <ul className="list-disc pl-5 text-xs text-[#2D2D2D]/90 space-y-1.5">
              <li><strong>GameEngine:</strong> Главный цикличный контроллер физики, коллизий, ускорения и генератора.</li>
              <li><strong>CanvasRenderer:</strong> Высокопроизводительный 2.5D перспективный Canvas-движок.</li>
              <li><strong>AudioManager:</strong> Синтезатор этнического звучания на основе Web Audio API.</li>
              <li><strong>SaveManager:</strong> Локальное хранилище прогресса игроков в LocalStorage.</li>
            </ul>
          </div>

          {/* ЧАСТЬ 5 */}
          <div className="space-y-2 bg-[#F5F5F0] p-4 rounded-xl border border-[#D4AF37]/40">
            <h3 className="text-lg sm:text-xl font-black text-[#8B4513] border-b border-[#D4AF37]/30 pb-1.5 font-['Playfair_Display',serif]">
              ЧАСТЬ 5 — NARRATIVE DESIGN & 7 ГЛАВ
            </h3>

            <p className="text-xs text-[#2D2D2D]/90 leading-relaxed">
              Оригинальный сюжет вдохновлен мотивами эпосов «Танаа-Херел», «Алдай-Буучу», «Кангывай-Мерген» и символизирует путь богатыря за невестой, защитой родных аалов и возвращением мира.
            </p>
          </div>

          {/* ЧАСТЬ 6 */}
          <div className="space-y-2 bg-[#F5F5F0] p-4 rounded-xl border border-[#D4AF37]/40">
            <h3 className="text-lg sm:text-xl font-black text-[#8B4513] border-b border-[#D4AF37]/30 pb-1.5 font-['Playfair_Display',serif]">
              ЧАСТЬ 6 — MVP IMPLEMENTATION PLAN & PWA
            </h3>

            <p className="text-xs text-[#2D2D2D]/90 leading-relaxed">
              MVP включает 3 полосы, свайпы, прыжки, скольжение, лук, 6 power-up, 2 биома (степь и священные горы), сказителя, сохранение и PWA манифест для установки на рабочий стол мобильного.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

