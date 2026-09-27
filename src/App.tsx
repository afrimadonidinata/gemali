/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  RefreshCw,
  Star,
  Sparkles,
  CheckCircle2,
  Trophy,
  HelpCircle,
  Code,
  Copy,
  Download,
  Check,
  Zap,
  Gauge,
  Flame,
  ChevronRight,
  Smile,
} from 'lucide-react';
import { sounds } from './utils/audio';

export type ColorKey = 'merah' | 'biru' | 'kuning' | 'hijau';
export type DifficultyMode = 'easy' | 'medium' | 'hard';

export interface ColorInfo {
  key: ColorKey;
  name: string;
  emoji: string;
  bgGradient: string;
  shadowColor: string;
  activeShadowColor: string;
  textColor: string;
  borderColor: string;
  glowColor: string;
}

export const COLOR_MAP: Record<ColorKey, ColorInfo> = {
  merah: {
    key: 'merah',
    name: 'Merah',
    emoji: '🍎',
    bgGradient: 'from-red-400 to-red-600',
    shadowColor: '#B91C1C',
    activeShadowColor: '#991B1B',
    textColor: 'text-white',
    borderColor: 'border-red-500',
    glowColor: 'rgba(239, 68, 68, 0.4)',
  },
  biru: {
    key: 'biru',
    name: 'Biru',
    emoji: '🌊',
    bgGradient: 'from-blue-400 to-blue-600',
    shadowColor: '#1D4ED8',
    activeShadowColor: '#1E40AF',
    textColor: 'text-white',
    borderColor: 'border-blue-500',
    glowColor: 'rgba(59, 130, 246, 0.4)',
  },
  kuning: {
    key: 'kuning',
    name: 'Kuning',
    emoji: '⭐',
    bgGradient: 'from-yellow-300 to-yellow-500',
    shadowColor: '#CA8A04',
    activeShadowColor: '#A16207',
    textColor: 'text-amber-950',
    borderColor: 'border-yellow-400',
    glowColor: 'rgba(234, 179, 8, 0.4)',
  },
  hijau: {
    key: 'hijau',
    name: 'Hijau',
    emoji: '🍀',
    bgGradient: 'from-emerald-400 to-emerald-600',
    shadowColor: '#15803D',
    activeShadowColor: '#166534',
    textColor: 'text-white',
    borderColor: 'border-emerald-500',
    glowColor: 'rgba(34, 197, 94, 0.4)',
  },
};

export interface GameLevel {
  level: number;
  patternType: string;
  title: string;
  hint: string;
  pattern: ColorKey[];
  targetColor: ColorKey;
  choices: ColorKey[];
}

export interface DifficultyConfig {
  id: DifficultyMode;
  name: string;
  label: string;
  ageLabel: string;
  badgeColor: string;
  activeClass: string;
  icon: string;
  transitionMs: number;
  levels: GameLevel[];
}

export const DIFFICULTY_CONFIGS: Record<DifficultyMode, DifficultyConfig> = {
  easy: {
    id: 'easy',
    name: 'Mudah',
    label: 'Mudah (PAUD 4-5 Thn)',
    ageLabel: 'PAUD 4-5 Tahun',
    badgeColor: 'from-emerald-500 to-teal-600',
    activeClass: 'bg-emerald-500 text-white shadow-[0_4px_0_#065F46] ring-2 ring-emerald-300',
    icon: '🌱',
    transitionMs: 1500,
    levels: [
      {
        level: 1,
        patternType: 'Pola AB (2 Warna)',
        title: 'Level 1: Pola AB',
        hint: 'Merah - Biru - Merah - Biru - [ ? ]',
        pattern: ['merah', 'biru', 'merah', 'biru'],
        targetColor: 'merah',
        choices: ['merah', 'biru'],
      },
      {
        level: 2,
        patternType: 'Pola AAB (2 Warna)',
        title: 'Level 2: Pola AAB',
        hint: 'Kuning - Kuning - Hijau - Kuning - Kuning - [ ? ]',
        pattern: ['kuning', 'kuning', 'hijau', 'kuning', 'kuning'],
        targetColor: 'hijau',
        choices: ['kuning', 'hijau', 'merah'],
      },
      {
        level: 3,
        patternType: 'Pola ABC (3 Warna)',
        title: 'Level 3: Pola ABC',
        hint: 'Merah - Kuning - Hijau - Merah - Kuning - [ ? ]',
        pattern: ['merah', 'kuning', 'hijau', 'merah', 'kuning'],
        targetColor: 'hijau',
        choices: ['merah', 'kuning', 'hijau'],
      },
    ],
  },
  medium: {
    id: 'medium',
    name: 'Sedang',
    label: 'Sedang (TK A-B 5-6 Thn)',
    ageLabel: 'TK 5-6 Tahun',
    badgeColor: 'from-amber-500 to-orange-600',
    activeClass: 'bg-amber-500 text-white shadow-[0_4px_0_#B45309] ring-2 ring-amber-300',
    icon: '⭐',
    transitionMs: 950,
    levels: [
      {
        level: 1,
        patternType: 'Pola ABB Panjang (6 Lingkaran)',
        title: 'Level 1: Pola ABB',
        hint: 'Biru - Merah - Merah - Biru - Merah - Merah - [ ? ]',
        pattern: ['biru', 'merah', 'merah', 'biru', 'merah', 'merah'],
        targetColor: 'biru',
        choices: ['biru', 'merah', 'kuning'],
      },
      {
        level: 2,
        patternType: 'Pola AABB (6 Lingkaran)',
        title: 'Level 2: Pola AABB',
        hint: 'Hijau - Hijau - Kuning - Kuning - Hijau - Hijau - [ ? ]',
        pattern: ['hijau', 'hijau', 'kuning', 'kuning', 'hijau', 'hijau'],
        targetColor: 'kuning',
        choices: ['kuning', 'hijau', 'merah'],
      },
      {
        level: 3,
        patternType: 'Pola ABCD (4 Warna Lengkap)',
        title: 'Level 3: Pola ABCD',
        hint: 'Merah - Biru - Kuning - Hijau - Merah - Biru - [ ? ]',
        pattern: ['merah', 'biru', 'kuning', 'hijau', 'merah', 'biru'],
        targetColor: 'kuning',
        choices: ['merah', 'biru', 'kuning', 'hijau'],
      },
    ],
  },
  hard: {
    id: 'hard',
    name: 'Tantangan',
    label: 'Tantangan (SD 6-7 Thn)',
    ageLabel: 'SD 6-7 Tahun',
    badgeColor: 'from-rose-500 to-purple-600',
    activeClass: 'bg-rose-500 text-white shadow-[0_4px_0_#9F1239] ring-2 ring-rose-300',
    icon: '🚀',
    transitionMs: 650,
    levels: [
      {
        level: 1,
        patternType: 'Pola ABBA Cermin (7 Lingkaran)',
        title: 'Level 1: Pola Cermin ABBA',
        hint: 'Merah - Hijau - Hijau - Merah - Merah - Hijau - Hijau - [ ? ]',
        pattern: ['merah', 'hijau', 'hijau', 'merah', 'merah', 'hijau', 'hijau'],
        targetColor: 'merah',
        choices: ['merah', 'hijau', 'biru', 'kuning'],
      },
      {
        level: 2,
        patternType: 'Pola Bertingkat A-B-AA-BB (7 Lingkaran)',
        title: 'Level 2: Pola Bertingkat',
        hint: 'Kuning - Biru - Kuning - Kuning - Biru - Biru - Kuning - [ ? ]',
        pattern: ['kuning', 'biru', 'kuning', 'kuning', 'biru', 'biru', 'kuning'],
        targetColor: 'kuning',
        choices: ['kuning', 'biru', 'hijau', 'merah'],
      },
      {
        level: 3,
        patternType: 'Pola 4 Warna Cepat (8 Lingkaran)',
        title: 'Level 3: Pola Kompleks ABCD',
        hint: 'Merah - Kuning - Biru - Hijau - Merah - Kuning - Biru - [ ? ]',
        pattern: ['merah', 'kuning', 'biru', 'hijau', 'merah', 'kuning', 'biru'],
        targetColor: 'hijau',
        choices: ['merah', 'kuning', 'biru', 'hijau'],
      },
    ],
  },
};

interface FlyingStar {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  char: string;
}

export default function App() {
  const [difficulty, setDifficulty] = useState<DifficultyMode>('easy');
  const [levelIndex, setLevelIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  const [solvedColor, setSolvedColor] = useState<ColorKey | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [flyingStars, setFlyingStars] = useState<FlyingStar[]>([]);
  const [isVictorious, setIsVictorious] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('Sentuh warna pilihanmu di bawah ya! 👇');
  const [feedbackType, setFeedbackType] = useState<'neutral' | 'success' | 'retry'>('neutral');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const targetBoxRef = useRef<HTMLDivElement>(null);

  const currentDiffConfig = DIFFICULTY_CONFIGS[difficulty];
  const currentLevels = currentDiffConfig.levels;
  const currentLevel = currentLevels[levelIndex] || currentLevels[0];

  // Sync sound settings
  useEffect(() => {
    sounds.enabled = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    sounds.voiceEnabled = voiceEnabled;
  }, [voiceEnabled]);

  // Reset state on level or difficulty change
  useEffect(() => {
    setSolvedColor(null);
    setIsTransitioning(false);
    setIsWrongAnswer(false);
    setFeedbackType('neutral');
    setFeedbackMessage('Sentuh warna pilihanmu di bawah ya! 👇');

    if (voiceEnabled) {
      const levelName = currentLevel.title.split(':')[0];
      sounds.speak(`${levelName}. Warna apa selanjutnya?`);
    }
  }, [levelIndex, difficulty, voiceEnabled, currentLevel.title]);

  const handleDifficultyChange = (newDiff: DifficultyMode) => {
    if (newDiff === difficulty) return;
    sounds.playPop();
    setDifficulty(newDiff);
    setLevelIndex(0);
    setIsVictorious(false);
  };

  const triggerConfetti = (particleCount = 50) => {
    try {
      confetti({
        particleCount,
        spread: 65,
        origin: { y: 0.5 },
        colors: ['#EF4444', '#3B82F6', '#FACC15', '#22C55E', '#A855F7'],
      });
    } catch {
      // pass
    }
  };

  const triggerFlyingStars = () => {
    if (!targetBoxRef.current) return;
    const rect = targetBoxRef.current.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    const chars = ['⭐', '🌟', '✨', '🎈', '💖', '🌈', '🎉'];
    const newStars: FlyingStar[] = Array.from({ length: 14 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.4;
      const distance = 90 + Math.random() * 130;
      return {
        id: Date.now() + i,
        x: originX,
        y: originY,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        char: chars[Math.floor(Math.random() * chars.length)],
      };
    });

    setFlyingStars(newStars);
    setTimeout(() => {
      setFlyingStars([]);
    }, 1100);
  };

  const handleColorChoice = (chosenColor: ColorKey) => {
    if (isTransitioning) return;

    if (voiceEnabled) {
      sounds.speak(COLOR_MAP[chosenColor].name);
    }

    if (chosenColor === currentLevel.targetColor) {
      // === JAWABAN BENAR ===
      setIsTransitioning(true);
      setSolvedColor(chosenColor);
      setFeedbackType('success');
      setFeedbackMessage(
        difficulty === 'hard'
          ? '⚡ Cepat & Tepat! Kamu Luar Biasa!'
          : '🎉 Hore, Benar Sekali! Kamu Pintar!'
      );

      sounds.playCorrect();
      triggerConfetti(difficulty === 'hard' ? 70 : 50);
      triggerFlyingStars();

      if (voiceEnabled) {
        setTimeout(() => {
          sounds.speak('Hebat! Jawabanmu benar!');
        }, 220);
      }

      // Transition time based on difficulty (Fast-paced on Medium/Hard)
      const delay = currentDiffConfig.transitionMs;

      setTimeout(() => {
        if (levelIndex < currentLevels.length - 1) {
          setLevelIndex(prev => prev + 1);
        } else {
          // Finished all 3 levels in this difficulty
          setIsVictorious(true);
          sounds.playVictory();
          triggerConfetti(130);
        }
      }, delay);

    } else {
      // === JAWABAN SALAH ===
      sounds.playWrong();
      setIsWrongAnswer(true);
      setFeedbackType('retry');
      setFeedbackMessage('😊 Yuk coba lagi, pasti bisa!');

      if (voiceEnabled) {
        setTimeout(() => {
          sounds.speak('Coba lagi ya!');
        }, 200);
      }

      setTimeout(() => {
        setIsWrongAnswer(false);
      }, 500);
    }
  };

  const handleRestart = (startLevel: number = 0) => {
    sounds.playPop();
    setIsVictorious(false);
    setLevelIndex(startLevel);
  };

  const copyStandaloneCode = async () => {
    try {
      const res = await fetch('/ulat-warna-warni.html');
      const htmlText = await res.text();
      await navigator.clipboard.writeText(htmlText);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-amber-100 to-emerald-200 flex flex-col items-center justify-between p-2.5 sm:p-5 relative overflow-x-hidden font-['Fredoka',sans-serif]">
      {/* Background animated clouds & ambient decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-6 left-[-150px] w-36 h-12 bg-white/70 rounded-full blur-[1px] animate-[floatCloud_28s_linear_infinite]" />
        <div className="absolute top-16 left-[-200px] w-48 h-14 bg-white/60 rounded-full blur-[1px] animate-[floatCloud_36s_linear_infinite_8s]" />
        <div className="absolute top-32 left-[-120px] w-32 h-10 bg-white/50 rounded-full blur-[1px] animate-[floatCloud_32s_linear_infinite_16s]" />

        <span className="absolute top-8 left-[8%] text-2xl animate-bounce opacity-70">🦋</span>
        <span className="absolute top-20 right-[10%] text-3xl animate-pulse opacity-80">☀️</span>
        <span className="absolute bottom-8 left-[5%] text-2xl opacity-60">🌼</span>
        <span className="absolute bottom-8 right-[6%] text-2xl opacity-60">🌸</span>
      </div>

      {/* Floating Star Particles on Correct Tap */}
      {flyingStars.map(star => (
        <div
          key={star.id}
          className="fixed pointer-events-none z-50 text-3xl transition-all duration-1000 ease-out"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            transform: `translate(${star.dx}px, ${star.dy}px) scale(1.6)`,
            opacity: 0,
            animation: 'gentleBounce 1s ease-out forwards',
          }}
        >
          {star.char}
        </div>
      ))}

      {/* Main Game Shell Card */}
      <div className="relative z-10 w-full max-w-2xl bg-white/85 backdrop-blur-sm rounded-[34px] sm:rounded-[38px] border-4 border-yellow-300 shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.9)] p-3.5 sm:p-6 flex flex-col justify-between min-h-[94vh]">

        {/* TOP BAR / HEADER */}
        <header className="w-full flex flex-col items-center gap-2">
          {/* Top row: Level Badge & Quick Controls */}
          <div className="w-full flex items-center justify-between gap-2">
            {/* Level Badge */}
            <div className={`flex items-center gap-2 bg-gradient-to-r ${currentDiffConfig.badgeColor} text-white font-bold px-3.5 py-1.5 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] text-xs sm:text-sm`}>
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-300 text-yellow-300 animate-spin-slow shrink-0" />
              <span>{currentLevel.title}</span>
            </div>

            {/* Quick Controls: Voice, Sound, Code */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => {
                  sounds.playPop();
                  setVoiceEnabled(!voiceEnabled);
                }}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-full border-2 transition-all flex items-center gap-1 font-semibold text-xs ${
                  voiceEnabled
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800 shadow-[0_3px_0_#059669]'
                    : 'bg-gray-100 border-gray-300 text-gray-500 shadow-[0_3px_0_#9CA3AF]'
                } active:translate-y-1 cursor-pointer`}
                title={voiceEnabled ? 'Suara Narasi Aktif' : 'Suara Narasi Mati'}
                aria-label="Toggle Narasi Suara"
              >
                {voiceEnabled ? <Mic className="w-4 h-4 text-emerald-700" /> : <MicOff className="w-4 h-4 text-gray-500" />}
                <span className="hidden md:inline">Suara</span>
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  setSoundEnabled(!soundEnabled);
                }}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-full border-2 transition-all flex items-center gap-1 font-semibold text-xs ${
                  soundEnabled
                    ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-[0_3px_0_#D97706]'
                    : 'bg-gray-100 border-gray-300 text-gray-500 shadow-[0_3px_0_#9CA3AF]'
                } active:translate-y-1 cursor-pointer`}
                title={soundEnabled ? 'Efek Nada Aktif' : 'Efek Nada Mati'}
                aria-label="Toggle Efek Nada"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-700" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
                <span className="hidden md:inline">Efek</span>
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  setShowCodeModal(true);
                }}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full border-2 border-indigo-400 bg-indigo-50 text-indigo-700 shadow-[0_3px_0_#4F46E5] active:translate-y-1 flex items-center gap-1 font-semibold text-xs cursor-pointer"
                title="Lihat / Salin Kode File HTML Tunggal"
                aria-label="Kode HTML Tunggal"
              >
                <Code className="w-4 h-4 text-indigo-700" />
                <span className="hidden md:inline">HTML</span>
              </button>
            </div>
          </div>

          {/* App Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-emerald-800 text-center tracking-wide flex items-center justify-center gap-2 mt-0.5">
            <span>🐛</span>
            <span>Ulat Warna-Warni</span>
            <span>🎨</span>
          </h1>

          {/* DIFFICULTY MODE SELECTOR (Easy, Medium, Hard) */}
          <div className="w-full bg-amber-50/90 border-2 border-amber-200 rounded-2xl p-1.5 sm:p-2 flex flex-col gap-1 shadow-xs">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] sm:text-xs font-bold text-amber-900 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-amber-700" />
                Tingkat Kesulitan:
              </span>
              <span className="text-[10px] sm:text-xs text-amber-800 font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3 text-orange-500" />
                {currentDiffConfig.ageLabel} • Transisi {currentDiffConfig.transitionMs / 1000}s
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {(['easy', 'medium', 'hard'] as DifficultyMode[]).map((mode) => {
                const conf = DIFFICULTY_CONFIGS[mode];
                const isActive = difficulty === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => handleDifficultyChange(mode)}
                    className={`py-1.5 px-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all duration-150 cursor-pointer ${
                      isActive
                        ? conf.activeClass
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-100/50 shadow-xs'
                    } active:scale-95`}
                  >
                    <span className="text-sm sm:text-base">{conf.icon}</span>
                    <span className="tracking-tight">{conf.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pattern description bubble */}
          <div className="w-full bg-sky-50 border-2 border-dashed border-sky-300 rounded-2xl px-3 py-1.5 text-center text-sky-800 font-semibold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sky-500 shrink-0" />
            <span className="truncate">
              Pola: <strong>{currentLevel.hint}</strong>
            </span>
          </div>
        </header>

        {/* CENTER / TOP SECTION: ULAT DENGAN LINGKARAN HORIZONTAL */}
        <section className="w-full my-2.5 sm:my-4 py-3 sm:py-5 px-2 bg-gradient-to-b from-white to-emerald-50 rounded-3xl border-3 border-emerald-200 shadow-inner flex flex-col items-center">
          <div className="flex items-center gap-2 mb-1.5 sm:mb-3">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100/90 px-3 py-0.5 rounded-full border border-emerald-200">
              {currentLevel.pattern.length} Segmen Tubuh + 1 Target [ ? ]
            </span>
          </div>

          {/* CATERPILLAR SCENE WITH HORIZONTAL SCROLL ON SMALL SCREENS */}
          <div className="w-full overflow-x-auto pb-3 pt-2 flex justify-start sm:justify-center no-scrollbar">
            <div className="flex items-center min-w-max px-3 mx-auto">
              
              {/* CATERPILLAR HEAD (Ramah & Lucu) */}
              <div className="relative z-20 -mr-3 sm:-mr-4 animate-head-wiggle select-none shrink-0">
                {/* Antena Kiri & Kanan */}
                <div className="absolute -top-5 left-3 w-3 h-5 border-l-3 border-emerald-700 rounded-tl-full -rotate-12" />
                <div className="absolute -top-7 left-2.5 w-3.5 h-3.5 bg-rose-500 rounded-full shadow-sm animate-pulse" />
                
                <div className="absolute -top-5 right-3 w-3 h-5 border-r-3 border-emerald-700 rounded-tr-full rotate-12" />
                <div className="absolute -top-7 right-2.5 w-3.5 h-3.5 bg-rose-500 rounded-full shadow-sm animate-pulse" />

                {/* Face Circle */}
                <div className="w-16 h-16 sm:w-19 sm:h-19 rounded-full bg-gradient-to-br from-green-300 via-emerald-400 to-green-600 shadow-[0_6px_0_#15803D,0_10px_15px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center relative border-2 border-green-200">
                  <div className="absolute top-2 left-3 w-5 h-2.5 bg-white/60 rounded-full -rotate-30 pointer-events-none" />

                  {/* Eyes */}
                  <div className="flex gap-2 sm:gap-2.5 mt-1">
                    <div className="w-3.5 h-4 sm:w-4 sm:h-4.5 bg-slate-900 rounded-full relative">
                      <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                    <div className="w-3.5 h-4 sm:w-4 sm:h-4.5 bg-slate-900 rounded-full relative">
                      <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  </div>

                  {/* Rosy Cheeks */}
                  <div className="flex justify-between w-11 sm:w-13 absolute top-8 sm:top-9 px-1 pointer-events-none">
                    <div className="w-2.5 h-1.5 bg-pink-400 rounded-full" />
                    <div className="w-2.5 h-1.5 bg-pink-400 rounded-full" />
                  </div>

                  {/* Smiling Mouth */}
                  <div className="w-3.5 sm:w-4 h-2 sm:h-2.5 border-b-3 border-red-700 rounded-b-full mt-1" />
                </div>
              </div>

              {/* BODY SEGMENTS (Lingkaran Berpola) */}
              {currentLevel.pattern.map((colorKey, index) => {
                const colorData = COLOR_MAP[colorKey];
                return (
                  <div key={index} className="flex flex-col items-center -ml-3 sm:-ml-4 relative z-10 shrink-0">
                    {/* Circle Segment */}
                    <div
                      className={`w-12 h-12 sm:w-15 sm:h-15 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${colorData.bgGradient} flex items-center justify-center relative border-2 border-white/40`}
                      style={{
                        boxShadow: `0 5px 0 ${colorData.shadowColor}, 0 8px 12px rgba(0,0,0,0.12)`,
                      }}
                    >
                      <div className="absolute top-1 left-2 w-3.5 h-1.5 bg-white/50 rounded-full -rotate-30 pointer-events-none" />
                      
                      <span className="text-white/90 font-bold text-[11px] sm:text-xs drop-shadow">
                        {index + 1}
                      </span>
                    </div>

                    {/* Feet */}
                    <div className="flex gap-2 sm:gap-3 mt-[-2px]">
                      <div className="w-2 sm:w-2.5 h-1.5 sm:h-2 bg-lime-700 rounded-b-full shadow-[0_2px_0_#3f6212]" />
                      <div className="w-2 sm:w-2.5 h-1.5 sm:h-2 bg-lime-700 rounded-b-full shadow-[0_2px_0_#3f6212]" />
                    </div>
                  </div>
                );
              })}

              {/* TARGET CIRCLE [ ? ] */}
              <div
                ref={targetBoxRef}
                className="flex flex-col items-center -ml-3 sm:-ml-4 relative z-15 shrink-0"
              >
                <div
                  className={`w-12 h-12 sm:w-15 sm:h-15 md:w-16 md:h-16 rounded-full flex items-center justify-center relative transition-all duration-300 ${
                    solvedColor
                      ? `bg-gradient-to-br ${COLOR_MAP[solvedColor].bgGradient} animate-pop-correct border-2 border-white/60`
                      : isWrongAnswer
                      ? 'bg-red-100 border-4 border-dashed border-red-500 text-red-600 animate-shake-wrong shadow-[0_5px_0_#EF4444]'
                      : 'bg-white border-4 border-dashed border-blue-400 text-blue-600 animate-target-bounce shadow-[0_5px_0_#93C5FD]'
                  }`}
                  style={
                    solvedColor
                      ? {
                          boxShadow: `0 6px 0 ${COLOR_MAP[solvedColor].shadowColor}, 0 8px 16px ${COLOR_MAP[solvedColor].glowColor}`,
                        }
                      : {}
                  }
                >
                  <div className="absolute top-1 left-2 w-3.5 h-1.5 bg-white/50 rounded-full -rotate-30 pointer-events-none" />

                  {solvedColor ? (
                    <span className="text-white text-xl sm:text-2xl font-black drop-shadow">⭐</span>
                  ) : (
                    <span className="text-xl sm:text-2xl font-black select-none">
                      ?
                    </span>
                  )}
                </div>

                {/* Feet */}
                <div className="flex gap-2 sm:gap-3 mt-[-2px]">
                  <div className="w-2 sm:w-2.5 h-1.5 sm:h-2 bg-lime-700 rounded-b-full shadow-[0_2px_0_#3f6212]" />
                  <div className="w-2 sm:w-2.5 h-1.5 sm:h-2 bg-lime-700 rounded-b-full shadow-[0_2px_0_#3f6212]" />
                </div>
              </div>

              {/* CATERPILLAR TAIL */}
              <div className="relative -ml-3 z-5 shrink-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-green-300 to-green-600 shadow-[0_4px_0_#15803D] flex items-center justify-center">
                  <span className="text-xs sm:text-sm -rotate-45">🍃</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* BOTTOM SECTION: TOMBOL PILIHAN WARNA (MINIMAL 80px) & FEEDBACK */}
        <footer className="w-full flex flex-col items-center gap-2.5 sm:gap-3.5 mt-1">
          {/* Feedback banner */}
          <div
            className={`min-h-[36px] sm:min-h-[40px] px-3.5 py-1.5 rounded-full text-center text-xs sm:text-sm md:text-base font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
              feedbackType === 'success'
                ? 'bg-green-100 text-green-800 border-2 border-green-400 scale-105 shadow-xs'
                : feedbackType === 'retry'
                ? 'bg-amber-100 text-amber-900 border-2 border-amber-300 shadow-xs'
                : 'text-slate-600'
            }`}
          >
            {feedbackType === 'success' && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />}
            {feedbackType === 'retry' && <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />}
            <span>{feedbackMessage}</span>
          </div>

          {/* COLOR CHOICE BUTTONS (MINIMAL 80px - touch friendly) */}
          <div className="w-full flex justify-center items-center gap-2.5 sm:gap-4 flex-wrap px-1">
            {currentLevel.choices.map((colorKey) => {
              const info = COLOR_MAP[colorKey];
              return (
                <button
                  key={colorKey}
                  onClick={() => handleColorChoice(colorKey)}
                  disabled={isTransitioning}
                  style={{
                    boxShadow: `0 7px 0 ${info.shadowColor}, 0 10px 18px ${info.glowColor}`,
                  }}
                  className={`min-w-[84px] min-h-[84px] sm:min-w-[96px] sm:min-h-[96px] md:min-w-[110px] md:min-h-[110px] rounded-3xl bg-gradient-to-br ${info.bgGradient} ${info.textColor} flex flex-col items-center justify-center gap-1 p-2 sm:p-3 cursor-pointer select-none active:translate-y-2 active:shadow-none transition-transform duration-100 outline-none focus:ring-4 focus:ring-yellow-300`}
                  aria-label={`Pilih warna ${info.name}`}
                >
                  <span className="text-2xl sm:text-3xl filter drop-shadow">
                    {info.emoji}
                  </span>
                  <span className="text-xs sm:text-sm md:text-base font-black tracking-wider uppercase drop-shadow-xs">
                    {info.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Level Progress Indicator */}
          <div className="flex items-center gap-2 mt-1">
            {currentLevels.map((lvl, idx) => (
              <button
                key={lvl.level}
                onClick={() => {
                  sounds.playPop();
                  setLevelIndex(idx);
                }}
                className={`h-2.5 sm:h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === levelIndex
                    ? 'w-7 sm:w-8 bg-amber-500 shadow-[0_2px_0_#B45309]'
                    : idx < levelIndex
                    ? 'w-2.5 sm:w-3 bg-green-500'
                    : 'w-2.5 sm:w-3 bg-gray-300'
                }`}
                title={`Pindah ke ${lvl.title}`}
              />
            ))}
          </div>
        </footer>
      </div>

      {/* POPUP MODAL: LAYAR KEMENANGAN */}
      {isVictorious && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-gradient-to-b from-white via-amber-50 to-yellow-100 border-5 border-yellow-400 rounded-[36px] max-w-md w-full p-6 sm:p-8 text-center shadow-[0_25px_60px_rgba(0,0,0,0.3)] relative animate-pop-correct">
            {/* Stars Header */}
            <div className="flex justify-center gap-3 text-4xl sm:text-5xl mb-3">
              <span className="animate-bounce">🌟</span>
              <span className="animate-bounce [animation-delay:150ms]">🌟</span>
              <span className="animate-bounce [animation-delay:300ms]">🌟</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-wide mb-1">
              Hore! Kamu Hebat!
            </h2>

            <div className="inline-block bg-amber-200 text-amber-900 font-bold px-3 py-1 rounded-full text-xs sm:text-sm mb-3">
              Tingkat {currentDiffConfig.name} Selesai! 🎉
            </div>

            <p className="text-sm sm:text-base text-slate-700 font-semibold mb-5">
              {difficulty === 'hard'
                ? 'Luar biasa! Kamu menyelesaikan semua pola cermin & pola kompleks tingkat tantangan dengan sangat cepat!'
                : difficulty === 'medium'
                ? 'Hebat sekali! Kamu berhasil menyelesaikan pola 6 lingkaran dengan sangat teliti!'
                : 'Kamu berhasil menyelesaikan semua pola warna si Ulat dengan cemerlang!'}
            </p>

            <div className="flex flex-col gap-2.5">
              {/* Option to proceed to higher difficulty */}
              {difficulty === 'easy' && (
                <button
                  onClick={() => {
                    handleDifficultyChange('medium');
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-bold text-base sm:text-lg shadow-[0_5px_0_#B45309] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Flame className="w-5 h-5 text-yellow-200" />
                  <span>Coba Tingkat Sedang (Pola Lebih Panjang)</span>
                </button>
              )}

              {difficulty === 'medium' && (
                <button
                  onClick={() => {
                    handleDifficultyChange('hard');
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-full font-bold text-base sm:text-lg shadow-[0_5px_0_#9F1239] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-5 h-5 text-yellow-300" />
                  <span>Coba Tingkat Tantangan (Pola Cepat)</span>
                </button>
              )}

              <button
                onClick={() => handleRestart(0)}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full font-bold text-base sm:text-lg shadow-[0_5px_0_#15803D] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Main Lagi ({currentDiffConfig.name})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL: LIHAT & SALIN KODE HTML TUNGGAL */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border-4 border-indigo-300 overflow-hidden">
            <div className="bg-indigo-600 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-6 h-6 text-yellow-300" />
                <h3 className="font-bold text-lg">Kode HTML5 Game Tunggal (.html)</h3>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-white/80 hover:text-white text-2xl font-bold px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-sm text-slate-700 flex flex-col gap-3">
              <p className="font-medium bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 text-xs sm:text-sm">
                💡 <strong>Fitur Baru:</strong> Berkas HTML tunggal ini kini sudah menyertakan pemilih <strong>Tingkat Kesulitan (Mudah, Sedang, Tantangan)</strong> dengan pola lebih panjang, kecepatan transisi adaptif, dan suara sintetis Web Audio API murni tanpa unduhan eksternal!
              </p>

              <div className="flex gap-2">
                <button
                  onClick={copyStandaloneCode}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_0_#4338CA] active:translate-y-1 active:shadow-none cursor-pointer"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Berhasil Disalin ke Clipboard!' : 'Salin Seluruh Kode HTML'}</span>
                </button>

                <a
                  href="/ulat-warna-warni.html"
                  download="ulat-warna-warni.html"
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_0_#15803D] active:translate-y-1 active:shadow-none cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh File</span>
                </a>
              </div>

              <div className="mt-2 bg-slate-900 text-slate-100 rounded-xl p-3 overflow-x-auto max-h-72 font-mono text-xs leading-relaxed">
                <pre>{`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Game Edukasi PAUD: Ulat Warna-Warni (Pola Visual)</title>
  ... (Mode: Mudah / Sedang / Tantangan) ...
</head>
<body>
  <!-- Ulat Pola Panjang, Tombol Kesulitan & Web Audio API -->
  ...
</body>
</html>`}</pre>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t flex justify-end">
              <button
                onClick={() => setShowCodeModal(false)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-slate-800 rounded-xl font-bold text-sm cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
