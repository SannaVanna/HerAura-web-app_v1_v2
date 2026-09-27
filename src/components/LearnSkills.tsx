import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Course, UserBadge } from '../types';
import { CoursePageView } from './CoursePageView';
import { courseContentService, EducationalVideo, EducationalArticle } from '../services/courseContentService';
import {
  Search,
  BookOpen,
  Video,
  FileText,
  Star,
  Clock,
  PlayCircle,
  Award,
  Sparkles,
  X,
  ExternalLink,
  Share2,
  CheckCircle2,
  Play,
  Bookmark,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Triggers a multi-stage celebratory confetti animation when a user
 * completes their final course module.
 */
export const triggerCourseCompletionConfetti = () => {
  const colors = ['#ec4899', '#f43f5e', '#a855f7', '#38bdf8', '#fbbf24', '#f472b6', '#ffffff'];

  // Left burst
  confetti({
    particleCount: 80,
    angle: 60,
    spread: 70,
    origin: { x: 0.15, y: 0.7 },
    colors,
    zIndex: 99999,
  });

  // Right burst
  confetti({
    particleCount: 80,
    angle: 120,
    spread: 70,
    origin: { x: 0.85, y: 0.7 },
    colors,
    zIndex: 99999,
  });

  // Center celebratory shower after brief delay
  setTimeout(() => {
    confetti({
      particleCount: 110,
      spread: 100,
      origin: { x: 0.5, y: 0.55 },
      colors,
      scalar: 1.2,
      zIndex: 99999,
    });
  }, 200);

  // Soft sparkle drift
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 120,
      decay: 0.92,
      origin: { x: 0.5, y: 0.4 },
      colors,
      shapes: ['circle', 'square'],
      zIndex: 99999,
    });
  }, 400);
};

interface LearnSkillsProps {
  courses: Course[];
  selectedCourse?: Course | null;
  onSelectCourse: (course: Course | null) => void;
  onToggleModuleComplete?: (courseId: string, moduleId: string) => void;
  onAwardBadge?: (badge: UserBadge) => void;
  onShareToCommunity?: (text: string) => void;
}

export const LearnSkills: React.FC<LearnSkillsProps> = ({
  courses,
  selectedCourse,
  onSelectCourse,
  onToggleModuleComplete = () => {},
  onAwardBadge,
  onShareToCommunity,
}) => {
  const [activeTab, setActiveTab] = useState<'Courses' | 'Videos' | 'Articles'>('Courses');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Educational videos state
  const [videos, setVideos] = useState<EducationalVideo[]>([]);
  const [activeVideoModal, setActiveVideoModal] = useState<EducationalVideo | null>(null);

  // Educational articles state
  const [articles, setArticles] = useState<EducationalArticle[]>([]);
  const [activeArticleModal, setActiveArticleModal] = useState<EducationalArticle | null>(null);

  // Intercept module completion to trigger celebratory confetti on final module
  const handleToggleModuleWithConfetti = (courseId: string, moduleId: string) => {
    const course = (selectedCourse && selectedCourse.id === courseId)
      ? selectedCourse
      : courses.find((c) => c.id === courseId);

    if (course) {
      const targetModule = course.modules.find((m) => m.id === moduleId);
      const isTargetCompleted = targetModule ? targetModule.completed : false;
      const completedCount = course.modules.filter((m) => m.completed).length;

      // If marking an incomplete module that makes all modules in the course complete
      if (!isTargetCompleted && completedCount + 1 === course.modules.length) {
        triggerCourseCompletionConfetti();
      }
    }

    if (onToggleModuleComplete) {
      onToggleModuleComplete(courseId, moduleId);
    }
  };

  // Fetch videos and articles on mount and category change
  useEffect(() => {
    courseContentService.fetchEducationalVideos(selectedCategory, searchQuery).then((data: EducationalVideo[]) => {
      setVideos(data);
    });
    const loadedArticles = courseContentService.getEducationalArticles(selectedCategory);
    setArticles(loadedArticles);
  }, [selectedCategory, searchQuery]);

  // If a course is currently selected, display the dedicated Course Page View!
  if (selectedCourse) {
    return (
      <CoursePageView
        course={selectedCourse}
        onBack={() => onSelectCourse(null)}
        onToggleModuleComplete={handleToggleModuleWithConfetti}
        onAwardBadge={onAwardBadge}
        onShareToCommunity={onShareToCommunity}
      />
    );
  }

  const categories = ['All', 'Career', 'Tech', 'Finance', 'Wellness', 'Leadership'];

  const filteredCourses = courses.filter((course) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesCategory =
      selectedCategory === 'All' ? true : course.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !query
      ? true
      : course.title.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query) ||
        (course.tags && course.tags.some((t) => t.toLowerCase().includes(query))) ||
        course.description.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query) ||
        (course.theoreticalOverview && course.theoreticalOverview.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const filteredVideos = videos.filter((vid) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesCategory =
      selectedCategory === 'All' ? true : vid.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !query
      ? true
      : vid.title.toLowerCase().includes(query) ||
        vid.category.toLowerCase().includes(query) ||
        vid.description.toLowerCase().includes(query) ||
        vid.channelTitle.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const filteredArticles = articles.filter((art) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesCategory =
      selectedCategory === 'All' ? true : art.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !query
      ? true
      : art.title.toLowerCase().includes(query) ||
        art.category.toLowerCase().includes(query) ||
        art.summary.toLowerCase().includes(query) ||
        art.author.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const activeResultsCount =
    activeTab === 'Courses'
      ? filteredCourses.length
      : activeTab === 'Videos'
      ? filteredVideos.length
      : filteredArticles.length;

  return (
    <div id="learn-skills-screen" className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>Learn and Skill</span>
          <span className="text-pink-500">📚</span>
        </h1>
        <p className="text-xs text-gray-600 dark:text-gray-300">
          Curated education to empower your mind, career, finances, and feminine wellness
        </p>
      </div>

      {/* Search Bar with Real-time Filter & Clear */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search courses, titles, #tags, coding, wellness, career..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400 dark:placeholder-gray-500 shadow-xs transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer rounded-full"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Real-time Result Summary Strip */}
        {(searchQuery.trim() || selectedCategory !== 'All') && (
          <div className="flex items-center justify-between px-2 text-[11px] text-gray-500 dark:text-gray-400">
            <span>
              Found <strong className="text-pink-600 dark:text-pink-400">{activeResultsCount}</strong> {activeTab.toLowerCase()}
              {searchQuery && <> matching &ldquo;{searchQuery}&rdquo;</>}
              {selectedCategory !== 'All' && <> in <span className="font-semibold text-pink-600 dark:text-pink-400">{selectedCategory}</span></>}
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-pink-600 dark:text-pink-400 hover:underline font-semibold cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Category Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-pink-600 text-white shadow-xs'
                : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-pink-300 dark:hover:border-pink-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tabs: Courses, Videos, Articles */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        {(['Courses', 'Videos', 'Articles'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-center text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === tab
                ? 'border-pink-600 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {tab} (
            {tab === 'Courses'
              ? filteredCourses.length
              : tab === 'Videos'
              ? filteredVideos.length
              : filteredArticles.length}
            )
          </button>
        ))}
      </div>

      {/* Content depending on active tab */}
      {activeTab === 'Courses' ? (
        filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCourses.map((course) => {
              const completedCount = course.modules.filter((m) => m.completed).length;
              const progress = Math.round((completedCount / course.modules.length) * 100);

              return (
                <div
                  key={course.id}
                  id={`course-card-${course.id}`}
                  onClick={() => onSelectCourse(course)}
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow-xs border border-pink-100 dark:border-gray-800 hover:shadow-md hover:border-pink-200 dark:hover:border-pink-700 transition-all overflow-hidden flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    {/* Course Cover */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-pink-50 dark:bg-gray-800">
                      <img
                        src={course.coverImage}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xs text-[10px] font-bold text-pink-700 dark:text-pink-300 px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                        {course.category}
                      </span>
                      <span className="absolute bottom-3 right-3 bg-black/75 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration}</span>
                      </span>
                    </div>

                    {/* Course Meta */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-pink-100/70 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-[10px] font-bold">
                            {course.difficulty || 'Beginner Friendly'}
                          </span>
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">• {course.sourceProvider || 'HerAura'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{course.rating}</span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors leading-snug">
                        {course.title}
                      </h3>

                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>

                      {/* Course Tags */}
                      {course.tags && course.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {course.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-md bg-pink-50 dark:bg-pink-950/50 text-[10px] font-medium text-pink-700 dark:text-pink-300 border border-pink-100 dark:border-pink-900/40"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-1 text-xs text-gray-700 dark:text-gray-300">
                        <img
                          src={course.instructorAvatar}
                          alt={course.instructor}
                          className="w-5 h-5 rounded-full object-cover border border-pink-100 dark:border-gray-700"
                        />
                        <span className="font-semibold">{course.instructor}</span>
                        <span className="text-[11px] text-gray-400 dark:text-gray-500">• {course.modules.length} modules</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar & CTA */}
                  <div className="p-4 pt-0 border-t border-gray-100 dark:border-gray-800 mt-2">
                    <div className="flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-400 mb-1.5 pt-2">
                      <span>Course Progress</span>
                      <span className="font-bold text-pink-600 dark:text-pink-400">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-pink-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCourse(course);
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#e6007e] hover:bg-[#c9006e] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer group-hover:scale-[1.01]"
                    >
                      <span>{progress > 0 ? 'Continue Course' : 'View Course'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-gray-900 rounded-2xl border border-pink-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs space-y-3">
            <BookOpen className="w-7 h-7 text-pink-400 mx-auto" />
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">No courses found matching your search</p>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {searchQuery || selectedCategory !== 'All'
                  ? `No courses found matching "${searchQuery}" in ${selectedCategory}. Try resetting your search or exploring other categories.`
                  : 'Check back soon for new academy courses!'}
              </p>
            </div>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
              >
                <span>Clear Filters & Show All Courses</span>
              </button>
            )}
          </div>
        )
      ) : activeTab === 'Videos' ? (
        /* Curated Educational Videos Library */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
            <span>Verified Educational Channels (TED-Ed, Two Cents PBS, CrashCourse, freeCodeCamp)</span>
            <span className="font-semibold text-pink-600 dark:text-pink-400">{filteredVideos.length} lessons available</span>
          </div>

          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVideos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => setActiveVideoModal(vid)}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-pink-100 dark:border-gray-800 overflow-hidden hover:shadow-md hover:border-pink-200 dark:hover:border-pink-700 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/9] w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <img
                        src={vid.thumbnail}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                        <div className="w-12 h-12 rounded-full bg-pink-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{vid.duration}</span>
                      </span>
                      <span className="absolute top-2.5 left-2.5 bg-white/90 dark:bg-gray-900/90 text-pink-700 dark:text-pink-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {vid.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <p className="text-[11px] font-semibold text-pink-600 dark:text-pink-400">{vid.channelTitle}</p>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                        {vid.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                        {vid.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-1 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 border-t border-gray-50 dark:border-gray-800/80">
                    <span>{vid.views}</span>
                    <span className="text-pink-600 dark:text-pink-400 font-bold flex items-center gap-1">
                      <span>Watch Now</span>
                      <PlayCircle className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-gray-900 rounded-2xl border border-pink-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs space-y-3">
              <Video className="w-7 h-7 text-pink-400 mx-auto" />
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">No video lessons found</p>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Try adjusting your search query or selecting a different category.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
              >
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Real Educational Articles & Guides */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
            <span>In-depth Guides for Young Women & Leaders</span>
            <span className="font-semibold text-pink-600 dark:text-pink-400">{filteredArticles.length} articles</span>
          </div>

          {filteredArticles.length > 0 ? (
            <div className="space-y-3">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setActiveArticleModal(art)}
                  className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-pink-100 dark:border-gray-800 hover:border-pink-300 dark:hover:border-pink-700 transition-all cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider bg-pink-50 dark:bg-pink-950/50 px-2.5 py-0.5 rounded-full">
                      {art.category}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{art.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2 leading-relaxed">
                    {art.summary}
                  </p>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 dark:border-gray-800 text-xs">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-gray-900 dark:text-white">{art.author}</span>
                      <span>•</span>
                      <span>{art.authorTitle}</span>
                    </div>
                    <span className="font-semibold text-pink-600 dark:text-pink-400 group-hover:underline flex items-center gap-1">
                      <span>Read Article</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-gray-900 rounded-2xl border border-pink-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs space-y-3">
              <FileText className="w-7 h-7 text-pink-400 mx-auto" />
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">No articles found</p>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Try adjusting your search query or selecting a different category.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
              >
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Video Player Modal */}
      <AnimatePresence>
        {activeVideoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-pink-100 dark:border-gray-800"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-[10px] font-bold uppercase">
                    {activeVideoModal.category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{activeVideoModal.channelTitle}</span>
                </div>
                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Embed */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideoModal.embedId}?autoplay=1&rel=0`}
                  title={activeVideoModal.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug">
                  {activeVideoModal.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  {activeVideoModal.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                  <span className="text-gray-500 dark:text-gray-400">{activeVideoModal.views}</span>
                  <a
                    href={`https://www.youtube.com/watch?v=${activeVideoModal.embedId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-pink-600 dark:text-pink-400 hover:underline font-semibold"
                  >
                    <span>Open on YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {activeArticleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-pink-100 dark:border-gray-800"
            >
              {/* Header */}
              <div className="p-5 pb-4 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-[10px] font-bold uppercase">
                      {activeArticleModal.category}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">• {activeArticleModal.readTime}</span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                    {activeArticleModal.title}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Written by {activeArticleModal.author} ({activeArticleModal.authorTitle})
                  </p>
                </div>
                <button
                  onClick={() => setActiveArticleModal(null)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Article Body */}
              <div className="p-6 overflow-y-auto space-y-5 text-gray-800 dark:text-gray-200 leading-relaxed text-sm">
                <div className="p-4 rounded-2xl bg-pink-50/70 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/40">
                  <h4 className="text-xs font-bold text-pink-700 dark:text-pink-300 uppercase tracking-wider mb-2">
                    Key Practical Takeaways
                  </h4>
                  <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                    {activeArticleModal.keyTakeaways.map((point: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-pink-600 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="whitespace-pre-line font-normal text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-3">
                  {activeArticleModal.content}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">HerAura Knowledge Base</span>
                <button
                  onClick={() => setActiveArticleModal(null)}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold transition-colors cursor-pointer"
                >
                  Finished Reading
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
