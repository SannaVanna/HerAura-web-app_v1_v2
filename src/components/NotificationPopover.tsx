import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { InAppNotification } from '../types';
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Calendar,
  Droplets,
  MessageSquare,
  BookOpen,
  Sparkles,
  Trash2,
  ExternalLink,
  Plus
} from 'lucide-react';

interface NotificationPopoverProps {
  notifications: InAppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onClearAll: () => void;
  onNavigateToTab: (tab: 'home' | 'community' | 'learn' | 'mentors' | 'wellness' | 'ai' | 'profile') => void;
  onAddNotification?: (notif: Partial<InAppNotification>) => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAll,
  onNavigateToTab,
  onAddNotification
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'health' | 'social'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'health') return n.type === 'cycle' || n.type === 'hydration';
    if (filter === 'social') return n.type === 'community' || n.type === 'mentor' || n.type === 'course';
    return true;
  });

  const getNotificationIcon = (type: InAppNotification['type']) => {
    switch (type) {
      case 'cycle':
        return {
          icon: Calendar,
          color: 'text-pink-600',
          bg: 'bg-pink-100',
          border: 'border-pink-200',
          badge: 'Cycle Health'
        };
      case 'hydration':
        return {
          icon: Droplets,
          color: 'text-blue-600',
          bg: 'bg-blue-100',
          border: 'border-blue-200',
          badge: 'Hydration'
        };
      case 'community':
        return {
          icon: MessageSquare,
          color: 'text-purple-600',
          bg: 'bg-purple-100',
          border: 'border-purple-200',
          badge: 'Sisterhood'
        };
      case 'course':
        return {
          icon: BookOpen,
          color: 'text-emerald-600',
          bg: 'bg-emerald-100',
          border: 'border-emerald-200',
          badge: 'Learning'
        };
      case 'mentor':
        return {
          icon: Sparkles,
          color: 'text-amber-600',
          bg: 'bg-amber-100',
          border: 'border-amber-200',
          badge: 'Mentorship'
        };
      default:
        return {
          icon: Bell,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          border: 'border-gray-200',
          badge: 'Alert'
        };
    }
  };

  const handleNotificationClick = (notif: InAppNotification) => {
    onMarkAsRead(notif.id);
    if (notif.targetTab) {
      onNavigateToTab(notif.targetTab);
      onClose();
    }
  };

  const handleSimulateAlert = (type: 'cycle' | 'hydration' | 'mentor') => {
    if (!onAddNotification) return;

    if (type === 'cycle') {
      onAddNotification({
        title: '🌸 Predicted Period in 2 Days',
        message: 'Your predicted cycle starts in 48 hours. Keep your chamomile tea, heating pad, and rest ready.',
        type: 'cycle',
        targetTab: 'wellness'
      });
    } else if (type === 'hydration') {
      onAddNotification({
        title: '💧 Afternoon Hydration Pause',
        message: 'Your body needs replenishment. Drink a fresh glass of water to power through your day!',
        type: 'hydration',
        targetTab: 'wellness'
      });
    } else {
      onAddNotification({
        title: '✨ Mentor Response Received',
        message: 'Ngozi Adebayo replied to your financial literacy mentorship query.',
        type: 'mentor',
        targetTab: 'mentors'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/30 backdrop-blur-xs"
        />

        {/* Drawer panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col border-l border-pink-100"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-pink-100 flex items-center justify-between bg-gradient-to-r from-pink-50/70 to-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-100 text-[#e6007e] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#e6007e] text-white text-[11px] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-gray-500">Stay updated on wellness, community, and lessons</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-pink-600 hover:bg-pink-50 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="px-4 py-2.5 bg-gray-50/80 border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: `Unread (${unreadCount})` },
              { id: 'health', label: 'Cycle & Water' },
              { id: 'social', label: 'Community & Mentors' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  filter === f.id
                    ? 'bg-pink-600 text-white shadow-2xs font-semibold'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-pink-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-400 mx-auto flex items-center justify-center">
                  <Bell className="w-7 h-7 stroke-[1.5]" />
                </div>
                <h4 className="text-sm font-bold text-gray-800">No notifications right now</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  {filter === 'unread'
                    ? "You're completely caught up! No unread notifications."
                    : 'All clear! You will receive reminders for period predictions, hydration, and mentor replies here.'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const config = getNotificationIcon(notif.type);
                const IconComponent = config.icon;

                return (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-3.5 rounded-2xl border transition-all relative ${
                      notif.read
                        ? 'bg-white border-gray-100 hover:border-pink-100'
                        : 'bg-pink-50/40 border-pink-200/80 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-xl ${config.bg} ${config.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <IconComponent className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => handleNotificationClick(notif)}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${config.bg} ${config.color}`}>
                            {config.badge}
                          </span>
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-[#e6007e] inline-block" />
                            )}
                            {notif.timestamp}
                          </span>
                        </div>

                        <h4 className={`text-xs ${notif.read ? 'font-semibold text-gray-800' : 'font-bold text-gray-900'}`}>
                          {notif.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                          {notif.message}
                        </p>

                        {notif.targetTab && (
                          <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-pink-600 hover:text-pink-700">
                            <span>View in {notif.targetTab}</span>
                            <ExternalLink className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
                        {!notif.read && (
                          <button
                            onClick={() => onMarkAsRead(notif.id)}
                            className="p-1 text-gray-400 hover:text-pink-600 transition-colors cursor-pointer"
                            title="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteNotification(notif.id)}
                          className="p-1 text-gray-300 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Delete notification"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Quick Simulation & Clear All Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/70 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-semibold text-gray-700">Simulate Live Alerts:</span>
              {notifications.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-gray-400 hover:text-rose-600 text-[11px] transition-colors cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleSimulateAlert('cycle')}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-pink-50 text-pink-700 border border-pink-200 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span>🌸 Period Alert</span>
              </button>
              <button
                onClick={() => handleSimulateAlert('hydration')}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span>💧 Hydration</span>
              </button>
              <button
                onClick={() => handleSimulateAlert('mentor')}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span>✨ Mentor</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
