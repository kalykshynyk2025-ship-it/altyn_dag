export type Language = 'RU' | 'TYV' | 'EN';

export const TRANSLATIONS = {
  // Brand & General
  appTitle: {
    RU: 'АЛТЫН ДАГ',
    TYV: 'АЛТЫН ДАГ',
    EN: 'ALTYN DAG'
  },
  appSubtitle: {
    RU: '«Золотая степь — Путь Богатыря»',
    TYV: '«Алтын даг — Маадырның оруу»',
    EN: '«Golden Steppe — Hero’s Path»'
  },
  tagline: {
    RU: 'Эпическое тувинское сказание',
    TYV: 'Тыва улустуң маадырлыг тоолуу',
    EN: 'Epic Tuvan Tale'
  },
  storyQuote: {
    RU: '«И поднялся Степной Ветер, И ударил конь серебряным копытом в священную землю Алтын Дага...»',
    TYV: '«Шынааның соккан хады кээп, Мөңгүн туяк өткүр басып, Алтын Дагның ыдыктыг черге дегди...»',
    EN: '«And the Steppe Wind rose, and the steed struck its silver hoof upon the sacred soil of Altyn Dag...»'
  },
  wordOfStoryteller: {
    RU: '📜 Слово Сказителя',
    TYV: '📜 Ыраажының Сөзү',
    EN: '📜 Words of Storyteller'
  },
  listenNext: {
    RU: 'СЛУШАТЬ ДАЛЕЕ',
    TYV: 'ДАРААЗЫТА ДИҢНЕАР',
    EN: 'CONTINUE LISTENING'
  },
  startBattle: {
    RU: 'В БОЙ ЗА РОДНОЙ ААЛ!',
    TYV: 'ТӨРЭЭН ААЛ ДЕЕШ ЧАШПАК!',
    EN: 'RIDE FOR HOMELAND!'
  },
  heroRole: {
    RU: 'Богатырь кочевого рода',
    TYV: 'Көшпүт сөөктүг маадыр',
    EN: 'Hero of Nomadic Lineage'
  },
  chapter: {
    RU: 'Глава',
    TYV: 'Эге',
    EN: 'Chapter'
  },
  of7: {
    RU: 'из 7',
    TYV: '7-ден',
    EN: 'of 7'
  },
  currentStory: {
    RU: 'Текущий сюжет',
    TYV: 'Амгы чечен',
    EN: 'Current Quest'
  },
  startRun: {
    RU: 'НАЧАТЬ ВСКАЧЬ',
    TYV: 'ЧАШПАК АЛЫР',
    EN: 'START RIDE'
  },
  createdLabel: {
    RU: 'СОЗДАНО',
    TYV: 'БҮДҮРГЕН',
    EN: 'CREATED BY'
  },
  gameDevLabel: {
    RU: 'Разработка игры:',
    TYV: 'Оюнну кылганы:',
    EN: 'Game Development:'
  },

  // Navigation Menu
  navLore: {
    RU: 'Память',
    TYV: 'Байырлал',
    EN: 'Lore'
  },
  navStable: {
    RU: 'Стойло & Вооружение',
    TYV: 'Аът куду & Чепсек',
    EN: 'Stable & Gear'
  },
  navGdd: {
    RU: 'GDD Документ',
    TYV: 'GDD Дептер',
    EN: 'GDD Doc'
  },
  navSettings: {
    RU: 'Настройки',
    TYV: 'Солуштурар',
    EN: 'Settings'
  },
  back: {
    RU: 'Назад',
    TYV: 'Дедир',
    EN: 'Back'
  },

  // HUD & In-Game
  meters: {
    RU: 'м',
    TYV: 'м',
    EN: 'm'
  },
  points: {
    RU: 'очков',
    TYV: 'онаг',
    EN: 'pts'
  },
  shoot: {
    RU: 'Выстрел',
    TYV: 'Атар',
    EN: 'Shoot'
  },
  pause: {
    RU: 'Пауза',
    TYV: 'Доктаар',
    EN: 'Pause'
  },
  controlsHint: {
    RU: '← / A — Лево | → / D — Право | ↑ / W — Прыжок | ↓ / S — Скольжение',
    TYV: '← / A — Сол | → / D — Оң | ↑ / W — Дептер | ↓ / S — Чыпшыр',
    EN: '← / A — Left | → / D — Right | ↑ / W — Jump | ↓ / S — Slide'
  },

  // Settings
  settingsTitle: {
    RU: 'Настройки',
    TYV: 'Солуштурар',
    EN: 'Settings'
  },
  languageSelect: {
    RU: 'Язык интерфейса',
    TYV: 'Дыл солуштурары',
    EN: 'Language'
  },
  soundTitle: {
    RU: 'Звук и Этническая Музыка',
    TYV: 'Үн биле хөгжим',
    EN: 'Sound & Ethnic Music'
  },
  soundEffects: {
    RU: 'Звуковые эффекты и мелодия',
    TYV: 'Үн биле хөгжим эффектизи',
    EN: 'Sound effects & Melody'
  },
  soundLabel: {
    RU: 'Звуковые эффекты и горное пение',
    TYV: 'Үн эффектизи биле ыр',
    EN: 'Sound effects & Throat singing'
  },
  soundOn: {
    RU: 'Включено',
    TYV: 'Кыпсыпкан',
    EN: 'Enabled'
  },
  soundOff: {
    RU: 'Выключено',
    TYV: 'Өчүрген',
    EN: 'Disabled'
  },
  installGuide: {
    RU: 'Установка приложения (PWA)',
    TYV: 'Приложение киирери (PWA)',
    EN: 'Installation Guide (PWA)'
  },
  pwaTitle: {
    RU: 'Установка приложения (PWA)',
    TYV: 'Приложение киирер (PWA)',
    EN: 'Install App (PWA)'
  },
  pwaDesc: {
    RU: 'Вы можете добавить «Алтын Даг» на домашний экран вашего смартфона для игры в полноэкранном режиме!',
    TYV: '«Алтын Даг»-ты телефонунче киирип алгаш, долу экранга ойнап болур силер!',
    EN: 'Add "Altyn Dag" to your phone’s home screen for full-screen offline gameplay!'
  },
  resetProgress: {
    RU: 'Сброс прогресса',
    TYV: 'Прогресс солуштуруру',
    EN: 'Reset Progress'
  },
  resetTitle: {
    RU: 'Сброс прогресса',
    TYV: 'Барык аралаар',
    EN: 'Reset Progress'
  },
  resetDesc: {
    RU: 'Сбросит все собранные жетоны, открытых коней и прогресс сюжетных глав.',
    TYV: 'Дүжүрген алдының, аъттарың биле эгелериңни барык арыглап каар.',
    EN: 'Resets all collected tokens, unlocked steeds, and chapter progress.'
  },
  resetBtn: {
    RU: 'Сбросить данные',
    TYV: 'Дүжүрүп каар',
    EN: 'Reset All Data'
  },

  // Hero & Horse
  heroTitle: {
    RU: 'Богатырь Кан-Мерген',
    TYV: 'Кан-Мерген маадыр',
    EN: 'Hero Kan-Mergen'
  },
  heroLevel: {
    RU: 'Уровень Богатыря',
    TYV: 'Маадырның чадазы',
    EN: 'Hero Level'
  },
  bowMastery: {
    RU: 'Искусство Лука',
    TYV: 'Жаа атар уран-чалзу',
    EN: 'Mastery of the Bow'
  },
  upgrade: {
    RU: 'Улучшить',
    TYV: 'Сайзырадыр',
    EN: 'Upgrade'
  },
  steedsTitle: {
    RU: 'Легендарные Породы Коней',
    TYV: 'Макталдыг аът аймактары',
    EN: 'Legendary Steeds'
  },
  equipped: {
    RU: 'Оседлан',
    TYV: 'Мунган',
    EN: 'Equipped'
  },
  equip: {
    RU: 'Оседлать',
    TYV: 'Мунар',
    EN: 'Equip'
  },
  unlock: {
    RU: 'Открыть',
    TYV: 'Ажар',
    EN: 'Unlock'
  },

  // Game Over
  pathCompleted: {
    RU: 'Путь Завершен',
    TYV: 'Орук Төнгени',
    EN: 'Journey Completed'
  },
  distRun: {
    RU: 'Пройденная дистанция',
    TYV: 'Эрткен хемчээли',
    EN: 'Distance Traveled'
  },
  tokensCollected: {
    RU: 'Собрано жетонов',
    TYV: 'Чыылган алдын',
    EN: 'Tokens Collected'
  },
  playAgain: {
    RU: 'Вскачь снова',
    TYV: 'Фер Катаап',
    EN: 'Ride Again'
  },
  mainMenu: {
    RU: 'Главное меню',
    TYV: 'Төп меню',
    EN: 'Main Menu'
  },

  // Pause & Chapter Complete & Game Over
  runEnded: {
    RU: 'Забег окончен',
    TYV: 'Чашпар төнгени',
    EN: 'Run Ended'
  },
  newRecord: {
    RU: 'НОВЫЙ РЕКОРД ДИСТАНЦИИ!',
    TYV: 'ЧАА ХЕМЧЭЭЛ РЕКОРДУ!',
    EN: 'NEW DISTANCE RECORD!'
  },
  finalScore: {
    RU: 'Итоговые очки',
    TYV: 'Түмчү онаг',
    EN: 'Final Score'
  },
  bestScore: {
    RU: 'Лучший результат',
    TYV: 'Эң эки түмчү',
    EN: 'Best Score'
  },
  tryAgain: {
    RU: 'ПОПРОБОВАТЬ СНОВА',
    TYV: 'КАТААП ШЕНЭЭР',
    EN: 'TRY AGAIN'
  },
  upgradesBtn: {
    RU: 'Улучшения',
    TYV: 'Сайзырадыр',
    EN: 'Upgrades'
  },
  pauseTitle: {
    RU: 'Пауза',
    TYV: 'Доктаар',
    EN: 'Paused'
  },
  resumeRun: {
    RU: 'Продолжить забег',
    TYV: 'Улаштыр чашпар',
    EN: 'Resume Ride'
  },
  returnMenu: {
    RU: 'Вернуться в меню',
    TYV: 'Төп менюже эгип кээр',
    EN: 'Return to Menu'
  },
  chapterClearedTitle: {
    RU: 'ГЛАВА ПРОЙДЕНА!',
    TYV: 'ЭГЭ ЭРТТИ!',
    EN: 'CHAPTER COMPLETED!'
  },
  chapterClearedDesc: {
    RU: 'Богатырь пробился через опасности и открыл следующий рубеж сказания.',
    TYV: 'Маадыр бергелерни ажып эртер орукту ажып каапты.',
    EN: 'The hero pressed through dangers and unlocked the next chapter of the epic.'
  },
  chapterReward: {
    RU: 'Награда за главу: +200 жетонов ❖',
    TYV: 'Эге дээш шаңнал: +200 алдын ❖',
    EN: 'Chapter reward: +200 tokens ❖'
  },
  continueBtn: {
    RU: 'ПРОДОЛЖИТЬ',
    TYV: 'УЛАШТЫРАР',
    EN: 'CONTINUE'
  }
};

export function getTranslation(key: keyof typeof TRANSLATIONS, lang: Language = 'RU'): string {
  const item = TRANSLATIONS[key];
  if (!item) return key;
  return item[lang] || item['RU'] || key;
}
