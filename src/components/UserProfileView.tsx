import React, { useState } from 'react';
import { UserProfile } from '../types';
import { DigitalWellbeingTimer } from './DigitalWellbeingTimer';
import {
  Award,
  BookOpen,
  Users,
  MessageCircle,
  Settings,
  Shield,
  Bell,
  LogOut,
  Edit3,
  CheckCircle2,
  Sparkles,
  Heart
} from 'lucide-react';

interface UserProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: Partial<UserProfile>) => void;
  onLogout: () => void;
  onLogWater?: () => void;
  onTriggerNotification?: (title: string, message: string) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  onUpdateUser,
  onLogout,
  onLogWater,
  onTriggerNotification,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [email, setEmail] = useState(user.email);
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name, bio, email });
    setIsEditing(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div id="user-profile-screen" className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-xs border border-pink-100 dark:border-gray-800 flex flex-col items-center text-center relative overflow-hidden transition-colors">
        {/* Background gradient banner */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-500 opacity-30 dark:opacity-20" />

        {/* Avatar */}
        <div className="relative z-10 mt-6 w-24 h-24 rounded-full p-1 bg-white dark:bg-gray-800 shadow-md">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover rounded-full"
          />
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute bottom-0 right-0 p-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-full shadow-xs transition-colors cursor-pointer"
            title="Edit profile"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Name & Bio */}
        <h2
          className="relative z-10 text-2xl font-serif font-bold text-gray-900 dark:text-white mt-3"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {user.name}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user.email}</p>
        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-2 max-w-md leading-relaxed">{user.bio}</p>

        {/* Stats Strip matching reference */}
        <div className="w-full grid grid-cols-4 gap-2 pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col items-center">
            <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{user.postsCount}</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase">Posts</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{user.commentsCount}</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase">Comments</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{user.followersCount}</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase">Sisters</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              {user.completedCoursesCount}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase">Courses</span>
          </div>
        </div>
      </div>

      {saveToast && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Profile changes updated successfully!</span>
        </div>
      )}

      {/* Edit Form Modal/Drawer */}
      {isEditing && (
        <form onSubmit={handleSave} className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xs border border-pink-200 dark:border-gray-800 space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Edit Profile Details</h3>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Bio:</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Digital Wellbeing & Session Usage Timer */}
      <DigitalWellbeingTimer
        onLogWater={onLogWater}
        onTriggerNotification={onTriggerNotification}
      />

      {/* Badges Earned */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xs border border-pink-100 dark:border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            <span>Badges & Achievements</span>
          </h3>
          <span className="text-xs text-pink-600 dark:text-pink-400 font-bold">{user.badges.length} Earned</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {user.badges.map((b) => (
            <div
              key={b.id}
              className="p-3 rounded-2xl bg-pink-50/60 dark:bg-gray-800/60 border border-pink-100 dark:border-gray-700 flex items-center gap-3"
            >
              <span className="text-2xl">{b.icon}</span>
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">{b.name}</h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{b.description}</p>
                <span className="text-[9px] text-pink-700 dark:text-pink-400 font-semibold">{b.dateEarned}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings & Privacy Links */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xs border border-pink-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 text-xs">
        <div className="py-3 flex items-center justify-between hover:text-pink-600 dark:hover:text-pink-400 cursor-pointer">
          <span className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300 font-semibold">
            <Shield className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span>Privacy & Safe Space Encryption</span>
          </span>
          <span className="text-gray-400 dark:text-gray-500">›</span>
        </div>

        <div className="py-3 flex items-center justify-between hover:text-pink-600 dark:hover:text-pink-400 cursor-pointer">
          <span className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300 font-semibold">
            <Bell className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span>Notification Preferences</span>
          </span>
          <span className="text-gray-400 dark:text-gray-500">›</span>
        </div>

        <div className="py-3 flex items-center justify-between hover:text-pink-600 dark:hover:text-pink-400 cursor-pointer">
          <span className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300 font-semibold">
            <Settings className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span>Account Security & Password</span>
          </span>
          <span className="text-gray-400 dark:text-gray-500">›</span>
        </div>

        <div
          id="profile-logout-btn"
          onClick={onLogout}
          className="pt-3 flex items-center justify-between text-rose-600 dark:text-rose-400 font-bold hover:text-rose-700 dark:hover:text-rose-300 cursor-pointer"
        >
          <span className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4" />
            <span>Sign Out of HerAura</span>
          </span>
          <span>›</span>
        </div>
      </div>
    </div>
  );
};
