import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({});
  }
  return aiClient;
}

export const MENTORS_METADATA = [
  {
    id: 'mentor-nora',
    name: 'Nora Godwin Teneke',
    title: 'Technology & AI for Social Impact Specialist',
    organization: 'HerAura Co-Founder',
    bio: 'Technology enthusiast with BSc in Computer Science and MSc in Information Technology. Focuses on AI-powered solutions aligned with UN SDGs.',
    expertise: ['AI & Data Science', 'Computer Science', 'EdTech', 'Social Impact'],
    avatar: '/src/assets/images/founder_nora_teneke_1789946025497.jpg',
    rating: 5.0,
    reviewsCount: 38,
    availability: 'Available this week',
    isFounder: true,
  },
  {
    id: 'mentor-rita',
    name: 'Rita Okam',
    title: 'Software Developer & Tech Innovator',
    organization: 'HerAura Co-Founder',
    bio: 'Tech-savvy innovator in software development, fintech, and automation. Passionate about empowering females through tech education across Africa.',
    expertise: ['Software Engineering', 'Fintech', 'Web Development', 'Career Strategy'],
    avatar: '/src/assets/images/founder_rita_okam_1789946034914.jpg',
    rating: 5.0,
    reviewsCount: 42,
    availability: 'Available tomorrow',
    isFounder: true,
  },
  {
    id: 'mentor-amina-diallo',
    name: 'Amina Diallo',
    title: 'Youth Wellbeing & Emotional Health Guide',
    organization: 'Mindful Sisters Network',
    bio: 'Certified emotional wellness practitioner supporting girls through anxiety management and mindful journaling.',
    expertise: ['Emotional Wellbeing', 'Mindfulness', 'Stress Relief', 'Personal Growth'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviewsCount: 29,
    availability: 'Next 3 days',
  },
  {
    id: 'mentor-chidinma',
    name: 'Chidinma Eze',
    title: 'Senior Product Designer & Mentor',
    organization: 'Fintech Studio Africa',
    bio: 'Design educator guiding aspiring women into UI/UX and product design.',
    expertise: ['Product Design', 'UI/UX', 'Portfolio Review', 'Creative Tech'],
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviewsCount: 31,
    availability: 'Weekends',
  },
  {
    id: 'mentor-zainab',
    name: 'Dr. Zainab Al-Mansoor',
    title: 'Adolescent & Women\'s Health Educator',
    organization: 'Feminine Health Initiative',
    bio: 'Medical doctor dedicated to demystifying menstrual health and feminine wellness.',
    expertise: ['Menstrual Health', 'Holistic Wellness', 'Nutrition', 'Body Literacy'],
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=400&q=80',
    rating: 5.0,
    reviewsCount: 47,
    availability: 'Flexible',
  },
];

export async function handleAiChatRequest(userMessage: string) {
  const ai = getAiClient();

  // If Gemini API Key is present, query gemini-3.8-flash
  if (ai) {
    try {
      const prompt = `You are Aura, an empathetic, supportive, knowledgeable AI guide for HerAura — a digital safe space for girls and young women.
HerAura helps girls learn, grow, connect with female mentors, participate in community, track wellbeing, and navigate career, education, menstrual health, and personal growth.

Here are the registered mentors available on HerAura:
1. Nora Godwin Teneke (Co-founder, AI & Data Science, Computer Science, EdTech, Social Impact, UN SDGs)
2. Rita Okam (Co-founder, Software Engineering, Fintech, Web Development, Automation, Tech Education in Africa)
3. Amina Diallo (Youth Emotional Wellbeing, Mindfulness, Stress Relief, Confidence)
4. Chidinma Eze (Product Design, UI/UX, Creative Technology, Portfolios)
5. Dr. Zainab Al-Mansoor (Adolescent & Women's Health, Menstrual Health, Wellness, Body Literacy)

Instructions:
- Provide a warm, concise, affirming response (2 to 3 short paragraphs).
- If the user discusses a topic where one of these mentors could directly guide them (e.g. coding/fintech -> Rita; AI/computer science/degrees -> Nora; anxiety/stress -> Amina; design/UI -> Chidinma; menstrual health/body -> Dr. Zainab), recommend that mentor explicitly by name.
- At the very end of your response, if you recommend a mentor, output a special delimiter on a new line:
RECOMMENDED_MENTOR_ID: <one of mentor-nora, mentor-rita, mentor-amina-diallo, mentor-chidinma, mentor-zainab, or none>

User message: "${userMessage.replace(/"/g, '\\"')}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const fullText = response.text || '';
      let recommendedMentorId = 'none';
      let cleanText = fullText;

      const marker = 'RECOMMENDED_MENTOR_ID:';
      if (fullText.includes(marker)) {
        const parts = fullText.split(marker);
        cleanText = parts[0].trim();
        recommendedMentorId = parts[1].trim().toLowerCase();
      }

      let recommendedMentor = MENTORS_METADATA.find(m => m.id === recommendedMentorId);
      if (!recommendedMentor) {
        // Keyword fallback
        const lower = userMessage.toLowerCase();
        if (lower.includes('code') || lower.includes('software') || lower.includes('web') || lower.includes('tech') || lower.includes('fintech')) {
          recommendedMentor = MENTORS_METADATA.find(m => m.id === 'mentor-rita');
        } else if (lower.includes('ai') || lower.includes('data') || lower.includes('science') || lower.includes('degree')) {
          recommendedMentor = MENTORS_METADATA.find(m => m.id === 'mentor-nora');
        } else if (lower.includes('period') || lower.includes('cramp') || lower.includes('cycle') || lower.includes('health')) {
          recommendedMentor = MENTORS_METADATA.find(m => m.id === 'mentor-zainab');
        } else if (lower.includes('stress') || lower.includes('anxious') || lower.includes('sad')) {
          recommendedMentor = MENTORS_METADATA.find(m => m.id === 'mentor-amina-diallo');
        } else if (lower.includes('design') || lower.includes('ux') || lower.includes('ui')) {
          recommendedMentor = MENTORS_METADATA.find(m => m.id === 'mentor-chidinma');
        }
      }

      const formattedRecommendations = recommendedMentor ? [
        {
          mentor: recommendedMentor,
          matchReason: `Recommended by Aura based on your interests in ${recommendedMentor.expertise.join(', ')}`,
        }
      ] : [];

      return {
        text: cleanText,
        reply: cleanText,
        recommendedMentor,
        recommendations: formattedRecommendations,
      };
    } catch (err) {
      console.error('Gemini API error in handleAiChatRequest:', err);
      // Fall through to smart matching
    }
  }

  // Smart fallback when GEMINI_API_KEY is not set or network fails
  const lower = userMessage.toLowerCase();
  let recommendedMentor = undefined;
  let text = '';

  if (lower.includes('tech') || lower.includes('code') || lower.includes('software') || lower.includes('web') || lower.includes('fintech')) {
    recommendedMentor = MENTORS_METADATA.find(m => m.id === 'mentor-rita');
    text = "Building tech skills is a superpower! Whether you are writing your first line of HTML or exploring software careers, you belong in this space. I warmly recommend connecting with HerAura co-founder Rita Okam — she is passionate about mentoring women in software development and tech innovation!";
  } else if (lower.includes('ai') || lower.includes('data') || lower.includes('degree') || lower.includes('science') || lower.includes('research')) {
    recommendedMentor = MENTORS_METADATA.find(m => m.id === 'mentor-nora');
    text = "Artificial intelligence and digital solutions are shaping the world! If you want to use tech for social impact and community empowerment, HerAura co-founder Nora Godwin Teneke has deep expertise in IT, computer science, and UN SDG-aligned technology.";
  } else if (lower.includes('period') || lower.includes('cycle') || lower.includes('cramp') || lower.includes('health') || lower.includes('flow')) {
    recommendedMentor = MENTORS_METADATA.find(m => m.id === 'mentor-zainab');
    text = "Your body and cycle are unique and deserving of compassionate care. Be sure to check our Menstrual Health Tracker in the Wellness tab to log your symptoms and cycle days. You can also connect with Dr. Zainab Al-Mansoor for adolescent health guidance.";
  } else if (lower.includes('stress') || lower.includes('anxious') || lower.includes('tired') || lower.includes('overwhelm') || lower.includes('feeling')) {
    recommendedMentor = MENTORS_METADATA.find(m => m.id === 'mentor-amina-diallo');
    text = "Take a slow, gentle breath. You do not have to carry all the expectations on your shoulders today. Try our 2-minute guided box breathing exercise in the Wellness tab. For emotional support and gentle grounding, mentor Amina Diallo is here for you.";
  } else {
    text = "Hello beautiful soul! I'm Aura, your AI guide in HerAura. I'm here to support your journey with personal confidence, learning tech and finance, finding the right female mentors, or caring for your health. What would you like to explore today?";
  }

  const fallbackRecommendations = recommendedMentor ? [
    {
      mentor: recommendedMentor,
      matchReason: `Recommended by Aura based on your message topic and their expertise in ${recommendedMentor.expertise.join(', ')}`,
    }
  ] : [];

  return {
    text,
    reply: text,
    recommendedMentor,
    recommendations: fallbackRecommendations,
  };
}
