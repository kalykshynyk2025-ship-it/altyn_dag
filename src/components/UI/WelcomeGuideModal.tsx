import React, { useState } from 'react';
import { Globe, ArrowLeft, Shield, Sparkles, Check, Play, Award } from 'lucide-react';
import { PlayerProfile } from '../../types/game';
import { Language } from '../../utils/translations';

interface WelcomeGuideModalProps {
  profile: PlayerProfile;
  onUpdateProfile: (profile: PlayerProfile) => void;
  onClose: () => void;
}

export const WelcomeGuideModal: React.FC<WelcomeGuideModalProps> = ({
  profile,
  onUpdateProfile,
  onClose
}) => {
  const [step, setStep] = useState<'LANG' | 'GUIDE'>('LANG');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const lang: Language = profile.settings.language || 'RU';

  const selectLanguage = (newLang: Language) => {
    setIsTransitioning(true);
    setTimeout(() => {
      onUpdateProfile({
        ...profile,
        settings: {
          ...profile.settings,
          language: newLang,
          showTutorial: false
        }
      });
      setStep('GUIDE');
      setIsTransitioning(false);
    }, 180);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md font-['Plus_Jakarta_Sans',sans-serif]">
      <div
        className={`bg-[#FDF6E3] border-2 border-[#D4AF37] rounded-3xl p-4 sm:p-6 w-full max-w-xl text-[#2D2D2D] shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col justify-between transition-all duration-200 ${
          isTransitioning ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {step === 'LANG' ? (
          <div>
            {/* Language Selection Step */}
            <div className="text-center border-b border-[#D4AF37]/50 pb-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] mx-auto flex items-center justify-center text-[#8B4513] mb-2 shadow-xs">
                <Globe className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#8B4513] font-['Playfair_Display',serif]">
                {lang === 'TYV' ? 'СКАЗАНИЕ ДЫЛЫН ШИЛИП АЛЫҢАР' : lang === 'EN' ? 'SELECT EPIC LANGUAGE' : 'ВЫБОР ЯЗЫКА СКАЗАНИЯ'}
              </h2>
              <p className="text-xs text-[#2D2D2D]/70 font-semibold mt-1">
                {lang === 'TYV' ? 'Тоол, чугаалар биле интерфейске дылды шилиңер' : lang === 'EN' ? 'Choose language for narrative legend and interface' : 'Выберите язык для погружения в легенду и интерфейс'}
              </p>
            </div>

            {/* Language Selection Cards */}
            <div className="grid grid-cols-1 gap-3 my-4">
              <button
                onClick={() => selectLanguage('RU')}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-left active:scale-98 ${
                  lang === 'RU'
                    ? 'bg-[#8B4513] text-[#FDF6E3] border-[#D4AF37] shadow-lg scale-[1.01]'
                    : 'bg-[#F5F5F0] hover:bg-[#EAEAE0] text-[#2D2D2D] border-[#D4AF37]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇷🇺</span>
                  <div>
                    <span className="font-extrabold text-sm block">Русский язык</span>
                    <span className="text-xs opacity-80 block">Полный перевод сказания и инструкций</span>
                  </div>
                </div>
                {lang === 'RU' && <Check className="w-5 h-5 text-[#D4AF37]" />}
              </button>

              <button
                onClick={() => selectLanguage('TYV')}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-left active:scale-98 ${
                  lang === 'TYV'
                    ? 'bg-[#8B4513] text-[#FDF6E3] border-[#D4AF37] shadow-lg scale-[1.01]'
                    : 'bg-[#F5F5F0] hover:bg-[#EAEAE0] text-[#2D2D2D] border-[#D4AF37]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏔️</span>
                  <div>
                    <span className="font-extrabold text-sm block">Тыва дыл (Тувинский)</span>
                    <span className="text-xs opacity-80 block">Төрээн дылывыста маадырлыг тоол</span>
                  </div>
                </div>
                {lang === 'TYV' && <Check className="w-5 h-5 text-[#D4AF37]" />}
              </button>

              <button
                onClick={() => selectLanguage('EN')}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-left active:scale-98 ${
                  lang === 'EN'
                    ? 'bg-[#8B4513] text-[#FDF6E3] border-[#D4AF37] shadow-lg scale-[1.01]'
                    : 'bg-[#F5F5F0] hover:bg-[#EAEAE0] text-[#2D2D2D] border-[#D4AF37]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇬🇧</span>
                  <div>
                    <span className="font-extrabold text-sm block">English Language</span>
                    <span className="text-xs opacity-80 block">Full epic narrative & hero guide</span>
                  </div>
                </div>
                {lang === 'EN' && <Check className="w-5 h-5 text-[#D4AF37]" />}
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Guide Instructions Header */}
            <div className="border-b border-[#D4AF37]/50 pb-2.5 mb-3 flex items-center justify-between">
              <button
                onClick={() => setStep('LANG')}
                className="p-1.5 px-2.5 rounded-xl bg-[#F5F5F0] hover:bg-[#EAEAE0] text-[#8B4513] border border-[#D4AF37]/50 text-xs font-bold flex items-center gap-1 shadow-xs transition-all active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{lang === 'TYV' ? 'Дыл солуыр' : lang === 'EN' ? 'Language' : 'Сменить язык'}</span>
              </button>

              <div className="text-center flex-1">
                <span className="text-[10px] font-extrabold text-[#8B4513] uppercase tracking-widest block">
                  {lang === 'TYV' ? 'МААДЫРГА ПОМОЩЬ' : lang === 'EN' ? 'HERO MANUAL' : 'РУКОВОДСТВО БОГАТЫРЯ'}
                </span>
                <h2 className="text-base sm:text-lg font-black text-[#2D2D2D] font-['Playfair_Display',serif]">
                  {lang === 'TYV' ? 'Ойнаар чурум биле удуртулга' : lang === 'EN' ? 'Game Rules & Controls' : 'Инструкция и Правила игры'}
                </h2>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-3.5 my-2">
              
              {/* 1. Goal & Controls */}
              <div className="bg-[#F5F5F0] p-3 rounded-2xl border border-[#D4AF37]/50">
                <h3 className="font-extrabold text-xs text-[#8B4513] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>{lang === 'TYV' ? 'Управленииге дуза' : lang === 'EN' ? 'Hero Controls' : 'Управление Богатырем'}</span>
                </h3>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#FDF6E3] p-2 rounded-xl border border-[#D4AF37]/30 flex items-center gap-2">
                    <span className="bg-[#8B4513] text-[#FDF6E3] px-1.5 py-0.5 rounded font-mono font-bold text-[10px]">← / A</span>
                    <span className="font-semibold text-[11px]">
                      {lang === 'TYV' ? 'Солга шинир' : lang === 'EN' ? 'Move left' : 'Перемещение влево'}
                    </span>
                  </div>
                  <div className="bg-[#FDF6E3] p-2 rounded-xl border border-[#D4AF37]/30 flex items-center gap-2">
                    <span className="bg-[#8B4513] text-[#FDF6E3] px-1.5 py-0.5 rounded font-mono font-bold text-[10px]">→ / D</span>
                    <span className="font-semibold text-[11px]">
                      {lang === 'TYV' ? 'Оңга шинир' : lang === 'EN' ? 'Move right' : 'Перемещение вправо'}
                    </span>
                  </div>
                  <div className="bg-[#FDF6E3] p-2 rounded-xl border border-[#D4AF37]/30 flex items-center gap-2">
                    <span className="bg-[#8B4513] text-[#FDF6E3] px-1.5 py-0.5 rounded font-mono font-bold text-[10px]">↑ / W</span>
                    <span className="font-semibold text-[11px]">
                      {lang === 'TYV' ? 'Дептер (Прыжок)' : lang === 'EN' ? 'Jump over fences' : 'Прыжок (через заборы)'}
                    </span>
                  </div>
                  <div className="bg-[#FDF6E3] p-2 rounded-xl border border-[#D4AF37]/30 flex items-center gap-2">
                    <span className="bg-[#8B4513] text-[#FDF6E3] px-1.5 py-0.5 rounded font-mono font-bold text-[10px]">↓ / S</span>
                    <span className="font-semibold text-[11px]">
                      {lang === 'TYV' ? 'Чыпшыр (Скольжение)' : lang === 'EN' ? 'Slide under branches' : 'Скольжение (под веткой)'}
                    </span>
                  </div>
                </div>

                <div className="mt-2 bg-[#8B4513]/10 p-2 rounded-xl border border-[#8B4513]/30 flex items-center gap-2 text-xs">
                  <span className="bg-red-700 text-[#FDF6E3] px-2 py-0.5 rounded font-mono font-bold text-[10px]">Space / F</span>
                  <span className="font-bold text-[#8B4513] text-[11px]">
                    {lang === 'TYV' ? 'Жаадан атар (Стрельба из лука по врагам и таш)' : lang === 'EN' ? 'Shoot bow (at enemies & rocks)' : 'Стрельба из богатырского лука (по врагам и камням)'}
                  </span>
                </div>
              </div>

              {/* 2. Obstacles Guide */}
              <div className="bg-[#F5F5F0] p-3 rounded-2xl border border-[#D4AF37]/50">
                <h3 className="font-extrabold text-xs text-[#8B4513] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-red-700" />
                  <span>{lang === 'TYV' ? 'Айыылдар биле ажып эртири' : lang === 'EN' ? 'Obstacles & How to Avoid Them' : 'Препятствия и как их проходить'}</span>
                </h3>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-start gap-2 bg-[#FDF6E3] p-2 rounded-xl">
                    <span className="text-base">🪵</span>
                    <div>
                      <span className="font-bold text-[#2D2D2D] block">
                        {lang === 'TYV' ? 'Үреглээн ыяш / Поваленное дерево' : lang === 'EN' ? 'Fallen Log / Fence' : 'Поваленное дерево / Забор'}
                      </span>
                      <span className="text-[11px] text-[#2D2D2D]/80 block">
                        {lang === 'TYV' ? 'Дептер (Прыжок ↑/W) дузазы-биле ажып эртер' : lang === 'EN' ? 'Jump over using Up Arrow / W' : 'Перепрыгивай с помощью Прыжка (↑ / W)'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-[#FDF6E3] p-2 rounded-xl">
                    <span className="text-base">🌿</span>
                    <div>
                      <span className="font-bold text-[#8B4513] block">
                        {lang === 'TYV' ? 'Суктуу ыяш (3-кү главадан бээр)' : lang === 'EN' ? 'Tree Branch (Chapter 3+)' : 'Дерево с суком (с 3 главы)'}
                      </span>
                      <span className="text-[11px] text-[#8B4513] font-semibold block">
                        {lang === 'TYV' ? 'Чыпшыр скользить (↓ / S) ишти-биле эртип каар!' : lang === 'EN' ? 'Slide UNDERNEATH using Down Arrow / S!' : 'Проскальзывай СНИЗУ с помощью Скольжения (↓ / S)!'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-[#FDF6E3] p-2 rounded-xl">
                    <span className="text-base">🪨</span>
                    <div>
                      <span className="font-bold text-[#2D2D2D] block">
                        {lang === 'TYV' ? 'Неожиданный обвал камней' : lang === 'EN' ? 'Unexpected Rockfall' : 'Неожиданный обвал камней'}
                      </span>
                      <span className="text-[11px] text-[#2D2D2D]/80 block">
                        {lang === 'TYV' ? 'Таш дагдан чууруттунар! Сок-биле чара атар азы өске орукче шинир' : lang === 'EN' ? 'Rocks fall unexpectedly from above! Switch lanes or shoot with bow' : 'Камни падают неожиданно сверху! Объезжай другой полосой или разбивай стрелой из лука'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-[#FDF6E3] p-2 rounded-xl">
                    <span className="text-base">⚔️</span>
                    <div>
                      <span className="font-bold text-red-800 block">
                        {lang === 'TYV' ? 'Дайызын аъттыглар / Вражеские всадники' : lang === 'EN' ? 'Enemy Horse Raiders' : 'Вражеские всадники'}
                      </span>
                      <span className="text-[11px] text-red-700 font-semibold block">
                        {lang === 'TYV' ? 'Жаадан аткаш (Space / F) узуткаар' : lang === 'EN' ? 'Shoot down with bow (Space / F) or bypass' : 'Уничтожай из богатырского лука (Пробел / F) или объезжай'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Collectibles & Upgrades */}
              <div className="bg-[#F5F5F0] p-3 rounded-2xl border border-[#D4AF37]/50">
                <h3 className="font-extrabold text-xs text-[#8B4513] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#8B732A]" />
                  <span>{lang === 'TYV' ? 'Алдын чыыры биле Сайзырадыры' : lang === 'EN' ? 'Tokens & Upgrades' : 'Жетоны, Предметы и Улучшения'}</span>
                </h3>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#FDF6E3] p-2 rounded-xl">
                    <span className="font-bold text-[#8B732A] block">
                      {lang === 'TYV' ? '❖ Алдын Жетоннар' : lang === 'EN' ? '❖ Gold Tokens' : '❖ Алдын Жетоны'}
                    </span>
                    <span className="text-[10px] text-[#2D2D2D]/80">
                      {lang === 'TYV' ? 'Айыылдар артындан чыып ал! Оларга сайзыралдар ажыттынар.' : lang === 'EN' ? 'Collect behind obstacles to buy upgrades!' : 'Собирай сразу за препятствиями для прокачки!'}
                    </span>
                  </div>
                  <div className="bg-[#FDF6E3] p-2 rounded-xl">
                    <span className="font-bold text-red-700 block">
                      {lang === 'TYV' ? '🏹 Соктар хабы' : lang === 'EN' ? '🏹 Quiver of Arrows' : '🏹 Колчан Стрел'}
                    </span>
                    <span className="text-[10px] text-[#2D2D2D]/80">
                      {lang === 'TYV' ? 'Соктар санын +5-ке көбүттер.' : lang === 'EN' ? 'Replenishes bow ammo (+5 arrows).' : 'Пополняет боезапас лука (+5 стрел).'}
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-xs bg-[#FDF6E3] p-2 rounded-xl border border-[#D4AF37]/30">
                  <span className="font-bold text-[#8B4513] block">
                    {lang === 'TYV' ? '🐎 Маадырны биле аъттарны канчаар сайзырадыры?' : lang === 'EN' ? '🐎 How to upgrade hero & horses?' : '🐎 Как прокачивать богатыря и коней?'}
                  </span>
                  <span className="text-[11px] text-[#2D2D2D]/80 block mt-0.5">
                    {lang === 'TYV' 
                      ? 'Кол менюда «Стойло & Вооружение» дег менюже киргеш, жетоннар-биле аъттарны биле жааны прокачкалап ал!' 
                      : lang === 'EN'
                      ? 'Open the "Stables & Armory" tab in the main menu to spend tokens on bow damage, stamina, and legendary steeds!'
                      : 'Переходи во вкладку «Стойло & Вооружение» в главном меню, чтобы за жетоны ❖ увеличивать урон лука, выносливость и покупай легендарных скакунов!'}
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Confirm Button */}
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-[#8B4513] hover:brightness-110 text-[#FDF6E3] font-black tracking-wider rounded-2xl border border-[#D4AF37] shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 mt-3"
            >
              <Play className="w-5 h-5 fill-[#FDF6E3]" />
              <span>
                {lang === 'TYV' ? 'ПОНЯТНО, ЧАШПАК АЛЫР!' : lang === 'EN' ? 'UNDERSTOOD, RIDE FORTH!' : 'ВСЁ ПОНЯТНО, В ПУТЬ!'}
              </span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
