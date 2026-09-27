export interface UserBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  dateEarned: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  postsCount: number;
  commentsCount: number;
  followersCount: number;
  completedCoursesCount: number;
  badges: UserBadge[];
  interests: string[];
  joinedDate?: string;
  mentorConnectionsCount?: number;
  enrolledCoursesCount?: number;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  bio: string;
  expertise: string[];
  image: string;
  avatar?: string;
  category: 'Tech' | 'Career' | 'Wellness' | 'Finance' | 'Leadership' | string;
  rating?: number;
  reviewsCount?: number;
  connected?: boolean;
  location?: string;
  isFounder?: boolean;
  organization?: string;
  availability?: string;
  // Reference UI fields:
  topic?: string;
  statusBadge?: 'external' | 'heraura';
  email?: string;
  mentorFocus?: string;
  mentorshipStyle?: string;
  helpsWith?: string[];
  websiteUrl?: string;
}

export interface MentorRecommendation {
  mentorId: string;
  name: string;
  title: string;
  image?: string;
  reason: string;
}

export interface PostComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  timeAgo?: string;
}

export interface CommunityPost {
  id: string;
  title?: string;
  authorId?: string;
  authorName: string;
  authorAvatar: string;
  authorRole?: string;
  feeling?: string;
  content: string;
  timestamp: string;
  timeAgo?: string;
  image?: string;
  imageUrl?: string;
  likes: number;
  liked: boolean;
  isLiked?: boolean;
  comments: PostComment[];
  category: 'For You' | 'Trending' | 'Latest' | string;
  tags: string[];
  shares?: number;
}

export type Post = CommunityPost;
export type CommentItem = PostComment;

export interface ModuleQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  videoTitle?: string;
  videoEmbedId?: string;
  videoUrl?: string;
  summary: string;
  learningObjectives?: string[];
  theoryContent?: string;
  keyTakeaways: string[];
  quiz?: ModuleQuizQuestion[];
  quizPassed?: boolean;
}

export interface Course {
  id: string;
  title: string;
  category: 'Career' | 'Tech' | 'Finance' | 'Wellness' | 'Leadership' | 'Arts' | string;
  tags?: string[];
  instructor: string;
  instructorTitle: string;
  instructorAvatar: string;
  duration: string;
  rating: number;
  enrolledCount: number;
  coverImage: string;
  thumbnail?: string;
  description: string;
  learningObjectives?: string[];
  theoreticalOverview: string;
  modules: CourseModule[];
  progress?: number;
  level?: string;
  completed?: boolean;
  badgeAwarded?: UserBadge;
  sourceProvider?: string;
  sourceUrl?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
}

export interface GratitudeEntry {
  id: string;
  date: string;
  formattedDate: string;
  items: string[];
  createdAt: string;
}

export interface WellnessLog {
  date?: string;
  sleepHours: number;
  waterGlasses: number;
  activityMinutes: number;
  journalEntry: string;
  mood?: 'happy' | 'good' | 'neutral' | 'sad' | 'down' | null;
  gratitudeItems?: string[];
}

export interface MenstrualPeriodEntry {
  id: string;
  startDate: string;
  endDate?: string;
  flowIntensity?: 'light' | 'medium' | 'heavy' | 'spotting';
  flow?: 'Light' | 'Medium' | 'Heavy' | 'Spotting' | string;
  symptoms: string[];
  mood?: string;
  notes?: string;
  cycleDay?: number;
}

export type MenstrualCycleLog = MenstrualPeriodEntry;

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendations?: MentorRecommendation[];
  recommendedMentor?: Mentor;
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'cycle' | 'hydration' | 'community' | 'course' | 'mentor';
  read: boolean;
  targetTab?: 'home' | 'community' | 'learn' | 'mentors' | 'wellness' | 'ai' | 'profile';
  targetId?: string;
}

export interface DailyMoodEnergyLog {
  id: string;
  date: string; // 'YYYY-MM-DD'
  displayDate: string; // e.g. 'Mar 21'
  timestamp: number;
  moodScore: number; // 1 - 10
  energyScore: number; // 1 - 10
  cyclePhase?: 'Menstrual' | 'Follicular' | 'Ovulation' | 'Luteal';
  notes?: string;
  tag?: string;
}
