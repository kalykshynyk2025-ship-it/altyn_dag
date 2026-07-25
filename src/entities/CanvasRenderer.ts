import { BiomeConfig, Lane, Obstacle, Enemy, CollectibleItem, ArrowProjectile, ActivePowerUpState, Particle } from '../types/game';
import { GAME_CONFIG } from '../config/gameConfig';
import { HORSE_BREEDS } from '../narrative/storyData';

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number = 0;
  private height: number = 0;
  private horizonY: number = 0;
  private cameraFocalLength: number = 320;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.horizonY = height * 0.42; // Horizon line at 42% from top
  }

  // Perspective 3D -> 2D projection helper
  private project(x: number, y: number, z: number): { px: number; py: number; scale: number; visible: boolean } {
    if (z <= 1) return { px: 0, py: 0, scale: 0, visible: false };
    const scale = this.cameraFocalLength / z;
    const px = this.width / 2 + x * scale * 38;
    const py = this.horizonY - y * scale * 38 + (1 / scale) * 0.8;
    return { px, py, scale, visible: z > 1 && z < 180 };
  }

  public renderScene(params: {
    biome: BiomeConfig;
    cameraZ: number;
    playerX: number; // Current interpolated X position
    playerY: number; // Current Y altitude (jump/fly)
    playerLane: Lane;
    isSliding: boolean;
    equippedHorseId: string;
    obstacles: Obstacle[];
    enemies: Enemy[];
    collectibles: CollectibleItem[];
    arrows: ArrowProjectile[];
    particles: Particle[];
    activePowerUps: ActivePowerUpState[];
    safeLaneHint?: Lane;
    time: number;
  }) {
    const {
      biome,
      cameraZ,
      playerX,
      playerY,
      equippedHorseId,
      obstacles,
      enemies,
      collectibles,
      arrows,
      particles,
      activePowerUps,
      safeLaneHint,
      time
    } = params;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Render Sky Gradient & Sun
    this.drawSky(biome, time);

    // 2. Render Distant Mountains & Horizon
    this.drawDistantMountains(biome);

    // 3. Render Ground & 3 Lanes
    this.drawGroundAndLanes(biome, cameraZ, safeLaneHint);

    // 4. Render Active PowerUp World Overlays (Ancestral Path line, etc.)
    if (safeLaneHint !== undefined) {
      this.drawAncestralPath(safeLaneHint, cameraZ, time);
    }

    // 5. Sort all 3D entities (obstacles, collectibles, enemies, player) by Z distance (back-to-front rendering)
    const renderList: Array<{ type: 'OBSTACLE' | 'ENEMY' | 'COLLECTIBLE' | 'ARROW' | 'PLAYER'; z: number; obj?: any }> = [];

    obstacles.forEach(obs => {
      if (!obs.destroyed && obs.z > cameraZ && obs.z < cameraZ + 140) {
        renderList.push({ type: 'OBSTACLE', z: obs.z, obj: obs });
      }
    });

    enemies.forEach(enemy => {
      if (!enemy.destroyed && enemy.z > cameraZ && enemy.z < cameraZ + 140) {
        renderList.push({ type: 'ENEMY', z: enemy.z, obj: enemy });
      }
    });

    collectibles.forEach(item => {
      if (!item.collected && item.z > cameraZ && item.z < cameraZ + 140) {
        renderList.push({ type: 'COLLECTIBLE', z: item.z, obj: item });
      }
    });

    arrows.forEach(arrow => {
      if (arrow.active && arrow.z > cameraZ && arrow.z < cameraZ + 140) {
        renderList.push({ type: 'ARROW', z: arrow.z, obj: arrow });
      }
    });

    // Player position Z is constant relative to camera view (e.g. cameraZ + 8)
    const playerZ = cameraZ + 10;
    renderList.push({ type: 'PLAYER', z: playerZ });

    // Sort descending Z (farthest first)
    renderList.sort((a, b) => b.z - a.z);

    // 6. Draw 3D Entities in Order
    renderList.forEach(item => {
      const relZ = item.z - cameraZ;
      if (item.type === 'PLAYER') {
        this.drawPlayer({
          x: playerX,
          y: playerY,
          relZ: 10,
          equippedHorseId,
          isSliding: params.isSliding,
          activePowerUps,
          time
        });
      } else if (item.type === 'OBSTACLE') {
        this.drawObstacle(item.obj, relZ);
      } else if (item.type === 'ENEMY') {
        this.drawEnemy(item.obj, relZ, time);
      } else if (item.type === 'COLLECTIBLE') {
        this.drawCollectible(item.obj, relZ, time);
      } else if (item.type === 'ARROW') {
        this.drawArrow(item.obj, relZ);
      }
    });

    // 7. Render Particles & Weather Effects
    this.drawParticles(particles, cameraZ);
    this.drawWeatherEffects(biome, time);

    // 8. Render Voice Shockwave or Eagle Wings Aura if active
    const voiceActive = activePowerUps.find(p => p.type === 'HERO_VOICE');
    if (voiceActive) {
      this.drawVoiceShockwave(voiceActive, time);
    }
  }

  // Sky rendering
  private drawSky(biome: BiomeConfig, time: number) {
    const skyGrad = this.ctx.createLinearGradient(0, 0, 0, this.horizonY);
    skyGrad.addColorStop(0, biome.skyGradient[0]);
    skyGrad.addColorStop(1, biome.skyGradient[1]);
    this.ctx.fillStyle = skyGrad;
    this.ctx.fillRect(0, 0, this.width, this.horizonY);

    // Golden Sun / Moon
    this.ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
    this.ctx.beginPath();
    this.ctx.arc(this.width * 0.75, this.horizonY * 0.35, 34, 0, Math.PI * 2);
    this.ctx.fill();

    // Subtle sun glow
    this.ctx.fillStyle = 'rgba(254, 240, 138, 0.18)';
    this.ctx.beginPath();
    this.ctx.arc(this.width * 0.75, this.horizonY * 0.35, 68, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // Distant Mountains
  private drawDistantMountains(biome: BiomeConfig) {
    this.ctx.fillStyle = biome.horizonColor;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.horizonY);

    const mountainPeaks = [
      { x: 0.0, h: 45 },
      { x: 0.15, h: 80 },
      { x: 0.3, h: 50 },
      { x: 0.45, h: 95 },
      { x: 0.6, h: 60 },
      { x: 0.75, h: 85 },
      { x: 0.9, h: 55 },
      { x: 1.0, h: 40 },
    ];

    mountainPeaks.forEach(peak => {
      this.ctx.lineTo(peak.x * this.width, this.horizonY - peak.h);
    });
    this.ctx.lineTo(this.width, this.horizonY);
    this.ctx.closePath();
    this.ctx.fill();

    // Snow peak caps for mountains
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    mountainPeaks.forEach(peak => {
      if (peak.h > 65) {
        this.ctx.beginPath();
        this.ctx.moveTo(peak.x * this.width - 18, this.horizonY - peak.h + 20);
        this.ctx.lineTo(peak.x * this.width, this.horizonY - peak.h);
        this.ctx.lineTo(peak.x * this.width + 18, this.horizonY - peak.h + 20);
        this.ctx.closePath();
        this.ctx.fill();
      }
    });
  }

  // Ground and 3 Lanes Perspective Projection
  private drawGroundAndLanes(biome: BiomeConfig, cameraZ: number, safeLaneHint?: Lane) {
    // Fill Ground Below Horizon
    const groundGrad = this.ctx.createLinearGradient(0, this.horizonY, 0, this.height);
    groundGrad.addColorStop(0, biome.horizonColor);
    groundGrad.addColorStop(0.2, biome.groundColor);
    groundGrad.addColorStop(1, '#1C1917');
    this.ctx.fillStyle = groundGrad;
    this.ctx.fillRect(0, this.horizonY, this.width, this.height - this.horizonY);

    // Draw Main Runner Track & 3 Lanes
    const nearZ = 4;
    const farZ = 120;

    const nearLeft = this.project(-GAME_CONFIG.LANE_WIDTH * 1.8, 0, nearZ);
    const nearRight = this.project(GAME_CONFIG.LANE_WIDTH * 1.8, 0, nearZ);
    const farLeft = this.project(-GAME_CONFIG.LANE_WIDTH * 1.8, 0, farZ);
    const farRight = this.project(GAME_CONFIG.LANE_WIDTH * 1.8, 0, farZ);

    // Track Surface Poly
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    this.ctx.beginPath();
    this.ctx.moveTo(farLeft.px, farLeft.py);
    this.ctx.lineTo(farRight.px, farRight.py);
    this.ctx.lineTo(nearRight.px, nearRight.py);
    this.ctx.lineTo(nearLeft.px, nearLeft.py);
    this.ctx.closePath();
    this.ctx.fill();

    // Lane Divider Lines
    const laneDividers = [-0.5, 0.5];
    this.ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
    this.ctx.lineWidth = 2;

    laneDividers.forEach(offset => {
      const pNear = this.project(offset * GAME_CONFIG.LANE_WIDTH * 2, 0, nearZ);
      const pFar = this.project(offset * GAME_CONFIG.LANE_WIDTH * 2, 0, farZ);

      this.ctx.beginPath();
      this.ctx.setLineDash([12, 12]);
      this.ctx.moveTo(pFar.px, pFar.py);
      this.ctx.lineTo(pNear.px, pNear.py);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    });

    // Horizontal Steppe Grid / Speed Lines
    const gridStep = 8;
    const firstGridZ = Math.floor(cameraZ / gridStep) * gridStep;
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    this.ctx.lineWidth = 1;

    for (let z = firstGridZ; z < cameraZ + farZ; z += gridStep) {
      if (z < cameraZ + nearZ) continue;
      const relZ = z - cameraZ;
      const pL = this.project(-GAME_CONFIG.LANE_WIDTH * 1.8, 0, relZ);
      const pR = this.project(GAME_CONFIG.LANE_WIDTH * 1.8, 0, relZ);

      this.ctx.beginPath();
      this.ctx.moveTo(pL.px, pL.py);
      this.ctx.lineTo(pR.px, pR.py);
      this.ctx.stroke();
    }
  }

  // Ancestral Path Overlay (Bright Golden Glowing Safe Trajectory)
  private drawAncestralPath(safeLane: Lane, cameraZ: number, time: number) {
    const laneX = safeLane * GAME_CONFIG.LANE_WIDTH;
    const halfWidth = GAME_CONFIG.LANE_WIDTH * 0.45;

    const zNear = 5;
    const zFar = 110;
    const step = 4;

    this.ctx.save();

    // 1. Glowing perspective golden road segments
    for (let z = zNear; z < zFar; z += step) {
      const z1 = z;
      const z2 = z + step;

      const p1L = this.project(laneX - halfWidth, 0.05, z1);
      const p1R = this.project(laneX + halfWidth, 0.05, z1);
      const p2R = this.project(laneX + halfWidth, 0.05, z2);
      const p2L = this.project(laneX - halfWidth, 0.05, z2);

      if (!p1L.visible && !p2L.visible) continue;

      const alpha = Math.max(0, 0.7 - (z / zFar) * 0.55);

      // Gold ground fill glow
      this.ctx.fillStyle = `rgba(245, 158, 11, ${alpha})`;
      this.ctx.beginPath();
      this.ctx.moveTo(p1L.px, p1L.py);
      this.ctx.lineTo(p1R.px, p1R.py);
      this.ctx.lineTo(p2R.px, p2R.py);
      this.ctx.lineTo(p2L.px, p2L.py);
      this.ctx.closePath();
      this.ctx.fill();

      // Bright edge lines
      this.ctx.strokeStyle = `rgba(254, 240, 138, ${alpha + 0.3})`;
      this.ctx.lineWidth = Math.max(1.5, p1L.scale * 6);
      this.ctx.beginPath();
      this.ctx.moveTo(p1L.px, p1L.py);
      this.ctx.lineTo(p2L.px, p2L.py);
      this.ctx.moveTo(p1R.px, p1R.py);
      this.ctx.lineTo(p2R.px, p2R.py);
      this.ctx.stroke();
    }

    // 2. Animated golden chevrons / forward arrows
    const arrowSpacing = 16;
    const offset = (time * 35) % arrowSpacing;
    for (let z = zNear + offset; z < zFar; z += arrowSpacing) {
      const pCenter = this.project(laneX, 0.2, z);
      const pAhead = this.project(laneX, 0.2, z + 5);
      if (!pCenter.visible) continue;

      const scale = pCenter.scale * 32;
      const alpha = Math.max(0, 0.95 - (z / zFar) * 0.75);

      this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      this.ctx.lineWidth = Math.max(2.5, scale * 0.2);
      this.ctx.beginPath();
      this.ctx.moveTo(pCenter.px - scale * 0.45, pCenter.py + scale * 0.35);
      this.ctx.lineTo(pAhead.px, pAhead.py);
      this.ctx.lineTo(pCenter.px + scale * 0.45, pCenter.py + scale * 0.35);
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  // Draw Hero Riding the Epic Steed
  private drawPlayer(params: {
    x: number;
    y: number;
    relZ: number;
    equippedHorseId: string;
    isSliding: boolean;
    activePowerUps: ActivePowerUpState[];
    time: number;
  }) {
    const { x, y, relZ, equippedHorseId, isSliding, activePowerUps, time } = params;
    const proj = this.project(x, y, relZ);
    if (!proj.visible) return;

    const horse = HORSE_BREEDS.find(h => h.id === equippedHorseId) || HORSE_BREEDS[0];
    const scale = proj.scale * 1.35;

    // 1. Shadow on ground
    const shadowProj = this.project(x, 0, relZ);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    this.ctx.beginPath();
    this.ctx.ellipse(shadowProj.px, shadowProj.py, 38 * scale, 14 * scale, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.save();
    this.ctx.translate(proj.px, proj.py);

    // Check Flight (Eagle Wings) or Shield
    const hasEagleWings = activePowerUps.some(p => p.type === 'EAGLE_WINGS');
    const hasShield = activePowerUps.some(p => p.type === 'SHIELD_SPIRIT');
    const hasSpeedWind = activePowerUps.some(p => p.type === 'SPEED_WIND');

    // Gallop motion offset
    const gallopOffset = Math.sin(time * 22) * (hasEagleWings ? 2 : 7) * scale;

    // Eagle Wings Aura
    if (hasEagleWings) {
      this.ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      this.ctx.beginPath();
      this.ctx.arc(0, -25 * scale, 65 * scale, 0, Math.PI * 2);
      this.ctx.fill();

      // Wing graphics
      this.ctx.strokeStyle = '#7DD3FC';
      this.ctx.lineWidth = 4 * scale;
      this.ctx.beginPath();
      // Left wing
      this.ctx.moveTo(-15 * scale, -25 * scale);
      this.ctx.quadraticCurveTo(-75 * scale, -65 * scale + Math.sin(time * 15) * 15, -60 * scale, 10 * scale);
      // Right wing
      this.ctx.moveTo(15 * scale, -25 * scale);
      this.ctx.quadraticCurveTo(75 * scale, -65 * scale + Math.sin(time * 15) * 15, 60 * scale, 10 * scale);
      this.ctx.stroke();
    }

    // Shield Aura
    if (hasShield) {
      this.ctx.strokeStyle = '#10B981';
      this.ctx.lineWidth = 5 * scale;
      this.ctx.beginPath();
      this.ctx.arc(0, -30 * scale, 55 * scale, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      this.ctx.fill();
    }

    // Speed Wind Trail
    if (hasSpeedWind) {
      this.ctx.fillStyle = 'rgba(234, 179, 8, 0.3)';
      this.ctx.beginPath();
      this.ctx.ellipse(0, 10 * scale, 45 * scale, 15 * scale, 0, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // --- HORSE BODY ---
    // Horse Body Main
    this.ctx.fillStyle = horse.colorPrimary;
    this.ctx.beginPath();
    if (isSliding) {
      // Crouch stance
      this.ctx.ellipse(0, -12 * scale, 34 * scale, 18 * scale, 0, 0, Math.PI * 2);
    } else {
      this.ctx.ellipse(0, -30 * scale + gallopOffset, 32 * scale, 24 * scale, 0, 0, Math.PI * 2);
    }
    this.ctx.fill();

    // Horse Legs
    this.ctx.strokeStyle = horse.colorPrimary;
    this.ctx.lineWidth = 6 * scale;
    const legPhase = Math.sin(time * 24);

    if (!isSliding) {
      this.ctx.beginPath();
      // Left leg
      this.ctx.moveTo(-16 * scale, -15 * scale + gallopOffset);
      this.ctx.lineTo(-22 * scale + legPhase * 12, 0);
      // Right leg
      this.ctx.moveTo(16 * scale, -15 * scale + gallopOffset);
      this.ctx.lineTo(22 * scale - legPhase * 12, 0);
      this.ctx.stroke();
    }

    // Horse Neck & Head
    this.ctx.fillStyle = horse.colorPrimary;
    this.ctx.beginPath();
    const neckY = isSliding ? -18 * scale : -45 * scale + gallopOffset;
    this.ctx.arc(0, neckY, 18 * scale, 0, Math.PI * 2);
    this.ctx.fill();

    // Horse Mane
    this.ctx.fillStyle = horse.colorMane;
    this.ctx.beginPath();
    this.ctx.arc(0, neckY - 8 * scale, 12 * scale, 0, Math.PI * 2);
    this.ctx.fill();

    // --- HERO RIDER ---
    // Hero Coat (Deel) - Deep Tuvan Red / Blue
    this.ctx.fillStyle = '#B91C1C';
    this.ctx.beginPath();
    const riderY = isSliding ? -22 * scale : -55 * scale + gallopOffset;
    this.ctx.fillRect(-12 * scale, riderY, 24 * scale, 26 * scale);

    // Gold Belt
    this.ctx.fillStyle = '#F59E0B';
    this.ctx.fillRect(-13 * scale, riderY + 14 * scale, 26 * scale, 4 * scale);

    // Hero Head & Headband
    this.ctx.fillStyle = '#FDBA74'; // Skin tone
    this.ctx.beginPath();
    this.ctx.arc(0, riderY - 8 * scale, 10 * scale, 0, Math.PI * 2);
    this.ctx.fill();

    // Traditional Fur Hat / Headband
    this.ctx.fillStyle = '#451A03';
    this.ctx.beginPath();
    this.ctx.arc(0, riderY - 12 * scale, 11 * scale, Math.PI, Math.PI * 2);
    this.ctx.fill();

    // Hero Bow
    this.ctx.strokeStyle = '#D97706';
    this.ctx.lineWidth = 3 * scale;
    this.ctx.beginPath();
    this.ctx.arc(14 * scale, riderY + 2 * scale, 16 * scale, -Math.PI * 0.4, Math.PI * 0.4);
    this.ctx.stroke();

    this.ctx.restore();
  }

  // Draw Procedural Obstacle
  private drawObstacle(obs: Obstacle, relZ: number) {
    const laneX = obs.lane * GAME_CONFIG.LANE_WIDTH;
    const proj = this.project(laneX, 0, relZ);
    if (!proj.visible) return;

    const scale = proj.scale * 1.2;
    this.ctx.save();
    this.ctx.translate(proj.px, proj.py);

    switch (obs.type) {
      case 'YURT':
        // Felt Yurt
        this.ctx.fillStyle = '#F8FAFC'; // White felt
        this.ctx.beginPath();
        this.ctx.ellipse(0, -25 * scale, 38 * scale, 28 * scale, 0, Math.PI, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillRect(-38 * scale, -25 * scale, 76 * scale, 25 * scale);

        // Tuvan Ornamental Band
        this.ctx.fillStyle = '#DC2626';
        this.ctx.fillRect(-38 * scale, -18 * scale, 76 * scale, 6 * scale);

        // Wooden Door Frame
        this.ctx.fillStyle = '#78350F';
        this.ctx.fillRect(-8 * scale, -22 * scale, 16 * scale, 22 * scale);
        break;

      case 'ROCK':
        // Jagged Boulder
        this.ctx.fillStyle = '#64748B';
        this.ctx.beginPath();
        this.ctx.moveTo(-28 * scale, 0);
        this.ctx.lineTo(-20 * scale, -32 * scale);
        this.ctx.lineTo(10 * scale, -40 * scale);
        this.ctx.lineTo(28 * scale, -20 * scale);
        this.ctx.lineTo(22 * scale, 0);
        this.ctx.closePath();
        this.ctx.fill();

        // Facet highlights
        this.ctx.fillStyle = '#94A3B8';
        this.ctx.beginPath();
        this.ctx.moveTo(-20 * scale, -32 * scale);
        this.ctx.lineTo(10 * scale, -40 * scale);
        this.ctx.lineTo(0, -15 * scale);
        this.ctx.closePath();
        this.ctx.fill();
        break;

      case 'LOG':
        // Fallen Tree
        this.ctx.fillStyle = '#78350F';
        this.ctx.fillRect(-38 * scale, -12 * scale, 76 * scale, 12 * scale);
        this.ctx.fillStyle = '#451A03';
        this.ctx.beginPath();
        this.ctx.ellipse(-38 * scale, -6 * scale, 5 * scale, 6 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();
        break;

      case 'BARRICADE':
        // Wooden Spike Barricade
        this.ctx.fillStyle = '#451A03';
        this.ctx.fillRect(-32 * scale, -48 * scale, 64 * scale, 48 * scale);
        this.ctx.strokeStyle = '#DC2626';
        this.ctx.lineWidth = 3 * scale;
        this.ctx.strokeRect(-32 * scale, -48 * scale, 64 * scale, 48 * scale);
        break;

      case 'STONE_OVAO':
        // Sacred Stone Ovaa
        this.ctx.fillStyle = '#475569';
        this.ctx.beginPath();
        this.ctx.moveTo(-25 * scale, 0);
        this.ctx.lineTo(0, -50 * scale);
        this.ctx.lineTo(25 * scale, 0);
        this.ctx.closePath();
        this.ctx.fill();

        // Blue Silk Ribbon (Khadag)
        this.ctx.fillStyle = '#0284C7';
        this.ctx.fillRect(-15 * scale, -30 * scale, 30 * scale, 6 * scale);
        break;

      case 'RIVER_GAP':
        // Gap / River
        this.ctx.fillStyle = '#0284C7';
        this.ctx.fillRect(-35 * scale, -2 * scale, 70 * scale, 15 * scale);
        break;
    }

    this.ctx.restore();
  }

  // Draw Enemy Rider / Patrol
  private drawEnemy(enemy: Enemy, relZ: number, time: number) {
    const laneX = enemy.lane * GAME_CONFIG.LANE_WIDTH;
    const proj = this.project(laneX, 0, relZ);
    if (!proj.visible) return;

    const scale = proj.scale * 1.25;
    this.ctx.save();
    this.ctx.translate(proj.px, proj.py);

    // Dark Enemy Steed
    this.ctx.fillStyle = '#18181B';
    this.ctx.beginPath();
    this.ctx.ellipse(0, -28 * scale, 30 * scale, 22 * scale, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Enemy Rider
    this.ctx.fillStyle = '#991B1B';
    this.ctx.fillRect(-12 * scale, -50 * scale, 24 * scale, 24 * scale);

    // Enemy Helmet
    this.ctx.fillStyle = '#3F3F46';
    this.ctx.beginPath();
    this.ctx.arc(0, -58 * scale, 10 * scale, 0, Math.PI * 2);
    this.ctx.fill();

    // HP Bar if damaged
    if (enemy.hp < enemy.maxHp) {
      const hpPct = enemy.hp / enemy.maxHp;
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      this.ctx.fillRect(-20 * scale, -72 * scale, 40 * scale, 6 * scale);
      this.ctx.fillStyle = '#EF4444';
      this.ctx.fillRect(-20 * scale, -72 * scale, 40 * scale * hpPct, 6 * scale);
    }

    this.ctx.restore();
  }

  // Draw Collectibles & Powerups
  private drawCollectible(item: CollectibleItem, relZ: number, time: number) {
    const laneX = item.lane * GAME_CONFIG.LANE_WIDTH;
    const hoverY = Math.sin(time * 6 + item.z) * 0.4 + 1.2;
    const proj = this.project(laneX, hoverY, relZ);
    if (!proj.visible) return;

    const scale = proj.scale * 1.1;
    this.ctx.save();
    this.ctx.translate(proj.px, proj.py);

    if (item.type === 'TOKEN') {
      // Tuvan Gold Ornamental Coin (Spinning 3D effect)
      const spin = Math.cos(time * 5 + item.z);
      this.ctx.fillStyle = '#F59E0B';
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, Math.abs(spin) * 16 * scale, 16 * scale, 0, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.strokeStyle = '#FEF08A';
      this.ctx.lineWidth = 2 * scale;
      this.ctx.stroke();
    } else if (item.type === 'ARROW') {
      // Arrow quiver bundle
      this.ctx.fillStyle = '#D97706';
      this.ctx.fillRect(-6 * scale, -15 * scale, 12 * scale, 30 * scale);
      this.ctx.fillStyle = '#DC2626';
      this.ctx.beginPath();
      this.ctx.arc(0, -18 * scale, 8 * scale, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (item.type === 'POWERUP' && item.powerUpType) {
      // Floating glowing PowerUp Orb
      const pDef = GAME_CONFIG.POWERUPS[item.powerUpType];
      this.ctx.fillStyle = pDef ? pDef.color : '#38BDF8';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 20 * scale, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineWidth = 3 * scale;
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  // Arrow Projectile Flying Forward
  private drawArrow(arrow: ArrowProjectile, relZ: number) {
    const laneX = arrow.lane * GAME_CONFIG.LANE_WIDTH;
    const proj = this.project(laneX, 1.2, relZ);
    if (!proj.visible) return;

    const scale = proj.scale;
    this.ctx.fillStyle = '#F59E0B';
    this.ctx.beginPath();
    this.ctx.arc(proj.px, proj.py, 6 * scale, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // Draw Particles
  private drawParticles(particles: Particle[], cameraZ: number) {
    particles.forEach(p => {
      const relZ = p.z - cameraZ;
      if (relZ > 1 && relZ < 120) {
        const proj = this.project(p.x, p.y, relZ);
        if (proj.visible) {
          const alpha = p.life / p.maxLife;
          this.ctx.fillStyle = p.color;
          this.ctx.globalAlpha = alpha;
          this.ctx.beginPath();
          this.ctx.arc(proj.px, proj.py, p.size * proj.scale, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.globalAlpha = 1.0;
        }
      }
    });
  }

  // Weather FX (Wind dust, snow, leaves)
  private drawWeatherEffects(biome: BiomeConfig, time: number) {
    if (biome.id === 'SACRED_MOUNTAIN') {
      // Falling mountain snow
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      for (let i = 0; i < 25; i++) {
        const sx = (Math.sin(time * 0.5 + i * 1.5) * 0.5 + 0.5) * this.width;
        const sy = ((time * 120 + i * 45) % this.height);
        this.ctx.beginPath();
        this.ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  // Hero's Voice Shockwave Effect
  private drawVoiceShockwave(pState: ActivePowerUpState, time: number) {
    const radius = ((pState.maxTime - pState.remainingTime) / pState.maxTime) * (this.width * 0.8);
    this.ctx.strokeStyle = 'rgba(239, 68, 68, 0.75)';
    this.ctx.lineWidth = 12;
    this.ctx.beginPath();
    this.ctx.arc(this.width / 2, this.height * 0.7, radius, 0, Math.PI * 2);
    this.ctx.stroke();
  }
}
