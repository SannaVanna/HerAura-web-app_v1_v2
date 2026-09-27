import React, { useState, useEffect } from 'react';
import {
  INITIAL_USER,
  INITIAL_COURSES,
  INITIAL_MENTORS,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_NOTIFICATIONS,
} from './data/initialData';
import {
  UserProfile,
  Course,
  Mentor,
  CommunityPost,
  WellnessLog,
  InAppNotification,
  UserBadge,
} from './types';

import { apiService } from './services/api';
import { indexedDBService } from './services/indexedDBService';

// Components
import { HerAuraLogo } from './components/HerAuraLogo';
import { LandingPage } from './components/LandingPage';
import { HomeDashboard } from './components/HomeDashboard';
import { CommunityFeed } from './components/CommunityFeed';
import { LearnSkills } from './components/LearnSkills';
import { MentorsView } from './components/MentorsView';
import { MentorProfileModal } from './components/MentorProfileModal';
import { WellnessTracker } from './components/WellnessTracker';
import { AiAssistantView } from './components/AiAssistantView';
import { UserProfileView } from './components/UserProfileView';
import { AuthView } from './components/AuthView';
import { NotificationPopover } from './components/NotificationPopover';

// Icons
import {
  Home,
  Users,
  BookOpen,
  Sparkles,
  Heart,
  User as UserIcon,
  Moon,
  Sun,
  Bell,
  MessageCircle,
  X,
  WifiOff,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  Search,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Navigation mode: 'landing' (recreation of screenshots) vs 'app' (the 14 mobile UI internal views)
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');

  // Active tab within the app: 'home' | 'community' | 'learn' | 'mentors' | 'wellness' | 'ai' | 'profile'
  const [activeTab, setActiveTab] = useState<
    'home' | 'community' | 'learn' | 'mentors' | 'wellness' | 'ai' | 'profile'
  >('home');

  // Dark mode with localStorage persistence and documentElement class sync
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('her_aura_theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('her_aura_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('her_aura_theme', 'light');
    }
  }, [darkMode]);

  // Authentication & User State
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);
  const [authModal, setAuthModal] = useState<'login' | 'register' | 'onboarding' | null>(null);

  // App Data State
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [mentors, setMentors] = useState<Mentor[]>(INITIAL_MENTORS);
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);

  // Active Modals
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showFloatingAi, setShowFloatingAi] = useState(false);
  const [backendStatus, setBackendStatus] = useState<{ connected: boolean; provider: string }>({
    connected: true,
    provider: 'Local Safe Space Service',
  });

  // Active Notifications State (persisted with fallback to INITIAL_NOTIFICATIONS)
  const [notifications, setNotifications] = useState<InAppNotification[]>(() => {
    const saved = localStorage.getItem('her_aura_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_NOTIFICATIONS;
  });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('her_aura_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleAddNotification = (newNotif: Partial<InAppNotification>) => {
    const notif: InAppNotification = {
      id: 'notif-' + Date.now(),
      title: newNotif.title || 'New HerAura Alert',
      message: newNotif.message || '',
      timestamp: 'Just now',
      type: newNotif.type || 'cycle',
      read: false,
      targetTab: newNotif.targetTab,
      targetId: newNotif.targetId,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Check backend status on mount
  useEffect(() => {
    apiService.checkBackendStatus().then((status) => {
      setBackendStatus(status);
    });
  }, []);

  // Sync posts and courses with persistent backend API & IndexedDB
  useEffect(() => {
    apiService.getCommunityPosts().then((remotePosts) => {
      if (remotePosts && remotePosts.length > 0) {
        setPosts(remotePosts);
        indexedDBService.savePosts(remotePosts).catch(() => {});
      } else {
        indexedDBService.getAllPosts().then((cachedPosts) => {
          if (cachedPosts && cachedPosts.length > 0) {
            setPosts(cachedPosts);
          } else {
            indexedDBService.savePosts(INITIAL_COMMUNITY_POSTS).catch(() => {});
          }
        }).catch(() => {});
      }
    }).catch(() => {
      indexedDBService.getAllPosts().then((cachedPosts) => {
        if (cachedPosts && cachedPosts.length > 0) {
          setPosts(cachedPosts);
        }
      }).catch(() => {});
    });

    indexedDBService.getAllCourseProgress().then((progressMap) => {
      if (progressMap && Object.keys(progressMap).length > 0) {
        setCourses((prev) =>
          prev.map((c) => {
            const rec = progressMap[c.id];
            if (rec) {
              const updatedModules = c.modules.map((m) => ({
                ...m,
                completed: rec.completedModuleIds.includes(m.id),
              }));
              return {
                ...c,
                modules: updatedModules,
                completed: rec.completed,
              };
            }
            return c;
          })
        );
      }
    }).catch(() => {});
  }, []);

  // Scroll to top on tab/view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [viewMode, activeTab]);

  // Handlers
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleNavigateToAuth = (mode: 'login' | 'register') => {
    setAuthModal(mode);
  };

  const handleNavigateToApp = (section: string = 'home') => {
    setViewMode('app');
    if (
      ['home', 'community', 'learn', 'mentors', 'wellness', 'ai', 'profile'].includes(section)
    ) {
      setActiveTab(section as any);
    } else {
      setActiveTab('home');
    }
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setAuthModal(null);
    setViewMode('app');
    setActiveTab('home');
  };

  // Add post to community feed with text and image support
  const handleAddPost = async (newPostData: Partial<CommunityPost>) => {
    const postImg = newPostData.image || newPostData.imageUrl || undefined;
    const post: CommunityPost = {
      id: 'post-' + Date.now(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: 'Community Sister',
      content: (newPostData.content || '').trim(),
      category: (newPostData.category as any) || 'For You',
      image: postImg,
      imageUrl: postImg,
      feeling: newPostData.feeling,
      likes: 0,
      liked: false,
      comments: [],
      timestamp: 'Just now',
      tags: newPostData.tags || ['Sisterhood'],
    };

    const nextPosts = [post, ...posts];
    setPosts(nextPosts);
    indexedDBService.savePosts(nextPosts).catch(() => {});
    apiService.createCommunityPost(post).catch(() => {});

    setCurrentUser((prev) => ({
      ...prev,
      postsCount: prev.postsCount + 1,
    }));

    handleAddNotification({
      title: '🌸 Story Published to Sisterhood',
      message: postImg
        ? 'Your story and photo were shared with the HerAura community!'
        : 'Your post was shared with the HerAura community. Sisters can now cheer and comment!',
      type: 'community',
      targetTab: 'community'
    });
  };

  // Like community post
  const handleLikePost = (postId: string) => {
    setPosts((prevPosts) => {
      const updated = prevPosts.map((p) => {
        if (p.id === postId) {
          const isLiked = p.liked;
          return {
            ...p,
            liked: !isLiked,
            likes: isLiked ? p.likes - 1 : p.likes + 1,
          };
        }
        return p;
      });
      indexedDBService.savePosts(updated).catch(() => {});
      return updated;
    });
  };

  // Add comment to post
  const handleAddComment = (postId: string, text: string) => {
    setPosts((prevPosts) => {
      const updated = prevPosts.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: 'c-' + Date.now(),
            authorName: currentUser.name,
            authorAvatar: currentUser.avatar,
            content: text,
            timestamp: 'Just now',
          };
          return {
            ...p,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      });
      indexedDBService.savePosts(updated).catch(() => {});
      return updated;
    });
    setCurrentUser((prev) => ({
      ...prev,
      commentsCount: prev.commentsCount + 1,
    }));

    handleAddNotification({
      title: '💬 Sisterhood Comment Added',
      message: `Your uplifting comment "${text.slice(0, 45)}${text.length > 45 ? '...' : ''}" was posted to the discussion.`,
      type: 'community',
      targetTab: 'community'
    });
  };

  // Toggle mentor connection
  const handleToggleConnect = (mentorId: string) => {
    let targetMentorName = '';
    let isConnecting = false;

    setMentors((prev) =>
      prev.map((m) => {
        if (m.id === mentorId) {
          const nextState = !m.connected;
          targetMentorName = m.name;
          isConnecting = nextState;
          return { ...m, connected: nextState };
        }
        return m;
      })
    );

    // If active selected mentor is the same, update it as well
    if (selectedMentor && selectedMentor.id === mentorId) {
      setSelectedMentor((prev) => (prev ? { ...prev, connected: !prev.connected } : null));
    }

    if (isConnecting && targetMentorName) {
      handleAddNotification({
        title: `✨ Mentorship Connected: ${targetMentorName}`,
        message: `You connected with ${targetMentorName}. Look out for personalized career guidance and scheduled sessions!`,
        type: 'mentor',
        targetTab: 'mentors'
      });
    }
  };

  // Toggle module completion in course
  const handleToggleModuleComplete = (courseId: string, moduleId: string) => {
    let completedCourseTitle = '';

    setCourses((prevCourses) => {
      const updatedList = prevCourses.map((c) => {
        if (c.id === courseId) {
          const updatedModules = c.modules.map((m) => {
            if (m.id === moduleId) {
              return { ...m, completed: !m.completed };
            }
            return m;
          });

          // Check if course became completed
          const allCompleted = updatedModules.every((m) => m.completed);
          if (allCompleted && !c.completed) {
            completedCourseTitle = c.title;
          }

          // Persist course progress to IndexedDB
          const completedIds = updatedModules.filter((m) => m.completed).map((m) => m.id);
          indexedDBService.saveCourseProgress(courseId, completedIds, allCompleted).catch(() => {});

          return {
            ...c,
            modules: updatedModules,
            completed: allCompleted,
          };
        }
        return c;
      });

      return updatedList;
    });

    // Update selected course if open
    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse((prev) => {
        if (!prev) return null;
        const updatedModules = prev.modules.map((m) => {
          if (m.id === moduleId) {
            return { ...m, completed: !m.completed };
          }
          return m;
        });
        return { ...prev, modules: updatedModules };
      });
    }

    if (completedCourseTitle) {
      handleAddNotification({
        title: `🏆 Course Mastered: ${completedCourseTitle}`,
        message: `Congratulations! You finished all modules in "${completedCourseTitle}". Click to share your achievement card with your sisters!`,
        type: 'course',
        targetTab: 'learn'
      });
    }
  };

  // Award new scholarship/completion badge
  const handleAwardBadge = (badge: UserBadge) => {
    setCurrentUser((prev) => {
      const alreadyHas = prev.badges.some((b) => b.id === badge.id);
      if (alreadyHas) return prev;
      return {
        ...prev,
        badges: [badge, ...prev.badges],
        completedCoursesCount: prev.completedCoursesCount + 1,
      };
    });

    handleAddNotification({
      title: `🎖️ New Badge Unlocked: ${badge.name}`,
      message: badge.description,
      type: 'course',
      targetTab: 'profile'
    });
  };

  // Update user profile
  const handleUpdateUser = (updatedData: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updatedData }));
  };

  // Sign out
  const handleLogout = () => {
    setViewMode('landing');
    setAuthModal(null);
  };

  return (
    <div
      id="heraura-app-root"
      className={`min-h-screen font-sans ${
        darkMode ? 'bg-[#1a1d20] text-gray-100' : 'bg-[#faf7f7] text-gray-900'
      }`}
    >
      {/* 1. LANDING PAGE VIEW (Faithful recreation of provided screenshots) */}
      {viewMode === 'landing' ? (
        <LandingPage
          onNavigateToAuth={handleNavigateToAuth}
          onNavigateToApp={handleNavigateToApp}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />
      ) : (
        /* 2. INTERNAL APP VIEW (Matching the 14 mobile UI reference screens) */
        <div id="internal-app-container" className="min-h-screen flex flex-col pb-24">
          {/* Offline Mode Banner when backend connection is lost */}
          {!backendStatus.connected && (
            <motion.div
              id="offline-mode-banner"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-white px-4 py-2.5 text-xs font-semibold shadow-md sticky top-0 z-40 border-b border-amber-400/30"
            >
              <div className="max-w-4xl mx-auto w-full flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <WifiOff className="w-4 h-4 text-amber-100 flex-shrink-0 animate-pulse" />
                  <span>
                    <strong>Offline Mode:</strong> Server connection lost. You can continue viewing all cached lessons, community discussions, and wellness entries safely.
                  </span>
                </div>
                <button
                  id="offline-retry-btn"
                  onClick={async () => {
                    const status = await apiService.checkBackendStatus();
                    setBackendStatus(status);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-black/20 hover:bg-black/30 text-white text-[11px] font-bold flex items-center gap-1 transition-colors flex-shrink-0 cursor-pointer"
                  title="Retry backend connection"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reconnect</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Unified Clean Application Header (Matching uploaded Screenshot 1 & 2) */}
          <header className={`sticky ${!backendStatus.connected ? 'top-9' : 'top-0'} z-30 bg-white/95 dark:bg-[#1a1d20]/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-2xs transition-all`}>
            {/* Left: Brand Logo / Profile image */}
            <div className="flex items-center gap-3">
              <div
                className="cursor-pointer"
                onClick={() => setActiveTab('home')}
                title="HerAura Home"
              >
                <HerAuraLogo size="sm" showTagline={false} />
              </div>
            </div>

            {/* Center: Search pill bar (Screenshot 1 & 2) */}
            <div className="flex-1 max-w-xs sm:max-w-md mx-3 sm:mx-6">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search....."
                  className="w-full pl-9 pr-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-pink-400 shadow-2xs transition-colors"
                />
              </div>
            </div>

            {/* Right: Icon Buttons (Home, Bell, Profile, Logout, Theme Moon) */}
            <div className="flex items-center gap-1.5 sm:gap-3 text-gray-600 dark:text-gray-300">
              {/* Home icon button */}
              <button
                onClick={() => setActiveTab('home')}
                className={`p-2 rounded-full hover:bg-pink-50 dark:hover:bg-gray-800 hover:text-[#e6007e] transition-colors cursor-pointer ${
                  activeTab === 'home' ? 'text-[#e6007e]' : ''
                }`}
                title="Dashboard"
                aria-label="Home"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Notification Bell with Badge */}
              <button
                id="notification-bell-btn"
                onClick={() => setIsNotificationsOpen(true)}
                className="relative p-2 rounded-full hover:text-[#e6007e] hover:bg-pink-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#e6007e] rounded-full" />
                )}
              </button>

              {/* User Profile Icon */}
              <button
                onClick={() => setActiveTab('profile')}
                className={`p-2 rounded-full hover:bg-pink-50 dark:hover:bg-gray-800 hover:text-[#e6007e] transition-colors cursor-pointer ${
                  activeTab === 'profile' ? 'text-[#e6007e]' : ''
                }`}
                title="User Profile"
                aria-label="Profile"
              >
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Logout Icon */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                title="Sign Out to Public Landing Page"
                aria-label="Log Out"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Dark / Light Mode Toggle */}
              <button
                onClick={handleToggleDarkMode}
                className="p-2 rounded-full text-amber-500 hover:bg-pink-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 fill-amber-400" />}
              </button>
            </div>
          </header>

          {/* Main App Layout: Sidebar on Desktop + Content Area */}
          <div className="flex-1 flex w-full">
            {/* Left Sidebar on Desktop (Matching Screenshot 1) */}
            <aside className="hidden md:flex flex-col w-52 lg:w-56 flex-shrink-0 border-r border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-[#1a1d20]/70 py-4 px-3 space-y-1 sticky top-[57px] h-[calc(100vh-57px)]">
              {[
                { id: 'home', label: 'Dashboard', icon: '🏠' },
                { id: 'mentors', label: 'Mentor Connect', icon: '👩‍🏫' },
                { id: 'community', label: 'Community', icon: '💬' },
                { id: 'learn', label: 'Learn Skills', icon: '🎓' },
                { id: 'wellness', label: 'Health Tracker', icon: '❤️' },
                { id: 'ai', label: 'AI Assistant', icon: '🤖' },
              ].map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      if (item.id === 'mentors') setSelectedMentor(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? 'text-gray-900 dark:text-white font-bold bg-pink-50/70 dark:bg-pink-950/40 border-l-4 border-[#e6007e]'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </aside>

            {/* Active Tab Screen Content with subtle fade-in and slide-up transition */}
            <main className="flex-1 min-w-0 overflow-x-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {activeTab === 'home' && (
                  <HomeDashboard
                    user={currentUser}
                    courses={courses}
                    mentors={mentors}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                    onSelectCourse={(course) => {
                      setSelectedCourse(course);
                      setActiveTab('learn');
                    }}
                    onSelectMentor={(mentor) => setSelectedMentor(mentor)}
                  />
                )}

                {activeTab === 'community' && (
                  <CommunityFeed
                    user={currentUser}
                    posts={posts}
                    onAddPost={handleAddPost}
                    onLikePost={handleLikePost}
                    onAddComment={handleAddComment}
                  />
                )}

                {activeTab === 'learn' && (
                  <LearnSkills
                    courses={courses}
                    selectedCourse={selectedCourse}
                    onSelectCourse={(course) => setSelectedCourse(course)}
                    onToggleModuleComplete={handleToggleModuleComplete}
                    onAwardBadge={handleAwardBadge}
                    onShareToCommunity={(content) => {
                      handleAddPost({
                        content,
                        tags: ['LearningJourney', 'SisterhoodScholar'],
                        category: 'Growth',
                      });
                    }}
                  />
                )}

                {activeTab === 'mentors' && (
                  <MentorsView
                    mentors={mentors}
                    selectedMentor={selectedMentor}
                    onSelectMentor={(mentor) => setSelectedMentor(mentor)}
                    onToggleConnect={handleToggleConnect}
                  />
                )}

                {activeTab === 'wellness' && (
                  <WellnessTracker
                    onAddNotification={handleAddNotification}
                  />
                )}

                {activeTab === 'ai' && (
                  <AiAssistantView
                    mentors={mentors}
                    onSelectMentor={(mentor) => setSelectedMentor(mentor)}
                    onToggleConnect={handleToggleConnect}
                  />
                )}

                {activeTab === 'profile' && (
                  <UserProfileView
                    user={currentUser}
                    onUpdateUser={handleUpdateUser}
                    onLogout={handleLogout}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

          {/* Floating Mobile Bottom Navigation Dock (Matching Reference Layout) */}
          <nav
            id="mobile-bottom-dock"
            className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-pink-100 py-2 px-3 shadow-lg flex items-center justify-around max-w-lg mx-auto sm:rounded-t-3xl sm:border-x"
          >
            <button
              id="dock-home"
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
                activeTab === 'home' ? 'text-pink-600 font-bold scale-105' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Home</span>
            </button>

            <button
              id="dock-community"
              onClick={() => setActiveTab('community')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
                activeTab === 'community' ? 'text-pink-600 font-bold scale-105' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Community</span>
            </button>

            <button
              id="dock-learn"
              onClick={() => setActiveTab('learn')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
                activeTab === 'learn' ? 'text-pink-600 font-bold scale-105' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Learn & Skill</span>
            </button>

            <button
              id="dock-mentors"
              onClick={() => setActiveTab('mentors')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
                activeTab === 'mentors' ? 'text-pink-600 font-bold scale-105' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Mentors</span>
            </button>

            <button
              id="dock-wellness"
              onClick={() => setActiveTab('wellness')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
                activeTab === 'wellness' ? 'text-pink-600 font-bold scale-105' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Wellness</span>
            </button>

            <button
              id="dock-profile"
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
                activeTab === 'profile' ? 'text-pink-600 font-bold scale-105' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              <UserIcon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Profile</span>
            </button>
          </nav>
        </div>
      )}

      {/* Mentor Profile Modal (Only for quick previews when not on mentors tab) */}
      <AnimatePresence>
        {selectedMentor && activeTab !== 'mentors' && (
          <MentorProfileModal
            mentor={selectedMentor}
            onClose={() => setSelectedMentor(null)}
            onToggleConnect={handleToggleConnect}
          />
        )}
      </AnimatePresence>

      {/* Authentication & Onboarding Modal */}
      <AnimatePresence>
        {authModal && (
          <AuthView
            initialMode={authModal}
            onSuccess={handleAuthSuccess}
            onClose={() => setAuthModal(null)}
          />
        )}
      </AnimatePresence>

      {/* Notifications Drawer */}
      <NotificationPopover
        isOpen={isNotificationsOpen}
        notifications={notifications}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDeleteNotification={handleDeleteNotification}
        onClearAll={handleClearAllNotifications}
        onNavigateToTab={(tab) => {
          setActiveTab(tab);
          setIsNotificationsOpen(false);
        }}
        onAddNotification={handleAddNotification}
      />

      {/* Floating Aura AI Bubble (when not already on AI tab) */}
      {viewMode === 'app' && activeTab !== 'ai' && (
        <button
          id="floating-ai-launcher"
          onClick={() => setActiveTab('ai')}
          className="fixed bottom-20 right-4 sm:right-6 z-40 p-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          title="Chat with Aura AI"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-bold hidden sm:inline">Ask Aura</span>
        </button>
      )}
    </div>
  );
}
