import { Mentor, Course, CommunityPost, UserProfile, InAppNotification, DailyMoodEnergyLog } from '../types';

export const FOUNDERS = [
  {
    name: 'Nora Godwin Teneke',
    title: 'Co-Founder & Tech Educator',
    image: '/src/assets/images/founder_nora_teneke_1789946025497.jpg',
    bio: [
      'Nora Godwin is a technology enthusiast with a background in Computer Science (BSc) and Information Technology (MSc). She is passionate about using digital tools to enhance learning, promote sustainability, and empower young people in her community.',
      "Nora's interests lie at the intersection of education, technology, and social impact — particularly in creating AI-powered and data-driven solutions aligned with the UN Sustainable Development Goals."
    ]
  },
  {
    name: 'Rita Okam',
    title: 'Co-Founder & Software Engineer',
    image: '/src/assets/images/founder_rita_okam_1789946036039.jpg',
    bio: [
      'Rita Okam is a tech-savvy innovator with a great background in software development. She is interested in areas such as fintech, web development, and automation, and is passionate about leveraging technology to drive impact and empowerment in her community.',
      'She is passionate about using her skills to create meaningful solutions, empower others (females) through tech education, and contribute to sustainable development across Africa.'
    ]
  }
];

export const INITIAL_MENTORS: Mentor[] = [
  {
    id: 'pelumi-oyetade',
    name: 'Pelumi Oyetade',
    title: 'Public Speaking Mentor',
    topic: 'Communication skills',
    category: 'Communication',
    statusBadge: 'external',
    bio: 'Pelumi Oyetade is a public speaking mentor who helps women overcome fear and develop confidence in communication and presentation. She has trained individuals in speaking, storytelling, and audience engagement. She believes communication is a powerful leadership tool and teaches women how to express themselves clearly and confidently. Her mission is to help women find their voice and use it boldly.',
    helpsWith: [
      'Personal growth & confidence building',
      'Career guidance in Communication skills',
      'Emotional support & mentorship',
      'Skill development and clarity'
    ],
    email: 'pelumi@email.com',
    mentorFocus: 'Communication skills',
    mentorshipStyle: 'Supportive • Calm • Practical • Empowering',
    image: '/src/assets/images/pelumi_avatar_1790328079988.jpg',
    websiteUrl: 'https://pelumioyetade.com',
    rating: 4.9,
    reviewsCount: 38,
    connected: false,
    expertise: ['Public Speaking', 'Communication', 'Storytelling', 'Confidence Building']
  },
  {
    id: 'favour-oshiokenoya',
    name: 'Favour Oshiokenoya',
    title: 'Business Consultant',
    topic: 'Entrepreneurship',
    category: 'Career',
    statusBadge: 'external',
    bio: 'Favour Oshiokenoya is a business consultant and entrepreneur who has supported dozens of small businesses in building sustainable strategies, financial modeling, and customer acquisition systems.',
    helpsWith: [
      'Business strategy & startup fundamentals',
      'Financial modeling & pitch prep',
      'Market research and validation',
      'Brand positioning & sales'
    ],
    email: 'favour@email.com',
    mentorFocus: 'Entrepreneurship & Small Business',
    mentorshipStyle: 'Strategic • Results-Driven • Insightful',
    image: '/src/assets/images/favour_avatar_1790328103278.jpg',
    websiteUrl: 'https://favouroshiokenoya.com',
    rating: 4.9,
    reviewsCount: 29,
    connected: false,
    expertise: ['Business Consulting', 'Entrepreneurship', 'Market Validation', 'Growth Strategy']
  },
  {
    id: 'keshinro-oluwafemi',
    name: 'Keshinro Oluwafemi',
    title: 'Business Consultant',
    topic: 'Entrepreneurship',
    category: 'Career',
    statusBadge: 'external',
    bio: 'Keshinro Oluwafemi is a business consultant and entrepreneur who has supported dozens of small businesses in operational scaling, process optimization, and leadership development.',
    helpsWith: [
      'Operations planning & scaling',
      'Early-stage enterprise advisory',
      'Leadership & team building',
      'Venture growth roadmaps'
    ],
    email: 'keshinro@email.com',
    mentorFocus: 'Business Strategy & Operations',
    mentorshipStyle: 'Hands-on • Inspiring • Structured',
    image: '/src/assets/images/keshinro_avatar_1790328121603.jpg',
    websiteUrl: 'https://keshinrooluwafemi.com',
    rating: 4.8,
    reviewsCount: 31,
    connected: false,
    expertise: ['Operations Strategy', 'Business Growth', 'Team Leadership', 'Venture Scaling']
  },
  {
    id: 'precious-gift-osondu',
    name: 'Precious Gift Osondu',
    title: 'Financial Literacy Mentor',
    topic: 'Finance',
    category: 'Finance',
    statusBadge: 'heraura',
    bio: 'Precious Gift Osondu is a financial literacy mentor who helps young women understand money management, budgeting, saving habits, and foundational wealth building without stress or anxiety.',
    helpsWith: [
      'Budgeting & emergency savings creation',
      'Student grants & scholarship navigation',
      'Debt-free financial planning',
      'Personal finance habits & discipline'
    ],
    email: 'precious@email.com',
    mentorFocus: 'Personal Finance & Wealth Habits',
    mentorshipStyle: 'Encouraging • Accessible • Practical',
    image: '/src/assets/images/precious_avatar_1790328137569.jpg',
    websiteUrl: 'https://preciousosondu.com',
    rating: 5.0,
    reviewsCount: 44,
    connected: false,
    expertise: ['Financial Literacy', 'Budgeting', 'Youth Wealth', 'Money Management']
  },
  {
    id: 'ayooluwa-omodunbi',
    name: 'Ayooluwa Omodunbi',
    title: 'SDG and Climate Advocate',
    topic: 'Public Speaking Mentor',
    category: 'Leadership',
    statusBadge: 'external',
    bio: 'Ayooluwa Omodunbi is a content strategist who helps women build strong personal brands through storytelling, social media advocacy, and impactful public speaking for sustainability.',
    helpsWith: [
      'Storytelling for climate & social impact',
      'Public speaking & advocacy presentations',
      'Personal branding on social media',
      'Youth-led community campaigns'
    ],
    email: 'ayooluwa@email.com',
    mentorFocus: 'SDGs & Impact Storytelling',
    mentorshipStyle: 'Passionate • Direct • Transformative',
    image: '/src/assets/images/ayooluwa_avatar_1790328152476.jpg',
    websiteUrl: 'https://ayooluwaomodunbi.org',
    rating: 4.9,
    reviewsCount: 35,
    connected: false,
    expertise: ['Climate Advocacy', 'Storytelling', 'Public Speaking', 'Campaign Strategy']
  },
  {
    id: 'mosunmola-akinsola',
    name: 'Mosunmola Akinsola',
    title: 'Relationship counselor',
    topic: 'Public Speaking Mentor',
    category: 'Wellness',
    statusBadge: 'external',
    bio: 'Mosunmola Akinsola is a creative relationship counselor who helps women express ideas visually through branding, emotional clarity, healthy communication, and personal boundaries.',
    helpsWith: [
      'Emotional wellness & boundary-setting',
      'Relational communication & active listening',
      'Self-worth in interpersonal relationships',
      'Conflict navigation with grace'
    ],
    email: 'mosunmola@email.com',
    mentorFocus: 'Emotional & Relational Growth',
    mentorshipStyle: 'Empathetic • Gentle • Safe',
    image: '/src/assets/images/mosunmola_avatar_1790328165319.jpg',
    websiteUrl: 'https://mosunmolaakinsola.com',
    rating: 5.0,
    reviewsCount: 39,
    connected: false,
    expertise: ['Relationship Guidance', 'Emotional Wellness', 'Active Listening', 'Boundaries']
  },
  {
    id: 'nora-godwin',
    name: 'Nora Godwin Teneke',
    title: 'AI & Educational Tech Leader | Co-Founder',
    topic: 'Tech & STEM Leadership',
    category: 'Tech',
    statusBadge: 'heraura',
    bio: 'Computer scientist and IT educator passionate about AI for social impact, STEM mentorship, and guiding girls through tech pathways.',
    helpsWith: [
      'Artificial intelligence fundamentals & ethics',
      'Higher education & graduate school applications',
      'Tech project portfolios & research',
      'Overcoming imposter syndrome in tech'
    ],
    email: 'nora@heraura.org',
    mentorFocus: 'AI & Data Science Education',
    mentorshipStyle: 'Empowering • Rigorous • Visionary',
    expertise: ['Artificial Intelligence', 'Data Science', 'EdTech', 'Higher Education Guidance'],
    image: '/src/assets/images/founder_nora_teneke_1789946025497.jpg',
    websiteUrl: 'https://heraura.org/team/nora',
    rating: 4.9,
    reviewsCount: 38,
    connected: false
  },
  {
    id: 'rita-okam',
    name: 'Rita Okam',
    title: 'Software Engineer & Tech Innovator | Co-Founder',
    topic: 'Software Development & Fintech',
    category: 'Tech',
    statusBadge: 'heraura',
    bio: 'Fintech and software developer dedicated to closing the digital gender divide through hands-on coding mentorship and technical confidence.',
    helpsWith: [
      'Full-stack web & mobile development',
      'Fintech architecture & automation',
      'Code reviews and interview preparation',
      'Career transitions into technology'
    ],
    email: 'rita@heraura.org',
    mentorFocus: 'Software Engineering & Fintech',
    mentorshipStyle: 'Practical • Supportive • Collaborative',
    expertise: ['Web Development', 'Fintech', 'Automation', 'Career Switching'],
    image: '/src/assets/images/founder_rita_okam_1789946036039.jpg',
    websiteUrl: 'https://heraura.org/team/rita',
    rating: 5.0,
    reviewsCount: 44,
    connected: false
  },
  {
    id: 'fatima-al-hassan',
    name: 'Fatima Al-Hassan',
    title: 'Senior Engineering Mentor & Leader',
    topic: 'Engineering Leadership',
    category: 'Career',
    statusBadge: 'heraura',
    bio: 'Senior software engineer with 8+ years building enterprise systems. Dedicated to mentoring young girls to become tech creators and leaders.',
    helpsWith: [
      'System design & enterprise engineering',
      'Technical leadership and promotion tracks',
      'Effective communication with engineering teams',
      'Salary negotiation & executive presence'
    ],
    email: 'fatima@heraura.org',
    mentorFocus: 'Technical Leadership & Career Growth',
    mentorshipStyle: 'Direct • Strategic • Inspiring',
    expertise: ['Full-Stack Engineering', 'Leadership', 'Resume Reviews', 'Interview Prep'],
    image: '/src/assets/images/mentor_fatima_lead_1789946058858.jpg',
    websiteUrl: 'https://heraura.org/mentors/fatima',
    rating: 4.9,
    reviewsCount: 29,
    connected: false
  },
  {
    id: 'chidinma-okafor',
    name: 'Chidinma Okafor',
    title: 'Certified Holistic Health & Cycle Coach',
    topic: 'Feminine Wellness & Hormonal Health',
    category: 'Wellness',
    statusBadge: 'heraura',
    bio: 'Guiding adolescent and young adult women through body literacy, menstrual cycle self-care, nutrition, and peaceful stress regulation.',
    helpsWith: [
      'Menstrual cycle literacy & symptom tracking',
      'Holistic nutrition and natural remedies',
      'Stress regulation & nervous system balance',
      'Mindful movement & body acceptance'
    ],
    email: 'chidinma@heraura.org',
    mentorFocus: 'Feminine Wellness & Hormonal Balance',
    mentorshipStyle: 'Compassionate • Gentle • Knowledgeable',
    expertise: ['Feminine Wellness', 'Hormonal Health', 'Mindful Nutrition', 'Stress Relief'],
    image: '/src/assets/images/mentor_chidinma_health_1789946068785.jpg',
    websiteUrl: 'https://heraura.org/mentors/chidinma',
    rating: 5.0,
    reviewsCount: 52,
    connected: true
  },
  {
    id: 'zainab-bello',
    name: 'Zainab Bello',
    title: 'Financial Literacy & Youth Wealth Coach',
    topic: 'Youth Wealth & Personal Finance',
    category: 'Finance',
    statusBadge: 'heraura',
    bio: 'Educator and financial coach teaching young women foundational money management, investing basics, and entrepreneurial independence.',
    helpsWith: [
      'Budgeting for students and early career',
      'Saving plans & emergency fund setup',
      'Student scholarships & grant applications',
      'Overcoming financial stress and building autonomy'
    ],
    email: 'zainab@heraura.org',
    mentorFocus: 'Financial Literacy & Independence',
    mentorshipStyle: 'Actionable • Warm • Patient',
    expertise: ['Budgeting', 'Saving Plans', 'Student Grants', 'Negotiation Skills'],
    image: '/src/assets/images/founder_nora_teneke_1789946025497.jpg',
    websiteUrl: 'https://heraura.org/mentors/zainab',
    rating: 4.8,
    reviewsCount: 21,
    connected: false
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'confidence-101',
    title: 'Building Self-Confidence & Inner Strength',
    category: 'Career',
    tags: ['Confidence', 'Leadership', 'Mindset', 'Communication'],
    instructor: 'Fatima Al-Hassan',
    instructorTitle: 'Leadership & Engineering Coach',
    instructorAvatar: '/src/assets/images/mentor_fatima_lead_1789946058858.jpg',
    duration: '4 modules • 1h 45m',
    rating: 4.9,
    enrolledCount: 312,
    difficulty: 'Beginner',
    sourceProvider: 'TED-Ed & Harvard Business Review',
    coverImage: '/src/assets/images/her_aura_girls_group_1789946014663.jpg',
    description: 'Learn proven techniques to dismantle imposter syndrome, speak with authority in any room, and honor your authentic voice with unapologetic grace.',
    learningObjectives: [
      'Overcome imposter feelings and automatic negative thoughts',
      'Master assertive communication techniques without apologetic hedging',
      'Establish firm, healthy personal and academic boundaries',
      'Build a sustainable 5-minute morning confidence ritual'
    ],
    theoreticalOverview: 'Self-confidence is not an innate trait reserved for a chosen few; it is a psychological muscle developed through self-compassion, cognitive reframing, and incremental courage. This course introduces the core pillars of psychological safety, vocal boundary-setting, and positive neuroplasticity.',
    modules: [
      {
        id: 'c1',
        title: 'Understanding the Roots of Self-Doubt',
        duration: '18 min',
        completed: false,
        videoTitle: 'Overcoming Imposter Thoughts (TED-Ed)',
        videoEmbedId: 'M5p3_lG69xY',
        videoUrl: 'https://www.youtube.com/embed/M5p3_lG69xY',
        summary: 'Explore why young women disproportionately experience imposter feelings and learn the difference between internal capability and societal conditioning.',
        keyTakeaways: [
          'Recognize automatic negative thoughts (ANTs)',
          'Separate objective skills from temporary emotion',
          'Build your personal "Wins Inventory"'
        ]
      },
      {
        id: 'c2',
        title: 'Assertive Communication & Vocal Presence',
        duration: '24 min',
        completed: false,
        videoTitle: 'Vocal Boundaries and Confident Posture',
        videoEmbedId: 'r4vFst8r8tU',
        videoUrl: 'https://www.youtube.com/embed/r4vFst8r8tU',
        summary: 'How to express disagreement gracefully, eliminate unnecessary apologetic qualifiers, and claim your physical and vocal space.',
        keyTakeaways: [
          'Replace "I am sorry, but..." with decisive phrasing',
          'Utilize intentional pausing instead of filler words',
          'Practice open, grounding body posture'
        ]
      },
      {
        id: 'c3',
        title: 'Setting Healthy Boundaries without Guilt',
        duration: '22 min',
        completed: false,
        videoTitle: 'The Art of Saying No with Kindness',
        videoEmbedId: '5U3OftHD8ps',
        videoUrl: 'https://www.youtube.com/embed/5U3OftHD8ps',
        summary: 'Learn why boundaries are an act of self-care and respect, both in personal friendships and school/work relationships.',
        keyTakeaways: [
          'Define the 3 boundary zones: rigid, porous, and healthy',
          'Practice gentle confrontation scripts',
          'Protect your energy and time reserves'
        ]
      },
      {
        id: 'c4',
        title: 'Your Daily Confidence Ritual',
        duration: '15 min',
        completed: false,
        videoTitle: 'Sustainable Daily Empowerment Habits',
        videoEmbedId: 'iCvmsMzlF7o',
        videoUrl: 'https://www.youtube.com/embed/iCvmsMzlF7o',
        summary: 'Synthesizing your learnings into a 5-minute morning affirmation and reflection routine that sustains your aura throughout each week.',
        keyTakeaways: [
          'Mirror affirmation principles that actually work',
          'Habit-stacking reflection with your morning routine'
        ]
      }
    ]
  },
  {
    id: 'financial-literacy-101',
    title: 'Financial Literacy for Young Women',
    category: 'Finance',
    tags: ['Finance', 'Budgeting', 'Investing', 'Wealth', 'Independence'],
    instructor: 'Zainab Bello',
    instructorTitle: 'Financial Coach & Youth Wealth Strategist',
    instructorAvatar: '/src/assets/images/founder_nora_teneke_1789946025497.jpg',
    duration: '3 modules • 1h 15m',
    rating: 4.8,
    enrolledCount: 245,
    difficulty: 'Beginner',
    sourceProvider: 'PBS Two Cents & Khan Academy',
    coverImage: '/src/assets/images/onboarding_sisterhood_art_1789946046955.jpg',
    description: 'Master budgeting, understand credit vs debt, and create a resilient personal emergency fund to secure your independence.',
    learningObjectives: [
      'Construct a realistic 50/30/20 monthly budget',
      'Calculate and fund a 3-month personal safety emergency buffer',
      'Understand how compound interest turns small savings into long-term wealth'
    ],
    theoreticalOverview: 'Financial literacy is the greatest enabler of personal autonomy. This curriculum breaks down the 50/30/20 rule, smart banking habits, and the compound growth mindset that allows every young woman to chart a self-determined future.',
    modules: [
      {
        id: 'f1',
        title: 'Money Mindset & The 50/30/20 Framework',
        duration: '20 min',
        completed: false,
        videoTitle: 'Budgeting Simplified for Beginners (PBS Two Cents)',
        videoEmbedId: 'HQzoZfc3GwQ',
        videoUrl: 'https://www.youtube.com/embed/HQzoZfc3GwQ',
        summary: 'Deconstruct spending habits into Needs, Wants, and Future Goals with actionable tracking templates.',
        keyTakeaways: [
          'Differentiate real needs from impulse spending',
          'How to set up automated micro-savings',
          'Tracking your monthly cash flow with ease'
        ]
      },
      {
        id: 'f2',
        title: 'Emergency Funds & Debt Safety',
        duration: '25 min',
        completed: false,
        videoTitle: 'Building Your Financial Cushion (Khan Academy)',
        videoEmbedId: 'b_fLhUf3q0k',
        videoUrl: 'https://www.youtube.com/embed/b_fLhUf3q0k',
        summary: 'Why every woman needs a private safety buffer and how to avoid high-interest predatory borrowing.',
        keyTakeaways: [
          'Calculating your 3-month survival fund',
          'High yield savings vs standard accounts'
        ]
      },
      {
        id: 'f3',
        title: 'Introduction to Investing & Compound Growth',
        duration: '30 min',
        completed: false,
        videoTitle: 'Demystifying Stocks, Index Funds & Inflation',
        videoEmbedId: 'gFQNPmLq-Tg',
        videoUrl: 'https://www.youtube.com/embed/gFQNPmLq-Tg',
        summary: 'Understand the difference between saving and investing, how compound interest multiplies small contributions, and how inflation affects your purchasing power.',
        keyTakeaways: [
          'The Rule of 72 and exponential growth',
          'Diversification with low-cost index funds',
          'Starting early with modest regular contributions'
        ]
      }
    ]
  },
  {
    id: 'digital-skills-tech',
    title: 'Digital Skills & Intro to Web Development',
    category: 'Tech',
    tags: ['Tech', 'Coding', 'WebDevelopment', 'JavaScript', 'HTML', 'CSS'],
    instructor: 'Rita Okam',
    instructorTitle: 'Software Engineer & Tech Innovator | Co-Founder',
    instructorAvatar: '/src/assets/images/founder_rita_okam_1789946036039.jpg',
    duration: '3 modules • 1h 40m',
    rating: 5.0,
    enrolledCount: 480,
    difficulty: 'Beginner',
    sourceProvider: 'CrashCourse & freeCodeCamp',
    coverImage: '/src/assets/images/her_aura_girls_group_1789946014663.jpg',
    description: 'Step into tech with confidence. Learn how the web works, write your first lines of HTML/CSS/JavaScript, and explore tech career paths.',
    learningObjectives: [
      'Understand clients, servers, domains, and web architecture',
      'Create and style modern responsive mobile-first web pages',
      'Write interactive JavaScript functions that respond to user actions'
    ],
    theoreticalOverview: 'Technology powers our world, yet women remain underrepresented in engineering. This course demystifies digital technologies through hands-on project creation, fostering computational problem-solving and algorithmic thinking.',
    modules: [
      {
        id: 't1',
        title: 'How the Internet Works & Web Foundations',
        duration: '25 min',
        completed: false,
        videoTitle: 'Deconstructing Web Architecture (CrashCourse)',
        videoEmbedId: '7_LPdttKXPc',
        videoUrl: 'https://www.youtube.com/embed/7_LPdttKXPc',
        summary: 'Understand clients, servers, domains, and the building blocks of modern web applications.',
        keyTakeaways: [
          'Browser rendering lifecycle',
          'HTML semantics for accessibility'
        ]
      },
      {
        id: 't2',
        title: 'Styling Beautiful Interfaces with CSS',
        duration: '35 min',
        completed: false,
        videoTitle: 'Colors, Spacing & Responsive Design (freeCodeCamp)',
        videoEmbedId: '1PnVor36_40',
        videoUrl: 'https://www.youtube.com/embed/1PnVor36_40',
        summary: 'Learn how to transform plain text into a vibrant, aesthetic web page matching modern mobile and desktop standards.',
        keyTakeaways: [
          'Flexbox and Grid layout essentials',
          'Mobile-first responsive media queries'
        ]
      },
      {
        id: 't3',
        title: 'JavaScript Essentials for Interactive Web Pages',
        duration: '40 min',
        completed: false,
        videoTitle: 'Variables, Functions & Event Listeners',
        videoEmbedId: 'W6NZfCO5SIk',
        videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
        summary: 'Bring your webpages to life! Learn how code responds to user clicks, keyboard inputs, and dynamic calculations.',
        keyTakeaways: [
          'Declaring stateful variables with const and let',
          'Writing modular reusable functions',
          'Updating the DOM based on user actions'
        ]
      }
    ]
  },
  {
    id: 'feminine-wellness-cycle',
    title: 'Feminine Wellness & Hormonal Harmony',
    category: 'Wellness',
    tags: ['Wellness', 'CycleSyncing', 'Hormones', 'Health', 'SelfCare'],
    instructor: 'Chidinma Okafor',
    instructorTitle: 'Certified Holistic Health & Cycle Coach',
    instructorAvatar: '/src/assets/images/mentor_chidinma_health_1789946068785.jpg',
    duration: '2 modules • 45m',
    rating: 5.0,
    enrolledCount: 390,
    difficulty: 'All Levels',
    sourceProvider: 'TED-Ed & Women Health Institute',
    coverImage: '/src/assets/images/hero_woman_wellness_1789946004145.jpg',
    description: 'Understand the four phases of your menstrual cycle, support your body with nutrition and hydration, and track your cycle naturally.',
    learningObjectives: [
      'Recognize biological changes across menstrual, follicular, ovulatory, and luteal phases',
      'Apply natural comfort remedies for menstrual cramps and fatigue',
      'Align academic and exercise routines with your cycle'
    ],
    theoreticalOverview: 'Our bodies operate on a rhythmic infradian cycle influencing energy levels, metabolism, and mood. Gaining body literacy transforms your cycle from a mystery or inconvenience into a predictable compass for wellness.',
    modules: [
      {
        id: 'w1',
        title: 'The Four Phases of Your Menstrual Cycle',
        duration: '22 min',
        completed: false,
        videoTitle: 'Menstrual, Follicular, Ovulatory & Luteal Phases (TED-Ed)',
        videoEmbedId: 'ayzN5zkJU74',
        videoUrl: 'https://www.youtube.com/embed/ayzN5zkJU74',
        summary: 'A clear, scientific overview of estrogen and progesterone fluctuations across each month.',
        keyTakeaways: [
          'Identifying the physiological shifts across phases',
          'Cycle syncing for school and study planning'
        ]
      },
      {
        id: 'w2',
        title: 'Natural Comfort for Menstrual Cramps & Fatigue',
        duration: '20 min',
        completed: false,
        videoTitle: 'Nutrition, Gentle Movement & Self-Care',
        videoEmbedId: '2mIOJ5Y29q0',
        videoUrl: 'https://www.youtube.com/embed/2mIOJ5Y29q0',
        summary: 'Gentle stretching, anti-inflammatory hydration, magnesium-rich foods, and warming remedies.',
        keyTakeaways: [
          'Herbal teas and mineral replenishment',
          'Restorative yoga poses that relieve uterine pressure'
        ]
      }
    ]
  },
  {
    id: 'public-speaking-confidence',
    title: 'Public Speaking & Vocal Storytelling',
    category: 'Leadership',
    tags: ['Leadership', 'PublicSpeaking', 'Storytelling', 'Communication'],
    instructor: 'Pelumi Oyetade',
    instructorTitle: 'Public Speaking Mentor & Communication Coach',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    duration: '2 modules • 55m',
    rating: 4.9,
    enrolledCount: 360,
    difficulty: 'Intermediate',
    sourceProvider: 'TED & Toastmasters International',
    coverImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600',
    description: 'Transform public speaking anxiety into authentic stage presence. Master storytelling structures, diaphragmatic breathing, and audience connection.',
    learningObjectives: [
      'Activate parasympathetic calming responses before stepping on stage',
      'Construct high-impact 3-act narrative presentations',
      'Use vocal variety, pitch, and intentional pauses'
    ],
    theoreticalOverview: 'Communication is the bridge between internal vision and external impact. Pelumi guides students through physical grounding exercises, narrative arc construction, and delivering speeches with conviction.',
    modules: [
      {
        id: 'ps1',
        title: 'Overcoming Stage Fright with Somatic Grounding',
        duration: '25 min',
        completed: false,
        videoTitle: 'Breathing Techniques for Vocal Stability',
        videoEmbedId: 'tShavGuo0_E',
        videoUrl: 'https://www.youtube.com/embed/tShavGuo0_E',
        summary: 'Learn how the sympathetic nervous system reacts to an audience and how to activate your parasympathetic calming response in under 60 seconds.',
        keyTakeaways: [
          'Box breathing before stepping up to speak',
          'Converting nervous adrenaline into enthusiastic energy',
          'The Power of the 3-second opening silence'
        ]
      },
      {
        id: 'ps2',
        title: 'Crafting Your 3-Act Narrative Arc',
        duration: '30 min',
        completed: false,
        videoTitle: 'Hook, Conflict, and Empowering Resolution',
        videoEmbedId: 'YbV3b-l1sZs',
        videoUrl: 'https://www.youtube.com/embed/YbV3b-l1sZs',
        summary: 'Structure any presentation—from a classroom project to an advocacy pitch—so listeners remember your core message.',
        keyTakeaways: [
          'Start with an unforgettable sensory hook',
          'Maintain suspense with relatable stakes',
          'Deliver an inspiring call-to-action'
        ]
      }
    ]
  },
  {
    id: 'career-readiness-2026',
    title: 'Career Development & Employability Skills',
    category: 'Career',
    tags: ['Career', 'Employability', 'Resume', 'Networking', 'Interviews'],
    instructor: 'Fatima Al-Hassan',
    instructorTitle: 'Senior Tech Lead & Engineering Mentor',
    instructorAvatar: '/src/assets/images/mentor_fatima_lead_1789946058858.jpg',
    duration: '2 modules • 50m',
    rating: 4.9,
    enrolledCount: 275,
    difficulty: 'All Levels',
    sourceProvider: 'LinkedIn Learning & HerAura Mentors',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600',
    description: 'Build an interview-winning CV, master behavioral interview questions with the STAR method, and network with female professionals with confidence.',
    learningObjectives: [
      'Write targeted resumes highlighting measurable outcomes and projects',
      'Formulate compelling STAR stories for tough interview scenarios',
      'Craft warm outreach messages to mentors on LinkedIn'
    ],
    theoreticalOverview: 'Employability is not just about credentials; it is the capacity to communicate your unique value proposition, exhibit continuous learning agility, and forge authentic professional alliances.',
    modules: [
      {
        id: 'cr1',
        title: 'Crafting a Standout Resume & LinkedIn Profile',
        duration: '25 min',
        completed: false,
        videoTitle: 'Resume Optimization & Modern Personal Branding',
        videoEmbedId: 'y8YH0QwBu8g',
        videoUrl: 'https://www.youtube.com/embed/y8YH0QwBu8g',
        summary: 'Learn what hiring managers and scholarship committees look for in candidate profiles and how to showcase real achievements.',
        keyTakeaways: [
          'Action verbs + context + measurable result formula',
          'Optimizing your LinkedIn headline and about section',
          'Highlighting community projects and transferable skills'
        ]
      },
      {
        id: 'cr2',
        title: 'Acing Interviews with the STAR Framework',
        duration: '25 min',
        completed: false,
        videoTitle: 'Situation, Task, Action, Result Mastery',
        videoEmbedId: 'uG363gmJtJ4',
        videoUrl: 'https://www.youtube.com/embed/uG363gmJtJ4',
        summary: 'Transform nervous interview answers into structured, confident stories that demonstrate problem-solving and emotional maturity.',
        keyTakeaways: [
          'Breaking questions into Situation, Task, Action, Result',
          'Preparing your top 5 adaptable career stories',
          'Asking strategic questions at the end of an interview'
        ]
      }
    ]
  },
  {
    id: 'ai-education-empowerment',
    title: 'AI & Digital Tools for Women’s Empowerment',
    category: 'Tech',
    tags: ['Tech', 'ArtificialIntelligence', 'Education', 'SocialImpact', 'SDGs'],
    instructor: 'Nora Godwin Teneke',
    instructorTitle: 'AI & Educational Tech Leader | Co-Founder',
    instructorAvatar: '/src/assets/images/founder_nora_teneke_1789946025497.jpg',
    duration: '2 modules • 45m',
    rating: 4.9,
    enrolledCount: 340,
    difficulty: 'Beginner',
    sourceProvider: 'UNESCO & Stanford Online',
    coverImage: '/src/assets/images/founder_nora_teneke_1789946025497.jpg',
    description: 'Explore how Artificial Intelligence works, its ethical applications in girl-child education, and how women are steering AI toward UN Sustainable Development Goals.',
    learningObjectives: [
      'Understand how machine learning models learn from data patterns',
      'Identify bias and ethical considerations in automated systems',
      'Leverage modern AI tools to accelerate your study and research habits'
    ],
    theoreticalOverview: 'AI is fundamentally reshaping the future of work and education. Ensuring young women understand AI architectures and participate in technical governance guarantees technology serves humanity equitably.',
    modules: [
      {
        id: 'ai1',
        title: 'Demystifying AI & Machine Learning Basics',
        duration: '20 min',
        completed: false,
        videoTitle: 'How Computers Learn from Data Patterns',
        videoEmbedId: 'JMUxmLyrhSk',
        videoUrl: 'https://www.youtube.com/embed/JMUxmLyrhSk',
        summary: 'A friendly, accessible guide to how neural networks work, what training data means, and why diversity in AI development matters.',
        keyTakeaways: [
          'Supervised vs unsupervised learning simplified',
          'Why female representation matters in dataset creation',
          'Everyday AI examples you already use'
        ]
      },
      {
        id: 'ai2',
        title: 'AI for Good: Solving Global Challenges',
        duration: '25 min',
        completed: false,
        videoTitle: 'Tech for the UN Sustainable Development Goals',
        videoEmbedId: 'zR_nZ8Ukyj4',
        videoUrl: 'https://www.youtube.com/embed/zR_nZ8Ukyj4',
        summary: 'Explore case studies of young African and global female innovators using AI for healthcare access, climate monitoring, and literacy.',
        keyTakeaways: [
          'SDG Goal 4 (Quality Education) and Goal 5 (Gender Equality)',
          'Prompt engineering for academic research and creative projects',
          'Responsible and ethical guidelines for using AI companions'
        ]
      }
    ]
  },
  {
    id: 'emotional-wellbeing-growth',
    title: 'Mindfulness & Emotional Well-Being for Girls',
    category: 'Wellness',
    tags: ['Wellness', 'Mindfulness', 'StressManagement', 'EmotionalHealth'],
    instructor: 'Chidinma Okafor',
    instructorTitle: 'Holistic Health Coach & Mindfulness Practitioner',
    instructorAvatar: '/src/assets/images/mentor_chidinma_health_1789946068785.jpg',
    duration: '2 modules • 40m',
    rating: 5.0,
    enrolledCount: 410,
    difficulty: 'All Levels',
    sourceProvider: 'Mindful Schools & Greater Good Science Center',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
    description: 'Cultivate emotional resilience, manage academic stress, and practice somatic grounding exercises to maintain inner peace.',
    learningObjectives: [
      'Master the 2-minute physiological sigh and box breathing',
      'Develop compassionate internal self-talk during high-pressure weeks',
      'Build a sustainable emotional regulation journal'
    ],
    theoreticalOverview: 'Mindfulness is the practice of intentional, non-judgmental presence. Neuroscience demonstrates that regular mindfulness thickens the prefrontal cortex and reduces reactivity in the amygdala, fostering long-term emotional stability.',
    modules: [
      {
        id: 'ew1',
        title: 'Calming the Nervous System Under Pressure',
        duration: '20 min',
        completed: false,
        videoTitle: 'Somatic Grounding & Breathwork for Anxiety',
        videoEmbedId: 'inpok4MKVLM',
        videoUrl: 'https://www.youtube.com/embed/inpok4MKVLM',
        summary: 'Practical breathing exercises and somatic release techniques you can use during exams or stressful moments.',
        keyTakeaways: [
          'The physiological double inhale and long exhale',
          '5-4-3-2-1 sensory grounding exercise',
          'Releasing tension from the shoulders and jaw'
        ]
      },
      {
        id: 'ew2',
        title: 'Cultivating Self-Compassion & Quiet Reflection',
        duration: '20 min',
        completed: false,
        videoTitle: 'The Power of Mindful Self-Talk (Dr. Kristin Neff)',
        videoEmbedId: 'IvtZBUSplr4',
        videoUrl: 'https://www.youtube.com/embed/IvtZBUSplr4',
        summary: 'How to speak to yourself like you would to your beloved sister, replacing harsh self-criticism with supportive clarity.',
        keyTakeaways: [
          'The three components of self-compassion',
          'Reframing perceived failures as common humanity',
          'Daily evening gratitude journaling'
        ]
      }
    ]
  }
];

export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'p1',
    authorName: 'Amina Yusuf',
    authorAvatar: '/src/assets/images/founder_rita_okam_1789946036039.jpg',
    authorRole: 'Student & Community Member',
    content: "Just completed the first module of 'Building Self-Confidence' on HerAura! 🌸 It was so liberating to realize that imposter feelings aren't proof that I don't belong—they're just a sign I am expanding outside my comfort zone. Big love to everyone pushing through fears today! 💕",
    timestamp: '2 hours ago',
    likes: 24,
    liked: true,
    category: 'For You',
    tags: ['Confidence', 'PersonalGrowth', 'Sisterhood'],
    comments: [
      {
        id: 'c1',
        authorName: 'Zainab Bello',
        authorAvatar: '/src/assets/images/founder_nora_teneke_1789946025497.jpg',
        content: 'So proud of you Amina! Taking that first step takes genuine courage. Keep shining!',
        timestamp: '1 hour ago'
      },
      {
        id: 'c2',
        authorName: 'Blessing Ade',
        authorAvatar: '/src/assets/images/mentor_chidinma_health_1789946068785.jpg',
        content: 'Love this mindset! Bookmarking your words as a reminder for my exam tomorrow.',
        timestamp: '35 mins ago'
      }
    ]
  },
  {
    id: 'p2',
    authorName: 'Khadija Umar',
    authorAvatar: '/src/assets/images/mentor_fatima_lead_1789946058858.jpg',
    authorRole: 'Aspiring Web Developer',
    content: "Connected with mentor Rita Okam yesterday and she reviewed my first web portfolio. She gave such clear, constructive feedback on my CSS layouts. Having a female mentor who truly understands the journey makes all the difference! ✨💻",
    timestamp: '5 hours ago',
    likes: 38,
    liked: false,
    image: '/src/assets/images/her_aura_girls_group_1789946014663.jpg',
    category: 'Trending',
    tags: ['TechMentorship', 'WomenInTech', 'Coding'],
    comments: [
      {
        id: 'c3',
        authorName: 'Rita Okam',
        authorAvatar: '/src/assets/images/founder_rita_okam_1789946036039.jpg',
        content: 'You did phenomenal work Khadija! Remember: clean architecture and passion will open every door. Excited for your next project.',
        timestamp: '4 hours ago'
      }
    ]
  },
  {
    id: 'p3',
    authorName: 'Ngozi Eze',
    authorAvatar: '/src/assets/images/mentor_chidinma_health_1789946068785.jpg',
    authorRole: 'Wellness Advocate',
    content: "Gentle reminder to my sisters today: please remember to drink your water and give your body permission to rest if you are in your luteal or menstrual phase. Your worth is never measured solely by relentless productivity. Rest is productive too. 🍵💖",
    timestamp: 'Yesterday',
    likes: 56,
    liked: true,
    category: 'Latest',
    tags: ['SelfCare', 'MenstrualWellness', 'Mindfulness'],
    comments: [
      {
        id: 'c4',
        authorName: 'Amina Yusuf',
        authorAvatar: '/src/assets/images/founder_rita_okam_1789946036039.jpg',
        content: 'Needed this exact reminder today. Thank you Ngozi!',
        timestamp: 'Yesterday'
      }
    ]
  }
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = INITIAL_POSTS;

export const INITIAL_USER: UserProfile = {
  id: 'user-amina-1',
  name: 'Amina Yusuf',
  email: 'amina.yusuf@example.com',
  avatar: '/src/assets/images/founder_rita_okam_1789946036039.jpg',
  bio: 'Curious learner, tech enthusiast, and advocate for girl-child education. Growing daily in HerAura safe space.',
  postsCount: 13,
  commentsCount: 38,
  followersCount: 235,
  completedCoursesCount: 3,
  interests: ['Technology & Coding', 'Feminine Wellness', 'Leadership', 'Financial Literacy'],
  badges: [
    {
      id: 'b1',
      name: 'Sisterhood Champion',
      icon: '🌸',
      description: 'Active contributor and supportive voice in community discussions.',
      dateEarned: 'Aug 2026'
    },
    {
      id: 'b2',
      name: 'Curious Scholar',
      icon: '📚',
      description: 'Completed 3 full skill modules in the Learn academy.',
      dateEarned: 'Sep 2026'
    },
    {
      id: 'b3',
      name: 'Wellness Seeker',
      icon: '💧',
      description: 'Maintained 7 consecutive days of hydration and mood tracking.',
      dateEarned: 'Sep 2026'
    }
  ]
};

export const ROTATING_WELLBEING_TIPS = [
  'Gentle breath: Inhale calm for 4 counts, hold for 4, and let go with ease.',
  'Your voice matters. Speak your truth with kindness, starting with how you speak to yourself.',
  'Hydration check: Grab a glass of fresh water to nourish your mind and skin.',
  'Rest is not a reward you earn; it is a fundamental need your body deserves.',
  'Celebrate your small wins today. Every step forward is a victory in your journey.',
  'Comparison dims your sparkle. Your path is uniquely yours to walk and bloom.',
  'Reach out to a sister or mentor when things feel heavy. Sisterhood is your superpower.'
];

export const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-1',
    title: 'Predicted Period in 3 Days',
    message: 'Your next menstrual cycle is expected to start on March 29. Remember to stay hydrated and prepare your self-care essentials.',
    timestamp: '10m ago',
    type: 'cycle',
    read: false,
    targetTab: 'wellness'
  },
  {
    id: 'notif-2',
    title: 'Hydration Check-in',
    message: "You've drunk 6 of 8 glasses today. One more glass to reach your afternoon glow goal!",
    timestamp: '45m ago',
    type: 'hydration',
    read: false,
    targetTab: 'wellness'
  },
  {
    id: 'notif-3',
    title: 'Rita Okam commented on your post',
    message: '"So proud of your progress! Clean architecture and passion will open every door."',
    timestamp: '2h ago',
    type: 'community',
    read: false,
    targetTab: 'community'
  },
  {
    id: 'notif-4',
    title: 'New Lesson Available',
    message: 'Building Self-Confidence: Lesson 2 "Assertive Communication & Boundaries" is ready for you.',
    timestamp: 'Yesterday',
    type: 'course',
    read: true,
    targetTab: 'learn'
  },
  {
    id: 'notif-5',
    title: 'Mentor Session Confirmed',
    message: 'Fatima Garba accepted your leadership mentorship request for this Saturday at 3:00 PM.',
    timestamp: '2 days ago',
    type: 'mentor',
    read: true,
    targetTab: 'mentors'
  }
];

// Historical 30-day Mood and Energy telemetry for feminine wellness visualization
export const INITIAL_30_DAY_MOOD_ENERGY: DailyMoodEnergyLog[] = [
  { id: 'me-1', date: '2026-02-20', displayDate: 'Feb 20', timestamp: new Date('2026-02-20').getTime(), moodScore: 6.8, energyScore: 6.2, cyclePhase: 'Luteal', notes: 'Quiet evening reading and chamomile tea', tag: 'Gentle Rest' },
  { id: 'me-2', date: '2026-02-21', displayDate: 'Feb 21', timestamp: new Date('2026-02-21').getTime(), moodScore: 6.5, energyScore: 5.8, cyclePhase: 'Luteal', notes: 'Slight fatigue, early bedtime', tag: 'Restorative Sleep' },
  { id: 'me-3', date: '2026-02-22', displayDate: 'Feb 22', timestamp: new Date('2026-02-22').getTime(), moodScore: 6.0, energyScore: 5.4, cyclePhase: 'Luteal', notes: 'Premenstrual tenderness; warm bath helped', tag: 'Epsom Bath' },
  { id: 'me-4', date: '2026-02-23', displayDate: 'Feb 23', timestamp: new Date('2026-02-23').getTime(), moodScore: 6.2, energyScore: 5.0, cyclePhase: 'Luteal', notes: 'Mindful breathing practice before bed', tag: 'Box Breathing' },
  { id: 'me-5', date: '2026-02-24', displayDate: 'Feb 24', timestamp: new Date('2026-02-24').getTime(), moodScore: 5.8, energyScore: 4.8, cyclePhase: 'Menstrual', notes: 'Period Day 1: Cozy blanket, ginger tea, low exertion', tag: 'Cycle Day 1' },
  { id: 'me-6', date: '2026-02-25', displayDate: 'Feb 25', timestamp: new Date('2026-02-25').getTime(), moodScore: 6.0, energyScore: 5.2, cyclePhase: 'Menstrual', notes: 'Heating pad and chocolate, felt nurtured', tag: 'Self-Compassion' },
  { id: 'me-7', date: '2026-02-26', displayDate: 'Feb 26', timestamp: new Date('2026-02-26').getTime(), moodScore: 6.5, energyScore: 5.9, cyclePhase: 'Menstrual', notes: 'Gentle walk in the cool breeze', tag: 'Nature Walk' },
  { id: 'me-8', date: '2026-02-27', displayDate: 'Feb 27', timestamp: new Date('2026-02-27').getTime(), moodScore: 7.2, energyScore: 6.5, cyclePhase: 'Menstrual', notes: 'Cramps cleared, energy returning nicely', tag: 'Revival' },
  { id: 'me-9', date: '2026-02-28', displayDate: 'Feb 28', timestamp: new Date('2026-02-28').getTime(), moodScore: 7.5, energyScore: 7.0, cyclePhase: 'Menstrual', notes: 'End of bleeding phase; refreshed mindset', tag: 'Clean Slate' },
  { id: 'me-10', date: '2026-03-01', displayDate: 'Mar 01', timestamp: new Date('2026-03-01').getTime(), moodScore: 7.8, energyScore: 7.4, cyclePhase: 'Follicular', notes: 'New month optimism! Cleaned workspace', tag: 'Goal Setting' },
  { id: 'me-11', date: '2026-03-02', displayDate: 'Mar 02', timestamp: new Date('2026-03-02').getTime(), moodScore: 8.0, energyScore: 7.8, cyclePhase: 'Follicular', notes: 'Started UI coding lesson on HerAura', tag: 'STEM Learning' },
  { id: 'me-12', date: '2026-03-03', displayDate: 'Mar 03', timestamp: new Date('2026-03-03').getTime(), moodScore: 8.2, energyScore: 8.0, cyclePhase: 'Follicular', notes: 'High focus and mental clarity all morning', tag: 'Deep Work' },
  { id: 'me-13', date: '2026-03-04', displayDate: 'Mar 04', timestamp: new Date('2026-03-04').getTime(), moodScore: 8.0, energyScore: 8.1, cyclePhase: 'Follicular', notes: 'Hydration goal completed: 8 glasses', tag: 'Hydrated' },
  { id: 'me-14', date: '2026-03-05', displayDate: 'Mar 05', timestamp: new Date('2026-03-05').getTime(), moodScore: 8.4, energyScore: 8.5, cyclePhase: 'Follicular', notes: 'Morning yoga session with energizing flow', tag: 'Morning Yoga' },
  { id: 'me-15', date: '2026-03-06', displayDate: 'Mar 06', timestamp: new Date('2026-03-06').getTime(), moodScore: 8.6, energyScore: 8.7, cyclePhase: 'Follicular', notes: 'Connected with mentor Ngozi for fintech advice', tag: 'Mentorship' },
  { id: 'me-16', date: '2026-03-07', displayDate: 'Mar 07', timestamp: new Date('2026-03-07').getTime(), moodScore: 8.9, energyScore: 8.9, cyclePhase: 'Follicular', notes: 'Creative spark; designed community graphics', tag: 'Creative Flow' },
  { id: 'me-17', date: '2026-03-08', displayDate: 'Mar 08', timestamp: new Date('2026-03-08').getTime(), moodScore: 9.3, energyScore: 9.2, cyclePhase: 'Ovulation', notes: 'International Women\'s Day celebration with sisters!', tag: 'Sisterhood Joy' },
  { id: 'me-18', date: '2026-03-09', displayDate: 'Mar 09', timestamp: new Date('2026-03-09').getTime(), moodScore: 9.1, energyScore: 9.0, cyclePhase: 'Ovulation', notes: 'Peak social confidence and communication', tag: 'Peak Energy' },
  { id: 'me-19', date: '2026-03-10', displayDate: 'Mar 10', timestamp: new Date('2026-03-10').getTime(), moodScore: 8.8, energyScore: 8.6, cyclePhase: 'Ovulation', notes: 'Delivered presentation smoothly at study group', tag: 'Confidence' },
  { id: 'me-20', date: '2026-03-11', displayDate: 'Mar 11', timestamp: new Date('2026-03-11').getTime(), moodScore: 8.4, energyScore: 8.0, cyclePhase: 'Luteal', notes: 'Entering luteal phase: organized personal budget', tag: 'Financial Care' },
  { id: 'me-21', date: '2026-03-12', displayDate: 'Mar 12', timestamp: new Date('2026-03-12').getTime(), moodScore: 8.0, energyScore: 7.7, cyclePhase: 'Luteal', notes: 'Gratitude journal entry filled with warmth', tag: 'Gratitude' },
  { id: 'me-22', date: '2026-03-13', displayDate: 'Mar 13', timestamp: new Date('2026-03-13').getTime(), moodScore: 7.9, energyScore: 7.3, cyclePhase: 'Luteal', notes: 'Cooked nourishing vegetable stew', tag: 'Clean Fuel' },
  { id: 'me-23', date: '2026-03-14', displayDate: 'Mar 14', timestamp: new Date('2026-03-14').getTime(), moodScore: 7.6, energyScore: 7.1, cyclePhase: 'Luteal', notes: 'Gentle stretching and breathing exercises', tag: 'Mindfulness' },
  { id: 'me-24', date: '2026-03-15', displayDate: 'Mar 15', timestamp: new Date('2026-03-15').getTime(), moodScore: 7.7, energyScore: 6.9, cyclePhase: 'Luteal', notes: 'Sunday reflection on weekly wins', tag: 'Weekly Review' },
  { id: 'me-25', date: '2026-03-16', displayDate: 'Mar 16', timestamp: new Date('2026-03-16').getTime(), moodScore: 7.3, energyScore: 6.8, cyclePhase: 'Luteal', notes: 'Practiced assertive communication boundaries', tag: 'Boundaries' },
  { id: 'me-26', date: '2026-03-17', displayDate: 'Mar 17', timestamp: new Date('2026-03-17').getTime(), moodScore: 7.1, energyScore: 6.4, cyclePhase: 'Luteal', notes: 'Craved magnesium; enjoyed dark chocolate and nuts', tag: 'Nourishment' },
  { id: 'me-27', date: '2026-03-18', displayDate: 'Mar 18', timestamp: new Date('2026-03-18').getTime(), moodScore: 7.0, energyScore: 6.2, cyclePhase: 'Luteal', notes: 'Light fatigue; stepped back from intense tasks', tag: 'Pacing' },
  { id: 'me-28', date: '2026-03-19', displayDate: 'Mar 19', timestamp: new Date('2026-03-19').getTime(), moodScore: 7.4, energyScore: 6.7, cyclePhase: 'Luteal', notes: 'Uplifting comment received on sisterhood feed', tag: 'Community Cheer' },
  { id: 'me-29', date: '2026-03-20', displayDate: 'Mar 20', timestamp: new Date('2026-03-20').getTime(), moodScore: 7.8, energyScore: 7.0, cyclePhase: 'Luteal', notes: 'Prepared period self-care basket with heat pad', tag: 'Preparedness' },
  { id: 'me-30', date: '2026-03-21', displayDate: 'Mar 21', timestamp: new Date('2026-03-21').getTime(), moodScore: 8.2, energyScore: 7.5, cyclePhase: 'Follicular', notes: 'Centered and grounded; feeling in tune with my body', tag: 'Harmonious Aura' }
];
