import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { GameEngine } from './core/GameEngine';
import { SaveManager } from './utils/saveManager';
import { PlayerProfile, GameState, ActivePowerUpState } from './types/game';
import { MainMenu } from './components/UI/MainMenu';
import { GameHUD } from './components/UI/GameHUD';
import { StoryModal } from './components/UI/StoryModal';
import { GameOverModal } from './components/UI/GameOverModal';
import { StoryTellerMemory } from './components/UI/StoryTellerMemory';
import { HeroAndHorseTab } from './components/UI/HeroAndHorseTab';
import { GDDModal } from './components/UI/GDDModal';
import { SettingsModal } from './components/UI/SettingsModal';
import { WelcomeGuideModal } from './components/UI/WelcomeGuideModal';
import { STORY_CHAPTERS, getLocalizedChapter } from './narrative/storyData';
import { getTranslation, Language } from './utils/translations';
import { Play, Home, RotateCcw, Maximize, Minimize } from 'lucide-react';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // App & Player Profile State
  const [profile, setProfile] = useState<PlayerProfile>(() => SaveManager.loadProfile());
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [activeModal, setActiveModal] = useState<'NONE' | 'LORE' | 'UPGRADES' | 'GDD' | 'SETTINGS' | 'GUIDE'>('NONE');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Track Fullscreen state changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.log('Fullscreen error:', err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => console.log('Exit fullscreen error:', err));
      }
    }
  };

  // Trigger welcome tutorial modal on first run
  const [showWelcomeGuide, setShowWelcomeGuide] = useState<boolean>(() => {
    return profile.settings.showTutorial !== false;
  });

  // Live Run Stats for HUD
  const [hudStats, setHudStats] = useState({
    distance: 0,
    score: 0,
    tokens: 0,
    arrows: 0,
    speed: 26,
    chapterProgressPct: 0
  });

  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUpState[]>([]);
  const [gameOverReason, setGameOverReason] = useState<string>('Столкновение');

  // Touch Gesture Tracking
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Register PWA Service Worker on mount
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('SW registration error:', err);
      });
    }
  }, []);

  // Save profile changes to localStorage
  useEffect(() => {
    SaveManager.saveProfile(profile);
  }, [profile]);

  // Initialize GameEngine
  useEffect(() => {
    if (canvasRef.current && !engineRef.current) {
      const engine = new GameEngine(canvasRef.current, profile);
      engineRef.current = engine;

      engine.onStateChange = (newState) => {
        setGameState(newState);
      };

      engine.onRunUpdate = (stats) => {
        setHudStats(stats);
        if (engineRef.current) {
          setActivePowerUps([...engineRef.current.activePowerUps]);
        }
      };

      engine.onGameOver = (reason) => {
        setGameOverReason(reason);
        setProfile({ ...engine.profile });
      };

      engine.onChapterComplete = (chapId) => {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
        setProfile({ ...engine.profile });
      };
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.stopEngine();
      }
    };
  }, []);

  // Sync Profile with Engine
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.profile = profile;
    }
  }, [profile]);

  // Handle Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!engineRef.current) return;

      if (gameState === 'PLAYING') {
        switch (e.code) {
          case 'ArrowLeft':
          case 'KeyA':
            engineRef.current.moveLeft();
            break;
          case 'ArrowRight':
          case 'KeyD':
            engineRef.current.moveRight();
            break;
          case 'ArrowUp':
          case 'KeyW':
            engineRef.current.jump();
            break;
          case 'ArrowDown':
          case 'KeyS':
            engineRef.current.slide();
            break;
          case 'Space':
          case 'KeyF':
          case 'KeyE':
            engineRef.current.shootBow();
            break;
          case 'KeyP':
          case 'Escape':
            engineRef.current.setState('PAUSED');
            break;
        }
      } else if (gameState === 'PAUSED' && (e.code === 'KeyP' || e.code === 'Escape')) {
        engineRef.current.setState('PLAYING');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Handle Touch Control Gestures (Swipe + Tap)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: performance.now()
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !engineRef.current || gameState !== 'PLAYING') return;

    const touchEnd = e.changedTouches[0];
    const dx = touchEnd.clientX - touchStartRef.current.x;
    const dy = touchEnd.clientY - touchStartRef.current.y;
    const dt = performance.now() - touchStartRef.current.time;

    const minSwipeDist = 28;

    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal Swipe
      if (Math.abs(dx) > minSwipeDist) {
        // Mobile swipe inversion requested:
        // Swipe left (dx < 0) -> character moves right
        // Swipe right (dx > 0) -> character moves left
        if (dx > 0) {
          engineRef.current.moveLeft();
        } else {
          engineRef.current.moveRight();
        }
      }
    } else {
      // Vertical Swipe
      if (Math.abs(dy) > minSwipeDist) {
        if (dy < 0) engineRef.current.jump();
        else engineRef.current.slide();
      } else if (dt < 250) {
        // Quick Tap -> Shoot Bow
        engineRef.current.shootBow();
      }
    }

    touchStartRef.current = null;
  };

  // Flow Triggers
  const handleStartRunFlow = () => {
    setGameState('STORY_INTRO');
  };

  const handleConfirmStartRun = () => {
    if (engineRef.current) {
      engineRef.current.startNewRun();
    }
  };

  const lang: Language = profile.settings.language || 'RU';
  const currentChapTitle = getLocalizedChapter(profile.currentChapter, lang).title;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-950 font-sans select-none touch-none">
      {/* Mini Fullscreen Enter/Exit Button - Overlaying all windows */}
      <button
        onClick={toggleFullscreen}
        className="fixed top-2.5 right-2.5 z-[100] p-2 bg-[#2D2D2D]/90 hover:bg-[#1A1A1A] text-[#D4AF37] border-2 border-[#D4AF37]/80 rounded-xl shadow-2xl backdrop-blur-md active:scale-90 transition-all flex items-center justify-center pointer-events-auto"
        title={isFullscreen ? (lang === 'EN' ? "Exit Fullscreen" : "Выйти из полноэкранного режима") : (lang === 'EN' ? "Fullscreen Mode" : "Полноэкранный режим")}
        aria-label="Toggle Fullscreen"
      >
        {isFullscreen ? (
          <Minimize className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
        ) : (
          <Maximize className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
        )}
      </button>

      {/* 2.5D Canvas World */}
      <canvas
        ref={canvasRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full h-full block"
      />

      {/* Main Menu Overlay */}
      {gameState === 'MENU' && activeModal === 'NONE' && !showWelcomeGuide && (
        <div className="absolute inset-0 z-20">
          <MainMenu
            profile={profile}
            onStartRun={handleStartRunFlow}
            onOpenStoryLore={() => setActiveModal('LORE')}
            onOpenUpgrades={() => setActiveModal('UPGRADES')}
            onOpenGDD={() => setActiveModal('GDD')}
            onOpenSettings={() => setActiveModal('SETTINGS')}
            onOpenGuide={() => setActiveModal('GUIDE')}
            onSelectChapter={(chapId) => setProfile({ ...profile, currentChapter: chapId })}
            onUpdateProfile={(updated) => setProfile(updated)}
          />
        </div>
      )}

      {/* Story Intro / Storyteller Modal */}
      {gameState === 'STORY_INTRO' && (
        <StoryModal
          chapterId={profile.currentChapter}
          lang={lang}
          onConfirmStart={handleConfirmStartRun}
        />
      )}

      {/* Live Gameplay HUD */}
      {gameState === 'PLAYING' && (
        <GameHUD
          distance={hudStats.distance}
          score={hudStats.score}
          tokens={hudStats.tokens}
          arrows={hudStats.arrows}
          speed={hudStats.speed}
          chapterProgressPct={hudStats.chapterProgressPct}
          chapterTitle={currentChapTitle}
          activePowerUps={activePowerUps}
          profile={profile}
          onPauseToggle={() => engineRef.current?.setState('PAUSED')}
          onShootBow={() => engineRef.current?.shootBow()}
          onMoveLeft={() => engineRef.current?.moveLeft()}
          onMoveRight={() => engineRef.current?.moveRight()}
          onJump={() => engineRef.current?.jump()}
          onSlide={() => engineRef.current?.slide()}
        />
      )}

      {/* Pause Menu Overlay */}
      {gameState === 'PAUSED' && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="bg-[#FDF6E3] border-2 border-[#D4AF37] rounded-3xl p-6 w-full max-w-sm text-center text-[#2D2D2D] shadow-2xl">
            <h3 className="text-2xl font-black text-[#8B4513] font-['Playfair_Display',serif] mb-6">{getTranslation('pauseTitle', lang)}</h3>
            <div className="space-y-3">
              <button
                onClick={() => engineRef.current?.setState('PLAYING')}
                className="w-full py-3 bg-[#8B4513] hover:brightness-110 text-[#FDF6E3] font-bold rounded-xl border border-[#D4AF37] flex items-center justify-center gap-2 shadow-md"
              >
                <Play className="w-5 h-5 fill-[#FDF6E3]" />
                <span>{getTranslation('resumeRun', lang)}</span>
              </button>
              <button
                onClick={() => {
                  engineRef.current?.stopEngine();
                  setGameState('MENU');
                }}
                className="w-full py-3 bg-[#2D2D2D] hover:bg-[#1A1A1A] text-[#FDF6E3] font-bold rounded-xl flex items-center justify-center gap-2 shadow-md"
              >
                <Home className="w-5 h-5" />
                <span>{getTranslation('returnMenu', lang)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'GAME_OVER' && (
        <GameOverModal
          reason={gameOverReason}
          distanceRun={hudStats.distance}
          tokensCollected={hudStats.tokens}
          score={hudStats.score}
          highScore={profile.highScore}
          lang={lang}
          onRetry={handleStartRunFlow}
          onReturnMenu={() => setGameState('MENU')}
          onOpenUpgrades={() => {
            setGameState('MENU');
            setActiveModal('UPGRADES');
          }}
        />
      )}

      {/* Chapter Completion Victory Overlay */}
      {gameState === 'CHAPTER_COMPLETE' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="bg-[#FDF6E3] border-2 border-[#D4AF37] rounded-3xl p-6 w-full max-w-md text-center text-[#2D2D2D] shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] mx-auto flex items-center justify-center text-[#8B4513] text-2xl font-black mb-3">
              ❖
            </div>
            <h2 className="text-2xl font-black text-[#8B4513] font-['Playfair_Display',serif]">{getTranslation('chapterClearedTitle', lang)}</h2>
            <p className="text-xs text-[#2D2D2D]/80 mt-1">
              {getTranslation('chapterClearedDesc', lang)}
            </p>

            <div className="my-4 p-3 bg-[#F5F5F0] rounded-xl border border-[#D4AF37]/50 text-xs text-[#8B732A] font-bold">
              {getTranslation('chapterReward', lang)}
            </div>

            <button
              onClick={() => setGameState('MENU')}
              className="w-full py-3.5 bg-[#8B4513] hover:brightness-110 text-[#FDF6E3] font-black rounded-xl border border-[#D4AF37] shadow-md"
            >
              {getTranslation('continueBtn', lang)}
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {(showWelcomeGuide || activeModal === 'GUIDE') && (
        <WelcomeGuideModal
          profile={profile}
          onUpdateProfile={(updated) => setProfile(updated)}
          onClose={() => {
            setShowWelcomeGuide(false);
            if (activeModal === 'GUIDE') setActiveModal('NONE');
          }}
        />
      )}

      {activeModal === 'LORE' && (
        <StoryTellerMemory
          profile={profile}
          onClose={() => setActiveModal('NONE')}
        />
      )}

      {activeModal === 'UPGRADES' && (
        <HeroAndHorseTab
          profile={profile}
          onUpdateProfile={(updated) => setProfile(updated)}
          onClose={() => setActiveModal('NONE')}
        />
      )}

      {activeModal === 'GDD' && (
        <GDDModal onClose={() => setActiveModal('NONE')} />
      )}

      {activeModal === 'SETTINGS' && (
        <SettingsModal
          profile={profile}
          onUpdateProfile={(updated) => setProfile(updated)}
          onResetProgress={() => setProfile(SaveManager.resetProgress())}
          onClose={() => setActiveModal('NONE')}
        />
      )}
    </div>
  );
}
