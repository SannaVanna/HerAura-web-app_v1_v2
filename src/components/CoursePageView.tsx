import React, { useState, useEffect } from 'react';
import { Course, CourseModule, UserBadge } from '../types';
import { triggerCourseCompletionConfetti } from './LearnSkills';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Play,
  PlayCircle,
  Award,
  BookOpen,
  Clock,
  Star,
  Share2,
  Sparkles,
  Users,
  Check,
  FileText,
  HelpCircle,
  MessageSquare,
  Trophy,
  Lock,
  Unlock,
  ChevronRight,
  ChevronLeft,
  Save,
  CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CoursePageViewProps {
  course: Course;
  onBack: () => void;
  onToggleModuleComplete: (courseId: string, moduleId: string) => void;
  onAwardBadge?: (badge: UserBadge) => void;
  onShareToCommunity?: (text: string) => void;
}

export const CoursePageView: React.FC<CoursePageViewProps> = ({
  course,
  onBack,
  onToggleModuleComplete,
  onAwardBadge,
  onShareToCommunity,
}) => {
  // Check if course has been started (persisted in localStorage or from module progress)
  const [hasStarted, setHasStarted] = useState<boolean>(() => {
    const stored = localStorage.getItem(`her_aura_course_started_${course.id}`);
    if (stored === 'true') return true;
    return course.modules.some((m) => m.completed);
  });

  // Current view mode: 'overview' (dedicated overview page) vs 'lesson' (dedicated lesson view)
  const [viewMode, setViewMode] = useState<'overview' | 'lesson'>('overview');
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);

  // Lesson tabs: theory & summary, notes, quiz
  const [lessonTab, setLessonTab] = useState<'content' | 'notes' | 'quiz'>('content');

  // Personal notes per course and module
  const [personalNotes, setPersonalNotes] = useState<string>('');
  const [notesSavedStatus, setNotesSavedStatus] = useState<string>('');

  // Lock notification tooltip / alert
  const [lockNotice, setLockNotice] = useState<string | null>(null);
  const [sharedToast, setSharedToast] = useState<boolean>(false);
  const [badgeAwarded, setBadgeAwarded] = useState<boolean>(false);

  // Quiz state
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Completed count and progress
  const completedCount = course.modules.filter((m) => m.completed).length;
  const progressPercent = Math.round((completedCount / course.modules.length) * 100);
  const isAllComplete = completedCount === course.modules.length && course.modules.length > 0;

  // Active module
  const activeModule: CourseModule = course.modules[activeModuleIndex] || course.modules[0];

  // Load private personal notes whenever active module changes
  useEffect(() => {
    if (activeModule) {
      const savedNotes = localStorage.getItem(`her_aura_notes_${course.id}_${activeModule.id}`) || '';
      setPersonalNotes(savedNotes);
      setNotesSavedStatus(savedNotes ? 'Loaded your saved notes' : '');
    }
  }, [course.id, activeModule?.id]);

  // Determine whether a module is unlocked:
  // Rule 1: Before course is started, ALL modules are locked.
  // Rule 2: When started, Module 1 is unlocked.
  // Rule 3: Subsequent modules unlocked ONLY if prior module is completed.
  const isModuleUnlocked = (index: number): boolean => {
    if (!hasStarted) return false;
    if (index === 0) return true;
    return Boolean(course.modules[index - 1]?.completed);
  };

  // Find next in-progress or first incomplete module
  const getNextRecommendedModuleIndex = (): number => {
    const firstIncompleteIdx = course.modules.findIndex((m) => !m.completed);
    return firstIncompleteIdx !== -1 ? firstIncompleteIdx : 0;
  };

  // Handle Start Course
  const handleStartCourse = () => {
    setHasStarted(true);
    localStorage.setItem(`her_aura_course_started_${course.id}`, 'true');
    const targetIdx = getNextRecommendedModuleIndex();
    setActiveModuleIndex(targetIdx);
    setViewMode('lesson');
  };

  // Handle clicking a module in the syllabus
  const handleSelectModule = (index: number) => {
    if (!hasStarted) {
      setLockNotice('Please click "Start Course" above to unlock Module 1 and begin learning.');
      setTimeout(() => setLockNotice(null), 4000);
      return;
    }

    if (!isModuleUnlocked(index)) {
      setLockNotice(`Module ${index + 1} is locked. Please complete Module ${index} first.`);
      setTimeout(() => setLockNotice(null), 4000);
      return;
    }

    setActiveModuleIndex(index);
    setViewMode('lesson');
  };

  // Handle saving notes
  const handleSaveNotes = (text: string) => {
    setPersonalNotes(text);
    if (activeModule) {
      localStorage.setItem(`her_aura_notes_${course.id}_${activeModule.id}`, text);
      setNotesSavedStatus('Saved privately to your device');
    }
  };

  // Handle Mark Module Complete and Continue
  const handleCompleteAndContinue = () => {
    const currentMod = course.modules[activeModuleIndex];
    if (!currentMod) return;

    const isCurrentCompleted = currentMod.completed;
    const willCompleteFinal = !isCurrentCompleted && completedCount + 1 === course.modules.length;

    // Toggle module complete
    if (!isCurrentCompleted) {
      onToggleModuleComplete(course.id, currentMod.id);
    }

    if (willCompleteFinal) {
      // Final module celebration!
      triggerCourseCompletionConfetti();
      if (!badgeAwarded && onAwardBadge) {
        setBadgeAwarded(true);
        onAwardBadge({
          id: `badge-${course.id}`,
          name: `${course.title} Scholar`,
          description: `Successfully completed all modules of ${course.title}!`,
          icon: '🎓',
          dateEarned: 'Just now',
        });
      }
    } else if (activeModuleIndex + 1 < course.modules.length) {
      // Advance to next module
      setActiveModuleIndex(activeModuleIndex + 1);
      setLessonTab('content');
      setQuizSelectedOption(null);
      setQuizSubmitted(false);
    }
  };

  const handleShareToCommunity = () => {
    if (onShareToCommunity) {
      onShareToCommunity(
        `🎓 Celebrating my learning journey! I am actively studying "${course.title}" on HerAura. Progress: ${progressPercent}%. Empowering my mind and building sisterhood! 🌸`
      );
    }
    setSharedToast(true);
    setTimeout(() => setSharedToast(false), 3000);
  };

  return (
    <div id="course-page-view-root" className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* Toast notifications */}
      {lockNotice && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2.5 animate-fadeIn shadow-sm">
          <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>{lockNotice}</span>
        </div>
      )}

      {sharedToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2.5 animate-fadeIn shadow-sm">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Course milestone shared with your sisters in the Community Feed! 🎉</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. DEDICATED COURSE OVERVIEW VIEW (Requirement 8)                         */}
      {/* ========================================================================= */}
      {viewMode === 'overview' ? (
        <div className="space-y-6">
          {/* Top navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to All Courses</span>
            </button>

            <button
              onClick={handleShareToCommunity}
              className="px-3.5 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/40 dark:hover:bg-pink-950/70 text-pink-700 dark:text-pink-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Share progress to community"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share Course</span>
            </button>
          </div>

          {/* Hero Banner Card */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xs border border-pink-100 dark:border-gray-800">
            <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={course.coverImage}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-pink-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-xs">
                    {course.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-xs text-white text-[11px] font-semibold border border-white/20">
                    {course.difficulty || 'Beginner Friendly'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-xs text-white text-[11px] font-semibold border border-white/20">
                    {course.duration}
                  </span>
                </div>
                <h1 className="text-xl sm:text-3xl font-extrabold text-white leading-tight">
                  {course.title}
                </h1>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Stats & Instructor Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <img
                    src={course.instructorAvatar}
                    alt={course.instructor}
                    className="w-12 h-12 rounded-full object-cover border-2 border-pink-200 dark:border-gray-700"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{course.instructor}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{course.instructorTitle}</p>
                    <p className="text-[11px] text-pink-600 dark:text-pink-400 font-semibold mt-0.5">
                      Source: {course.sourceProvider || 'HerAura Learning'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1.5 font-bold text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="text-sm">{course.rating}</span>
                  </div>
                  <span className="text-gray-300 dark:text-gray-700">•</span>
                  <span>{course.enrolledCount} sisters enrolled</span>
                </div>
              </div>

              {/* Course Description */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  About This Course
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* What You Will Learn & Benefits (Requirement 8) */}
              <div className="p-5 rounded-2xl bg-pink-50/50 dark:bg-gray-800/60 border border-pink-100 dark:border-gray-700 space-y-3">
                <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>What You Will Learn & Skills Gained</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(course.learningObjectives || [
                    'Overcome imposter syndrome and cultivate authentic confidence',
                    'Master actionable frameworks you can implement today',
                    'Connect theoretical understanding with real sisterhood discussions',
                    'Earn an accredited completion achievement upon finishing'
                  ]).map((obj, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Progress & Prominent Start/Continue Button (Requirements 8 & 9) */}
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border-2 border-pink-200 dark:border-pink-900/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">Course Status:</span>
                    <span className={`text-xs font-extrabold ${
                      isAllComplete
                        ? 'text-purple-600 dark:text-purple-400'
                        : hasStarted
                        ? 'text-pink-600 dark:text-pink-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {isAllComplete ? 'Mastered (100%)' : hasStarted ? `In Progress (${completedCount}/${course.modules.length} lessons)` : 'Not Started'}
                    </span>
                  </div>
                  <div className="w-full sm:w-60 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <button
                  id="start-course-prominent-btn"
                  onClick={handleStartCourse}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  {isAllComplete ? (
                    <>
                      <Trophy className="w-4 h-4" />
                      <span>Review Course Material</span>
                    </>
                  ) : hasStarted ? (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Continue Course • Lesson {getNextRecommendedModuleIndex() + 1}</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4" />
                      <span>Start Course — Unlock Module 1</span>
                    </>
                  )}
                </button>
              </div>

              {/* Course Syllabus / Modules Section (Horizontal/Card Layout) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-pink-600" />
                      <span>Course Syllabus & Modules ({course.modules.length})</span>
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {!hasStarted
                        ? 'All modules are currently locked. Click "Start Course" above to unlock Module 1.'
                        : 'Step through each module sequentially. Complete each lesson to unlock the next.'}
                    </p>
                  </div>
                </div>

                {/* Horizontal Module Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 pt-2">
                  {course.modules.map((mod, idx) => {
                    const unlocked = isModuleUnlocked(idx);
                    const isCompleted = mod.completed;
                    const isNextToPlay = hasStarted && !isCompleted && (idx === 0 || course.modules[idx - 1]?.completed);

                    return (
                      <div
                        key={mod.id}
                        onClick={() => handleSelectModule(idx)}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 hover:border-emerald-300'
                            : isNextToPlay
                            ? 'bg-pink-50/80 dark:bg-pink-950/40 border-pink-300 dark:border-pink-700 shadow-sm ring-2 ring-pink-400/30'
                            : unlocked
                            ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-pink-300'
                            : 'bg-gray-50/80 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 opacity-75 hover:opacity-90'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-600 dark:text-pink-400">
                              Module {idx + 1}
                            </span>
                            {isCompleted ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Done</span>
                              </span>
                            ) : unlocked ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-pink-600 dark:text-pink-400">
                                <Unlock className="w-3.5 h-3.5" />
                                <span>Unlocked</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 dark:text-gray-500">
                                <Lock className="w-3.5 h-3.5" />
                                <span>Locked</span>
                              </span>
                            )}
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">
                            {mod.title}
                          </h4>

                          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2">
                            {mod.summary}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-[11px]">
                          <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{mod.duration}</span>
                          </span>

                          <span className={`font-bold flex items-center gap-1 ${
                            unlocked ? 'text-pink-600 dark:text-pink-400' : 'text-gray-400'
                          }`}>
                            <span>{isCompleted ? 'Review' : unlocked ? 'Start' : 'Locked'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. DEDICATED LESSON VIEW (Requirement 10)                                 */
        /* ========================================================================= */
        <div className="space-y-5">
          {/* Lesson View Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setViewMode('overview')}
              className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Course Overview</span>
            </button>

            {/* Breadcrumb / Course context */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 dark:text-gray-400 hidden sm:inline">{course.title}</span>
              <span className="text-gray-400 hidden sm:inline">/</span>
              <span className="font-bold text-pink-600 dark:text-pink-400">
                Lesson {activeModuleIndex + 1} of {course.modules.length}
              </span>
            </div>
          </div>

          {/* Video Player Card */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xs border border-pink-100 dark:border-gray-800">
            <div className="relative aspect-video w-full bg-black">
              {activeModule.videoUrl || activeModule.videoEmbedId ? (
                <iframe
                  src={
                    activeModule.videoUrl?.includes('embed')
                      ? activeModule.videoUrl
                      : `https://www.youtube.com/embed/${activeModule.videoEmbedId || ''}`
                  }
                  title={activeModule.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pink-900 via-gray-900 to-rose-950 text-white text-center">
                  <Play className="w-12 h-12 fill-white text-white mb-2" />
                  <h3 className="text-base font-bold">{activeModule.title}</h3>
                  <p className="text-xs text-pink-200 mt-1">Duration: {activeModule.duration}</p>
                </div>
              )}
            </div>

            {/* Lesson Title & Completion Status Header */}
            <div className="p-5 sm:p-6 pb-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-pink-600 dark:text-pink-400 font-bold mb-1">
                  <span>MODULE {activeModuleIndex + 1}</span>
                  <span>•</span>
                  <span>{activeModule.duration}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-snug">
                  {activeModule.title}
                </h2>
              </div>

              {/* Quick toggle check */}
              <button
                onClick={() => onToggleModuleComplete(course.id, activeModule.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  activeModule.completed
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 hover:bg-pink-100'
                }`}
              >
                {activeModule.completed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    <span>Mark as Complete</span>
                  </>
                )}
              </button>
            </div>

            {/* Lesson Content Tabs: Lesson Guide vs My Notes vs Reflection */}
            <div className="flex border-b border-gray-100 dark:border-gray-800 px-6 text-xs sm:text-sm font-semibold">
              <button
                onClick={() => setLessonTab('content')}
                className={`py-3 px-4 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                  lessonTab === 'content'
                    ? 'border-pink-600 text-pink-600 dark:text-pink-400 font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Lesson Guide & Takeaways</span>
              </button>

              <button
                onClick={() => setLessonTab('notes')}
                className={`py-3 px-4 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                  lessonTab === 'notes'
                    ? 'border-pink-600 text-pink-600 dark:text-pink-400 font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>My Notes</span>
              </button>

              <button
                onClick={() => setLessonTab('quiz')}
                className={`py-3 px-4 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                  lessonTab === 'quiz'
                    ? 'border-pink-600 text-pink-600 dark:text-pink-400 font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Comprehension Check</span>
              </button>
            </div>

            {/* Tab 1: Lesson Guide & Key Takeaways */}
            {lessonTab === 'content' && (
              <div className="p-6 space-y-5">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Lesson Summary
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    {activeModule.summary}
                  </p>
                </div>

                {activeModule.keyTakeaways && activeModule.keyTakeaways.length > 0 && (
                  <div className="p-4 rounded-2xl bg-pink-50/50 dark:bg-gray-800/60 border border-pink-100 dark:border-gray-700 space-y-2.5">
                    <h4 className="text-xs font-bold text-pink-700 dark:text-pink-300 uppercase tracking-wider">
                      Key Takeaways
                    </h4>
                    <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-200">
                      {activeModule.keyTakeaways.map((takeaway, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-pink-500 font-bold">•</span>
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Theoretical Foundation
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {course.theoreticalOverview}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Private "My Notes" Section (Requirement 10) */}
            {lessonTab === 'notes' && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      Private Notes for Module {activeModuleIndex + 1}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Your notes are private to you, automatically saved, and retrievable whenever you return.
                    </p>
                  </div>
                  {notesSavedStatus && (
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>{notesSavedStatus}</span>
                    </span>
                  )}
                </div>

                <textarea
                  value={personalNotes}
                  onChange={(e) => handleSaveNotes(e.target.value)}
                  placeholder="Take private notes on this module... Key learnings, questions for your mentor, or personal reflections."
                  rows={6}
                  className="w-full p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-inner"
                />

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{personalNotes.length} characters</span>
                  <button
                    onClick={() => handleSaveNotes(personalNotes)}
                    className="px-4 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Notes</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: Reflection Quiz */}
            {lessonTab === 'quiz' && (
              <div className="p-6 space-y-4">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Comprehension Check: {activeModule.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Reflect on what was presented in this lesson:
                </p>

                <div className="p-4 rounded-2xl bg-pink-50/40 dark:bg-gray-800/60 border border-pink-100 dark:border-gray-700 space-y-3">
                  <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">
                    What is the most constructive action to take when facing uncertainty in your learning journey?
                  </p>

                  <div className="space-y-2 text-xs">
                    {[
                      'Give up immediately and assume you lack the necessary talent.',
                      'Acknowledge the challenge as evidence of learning, ask questions, and lean on your sisterhood community.',
                      'Keep quiet and avoid asking mentors for clarification.',
                      'Pretend you understand everything without practicing.'
                    ].map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setQuizSelectedOption(i)}
                        className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                          quizSelectedOption === i
                            ? 'bg-pink-100 dark:bg-pink-900/60 border-pink-500 text-pink-900 dark:text-pink-100 font-bold'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-pink-50/50'
                        }`}
                      >
                        <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={quizSelectedOption === null}
                    className="px-4 py-2 rounded-xl bg-pink-600 disabled:opacity-50 text-white text-xs font-bold cursor-pointer"
                  >
                    Check Answer
                  </button>

                  {quizSubmitted && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200">
                      {quizSelectedOption === 1 ? (
                        <p className="font-bold">✨ Excellent! Option B is right on the mark. Embrace growth and community support!</p>
                      ) : (
                        <p className="font-semibold">Option B is the most empowering approach. You belong here and can always ask for guidance!</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Navigation Toolbar (Requirements 10 & 11) */}
            <div className="p-4 sm:p-6 bg-gray-50/70 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  if (activeModuleIndex > 0) {
                    setActiveModuleIndex(activeModuleIndex - 1);
                    setLessonTab('content');
                  }
                }}
                disabled={activeModuleIndex === 0}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Lesson</span>
              </button>

              <button
                onClick={handleCompleteAndContinue}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                {activeModuleIndex + 1 === course.modules.length ? (
                  <>
                    <Trophy className="w-4 h-4 text-amber-200" />
                    <span>Complete Final Module & Celebrate 🎉</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark as Completed & Continue</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Celebratory Completion Banner if 100% complete */}
          {isAllComplete && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shrink-0">
                  🎓
                </div>
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 font-bold text-xs text-pink-200">
                    <Trophy className="w-4 h-4 text-amber-300" />
                    <span>COURSE MASTERED</span>
                  </div>
                  <h3 className="text-lg font-black mt-0.5">
                    Congratulations, Scholar!
                  </h3>
                  <p className="text-xs text-pink-100 mt-1 max-w-md">
                    You have finished every module in &ldquo;{course.title}&rdquo;. Your achievement badge has been unlocked!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => triggerCourseCompletionConfetti()}
                  className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Confetti 🎊</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareToCommunity}
                  className="px-4 py-2.5 rounded-xl bg-white text-pink-700 hover:bg-pink-50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Story</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
