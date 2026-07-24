/**
 * TypeScript Interfaces and Types for "Алтын Даг / Золотая степь"
 */

export type GameState = 'MENU' | 'STORY_INTRO' | 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'CHAPTER_COMPLETE';

export type Lane = -1 | 0 | 1; // Left: -1, Center: 0, Right: 1

export type BiomeType = 'STEPPE' | 'SACRED_MOUNTAIN' | 'ENEMY_BORDER' | 'TAIGA' | 'FINAL_FORTRESS';

export interface BiomeConfig {
  id: BiomeType;
  name: string;
  subName: string;
  skyGradient: [string, string];
  groundColor: string;
  horizonColor: string;
  fogColor: string;
  accentColor: string;
  ambientTrack: string;
  description: string;
  unlockedAtChapter: number;
}

export type PowerUpType = 
  | 'SPEED_WIND'      // Стремительный ветер (speed boost & magnet)
  | 'EAGLE_WINGS'    // Крылья орла (soar over obstacles)
  | 'HERO_VOICE'     // Голос богатыря (shockwave clearing)
  | 'CELESTIAL_ARROW'// Небесная стрела (auto archery)
  | 'SHIELD_SPIRIT'  // Защитный дух (shield)
  | 'ANCESTRAL_PATH';// След предков (shows safe trajectory)

export interface PowerUpDefinition {
  type: PowerUpType;
  name: string;
  description: string;
  durationSeconds: number;
  color: string;
  iconName: string;
}

export type ObstacleType = 
  | 'ROCK'            // Камень
  | 'LOG'             // Поваленное дерево (can jump over)
  | 'BARRICADE'       // Высокое укрепление (must change lane or shoot)
  | 'YURT'            // Войлочный юрт/повозка
  | 'RIVER_GAP'       // Овраг / река (must jump)
  | 'STONE_OVAO'      // Оваа / священный каирн (indestructible)
  | 'TREE_BRANCH'     // Дерево с суком (sliding required, chapter 3+)
  | 'ROCKFALL';       // Камнепад / обвал с гор

export interface Obstacle {
  id: string;
  type: ObstacleType;
  lane: Lane;
  z: number; // Distance ahead on the track
  width: number;
  height: number;
  canJumpOver: boolean;
  canSlideUnder: boolean;
  canDestroyWithBow: boolean;
  destroyed?: boolean;
}

export interface Enemy {
  id: string;
  lane: Lane;
  z: number;
  hp: number;
  maxHp: number;
  speed: number;
  isRider: boolean;
  destroyed?: boolean;
}

export interface CollectibleItem {
  id: string;
  type: 'TOKEN' | 'ARROW' | 'POWERUP' | 'LORE_FRAGMENT';
  powerUpType?: PowerUpType;
  fragmentId?: string;
  lane: Lane;
  z: number;
  collected?: boolean;
}

export interface ArrowProjectile {
  id: string;
  lane: Lane;
  z: number;
  speed: number;
  active: boolean;
}

export interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface HorseBreed {
  id: string;
  name: string;
  title: string;
  description: string;
  colorPrimary: string;
  colorSecondary: string;
  colorMane: string;
  baseSpeed: number;
  baseJumpHeight: number;
  baseStamina: number;
  specialTrait: string;
  costTokens: number;
  unlocked: boolean;
}

export interface CharacterUpgrade {
  level: number;
  maxLevel: number;
  speedMultiplier: number;
  jumpForce: number;
  staminaMax: number;
  bowDamage: number;
  arrowCapacity: number;
}

export interface StoryChapter {
  id: number;
  title: string;
  subtitle: string;
  biome: BiomeType;
  targetDistance: number;
  summary: string;
  storytellerLines: string[];
  unlocked: boolean;
  completed: boolean;
}

export interface LoreFragment {
  id: string;
  chapterId: number;
  title: string;
  content: string;
  culturalNote: string;
  unlocked: boolean;
  unlockedAtDate?: string;
}

export interface PlayerProfile {
  name: string;
  currentChapter: number;
  tokens: number;
  totalDistanceRun: number;
  highScore: number;
  arrowsCount: number;
  equippedHorseId: string;
  unlockedHorses: string[];
  heroLevel: number;
  bowLevel: number;
  unlockedLoreIds: string[];
  completedChapters: number[];
  settings: {
    soundVolume: number;
    musicVolume: number;
    highPerformance: boolean;
    showTutorial: boolean;
    language: 'RU' | 'TYV' | 'EN';
  };
}

export interface ActivePowerUpState {
  type: PowerUpType;
  remainingTime: number;
  maxTime: number;
}
