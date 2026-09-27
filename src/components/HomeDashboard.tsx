import React, { useState, useEffect } from 'react';
import { UserProfile, Course, Mentor } from '../types';
import { ROTATING_WELLBEING_TIPS } from '../data/initialData';
import { DailyGoalTracker } from './DailyGoalTracker';
import {
  Users,
  BookOpen,
  Sparkles,
  Heart,
  Bell,
  Calendar,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Award,
  Smile,
  Compass
} from 'lucide-react';

interface HomeDashboardProps {
  user: UserProfile;
  courses: Course[];
  mentors: Mentor[];
  onNavigateTab: (tab: 'home' | 'community' | 'learn' | 'mentors' | 'wellness' | 'profile' | 'ai') => void;
  onSelectCourse: (course: Course) => void;
  onSelectMentor: (mentor: Mentor) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  user,
  courses,
  mentors,
  onNavigateTab,
  onSelectCourse,
  onSelectMentor,
}) => {
  const [currentMood, setCurrentMood] = useState<'happy' | 'good' | 'neutral' | 'sad' | 'down' | null>(null);
  const [tipIndex, setTipIndex] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Rotating tips every 5 minutes (300,000ms) as specified in prompt
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % ROTATING_WELLBEING_TIPS.length);
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const moodResponses = {
    happy: "Radiate that joy! Keep shining your vibrant aura and sharing smiles with your sisters.",
    good: "Wonderful! You're in a centered, positive space today. Keep building your momentum.",
    neutral: "A calm, steady space is a great foundation. Take moments today to breathe deeply and be present.",
    sad: "Sending you a warm sisterly embrace. You are safe here, and your feelings are completely valid.",
    down: "Take gentle care of yourself today. Remember that rest is healing, and you never have to carry things alone."
  };

  const connectedMentors = mentors.filter((m) => m.connected);

  return (
    <div id="home-dashboard-screen" className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* 1. Header: Greeting & Profile */}
      <div className="flex items-center justify-between pb-2 border-b border-pink-50 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div
            onClick={() => onNavigateTab('profile')}
            className="cursor-pointer relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 to-rose-300 shadow-xs hover:ring-2 hover:ring-pink-300 transition-all"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover rounded-full"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-1.5 transition-colors">
              <span>{getGreeting()}, {user.name.split(' ')[0]}</span>
              <span className="text-pink-500">🌸</span>
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-300 font-medium mt-0.5">Welcome to your daily safe space</p>
          </div>
        </div>

        {/* Notifications & AI Button */}
        <div className="flex items-center space-x-2">
          <button
            id="open-ai-chat-btn"
            onClick={() => onNavigateTab('ai')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-100 hover:bg-pink-200 dark:bg-pink-950/60 dark:hover:bg-pink-900/70 text-pink-700 dark:text-pink-300 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-600 dark:text-pink-300" />
            <span className="hidden sm:inline">Ask Aura AI</span>
          </button>

          <div className="relative">
            <button
              id="notifications-btn"
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-gray-800 hover:text-pink-600 transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500" />
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-pink-100 dark:border-gray-700 p-4 z-30 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700 mb-2">
                  <span className="font-bold text-gray-900 dark:text-white">Notifications</span>
                  <span className="text-[10px] text-pink-600 dark:text-pink-400 font-semibold">2 New</span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-2 rounded-lg bg-pink-50/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200">
                    <p className="font-semibold text-gray-900 dark:text-white">Mentor Connection Confirmed</p>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5">
                      Chidinma Okafor accepted your feminine wellness chat request.
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-pink-50/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200">
                    <p className="font-semibold text-gray-900 dark:text-white">New Module Available</p>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5">
                      Check out Module 2 in Building Self-Confidence!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Quick Actions Grid (Matching reference 4 items) */}
      <div>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          <button
            id="qa-community"
            onClick={() => onNavigateTab('community')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white dark:bg-gray-800 hover:bg-pink-50/60 dark:hover:bg-gray-700 border border-pink-100/80 dark:border-gray-700 shadow-xs hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-pink-100/80 dark:bg-pink-950/60 group-hover:bg-pink-200 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-2 transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Community</span>
            <span className="text-[10px] text-gray-400 hidden sm:inline mt-0.5">Sisterhood</span>
          </button>

          <button
            id="qa-learn"
            onClick={() => onNavigateTab('learn')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white dark:bg-gray-800 hover:bg-pink-50/60 dark:hover:bg-gray-700 border border-pink-100/80 dark:border-gray-700 shadow-xs hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-pink-100/80 dark:bg-pink-950/60 group-hover:bg-pink-200 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-2 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Learn</span>
            <span className="text-[10px] text-gray-400 hidden sm:inline mt-0.5">and Skill</span>
          </button>

          <button
            id="qa-mentors"
            onClick={() => onNavigateTab('mentors')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white hover:bg-pink-50/60 border border-pink-100/80 shadow-xs hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-pink-100/80 group-hover:bg-pink-200 text-pink-600 flex items-center justify-center mb-2 transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-800">Mentors</span>
            <span className="text-[10px] text-gray-400 hidden sm:inline mt-0.5">1-on-1 Guidance</span>
          </button>

          <button
            id="qa-wellness"
            onClick={() => onNavigateTab('wellness')}
            className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white hover:bg-pink-50/60 border border-pink-100/80 shadow-xs hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-pink-100/80 group-hover:bg-pink-200 text-pink-600 flex items-center justify-center mb-2 transition-colors">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-800">Wellness</span>
            <span className="text-[10px] text-gray-400 hidden sm:inline mt-0.5">Cycle & Care</span>
          </button>
        </div>
      </div>

      {/* 3. Mood Check-in: "How are you feeling today?" (Matching reference) */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-pink-100">
        <h3 className="text-sm font-bold text-gray-900 mb-3">How are you feeling today?</h3>
        <div className="flex items-center justify-between max-w-sm mx-auto py-1">
          <button
            onClick={() => setCurrentMood('happy')}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${
              currentMood === 'happy' ? 'scale-115 bg-amber-50 ring-2 ring-amber-300' : 'hover:scale-110'
            }`}
          >
            <span className="text-3xl sm:text-4xl">😃</span>
            <span className="text-[10px] font-semibold text-gray-600 mt-1">Happy</span>
          </button>

          <button
            onClick={() => setCurrentMood('good')}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${
              currentMood === 'good' ? 'scale-115 bg-green-50 ring-2 ring-green-300' : 'hover:scale-110'
            }`}
          >
            <span className="text-3xl sm:text-4xl">😊</span>
            <span className="text-[10px] font-semibold text-gray-600 mt-1">Good</span>
          </button>

          <button
            onClick={() => setCurrentMood('neutral')}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${
              currentMood === 'neutral' ? 'scale-115 bg-gray-50 ring-2 ring-gray-300' : 'hover:scale-110'
            }`}
          >
            <span className="text-3xl sm:text-4xl">😐</span>
            <span className="text-[10px] font-semibold text-gray-600 mt-1">Okay</span>
          </button>

          <button
            onClick={() => setCurrentMood('sad')}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${
              currentMood === 'sad' ? 'scale-115 bg-blue-50 ring-2 ring-blue-300' : 'hover:scale-110'
            }`}
          >
            <span className="text-3xl sm:text-4xl">😕</span>
            <span className="text-[10px] font-semibold text-gray-600 mt-1">Low</span>
          </button>

          <button
            onClick={() => setCurrentMood('down')}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${
              currentMood === 'down' ? 'scale-115 bg-rose-50 ring-2 ring-rose-300' : 'hover:scale-110'
            }`}
          >
            <span className="text-3xl sm:text-4xl">😞</span>
            <span className="text-[10px] font-semibold text-gray-600 mt-1">Struggling</span>
          </button>
        </div>

        {currentMood && (
          <div className="mt-3.5 p-3 rounded-xl bg-pink-50/70 border border-pink-100 text-xs text-gray-700 flex items-start gap-2.5 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-pink-800">Made for your mood: </span>
              <span>{moodResponses[currentMood]}</span>
            </div>
          </div>
        )}
      </div>

      {/* 3.5. Daily Wellness Habits & Goal Tracking Section */}
      <DailyGoalTracker />

      {/* 4. Upcoming Event & Daily Encouragement Quote */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upcoming Event card */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-pink-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Upcoming Event
            </span>
            <Calendar className="w-4 h-4 text-pink-500" />
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-700 flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold">AUG</span>
              <span className="text-base font-black">14</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 leading-snug">
                Girls in STEM & Tech Mentorship Circle
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Live interactive Q&A with Co-Founders Nora Godwin & Rita Okam
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Free Community RSVP</span>
            </span>
            <button
              onClick={() => onNavigateTab('community')}
              className="text-pink-600 font-bold hover:underline"
            >
              View Details
            </button>
          </div>
        </div>

        {/* Daily Wellbeing Tip (Rotates every 5 min or manually) */}
        <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white p-5 rounded-2xl shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-pink-100">
              <Sparkles className="w-4 h-4 text-pink-200" />
              <span>Daily Wellbeing Tip</span>
            </div>
            <button
              onClick={() => setTipIndex((prev) => (prev + 1) % ROTATING_WELLBEING_TIPS.length)}
              className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              title="Next tip"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <blockquote className="text-sm sm:text-base font-serif italic leading-relaxed my-2 text-white/95">
            "{ROTATING_WELLBEING_TIPS[tipIndex]}"
          </blockquote>

          <div className="text-[10px] text-pink-200/90 flex items-center justify-between pt-2 border-t border-white/20">
            <span>HerAura Affirmation</span>
            <span>Refreshes regularly</span>
          </div>
        </div>
      </div>

      {/* 5. Learning Progress Section */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-pink-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Your Learning Journey</h3>
            <p className="text-xs text-gray-500">Skills to nurture your confidence & independence</p>
          </div>
          <button
            onClick={() => onNavigateTab('learn')}
            className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1"
          >
            <span>See All Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {courses.slice(0, 2).map((course) => {
            const completedModules = course.modules.filter((m) => m.completed).length;
            const progress = Math.round((completedModules / course.modules.length) * 100);

            return (
              <div
                key={course.id}
                onClick={() => {
                  onNavigateTab('learn');
                  onSelectCourse(course);
                }}
                className="p-3.5 rounded-xl border border-gray-100 hover:border-pink-200 dark:border-gray-700 dark:hover:border-pink-500 bg-gray-50/50 hover:bg-pink-50/20 dark:bg-gray-800/60 dark:hover:bg-gray-700/60 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={course.coverImage}
                    alt={course.title}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-pink-600 uppercase">
                      {course.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1">
                      {course.title}
                    </h4>
                    <p className="text-[11px] text-gray-500">{course.instructor}</p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-[11px] text-gray-600 mb-1">
                    <span>Progress</span>
                    <span className="font-bold text-pink-600">{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Active Mentor Connections Summary */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-pink-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-600" />
            <h3 className="text-sm font-bold text-gray-900">Mentor Connections</h3>
          </div>
          <button
            onClick={() => onNavigateTab('mentors')}
            className="text-xs font-bold text-pink-600 hover:underline"
          >
            Explore Mentors
          </button>
        </div>

        {connectedMentors.length > 0 ? (
          <div className="space-y-3">
            {connectedMentors.map((m) => (
              <div
                key={m.id}
                onClick={() => onSelectMentor(m)}
                className="flex items-center justify-between p-3 rounded-xl bg-pink-50/50 border border-pink-100 hover:bg-pink-100/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-11 h-11 rounded-full object-cover border border-pink-200"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900">{m.name}</h4>
                    <p className="text-[11px] text-gray-500">{m.title}</p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-pink-600 text-white rounded-full text-xs font-semibold hover:bg-pink-700">
                  Chat
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 px-2 text-xs text-gray-500 bg-gray-50 rounded-xl">
            <p>You have not connected with a mentor yet.</p>
            <button
              onClick={() => onNavigateTab('mentors')}
              className="mt-2 text-pink-600 font-bold hover:underline"
            >
              Browse our verified female mentors
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
