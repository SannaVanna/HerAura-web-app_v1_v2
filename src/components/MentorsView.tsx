import React, { useState } from 'react';
import { Mentor } from '../types';
import { Send, CheckCircle2, X } from 'lucide-react';

interface MentorsViewProps {
  mentors: Mentor[];
  selectedMentor?: Mentor | null;
  onSelectMentor?: (mentor: Mentor | null) => void;
  onToggleConnect: (mentorId: string) => void;
}

export const MentorsView: React.FC<MentorsViewProps> = ({
  mentors,
  selectedMentor,
  onSelectMentor,
  onToggleConnect,
}) => {
  const [internalSelectedMentor, setInternalSelectedMentor] = useState<Mentor | null>(null);
  const selectedMentorDetail = selectedMentor !== undefined ? selectedMentor : internalSelectedMentor;

  const handleSelectMentor = (mentor: Mentor | null) => {
    setInternalSelectedMentor(mentor);
    if (onSelectMentor) {
      onSelectMentor(mentor);
    }
  };
  const [messageModalMentor, setMessageModalMentor] = useState<Mentor | null>(null);
  const [messageDraft, setMessageDraft] = useState('');
  const [messageSentSuccess, setMessageSentSuccess] = useState<string | null>(null);

  const handleOpenSendMessage = (mentor: Mentor) => {
    setMessageDraft(
      `Hello ${mentor.name}! I am inspired by your work in ${mentor.mentorFocus || mentor.topic || mentor.title} and would love to connect for guidance.`
    );
    setMessageModalMentor(mentor);
  };

  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageModalMentor || !messageDraft.trim()) return;

    if (!messageModalMentor.connected) {
      onToggleConnect(messageModalMentor.id);
    }

    setMessageSentSuccess(`Message successfully sent to ${messageModalMentor.name}! She will respond via your safe inbox.`);
    setMessageModalMentor(null);
    setMessageDraft('');
    setTimeout(() => setMessageSentSuccess(null), 4000);
  };

  // If a mentor is selected, render the Detail Profile View (Screenshot 2)
  if (selectedMentorDetail) {
    const currentMentor = mentors.find((m) => m.id === selectedMentorDetail.id) || selectedMentorDetail;

    return (
      <div id="mentor-detail-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Notification Toast */}
        {messageSentSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>{messageSentSuccess}</span>
          </div>
        )}

        {/* Back Button */}
        <div>
          <button
            onClick={() => handleSelectMentor(null)}
            className="px-5 py-1.5 rounded-lg bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
          >
            Back
          </button>
        </div>

        {/* Top Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center sm:items-start gap-6 transition-colors">
          <img
            src={currentMentor.image}
            alt={currentMentor.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover flex-shrink-0 shadow-xs"
          />
          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#e6007e]">
              {currentMentor.name}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#e6007e]">
              {currentMentor.title}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {currentMentor.topic || currentMentor.category}
            </p>

            {/* Badge */}
            <div className="pt-1">
              {currentMentor.statusBadge === 'heraura' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-100 dark:border-emerald-800/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Available on HerAura</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-300 text-xs font-medium border border-sky-100 dark:border-sky-800/40">
                  <span>🌐</span>
                  <span>External Mentor</span>
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-center sm:justify-start gap-3 flex-wrap">
              <button
                id={`detail-connect-${currentMentor.id}`}
                onClick={() => onToggleConnect(currentMentor.id)}
                className={`px-6 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer ${
                  currentMentor.connected
                    ? 'bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                    : 'bg-[#e6007e] hover:bg-[#c9006e] text-white'
                }`}
              >
                {currentMentor.connected ? 'Connected' : 'Connect'}
              </button>

              {currentMentor.websiteUrl ? (
                <a
                  href={currentMentor.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold text-xs sm:text-sm transition-colors cursor-pointer inline-block"
                >
                  Visit Profile
                </a>
              ) : (
                <button
                  onClick={() => handleOpenSendMessage(currentMentor)}
                  className="px-6 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Visit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2-Column Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column (2 Cols) */}
          <div className="md:col-span-2 space-y-6">
            {/* About Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-7 shadow-xs border border-gray-100 dark:border-gray-700 space-y-3 transition-colors">
              <h3 className="text-sm sm:text-base font-bold text-[#e6007e]">
                About {currentMentor.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {currentMentor.bio}
              </p>
            </div>

            {/* What she helps with Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-7 shadow-xs border border-gray-100 dark:border-gray-700 space-y-3 transition-colors">
              <h3 className="text-sm sm:text-base font-bold text-[#e6007e]">
                What she helps with
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                {(currentMentor.helpsWith && currentMentor.helpsWith.length > 0
                  ? currentMentor.helpsWith
                  : [
                      'Personal growth & confidence building',
                      `Career guidance in ${currentMentor.topic || currentMentor.title}`,
                      'Emotional support & mentorship',
                      'Skill development and clarity',
                    ]
                ).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-gray-800 dark:text-gray-200 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column (1 Col) */}
          <div className="md:col-span-1 space-y-5">
            {/* Contact Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xs border border-gray-100 dark:border-gray-700 space-y-1.5 transition-colors">
              <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Contact
              </h4>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 break-all">
                {currentMentor.email || `${currentMentor.name.toLowerCase().split(' ')[0]}@email.com`}
              </p>
            </div>

            {/* Mentor Focus Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xs border border-gray-100 dark:border-gray-700 space-y-1.5 transition-colors">
              <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Mentor Focus
              </h4>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                {currentMentor.mentorFocus || currentMentor.topic || currentMentor.title}
              </p>
            </div>

            {/* Mentorship Style Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xs border border-gray-100 dark:border-gray-700 space-y-1.5 transition-colors">
              <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Mentorship Style
              </h4>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                {currentMentor.mentorshipStyle || 'Supportive • Calm • Practical • Empowering'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA: Ready to connect with [Name] ? */}
        <div className="text-center pt-8 pb-8 space-y-3">
          <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            Ready to connect with {currentMentor.name} ?
          </p>
          <div>
            <button
              onClick={() => handleOpenSendMessage(currentMentor)}
              className="px-7 py-2.5 rounded-xl bg-[#e6007e] hover:bg-[#c9006e] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              Send Message
            </button>
          </div>
        </div>

        {/* Send Message Modal */}
        {messageModalMentor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <img
                    src={messageModalMentor.image}
                    alt={messageModalMentor.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      Message {messageModalMentor.name}
                    </h3>
                    <p className="text-[11px] text-[#e6007e]">
                      {messageModalMentor.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMessageModalMentor(null)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendMessageSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Your Message:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={messageDraft}
                    onChange={(e) => setMessageDraft(e.target.value)}
                    placeholder="Write your note, questions, or goals..."
                    className="w-full p-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs sm:text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setMessageModalMentor(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#e6007e] hover:bg-[#c9006e] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // LIST VIEW: Matching Screenshot 1 exactly
  return (
    <div id="mentors-list-view" className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Toast Notification */}
      {messageSentSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>{messageSentSuccess}</span>
        </div>
      )}

      {/* Page Title: Centered Mentor Connect in Pink */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#e6007e] text-center my-6">
        Mentor Connect
      </h1>

      {/* Stacked Mentor Cards (Screenshot 1) */}
      <div className="space-y-6 pb-12">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            id={`mentor-card-${mentor.id}`}
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-7 shadow-xs border border-gray-100 dark:border-gray-700 transition-all hover:shadow-sm"
          >
            {/* Top row: Avatar & Info */}
            <div className="flex items-start gap-4">
              <img
                src={mentor.image}
                alt={mentor.name}
                onClick={() => handleSelectMentor(mentor)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover flex-shrink-0 cursor-pointer shadow-xs"
              />
              <div className="flex-1 min-w-0">
                <h3
                  onClick={() => handleSelectMentor(mentor)}
                  className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white cursor-pointer hover:text-[#e6007e] dark:hover:text-pink-400 transition-colors"
                >
                  {mentor.name}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#e6007e] mt-0.5">
                  {mentor.title}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {mentor.topic || mentor.category}
                </p>
              </div>
            </div>

            {/* Bio description */}
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              {mentor.bio}
            </p>

            {/* Status Badge */}
            <div className="mt-3.5">
              {mentor.statusBadge === 'heraura' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-100 dark:border-emerald-800/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Available on HerAura</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-300 text-xs font-medium border border-sky-100 dark:border-sky-800/40">
                  <span>🌐</span>
                  <span>External Mentor</span>
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-5 flex items-center gap-3 flex-wrap">
              <button
                onClick={() => handleSelectMentor(mentor)}
                className="px-5 py-2.5 rounded-xl bg-[#e6007e] hover:bg-[#c9006e] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
              >
                View Profile
              </button>

              {mentor.statusBadge === 'heraura' ? (
                <button
                  id={`mentor-connect-${mentor.id}`}
                  onClick={() => onToggleConnect(mentor.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                    mentor.connected
                      ? 'bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                      : 'bg-[#e6007e] hover:bg-[#c9006e] text-white shadow-xs'
                  }`}
                >
                  {mentor.connected ? 'Connected' : 'Connect'}
                </button>
              ) : (
                <a
                  href={mentor.websiteUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#e6007e] hover:bg-[#c9006e] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer inline-block"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
