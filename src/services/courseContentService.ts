export interface EducationalVideo {
  id: string;
  title: string;
  category: string;
  channelTitle: string;
  embedId: string;
  thumbnail: string;
  duration: string;
  views: string;
  description: string;
}

export interface EducationalArticle {
  id: string;
  title: string;
  category: string;
  author: string;
  authorTitle: string;
  readTime: string;
  summary: string;
  content: string;
  keyTakeaways: string[];
}

export const EDUCATIONAL_VIDEOS: EducationalVideo[] = [
  {
    id: 'vid-coding-intro',
    title: 'Computer Science & Web Dev Principles Explained',
    category: 'Tech',
    channelTitle: 'CrashCourse',
    embedId: 'tpIctyqH29Q',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600',
    duration: '11:45',
    views: '1.2M views',
    description: 'A friendly and accessible breakdown of how software works, programming fundamentals, and modern web architecture.'
  },
  {
    id: 'vid-money-budgeting',
    title: 'How to Budget Your Money Like a Pro',
    category: 'Finance',
    channelTitle: 'Two Cents | PBS',
    embedId: 'sVKQn2645vg',
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=600',
    duration: '8:20',
    views: '840K views',
    description: 'Learn the practical 50/30/20 rule, emergency savings cushion strategies, and healthy financial foundations for young women.'
  },
  {
    id: 'vid-confidence-imposter',
    title: 'How to Build Unshakeable Self-Confidence & Beat Imposter Syndrome',
    category: 'Career',
    channelTitle: 'TED-Ed',
    embedId: 'ZQUxL4Jm1Lo',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    duration: '5:32',
    views: '3.4M views',
    description: 'Explore the psychology of self-efficacy and actionable mental reframing techniques to speak up with authority.'
  },
  {
    id: 'vid-wellness-hormones',
    title: 'Understanding Your Menstrual Cycle & Hormonal Energy',
    category: 'Wellness',
    channelTitle: 'TED-Ed',
    embedId: '2_begzV3u64',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
    duration: '6:15',
    views: '1.9M views',
    description: 'How the four phases of the menstrual cycle influence energy, nutrition, moods, and productivity throughout the month.'
  },
  {
    id: 'vid-leadership-communication',
    title: 'Your Body Language May Shape Who You Are',
    category: 'Leadership',
    channelTitle: 'TED',
    embedId: 'Ks-_Mh1QhMc',
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600',
    duration: '21:02',
    views: '22M views',
    description: 'Social psychologist Amy Cuddy reveals how adopting power postures can boost confidence hormones and reduce stress.'
  },
  {
    id: 'vid-tech-python-ai',
    title: 'Intro to Artificial Intelligence & Future Tech for Women',
    category: 'Tech',
    channelTitle: 'freeCodeCamp',
    embedId: 'JMUxmLyrhSk',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600',
    duration: '14:10',
    views: '620K views',
    description: 'An inspiring introduction to machine learning concepts and how women creators are leading ethical tech advancements.'
  }
];

export const EDUCATIONAL_ARTICLES: EducationalArticle[] = [
  {
    id: 'art-financial-independence',
    title: 'The Young Woman’s Guide to Financial Independence & Wealth Building',
    category: 'Finance',
    author: 'Zainab Bello',
    authorTitle: 'Wealth Educator & Financial Coach',
    readTime: '6 min read',
    summary: 'A step-by-step roadmap to eliminating money stress, building an emergency cushion, and investing early with confidence.',
    keyTakeaways: [
      'Automate at least 10–20% of your earnings straight into high-yield savings.',
      'Distinguish between appreciative assets and lifestyle inflation.',
      'Protect your peace: understand emergency funds as your personal sovereignty safety net.'
    ],
    content: `Financial independence is not just about numbers on a bank screen—it is about having the freedom to choose your own path, set healthy boundaries, and pursue your dreams without fear.

1. Build Your Cushion First
Before worrying about complex investments, secure your foundation with 3 to 6 months of living expenses stored in an accessible, low-risk account. This single step eliminates 80% of day-to-day anxiety.

2. Track Mindfully, Not Restrictively
Budgeting is telling your money where to go instead of wondering where it went. Use the 50/30/20 framework:
• 50% for core necessities (housing, food, healthcare, transportation)
• 30% for joyful living (hobbies, outings, personal development)
• 20% dedicated to your future self (debt payoff, investing, emergency fund)

3. Start Small with Micro-Investing
Time in the market beats timing the market. Even setting aside modest amounts consistently into index funds or diversified portfolios compounds exponentially over decades.`
  },
  {
    id: 'art-cycle-syncing-guide',
    title: 'Cycle Syncing 101: Aligning Work, Energy, and Nutrition with Your Body',
    category: 'Wellness',
    author: 'Chidinma Okafor',
    authorTitle: 'Holistic Health & Reproductive Wellness Specialist',
    readTime: '7 min read',
    summary: 'Learn how understanding your biological rhythm unlocks sustainable energy, mood balance, and emotional resilience.',
    keyTakeaways: [
      'Menstruation is your inner winter: prioritize rest, warm foods, and reflection.',
      'The follicular phase is your creative spring: ideal for starting new projects and planning.',
      'Ovulation represents peak communication: great for interviews and social presentations.'
    ],
    content: `For decades, traditional workplace schedules were modeled after a 24-hour male hormonal cycle. Women, however, experience an infradian rhythm—a 28-day cycle with distinct neurological and physiological shifts.

Phase 1: Menstrual (Days 1–5)
Hormone levels are at their lowest baseline. Treat this time with reverence. Sip warm herbal teas, indulge in gentle yin yoga or slow walks, and journal your goals.

Phase 2: Follicular (Days 6–12)
Estrogen begins its gradual climb, sparking mental sharpness and curiosity. Brain chemistry fosters neuroplasticity—this is the prime time to learn coding, enroll in new courses, or brainstorm strategies.

Phase 3: Ovulatory (Days 13–16)
Estrogen and testosterone crest. Verbal acuity, confidence, and charisma are at their peak. Schedule key presentations, negotiate offers, and connect actively in the community.

Phase 4: Luteal (Days 17–28)
Progesterone rises, promoting attention to detail and nest-building focus. Wrap up loose ends, organize your finances, and prioritize complex carbohydrates and magnesium to ease PMS symptoms.`
  },
  {
    id: 'art-imposter-syndrome-breakthrough',
    title: 'Dismantling Imposter Syndrome: Owning Your Seat at the Table',
    category: 'Career',
    author: 'Fatima Al-Hassan',
    authorTitle: 'Engineering Mentor & Executive Coach',
    readTime: '5 min read',
    summary: 'Practical mental shifts to reframe self-doubt, celebrate achievements, and navigate competitive spaces with dignity.',
    keyTakeaways: [
      'Imposter feelings usually mean you are challenging yourself and growing, not that you are unqualified.',
      'Maintain a "Brag Sheet" or victory log to review tangible facts whenever doubt strikes.',
      'Replace "Do I belong here?" with "What unique perspective do I bring here?"'
    ],
    content: `If you have ever sat in a classroom, boardroom, or tech sprint feeling like someone will suddenly discover you do not belong, take heart: you are experiencing a common phenomenon shared by millions of accomplished women.

1. Fact Check Your Negative Self-Talk
Feelings are real, but they are not always facts. When your inner critic whispers, "You just got lucky," immediately counter with tangible evidence: "I prepared for 20 hours, passed the evaluations, and earned this opportunity."

2. Build Your Sisterhood Advisory Council
Isolation amplifies doubt. Share your thoughts with mentors or peer sisters on HerAura. When you hear inspiring leaders admit to the same insecurities, the illusion of inadequacy dissolves.

3. Redefine Success as Mastery, Not Perfection
Perfectionism is fear wearing a mask. Strive instead for iterative progress. Every error is simply diagnostic data to help you refine your craft.`
  },
  {
    id: 'art-coding-future-proofing',
    title: 'Why Every Young Woman Should Learn the Foundations of Code & AI',
    category: 'Tech',
    author: 'Rita Okam & Nora Godwin',
    authorTitle: 'Co-Founders of HerAura | Tech Innovators',
    readTime: '8 min read',
    summary: 'Demystifying technology and showing how young women can shift from passive consumers to creative architects of the digital world.',
    keyTakeaways: [
      'Coding is not just for math prodigies—it is a creative language of logic and empathy.',
      'Technology shapes every industry: healthcare, climate, arts, education, and finance.',
      'Diverse voices in AI are essential to eliminate bias and build equitable futures.'
    ],
    content: `When you learn to code, you are not just memorizing syntax; you are learning how to break large, intimidating problems down into small, solvable steps.

Why Women in Tech Matter Now More Than Ever:
Artificial intelligence algorithms and digital platforms govern how resources are allocated, how credit is approved, and how education is delivered. If the teams building these algorithms lack diverse women, the resulting systems will replicate historic biases.

Getting Started Without Fear:
1. Start with the visual web: HTML structure and CSS styling give you immediate visual feedback.
2. Add interactive logic: JavaScript empowers buttons, animations, and live data.
3. Embrace the debugger: Errors are not personal failures; they are riddles waiting to be solved.

You belong in tech, and your unique perspective is urgently needed.`
  }
];

export const courseContentService = {
  fetchEducationalVideos: async (category?: string, query?: string): Promise<EducationalVideo[]> => {
    let list = [...EDUCATIONAL_VIDEOS];
    if (category && category !== 'All') {
      list = list.filter((v) => v.category.toLowerCase() === category.toLowerCase());
    }
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.channelTitle.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q)
      );
    }
    return list;
  },

  getEducationalArticles: (category?: string): EducationalArticle[] => {
    let list = [...EDUCATIONAL_ARTICLES];
    if (category && category !== 'All') {
      list = list.filter((a) => a.category.toLowerCase() === category.toLowerCase());
    }
    return list;
  }
};
