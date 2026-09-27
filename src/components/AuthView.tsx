import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HerAuraLogo } from './HerAuraLogo';
import { UserProfile } from '../types';
import { Eye, EyeOff, Sparkles, ArrowRight, ArrowLeft, Check, Heart } from 'lucide-react';

interface AuthViewProps {
  initialMode?: 'login' | 'register' | 'onboarding';
  onSuccess: (user: UserProfile) => void;
  onClose?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'login',
  onSuccess,
  onClose,
}) => {
  const [step, setStep] = useState<'onboarding' | 'auth'>(
    initialMode === 'onboarding' ? 'onboarding' : 'auth'
  );
  const [authMode, setAuthMode] = useState<'login' | 'register'>(
    initialMode === 'register' ? 'register' : 'login'
  );

  // Onboarding slides state (matching screens 2, 3, 4 from reference)
  const [onboardingIndex, setOnboardingIndex] = useState(0);

  const onboardingSlides = [
    {
      title: 'Safe space for girls',
      subtitle: 'Sisterhood for girls to spark growth, connect peer encouragement and confidence.',
      image: '/src/assets/images/onboarding_sisterhood_art_1789946046955.jpg',
      tag: 'Learn • Grow • Connect • Thrive'
    },
    {
      title: 'Learn, connect, confident',
      subtitle: 'Learn high-value digital and life skills, connect with female mentors, and build lasting self-assurance.',
      image: '/src/assets/images/her_aura_girls_group_1789946014663.jpg',
      tag: 'Empowerment & Education'
    },
    {
      title: 'Real support. Real sisterhood.',
      subtitle: 'Accessible mentors for guidance, emotional support, wellness tracking, and mutual celebration.',
      image: '/src/assets/images/hero_woman_wellness_1789946004145.jpg',
      tag: 'Holistic Feminine Wellness'
    }
  ];

  // Auth form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (authMode === 'register' && !name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const userProfile: UserProfile = {
        id: 'user-' + Date.now(),
        name: authMode === 'register' ? name.trim() : 'Amina Yusuf',
        email: email.trim(),
        avatar: '/src/assets/images/founder_rita_okam_1789946036039.jpg',
        bio: 'Empowered member of the HerAura safe space community.',
        postsCount: authMode === 'register' ? 1 : 13,
        commentsCount: authMode === 'register' ? 0 : 38,
        followersCount: authMode === 'register' ? 12 : 235,
        completedCoursesCount: authMode === 'register' ? 0 : 3,
        interests: ['Technology', 'Wellness', 'Leadership'],
        badges: [
          {
            id: 'b1',
            name: 'Sisterhood Champion',
            icon: '🌸',
            description: 'Joined HerAura digital safe space community',
            dateEarned: 'Just now'
          }
        ]
      };

      if (authMode === 'register') {
        // Take through onboarding after registration as requested in prompt!
        setStep('onboarding');
        setOnboardingIndex(0);
      } else {
        onSuccess(userProfile);
      }
    }, 600);
  };

  const handleFinishOnboarding = () => {
    const finalUser: UserProfile = {
      id: 'user-' + Date.now(),
      name: name.trim() || 'Amina Yusuf',
      email: email || 'amina.yusuf@example.com',
      avatar: '/src/assets/images/founder_rita_okam_1789946036039.jpg',
      bio: 'Ready to learn, connect, and thrive with HerAura sisterhood.',
      postsCount: 1,
      commentsCount: 2,
      followersCount: 15,
      completedCoursesCount: 1,
      interests: ['Coding & STEM', 'Mindfulness', 'Feminine Wellness'],
      badges: [
        {
          id: 'b-welcome',
          name: 'Welcome Sister',
          icon: '✨',
          description: 'Completed HerAura onboarding',
          dateEarned: 'Today'
        }
      ]
    };
    onSuccess(finalUser);
  };

  return (
    <motion.div
      id="auth-view-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
    >
      {/* Container matching mobile UI reference */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-100 flex flex-col min-h-[580px]"
      >
        {/* Floating subtle pastel bubbles in corners matching reference */}
        <div className="pointer-events-none absolute -top-8 -right-8 w-28 h-28 rounded-full bg-pink-200/50 blur-xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-rose-200/40 blur-xl" />
        <div className="pointer-events-none absolute top-1/3 -left-6 w-16 h-16 rounded-full bg-pink-100/60 blur-lg" />
        <div className="pointer-events-none absolute bottom-1/4 -right-6 w-20 h-20 rounded-full bg-pink-200/40 blur-lg" />

        {/* Top bar with back / close / skip */}
        <div className="relative z-10 flex items-center justify-between px-6 pt-5 pb-2">
          {step === 'onboarding' ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-pink-600">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step {onboardingIndex + 1} of 3</span>
            </div>
          ) : (
            <button
              onClick={() => {
                if (onClose) onClose();
              }}
              className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          {step === 'onboarding' ? (
            <button
              onClick={handleFinishOnboarding}
              className="text-xs font-semibold text-gray-400 hover:text-pink-600 transition-colors"
            >
              Skip
            </button>
          ) : (
            onClose && (
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-semibold"
              >
                ✕
              </button>
            )
          )}
        </div>

        {/* View Content */}
        {step === 'onboarding' ? (
          /* ONBOARDING SLIDES (Screens 2, 3, 4 from UI reference) */
          <div className="relative z-10 flex-1 flex flex-col justify-between p-6 text-center">
            {/* Slide Artwork */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-md border border-pink-100 mb-6 bg-pink-50">
                <img
                  src={onboardingSlides[onboardingIndex].image}
                  alt={onboardingSlides[onboardingIndex].title}
                  className="w-full h-full object-cover"
                />
              </div>

              <span className="text-[11px] font-semibold text-pink-500 tracking-wider uppercase mb-2">
                {onboardingSlides[onboardingIndex].tag}
              </span>

              <h2
                className="text-2xl font-serif font-bold text-gray-900 mb-3"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {onboardingSlides[onboardingIndex].title}
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 max-w-xs leading-relaxed">
                {onboardingSlides[onboardingIndex].subtitle}
              </p>
            </div>

            {/* Slide Dots & Action Button */}
            <div className="mt-6 pt-4 border-t border-pink-50 flex flex-col items-center gap-4">
              <div className="flex items-center space-x-2">
                {onboardingSlides.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === onboardingIndex ? 'w-6 bg-pink-600' : 'w-1.5 bg-pink-200'
                    }`}
                  />
                ))}
              </div>

              {onboardingIndex < onboardingSlides.length - 1 ? (
                <button
                  id="onboarding-next-btn"
                  onClick={() => setOnboardingIndex((prev) => prev + 1)}
                  className="w-full py-3 rounded-full bg-[#e6007e] hover:bg-[#c9006e] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="onboarding-get-started-btn"
                  onClick={handleFinishOnboarding}
                  className="w-full py-3 rounded-full bg-[#e6007e] hover:bg-[#c9006e] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Get Started</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* LOGIN & REGISTRATION SCREENS (matching reference) */
          <div className="relative z-10 flex-1 flex flex-col justify-between p-6 sm:p-7">
            <div>
              {/* Center Portrait Icon */}
              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-16 h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-pink-400 to-rose-300 shadow-md mb-2.5">
                  <img
                    src="/src/assets/images/founder_rita_okam_1789946036039.jpg"
                    alt="User Portrait"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h2
                  className="text-2xl font-serif font-bold text-gray-900"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {authMode === 'login' ? 'Welcome Back' : 'Register'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {authMode === 'login'
                    ? 'Log into your safe space and wellbeing dashboard'
                    : 'Create your safe space account and join the sisterhood'}
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex rounded-xl bg-pink-50/80 p-1 mb-5 border border-pink-100">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    authMode === 'login'
                      ? 'bg-white text-pink-700 shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    authMode === 'register'
                      ? 'bg-white text-pink-700 shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Register
                </button>
              </div>

              {errorMsg && (
                <div className="mb-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Form fields */}
              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amina Yusuf"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email address:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Password:
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-gray-400 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-gray-400">Safe & confidential</span>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to your registered email.')}
                    className="text-pink-600 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#e6007e] hover:bg-[#c9006e] text-white font-semibold text-sm shadow-md transition-all mt-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Continue to Onboarding'}
                </button>
              </form>
            </div>

            {/* Social Login option shown in reference */}
            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <span className="text-[11px] text-gray-400 block mb-2.5">
                or Sign in with Social Login
              </span>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onSuccess({
                      id: 'user-google-1',
                      name: 'Amina Yusuf',
                      email: 'amina.google@example.com',
                      avatar: '/src/assets/images/founder_rita_okam_1789946036039.jpg',
                      bio: 'Growing with HerAura safe space.',
                      postsCount: 5,
                      commentsCount: 14,
                      followersCount: 88,
                      completedCoursesCount: 2,
                      interests: ['Tech', 'Wellness'],
                      badges: []
                    });
                  }}
                  className="flex-1 py-2 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center justify-center gap-1.5"
                >
                  <span className="text-red-500 font-bold">G</span>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSuccess({
                      id: 'user-fb-1',
                      name: 'Amina Yusuf',
                      email: 'amina.fb@example.com',
                      avatar: '/src/assets/images/founder_rita_okam_1789946036039.jpg',
                      bio: 'Growing with HerAura safe space.',
                      postsCount: 5,
                      commentsCount: 14,
                      followersCount: 88,
                      completedCoursesCount: 2,
                      interests: ['Tech', 'Wellness'],
                      badges: []
                    });
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <span>f</span>
                  <span>Facebook</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
