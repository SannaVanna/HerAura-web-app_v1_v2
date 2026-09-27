import React, { useState, useRef, useEffect } from 'react';
import { Mentor, MentorRecommendation } from '../types';
import { apiService } from '../services/api';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Star,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Heart
} from 'lucide-react';

interface AiAssistantViewProps {
  mentors: Mentor[];
  onSelectMentor: (mentor: Mentor) => void;
  onToggleConnect: (mentorId: string) => void;
  onClose?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  recommendations?: MentorRecommendation[];
  timestamp: string;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  mentors,
  onSelectMentor,
  onToggleConnect,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-welcome',
      sender: 'assistant',
      text: "Hello sister! 🌸 I am Aura, your friendly HerAura companion. I'm here to support you with career advice, tech skills, feminine wellbeing, emotional encouragement, and connecting you with inspiring mentors. How are you feeling today?",
      timestamp: 'Just now',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    'How can I prepare for my first coding interview?',
    'Can you recommend a mentor in tech & leadership?',
    'Tips for soothing menstrual cramps and fatigue?',
    'How do I build self-confidence when speaking up in class?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const result = await apiService.sendChatMessage(query);
      const recs: MentorRecommendation[] = result.recommendedMentor
        ? [
            {
              mentorId: result.recommendedMentor.id,
              name: result.recommendedMentor.name,
              title: result.recommendedMentor.title,
              image: result.recommendedMentor.image,
              reason: `Expert guidance in ${result.recommendedMentor.expertise?.slice(0, 2).join(' & ') || result.recommendedMentor.category}`,
            },
          ]
        : [];

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: result.text,
        recommendations: recs,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: "You are doing wonderfully, sister. Remember to be gentle with yourself. Whether you're mastering code, navigating your cycle, or pursuing new goals, our HerAura community and mentors are right here by your side.",
        recommendations: [
          {
            mentorId: 'nora-godwin',
            name: 'Nora Godwin Teneke',
            title: 'AI & Data Ethics Specialist | Co-Founder',
            image: '/src/assets/images/founder_nora_teneke_1789946025497.jpg',
            reason: 'Great mentor for STEM education and ethical technology.',
          },
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="ai-assistant-screen"
      className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-col h-[calc(100vh-140px)] min-h-[500px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-pink-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
              <span>Aura AI Guide</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            </h1>
            <p className="text-[11px] text-gray-500">Your warm companion for wellbeing, learning & mentorship</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-semibold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-[#e6007e] text-white rounded-tr-xs'
                  : 'bg-white text-gray-800 border border-pink-100 rounded-tl-xs'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>

              {/* Dynamic Mentor Recommendation Cards if provided */}
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-pink-100/60 space-y-2.5">
                  <span className="text-[11px] font-bold text-pink-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Recommended Mentor Connections:</span>
                  </span>

                  {msg.recommendations.map((rec, rIdx) => {
                    const fullMentor = mentors.find((m) => m.id === rec.mentorId) || mentors[0];
                    return (
                      <div
                        key={rIdx}
                        className="p-3 rounded-xl bg-pink-50/70 border border-pink-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rec.image || fullMentor?.image}
                            alt={rec.name}
                            className="w-10 h-10 rounded-full object-cover border border-pink-300"
                          />
                          <div>
                            <h4 className="font-bold text-gray-900 text-xs">{rec.name}</h4>
                            <p className="text-[10px] text-gray-500">{rec.title}</p>
                            <p className="text-[10px] text-pink-700 italic mt-0.5">{rec.reason}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 w-full sm:w-auto">
                          <button
                            onClick={() => onSelectMentor(fullMentor)}
                            className="flex-1 sm:flex-initial px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-[11px] font-semibold text-gray-700 hover:border-pink-300"
                          >
                            Profile
                          </button>
                          <button
                            onClick={() => onToggleConnect(fullMentor.id)}
                            className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                              fullMentor.connected
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#e6007e] text-white hover:bg-[#c9006e]'
                            }`}
                          >
                            {fullMentor.connected ? 'Connected' : 'Connect'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <span
                className={`block text-[9px] mt-1.5 text-right ${
                  msg.sender === 'user' ? 'text-pink-200' : 'text-gray-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-gray-200 text-gray-700 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-pink-600 p-2">
            <div className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
            <span>Aura is reflecting on the best advice for you...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="py-2 overflow-x-auto flex gap-1.5 no-scrollbar">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-700 text-[11px] font-medium whitespace-nowrap border border-pink-200/60 transition-colors flex-shrink-0 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2 pt-2 border-t border-gray-100">
        <input
          type="text"
          placeholder="Ask Aura anything about career, wellbeing, tech, or mentors..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-2xl bg-white border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none placeholder-gray-400 shadow-xs"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || loading}
          className="p-3 rounded-2xl bg-[#e6007e] hover:bg-[#c9006e] text-white transition-colors cursor-pointer disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
