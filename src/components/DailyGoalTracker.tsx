import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Sparkles,
  Flame,
  RotateCcw,
  Trash2,
  Heart,
  Smile,
  Activity,
  Check,
  ChevronRight,
  Info,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface DailyGoal {
  id: string;
  title: string;
  category: 'mental' | 'physical' | 'selfcare';
  icon: string;
  tip: string;
  completed: boolean;
  isCustom?: boolean;
}

const DEFAULT_GOALS: DailyGoal[] = [
  {
    id: 'goal-water',
    title: 'Hydrate: Drink 2L of water',
    category: 'physical',
    icon: '💧',
    tip: 'Keep a water bottle on your desk or bedside; sip mindfully throughout the day.',
    completed: true,
  },
  {
    id: 'goal-breathing',
    title: '10-minute mindful breathing or pause',
    category: 'mental',
    icon: '🧘‍♀️',
    tip: 'Practice box breathing: inhale for 4s, hold for 4s, exhale for 4s, rest for 4s.',
    completed: true,
  },
  {
    id: 'goal-movement',
    title: '20 minutes of joyful movement or walk',
    category: 'physical',
    icon: '🚶‍♀️',
    tip: 'A brisk outdoor walk, dance in your room, or gentle yoga stretches.',
    completed: false,
  },
  {
    id: 'goal-affirmation',
    title: 'Affirm your worth: 3 positive statements',
    category: 'mental',
    icon: '💖',
    tip: 'Look into the mirror: "I am capable, I am deserving, and I belong in every room."',
    completed: true,
  },
  {
    id: 'goal-digital-detox',
    title: '30-minute screen-free wind down',
    category: 'mental',
    icon: '📵',
    tip: 'Put your phone away 30 mins before sleeping to protect your melatonin and serenity.',
    completed: false,
  },
  {
    id: 'goal-nutrition',
    title: 'Nourish with colorful fruits or greens',
    category: 'physical',
    icon: '🥗',
    tip: 'Add vibrant colors to your plate for essential micronutrients and gut harmony.',
    completed: false,
  }
];

const QUICK_PRESETS = [
  { title: '💧 8 Glasses of Pure Water', category: 'physical' as const, icon: '💧', tip: 'Hydration supports mental clarity and radiant skin.' },
  { title: '🧘 5-Minute Box Breathing', category: 'mental' as const, icon: '🧘', tip: 'Slow deep breaths immediately lower cortisol.' },
  { title: '📖 Read 1 Educational Article', category: 'mental' as const, icon: '📖', tip: 'Continuous small learnings compound into greatness.' },
  { title: '☀️ 15-Minute Sunlight & Fresh Air', category: 'physical' as const, icon: '☀️', tip: 'Natural daylight synchronizes your circadian rhythm.' },
  { title: '🌿 Gentle Evening Stretch', category: 'physical' as const, icon: '🌿', tip: 'Release shoulder and neck tension from desk work.' },
  { title: '🙏 Write 3 Heartfelt Gratitudes', category: 'selfcare' as const, icon: '🙏', tip: 'Gratitude rewires the brain to notice everyday abundance.' }
];

const STORAGE_KEY = 'heraura_daily_wellness_goals_v2';
const STREAK_KEY = 'heraura_wellness_streak_v2';

export const DailyGoalTracker: React.FC = () => {
  const [goals, setGoals] = useState<DailyGoal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_GOALS;
  });

  const [streak, setStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STREAK_KEY);
      return saved ? parseInt(saved, 10) : 4;
    } catch {
      return 4;
    }
  });

  const [filter, setFilter] = useState<'all' | 'mental' | 'physical' | 'selfcare'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'mental' | 'physical' | 'selfcare'>('mental');
  const [newIcon, setNewIcon] = useState('✨');
  const [newTip, setNewTip] = useState('');
  const [celebrationToast, setCelebrationToast] = useState(false);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch {
      // ignore
    }
  }, [goals]);

  useEffect(() => {
    try {
      localStorage.setItem(STREAK_KEY, streak.toString());
    } catch {
      // ignore
    }
  }, [streak]);

  // Toggle goal completed
  const toggleGoal = (id: string) => {
    setGoals((prev) => {
      const updated = prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g));
      const allDone = updated.length > 0 && updated.every((g) => g.completed);
      if (allDone) {
        setCelebrationToast(true);
        setStreak((s) => s + 1);
        setTimeout(() => setCelebrationToast(false), 4500);
      }
      return updated;
    });
  };

  // Add custom goal
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newGoal: DailyGoal = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      icon: newIcon || '✨',
      tip: newTip.trim() || 'A nourishing step towards your well-being.',
      completed: false,
      isCustom: true
    };

    setGoals((prev) => [newGoal, ...prev]);
    setNewTitle('');
    setNewTip('');
    setIsAddModalOpen(false);
  };

  // Add preset goal
  const handleAddPreset = (preset: typeof QUICK_PRESETS[0]) => {
    const newGoal: DailyGoal = {
      id: `preset-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: preset.title,
      category: preset.category,
      icon: preset.icon,
      tip: preset.tip,
      completed: false,
      isCustom: true
    };
    setGoals((prev) => [newGoal, ...prev]);
    setIsAddModalOpen(false);
  };

  // Delete goal
  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Reset all for today
  const handleReset = () => {
    setGoals((prev) => prev.map((g) => ({ ...g, completed: false })));
  };

  const completedCount = goals.filter((g) => g.completed).length;
  const totalCount = goals.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredGoals = goals.filter((g) => {
    if (filter === 'all') return true;
    return g.category === filter;
  });

  return (
    <div
      id="daily-goal-tracker-section"
      className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-6 shadow-xs border border-pink-100 dark:border-gray-800 space-y-5"
    >
      {/* Header & Streak Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Daily Wellness & Vitality Habits
            </h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Small, intentional daily practices for mental resilience and physical vitality
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Streak indicator */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800 text-xs font-bold text-amber-700 dark:text-amber-300"
            title="Your continuous daily wellness habit streak"
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />
            <span>{streak}-Day Streak</span>
          </div>

          {/* Add Goal Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Set Goal</span>
          </button>
        </div>
      </div>

      {/* Progress Bar & Motivation */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50/70 via-rose-50/40 to-pink-50/30 dark:from-gray-800/80 dark:to-pink-950/20 border border-pink-100 dark:border-gray-800 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800 dark:text-gray-200">
              Today's Progress:
            </span>
            <span className="text-pink-600 dark:text-pink-400 font-extrabold">
              {completedCount} of {totalCount} habits done
            </span>
          </div>
          <span className="font-black text-pink-600 dark:text-pink-400 text-sm">
            {progressPercent}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden p-0.5">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
          <span>
            {progressPercent === 100
              ? '🎉 Outstanding! You have nurtured your body and soul today!'
              : progressPercent >= 50
              ? '🌸 Beautiful rhythm, sister! Keep listening to your body.'
              : progressPercent > 0
              ? '✨ Wonderful start! One small mindful action at a time.'
              : '🌱 Take a deep breath. Pick one small gentle habit to start today.'}
          </span>
          <button
            onClick={handleReset}
            className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 flex items-center gap-1 cursor-pointer"
            title="Reset checkboxes for a fresh session"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Celebration Toast upon 100% completion */}
      <AnimatePresence>
        {celebrationToast && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">👑</span>
              <div>
                <p className="text-xs font-bold">100% Daily Habits Mastered!</p>
                <p className="text-[11px] text-pink-100">
                  You poured love and health into yourself today. Your sisterhood is proud of you!
                </p>
              </div>
            </div>
            <button
              onClick={() => setCelebrationToast(false)}
              className="p-1 rounded-full text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        {(['all', 'mental', 'physical', 'selfcare'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer capitalize ${
              filter === cat
                ? 'bg-pink-600 text-white shadow-2xs'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-pink-50 dark:hover:bg-pink-950/40'
            }`}
          >
            {cat === 'all' ? 'All Habits' : cat === 'selfcare' ? 'Self-Care' : `${cat} Health`}
          </button>
        ))}
      </div>

      {/* Habits List */}
      <div className="space-y-2.5">
        {filteredGoals.length > 0 ? (
          filteredGoals.map((goal) => {
            const isMental = goal.category === 'mental';
            const isPhysical = goal.category === 'physical';

            return (
              <div
                key={goal.id}
                id={`goal-item-${goal.id}`}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  goal.completed
                    ? 'bg-pink-50/40 dark:bg-pink-950/20 border-pink-200 dark:border-pink-900/40 opacity-90'
                    : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-pink-200 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Toggle Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    className="mt-0.5 cursor-pointer text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-transform active:scale-90"
                    title={goal.completed ? 'Mark incomplete' : 'Mark completed'}
                  >
                    {goal.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-pink-600 dark:text-pink-400 fill-pink-100 dark:fill-pink-950" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  {/* Habit info */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{goal.icon}</span>
                      <h4
                        className={`text-xs sm:text-sm font-bold transition-all ${
                          goal.completed
                            ? 'line-through text-gray-400 dark:text-gray-500'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {goal.title}
                      </h4>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isMental
                            ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                            : isPhysical
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {goal.category}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed pl-6">
                      {goal.tip}
                    </p>
                  </div>
                </div>

                {/* Optional delete button for custom/preset goals */}
                {goal.isCustom && (
                  <button
                    type="button"
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-gray-300 hover:text-rose-500 p-1 rounded-full cursor-pointer transition-colors"
                    title="Remove habit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center text-gray-400 text-xs bg-gray-50 dark:bg-gray-800 rounded-2xl">
            No habits in this category. Click &quot;Set Goal&quot; to add one!
          </div>
        )}
      </div>

      {/* Set Goal / Add Habit Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-pink-100 dark:border-gray-800"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      Set a New Daily Well-Being Habit
                    </h3>
                    <p className="text-[11px] text-gray-500">Choose a quick preset or write your own</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
                {/* 1. Quick Presets */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                    Recommended Habits for Young Women
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {QUICK_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAddPreset(preset)}
                        className="text-left p-2.5 rounded-xl border border-pink-100 dark:border-gray-800 hover:border-pink-300 dark:hover:border-pink-700 bg-pink-50/40 dark:bg-gray-800/60 hover:bg-pink-50 text-xs transition-colors flex items-start gap-2 cursor-pointer group"
                      >
                        <span className="text-base group-hover:scale-110 transition-transform">
                          {preset.icon}
                        </span>
                        <div>
                          <p className="font-bold text-gray-800 dark:text-gray-200 leading-snug">
                            {preset.title}
                          </p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">
                            {preset.tip}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Custom Habit Form */}
                <form onSubmit={handleAddGoal} className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Or Create a Custom Habit
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Habit Title *
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g., Read 1 chapter of inspiring book"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Category
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-400 focus:outline-none"
                      >
                        <option value="mental">Mental Health</option>
                        <option value="physical">Physical Health</option>
                        <option value="selfcare">Self-Care & Spirit</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Emoji Icon
                      </label>
                      <div className="flex gap-1.5 items-center">
                        {['💧', '🧘‍♀️', '🚶‍♀️', '💖', '📖', '🥗', '🌿', '✨'].map((emoji) => (
                          <button
                            type="button"
                            key={emoji}
                            onClick={() => setNewIcon(emoji)}
                            className={`p-1.5 rounded-lg text-sm transition-all ${
                              newIcon === emoji ? 'bg-pink-100 ring-2 ring-pink-400 scale-110' : 'hover:bg-gray-100'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Actionable Micro-Tip (optional)
                    </label>
                    <input
                      type="text"
                      value={newTip}
                      onChange={(e) => setNewTip(e.target.value)}
                      placeholder="e.g., Leave the book on your pillow in the morning."
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-400 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newTitle.trim()}
                      className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Add Habit
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
