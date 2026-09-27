import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Sparkles,
  Coffee,
  RotateCcw,
  Pause,
  Play,
  CheckCircle2,
  Droplets,
  Heart,
  Eye,
  Smile,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface DigitalWellbeingTimerProps {
  onTakeBreak?: () => void;
  onLogWater?: () => void;
  onTriggerNotification?: (title: string, message: string) => void;
}

export const DigitalWellbeingTimer: React.FC<DigitalWellbeingTimerProps> = ({
  onTakeBreak,
  onLogWater,
  onTriggerNotification
}) => {
  // Session tracking state
  const [secondsActive, setSecondsActive] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [breakAcknowledged, setBreakAcknowledged] = useState<boolean>(false);
  const [sessionStartTime] = useState<string>(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  // Guided breathing mini-break exercise state
  const [showBreathingExercise, setShowBreathingExercise] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathCount, setBreathCount] = useState<number>(4);
  const [waterLoggedToast, setWaterLoggedToast] = useState<boolean>(false);
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [showTips, setShowTips] = useState<boolean>(false);

  const ONE_HOUR_SECONDS = 3600; // 60 minutes
  const hasNotifiedRef = useRef<boolean>(false);

  // Active engagement interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsActive((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  // Check 1-hour threshold and fire notification
  useEffect(() => {
    if (secondsActive >= ONE_HOUR_SECONDS && !hasNotifiedRef.current) {
      hasNotifiedRef.current = true;
      if (onTriggerNotification) {
        onTriggerNotification(
          '🌸 Digital Wellbeing: Time for a Break',
          "You've been actively learning & connecting for 1 hour! Rest your eyes, stretch, and sip some water."
        );
      }
    }
  }, [secondsActive, onTriggerNotification]);

  // Guided breathing animation cycle
  useEffect(() => {
    if (!showBreathingExercise) return;

    let currentPhase: 'Inhale' | 'Hold' | 'Exhale' = 'Inhale';
    let count = 4;
    setBreathPhase('Inhale');
    setBreathCount(4);

    const breathInterval = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        if (currentPhase === 'Inhale') {
          currentPhase = 'Hold';
          count = 4;
        } else if (currentPhase === 'Hold') {
          currentPhase = 'Exhale';
          count = 4;
        } else {
          currentPhase = 'Inhale';
          count = 4;
        }
        setBreathPhase(currentPhase);
      }
      setBreathCount(count);
    }, 1000);

    return () => clearInterval(breathInterval);
  }, [showBreathingExercise]);

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    if (hrs > 0) {
      return `${hrs}h ${pad(mins)}m ${pad(secs)}s`;
    }
    return `${pad(mins)}m ${pad(secs)}s`;
  };

  const progressPercent = Math.min(100, Math.round((secondsActive / ONE_HOUR_SECONDS) * 100));
  const isOverOneHour = secondsActive >= ONE_HOUR_SECONDS;
  const isBreakActive = isOverOneHour && !breakAcknowledged;

  const handleResetSession = () => {
    setSecondsActive(0);
    setBreakAcknowledged(false);
    setIsTestMode(false);
    hasNotifiedRef.current = false;
  };

  const handleSimulateOneHour = () => {
    setSecondsActive(3605); // 1 hour + 5 seconds
    setBreakAcknowledged(false);
    setIsTestMode(true);
  };

  const handleSnooze = (minutes = 15) => {
    setBreakAcknowledged(true);
    // Re-enable break alert after snooze time
    setTimeout(() => {
      setBreakAcknowledged(false);
    }, minutes * 60 * 1000);
  };

  const handleDrinkWater = () => {
    if (onLogWater) {
      onLogWater();
    }
    setWaterLoggedToast(true);
    setTimeout(() => setWaterLoggedToast(false), 3000);
  };

  return (
    <div
      id="digital-wellbeing-timer-card"
      className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-6 shadow-xs border border-pink-100 dark:border-gray-800 space-y-4 transition-colors"
    >
      {/* Title & Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-xs">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <span>Digital Wellbeing & Session Timer</span>
              <span className="text-xs text-pink-500">🌸</span>
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Active engagement monitor to encourage healthy screen balance
            </p>
          </div>
        </div>

        {/* Live Badge */}
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {isRunning ? 'Tracking Active' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Main Metric & Visual Bar */}
      <div className="p-4 rounded-2xl bg-pink-50/50 dark:bg-gray-800/50 border border-pink-100/80 dark:border-gray-700/80 space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Session Engagement:</span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-gray-900 dark:text-white tracking-tight">
              {formatTime(secondsActive)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-gray-400 dark:text-gray-500">Goal: 60m Mindful Limit</span>
            <div className="text-xs font-bold text-pink-600 dark:text-pink-400">
              {progressPercent}% of recommended session
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isOverOneHour
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 animate-pulse'
                : progressPercent > 75
                ? 'bg-gradient-to-r from-pink-400 to-amber-500'
                : 'bg-gradient-to-r from-pink-500 to-rose-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-0.5">
          <span>Started at {sessionStartTime}</span>
          <span>{isOverOneHour ? '1h reached • Break suggested' : `${Math.max(0, 60 - Math.floor(secondsActive / 60))}m until 1-hour rest`}</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1-HOUR BREAK SUGGESTION BANNER                            */}
      {/* ========================================================= */}
      {isBreakActive && (
        <div
          id="break-suggestion-banner"
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 dark:from-gray-800 dark:via-rose-950/30 dark:to-gray-800 border-2 border-rose-300 dark:border-rose-500/50 shadow-sm space-y-3.5 animate-fadeIn"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Coffee className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                  Time for a Mindful Break, Sister! 🌸
                </h4>
                <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 uppercase">
                  1h Reached
                </span>
              </div>
              <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
                You’ve been actively learning and connecting on HerAura for over an hour! Taking regular breaks boosts focus, protects your vision, and honors your body.
              </p>
            </div>
          </div>

          {/* Quick Break Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => setShowBreathingExercise(!showBreathingExercise)}
              className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{showBreathingExercise ? 'Close Breath' : '2-Min Breath'}</span>
            </button>

            <button
              onClick={handleDrinkWater}
              className="px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-rose-200 dark:border-gray-700 hover:bg-rose-50 dark:hover:bg-gray-700 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
              <span>Drink Water</span>
            </button>

            <button
              onClick={() => handleSnooze(15)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Snooze (15m)</span>
            </button>
          </div>

          {/* Interactive Guided Diaphragmatic Breath */}
          {showBreathingExercise && (
            <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-rose-200 dark:border-rose-900/60 text-center space-y-3">
              <div className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>Guided Box Breathing for Clarity</span>
              </div>
              <div className="relative flex items-center justify-center">
                <div
                  className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-md ${
                    breathPhase === 'Inhale'
                      ? 'bg-rose-100 dark:bg-rose-900/50 scale-110 border-2 border-rose-400'
                      : breathPhase === 'Hold'
                      ? 'bg-amber-100 dark:bg-amber-900/50 scale-105 border-2 border-amber-400'
                      : 'bg-emerald-100 dark:bg-emerald-900/50 scale-95 border-2 border-emerald-400'
                  }`}
                >
                  <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    {breathPhase}
                  </span>
                  <span className="text-xl font-extrabold text-pink-600 dark:text-pink-400">
                    {breathCount}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Inhale gently through your nose, hold with composure, and exhale slowly to reset your nervous system.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Hydration Toast Confirmation */}
      {waterLoggedToast && (
        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2 animate-fadeIn">
          <Droplets className="w-4 h-4 text-blue-500" />
          <span>Hydration logged! Way to nurture your mind and body, sister. 💧</span>
        </div>
      )}

      {/* Timer Controls Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isRunning
                ? 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                : 'bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3 h-3" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                <span>Resume</span>
              </>
            )}
          </button>

          <button
            onClick={handleResetSession}
            className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Quick Simulation / Test Toggle for Instant Review */}
        <div className="flex items-center gap-2">
          {!isOverOneHour ? (
            <button
              onClick={handleSimulateOneHour}
              title="Test the 1-hour break suggestion state immediately"
              className="px-2.5 py-1.5 rounded-xl bg-pink-50 dark:bg-gray-800 hover:bg-pink-100 dark:hover:bg-gray-700 border border-pink-200 dark:border-gray-700 text-pink-700 dark:text-pink-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3 h-3 text-pink-500" />
              <span>Simulate 1h Break Alert</span>
            </button>
          ) : (
            <button
              onClick={handleResetSession}
              className="px-2.5 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-600 dark:text-gray-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Back to Normal</span>
            </button>
          )}

          <button
            onClick={() => setShowTips(!showTips)}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Toggle wellbeing tips"
          >
            {showTips ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Digital Wellbeing Best Practices */}
      {showTips && (
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 text-xs space-y-2 text-gray-600 dark:text-gray-400 animate-fadeIn">
          <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
            <span>HerAura 20-20-20 Eye & Posture Principles:</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <span className="font-bold text-gray-800 dark:text-gray-200 block mb-0.5">👁️ 20-20-20 Rule</span>
              Every 20 minutes, look at an object 20 feet away for at least 20 seconds.
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <span className="font-bold text-gray-800 dark:text-gray-200 block mb-0.5">🧘 Shoulder Rolls</span>
              Drop your shoulders away from your ears and take 3 deep belly breaths.
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <span className="font-bold text-gray-800 dark:text-gray-200 block mb-0.5">💧 Hydration First</span>
              Keep a glass of water nearby to stay mentally energized while studying.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
