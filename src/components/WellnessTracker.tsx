import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WellnessLog, MenstrualPeriodEntry, GratitudeEntry } from '../types';
import {
  Heart,
  Droplets,
  Moon,
  Activity,
  Calendar,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Wind,
  Plus,
  Minus,
  Save,
  Info,
  ShieldCheck,
  Bell,
  BellRing,
  Trash2,
  Quote,
  Check,
  Trophy,
  Coffee,
  RotateCcw,
  ArrowRight,
  Clock,
  Sliders,
  CheckSquare,
  Square,
  TrendingUp
} from 'lucide-react';
import { MoodEnergyD3Chart } from './MoodEnergyD3Chart';
import { INITIAL_30_DAY_MOOD_ENERGY } from '../data/initialData';

interface WellnessTrackerProps {
  onSaveWellnessLog?: (log: Partial<WellnessLog>) => void;
  onAddNotification?: (notif: {
    title: string;
    message: string;
    type: 'cycle' | 'hydration' | 'community' | 'course' | 'mentor';
    targetTab?: 'home' | 'community' | 'learn' | 'mentors' | 'wellness' | 'ai' | 'profile';
  }) => void;
}

export const WellnessTracker: React.FC<WellnessTrackerProps> = ({
  onSaveWellnessLog,
  onAddNotification
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'trends' | 'hydration' | 'gratitude' | 'menstrual' | 'mindfulness'>('trends');

  // Menstrual Health State - empty by default for new users, persisted in localStorage
  const [periodEntries, setPeriodEntries] = useState<MenstrualPeriodEntry[]>(() => {
    const saved = localStorage.getItem('her_aura_period_entries');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        /* ignore */
      }
    }
    return [];
  });

  // Configurable cycle settings (default standard 28-day cycle, 5-day duration)
  const [cycleLength, setCycleLength] = useState<number>(() => {
    const saved = localStorage.getItem('her_aura_cycle_length');
    return saved ? parseInt(saved, 10) : 28;
  });
  const [periodDuration, setPeriodDuration] = useState<number>(() => {
    const saved = localStorage.getItem('her_aura_period_duration');
    return saved ? parseInt(saved, 10) : 5;
  });
  const [showCycleSettings, setShowCycleSettings] = useState(false);

  // Self-Care preparation checklist for upcoming period
  const [prepChecklist, setPrepChecklist] = useState<{ [key: string]: boolean }>({
    supplies: true,
    tea: true,
    bath: false,
    rest: true,
    heatPad: false,
  });

  const togglePrepItem = (key: string) => {
    setPrepChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    localStorage.setItem('her_aura_cycle_length', cycleLength.toString());
  }, [cycleLength]);

  useEffect(() => {
    localStorage.setItem('her_aura_period_duration', periodDuration.toString());
  }, [periodDuration]);

  useEffect(() => {
    localStorage.setItem('her_aura_period_entries', JSON.stringify(periodEntries));
  }, [periodEntries]);

  // Intelligent Cycle Prediction Calculation Engine
  // CRITICAL: When user has not entered any menstrual records, return null (do NOT show fabricated predictions)
  const cyclePrediction = useMemo(() => {
    if (periodEntries.length === 0) {
      return null;
    }

    const sorted = [...periodEntries].sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
    const lastEntry = sorted[0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastStart = new Date(lastEntry.startDate + 'T00:00:00');
    lastStart.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today.getTime() - lastStart.getTime()) / 86400000);
    // Cycle Day: 1-indexed
    const currentDay = Math.max(1, (diffDays % cycleLength) + 1);

    // Next predicted period start date
    const cyclesElapsed = Math.max(0, Math.floor(diffDays / cycleLength));
    const nextStart = new Date(lastStart.getTime() + (cyclesElapsed + 1) * cycleLength * 86400000);
    const daysUntilNext = Math.ceil((nextStart.getTime() - today.getTime()) / 86400000);

    // Fertile window & ovulation (standard 14 days before next period)
    const ovulationDay = Math.max(1, cycleLength - 14);
    const currentCycleStart = new Date(lastStart.getTime() + cyclesElapsed * cycleLength * 86400000);
    const ovulationDate = new Date(currentCycleStart.getTime() + (ovulationDay - 1) * 86400000);
    const fertileStart = new Date(ovulationDate.getTime() - 5 * 86400000);
    const fertileEnd = new Date(ovulationDate.getTime() + 1 * 86400000);

    // Determine current hormonal phase
    let phaseName = 'Follicular Phase';
    let phaseBadge = '🌱 Estrogen Rising';
    let phaseGradient = 'from-purple-500 via-pink-500 to-indigo-600';
    let phaseDescription =
      'Estrogen is climbing, bringing sharp mental clarity, optimistic energy, and social confidence.';
    let selfCareTips = [
      'Excellent time for studying, learning tech skills, and starting ambitious goals',
      'Nourish with vibrant leafy salads, citrus, and complex grains',
      'Engage in brisk walking, cardio, or dance'
    ];

    if (currentDay <= periodDuration) {
      phaseName = 'Menstrual Phase';
      phaseBadge = '🩸 Renewal & Rest';
      phaseGradient = 'from-rose-500 via-pink-600 to-red-500';
      phaseDescription =
        'Hormone levels are at baseline. Your body is resetting. Honor peaceful pacing, warmth, and self-compassion.';
      selfCareTips = [
        'Soothe with warm compresses, hot water bottles, and chamomile or ginger tea',
        'Replenish iron and magnesium with hearty soups, dark greens, and dark chocolate',
        'Gentle restorative yoga, pelvic stretches, and cozy sleep'
      ];
    } else if (currentDay >= ovulationDay - 1 && currentDay <= ovulationDay + 1) {
      phaseName = 'Ovulation Phase';
      phaseBadge = '✨ Peak Vitality';
      phaseGradient = 'from-amber-500 via-rose-500 to-pink-500';
      phaseDescription =
        'Peak estrogen and luteinizing hormone surge. Highest confidence, glowing skin, and peak communication energy.';
      selfCareTips = [
        'Harness peak confidence for mentor discussions, pitches, or community discussions',
        'Stay crisp and hydrated with infused lemon or cucumber water',
        'High metabolic rate — balanced proteins and fresh colorful berries'
      ];
    } else if (currentDay > ovulationDay + 1) {
      phaseName = 'Luteal Phase';
      phaseBadge = '🌙 Calming Inward';
      phaseGradient = 'from-pink-600 via-rose-500 to-fuchsia-600';
      phaseDescription =
        'Progesterone dominance. Your body prepares for renewal. Protect emotional energy and honor downtime.';
      selfCareTips = [
        'Magnesium-rich foods (pumpkin seeds, bananas) to prevent mood dips & cramps',
        'Cut down on excess salt and caffeine to alleviate water retention',
        'Journaling, warm baths, and boundary-setting without guilt'
      ];
    }

    // Next 3 predicted cycles for forward planning
    const upcomingCycles = [1, 2, 3].map((offset) => {
      const cStart = new Date(lastStart.getTime() + (cyclesElapsed + offset) * cycleLength * 86400000);
      const cEnd = new Date(cStart.getTime() + (periodDuration - 1) * 86400000);
      return {
        cycleNum: offset,
        startDateFormatted: cStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        endDateFormatted: cEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        daysAway: Math.ceil((cStart.getTime() - today.getTime()) / 86400000)
      };
    });

    // Friendly countdown text
    let countdownText = `In ${daysUntilNext} days`;
    if (daysUntilNext === 1) countdownText = 'Starts tomorrow';
    if (daysUntilNext === 0) countdownText = 'Expected today';
    if (daysUntilNext < 0) countdownText = `${Math.abs(daysUntilNext)} days overdue`;

    return {
      currentDay,
      nextStartDateFormatted: nextStart.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      daysUntilNext,
      countdownText,
      phaseName,
      phaseBadge,
      phaseGradient,
      phaseDescription,
      selfCareTips,
      ovulationDateFormatted: ovulationDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fertileWindowFormatted: `${fertileStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${fertileEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      upcomingCycles
    };
  }, [periodEntries, cycleLength, periodDuration]);

  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newFlow, setNewFlow] = useState<'light' | 'medium' | 'heavy' | 'spotting'>('medium');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState('Calm');
  const [periodNotes, setPeriodNotes] = useState('');
  const [logSuccessNotice, setLogSuccessNotice] = useState<string | null>(null);

  // Symptoms choices
  const symptomChoices = [
    'Cramps',
    'Fatigue',
    'Headache',
    'Bloating',
    'Acne',
    'Tender breasts',
    'Craving',
    'Backache',
    'Mood swings'
  ];

  const moodChoices = ['Calm', 'Sensitive', 'Anxious', 'Energetic', 'Irritable', 'Tired'];

  // Hydration & Daily Habits state
  const [waterGlasses, setWaterGlasses] = useState<number>(() => {
    const saved = localStorage.getItem('her_aura_water_glasses');
    return saved ? parseInt(saved, 10) : 6;
  });
  const waterGoal = 8;
  const hydrationPercent = Math.min(100, Math.round((waterGlasses / waterGoal) * 100));

  // Push Notification Triggers State
  const [remindersActive, setRemindersActive] = useState<boolean>(() => {
    return localStorage.getItem('her_aura_water_reminders') === 'true';
  });
  const [reminderInterval, setReminderInterval] = useState<string>('2h');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    return typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default';
  });
  const [inAppToast, setInAppToast] = useState<{ title: string; message: string } | null>(null);

  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [activityMinutes, setActivityMinutes] = useState<number>(30);
  const [journalEntry, setJournalEntry] = useState<string>('');

  // Daily Gratitude State
  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');
  const [gratitudeHistory, setGratitudeHistory] = useState<GratitudeEntry[]>(() => {
    const saved = localStorage.getItem('her_aura_gratitude_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'grat-1',
        date: '2026-03-20',
        formattedDate: 'Today, Mar 20',
        items: [
          'A quiet moment of peaceful morning sunshine and tea',
          'Encouragement from my sisterhood and mentors on HerAura',
          'Listening to my body and honoring its natural cycle'
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'grat-2',
        date: '2026-03-19',
        formattedDate: 'Yesterday, Mar 19',
        items: [
          'Completing a course lesson on building self-confidence',
          'A comforting video call with a dear friend',
          'Allowing myself to rest without guilt or pressure'
        ],
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  });

  // Breathing exercise state (Box breathing: Inhale 4s, Hold 4s, Exhale 4s, Pause 4s)
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathTimer, setBreathTimer] = useState(4);

  useEffect(() => {
    localStorage.setItem('her_aura_water_glasses', waterGlasses.toString());
  }, [waterGlasses]);

  useEffect(() => {
    localStorage.setItem('her_aura_water_reminders', remindersActive.toString());
  }, [remindersActive]);

  useEffect(() => {
    localStorage.setItem('her_aura_gratitude_history', JSON.stringify(gratitudeHistory));
  }, [gratitudeHistory]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            setBreathPhase((currentPhase) => {
              if (currentPhase === 'Inhale') return 'Hold';
              if (currentPhase === 'Hold') return 'Exhale';
              if (currentPhase === 'Exhale') return 'Rest';
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathPhase('Inhale');
      setBreathTimer(4);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathing]);

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleLogPeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStartDate) {
      return;
    }

    const newEntry: MenstrualPeriodEntry = {
      id: 'p-' + Date.now(),
      startDate: newStartDate,
      endDate: newEndDate || newStartDate,
      flowIntensity: newFlow,
      symptoms: selectedSymptoms,
      mood: selectedMood,
      notes: periodNotes,
      cycleDay: 1
    };

    const updated = [newEntry, ...periodEntries];
    setPeriodEntries(updated);
    setLogSuccessNotice('🌸 Period entry securely logged! Your cycle predictions and phase guidance have been updated.');
    setTimeout(() => setLogSuccessNotice(null), 3500);

    if (onAddNotification) {
      onAddNotification({
        title: '🌸 Period Logged & Prediction Updated',
        message: `New cycle record starting ${newStartDate} logged. Estimated next cycle updated.`,
        type: 'cycle',
        targetTab: 'wellness'
      });
    }

    setNewStartDate('');
    setNewEndDate('');
    setSelectedSymptoms([]);
    setPeriodNotes('');
  };

  const handleSaveDailyWellness = () => {
    if (onSaveWellnessLog) {
      onSaveWellnessLog({
        waterGlasses,
        sleepHours,
        activityMinutes,
        journalEntry
      });
    }
    setLogSuccessNotice('Daily wellness habits and journal entry saved successfully.');
    setTimeout(() => setLogSuccessNotice(null), 3500);
  };

  // Push Notification Triggers Implementation
  const handleEnableReminders = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        if (permission === 'granted') {
          setRemindersActive(true);
          triggerHydrationPush(true);
        } else {
          setRemindersActive(true);
          triggerInAppReminder('Hydration reminders activated! You will receive in-app wellness nudges.');
        }
      } catch {
        setRemindersActive(true);
        triggerInAppReminder('Hydration reminders active on this device.');
      }
    } else {
      setRemindersActive(true);
      triggerInAppReminder('Hydration reminders enabled in-app.');
    }
  };

  const triggerHydrationPush = (isInitial = false) => {
    const title = isInitial ? '💧 HerAura Hydration Active!' : '💧 Time to Hydrate & Flourish!';
    const body = isInitial
      ? `Hydration reminders are set for every ${reminderInterval}. Remember to drink a glass of water right now!`
      : `You're at ${waterGlasses}/8 glasses (${hydrationPercent}%). Take a mindful pause and drink a fresh glass of water!`;

    // 1. Browser Push Notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      } catch {
        // Fallback to in-app toast
      }
    }

    // 2. High-visibility in-app toast banner
    triggerInAppReminder(body, title);
  };

  const triggerInAppReminder = (message: string, title = '💧 Hydration Reminder') => {
    setInAppToast({ title, message });
    setTimeout(() => {
      setInAppToast(null);
    }, 5000);
  };

  // Save Daily Gratitude
  const handleSaveGratitude = (e: React.FormEvent) => {
    e.preventDefault();
    const items = [gratitude1.trim(), gratitude2.trim(), gratitude3.trim()].filter(Boolean);
    if (items.length === 0) {
      setLogSuccessNotice('Please write at least one thing you are grateful for.');
      setTimeout(() => setLogSuccessNotice(null), 3000);
      return;
    }

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const newEntry: GratitudeEntry = {
      id: 'grat-' + Date.now(),
      date: today.toISOString().split('T')[0],
      formattedDate: `Today, ${formattedDate}`,
      items: items,
      createdAt: today.toISOString()
    };

    setGratitudeHistory([newEntry, ...gratitudeHistory]);
    setGratitude1('');
    setGratitude2('');
    setGratitude3('');
    setLogSuccessNotice('✨ Today’s gratitude saved to your wellness journey!');
    setTimeout(() => setLogSuccessNotice(null), 3500);
  };

  const handleDeleteGratitude = (id: string) => {
    setGratitudeHistory(gratitudeHistory.filter((g) => g.id !== id));
    setLogSuccessNotice('Gratitude entry removed from history.');
    setTimeout(() => setLogSuccessNotice(null), 2500);
  };

  const handleDeletePeriod = (id: string) => {
    setPeriodEntries((prev) => prev.filter((p) => p.id !== id));
    setLogSuccessNotice('Period log removed.');
    setTimeout(() => setLogSuccessNotice(null), 2500);
  };

  const handleTriggerCycleNotification = () => {
    if (!cyclePrediction) return;
    const title = `🌸 Cycle Alert: Next Period ${cyclePrediction.countdownText.toLowerCase()}`;
    const message = `Your next cycle is estimated to start on ${cyclePrediction.nextStartDateFormatted}. Stay hydrated and make room for gentle rest.`;

    if (onAddNotification) {
      onAddNotification({
        title,
        message,
        type: 'cycle',
        targetTab: 'wellness'
      });
    }

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body: message });
      } catch {
        // ignore
      }
    }

    setLogSuccessNotice(`🌸 Cycle reminder saved: "${title}"`);
    setTimeout(() => setLogSuccessNotice(null), 3500);
  };

  return (
    <div id="wellness-tracker-screen" className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* In-App Push Reminder Toast */}
      <AnimatePresence>
        {inAppToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm w-full bg-blue-600 text-white p-4 rounded-2xl shadow-xl border border-blue-400 flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h5 className="text-xs font-bold uppercase tracking-wider text-blue-100">{inAppToast.title}</h5>
              <p className="text-xs text-white mt-0.5 leading-snug">{inAppToast.message}</p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    setWaterGlasses((prev) => prev + 1);
                    setInAppToast(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white text-blue-700 text-[11px] font-bold hover:bg-blue-50 transition-colors"
                >
                  + Log 1 Glass
                </button>
                <button
                  onClick={() => setInAppToast(null)}
                  className="px-2 py-1 text-[11px] text-blue-200 hover:text-white"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span>Feminine Wellness & Daily Sanctuary</span>
          <span className="text-pink-500">🌸</span>
        </h1>
        <p className="text-xs text-gray-500">
          Nurture your daily hydration, gratitude, emotional mindfulness, and hormonal balance
        </p>
      </div>

      {/* Sub-tabs: 5 Pillars of Feminine Wellness */}
      <div className="flex flex-wrap rounded-2xl bg-pink-50/80 p-1.5 border border-pink-100 gap-1 sm:gap-0">
        {[
          { id: 'trends', label: 'Mood & Energy (30d)', icon: TrendingUp },
          { id: 'hydration', label: 'Hydration & Habits', icon: Droplets },
          { id: 'gratitude', label: 'Daily Gratitude', icon: Sparkles },
          { id: 'menstrual', label: 'Cycle & Menstrual', icon: Calendar },
          { id: 'mindfulness', label: 'Box Breathing', icon: Wind }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex-1 min-w-[130px] py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-white text-[#e6007e] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Toast Notice */}
      {logSuccessNotice && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{logSuccessNotice}</span>
        </motion.div>
      )}

      {/* SUB-TAB 0: D3.JS 30-DAY MOOD & ENERGY TRENDS */}
      {activeSubTab === 'trends' && (
        <motion.div
          key="trends-tab"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          <MoodEnergyD3Chart
            initialData={INITIAL_30_DAY_MOOD_ENERGY}
            onAddNotification={onAddNotification}
          />
        </motion.div>
      )}

      {/* SUB-TAB 1: HYDRATION & HABITS */}
      {activeSubTab === 'hydration' && (
        <motion.div
          key="hydration-tab"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* Hydration Tracker Card with Visual Goal Progress Bar */}
          <div className="bg-white p-6 rounded-3xl shadow-xs border border-pink-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Daily Hydration Tracking</h3>
                  <p className="text-xs text-gray-500">
                    Goal: {waterGoal} glasses (approx. 2 Liters) of clean, nourishing water
                  </p>
                </div>
              </div>

              {/* Progress Count Chip */}
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">{waterGlasses}</span>
                <span className="text-xs text-gray-400 font-semibold">/ {waterGoal} glasses</span>
                {waterGlasses >= waterGoal && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-emerald-600" />
                    <span>Goal Met!</span>
                  </span>
                )}
              </div>
            </div>

            {/* Visual Goal Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span>Hydration Progress</span>
                </span>
                <span className="text-blue-600 font-bold">{hydrationPercent}%</span>
              </div>

              {/* Multi-milestone Progress Bar */}
              <div className="relative w-full h-5 bg-blue-50 rounded-full p-1 border border-blue-100 overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full transition-all duration-500 relative flex items-center justify-end pr-2"
                  style={{ width: `${Math.max(5, hydrationPercent)}%` }}
                >
                  <div className="absolute inset-0 bg-white/25 rounded-full opacity-50 pointer-events-none" />
                </div>
              </div>

              {/* Progress Milestone Indicators */}
              <div className="grid grid-cols-4 text-[10px] sm:text-[11px] text-gray-400 pt-1">
                <span className={waterGlasses >= 2 ? 'text-blue-600 font-semibold' : ''}>25% Morning</span>
                <span className={`text-center ${waterGlasses >= 4 ? 'text-blue-600 font-semibold' : ''}`}>50% Midday</span>
                <span className={`text-center ${waterGlasses >= 6 ? 'text-blue-600 font-semibold' : ''}`}>75% Afternoon</span>
                <span className={`text-right ${waterGlasses >= 8 ? 'text-emerald-600 font-bold' : ''}`}>100% Glow 🎉</span>
              </div>
            </div>

            {/* 8 Interactive Glass Buttons */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Quick Glass Selector (Tap to fill or unfill):
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {Array.from({ length: waterGoal }).map((_, idx) => {
                  const glassNum = idx + 1;
                  const isFilled = glassNum <= waterGlasses;
                  return (
                    <button
                      key={glassNum}
                      type="button"
                      onClick={() => setWaterGlasses(glassNum === waterGlasses ? glassNum - 1 : glassNum)}
                      className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        isFilled
                          ? 'bg-blue-500 text-white border-blue-600 shadow-xs scale-105'
                          : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-blue-50 hover:text-blue-500'
                      }`}
                      title={`Set to ${glassNum} glasses`}
                    >
                      <Droplets className={`w-5 h-5 ${isFilled ? 'fill-white text-white' : ''}`} />
                      <span className="text-[10px] font-bold">#{glassNum}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Adjustment Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  id="decrement-water-btn"
                  onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
                  className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>-1 Glass</span>
                </button>
                <button
                  id="increment-water-btn"
                  onClick={() => setWaterGlasses(waterGlasses + 1)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+1 Glass</span>
                </button>
                <button
                  onClick={() => setWaterGlasses(0)}
                  className="px-2.5 py-2 rounded-xl text-gray-400 hover:text-gray-600 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reset count for today"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Push Notification Trigger Controls */}
              <div className="flex items-center gap-2">
                <button
                  id="trigger-hydration-push-btn"
                  onClick={() => triggerHydrationPush(false)}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-200"
                  title="Test push notification trigger"
                >
                  <BellRing className="w-3.5 h-3.5 text-blue-600" />
                  <span>Trigger Push Notification</span>
                </button>
              </div>
            </div>

            {/* Push Notification Scheduling Card */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-gray-900">Hydration Push Notification Triggers</span>
                  {notificationPermission === 'granted' && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      System Push Permitted
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-600">Interval:</label>
                  <select
                    value={reminderInterval}
                    onChange={(e) => setReminderInterval(e.target.value)}
                    className="text-xs bg-white border border-blue-200 rounded-lg px-2 py-1 font-semibold text-gray-700 focus:outline-none"
                  >
                    <option value="1h">Every 1 hour</option>
                    <option value="2h">Every 2 hours</option>
                    <option value="3h">Every 3 hours</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-[11px] text-gray-500">
                  {remindersActive
                    ? `Automatic reminders active (Every ${reminderInterval}). You'll receive gentle nudges to keep your skin glowing and energy high.`
                    : 'Enable gentle browser notifications and in-app alerts so you never forget to drink water.'}
                </p>
                <button
                  id="toggle-reminders-active-btn"
                  onClick={handleEnableReminders}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    remindersActive
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {remindersActive ? 'Reminders Active ✓' : 'Enable Reminders'}
                </button>
              </div>
            </div>
          </div>

          {/* Sleep & Movement Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sleep Tracker */}
            <div className="bg-white p-5 rounded-3xl shadow-xs border border-pink-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <Moon className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-gray-400 uppercase">Restful Sleep</h4>
              <span className="text-2xl font-bold text-gray-900 my-1">{sleepHours} Hours</span>
              <p className="text-[11px] text-gray-500 mb-3">Goal: 8 hours restorative sleep</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSleepHours(Math.max(0, Math.round((sleepHours - 0.5) * 10) / 10))}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSleepHours(Math.round((sleepHours + 0.5) * 10) / 10)}
                  className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center font-bold shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Movement / Activity */}
            <div className="bg-white p-5 rounded-3xl shadow-xs border border-pink-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-gray-400 uppercase">Movement</h4>
              <span className="text-2xl font-bold text-gray-900 my-1">{activityMinutes} Mins</span>
              <p className="text-[11px] text-gray-500 mb-3">Walking, yoga, or stretching</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActivityMinutes(Math.max(0, activityMinutes - 10))}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActivityMinutes(activityMinutes + 10)}
                  className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Daily Journal Saver */}
          <div className="bg-white p-6 rounded-3xl shadow-xs border border-pink-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-pink-600" />
              <span>Personal Reflection Journal</span>
            </h3>
            <textarea
              rows={3}
              placeholder="How are you honoring yourself today? Write your feelings, breakthroughs, or intentions..."
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              className="w-full p-4 rounded-2xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none placeholder-gray-400"
            />
            <button
              onClick={handleSaveDailyWellness}
              className="px-6 py-2.5 rounded-full bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Today's Reflection & Habits</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* SUB-TAB 2: DAILY GRATITUDE */}
      {activeSubTab === 'gratitude' && (
        <motion.div
          key="gratitude-tab"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* Gratitude Log Card */}
          <div className="bg-white p-6 rounded-3xl shadow-xs border border-pink-100 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Daily Gratitude Sanctuary</h3>
                  <p className="text-xs text-gray-500">
                    Take 2 minutes to anchor into thankfulness. Log 3 things that light up your heart.
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
                {gratitudeHistory.length} Days Recorded
              </span>
            </div>

            <form onSubmit={handleSaveGratitude} className="space-y-4">
              <div className="space-y-3">
                {/* Item 1 */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 font-bold text-[11px] flex items-center justify-center">
                      1
                    </span>
                    <span>Something simple that brought peace or a smile today:</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. The aroma of morning coffee, a kind smile from a stranger..."
                    value={gratitude1}
                    onChange={(e) => setGratitude1(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  />
                </div>

                {/* Item 2 */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 font-bold text-[11px] flex items-center justify-center">
                      2
                    </span>
                    <span>A person, mentor, or sister who uplifted me:</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. My mentor Rita whose advice gave me clarity, my best friend..."
                    value={gratitude2}
                    onChange={(e) => setGratitude2(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  />
                </div>

                {/* Item 3 */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 font-bold text-[11px] flex items-center justify-center">
                      3
                    </span>
                    <span>Something I genuinely appreciate about myself or my growth:</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Having the courage to try a new course, taking time to rest..."
                    value={gratitude3}
                    onChange={(e) => setGratitude3(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                id="save-gratitude-entry-btn"
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[#e6007e] hover:bg-[#c9006e] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Today's 3 Gratitudes</span>
              </button>
            </form>
          </div>

          {/* Gratitude History List */}
          <div className="bg-white p-6 rounded-3xl shadow-xs border border-pink-100 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Quote className="w-4 h-4 text-pink-500" />
                <span>Gratitude History & Reflections</span>
              </h4>
              <span className="text-xs text-gray-400">Stored safely on your device</span>
            </div>

            {gratitudeHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs">
                No gratitude entries yet. Fill out the three prompts above to begin your journey!
              </div>
            ) : (
              <div className="space-y-3">
                {gratitudeHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 rounded-2xl bg-gradient-to-r from-pink-50/50 to-rose-50/40 border border-pink-100 space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-pink-700 bg-pink-100/70 px-2.5 py-0.5 rounded-md text-[11px]">
                        {entry.formattedDate}
                      </span>
                      <button
                        onClick={() => handleDeleteGratitude(entry.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <ul className="space-y-1.5 text-xs text-gray-700 pt-1">
                      {entry.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-pink-500 font-bold mt-0.5">•</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* SUB-TAB 3: MENSTRUAL HEALTH */}
      {activeSubTab === 'menstrual' && (
        <motion.div
          key="menstrual-tab"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* CONDITIONAL PREDICTION DISPLAY: Only shown when user has logged menstrual data */}
          {!cyclePrediction ? (
            /* EMPTY STATE: Shown when user has never logged any menstrual data */
            <div
              id="menstrual-empty-state"
              className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-3xl shadow-xs border border-pink-100 dark:border-gray-700 text-center space-y-4 transition-colors"
            >
              <div className="w-16 h-16 mx-auto rounded-3xl bg-pink-100 dark:bg-pink-950/60 text-[#e6007e] dark:text-pink-400 flex items-center justify-center shadow-xs">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="max-w-lg mx-auto space-y-2">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white leading-snug">
                  Log your period information to get personalised cycle insights and predictions.
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  HerAura keeps your cycle records 100% private and stored locally on your device. Once you record your first period dates below, you'll unlock your personalised cycle phase, estimated ovulation, and soothing self-care tips.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  id="empty-state-log-period-btn"
                  onClick={() => {
                    const formElement = document.getElementById('log-menstrual-entry-form');
                    if (formElement) {
                      formElement.scrollIntoView({ behavior: 'smooth' });
                      const input = formElement.querySelector('input[type="date"]') as HTMLInputElement;
                      if (input) input.focus();
                    }
                  }}
                  className="px-6 py-3 rounded-2xl bg-[#e6007e] hover:bg-[#c9006e] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Period</span>
                </button>
              </div>
            </div>
          ) : (
            /* FULL PREDICTION: Displayed ONLY when real menstrual entries exist */
            <>
              {/* Cycle Overview Banner with Live Prediction */}
              <div className={`bg-gradient-to-br ${cyclePrediction.phaseGradient} text-white p-6 sm:p-7 rounded-3xl shadow-md transition-all`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-pink-100 uppercase tracking-wider">
                        Current Cycle Phase
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-semibold backdrop-blur-xs">
                        {cyclePrediction.phaseBadge}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                      Day {cyclePrediction.currentDay} of {cycleLength} • {cyclePrediction.phaseName}
                    </h3>
                    <p className="text-xs text-pink-100/90 max-w-lg leading-relaxed">
                      {cyclePrediction.phaseDescription}
                    </p>
                  </div>

                  {/* Dynamic Next Period Prediction Box */}
                  <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/25 text-center flex-shrink-0 min-w-[170px] shadow-xs">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-pink-100 block">
                      Predicted Next Period
                    </span>
                    <span className="text-base sm:text-lg font-extrabold text-white block mt-0.5">
                      {cyclePrediction.nextStartDateFormatted}
                    </span>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-white text-[#e6007e] font-extrabold text-[11px] shadow-2xs">
                      {cyclePrediction.countdownText}
                    </span>
                  </div>
                </div>

                {/* Cycle Visual Bar with 4 Phase Indicators */}
                <div className="mt-6 pt-4 border-t border-white/20 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-pink-100 font-medium">
                    <span>🩸 Menstrual (1–{periodDuration})</span>
                    <span>🌱 Follicular</span>
                    <span>✨ Ovulation (Day {cycleLength - 14})</span>
                    <span>🌙 Luteal</span>
                  </div>
                  <div className="w-full h-3 bg-black/25 rounded-full overflow-hidden relative p-0.5">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-700 shadow-xs"
                      style={{ width: `${Math.min(100, Math.max(5, (cyclePrediction.currentDay / cycleLength) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* NEXT CYCLE PREDICTION & SELF-CARE PREP CARD */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Left 2 Cols: Prediction Details & Next Cycles Forecast */}
                <div className="md:col-span-2 space-y-5">
                  {/* Prediction Engine Highlights Card */}
                  <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-3xl shadow-xs border border-pink-100 dark:border-gray-700 space-y-4 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950/60 flex items-center justify-center text-pink-600 dark:text-pink-400">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white">Period Prediction & Fertility Windows</h4>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Calculated from your logged cycle intervals</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowCycleSettings(!showCycleSettings)}
                        className="text-xs font-semibold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 flex items-center gap-1 bg-pink-50 dark:bg-pink-950/60 hover:bg-pink-100 dark:hover:bg-pink-900/60 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Adjust Cycle</span>
                      </button>
                    </div>

                    {/* Cycle Settings Drawer */}
                    {showCycleSettings && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 rounded-2xl bg-pink-50/60 dark:bg-gray-700/60 border border-pink-100 dark:border-gray-600 space-y-3 text-xs"
                      >
                        <h5 className="font-bold text-gray-800 dark:text-gray-200">Customize Your Cycle Parameters:</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              Cycle Length: <strong className="text-pink-600 dark:text-pink-400">{cycleLength} days</strong> (typically 21–35)
                            </label>
                            <input
                              type="range"
                              min={21}
                              max={35}
                              value={cycleLength}
                              onChange={(e) => setCycleLength(parseInt(e.target.value, 10))}
                              className="w-full accent-pink-600 cursor-pointer"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              Period Bleeding Duration: <strong className="text-pink-600 dark:text-pink-400">{periodDuration} days</strong>
                            </label>
                            <input
                              type="range"
                              min={3}
                              max={8}
                              value={periodDuration}
                              onChange={(e) => setPeriodDuration(parseInt(e.target.value, 10))}
                              className="w-full accent-pink-600 cursor-pointer"
                            />
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 italic">
                          Adjusting these updates your projected period, ovulation, and self-care schedule instantly.
                        </p>
                      </motion.div>
                    )}

                    {/* 3 Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div className="p-3.5 rounded-2xl bg-pink-50/50 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/50">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 block">
                          Next Period
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white block mt-0.5">
                          {cyclePrediction.nextStartDateFormatted}
                        </span>
                        <span className="text-[11px] font-semibold text-pink-700 dark:text-pink-300 block mt-0.5">
                          {cyclePrediction.countdownText}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                          Est. Ovulation
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white block mt-0.5">
                          {cyclePrediction.ovulationDateFormatted}
                        </span>
                        <span className="text-[11px] text-purple-700 dark:text-purple-300 block mt-0.5">
                          Day {cycleLength - 14}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                          Fertile Window
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white block mt-0.5">
                          {cyclePrediction.fertileWindowFormatted}
                        </span>
                        <span className="text-[11px] text-rose-700 dark:text-rose-300 block mt-0.5">
                          Peak vitality
                        </span>
                      </div>
                    </div>

                    {/* Next 3 Cycles Forecast Timeline */}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2.5">
                      <h5 className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                        <span>Upcoming 3-Cycle Forecast (Plan Ahead)</span>
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {cyclePrediction.upcomingCycles.map((cycle) => (
                          <div
                            key={cycle.cycleNum}
                            className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 text-xs flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                              <span className="font-bold text-gray-700 dark:text-gray-300">Cycle {cycle.cycleNum}</span>
                              <span className="text-pink-600 dark:text-pink-400 font-semibold">in {cycle.daysAway}d</span>
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white text-xs">
                              {cycle.startDateFormatted} – {cycle.endDateFormatted}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Trigger Notification Button */}
                    <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Want an active alert before your cycle begins?</span>
                      <button
                        onClick={handleTriggerCycleNotification}
                        className="px-3.5 py-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 dark:bg-pink-900/60 dark:hover:bg-pink-800/80 text-pink-700 dark:text-pink-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>Send Cycle Alert to Notifications</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right 1 Col: Self-Care Preparation Checklist */}
                <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-3xl shadow-xs border border-pink-100 dark:border-gray-700 flex flex-col justify-between space-y-4 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">Period Prep Checklist</h4>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3.5">
                      Prepare your comforting essentials before cycle day 1:
                    </p>

                    <div className="space-y-2.5 text-xs">
                      {[
                        { id: 'supplies', label: 'Pack sanitary pads / tampons in bag' },
                        { id: 'tea', label: 'Stock chamomile & ginger herbal teas' },
                        { id: 'heatPad', label: 'Locate warm compress or heating pad' },
                        { id: 'bath', label: 'Plan warm restorative evening bath' },
                        { id: 'rest', label: 'Schedule 8+ hours sleep without alarms' }
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => togglePrepItem(item.id)}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-pink-50/50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                        >
                          {prepChecklist[item.id] ? (
                            <CheckSquare className="w-4 h-4 text-[#e6007e] flex-shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          )}
                          <span className={prepChecklist[item.id] ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400'}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phase specific wellness tip */}
                  <div className="p-3.5 rounded-2xl bg-pink-50/70 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/50 text-xs">
                    <span className="font-bold text-pink-800 dark:text-pink-300 block mb-1">
                      💡 Tip for {cyclePrediction.phaseName}:
                    </span>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {cyclePrediction.selfCareTips[0]}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Menstrual Logging Card */}
          <div
            id="log-menstrual-entry-form"
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xs border border-pink-100 dark:border-gray-700 space-y-5 transition-colors"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                <span>Log Period Dates & Symptoms</span>
              </h3>
              <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-pink-500" />
                <span>100% Private & Encrypted</span>
              </span>
            </div>

            <form onSubmit={handleLogPeriod} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Period Start Date:
                  </label>
                  <input
                    type="date"
                    required
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-400 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Period End Date (or leave empty if active):
                  </label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Flow Intensity:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['spotting', 'light', 'medium', 'heavy'] as const).map((flow) => (
                    <button
                      type="button"
                      key={flow}
                      onClick={() => setNewFlow(flow)}
                      className={`py-2 px-2 text-xs font-semibold rounded-xl capitalize transition-all cursor-pointer ${
                        newFlow === flow
                          ? 'bg-pink-600 text-white shadow-xs'
                          : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-pink-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {flow}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Symptoms Experienced:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {symptomChoices.map((sym) => {
                    const isSelected = selectedSymptoms.includes(sym);
                    return (
                      <button
                        type="button"
                        key={sym}
                        onClick={() => toggleSymptom(sym)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-pink-100 dark:bg-pink-950/70 text-pink-800 dark:text-pink-300 border border-pink-300 dark:border-pink-800 font-semibold'
                            : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-pink-200'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {sym}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Predominant Mood:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {moodChoices.map((mood) => (
                    <button
                      type="button"
                      key={mood}
                      onClick={() => setSelectedMood(mood)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        selectedMood === mood
                          ? 'bg-rose-500 text-white'
                          : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-650'
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Private Notes & Physical Observations:
                </label>
                <textarea
                  rows={2}
                  placeholder="Record herbal teas, remedies used, or how you felt today..."
                  value={periodNotes}
                  onChange={(e) => setPeriodNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-400 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#e6007e] hover:bg-[#c9006e] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
              >
                Log Menstrual Entry
              </button>
            </form>
          </div>

          {/* Past Period Logs History */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xs border border-pink-100 dark:border-gray-700 space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Recorded Period Logs</h3>
              {periodEntries.length > 0 && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {periodEntries.length} {periodEntries.length === 1 ? 'record' : 'records'}
                </span>
              )}
            </div>

            {periodEntries.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400 dark:text-gray-500">
                <p className="font-semibold text-gray-500 dark:text-gray-400">No period entries recorded yet.</p>
                <p className="mt-1">Record your dates above to start tracking your cycle and generate predictions.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {periodEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 rounded-2xl bg-pink-50/40 dark:bg-gray-700/40 border border-pink-100 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white">
                          {entry.startDate} {entry.endDate && entry.endDate !== entry.startDate ? `to ${entry.endDate}` : ''}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-pink-200/80 dark:bg-pink-900/60 text-pink-800 dark:text-pink-300 font-bold uppercase text-[10px]">
                          {entry.flowIntensity}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1 text-gray-600 dark:text-gray-400">
                        <span>Mood: {entry.mood}</span>
                        {entry.symptoms.length > 0 && (
                          <>
                            <span>•</span>
                            <span>Symptoms: {entry.symptoms.join(', ')}</span>
                          </>
                        )}
                      </div>
                      {entry.notes && (
                        <p className="text-gray-500 dark:text-gray-400 italic mt-1 text-[11px]">"{entry.notes}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-[11px] font-semibold text-pink-600 dark:text-pink-400 bg-white dark:bg-gray-800 px-2.5 py-1 rounded-lg border border-pink-100 dark:border-gray-700">
                        Cycle Day {entry.cycleDay}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeletePeriod(entry.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Delete this record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Medical Disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Medical Disclaimer:</strong> HerAura provides cycle estimates for informational wellness purposes only and is not medical advice or a substitute for clinical diagnostics. Always consult a licensed healthcare professional for any medical concerns.
            </p>
          </div>
        </motion.div>
      )}

      {/* SUB-TAB 4: MINDFULNESS & BREATHING */}
      {activeSubTab === 'mindfulness' && (
        <motion.div
          key="mindfulness-tab"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* Interactive Animated Box Breathing */}
          <div className="bg-gradient-to-b from-pink-50 to-rose-50 p-8 rounded-3xl border border-pink-100 flex flex-col items-center text-center">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              4-4-4-4 Box Breathing Relaxation
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mb-6">
              Regulate your autonomic nervous system, soothe tension, and return to your peaceful center.
            </p>

            {/* Breathing Animation Circle */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-6">
              <div
                className={`absolute inset-0 rounded-full border-4 transition-all duration-1000 ${
                  isBreathing
                    ? breathPhase === 'Inhale'
                      ? 'scale-110 border-pink-500 bg-pink-200/40 shadow-xl'
                      : breathPhase === 'Hold'
                      ? 'scale-110 border-rose-400 bg-rose-200/40'
                      : breathPhase === 'Exhale'
                      ? 'scale-90 border-pink-400 bg-pink-100/30'
                      : 'scale-90 border-gray-300 bg-gray-100/30'
                    : 'border-pink-200 bg-white shadow-xs'
                }`}
              />

              <div className="relative z-10 flex flex-col items-center">
                <Wind className="w-7 h-7 text-pink-600 mb-1 animate-pulse" />
                <span className="text-xl font-serif font-bold text-gray-900">
                  {isBreathing ? breathPhase : 'Ready'}
                </span>
                <span className="text-sm font-bold text-pink-600">
                  {isBreathing ? `${breathTimer}s` : 'Press Start'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsBreathing(!isBreathing)}
              className={`px-8 py-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isBreathing
                  ? 'bg-gray-800 text-white hover:bg-gray-900'
                  : 'bg-[#e6007e] text-white hover:bg-[#c9006e] shadow-md'
              }`}
            >
              {isBreathing ? 'Pause Breathing Exercise' : 'Start 4-Minute Breathing Loop'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
