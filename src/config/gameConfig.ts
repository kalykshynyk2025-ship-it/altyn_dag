import { PowerUpDefinition, PlayerProfile } from '../types/game';

export const GAME_CONFIG = {
  // Canvas & World physics
  LANE_WIDTH: 1.8, // Width between lanes in 3D world units
  LANE_SPEED_BASE: 26, // Base Z movement speed
  LANE_SPEED_MAX: 65,  // Max speed cap
  ACCELERATION: 0.12,  // Speed increase over distance
  GRAVITY: -38,        // Jump gravity
  JUMP_VELOCITY: 14.5, // Initial vertical velocity
  SLIDE_DURATION: 0.7, // Seconds of sliding posture
  
  // Track Segment Dimensions
  SEGMENT_LENGTH: 80,
  VISIBLE_SEGMENTS: 6,
  
  // Archery config
  BOW_COOLDOWN: 0.4, // seconds
  ARROW_SPEED: 85,
  MAX_ARROWS_DEFAULT: 25,
  
  // Scoring
  SCORE_PER_METER: 2,
  TOKEN_SCORE_BONUS: 50,
  ENEMY_KILL_BONUS: 150,
  
  // Initial Player Profile
  DEFAULT_PLAYER_PROFILE: {
    name: 'Кан-Мерген',
    currentChapter: 1,
    tokens: 150,
    totalDistanceRun: 0,
    highScore: 0,
    arrowsCount: 20,
    equippedHorseId: 'STEPPE_WIND',
    unlockedHorses: ['STEPPE_WIND'],
    heroLevel: 1,
    bowLevel: 1,
    unlockedLoreIds: ['lore_1'],
    completedChapters: [],
    settings: {
      soundVolume: 0.8,
      musicVolume: 0.6,
      highPerformance: true,
      showTutorial: true,
      language: 'RU',
    }
  } as PlayerProfile,
  
  // PowerUp Definitions
  POWERUPS: {
    SPEED_WIND: {
      type: 'SPEED_WIND',
      name: 'Стремительный ветер',
      description: 'Ускоряет коня и притягивает все золотые жетоны вокруг!',
      durationSeconds: 6,
      color: '#EAB308', // Amber Gold
      iconName: 'Zap'
    },
    EAGLE_WINGS: {
      type: 'EAGLE_WINGS',
      name: 'Крылья орла',
      description: 'Поднимает коня в воздух, позволяя парить над любыми препятствиями!',
      durationSeconds: 7,
      color: '#38BDF8', // Cyan Blue
      iconName: 'Feather'
    },
    HERO_VOICE: {
      type: 'HERO_VOICE',
      name: 'Голос богатыря',
      description: 'Богатырский клич уничтожает все близлежащие барьеры!',
      durationSeconds: 5,
      color: '#EF4444', // Red
      iconName: 'Volume2'
    },
    CELESTIAL_ARROW: {
      type: 'CELESTIAL_ARROW',
      name: 'Небесная стрела',
      description: 'Запускает каскад самонаводящихся стрел по всем врагам!',
      durationSeconds: 6,
      color: '#A855F7', // Purple
      iconName: 'Target'
    },
    SHIELD_SPIRIT: {
      type: 'SHIELD_SPIRIT',
      name: 'Защитный дух',
      description: 'Создает сияющий душевный щит, защищающий от однократного удара!',
      durationSeconds: 10,
      color: '#10B981', // Emerald
      iconName: 'Shield'
    },
    ANCESTRAL_PATH: {
      type: 'ANCESTRAL_PATH',
      name: 'След предков',
      description: 'Прокладывает золотой световой путь на наиболее безопасной полосе!',
      durationSeconds: 8,
      color: '#F59E0B', // Gold
      iconName: 'Compass'
    }
  } as Record<string, PowerUpDefinition>
};
