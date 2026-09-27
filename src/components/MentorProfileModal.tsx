import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mentor } from '../types';
import {
  X,
  Star,
  Sparkles,
  MapPin,
  CheckCircle2,
  Send,
  Calendar,
  Clock,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

interface MentorProfileModalProps {
  mentor: Mentor;
  onClose: () => void;
  onToggleConnect: (mentorId: string) => void;
}

export const MentorProfileModal: React.FC<MentorProfileModalProps> = ({
  mentor,
  onClose,
  onToggleConnect,
}) => {
  const [chatMessage, setChatMessage] = useState('');
  const [sentMessages, setSentMessages] = useState<string[]>([
    `Hi ${mentor.name}! I'm inspired by your work and would love your guidance as my HerAura mentor.`
  ]);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setSentMessages([...sentMessages, chatMessage.trim()]);
    setChatMessage('');

    // If not connected, also trigger connect!
    if (!mentor.connected) {
      onToggleConnect(mentor.id);
    }
  };

  const handleBookSession = () => {
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 4000);
  };

  return (
    <motion.div
      id="mentor-profile-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-100 flex flex-col max-h-[92vh]"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700">Verified HerAura Female Mentor</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-semibold transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Header & Mentor Bio */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-pink-400 to-rose-300 shadow-md flex-shrink-0">
              <img
                src={mentor.image}
                alt={mentor.name}
                className="w-full h-full object-cover rounded-full"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2
                  className="text-xl sm:text-2xl font-serif font-bold text-gray-900"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {mentor.name}
                </h2>
                <span className="text-xs font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full">
                  {mentor.category}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-gray-700">{mentor.title}</p>

              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-gray-500 pt-1">
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{mentor.rating}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{mentor.location || 'Global Virtual'}</span>
                </span>
                <span>•</span>
                <span>{mentor.reviewsCount || 42} mentorship sessions</span>
              </div>
            </div>
          </div>

          {/* Connect & Book Action Bar */}
          <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-pink-50/60 border border-pink-100">
            <button
              id="mentor-modal-connect-btn"
              onClick={() => onToggleConnect(mentor.id)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                mentor.connected
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-[#e6007e] hover:bg-[#c9006e] text-white shadow-xs'
              }`}
            >
              {mentor.connected ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Connected Mentor</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Connect with Mentor</span>
                </>
              )}
            </button>

            <button
              onClick={handleBookSession}
              className="py-2.5 px-4 rounded-xl bg-white border border-gray-200 text-gray-800 hover:border-pink-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-pink-600" />
              <span>Book 1-on-1 Session</span>
            </button>
          </div>

          {bookingSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Session request submitted! Mentor will confirm calendar availability via email.</span>
            </div>
          )}

          {/* Full Bio */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">About & Background</h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-gray-50/70 p-4 rounded-xl border border-gray-100">
              {mentor.bio}
            </p>
          </div>

          {/* Mentoring Topics & Expertise */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2.5">Mentoring Focus Areas</h3>
            <div className="flex flex-wrap gap-2">
              {mentor.expertise.map((exp, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-pink-50 text-pink-700 text-xs font-semibold border border-pink-200/60"
                >
                  {exp}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Direct Chat with Mentor */}
          <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
              <MessageSquare className="w-4 h-4 text-pink-600" />
              <span>Direct Mentorship Message</span>
            </div>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {sentMessages.map((msg, i) => (
                <div key={i} className="flex justify-end">
                  <div className="bg-pink-600 text-white text-xs py-2 px-3.5 rounded-2xl rounded-tr-xs max-w-[85%]">
                    {msg}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <input
                type="text"
                placeholder={`Ask ${mentor.name.split(' ')[0]} a question...`}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-[#e6007e] hover:bg-[#c9006e] text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
