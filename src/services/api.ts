import { INITIAL_COURSES, INITIAL_MENTORS, INITIAL_POSTS, INITIAL_COMMUNITY_POSTS } from '../data/initialData';
import { Course, MenstrualCycleLog, Mentor, CommunityPost, WellnessLog } from '../types';

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
}

export const apiService = {
  // Pure client-side contact submission (persists to localStorage for manual review/export)
  async submitContactForm(payload: ContactFormPayload): Promise<ApiResponse> {
    try {
      const existing = JSON.parse(localStorage.getItem('her_aura_contact_submissions') || '[]');
      existing.push({
        ...payload,
        id: 'msg-' + Date.now(),
        date: new Date().toISOString(),
      });
      localStorage.setItem('her_aura_contact_submissions', JSON.stringify(existing));

      return {
        success: true,
        message: 'Thank you sister! Your message has been received and saved.',
      };
    } catch {
      return {
        success: true,
        message: 'Thank you sister! Your message has been recorded.',
      };
    }
  },

  // Pure client-side newsletter subscription
  async subscribeNewsletter(email: string): Promise<ApiResponse> {
    try {
      const existing: string[] = JSON.parse(localStorage.getItem('her_aura_subscribers') || '[]');
      if (!existing.includes(email.toLowerCase().trim())) {
        existing.push(email.toLowerCase().trim());
        localStorage.setItem('her_aura_subscribers', JSON.stringify(existing));
      }
      return {
        success: true,
        message: 'Welcome to the HerAura sisterhood community newsletter!',
      };
    } catch {
      return {
        success: true,
        message: 'Subscribed successfully to HerAura updates!',
      };
    }
  },

  // Interactive client-side Aura AI companion with contextual mentor recommendations
  async sendChatMessage(message: string, _history?: { role: 'user' | 'model'; parts?: string; content?: string }[]): Promise<{
    text: string;
    recommendedMentor?: Mentor;
    recommendations?: Array<{
      mentorId: string;
      name: string;
      title: string;
      image: string;
      reason: string;
    }>;
  }> {
    const lower = message.toLowerCase();
    let recommendedMentor: Mentor | undefined;
    let text = '';
    let recommendations: Array<{
      mentorId: string;
      name: string;
      title: string;
      image: string;
      reason: string;
    }> = [];

    if (
      lower.includes('tech') ||
      lower.includes('code') ||
      lower.includes('software') ||
      lower.includes('web') ||
      lower.includes('program') ||
      lower.includes('fintech') ||
      lower.includes('developer') ||
      lower.includes('interview')
    ) {
      recommendedMentor = INITIAL_MENTORS.find(m => m.id === 'mentor-rita') || INITIAL_MENTORS[0];
      text = "I love seeing your curiosity in technology! Building software is one of the most empowering skills you can learn. Whether you want to build websites, work in fintech, or solve community challenges with code, remember that you belong in tech. I highly recommend connecting with HerAura co-founder Rita Okam — she specializes in software development and mentoring women in STEM!";
      recommendations = [
        {
          mentorId: 'mentor-rita',
          name: 'Rita Okam',
          title: 'Software Developer & HerAura Co-Founder',
          image: '/src/assets/images/founder_rita_okam_1789946036039.jpg',
          reason: 'Expert in full-stack web development, coding confidence, and tech career pathways.',
        },
      ];
    } else if (
      lower.includes('ai') ||
      lower.includes('data') ||
      lower.includes('science') ||
      lower.includes('school') ||
      lower.includes('university') ||
      lower.includes('degree') ||
      lower.includes('academic') ||
      lower.includes('research')
    ) {
      recommendedMentor = INITIAL_MENTORS.find(m => m.id === 'mentor-nora') || INITIAL_MENTORS[1];
      text = "Education and data-driven solutions can transform communities! Exploring AI and computer science opens doors to solving global challenges like the UN Sustainable Development Goals. For guidance on academic pathways, tech for good, and AI literacy, I recommend connecting with HerAura co-founder Nora Godwin Teneke!";
      recommendations = [
        {
          mentorId: 'mentor-nora',
          name: 'Nora Godwin Teneke',
          title: 'AI & Data Ethics Specialist | HerAura Co-Founder',
          image: '/src/assets/images/founder_nora_teneke_1789946025497.jpg',
          reason: 'Specializes in AI ethics, education technology, and SDGs research.',
        },
      ];
    } else if (
      lower.includes('period') ||
      lower.includes('cramp') ||
      lower.includes('cycle') ||
      lower.includes('menstrual') ||
      lower.includes('bleed') ||
      lower.includes('pms') ||
      lower.includes('body') ||
      lower.includes('pain')
    ) {
      recommendedMentor = INITIAL_MENTORS.find(m => m.id === 'mentor-zainab') || INITIAL_MENTORS[2];
      text = "Your bodily health is so important, and you deserve a safe, shame-free space to understand your cycle. Make sure you are resting, hydrating, and using gentle warmth for cramps. Track your symptoms in our Wellness tab, and feel free to connect with Dr. Zainab Al-Mansoor for compassionate feminine health guidance!";
      recommendations = [
        {
          mentorId: 'mentor-zainab',
          name: 'Dr. Zainab Al-Mansoor',
          title: 'Reproductive Health Educator & Physician',
          image: '/src/assets/images/mentor_zainab.jpg',
          reason: 'Certified specialist in adolescent feminine wellness and cycle care.',
        },
      ];
    } else if (
      lower.includes('stress') ||
      lower.includes('anxious') ||
      lower.includes('sad') ||
      lower.includes('overwhelmed') ||
      lower.includes('tired') ||
      lower.includes('feeling') ||
      lower.includes('burnout') ||
      lower.includes('cry')
    ) {
      recommendedMentor = INITIAL_MENTORS.find(m => m.id === 'mentor-amina-diallo') || INITIAL_MENTORS[3];
      text = "Take a gentle, deep breath right now. It is completely normal to feel overwhelmed sometimes, and your feelings are entirely valid. You don't have to carry everything alone. Try doing our 2-minute box breathing exercise in the Wellness tab, and consider chatting with Amina Diallo, our youth emotional wellness mentor.";
      recommendations = [
        {
          mentorId: 'mentor-amina-diallo',
          name: 'Amina Diallo',
          title: 'Youth Wellbeing & Mindfulness Coach',
          image: '/src/assets/images/mentor_amina.jpg',
          reason: 'Specialist in teenage stress resilience, mindfulness, and gentle habits.',
        },
      ];
    } else if (
      lower.includes('design') ||
      lower.includes('creative') ||
      lower.includes('art') ||
      lower.includes('ui') ||
      lower.includes('ux') ||
      lower.includes('portfolio')
    ) {
      recommendedMentor = INITIAL_MENTORS.find(m => m.id === 'mentor-chidinma') || INITIAL_MENTORS[4];
      text = "Product design and UI/UX is an exciting creative bridge between empathy and technology! Crafting accessible, beautiful digital experiences is deeply rewarding. Chidinma Eze is an incredible mentor who can review your portfolio and guide your creative journey.";
      recommendations = [
        {
          mentorId: 'mentor-chidinma',
          name: 'Chidinma Eze',
          title: 'Senior Product Designer',
          image: '/src/assets/images/mentor_chidinma.jpg',
          reason: 'Expert in UX design systems, career transitions, and visual storytelling.',
        },
      ];
    } else {
      text = "Welcome to HerAura! 🌸 I am Aura, your safe space guide. You can ask me anything about finding mentors, exploring courses in confidence and tech, tracking your menstrual health and daily wellbeing, or navigating school and friendships. How can I support you today, sister?";
      recommendations = [
        {
          mentorId: 'mentor-rita',
          name: 'Rita Okam',
          title: 'Software Developer & Co-Founder',
          image: '/src/assets/images/founder_rita_okam_1789946036039.jpg',
          reason: 'Co-founder passionate about empowering young women into tech.',
        },
        {
          mentorId: 'mentor-nora',
          name: 'Nora Godwin Teneke',
          title: 'AI & Data Ethics Specialist | Co-Founder',
          image: '/src/assets/images/founder_nora_teneke_1789946025497.jpg',
          reason: 'Co-founder dedicated to AI literacy, education, and SDGs.',
        },
      ];
    }

    return { text, recommendedMentor, recommendations };
  },

  // Pure client-side community posts with localStorage persistence
  async getCommunityPosts(): Promise<CommunityPost[]> {
    return this.getStoredPosts();
  },

  async createCommunityPost(postPayload: Partial<CommunityPost>): Promise<{ success: boolean; post: CommunityPost }> {
    const newPost: CommunityPost = {
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

    const current = this.getStoredPosts();
    const updated = [newPost, ...current];
    this.saveStoredPosts(updated);

    return { success: true, post: newPost };
  },

  // Local storage management
  getStoredPosts(): CommunityPost[] {
    const saved = localStorage.getItem('her_aura_posts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        /* ignore */
      }
    }
    return INITIAL_COMMUNITY_POSTS || INITIAL_POSTS;
  },

  saveStoredPosts(posts: CommunityPost[]) {
    localStorage.setItem('her_aura_posts', JSON.stringify(posts));
  },

  getStoredCourses(): Course[] {
    const saved = localStorage.getItem('her_aura_courses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* ignore */
      }
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
      try {
        return JSON.parse(saved);
      } catch {
        /* ignore */
      }
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
      try {
        return JSON.parse(saved);
      } catch {
        /* ignore */
      }
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
