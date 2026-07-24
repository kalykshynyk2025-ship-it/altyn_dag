import { StoryChapter, LoreFragment, HorseBreed, BiomeConfig } from '../types/game';
import { Language } from '../utils/translations';

export const GAME_TITLE_ALTERNATIVES = [
  { ru: "Алтын Даг", tuvan: "Алтын Даг", desc: "«Золотая гора» — символ священного поднебесного бытия и нерушимости родной земли." },
  { ru: "Золотая степь", tuvan: "Алтын Шеп", desc: "«Золотая степь» — бескрайние степные просторы, через которые лежит вечный путь богатыря." },
  { ru: "Кочевой Ветер", tuvan: "Кыстык Хулээ", desc: "Поэтическое имя, символизирующее стремительность коня и духовную свободу." },
  { ru: "Путь Богатыря", tuvan: "Мөге Оруг", desc: "Прямое эпическое название о странствии за миром, невестой и правдой." },
  { ru: "Голос Степей", tuvan: "Хөөмей Сүлде", desc: "Символ связи устного сказания сказителя с ритмом скачущего коня." },
];

export const BIOMES_CONFIG: Record<string, BiomeConfig> = {
  STEPPE: {
    id: 'STEPPE',
    name: 'Алтын Шеп (Золотая Степь)',
    subName: 'Родные кочевые просторы',
    skyGradient: ['#38BDF8', '#FEF08A'], // sky blue to golden horizon
    groundColor: '#D97706', // amber gold
    horizonColor: '#CA8A04',
    fogColor: '#FDE68A',
    accentColor: '#F59E0B',
    ambientTrack: 'steppe_wind',
    description: 'Бескрайние степи с кочевыми стоянками, табунами лошадей и горными силуэтами Саян на горизонте.',
    unlockedAtChapter: 1,
  },
  SACRED_MOUNTAIN: {
    id: 'SACRED_MOUNTAIN',
    name: 'Ыдык Даг (Священный Горный Перевал)',
    subName: 'Мистическая высота',
    skyGradient: ['#1E1B4B', '#0284C7'], // deep twilight to icy cyan
    groundColor: '#475569', // slate mountain
    horizonColor: '#0EA5E9',
    fogColor: '#94A3B8',
    accentColor: '#38BDF8',
    ambientTrack: 'mountain_spirits',
    description: 'Горные кручи, древние священные каирны Оваа, порывистый горный ветер и духи-покровители.',
    unlockedAtChapter: 2,
  },
  ENEMY_BORDER: {
    id: 'ENEMY_BORDER',
    name: 'Дайын Аала (Земли Захватчиков)',
    subName: 'Опаленный край',
    skyGradient: ['#451A03', '#DC2626'], // dusty dark red
    groundColor: '#78350F', // burnt dirt
    horizonColor: '#EF4444',
    fogColor: '#991B1B',
    accentColor: '#F87171',
    ambientTrack: 'enemy_drums',
    description: 'Вражеские дозоры, разрушенные повозки, частоколы и засады конных воинов.',
    unlockedAtChapter: 3,
  },
  TAIGA: {
    id: 'TAIGA',
    name: 'Тайга Кушкаш (Заповедная Тайга)',
    subName: 'Край кедров и рек',
    skyGradient: ['#064E3B', '#10B981'], // deep forest green
    groundColor: '#15803D',
    horizonColor: '#34D399',
    fogColor: '#6EE7B7',
    accentColor: '#10B981',
    ambientTrack: 'forest_whisper',
    description: 'Густой лиственничный лес, быстрые таежные реки и каменистые пороги.',
    unlockedAtChapter: 4,
  },
  FINAL_FORTRESS: {
    id: 'FINAL_FORTRESS',
    name: 'Улуг Орду (Цитадель Тьмы)',
    subName: 'Финальный рубеж',
    skyGradient: ['#0F172A', '#581C87'], // midnight purple
    groundColor: '#334155',
    horizonColor: '#A855F7',
    fogColor: '#C084FC',
    accentColor: '#E879F9',
    ambientTrack: 'final_epic',
    description: 'Обитель предводителя захватчиков, где решится судьба мирных родов.',
    unlockedAtChapter: 6,
  }
};

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    title: 'Глава I. Зов Дороги',
    subtitle: 'Вперед, через родную степь',
    biome: 'STEPPE',
    targetDistance: 1000,
    summary: 'Юный богатырь Кан-Мерген узнает, что его суженая Дангына и мирные роды оказались под угрозой. Он оседлал своего первого степного коня.',
    storytellerLines: [
      '«И поднялся сокол над вершинами Саян...»,',
      '«И ударил копытом скакун богатыря, разрывая степную тишину!»,',
      '«Помни, юноша: твой конь — твое крыло, твой лук — твоя верность родной земле!»'
    ],
    unlocked: true,
    completed: false
  },
  {
    id: 2,
    title: 'Глава II. Священный Перевал',
    subtitle: 'Под крылом духов-покровителей',
    biome: 'SACRED_MOUNTAIN',
    targetDistance: 2500,
    summary: 'Дорога ведет богатыря через крутые горные перевалы, где стоят древние оваа — камни предков.',
    storytellerLines: [
      '«Ветер с гор нашептывает имена древних героев...»,',
      '«Не оскверни священных камней, уклоняйся от пропастей и слушай зов неба!»'
    ],
    unlocked: false,
    completed: false
  },
  {
    id: 3,
    title: 'Глава III. Опаленный Край',
    subtitle: 'Встреча со следами захватчиков',
    biome: 'ENEMY_BORDER',
    targetDistance: 4000,
    summary: 'Степь сменяется выжженными землями. Появляются дозоры вражеских всадников и укрепления.',
    storytellerLines: [
      '«Дым поднимется над степью, где прошлись чужие кони...»,',
      '«Тетиву натяни, Кан-Мерген! Ибо лук богатыря защищает слабых!»'
    ],
    unlocked: false,
    completed: false
  },
  {
    id: 4,
    title: 'Глава IV. Кедровый Лес',
    subtitle: 'Испытание выносливости',
    biome: 'TAIGA',
    targetDistance: 6000,
    summary: 'Путь через вековую тайгу требует молниеносной реакции от коня и всадника.',
    storytellerLines: [
      '«Шелестят древние кедры, укрывая богатыря от вражеских глаз...»,',
      '«Крылья орла да помогут тебе перелететь бурлящие таежные реки!»'
    ],
    unlocked: false,
    completed: false
  },
  {
    id: 5,
    title: 'Глава V. Защита Рода',
    subtitle: 'Объединение кочевых родов',
    biome: 'STEPPE',
    targetDistance: 8500,
    summary: 'Богатырь объединяет разрозненные роды, освобождает пленников и ведет за собой лучших воинов.',
    storytellerLines: [
      '«Один богатырь — как одна стрела, но союз родов — как крепкий щит из лиственницы!»'
    ],
    unlocked: false,
    completed: false
  },
  {
    id: 6,
    title: 'Глава VI. Финальный Поединок',
    subtitle: 'Битва с предводителем врагов',
    biome: 'FINAL_FORTRESS',
    targetDistance: 12000,
    summary: 'Эпическая погоня и битва на конях против жестокого хана захватчиков Кара-Хаана.',
    storytellerLines: [
      '«Час настал. Скрестились мечи, вонзились небесные стрелы!»,',
      '«Верни свет родным горам и освободи Дангыну!»'
    ],
    unlocked: false,
    completed: false
  },
  {
    id: 7,
    title: 'Глава VII. Рассвет над Енисеем',
    subtitle: 'Возвращение к мирной жизни',
    biome: 'STEPPE',
    targetDistance: 15000,
    summary: 'Мир восстановлен. Очаги снова горят, табуны пасутся на лугах, а сказитель поет новую песнь славы.',
    storytellerLines: [
      '«И стихла буря. И запел горловым пением сказитель...»,',
      '«Ибо настоящий подвиг — не в пролитой крови, а в вернувшемся мире!»'
    ],
    unlocked: false,
    completed: false
  }
];

export const CHAPTER_TRANSLATIONS: Record<number, Record<Language, {
  title: string;
  subtitle: string;
  summary: string;
  storytellerLines: string[];
}>> = {
  1: {
    RU: {
      title: 'Глава I. Зов Дороги',
      subtitle: 'Вперед, через родную степь',
      summary: 'Юный богатырь Кан-Мерген узнает, что его суженая Дангына и мирные роды оказались под угрозой. Он оседлал своего первого степного коня.',
      storytellerLines: [
        'И поднялся сокол над вершинами Саян...',
        'И ударил копытом скакун богатыря, разрывая степную тишину!',
        'Помни, юноша: твой конь — твое крыло, твой лук — твоя верность родной земле!'
      ]
    },
    TYV: {
      title: 'I Эге. Оруктуң Кыйгызы',
      subtitle: 'Төрээн чыраа шеп эртир',
      summary: 'Аныяк маадыр Кан-Мерген чараш Дангыназы биле төрээн чону айыылга таварышканын билип кааш, аъдын мунуп үнген.',
      storytellerLines: [
        'Саян даглар бажынга хартыга дегди...',
        'Маадырның аъды туяк шиведи, орук ажытты!',
        'Сактып ал, аныяк кул: аъдың — сеңээ канат, жааң — чонга шынчы чорук!'
      ]
    },
    EN: {
      title: 'Chapter I. Call of the Trail',
      subtitle: 'Forward across the native steppe',
      summary: 'Young hero Kan-Mergen learns that his beloved Dangyna and peaceful clans are under threat. He saddles his trusty steppe steed.',
      storytellerLines: [
        'And the falcon soared above the peaks of the Sayan mountains...',
        'And the hero’s steed struck its hoof, breaking the silence of the steppe!',
        'Remember, youth: your horse is your wing, your bow is your loyalty to your homeland!'
      ]
    }
  },
  2: {
    RU: {
      title: 'Глава II. Священный Перевал',
      subtitle: 'Под крылом духов-покровителей',
      summary: 'Дорога ведет богатыря через крутые горные перевалы, где стоят древние оваа — камни предков.',
      storytellerLines: [
        'Ветер с гор нашептывает имена древних героев...',
        'Не оскверни священных камней, уклоняйся от пропастей и слушай зов неба!'
      ]
    },
    TYV: {
      title: 'II Эге. Ыдык Аршан Перевал',
      subtitle: 'Сүлделерниң камгалалы',
      summary: 'Маадырның оруу бедик даг арттарынга кээп, эрте-бурунгу оваалар аразы-биле эртип турар.',
      storytellerLines: [
        'Даглар хады шаандагы маадырлар адын сымырап турар...',
        'Ыдык таштарны камнап, терең ковайлардан каштап эрт!'
      ]
    },
    EN: {
      title: 'Chapter II. Sacred Pass',
      subtitle: 'Under the wing of guardian spirits',
      summary: 'The trail guides the hero over steep mountain passes adorned with ancient ovaa stone cairns.',
      storytellerLines: [
        'The mountain wind whispers the names of ancient heroes...',
        'Honor the sacred stones, dodge the precipices, and heed the call of the sky!'
      ]
    }
  },
  3: {
    RU: {
      title: 'Глава III. Опаленный Край',
      subtitle: 'Встреча со следами захватчиков',
      summary: 'Степь сменяется выжженными землями. Появляются дозоры вражеских всадников и укрепления.',
      storytellerLines: [
        'Дым поднимется над степью, где прошлись чужие кони...',
        'Тетиву натяни, Кан-Мерген! Ибо лук богатыря защищает слабых!'
      ]
    },
    TYV: {
      title: 'III Эге. Кезээ үен Шалдаң',
      subtitle: 'Дайызыннар изинге дужууру',
      summary: 'Шеп артында кошкар аалдарны өрттедипкен издер көрүнүп келир. Дайызын аъттыглар ааттырар.',
      storytellerLines: [
        'Өске аъттар баскан черде ыш көдүрүлүп кээр...',
        'Жааң бажын хер, Кан-Мерген! Маадырның чепсеги кошкарларны камгалаар!'
      ]
    },
    EN: {
      title: 'Chapter III. Scorched Land',
      subtitle: 'Encountering traces of invaders',
      summary: 'The steppe gives way to scorched earth. Enemy rider patrols and wooden barricades block the path.',
      storytellerLines: [
        'Smoke rises over the plains where foreign hooves have trampled...',
        'Draw your bowstring, Kan-Mergen! For the hero’s bow shields the weak!'
      ]
    }
  },
  4: {
    RU: {
      title: 'Глава IV. Кедровый Лес',
      subtitle: 'Испытание выносливости',
      summary: 'Путь через вековую тайгу требует молниеносной реакции от коня и всадника.',
      storytellerLines: [
        'Шелестят древние кедры, укрывая богатыря от вражеских глаз...',
        'Крылья орла да помогут тебе перелететь бурлящие таежные реки!'
      ]
    },
    TYV: {
      title: 'IV Эге. Пош Кушкаш Тайга',
      subtitle: 'Шыдамык чорукту шенээри',
      summary: 'Эрте-бурунгу пош аразы-биле эртип чыткаш, конь биле мунукчуның дурген маңын көргүзер.',
      storytellerLines: [
        'Бурунгу поштар шуурап, маадырны дайызындан чажырып турар...',
        'Хартыга канаттары хову хеми үстүнге ужудууруңга дузалазын!'
      ]
    },
    EN: {
      title: 'Chapter IV. Cedar Forest',
      subtitle: 'Trial of endurance',
      summary: 'Navigating through ancient taiga forests demands lightning reflexes from horse and rider.',
      storytellerLines: [
        'Ancient cedars rustle, sheltering the warrior from enemy eyes...',
        'May eagle wings carry you over raging mountain rivers!'
      ]
    }
  },
  5: {
    RU: {
      title: 'Глава V. Защита Рода',
      subtitle: 'Объединение кочевых родов',
      summary: 'Богатырь объединяет разрозненные роды, освобождает пленников и ведет за собой лучших воинов.',
      storytellerLines: [
        'Один богатырь — как одна стрела, но союз родов — как крепкий щит из лиственницы!'
      ]
    },
    TYV: {
      title: 'V Эге. Сөөктерни Камгалаары',
      subtitle: 'Көшпүт аалдарның каттышканы',
      summary: 'Маадыр чарылган сөөктерни каттыштырып, туттурган улусту хостап, дайынчыларны баштаар.',
      storytellerLines: [
        'Чаңгыс маадыр — чаңгыс сок, а сөөктер каттышканы — быжыг пөш халказы дег!'
      ]
    },
    EN: {
      title: 'Chapter V. Shield of the Clan',
      subtitle: 'Uniting the nomadic tribes',
      summary: 'The hero unites scattered nomadic clans, frees captives, and leads brave warriors into battle.',
      storytellerLines: [
        'A lone warrior is like a single arrow, but united clans are like an unyielding larch shield!'
      ]
    }
  },
  6: {
    RU: {
      title: 'Глава VI. Финальный Поединок',
      subtitle: 'Битва с предводителем врагов',
      summary: 'Эпическая погоня и битва на конях против жестокого хана захватчиков Кара-Хаана.',
      storytellerLines: [
        'Час настал. Скрестились мечи, вонзились небесные стрелы!',
        'Верни свет родным горам и освободи Дангыну!'
      ]
    },
    TYV: {
      title: 'VI Эге. Сөөлгү Чокушуг',
      subtitle: 'Кара-Хаан биле дайын',
      summary: 'Дурген аъттар үстүнде Кара-Хаан биле сөөлгү эрес тушпуш.',
      storytellerLines: [
        'Шаг келди. Селемелер кагжып, дээр аткан соктар ужуп үндү!',
        'Төрээн даг ларга чырыкты эгидип, Дангынаңны хоста!'
      ]
    },
    EN: {
      title: 'Chapter VI. The Final Showdown',
      subtitle: 'Battle against the warlord',
      summary: 'An epic horseback chase and duel against the ruthless invading warlord Kara-Haan.',
      storytellerLines: [
        'The hour has arrived. Blades clash, and celestial arrows strike!',
        'Restore light to the native mountains and free your beloved Dangyna!'
      ]
    }
  },
  7: {
    RU: {
      title: 'Глава VII. Рассвет над Енисеем',
      subtitle: 'Возвращение к мирной жизни',
      summary: 'Мир восстановлен. Очаги снова горят, табуны пасутся на лугах, а сказитель поет новую песнь славы.',
      storytellerLines: [
        'И стихла буря. И запел горловым пением сказитель...',
        'Ибо настоящий подвиг — не в пролитой крови, а в вернувшемся мире!'
      ]
    },
    TYV: {
      title: 'VII Эге. Улуг-Хем Үстүнге Хүн Үнгени',
      subtitle: 'Орай тайбың чуртталгаже эгип кээри',
      summary: 'Тайбың эгип келди. Очактар кыпкан, аът суруглары очорда, а ыраажы чаа ырын ырлап турар.',
      storytellerLines: [
        'Халыын хат читти. Ыраажы хөөмейлеп ырлап эгеледи...',
        'Амы-тын төрээнде эвес, тайбың эгиткенде — ёзулуг маадырлыг чорук!'
      ]
    },
    EN: {
      title: 'Chapter VII. Dawn Over the Yenisei',
      subtitle: 'Return to peace',
      summary: 'Peace is restored. Hearth fires burn again, herds graze peacefully, and the storyteller sings a new song of victory.',
      storytellerLines: [
        'The storm subsided, and the storyteller began his throat singing...',
        'For true glory lies not in spilled blood, but in peace restored!'
      ]
    }
  }
};

export function getLocalizedChapter(chapterId: number, lang: Language = 'RU'): StoryChapter {
  const chapter = STORY_CHAPTERS.find(c => c.id === chapterId) || STORY_CHAPTERS[0];
  const loc = CHAPTER_TRANSLATIONS[chapterId] && CHAPTER_TRANSLATIONS[chapterId][lang]
    ? CHAPTER_TRANSLATIONS[chapterId][lang]
    : CHAPTER_TRANSLATIONS[chapterId]?.['RU'];

  if (!loc) return chapter;

  return {
    ...chapter,
    title: loc.title,
    subtitle: loc.subtitle,
    summary: loc.summary,
    storytellerLines: loc.storytellerLines
  };
}

export const HORSE_BREEDS: HorseBreed[] = [
  {
    id: 'STEPPE_WIND',
    name: 'Холчук (Степной Ветер)',
    title: 'Верный степной конь',
    description: 'Небольшой, выносливый и неприхотливый скакун, выросший на вольных степных просторах.',
    colorPrimary: '#854D0E',
    colorSecondary: '#FEF08A',
    colorMane: '#451A03',
    baseSpeed: 1.0,
    baseJumpHeight: 1.0,
    baseStamina: 100,
    specialTrait: 'Быстрое восстановление энергии',
    costTokens: 0,
    unlocked: true,
  },
  {
    id: 'MOUNTAIN_THUNDER',
    name: 'Сылдыс (Горный Гром)',
    title: 'Скакун горных высот',
    description: 'Сильный, широкогрудый конь с крепкими копытами для преодоления крутых каменистых круч.',
    colorPrimary: '#334155',
    colorSecondary: '#94A3B8',
    colorMane: '#0F172A',
    baseSpeed: 1.15,
    baseJumpHeight: 1.45,
    baseStamina: 130,
    specialTrait: 'Высокие прыжки: перепрыгивает камни и высокий забор',
    costTokens: 250,
    unlocked: false,
  },
  {
    id: 'CELESTIAL_MANE',
    name: 'Аргамак (Небесная Грива)',
    title: 'Благородный элитный скакун',
    description: 'Легендарный длинноногий аргамак, развивающий невероятную скорость на ровной дистанции.',
    colorPrimary: '#D97706',
    colorSecondary: '#FDE047',
    colorMane: '#FFFFFF',
    baseSpeed: 1.3,
    baseJumpHeight: 1.1,
    baseStamina: 150,
    specialTrait: '+25% к сбору золотых орнаментальных жетонов',
    costTokens: 600,
    unlocked: false,
  },
  {
    id: 'SILVER_RUNNER',
    name: 'Аранзал (Серебряный Бегун)',
    title: 'Мифический крылатый конь эпоса',
    description: 'Серебристый эпический скакун из героических сказаний, способный парить над препятствиями.',
    colorPrimary: '#E2E8F0',
    colorSecondary: '#38BDF8',
    colorMane: '#7DD3FC',
    baseSpeed: 1.45,
    baseJumpHeight: 1.4,
    baseStamina: 200,
    specialTrait: 'Врожденный защитный щит от одного столкновения',
    costTokens: 1200,
    unlocked: false,
  }
];

export const LORE_FRAGMENTS: LoreFragment[] = [
  {
    id: 'lore_1',
    chapterId: 1,
    title: 'Верный Скакун в Тувинском Эпосе',
    content: 'В тувинских сказаниях («Танаа-Херел», «Алдай-Буучу») конь — не просто средство передвижения, а разумный названый брат богатыря, способный давать мудрые советы в трудную минуту.',
    culturalNote: 'Коневодство являлось основой жизненного уклада кочевников Саяно-Алтая.',
    unlocked: true,
  },
  {
    id: 'lore_2',
    chapterId: 2,
    title: 'Искусство Стрельбы из Лука',
    content: 'Богатырский лук (Ча) изготавливался из березы, рога изюбря и жил, обладая огромной дальнобойностью и пробивной силой.',
    culturalNote: 'Соревнования по стрельбе из лука — важнейшая часть тувинского праздника Наадым.',
    unlocked: false,
  },
  {
    id: 'lore_3',
    chapterId: 3,
    title: 'Священные Каирны Оваа',
    content: 'Оваа — пирамидальные сооружения из камней и веток на горных перевалах. Проходящие путники оказывают уважение духам гор (Даг ээзи), обходя оваа по часовой стрелке.',
    culturalNote: 'Оваа символизируют гармонию человека с окружающим миром природы.',
    unlocked: false,
  },
  {
    id: 'lore_4',
    chapterId: 4,
    title: 'Традиционный Войлочный Юрт (Эг)',
    content: 'Округлая конструкция юрты идеально защищает кочевников от степного ветра и мороза. Дверь юрты всегда обращена на восток или юго-восток к восходящему солнцу.',
    culturalNote: 'Пространство юрты имеет строгую традиционную организацию.',
    unlocked: false,
  },
  {
    id: 'lore_5',
    chapterId: 5,
    title: 'Феномен Горлового Пения (Хөөмей)',
    content: 'Тувинский феномен хөөмей — способность исполнителя извлекать одновременно два и более тонов. Сказители под аккомпанемент игила или дошпулуура исполняли сказания ночами напролет.',
    culturalNote: 'Хөөмей включен в список нереального культурного наследия ЮНЕСКО.',
    unlocked: false,
  },
  {
    id: 'lore_6',
    chapterId: 6,
    title: 'Богатырский Союз и Взаимопомощь (Аал)',
    content: 'В эпосах победа достигается не только одиночной силой, но и благодаря объединению родов (аал) ради защиты своей земли.',
    culturalNote: 'Традиции гостеприимства и взаимопомощи оставались определяющими для выживания в степи.',
    unlocked: false,
  },
  {
    id: 'lore_7',
    chapterId: 7,
    title: 'Философия Защиты Мира',
    content: 'Главная цель тувинского богатыря — не захват чужих земель, а восстановление справедливости, спасение суженой и возвращение мирной жизни родному народу.',
    culturalNote: 'Эпический финал всегда венчает мирный праздник с играми, борьбой хуреш и песнями.',
    unlocked: false,
  }
];
