import { INITIAL_COURSES, INITIAL_MENTORS, INITIAL_POSTS } from '../data/initialData';
import { Course, MenstrualCycleLog, Mentor, Post, CommunityPost, WellnessLog } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface ContactFormPayload {
  name: string;
  email: string;
  address?: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  isBackendConnected?: boolean;
}

export const apiService = {
  // Check backend health & Flask connection status
  async checkBackendStatus(): Promise<{ connected: boolean; url: string; provider: string }> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/health`, { method: 'GET', signal: AbortSignal.timeout(3000) });
        if (res.ok) {
          return { connected: true, url: API_BASE_URL, provider: 'Flask Backend' };
        }
      } catch {
        // Fall through
      }
    }

    // Check local express server
    try {
      const localRes = await fetch('/api/health', { method: 'GET', signal: AbortSignal.timeout(2000) });
      if (localRes.ok) {
        return { connected: true, url: '/api', provider: 'HerAura Server' };
      }
    } catch {
      // Local server not responding directly
    }

    return {
      connected: false,
      url: API_BASE_URL || 'Not configured',
      provider: API_BASE_URL ? 'External Flask (Unreachable)' : 'Standby Mode',
    };
  },

  // Submit contact message (Section 1E)
  async submitContactForm(payload: ContactFormPayload): Promise<ApiResponse> {
    const targetUrl = API_BASE_URL ? `${API_BASE_URL}/api/contact` : '/api/contact';
    try {
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        return { success: true, message: json.message || 'Message sent successfully to HerAura team.', isBackendConnected: true };
      }
      const err = await res.text();
      return { success: false, error: err || 'Server returned an error' };
    } catch {
      // Per prompt requirement: "Do not display a false success message if the contact form is not connected to a working backend."
      return {
        success: false,
        isBackendConnected: false,
        error: API_BASE_URL
          ? `Could not reach configured Flask backend at ${API_BASE_URL}. Please verify server is online.`
          : 'Backend endpoint is currently offline. Configure VITE_API_BASE_URL in .env to deliver messages.',
      };
    }
  },

  // AI Assistant Chat: send user message to secure backend endpoint
  async sendChatMessage(message: string, history: { role: 'user' | 'model'; parts: string }[]): Promise<{
    text: string;
    recommendedMentor?: Mentor;
  }> {
    const targetUrl = API_BASE_URL ? `${API_BASE_URL}/api/chat` : '/api/chat';
    try {
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          text: data.text,
          recommendedMentor: data.recommendedMentor,
        };
      }
    } catch {
      // Fall through to smart client fallback
    }

    // Intelligent fallback with mentor recommendations when backend API is starting up or offline
    const lower = message.toLowerCase();
    let recommendedMentor: Mentor | undefined;
    let text = '';

    if (lower.includes('tech') || lower.includes('code') || lower.includes('software') || lower.includes('web') || lower.includes('program') || lower.includes('fintech')) {
      recommendedMentor = INITIAL_MENTORS.find(m => m.id === 'mentor-rita');
      text = "I love seeing your curiosity in technology! Building software is one of the most empowering skills you can learn. Whether you want to build websites, work in fintech, or solve community challenges with automation, remember that you belong in tech. I'd love to connect you with HerAura co-founder Rita Okam — she specializes in software development and mentoring women in tech!";
    } else if (lower.includes('ai') || lower.includes('data') || lower.includes('science') || lower.includes('school') || lower.includes('university') || lower.includes('degree')) {
      recommendedMentor = INITIAL_MENTORS.find(m => m.id === 'mentor-nora');
      text = "Education and data-driven solutions can transform communities! Exploring AI and computer science opens doors to solving global challenges like the UN Sustainable Development Goals. For guidance on academic pathways, tech for good, and AI literacy, I recommend connecting with HerAura co-founder Nora Godwin Teneke!";
    } else if (lower.includes('period') || lower.includes('cramp') || lower.includes('cycle') || lower.includes('health') || lower.includes('body') || lower.includes('pain')) {
      recommendedMentor = INITIAL_MENTORS.find(m => m.id === 'mentor-zainab');
      text = "Your bodily health is so important, and you deserve a safe, shame-free space to understand your cycle. Make sure you are resting, hydrating, and using gentle warmth for cramps. For trusted health education and questions about feminine wellness, Dr. Zainab Al-Mansoor is available right here on HerAura!";
    } else if (lower.includes('stress') || lower.includes('anxious') || lower.includes('sad') || lower.includes('overwhelmed') || lower.includes('tired') || lower.includes('feeling')) {
      recommendedMentor = INITIAL_MENTORS.find(m => m.id === 'mentor-amina-diallo');
      text = "Take a gentle, deep breath right now. It is completely normal to feel overwhelmed sometimes, and your feelings are entirely valid. You don't have to carry everything alone. Try doing our 2-minute box breathing exercise in the Wellness tab, and consider chatting with Amina Diallo, our youth emotional wellness mentor.";
    } else if (lower.includes('design') || lower.includes('creative') || lower.includes('art') || lower.includes('ui')) {
      recommendedMentor = INITIAL_MENTORS.find(m => m.id === 'mentor-chidinma');
      text = "Product design and UI/UX is an exciting creative bridge between empathy and technology! Crafting experiences for people is deeply rewarding. Chidinma Eze is an incredible mentor who can review your portfolio and guide your creative journey.";
    } else {
      text = `Welcome to HerAura! I'm Aura, your safe space guide. You can ask me anything about finding mentors, exploring courses in confidence and tech, tracking your menstrual health and daily wellbeing, or navigating school and friendships. How can I support you today?`;
    }

    return { text, recommendedMentor };
  },

  // Community Posts API with backend persistence & local caching fallback
  async getCommunityPosts(): Promise<CommunityPost[]> {
    const targetUrl = API_BASE_URL ? `${API_BASE_URL}/api/posts` : '/api/posts';
    try {
      const res = await fetch(targetUrl, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const json = await res.json();
        if (json.posts && Array.isArray(json.posts)) {
          this.saveStoredPosts(json.posts);
          return json.posts;
        }
      }
    } catch {
      // Fall through to local cache
    }
    return this.getStoredPosts();
  },

  async createCommunityPost(postPayload: Partial<CommunityPost>): Promise<{ success: boolean; post?: CommunityPost; error?: string }> {
    const targetUrl = API_BASE_URL ? `${API_BASE_URL}/api/posts` : '/api/posts';
    try {
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postPayload),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.post) {
          return { success: true, post: json.post };
        }
      }
      const errText = await res.text();
      return { success: false, error: errText || 'Failed to save post' };
    } catch (err: any) {
      // If server unreachable, create local post object
      const fallbackPost: CommunityPost = {
        id: 'post-' + Date.now(),
        authorId: postPayload.authorId || 'user-1',
        authorName: postPayload.authorName || 'Sisterhood Member',
        authorAvatar: postPayload.authorAvatar || '/src/assets/images/founder_rita_okam_1789946036039.jpg',
        authorRole: postPayload.authorRole || 'Community Sister',
        content: postPayload.content || '',
        image: postPayload.image || postPayload.imageUrl,
        imageUrl: postPayload.imageUrl || postPayload.image,
        category: postPayload.category || 'For You',
        tags: postPayload.tags || ['Sisterhood'],
        feeling: postPayload.feeling,
        likes: 0,
        liked: false,
        comments: [],
        timestamp: 'Just now',
      };
      return { success: true, post: fallbackPost };
    }
  },

  // Local storage management for user state
  getStoredPosts(): Post[] {
    const saved = localStorage.getItem('her_aura_posts');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_POSTS;
  },

  saveStoredPosts(posts: Post[]) {
    localStorage.setItem('her_aura_posts', JSON.stringify(posts));
  },

  getStoredCourses(): Course[] {
    const saved = localStorage.getItem('her_aura_courses');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_COURSES;
  },

  saveStoredCourses(courses: Course[]) {
    localStorage.setItem('her_aura_courses', JSON.stringify(courses));
  },

  getStoredWellness(): WellnessLog {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(`her_aura_wellness_${today}`);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
      date: today,
      sleepHours: 7.5,
      waterGlasses: 5,
      activityMinutes: 30,
      journalEntry: 'Feeling motivated to learn and take care of my mind today.',
      mood: 'good',
      gratitudeItems: ['Morning sunshine', 'Supportive HerAura community', 'Progress on my coding project'],
    };
  },

  saveStoredWellness(log: WellnessLog) {
    localStorage.setItem(`her_aura_wellness_${log.date}`, JSON.stringify(log));
  },

  getStoredCycleLogs(): MenstrualCycleLog[] {
    const saved = localStorage.getItem('her_aura_cycle_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [
      {
        id: 'cycle-prev',
        startDate: '2026-08-22',
        endDate: '2026-08-27',
        flow: 'Medium',
        symptoms: ['Mild Cramps', 'Tiredness'],
        mood: 'Calm',
        notes: 'Drank ginger tea and practiced breathing.',
      },
    ];
  },

  saveStoredCycleLogs(logs: MenstrualCycleLog[]) {
    localStorage.setItem('her_aura_cycle_logs', JSON.stringify(logs));
  },
};
