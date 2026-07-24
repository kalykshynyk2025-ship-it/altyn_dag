import {
  GameState,
  Lane,
  BiomeConfig,
  Obstacle,
  Enemy,
  CollectibleItem,
  ArrowProjectile,
  ActivePowerUpState,
  Particle,
  PlayerProfile,
  PowerUpType
} from '../types/game';
import { GAME_CONFIG } from '../config/gameConfig';
import { BIOMES_CONFIG, STORY_CHAPTERS, HORSE_BREEDS, LORE_FRAGMENTS } from '../narrative/storyData';
import { CanvasRenderer } from '../entities/CanvasRenderer';
import { ThreeJsRenderer } from '../entities/ThreeJsRenderer';
import { audioManager } from '../utils/audioManager';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private renderer3D?: ThreeJsRenderer;
  private renderer2D?: CanvasRenderer;

  // Game state
  public gameState: GameState = 'MENU';
  public profile: PlayerProfile;
  public currentChapterId: number = 1;
  public biome: BiomeConfig = BIOMES_CONFIG.STEPPE;

  // Runner Camera & Physics
  public cameraZ: number = 0;
  public currentSpeed: number = GAME_CONFIG.LANE_SPEED_BASE;
  public distanceRun: number = 0;
  public score: number = 0;
  public tokensCollectedInRun: number = 0;
  public enemiesDefeatedInRun: number = 0;

  // Player position & physics
  public playerLane: Lane = 0;
  public targetLane: Lane = 0;
  public playerX: number = 0; // World X position
  public playerY: number = 0; // World Y height (jump/fly)
  public playerVy: number = 0; // Vertical velocity
  public isJumping: boolean = false;
  public isSliding: boolean = false;
  public slideTimer: number = 0;

  // Entities
  public obstacles: Obstacle[] = [];
  public enemies: Enemy[] = [];
  public collectibles: CollectibleItem[] = [];
  public arrows: ArrowProjectile[] = [];
  public particles: Particle[] = [];
  public activePowerUps: ActivePowerUpState[] = [];

  // Safe path hint for Ancestral Path powerup
  public safeLaneHint?: Lane;

  // Timers & Loop
  private animFrameId: number | null = null;
  private lastTime: number = 0;
  private totalTime: number = 0;
  private nextSegmentZ: number = 40;
  private archeryCooldown: number = 0;

  // Callbacks for React UI updates
  public onStateChange?: (state: GameState) => void;
  public onRunUpdate?: (stats: {
    distance: number;
    score: number;
    tokens: number;
    arrows: number;
    speed: number;
    chapterProgressPct: number;
  }) => void;
  public onGameOver?: (reason: string) => void;
  public onChapterComplete?: (chapterId: number) => void;

  constructor(canvas: HTMLCanvasElement, profile: PlayerProfile) {
    this.canvas = canvas;
    this.profile = profile;

    try {
      this.renderer3D = new ThreeJsRenderer(canvas);
    } catch (e) {
      console.warn("WebGL 3D Context failed, falling back to 2D Canvas", e);
      const ctx = canvas.getContext('2d')!;
      if (ctx) {
        this.renderer2D = new CanvasRenderer(ctx);
      }
    }

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  public resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (parent) {
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      this.canvas.width = width;
      this.canvas.height = height;

      if (this.renderer3D) {
        this.renderer3D.resize(width, height);
      } else if (this.renderer2D) {
        this.renderer2D.resize(width, height);
      }
    }
  }

  public setChapter(chapterId: number) {
    this.currentChapterId = chapterId;
    const chap = STORY_CHAPTERS.find(c => c.id === chapterId) || STORY_CHAPTERS[0];
    this.biome = BIOMES_CONFIG[chap.biome] || BIOMES_CONFIG.STEPPE;
  }

  public startNewRun() {
    this.setChapter(this.profile.currentChapter);

    const horse = HORSE_BREEDS.find(h => h.id === this.profile.equippedHorseId) || HORSE_BREEDS[0];
    const heroLevelMultiplier = 1 + (this.profile.heroLevel - 1) * 0.05;
    const chapterSpeedBase = (GAME_CONFIG.LANE_SPEED_BASE + (this.currentChapterId - 1) * 3.5) * horse.baseSpeed * heroLevelMultiplier;

    this.cameraZ = 0;
    this.distanceRun = 0;
    this.score = 0;
    this.tokensCollectedInRun = 0;
    this.enemiesDefeatedInRun = 0;
    this.currentSpeed = chapterSpeedBase;

    // Initial arrows based on bow mastery level
    const baseArrows = 15 + (this.profile.bowLevel - 1) * 5;
    if (this.profile.arrowsCount < baseArrows) {
      this.profile.arrowsCount = baseArrows;
    }

    this.playerLane = 0;
    this.targetLane = 0;
    this.playerX = 0;
    this.playerY = 0;
    this.playerVy = 0;
    this.isJumping = false;
    this.isSliding = false;
    this.slideTimer = 0;

    this.obstacles = [];
    this.enemies = [];
    this.collectibles = [];
    this.arrows = [];
    this.particles = [];
    this.activePowerUps = [];
    this.nextSegmentZ = 40;

    // Special Trait: Silver Runner horse grants inherent shield spirit at run start
    if (horse.id === 'SILVER_RUNNER') {
      this.activatePowerUp('SHIELD_SPIRIT');
    }

    // Generate initial track segments ahead
    for (let i = 0; i < 5; i++) {
      this.generateSegment();
    }

    this.setState('PLAYING');
    audioManager.startAmbientMusic();

    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  public setState(newState: GameState) {
    const prevState = this.gameState;
    this.gameState = newState;
    if (this.onStateChange) this.onStateChange(newState);

    // If resuming from PAUSED to PLAYING, restart the requestAnimationFrame loop
    if (prevState === 'PAUSED' && newState === 'PLAYING') {
      this.lastTime = performance.now();
      this.loop(this.lastTime);
    }
  }

  // --- CONTROLS ---
  public moveLeft() {
    if (this.gameState !== 'PLAYING') return;
    if (this.targetLane > -1) {
      this.targetLane = (this.targetLane - 1) as Lane;
      audioManager.playJumpSound();
    }
  }

  public moveRight() {
    if (this.gameState !== 'PLAYING') return;
    if (this.targetLane < 1) {
      this.targetLane = (this.targetLane + 1) as Lane;
      audioManager.playJumpSound();
    }
  }

  public jump() {
    if (this.gameState !== 'PLAYING') return;
    const hasEagleWings = this.activePowerUps.some(p => p.type === 'EAGLE_WINGS');
    
    if (!this.isJumping || hasEagleWings) {
      this.isJumping = true;
      this.isSliding = false;
      const horse = HORSE_BREEDS.find(h => h.id === this.profile.equippedHorseId) || HORSE_BREEDS[0];
      let jumpMultiplier = horse.baseJumpHeight;
      if (horse.id === 'MOUNTAIN_THUNDER') jumpMultiplier *= 1.2; // Extra powerful high jump for Mountain Thunder (Suldys)

      this.playerVy = GAME_CONFIG.JUMP_VELOCITY * jumpMultiplier;
      audioManager.playJumpSound();
    }
  }

  public slide() {
    if (this.gameState !== 'PLAYING') return;
    if (!this.isSliding) {
      this.isSliding = true;
      this.slideTimer = GAME_CONFIG.SLIDE_DURATION;
      if (this.isJumping && !this.activePowerUps.some(p => p.type === 'EAGLE_WINGS')) {
        this.playerVy = -GAME_CONFIG.JUMP_VELOCITY * 1.2; // Fast drop down
      }
      audioManager.playSlideSound();
    }
  }

  public shootBow() {
    if (this.gameState !== 'PLAYING' || this.archeryCooldown > 0) return;
    if (this.profile.arrowsCount <= 0) return;

    this.profile.arrowsCount--;
    const horse = HORSE_BREEDS.find(h => h.id === this.profile.equippedHorseId) || HORSE_BREEDS[0];
    const cooldownFactor = horse.id === 'STEPPE_WIND' ? 0.7 : 1.0; // Steppe Wind horse reload bonus
    this.archeryCooldown = GAME_CONFIG.BOW_COOLDOWN * cooldownFactor;

    // Arrow projectile speed scales with bow level
    const arrowSpeed = GAME_CONFIG.ARROW_SPEED * (1 + (this.profile.bowLevel - 1) * 0.1);

    // Spawn arrow
    this.arrows.push({
      id: `arrow_${Date.now()}_${Math.random()}`,
      lane: this.targetLane,
      z: this.cameraZ + 12,
      speed: arrowSpeed,
      active: true
    });

    audioManager.playBowShot();
  }

  // Main Loop
  private loop = (currentTime: number) => {
    if (this.gameState !== 'PLAYING') return;

    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;
    this.totalTime += dt;

    this.update(dt);
    this.render();

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    const horse = HORSE_BREEDS.find(h => h.id === this.profile.equippedHorseId) || HORSE_BREEDS[0];
    const heroLevelMultiplier = 1 + (this.profile.heroLevel - 1) * 0.05;

    // 1. Acceleration & Distance (Progressive difficulty per chapter & horse speed & hero level)
    const chapterSpeedBase = (GAME_CONFIG.LANE_SPEED_BASE + (this.currentChapterId - 1) * 3.5) * horse.baseSpeed * heroLevelMultiplier;
    this.currentSpeed = Math.min(
      GAME_CONFIG.LANE_SPEED_MAX,
      chapterSpeedBase + (this.distanceRun / 100) * GAME_CONFIG.ACCELERATION
    );

    const hasSpeedWind = this.activePowerUps.some(p => p.type === 'SPEED_WIND');
    const effectiveSpeed = hasSpeedWind ? this.currentSpeed * 1.5 : this.currentSpeed;

    this.cameraZ += effectiveSpeed * dt;
    this.distanceRun += (effectiveSpeed * dt) / 3;
    this.score = Math.floor(this.distanceRun * GAME_CONFIG.SCORE_PER_METER + this.tokensCollectedInRun * GAME_CONFIG.TOKEN_SCORE_BONUS);

    // 2. Interpolate Player Lane X Position
    const targetX = this.targetLane * GAME_CONFIG.LANE_WIDTH;
    this.playerX += (targetX - this.playerX) * Math.min(1.0, dt * 14);
    if (Math.abs(this.playerX - targetX) < 0.05) {
      this.playerLane = this.targetLane;
    }

    // 3. Jump & Flight Physics
    const hasEagleWings = this.activePowerUps.some(p => p.type === 'EAGLE_WINGS');
    if (hasEagleWings) {
      // Hover altitude
      const targetHoverY = 4.5;
      this.playerY += (targetHoverY - this.playerY) * dt * 8;
    } else {
      if (this.isJumping || this.playerY > 0) {
        this.playerY += this.playerVy * dt;
        this.playerVy += GAME_CONFIG.GRAVITY * dt;

        if (this.playerY <= 0) {
          this.playerY = 0;
          this.playerVy = 0;
          this.isJumping = false;
        }
      }
    }

    // 4. Slide Timer
    if (this.isSliding) {
      this.slideTimer -= dt;
      if (this.slideTimer <= 0) {
        this.isSliding = false;
      }
    }

    // 5. Archery Cooldown
    if (this.archeryCooldown > 0) {
      this.archeryCooldown -= dt;
    }

    // 6. Update Active Powerups
    this.activePowerUps.forEach(p => p.remainingTime -= dt);
    this.activePowerUps = this.activePowerUps.filter(p => p.remainingTime > 0);

    // Check Celestial Auto-Arrow
    if (this.activePowerUps.some(p => p.type === 'CELESTIAL_ARROW')) {
      if (Math.random() < 0.08 && this.enemies.some(e => !e.destroyed && e.z > this.cameraZ)) {
        const targetEnemy = this.enemies.find(e => !e.destroyed && e.z > this.cameraZ);
        if (targetEnemy) {
          this.arrows.push({
            id: `celestial_${Date.now()}`,
            lane: targetEnemy.lane,
            z: this.cameraZ + 10,
            speed: GAME_CONFIG.ARROW_SPEED * 1.2,
            active: true
          });
          audioManager.playBowShot();
        }
      }
    }

    // Check Safe Lane Hint for Ancestral Path
    if (this.activePowerUps.some(p => p.type === 'ANCESTRAL_PATH')) {
      this.safeLaneHint = this.findSafeLane();
    } else {
      this.safeLaneHint = undefined;
    }

    // 7. Magnet Effect for Tokens (Speed Wind)
    if (hasSpeedWind) {
      this.collectibles.forEach(item => {
        if (!item.collected && item.type === 'TOKEN' && item.z - this.cameraZ < 45) {
          item.lane = this.targetLane;
        }
      });
    }

    // 8. Update Projectile Arrows & Hit Detection
    const bowDamage = 1 + (this.profile.bowLevel - 1) * 0.5;

    this.arrows.forEach(arrow => {
      if (!arrow.active) return;
      arrow.z += arrow.speed * dt;

      // Hit enemy check
      this.enemies.forEach(enemy => {
        if (!enemy.destroyed && enemy.lane === arrow.lane && Math.abs(enemy.z - arrow.z) < 3.2) {
          enemy.hp -= bowDamage;
          arrow.active = false;
          audioManager.playHitSound();

          if (enemy.hp <= 0) {
            enemy.destroyed = true;
            this.enemiesDefeatedInRun++;
            this.score += GAME_CONFIG.ENEMY_KILL_BONUS;

            // Spawn particle burst
            for (let i = 0; i < 8; i++) {
              this.particles.push({
                x: enemy.lane * GAME_CONFIG.LANE_WIDTH,
                y: 1.5,
                z: enemy.z,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 4,
                vz: (Math.random() - 0.5) * 4,
                size: 4,
                color: '#EF4444',
                life: 0.6,
                maxLife: 0.6
              });
            }
          }
        }
      });

      // Arrow destroying obstacles (Rocks, Barricades, Rockfalls, Logs)
      this.obstacles.forEach(obs => {
        if (!obs.destroyed && obs.lane === arrow.lane && Math.abs(obs.z - arrow.z) < 3.0) {
          if (obs.canDestroyWithBow || obs.type === 'ROCK' || obs.type === 'ROCKFALL' || obs.type === 'LOG') {
            obs.destroyed = true;
            arrow.active = false;
            this.score += 50;
            audioManager.playHitSound();

            for (let i = 0; i < 10; i++) {
              this.particles.push({
                x: obs.lane * GAME_CONFIG.LANE_WIDTH,
                y: 1.2,
                z: obs.z,
                vx: (Math.random() - 0.5) * 5,
                vy: Math.random() * 5,
                vz: (Math.random() - 0.5) * 5,
                size: 5,
                color: obs.type === 'ROCK' || obs.type === 'ROCKFALL' ? '#94A3B8' : '#78350F',
                life: 0.6,
                maxLife: 0.6
              });
            }
          }
        }
      });

      if (arrow.z > this.cameraZ + 140) arrow.active = false;
    });

    // 9. Collectible Pickups
    const playerZ = this.cameraZ + 10;
    this.collectibles.forEach(item => {
      if (!item.collected && item.lane === this.targetLane && Math.abs(item.z - playerZ) < 2.5) {
        if (this.playerY < 3.5 || hasEagleWings) {
          item.collected = true;
          if (item.type === 'TOKEN') {
            // Celestial Mane special trait: +1 bonus token (2 tokens total per pickup)
            const tokenBonus = horse.id === 'CELESTIAL_MANE' ? 2 : 1;
            this.tokensCollectedInRun += tokenBonus;
            audioManager.playTokenSound();
          } else if (item.type === 'ARROW') {
            this.profile.arrowsCount += 5 + Math.floor(this.profile.bowLevel * 0.5);
            audioManager.playPowerUpSound();
          } else if (item.type === 'POWERUP' && item.powerUpType) {
            this.activatePowerUp(item.powerUpType);
          } else if (item.type === 'LORE_FRAGMENT' && item.fragmentId) {
            if (!this.profile.unlockedLoreIds.includes(item.fragmentId)) {
              this.profile.unlockedLoreIds.push(item.fragmentId);
            }
            audioManager.playPowerUpSound();
          }
        }
      }
    });

    // 10. Player Collision Detection with Obstacles
    const hasShield = this.activePowerUps.some(p => p.type === 'SHIELD_SPIRIT');
    const hasHeroVoice = this.activePowerUps.some(p => p.type === 'HERO_VOICE');

    this.obstacles.forEach(obs => {
      if (!obs.destroyed && obs.lane === this.targetLane && Math.abs(obs.z - playerZ) < 2.2) {
        // Unexpected Rockfall stone check: if the stone is still falling high up in the sky, pass safely!
        if (obs.type === 'ROCKFALL' && obs.z - playerZ > 15) {
          return;
        }

        if (hasHeroVoice) {
          // Voice clears obstacle
          obs.destroyed = true;
          audioManager.playHitSound();
          return;
        }

        if (hasEagleWings) {
          // Soar over
          return;
        }

        // Jump over / Slide under check
        let safe = false;
        const isMountainThunder = horse.id === 'MOUNTAIN_THUNDER';

        if (obs.canJumpOver && this.playerY > 1.8) safe = true;
        // Mountain Thunder (Suldys) can jump high OVER rocks, fences (barricades), logs, stone ovao & rockfalls!
        if (isMountainThunder && (obs.type === 'BARRICADE' || obs.type === 'ROCK' || obs.type === 'LOG' || obs.type === 'STONE_OVAO' || obs.type === 'ROCKFALL') && this.playerY > 1.6) {
          safe = true;
        }
        if (obs.canSlideUnder && this.isSliding) safe = true;

        if (!safe) {
          if (hasShield) {
            // Shield absorbs blow
            obs.destroyed = true;
            this.activePowerUps = this.activePowerUps.filter(p => p.type !== 'SHIELD_SPIRIT');
            audioManager.playHitSound();
          } else {
            // GAME OVER!
            this.handleGameOver('Столкновение с препятствием!');
          }
        }
      }
    });

    // Collision with Enemy Riders
    this.enemies.forEach(enemy => {
      if (!enemy.destroyed && enemy.lane === this.targetLane && Math.abs(enemy.z - playerZ) < 2.2) {
        if (hasEagleWings) return;
        if (hasShield) {
          enemy.destroyed = true;
          this.activePowerUps = this.activePowerUps.filter(p => p.type !== 'SHIELD_SPIRIT');
          audioManager.playHitSound();
        } else {
          this.handleGameOver('Вражеский воин преградил путь!');
        }
      }
    });

    // 11. Generate More Segments ahead
    if (this.cameraZ + 120 > this.nextSegmentZ) {
      this.generateSegment();
    }

    // 12. Check Chapter Distance Goal
    const chap = STORY_CHAPTERS.find(c => c.id === this.currentChapterId);
    if (chap && this.distanceRun >= chap.targetDistance) {
      this.handleChapterComplete();
    }

    // 13. UI Progress Callback
    if (this.onRunUpdate) {
      this.onRunUpdate({
        distance: Math.floor(this.distanceRun),
        score: this.score,
        tokens: this.tokensCollectedInRun,
        arrows: this.profile.arrowsCount,
        speed: Math.floor(effectiveSpeed),
        chapterProgressPct: chap ? Math.min(100, Math.floor((this.distanceRun / chap.targetDistance) * 100)) : 100
      });
    }
  }

  // Activate Powerup
  public activatePowerUp(pType: PowerUpType) {
    const pDef = GAME_CONFIG.POWERUPS[pType];
    if (!pDef) return;

    audioManager.playPowerUpSound();
    const existing = this.activePowerUps.find(p => p.type === pType);
    if (existing) {
      existing.remainingTime = pDef.durationSeconds;
    } else {
      this.activePowerUps.push({
        type: pType,
        remainingTime: pDef.durationSeconds,
        maxTime: pDef.durationSeconds
      });
    }
  }

  // Find a safe lane for Ancestral Path
  private findSafeLane(): Lane {
    const checkZ = this.cameraZ + 25;
    const occupiedLanes = new Set<Lane>();
    this.obstacles.forEach(o => {
      if (!o.destroyed && Math.abs(o.z - checkZ) < 15) {
        occupiedLanes.add(o.lane);
      }
    });

    const candidateLanes: Lane[] = [-1, 0, 1];
    const freeLane = candidateLanes.find(l => !occupiedLanes.has(l));
    return freeLane !== undefined ? freeLane : 0;
  }

  // Segment Generator (Guaranteed safe path)
  private generateSegment() {
    const segZ = this.nextSegmentZ;
    this.nextSegmentZ += GAME_CONFIG.SEGMENT_LENGTH;

    // Available obstacle pool based on chapter and biome
    const obstacleTypes: Array<'YURT' | 'ROCK' | 'LOG' | 'BARRICADE' | 'STONE_OVAO' | 'TREE_BRANCH' | 'ROCKFALL'> = [
      'YURT', 'ROCK', 'LOG', 'BARRICADE', 'STONE_OVAO'
    ];

    if (this.currentChapterId >= 2 || this.biome.id === 'SACRED_MOUNTAIN') {
      obstacleTypes.push('ROCKFALL');
    }

    if (this.currentChapterId >= 3 || this.biome.id === 'TAIGA' || this.biome.id === 'ENEMY_BORDER') {
      obstacleTypes.push('TREE_BRANCH', 'TREE_BRANCH'); // Extra weight for tree branches from chapter 3!
    }

    const safeLane = (Math.floor(Math.random() * 3) - 1) as Lane;
    const obstacleDensity = Math.min(0.85, 0.55 + this.currentChapterId * 0.05);

    // Place obstacles on non-safe lanes
    ([-1, 0, 1] as Lane[]).forEach(lane => {
      if (lane !== safeLane && Math.random() < obstacleDensity) {
        const obsType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
        const obsZ = segZ + Math.random() * 25 + 5;

        this.obstacles.push({
          id: `obs_${segZ}_${lane}`,
          type: obsType,
          lane,
          z: obsZ,
          width: 1,
          height: 1,
          canJumpOver: obsType === 'LOG' || obsType === 'ROCK',
          canSlideUnder: obsType === 'BARRICADE' || obsType === 'TREE_BRANCH',
          canDestroyWithBow: obsType === 'BARRICADE' || obsType === 'TREE_BRANCH' || obsType === 'ROCKFALL'
        });

        // Spawn Gold Tokens IMMEDIATELY BEHIND the obstacle to reward clean jumps/slides!
        if (obsType === 'LOG' || obsType === 'ROCK' || obsType === 'TREE_BRANCH' || obsType === 'BARRICADE') {
          for (let k = 1; k <= 3; k++) {
            this.collectibles.push({
              id: `tok_behind_${segZ}_${lane}_${k}`,
              type: 'TOKEN',
              lane: lane,
              z: obsZ + k * 5 + 4,
              collected: false
            });
          }
        }
      }
    });

    // Place Gold Tokens in formations along safe lane
    for (let i = 0; i < 5; i++) {
      this.collectibles.push({
        id: `tok_${segZ}_${i}`,
        type: 'TOKEN',
        lane: safeLane,
        z: segZ + i * 7 + 8,
        collected: false
      });
    }

    // Random PowerUp or Arrow Quiver
    if (Math.random() < 0.28) {
      const pTypes: PowerUpType[] = ['SPEED_WIND', 'EAGLE_WINGS', 'HERO_VOICE', 'CELESTIAL_ARROW', 'SHIELD_SPIRIT', 'ANCESTRAL_PATH'];
      const chosenP = pTypes[Math.floor(Math.random() * pTypes.length)];
      this.collectibles.push({
        id: `powerup_${segZ}`,
        type: 'POWERUP',
        powerUpType: chosenP,
        lane: safeLane,
        z: segZ + 35,
        collected: false
      });
    } else if (Math.random() < 0.30) {
      this.collectibles.push({
        id: `arrow_pack_${segZ}`,
        type: 'ARROW',
        lane: safeLane,
        z: segZ + 45,
        collected: false
      });
    }

    // Spawn Enemy Rider in higher chapters with scaling HP & frequency
    const enemyChance = Math.min(0.65, 0.15 + this.currentChapterId * 0.08);
    if (this.currentChapterId >= 2 && Math.random() < enemyChance) {
      const enemyHp = this.currentChapterId >= 5 ? 3 : this.currentChapterId >= 3 ? 2 : 1;
      this.enemies.push({
        id: `enemy_${segZ}`,
        lane: (Math.floor(Math.random() * 3) - 1) as Lane,
        z: segZ + 55,
        hp: enemyHp,
        maxHp: enemyHp,
        speed: 0,
        isRider: true
      });
    }
  }

  // Handle Game Over
  private handleGameOver(reason: string) {
    audioManager.stopMusic();
    audioManager.playHitSound();

    this.profile.tokens += this.tokensCollectedInRun;
    this.profile.totalDistanceRun += Math.floor(this.distanceRun);
    if (this.score > this.profile.highScore) {
      this.profile.highScore = this.score;
    }

    this.setState('GAME_OVER');
    if (this.onGameOver) this.onGameOver(reason);
  }

  // Handle Chapter Complete
  private handleChapterComplete() {
    audioManager.stopMusic();

    if (!this.profile.completedChapters.includes(this.currentChapterId)) {
      this.profile.completedChapters.push(this.currentChapterId);
    }

    // Unlock next chapter if available and current max chapter is increased
    const nextChapId = this.currentChapterId + 1;
    if (nextChapId <= 7) {
      if (nextChapId > this.profile.currentChapter) {
        this.profile.currentChapter = nextChapId;
      }
    }

    this.profile.tokens += this.tokensCollectedInRun + 200; // Bonus
    this.profile.totalDistanceRun += Math.floor(this.distanceRun);

    this.setState('CHAPTER_COMPLETE');
    if (this.onChapterComplete) this.onChapterComplete(this.currentChapterId);
  }

  // Render Frame
  private render() {
    const params = {
      biome: this.biome,
      cameraZ: this.cameraZ,
      playerX: this.playerX,
      playerY: this.playerY,
      playerLane: this.playerLane,
      isSliding: this.isSliding,
      equippedHorseId: this.profile.equippedHorseId,
      obstacles: this.obstacles,
      enemies: this.enemies,
      collectibles: this.collectibles,
      arrows: this.arrows,
      particles: this.particles,
      activePowerUps: this.activePowerUps,
      safeLaneHint: this.safeLaneHint,
      time: this.totalTime
    };

    if (this.renderer3D) {
      this.renderer3D.renderScene(params);
    } else if (this.renderer2D) {
      this.renderer2D.renderScene(params);
    }
  }

  public stopEngine() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    audioManager.stopMusic();
  }
}
