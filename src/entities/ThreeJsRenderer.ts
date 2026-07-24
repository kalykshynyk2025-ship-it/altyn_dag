import * as THREE from 'three';
import { BiomeConfig, Lane, Obstacle, Enemy, CollectibleItem, ArrowProjectile, ActivePowerUpState, Particle } from '../types/game';
import { GAME_CONFIG } from '../config/gameConfig';
import { HORSE_BREEDS } from '../narrative/storyData';

const THREE_GLOBAL_MULT = 2.2;

export class ThreeJsRenderer {
  private container: HTMLCanvasElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  // Lighting
  private dirLight: THREE.DirectionalLight;
  private ambLight: THREE.AmbientLight;
  private playerLight: THREE.PointLight;

  // Scene Objects
  private groundMesh: THREE.Mesh;
  private laneLinesGroup: THREE.Group;
  private mountainsGroup: THREE.Group;
  private playerGroup: THREE.Group;
  private horseMeshGroup: THREE.Group;
  private riderMeshGroup: THREE.Group;
  private wingsMeshGroup: THREE.Group;
  private shieldMeshGroup: THREE.Group;

  // Horse Materials & Equipped Breed
  private horseBodyMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.6 });
  private horseManeMat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({ color: 0x1f1915, roughness: 0.8 });
  private currentHorseBreedId: string = '';

  // Horse Leg Joints for Gallop Animation
  private legFrontLeft: THREE.Group;
  private legFrontRight: THREE.Group;
  private legBackLeft: THREE.Group;
  private legBackRight: THREE.Group;

  // Object Pooling / Dynamic Meshes
  private obstacleMeshes: Map<string, THREE.Object3D> = new Map();
  private collectibleMeshes: Map<string, THREE.Object3D> = new Map();
  private enemyMeshes: Map<string, THREE.Object3D> = new Map();
  private arrowMeshes: Map<string, THREE.Object3D> = new Map();

  // Particle System
  private particleGeo: THREE.BufferGeometry;
  private particleMat: THREE.PointsMaterial;
  private particlePoints: THREE.Points;
  private maxParticles = 300;
  private particlePositions: Float32Array;
  private particleColors: Float32Array;

  // Shockwave
  private shockwaveMesh: THREE.Mesh;

  private width = 0;
  private height = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.container = canvas;

    // 1. Scene & Camera Setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#EDC9AF');
    this.scene.fog = new THREE.FogExp2('#EDC9AF', 0.008);

    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 500);
    this.camera.position.set(0, 5, -12);
    this.camera.lookAt(0, 2, 20);

    // 2. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 3. Lighting
    this.ambLight = new THREE.AmbientLight(0xfff8e7, 0.85);
    this.scene.add(this.ambLight);

    this.dirLight = new THREE.DirectionalLight(0xfff0d0, 1.4);
    this.dirLight.position.set(25, 40, -20);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 150;
    this.dirLight.shadow.camera.left = -30;
    this.dirLight.shadow.camera.right = 30;
    this.dirLight.shadow.camera.top = 30;
    this.dirLight.shadow.camera.bottom = -30;
    this.scene.add(this.dirLight);

    this.playerLight = new THREE.PointLight(0xd4af37, 1.2, 15);
    this.scene.add(this.playerLight);

    // 4. Create Ground & Road
    const groundGeo = new THREE.PlaneGeometry(120, 600);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x556b2f,
      roughness: 0.8,
      metalness: 0.1
    });
    this.groundMesh = new THREE.Mesh(groundGeo, groundMat);
    this.groundMesh.rotation.x = -Math.PI / 2;
    this.groundMesh.position.set(0, 0, 250);
    this.groundMesh.receiveShadow = true;
    this.scene.add(this.groundMesh);

    // Lane Dividers
    this.laneLinesGroup = new THREE.Group();
    const laneMat = new THREE.MeshBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.4 });
    [-0.5, 0.5].forEach(laneOffset => {
      const lineGeo = new THREE.BoxGeometry(0.12, 0.05, 500);
      const line = new THREE.Mesh(lineGeo, laneMat);
      line.position.set(laneOffset * GAME_CONFIG.LANE_WIDTH * THREE_GLOBAL_MULT, 0.02, 250);
      this.laneLinesGroup.add(line);
    });
    this.scene.add(this.laneLinesGroup);

    // 5. Distant Mountains Backdrop
    this.mountainsGroup = new THREE.Group();
    this.createDistantMountains();
    this.scene.add(this.mountainsGroup);

    // 6. Create 3D Player Group (Horse + Hero)
    this.playerGroup = new THREE.Group();
    this.horseMeshGroup = new THREE.Group();
    this.riderMeshGroup = new THREE.Group();
    this.wingsMeshGroup = new THREE.Group();
    this.shieldMeshGroup = new THREE.Group();

    // Joint references initialized in buildHorseModel
    this.legFrontLeft = new THREE.Group();
    this.legFrontRight = new THREE.Group();
    this.legBackLeft = new THREE.Group();
    this.legBackRight = new THREE.Group();

    this.buildHorseModel();
    this.buildRiderModel();
    this.buildPowerUpAuras();

    this.playerGroup.add(this.horseMeshGroup);
    this.playerGroup.add(this.riderMeshGroup);
    this.playerGroup.add(this.wingsMeshGroup);
    this.playerGroup.add(this.shieldMeshGroup);
    this.scene.add(this.playerGroup);

    // 7. Shockwave Ring Mesh
    const ringGeo = new THREE.RingGeometry(0.1, 1, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide, transparent: true, opacity: 0 });
    this.shockwaveMesh = new THREE.Mesh(ringGeo, ringMat);
    this.shockwaveMesh.rotation.x = -Math.PI / 2;
    this.scene.add(this.shockwaveMesh);

    // 8. Particles System
    this.particlePositions = new Float32Array(this.maxParticles * 3);
    this.particleColors = new Float32Array(this.maxParticles * 3);
    this.particleGeo = new THREE.BufferGeometry();
    this.particleGeo.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    this.particleGeo.setAttribute('color', new THREE.BufferAttribute(this.particleColors, 3));

    this.particleMat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });
    this.particlePoints = new THREE.Points(this.particleGeo, this.particleMat);
    this.scene.add(this.particlePoints);
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // --- MODEL BUILDERS ---
  private buildHorseModel() {
    const horseMat = this.horseBodyMat;
    const maneMat = this.horseManeMat;

    // Horse Torso Body
    const bodyGeo = new THREE.CylinderGeometry(0.7, 0.75, 2.4, 12);
    const body = new THREE.Mesh(bodyGeo, horseMat);
    body.rotation.x = Math.PI / 2;
    body.position.set(0, 1.4, 0);
    body.castShadow = true;
    this.horseMeshGroup.add(body);

    // Horse Chest
    const chestGeo = new THREE.SphereGeometry(0.8, 12, 12);
    const chest = new THREE.Mesh(chestGeo, horseMat);
    chest.position.set(0, 1.5, 1.0);
    chest.castShadow = true;
    this.horseMeshGroup.add(chest);

    // Horse Neck & Head
    const neckGeo = new THREE.CylinderGeometry(0.45, 0.6, 1.3, 10);
    const neck = new THREE.Mesh(neckGeo, horseMat);
    neck.rotation.x = -Math.PI / 4;
    neck.position.set(0, 2.2, 1.5);
    neck.castShadow = true;
    this.horseMeshGroup.add(neck);

    const headGeo = new THREE.BoxGeometry(0.5, 0.5, 0.9);
    const head = new THREE.Mesh(headGeo, horseMat);
    head.position.set(0, 2.6, 2.0);
    head.rotation.x = 0.2;
    head.castShadow = true;
    this.horseMeshGroup.add(head);

    // Mane
    const maneGeo = new THREE.BoxGeometry(0.2, 1.1, 0.3);
    const mane = new THREE.Mesh(maneGeo, maneMat);
    mane.position.set(0, 2.5, 1.5);
    mane.rotation.x = -Math.PI / 4;
    this.horseMeshGroup.add(mane);

    // 4 Animated Leg Pivot Groups
    const legGeo = new THREE.CylinderGeometry(0.18, 0.12, 1.3, 8);
    const hoofMat = new THREE.MeshStandardMaterial({ color: 0x111111 });

    const createLeg = (pivot: THREE.Group, x: number, z: number) => {
      pivot.position.set(x, 1.2, z);
      const leg = new THREE.Mesh(legGeo, horseMat);
      leg.position.set(0, -0.65, 0);
      leg.castShadow = true;
      pivot.add(leg);

      const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.16, 0.2, 8), hoofMat);
      hoof.position.set(0, -1.25, 0);
      pivot.add(hoof);

      this.horseMeshGroup.add(pivot);
    };

    createLeg(this.legFrontLeft, -0.5, 0.8);
    createLeg(this.legFrontRight, 0.5, 0.8);
    createLeg(this.legBackLeft, -0.5, -0.8);
    createLeg(this.legBackRight, 0.5, -0.8);
  }

  private buildRiderModel() {
    // Rider Robe (Tuvan Deel)
    const robeMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.5 });
    const beltMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.8 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfdba74, roughness: 0.7 });
    const hatMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    const bowMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });

    // Torso
    const torsoGeo = new THREE.BoxGeometry(0.9, 1.1, 0.6);
    const torso = new THREE.Mesh(torsoGeo, robeMat);
    torso.position.set(0, 2.5, 0.1);
    torso.castShadow = true;
    this.riderMeshGroup.add(torso);

    // Gold Belt
    const beltGeo = new THREE.BoxGeometry(0.95, 0.18, 0.65);
    const belt = new THREE.Mesh(beltGeo, beltMat);
    belt.position.set(0, 2.1, 0.1);
    this.riderMeshGroup.add(belt);

    // Head
    const headGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.set(0, 3.2, 0.1);
    head.castShadow = true;
    this.riderMeshGroup.add(head);

    // Tuvan Fur Hat
    const hatGeo = new THREE.ConeGeometry(0.42, 0.5, 12);
    const hat = new THREE.Mesh(hatGeo, hatMat);
    hat.position.set(0, 3.6, 0.1);
    this.riderMeshGroup.add(hat);

    // Composite Bow
    const bowGeo = new THREE.TorusGeometry(0.6, 0.05, 8, 16, Math.PI);
    const bow = new THREE.Mesh(bowGeo, bowMat);
    bow.position.set(0.6, 2.6, 0.4);
    bow.rotation.y = Math.PI / 2;
    this.riderMeshGroup.add(bow);
  }

  private buildPowerUpAuras() {
    // Glowing Wings
    const wingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7, side: THREE.DoubleSide });
    const wingGeo = new THREE.PlaneGeometry(2.5, 1.2);

    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.set(-1.4, 2.6, 0);
    leftWing.rotation.y = Math.PI / 4;

    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.set(1.4, 2.6, 0);
    rightWing.rotation.y = -Math.PI / 4;

    this.wingsMeshGroup.add(leftWing);
    this.wingsMeshGroup.add(rightWing);
    this.wingsMeshGroup.visible = false;

    // Shield Dome
    const shieldGeo = new THREE.SphereGeometry(2.2, 16, 16);
    const shieldMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.35, wireframe: true });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    shield.position.set(0, 1.8, 0);
    this.shieldMeshGroup.add(shield);
    this.shieldMeshGroup.visible = false;
  }

  private createDistantMountains() {
    const mountainMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
    const snowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });

    for (let i = 0; i < 18; i++) {
      const radius = 12 + Math.random() * 16;
      const height = 25 + Math.random() * 35;
      const mGeo = new THREE.ConeGeometry(radius, height, 5);
      const mountain = new THREE.Mesh(mGeo, mountainMat);

      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (45 + Math.random() * 30);
      const z = (i * 25) + (Math.random() * 10);
      mountain.position.set(x, height / 2, z);

      // Snow Cap
      const capGeo = new THREE.ConeGeometry(radius * 0.4, height * 0.3, 5);
      const cap = new THREE.Mesh(capGeo, snowMat);
      cap.position.set(0, height * 0.35, 0);
      mountain.add(cap);

      this.mountainsGroup.add(mountain);
    }
  }

  // --- SCENE UPDATER & MAIN RENDER ---
  public renderScene(params: {
    biome: BiomeConfig;
    cameraZ: number;
    playerX: number;
    playerY: number;
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
      isSliding,
      obstacles,
      enemies,
      collectibles,
      arrows,
      particles,
      activePowerUps,
      time
    } = params;

    // 1. Update Biome Colors
    const groundColor = new THREE.Color(biome.groundColor);
    (this.groundMesh.material as THREE.MeshStandardMaterial).color.copy(groundColor);
    const horizonColor = new THREE.Color(biome.horizonColor);
    this.scene.background = horizonColor;
    (this.scene.fog as THREE.FogExp2).color = horizonColor;

    // 2. Scroll Ground & Camera
    this.groundMesh.position.z = cameraZ + 200;
    this.laneLinesGroup.position.z = cameraZ;
    this.mountainsGroup.position.z = cameraZ;

    // Camera follow player position in 3D
    this.camera.position.x = playerX * THREE_GLOBAL_MULT * 0.45;
    this.camera.position.y = 4.8 + playerY * 0.5;
    this.camera.position.z = cameraZ - 10;
    this.camera.lookAt(playerX * THREE_GLOBAL_MULT * 0.8, 2.0 + playerY * 0.4, cameraZ + 25);

    // Update Horse Breed visual colors dynamically
    if (this.currentHorseBreedId !== equippedHorseId) {
      this.currentHorseBreedId = equippedHorseId;
      const horse = HORSE_BREEDS.find(h => h.id === equippedHorseId) || HORSE_BREEDS[0];
      if (horse) {
        this.horseBodyMat.color.setStyle(horse.colorPrimary);
        this.horseManeMat.color.setStyle(horse.colorMane);
      }
    }

    // 3. Update Player Position & Animations
    this.playerGroup.position.set(playerX * THREE_GLOBAL_MULT, playerY * 1.2, cameraZ + 8);
    this.playerLight.position.set(playerX * THREE_GLOBAL_MULT, playerY + 3, cameraZ + 8);

    // Gallop leg rotation keyframe simulation
    const gallopFreq = 22;
    const legAngle = Math.sin(time * gallopFreq) * 0.5;
    this.legFrontLeft.rotation.x = legAngle;
    this.legFrontRight.rotation.x = -legAngle;
    this.legBackLeft.rotation.x = -legAngle;
    this.legBackRight.rotation.x = legAngle;

    // Crouch on slide
    if (isSliding) {
      this.playerGroup.scale.set(1.0, 0.5, 1.2);
    } else {
      this.playerGroup.scale.set(1.0, 1.0, 1.0);
    }

    // PowerUp Auras Visibility
    const hasEagle = activePowerUps.some(p => p.type === 'EAGLE_WINGS');
    const hasShield = activePowerUps.some(p => p.type === 'SHIELD_SPIRIT');
    this.wingsMeshGroup.visible = hasEagle;
    this.shieldMeshGroup.visible = hasShield;

    if (hasEagle) {
      this.wingsMeshGroup.rotation.z = Math.sin(time * 15) * 0.2;
    }

    // Voice Shockwave
    const voicePower = activePowerUps.find(p => p.type === 'HERO_VOICE');
    if (voicePower) {
      const radius = ((voicePower.maxTime - voicePower.remainingTime) / voicePower.maxTime) * 35;
      this.shockwaveMesh.scale.set(radius, radius, 1);
      this.shockwaveMesh.position.set(playerX * THREE_GLOBAL_MULT, 0.1, cameraZ + 12);
      (this.shockwaveMesh.material as THREE.MeshBasicMaterial).opacity = voicePower.remainingTime / voicePower.maxTime;
    } else {
      (this.shockwaveMesh.material as THREE.MeshBasicMaterial).opacity = 0;
    }

    // 4. Update 3D Obstacle Meshes
    this.updateObstacleMeshes(obstacles, cameraZ);

    // 5. Update 3D Collectible Meshes (Coins, Orbs)
    this.updateCollectibleMeshes(collectibles, cameraZ, time);

    // 6. Update 3D Enemy Meshes
    this.updateEnemyMeshes(enemies, cameraZ, time);

    // 7. Update 3D Flying Arrows
    this.updateArrowMeshes(arrows, cameraZ);

    // 8. Update Particles
    this.updateParticles(particles, cameraZ);

    // 9. Render Scene
    this.renderer.render(this.scene, this.camera);
  }

  // --- OBSTACLE MESH MANAGEMENT ---
  private updateObstacleMeshes(obstacles: Obstacle[], cameraZ: number) {
    const activeIds = new Set<string>();

    obstacles.forEach(obs => {
      if (obs.destroyed || obs.z < cameraZ - 10 || obs.z > cameraZ + 160) return;
      activeIds.add(obs.id);

      let mesh = this.obstacleMeshes.get(obs.id);
      if (!mesh) {
        mesh = this.createObstacleMesh(obs.type);
        this.obstacleMeshes.set(obs.id, mesh);
        this.scene.add(mesh);
      }

      let obsY = 0;
      if (obs.type === 'ROCKFALL') {
        const dist = obs.z - cameraZ;
        if (dist > 90) {
          // Keep invisible or high up in mountain before player approaches
          mesh.visible = false;
          obsY = 30.0;
        } else {
          mesh.visible = true;
          if (dist > 10) {
            // Unexpected rapid fall down from Y = 24 to 0 as player gets close (dist 90 -> 10)
            const fallProgress = Math.max(0, Math.min(1, (dist - 10) / 80));
            obsY = Math.pow(fallProgress, 2.5) * 24.0;
            
            // Tumbling rotation while tumbling down the slope
            const tumble = (1 - fallProgress) * Math.PI * 4;
            mesh.rotation.x = Math.sin(tumble) * 1.2;
            mesh.rotation.z = Math.cos(tumble) * 0.8;
          } else {
            obsY = 0;
            mesh.rotation.x = 0;
            mesh.rotation.z = 0;
          }
        }
      }

      mesh.position.set(obs.lane * GAME_CONFIG.LANE_WIDTH * THREE_GLOBAL_MULT, obsY, obs.z);
    });

    // Clean up off-screen/destroyed meshes
    this.obstacleMeshes.forEach((mesh, id) => {
      if (!activeIds.has(id)) {
        this.scene.remove(mesh);
        this.obstacleMeshes.delete(id);
      }
    });
  }

  private createObstacleMesh(type: Obstacle['type']): THREE.Object3D {
    const group = new THREE.Group();

    if (type === 'YURT') {
      // Yurt Base Cylinder
      const baseGeo = new THREE.CylinderGeometry(1.6, 1.7, 1.2, 16);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.6;
      base.castShadow = true;
      group.add(base);

      // Red Ornament Band
      const bandGeo = new THREE.CylinderGeometry(1.62, 1.62, 0.2, 16);
      const bandMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
      const band = new THREE.Mesh(bandGeo, bandMat);
      band.position.y = 0.7;
      group.add(band);

      // Roof Cone
      const roofGeo = new THREE.ConeGeometry(1.8, 0.9, 16);
      const roof = new THREE.Mesh(roofGeo, baseMat);
      roof.position.y = 1.65;
      roof.castShadow = true;
      group.add(roof);
    } else if (type === 'ROCK') {
      const rockGeo = new THREE.DodecahedronGeometry(1.2, 1);
      const rockMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 });
      const rock = new THREE.Mesh(rockGeo, rockMat);
      rock.position.y = 0.9;
      rock.scale.set(1.2, 0.9, 1.1);
      rock.castShadow = true;
      group.add(rock);
    } else if (type === 'LOG') {
      const logGeo = new THREE.CylinderGeometry(0.35, 0.35, 2.8, 10);
      const logMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
      const log = new THREE.Mesh(logGeo, logMat);
      log.rotation.z = Math.PI / 2;
      log.position.y = 0.35;
      log.castShadow = true;
      group.add(log);
    } else if (type === 'BARRICADE') {
      const barGeo = new THREE.BoxGeometry(2.6, 1.8, 0.4);
      const barMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 });
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.y = 0.9;
      bar.castShadow = true;
      group.add(bar);
    } else if (type === 'STONE_OVAO') {
      const ovaaGeo = new THREE.ConeGeometry(1.2, 2.2, 8);
      const ovaaMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
      const ovaa = new THREE.Mesh(ovaaGeo, ovaaMat);
      ovaa.position.y = 1.1;
      ovaa.castShadow = true;
      group.add(ovaa);

      // Blue Silk Khadag Ribbon
      const ribbonGeo = new THREE.BoxGeometry(1.3, 0.2, 1.3);
      const ribbonMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
      const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
      ribbon.position.y = 1.2;
      group.add(ribbon);
    } else if (type === 'TREE_BRANCH') {
      // Side Tree Trunk
      const trunkGeo = new THREE.CylinderGeometry(0.4, 0.5, 3.8, 10);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c2e0b, roughness: 0.9 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.set(-1.3, 1.9, 0);
      trunk.castShadow = true;
      group.add(trunk);

      // Low Horizontal Branch across lane at Y = 1.7
      const branchGeo = new THREE.CylinderGeometry(0.28, 0.22, 2.8, 10);
      const branchMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 });
      const branch = new THREE.Mesh(branchGeo, branchMat);
      branch.rotation.z = Math.PI / 2;
      branch.position.set(0, 1.7, 0);
      branch.castShadow = true;
      group.add(branch);

      // Pine/Cedar Needles cluster
      const leafGeo = new THREE.DodecahedronGeometry(0.7, 1);
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
      const leaves = new THREE.Mesh(leafGeo, leafMat);
      leaves.position.set(0.2, 2.1, 0);
      group.add(leaves);
    } else if (type === 'ROCKFALL') {
      const rockMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
      
      const bigRock1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9, 1), rockMat);
      bigRock1.position.set(-0.5, 0.7, -0.2);
      bigRock1.scale.set(1.1, 0.9, 1.0);
      bigRock1.castShadow = true;
      group.add(bigRock1);

      const bigRock2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.0, 1), rockMat);
      bigRock2.position.set(0.4, 0.8, 0.2);
      bigRock2.scale.set(1.0, 1.1, 1.2);
      bigRock2.castShadow = true;
      group.add(bigRock2);

      const centerRock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.7, 1), rockMat);
      centerRock.position.set(0, 1.3, 0);
      centerRock.castShadow = true;
      group.add(centerRock);

      const rubbleMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 });
      for (let i = 0; i < 4; i++) {
        const rubble = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3, 0), rubbleMat);
        rubble.position.set((Math.random() - 0.5) * 1.8, 0.2, (Math.random() - 0.5) * 1.2);
        group.add(rubble);
      }
    } else if (type === 'RIVER' || type === 'RIVER_GAP') {
      // River Water Basin across the track
      const waterMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.88
      });
      const waterGeo = new THREE.BoxGeometry(2.8, 0.15, 4.5);
      const water = new THREE.Mesh(waterGeo, waterMat);
      water.position.set(0, 0.05, 0);
      group.add(water);

      // Foam Ripples / Water Currents
      const foamMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.7 });
      for (let i = 0; i < 3; i++) {
        const foam = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.18, 0.4), foamMat);
        foam.position.set(0, 0.08, -1.5 + i * 1.5);
        group.add(foam);
      }

      // Wooden Riverbank Logs at both edges of the river
      const bankLogMat = new THREE.MeshStandardMaterial({ color: 0x5c2e0b, roughness: 0.8 });
      const bankLogGeo = new THREE.CylinderGeometry(0.25, 0.25, 2.8, 8);

      const logNear = new THREE.Mesh(bankLogGeo, bankLogMat);
      logNear.rotation.z = Math.PI / 2;
      logNear.position.set(0, 0.2, -2.1);
      group.add(logNear);

      const logFar = new THREE.Mesh(bankLogGeo, bankLogMat);
      logFar.rotation.z = Math.PI / 2;
      logFar.position.set(0, 0.2, 2.1);
      group.add(logFar);
    }

    return group;
  }

  // --- COLLECTIBLES MESH MANAGEMENT ---
  private updateCollectibleMeshes(collectibles: CollectibleItem[], cameraZ: number, time: number) {
    const activeIds = new Set<string>();

    collectibles.forEach(item => {
      if (item.collected || item.z < cameraZ - 5 || item.z > cameraZ + 150) return;
      activeIds.add(item.id);

      let mesh = this.collectibleMeshes.get(item.id);
      if (!mesh) {
        mesh = this.createCollectibleMesh(item);
        this.collectibleMeshes.set(item.id, mesh);
        this.scene.add(mesh);
      }

      const hoverY = 1.2 + Math.sin(time * 6 + item.z) * 0.3;
      mesh.position.set(item.lane * GAME_CONFIG.LANE_WIDTH * THREE_GLOBAL_MULT, hoverY, item.z);
      mesh.rotation.y = time * 4;
    });

    this.collectibleMeshes.forEach((mesh, id) => {
      if (!activeIds.has(id)) {
        this.scene.remove(mesh);
        this.collectibleMeshes.delete(id);
      }
    });
  }

  private createCollectibleMesh(item: CollectibleItem): THREE.Object3D {
    const group = new THREE.Group();

    if (item.type === 'TOKEN') {
      // 3D Gold Coin
      const coinGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.12, 16);
      const coinMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
      const coin = new THREE.Mesh(coinGeo, coinMat);
      coin.rotation.x = Math.PI / 2;
      group.add(coin);
    } else if (item.type === 'POWERUP') {
      const orbGeo = new THREE.SphereGeometry(0.6, 16, 16);
      const orbMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      group.add(orb);
    } else if (item.type === 'SACRED_SACK') {
      // Tuvan Sacred Leather Sack (Мешок с дарами)
      const sackMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.7 });
      const trimMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.2 });

      // Sack Body
      const bodyGeo = new THREE.SphereGeometry(0.65, 12, 12);
      const body = new THREE.Mesh(bodyGeo, sackMat);
      body.scale.set(1.0, 1.2, 1.0);
      group.add(body);

      // Tied neck with Gold Ribbon
      const tieGeo = new THREE.TorusGeometry(0.35, 0.08, 8, 16);
      const tie = new THREE.Mesh(tieGeo, trimMat);
      tie.rotation.x = Math.PI / 2;
      tie.position.y = 0.6;
      group.add(tie);

      // Top Frill
      const frillGeo = new THREE.ConeGeometry(0.4, 0.4, 10);
      const frill = new THREE.Mesh(frillGeo, sackMat);
      frill.position.y = 0.85;
      group.add(frill);

      // Inner Glowing Aura
      const auraMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.4 });
      const aura = new THREE.Mesh(new THREE.SphereGeometry(0.9, 12, 12), auraMat);
      group.add(aura);
    } else {
      // Arrow Pack
      const packGeo = new THREE.BoxGeometry(0.4, 0.8, 0.4);
      const packMat = new THREE.MeshStandardMaterial({ color: 0xd97706 });
      const pack = new THREE.Mesh(packGeo, packMat);
      group.add(pack);
    }

    return group;
  }

  // --- ENEMIES & ARROWS ---
  private updateEnemyMeshes(enemies: Enemy[], cameraZ: number, time: number) {
    const activeIds = new Set<string>();

    enemies.forEach(enemy => {
      if (enemy.destroyed || enemy.z < cameraZ - 5 || enemy.z > cameraZ + 150) return;
      activeIds.add(enemy.id);

      let mesh = this.enemyMeshes.get(enemy.id);
      if (!mesh) {
        mesh = this.createEnemyMesh();
        this.enemyMeshes.set(enemy.id, mesh);
        this.scene.add(mesh);
      }

      mesh.position.set(enemy.lane * GAME_CONFIG.LANE_WIDTH * THREE_GLOBAL_MULT, 0, enemy.z);
    });

    this.enemyMeshes.forEach((mesh, id) => {
      if (!activeIds.has(id)) {
        this.scene.remove(mesh);
        this.enemyMeshes.delete(id);
      }
    });
  }

  private createEnemyMesh(): THREE.Object3D {
    const group = new THREE.Group();
    const horseMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 });
    const riderMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.6 });

    const horseGeo = new THREE.CylinderGeometry(0.6, 0.6, 2.2, 10);
    const horse = new THREE.Mesh(horseGeo, horseMat);
    horse.rotation.x = Math.PI / 2;
    horse.position.y = 1.2;
    group.add(horse);

    const riderGeo = new THREE.BoxGeometry(0.8, 1.0, 0.5);
    const rider = new THREE.Mesh(riderGeo, riderMat);
    rider.position.set(0, 2.2, 0);
    group.add(rider);

    return group;
  }

  private updateArrowMeshes(arrows: ArrowProjectile[], cameraZ: number) {
    const activeIds = new Set<string>();

    arrows.forEach(arrow => {
      if (!arrow.active || arrow.z < cameraZ - 5 || arrow.z > cameraZ + 150) return;
      activeIds.add(arrow.id);

      let mesh = this.arrowMeshes.get(arrow.id);
      if (!mesh) {
        const arrowGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 6);
        const arrowMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
        mesh = new THREE.Mesh(arrowGeo, arrowMat);
        mesh.rotation.x = Math.PI / 2;
        this.arrowMeshes.set(arrow.id, mesh);
        this.scene.add(mesh);
      }

      mesh.position.set(arrow.lane * GAME_CONFIG.LANE_WIDTH * THREE_GLOBAL_MULT, 1.8, arrow.z);
    });

    this.arrowMeshes.forEach((mesh, id) => {
      if (!activeIds.has(id)) {
        this.scene.remove(mesh);
        this.arrowMeshes.delete(id);
      }
    });
  }

  // --- PARTICLES ---
  private updateParticles(particles: Particle[], cameraZ: number) {
    let pIdx = 0;

    particles.forEach(p => {
      if (pIdx < this.maxParticles) {
        this.particlePositions[pIdx * 3] = p.x * THREE_GLOBAL_MULT;
        this.particlePositions[pIdx * 3 + 1] = p.y;
        this.particlePositions[pIdx * 3 + 2] = p.z;

        this.particleColors[pIdx * 3] = 0.95;
        this.particleColors[pIdx * 3 + 1] = 0.75;
        this.particleColors[pIdx * 3 + 2] = 0.2;
        pIdx++;
      }
    });

    // Fill remaining with 0
    for (let i = pIdx; i < this.maxParticles; i++) {
      this.particlePositions[i * 3 + 1] = -100;
    }

    this.particleGeo.attributes.position.needsUpdate = true;
    this.particleGeo.attributes.color.needsUpdate = true;
  }
}
