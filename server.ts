import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// In-memory store for contact submissions and newsletter
const contactSubmissions: Array<{
  name: string;
  email: string;
  address?: string;
  message: string;
  date: string;
}> = [];

const newsletterSubscribers: string[] = [];

// Available HerAura Mentors for recommendation
const MENTORS_LIST = [
  {
    id: 'nora-godwin',
    name: 'Nora Godwin Teneke',
    title: 'AI & Data Specialist | Co-Founder',
    expertise: ['AI & Data', 'Education Technology', 'SDGs', 'Tech Mentorship'],
    bio: 'Technology enthusiast with a background in Computer Science (BSc) and Information Technology (MSc). Passionate about empowering young girls through digital tools.',
    image: '/src/assets/images/founder_nora_teneke_1789946025497.jpg',
    category: 'Tech'
  },
  {
    id: 'rita-okam',
    name: 'Rita Okam',
    title: 'Software Developer & Tech Innovator | Co-Founder',
    expertise: ['Web Development', 'Fintech', 'Automation', 'STEM Education'],
    bio: 'Tech-savvy innovator with deep expertise in software development, fintech, and web automation. Dedicated to female empowerment in tech across Africa.',
    image: '/src/assets/images/founder_rita_okam_1789946036039.jpg',
    category: 'Tech'
  },
  {
    id: 'fatima-al-hassan',
    name: 'Fatima Al-Hassan',
    title: 'Senior Tech Lead & Engineering Mentor',
    expertise: ['Software Engineering', 'Career Transition', 'Leadership', 'Coding'],
    bio: 'Passionate engineering mentor helping girls break into software engineering with confidence, resilience, and real-world project skills.',
    image: '/src/assets/images/mentor_fatima_lead_1789946058858.jpg',
    category: 'Career'
  },
  {
    id: 'chidinma-okafor',
    name: 'Chidinma Okafor',
    title: 'Holistic Health Coach & Nutritionist',
    expertise: ['Feminine Wellness', 'Hormonal Balance', 'Stress Management', 'Nutrition'],
    bio: 'Certified health coach supporting young women in listening to their bodies, managing stress, and developing sustainable self-care habits.',
    image: '/src/assets/images/mentor_chidinma_health_1789946068785.jpg',
    category: 'Wellness'
  },
  {
    id: 'zainab-bello',
    name: 'Zainab Bello',
    title: 'Financial Literacy Coach & Career Strategist',
    expertise: ['Budgeting', 'Financial Independence', 'Interview Prep', 'Career Growth'],
    bio: 'Empowering young women to understand money, build emergency savings, negotiate their worth, and step into financial self-reliance.',
    image: '/src/assets/images/founder_nora_teneke_1789946025497.jpg',
    category: 'Finance'
  }
];

// Lazy initialization for Gemini AI
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    try {
      geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI client:', err);
    }
  }
  return geminiClient;
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'HerAura',
    timestamp: new Date().toISOString(),
    aiAvailable: Boolean(process.env.GEMINI_API_KEY),
    flaskUrlConfigured: Boolean(process.env.VITE_API_BASE_URL || process.env.FLASK_API_URL)
  });
});

app.get('/api/mentors', (req, res) => {
  res.json({ mentors: MENTORS_LIST });
});

app.post('/api/contact', (req, res) => {
  const { name, email, address, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  contactSubmissions.push({
    name,
    email,
    address: address || '',
    message,
    date: new Date().toISOString()
  });

  res.json({
    success: true,
    message: "Thank you for reaching out to HerAura! Your message has been received by our support team."
  });
});

app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  if (!newsletterSubscribers.includes(email)) {
    newsletterSubscribers.push(email);
  }

  res.json({
    success: true,
    message: 'Welcome to the HerAura sisterhood newsletter!'
  });
});

// Community posts persistence store
const communityPostsStore: Array<{
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  content: string;
  image?: string;
  imageUrl?: string;
  feeling?: string;
  likes: number;
  liked: boolean;
  comments: any[];
  timestamp: string;
  tags: string[];
  category: string;
}> = [
  {
    id: 'p1',
    authorId: 'user-amina-1',
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
      }
    ]
  },
  {
    id: 'p2',
    authorId: 'user-khadija-2',
    authorName: 'Khadija Umar',
    authorAvatar: '/src/assets/images/mentor_fatima_lead_1789946058858.jpg',
    authorRole: 'Aspiring Web Developer',
    content: "Connected with mentor Rita Okam yesterday and she reviewed my first web portfolio. She gave such clear, constructive feedback on my CSS layouts. Having a female mentor who truly understands the journey makes all the difference! ✨💻",
    timestamp: '5 hours ago',
    likes: 38,
    liked: false,
    image: '/src/assets/images/her_aura_girls_group_1789946014663.jpg',
    imageUrl: '/src/assets/images/her_aura_girls_group_1789946014663.jpg',
    category: 'Trending',
    tags: ['TechMentorship', 'WomenInTech', 'Coding'],
    comments: []
  },
  {
    id: 'p3',
    authorId: 'user-ngozi-3',
    authorName: 'Ngozi Eze',
    authorAvatar: '/src/assets/images/mentor_chidinma_health_1789946068785.jpg',
    authorRole: 'Wellness Advocate',
    content: "Gentle reminder to my sisters today: please remember to drink your water and give your body permission to rest if you are in your luteal or menstrual phase. Your worth is never measured solely by relentless productivity. Rest is productive too. 🍵💖",
    timestamp: 'Yesterday',
    likes: 56,
    liked: true,
    category: 'Latest',
    tags: ['SelfCare', 'MenstrualWellness', 'Mindfulness'],
    comments: []
  }
];

app.get('/api/posts', (req, res) => {
  res.json({ success: true, posts: communityPostsStore });
});

app.post('/api/posts', (req, res) => {
  try {
    const { content, image, imageUrl, category, tags, feeling, authorName, authorAvatar, authorRole, authorId } = req.body;
    if (!content && !image && !imageUrl) {
      return res.status(400).json({ error: 'Post must contain either text or an image.' });
    }

    const postImg = image || imageUrl || undefined;
    const newPost = {
      id: 'post-' + Date.now(),
      authorId: authorId || 'user-current',
      authorName: authorName || 'Amina Yusuf',
      authorAvatar: authorAvatar || '/src/assets/images/founder_rita_okam_1789946036039.jpg',
      authorRole: authorRole || 'Community Sister',
      content: (content || '').trim(),
      image: postImg,
      imageUrl: postImg,
      category: category || 'For You',
      tags: Array.isArray(tags) && tags.length > 0 ? tags : ['Sisterhood', 'HerAura'],
      feeling: feeling || undefined,
      likes: 0,
      liked: false,
      comments: [],
      timestamp: 'Just now'
    };

    communityPostsStore.unshift(newPost);
    res.json({ success: true, post: newPost });
  } catch (err: any) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Failed to create post.' });
  }
});

// AI Chatbot with dynamic response & intelligent mentor matching
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const ai = getGemini();

    // Check mentor relevance based on user prompt keywords
    const lower = message.toLowerCase();
    let recommendedMentor = null;
    let recommendationReason = '';

    if (lower.includes('tech') || lower.includes('code') || lower.includes('programming') || lower.includes('ai') || lower.includes('data') || lower.includes('software')) {
      if (lower.includes('ai') || lower.includes('data') || lower.includes('science') || lower.includes('school')) {
        recommendedMentor = MENTORS_LIST[0]; // Nora
        recommendationReason = 'Nora specializes in AI, data-driven solutions, and educational empowerment for young women.';
      } else {
        recommendedMentor = MENTORS_LIST[1]; // Rita
        recommendationReason = 'Rita is a passionate software engineer and tech innovator with expertise in web and mobile development.';
      }
    } else if (lower.includes('period') || lower.includes('cramp') || lower.includes('cycle') || lower.includes('health') || lower.includes('sleep') || lower.includes('stress') || lower.includes('wellness') || lower.includes('body')) {
      recommendedMentor = MENTORS_LIST[3]; // Chidinma
      recommendationReason = 'Chidinma is our certified holistic health coach who guides girls in feminine wellness, hormone balance, and self-care.';
    } else if (lower.includes('money') || lower.includes('budget') || lower.includes('save') || lower.includes('finance') || lower.includes('college') || lower.includes('career')) {
      recommendedMentor = MENTORS_LIST[4]; // Zainab
      recommendationReason = 'Zainab is a financial literacy and career coach focused on building confidence and independence in young women.';
    } else if (lower.includes('mentor') || lower.includes('advice') || lower.includes('lead') || lower.includes('confidence')) {
      recommendedMentor = MENTORS_LIST[2]; // Fatima
      recommendationReason = 'Fatima is a senior tech leader and career coach renowned for nurturing leadership and self-confidence.';
    }

    if (ai) {
      const systemInstruction = `You are Aura, the HerAura AI Assistant — an uplifting, empathetic, safe, and knowledgeable companion for girls and young women in HerAura (a digital safe space for girls).
HerAura's mission is to help girls learn, grow, connect with female mentors, participate in a supportive community, and track their wellbeing.
Provide compassionate, practical, and constructive guidance on everyday questions, education, tech skills, relationships, and wellness.
Keep your tone warm, friendly, sisterly, and empowering.
Never provide clinical medical diagnoses; encourage consulting a trusted adult or professional when appropriate.
Keep responses concise, clear, and structured with gentle bullet points if listing ideas.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nUser Question: ${message}` }] }
        ]
      });

      const replyText = response.text || "I'm here for you! How can I support your journey today?";

      return res.json({
        reply: replyText,
        mentorRecommendation: recommendedMentor ? {
          mentor: recommendedMentor,
          reason: recommendationReason
        } : null
      });
    } else {
      // Fallback smart response when API key is not configured in local environment
      let fallbackReply = `Thank you for sharing with me! Remember that in HerAura, you are never alone. Taking time to reflect, ask questions, and care for your wellness is a powerful strength.`;

      if (lower.includes('hello') || lower.includes('hi')) {
        fallbackReply = `Hello lovely! 🌸 Welcome to Aura, your safe space guide. How are you feeling today, and what would you like to explore together? We can chat about school, careers, wellness, or connecting with mentors.`;
      } else if (lower.includes('period') || lower.includes('cramp') || lower.includes('cycle')) {
        fallbackReply = `Menstrual wellness is such an important part of caring for our bodies. Stay hydrated, use a warm compress, get extra rest, and listen to your body's rhythm. You can also log your symptoms in our Wellness Tracker!`;
      } else if (lower.includes('tech') || lower.includes('code')) {
        fallbackReply = `It is wonderful that you are exploring technology! Tech needs the creative voice, insight, and leadership of girls and young women like you. Check out our Learn section for beginner-friendly coding courses.`;
      }

      return res.json({
        reply: fallbackReply,
        mentorRecommendation: recommendedMentor ? {
          mentor: recommendedMentor,
          reason: recommendationReason
        } : null
      });
    }
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({
      error: 'Failed to process chat message.',
      details: err?.message || 'Internal server error'
    });
  }
});

// Vite integration
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HerAura server listening on http://0.0.0.0:${PORT}`);
  });
}

start();
