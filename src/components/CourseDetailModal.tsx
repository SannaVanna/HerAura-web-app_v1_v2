import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Course, CourseModule } from '../types';
import { triggerCourseCompletionConfetti } from './LearnSkills';
import {
  X,
  Play,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Share2,
  Copy,
  Check,
  MessageSquare,
  Trophy
} from 'lucide-react';

interface CourseDetailModalProps {
  course: Course;
  onClose: () => void;
  onToggleModuleComplete: (courseId: string, moduleId: string) => void;
  onShareToCommunity?: (shareText: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  onClose,
  onToggleModuleComplete,
  onShareToCommunity,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(
    course.modules[0]?.id || ''
  );
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sharedNotice, setSharedNotice] = useState(false);

  const selectedModule =
    course.modules.find((m) => m.id === selectedModuleId) || course.modules[0];

  const completedCount = course.modules.filter((m) => m.completed).length;
  const progressPercent = Math.round((completedCount / course.modules.length) * 100);
  const isAllComplete = progressPercent === 100;

  const summaryCardText = `🎉 Proud milestone! I just completed the course "${course.title}" on HerAura! 🌸✨\n\nI mastered all ${course.modules.length} lessons with ${course.instructor}. Excited to take these insights forward!\n\n#HerAuraSisterhood #LearningJourney #WomenWhoLead #EmpoweredGirls`;

  const handleCopyText = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(summaryCardText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = summaryCardText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleShareToFeed = () => {
    if (onShareToCommunity) {
      onShareToCommunity(summaryCardText);
      setSharedNotice(true);
      setTimeout(() => {
        setSharedNotice(false);
        onClose();
      }, 1200);
    }
  };

  const handleToggleModule = (moduleId: string) => {
    const target = course.modules.find((m) => m.id === moduleId);
    const isTargetDone = target ? target.completed : false;
    if (!isTargetDone && completedCount + 1 === course.modules.length) {
      triggerCourseCompletionConfetti();
    }
    onToggleModuleComplete(course.id, moduleId);
  };

  const handleNextModule = () => {
    const currentIndex = course.modules.findIndex((m) => m.id === selectedModuleId);
    if (currentIndex < course.modules.length - 1) {
      setSelectedModuleId(course.modules[currentIndex + 1].id);
      setIsPlayingVideo(false);
    }
  };

  return (
    <motion.div
      id="course-detail-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-100 flex flex-col max-h-[92vh]"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full uppercase">
              {course.category}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">{course.duration}</span>
            {isAllComplete && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                <span>Completed</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="course-header-share-btn"
              onClick={() => setShowShareCard(!showShareCard)}
              className="px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#e6007e] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Share course achievement"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-semibold transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Header & Course Title */}
          <div>
            <h2
              className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 leading-tight mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {course.title}
            </h2>

            <div className="flex items-center gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <span>★</span>
                <span>{course.rating}</span>
              </div>
              <span>•</span>
              <span>{course.enrolledCount} enrolled</span>
              <span>•</span>
              <div className="flex items-center gap-1 text-gray-700">
                <img
                  src={course.instructorAvatar}
                  alt={course.instructor}
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span className="font-semibold">{course.instructor}</span>
              </div>
            </div>
          </div>

          {/* Share Summary Card View (When opened or course completed) */}
          <AnimatePresence>
            {(showShareCard || isAllComplete) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="p-5 rounded-3xl bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-purple-500/10 border-2 border-pink-300 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-2xl bg-[#e6007e] text-white flex items-center justify-center shadow-xs">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">
                          {isAllComplete ? 'Course Completed! 🎉' : 'Course Achievement Summary'}
                        </h4>
                        <p className="text-xs text-gray-600">
                          Generate and copy your achievement card text to inspire your sisters in the community feed!
                        </p>
                      </div>
                    </div>
                    {!isAllComplete && (
                      <button
                        onClick={() => setShowShareCard(false)}
                        className="text-xs text-gray-400 hover:text-gray-600 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Summary Card Visual Preview */}
                  <div className="bg-white rounded-2xl p-4 border border-pink-200 shadow-xs relative">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#e6007e]" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#e6007e]">
                          HerAura Certificate of Completion
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {completedCount}/{course.modules.length} Lessons Mastered
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-serif font-bold text-gray-900 mb-1">
                      {course.title}
                    </p>
                    <p className="text-xs text-gray-600 mb-3">
                      Mentored by <span className="font-semibold text-gray-800">{course.instructor}</span> • {course.category} Academy
                    </p>

                    <div className="bg-pink-50/60 p-3 rounded-xl text-xs text-gray-700 font-mono select-all border border-pink-100">
                      {summaryCardText}
                    </div>
                  </div>

                  {/* Actions: Copy and Share to Community */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <button
                      id="copy-summary-text-btn"
                      onClick={handleCopyText}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        copied
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-2xs'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-gray-600" />
                          <span>Copy Summary Card Text</span>
                        </>
                      )}
                    </button>

                    {onShareToCommunity && (
                      <button
                        id="share-to-community-feed-btn"
                        onClick={handleShareToFeed}
                        disabled={sharedNotice}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-[#e6007e] hover:bg-[#c9006e] text-white flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                      >
                        {sharedNotice ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Shared to Community!</span>
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-4 h-4" />
                            <span>Post Directly to Community Feed</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Lesson / Interactive Player Area */}
          <div className="relative w-full rounded-2xl overflow-hidden bg-gray-950 aspect-video shadow-md flex items-center justify-center border border-gray-800">
            {isPlayingVideo ? (
              selectedModule?.videoEmbedId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${selectedModule.videoEmbedId}?autoplay=1`}
                  title={selectedModule.videoTitle || selectedModule.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="text-center p-6 text-white">
                  <div className="w-14 h-14 rounded-full bg-pink-600/80 flex items-center justify-center mx-auto mb-3 animate-pulse">
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </div>
                  <h4 className="font-bold text-base">{selectedModule?.videoTitle || selectedModule?.title}</h4>
                  <p className="text-xs text-pink-200 mt-1 max-w-sm mx-auto">
                    Interactive streaming lesson loaded in safe environment.
                  </p>
                </div>
              )
            ) : (
              <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlayingVideo(true)}>
                <img
                  src={course.coverImage}
                  alt={course.title}
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-85 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#e6007e] group-hover:scale-110 flex items-center justify-center shadow-lg transition-transform mb-2">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                  <span className="text-sm font-bold">{selectedModule?.videoTitle || 'Play Video Lesson'}</span>
                  <span className="text-[11px] text-pink-200 mt-0.5">{selectedModule?.duration}</span>
                </div>
              </div>
            )}
          </div>

          {/* Course Progress Bar */}
          <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-100">
            <div className="flex items-center justify-between text-xs font-bold text-gray-800 mb-2">
              <span>Your Course Completion</span>
              <span className="text-pink-600">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-pink-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Theoretical Explanation & Overview */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-pink-600" />
              <span>Theoretical Explanation & Core Principles</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
              {course.theoreticalOverview}
            </p>
          </div>

          {/* Active Module Details & Key Takeaways */}
          {selectedModule && (
            <div className="p-4 rounded-2xl bg-white border-2 border-pink-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-600">Active Lesson Details</span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedModule.duration}</span>
                </span>
              </div>

              <h4 className="text-base font-bold text-gray-900">{selectedModule.title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{selectedModule.summary}</p>

              {selectedModule.keyTakeaways && (
                <div className="pt-2">
                  <h5 className="text-xs font-bold text-gray-800 mb-1.5">Key Actionable Takeaways:</h5>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {selectedModule.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Module Action Buttons: Mark Complete & Next Module */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-pink-100">
                <button
                  id="mark-module-complete-btn"
                  onClick={() => handleToggleModule(selectedModule.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    selectedModule.completed
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-pink-600 hover:bg-pink-700 text-white shadow-xs'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{selectedModule.completed ? 'Completed' : 'Mark Complete'}</span>
                </button>

                <button
                  id="next-module-btn"
                  onClick={handleNextModule}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-1 transition-colors"
                >
                  <span>Next Lesson</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Modules List */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3">Course Curriculum ({course.modules.length} Lessons)</h3>
            <div className="space-y-2">
              {course.modules.map((mod, index) => {
                const isCurrent = mod.id === selectedModuleId;
                return (
                  <div
                    key={mod.id}
                    onClick={() => {
                      setSelectedModuleId(mod.id);
                      setIsPlayingVideo(false);
                    }}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isCurrent
                        ? 'border-pink-500 bg-pink-50/50 shadow-xs'
                        : 'border-gray-100 hover:border-pink-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          mod.completed
                            ? 'bg-emerald-500 text-white'
                            : isCurrent
                            ? 'bg-pink-600 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {mod.completed ? '✓' : index + 1}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900">{mod.title}</h4>
                        <span className="text-[11px] text-gray-500">{mod.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {mod.completed && (
                        <span className="text-[11px] font-semibold text-emerald-600 hidden sm:inline">
                          Complete
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
