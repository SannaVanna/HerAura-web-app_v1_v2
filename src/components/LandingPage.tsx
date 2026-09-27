import React, { useState, useEffect } from 'react';
import { HerAuraLogo } from './HerAuraLogo';
import { FOUNDERS } from '../data/initialData';
import { apiService } from '../services/api';
import {
  Moon,
  Sun,
  Menu,
  X,
  Instagram,
  Globe,
  Twitter,
  Youtube,
  Send,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface LandingPageProps {
  onNavigateToAuth: (mode: 'login' | 'register') => void;
  onNavigateToApp: (section?: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToAuth,
  onNavigateToApp,
  darkMode,
  onToggleDarkMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);
  // Typing effect state with character-by-character animation
  const typingPhrases = [
    'Stay confident...',
    'Stay safe...',
    'Stay empowered...',
    'Stay inspired...',
    'Stay radiant...',
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [contactStatusMsg, setContactStatusMsg] = useState('');

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  // Typewriter effect logic
  useEffect(() => {
    const currentPhrase = typingPhrases[phraseIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing forward
      if (typedText.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setTypedText(currentPhrase.slice(0, typedText.length + 1));
        }, 85);
      } else {
        // Finished typing phrase, pause before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      // Deleting backward
      if (typedText.length > 0) {
        timer = setTimeout(() => {
          setTypedText(currentPhrase.slice(0, typedText.length - 1));
        }, 40);
      } else {
        // Finished deleting, move to next phrase
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % typingPhrases.length);
      }
    }

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, phraseIndex]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setContactStatus('error');
      setContactStatusMsg('Please fill in your name, email, and message.');
      return;
    }

    setContactStatus('loading');
    setContactStatusMsg('');

    try {
      const res = await apiService.submitContactForm({
        name: contactName,
        email: contactEmail,
        address: contactAddress,
        message: contactMessage,
      });

      if (res.success) {
        setContactStatus('success');
        setContactStatusMsg(res.message || 'Your message has been received!');
        setContactName('');
        setContactEmail('');
        setContactAddress('');
        setContactMessage('');
      } else {
        setContactStatus('error');
        setContactStatusMsg(res.error || 'Unable to submit contact form.');
      }
    } catch {
      setContactStatus('error');
      setContactStatusMsg('Unable to submit contact form.');
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      setNewsletterStatus('error');
      setNewsletterMsg('Please enter a valid email address.');
      return;
    }

    setNewsletterStatus('loading');
    setNewsletterMsg('');

    try {
      const res = await apiService.subscribeNewsletter(newsletterEmail);
      if (res.success) {
        setNewsletterStatus('success');
        setNewsletterMsg(res.message || 'Subscribed to HerAura updates!');
        setNewsletterEmail('');
      } else {
        setNewsletterStatus('error');
        setNewsletterMsg(res.error || 'Failed to subscribe.');
      }
    } catch {
      setNewsletterStatus('error');
      setNewsletterMsg('Failed to subscribe.');
    }
  };

  return (
    <div id="landing-page-container" className="w-full bg-[#faf7f7] text-[#2d2d2d] transition-colors duration-200">
      {/* 1. Header / Navigation */}
      <header
        id="landing-header"
        className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 sm:px-8 py-3.5 shadow-xs"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div
            id="brand-logo-btn"
            className="cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <HerAuraLogo size="md" showTagline={true} />
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-7 text-[15px] font-medium text-gray-700">
            <button
              id="nav-home-link"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-gray-900 hover:text-pink-600 transition-colors"
            >
              Home
            </button>
            <button
              id="nav-login-link"
              onClick={() => onNavigateToAuth('login')}
              className="hover:text-pink-600 transition-colors"
            >
              Login
            </button>
            <button
              id="nav-register-link"
              onClick={() => onNavigateToAuth('register')}
              className="hover:text-pink-600 transition-colors"
            >
              Register
            </button>
            <button
              id="nav-open-app-link"
              onClick={() => onNavigateToApp('home')}
              className="bg-pink-50 text-pink-700 px-3.5 py-1.5 rounded-full text-sm font-semibold hover:bg-pink-100 transition-all flex items-center gap-1.5"
            >
              <span>Explore App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </nav>

          {/* Right actions: Theme toggle & Mobile menu button */}
          <div className="flex items-center space-x-3">
            <button
              id="theme-toggle-btn"
              onClick={onToggleDarkMode}
              title="Toggle theme"
              aria-label="Toggle theme"
              className="p-2 rounded-full text-amber-500 hover:bg-pink-50 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-amber-600 fill-amber-400" />}
            </button>

            {/* Mobile Hamburger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-menu"
            className="md:hidden mt-3 pt-3 border-t border-gray-100 pb-2 flex flex-col space-y-3 px-2 text-sm font-medium"
          >
            <button
              id="mobile-nav-home"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className="text-left py-1.5 px-2 hover:bg-pink-50 rounded-md text-gray-800"
            >
              Home
            </button>
            <button
              id="mobile-nav-login"
              onClick={() => {
                onNavigateToAuth('login');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1.5 px-2 hover:bg-pink-50 rounded-md text-gray-800"
            >
              Login
            </button>
            <button
              id="mobile-nav-register"
              onClick={() => {
                onNavigateToAuth('register');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1.5 px-2 hover:bg-pink-50 rounded-md text-pink-600 font-semibold"
            >
              Register
            </button>
            <button
              id="mobile-nav-app"
              onClick={() => {
                onNavigateToApp('home');
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold shadow-xs"
            >
              Open Safe Space App
            </button>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section
        id="hero-section"
        className="relative min-h-[580px] sm:min-h-[640px] flex items-center justify-center bg-gray-900 text-white overflow-hidden bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: "url('/src/assets/images/hero_woman_wellness_1789946004145.jpg')",
        }}
      >
        {/* Dark translucent overlay for crisp text contrast */}
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center flex flex-col items-center">
          {/* Welcome line */}
          <div className="text-sm sm:text-base md:text-lg font-medium tracking-wide mb-3 flex items-center justify-center gap-1.5">
            <span>Welcome to</span>
            <span className="text-[#ff1493] font-serif font-bold text-lg sm:text-xl">HerAura.</span>
          </div>

          {/* Main heading - exact case from screenshot */}
          <h1
            className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3 max-w-3xl leading-snug sm:leading-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            A DIgital safe space for girls.
          </h1>

          {/* Subheading */}
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-100 mb-5"
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            Your daily guide to feminine wellness.
          </h2>

          {/* Animated typewriter effect tagline */}
          <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-9 flex items-center justify-center min-h-[44px]">
            <span
              className="text-[#ff1493] font-bold text-center tracking-tight inline-flex items-center"
              style={{ textShadow: '0 0 16px rgba(255, 20, 147, 0.45)' }}
            >
              <span>{typedText}</span>
              <span className="inline-block w-[3px] h-6 sm:h-7 bg-[#ff1493] ml-1.5 animate-pulse rounded-full" />
            </span>
          </div>

          {/* Two prominent action buttons side-by-side */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <button
              id="hero-register-btn"
              onClick={() => onNavigateToAuth('register')}
              className="px-8 py-3 rounded-full bg-[#e6007e] hover:bg-[#c9006e] active:scale-95 text-white font-semibold text-base shadow-lg shadow-pink-900/30 transition-all cursor-pointer"
            >
              Register
            </button>

            <button
              id="hero-login-btn"
              onClick={() => onNavigateToAuth('login')}
              className="px-6 py-3 rounded-full bg-transparent hover:bg-white/10 active:scale-95 text-pink-200 hover:text-white font-medium text-base transition-all cursor-pointer border border-pink-300/40"
            >
              Login
            </button>
          </div>

          {/* Quick jump to interactive dashboard */}
          <div className="mt-8 pt-4 border-t border-white/15">
            <button
              id="hero-explore-btn"
              onClick={() => onNavigateToApp('home')}
              className="text-xs sm:text-sm text-pink-200/90 hover:text-white flex items-center gap-1.5 transition-colors underline-offset-4 hover:underline"
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Enter directly into the HerAura community & wellness portal</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. About HerAura Section */}
      <section id="about-section" className="py-16 sm:py-24 px-6 sm:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Column: HerAura Group artwork image */}
          <div className="relative group">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-pink-100 aspect-square sm:aspect-[4/3] md:aspect-square bg-pink-50">
              <img
                src="/src/assets/images/her_aura_girls_group_1789946014663.jpg"
                alt="HerAura Girls Group discussion"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-xs flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-pink-700">Digital Safe Space</span>
              </div>
            </div>
          </div>

          {/* Right Column: About Content */}
          <div className="flex flex-col space-y-5 text-left">
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1f2937] tracking-tight flex items-center gap-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <span>🌷</span>
              <span>About HerAura.</span>
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-gray-700 font-normal">
              HerAura is a digital safe space built to empower, inspire, and connect girls and young women across the world.
              We believe every girl deserves access to guidance, mentorship, education, and a supportive community that helps
              her grow into the best version of herself.
            </p>

            <p className="text-sm sm:text-base leading-relaxed text-gray-700 font-normal">
              At HerAura, girls can connect with successful female leaders and mentors, learn new skills from tech to arts
              and personal development, track their health and wellness, and build lasting friendships within a safe,
              encouraging environment.
            </p>

            <p className="text-sm sm:text-base leading-relaxed text-gray-700 font-normal">
              Our mission is to nurture confidence, creativity, and purpose by providing the tools, community, and inspiration
              every girl needs to thrive. Whether you're seeking mentorship, learning opportunities, or just a friendly space
              to share your thoughts, HerAura is your digital home of growth and positivity.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <button
                id="about-join-sisterhood"
                onClick={() => onNavigateToAuth('register')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm shadow-xs transition-colors"
              >
                <span>Join the Sisterhood</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Meet The Founders Section */}
      <section id="founders-section" className="py-16 sm:py-24 px-6 sm:px-12 bg-[#fdfbfb] border-t border-pink-50">
        <div className="max-w-6xl mx-auto">
          {/* Section Heading */}
          <div className="text-center mb-14">
            <h2
              className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Meet The Founders
            </h2>
            <div className="w-16 h-1 bg-pink-500 mx-auto mt-3 rounded-full" />
          </div>

          {/* Founders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {FOUNDERS.map((founder, idx) => (
              <div
                key={idx}
                id={`founder-card-${idx}`}
                className="flex flex-col items-center text-center bg-white p-8 sm:p-10 rounded-2xl shadow-xs border border-pink-100 hover:shadow-md transition-shadow"
              >
                {/* Round portrait */}
                <div className="relative mb-6">
                  <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full overflow-hidden p-1.5 bg-gradient-to-tr from-pink-400 to-rose-200 shadow-md">
                    <img
                      src={founder.image}
                      alt={founder.name}
                      className="w-full h-full object-cover rounded-full"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Name */}
                <h3
                  className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-4"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {founder.name}
                </h3>

                {/* Biography */}
                <div className="space-y-3 text-sm sm:text-[15px] leading-relaxed text-gray-700 text-left sm:text-justify font-normal">
                  {founder.bio.map((para, pIdx) => (
                    <p key={pIdx}>{para}</p>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 w-full flex items-center justify-center gap-2 text-xs font-semibold text-pink-700">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{founder.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Let's Connect Section with Transparent Parallax Background (Matching Hero Section) */}
      <section
        id="connect-section"
        className="relative py-16 sm:py-24 px-6 sm:px-12 text-white bg-fixed bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: "url('/src/assets/images/hero_woman_wellness_1789946004145.jpg')",
        }}
      >
        {/* Dark translucent overlay matching Hero Section for crisp text contrast */}
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" />

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Side */}
          <div className="flex flex-col space-y-6 text-left">
            <div className="text-sm sm:text-base font-semibold tracking-wide flex items-center gap-1.5 text-[#ff1493]">
              <Sparkles className="w-4 h-4 text-[#ff1493]" />
              <span>We're Here For You</span>
            </div>

            <h2
              className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                textShadow: '0 0 24px rgba(255, 20, 147, 0.35)'
              }}
            >
              Let's Connect
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-gray-200 font-normal">
              Have you ever felt unheard, unseen, or unsure where you truly belong? HerAura is a safe, supportive space
              for women and girls to learn, heal, grow, and rediscover their power. Whether you're seeking guidance,
              community, or collaboration, you don't have to walk alone we're here with you.
            </p>

            <div>
              <button
                id="connect-cta-btn"
                onClick={() => {
                  const formElement = document.getElementById('contact-form-card');
                  if (formElement) {
                    formElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-7 py-3 rounded-full bg-[#e6007e] hover:bg-[#c9006e] active:scale-95 text-white font-semibold text-sm shadow-lg shadow-pink-950/40 transition-all cursor-pointer"
              >
                Let's Connect
              </button>
            </div>
          </div>

          {/* Right Side: Contact Us Card with Frosted Translucent Glassmorphism */}
          <div
            id="contact-form-card"
            className="bg-black/50 backdrop-blur-md p-7 sm:p-9 rounded-3xl shadow-2xl border border-white/20 w-full"
          >
            <h3
              className="text-xl sm:text-2xl font-serif font-bold text-white text-center mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Contact Us
            </h3>

            {contactStatus === 'success' && (
              <div className="mb-5 p-3.5 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{contactStatusMsg}</span>
              </div>
            )}

            {contactStatus === 'error' && (
              <div className="mb-5 p-3.5 rounded-lg bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{contactStatusMsg}</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-gray-200 mb-1">Name:</label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/95 text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 border border-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-200 mb-1">Email:</label>
                <input
                  type="email"
                  required
                  placeholder="example@email.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/95 text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 border border-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-200 mb-1">Address:</label>
                <input
                  type="text"
                  placeholder="Enter your address"
                  value={contactAddress}
                  onChange={(e) => setContactAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/95 text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 border border-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-200 mb-1">Message:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="How can HerAura support you?"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/95 text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 border border-white/30"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={contactStatus === 'loading'}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#e6007e] hover:bg-[#c9006e] active:scale-95 text-white font-semibold text-sm transition-all cursor-pointer shadow-lg shadow-pink-900/30 disabled:opacity-50"
                >
                  {contactStatus === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 6. Footer (Vivid Pink background matching reference) */}
      <footer id="landing-footer" className="bg-[#e6007e] text-white py-14 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Logo, Copyright & Socials */}
          <div className="flex flex-col space-y-4">
            <HerAuraLogo variant="card" size="sm" showTagline={true} />

            <p className="text-xs text-pink-100 leading-relaxed">
              Copyright © 2020 Nexcent Ltd.
              <br />
              All rights reserved
            </p>

            <div className="flex items-center space-x-3 pt-1 text-white">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://dribbble.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Community"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="font-semibold text-sm text-white mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs text-pink-100">
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('about-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:underline"
                >
                  About us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateToApp('community')} className="hover:underline">
                  Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('connect-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:underline"
                >
                  Contact us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateToApp('learn')} className="hover:underline">
                  Pricing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateToApp('community')} className="hover:underline">
                  Testimonials
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="font-semibold text-sm text-white mb-4">Support</h4>
            <ul className="space-y-2.5 text-xs text-pink-100">
              <li>
                <button onClick={() => onNavigateToApp('ai')} className="hover:underline">
                  Help center
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateToApp('profile')} className="hover:underline">
                  Terms of service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateToApp('profile')} className="hover:underline">
                  Legal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateToApp('wellness')} className="hover:underline">
                  Privacy policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateToApp('home')} className="hover:underline">
                  Status
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Stay up to date */}
          <div>
            <h4 className="font-semibold text-sm text-white mb-4">Stay up to date</h4>
            <form onSubmit={handleNewsletterSubmit} className="relative">
              <input
                type="email"
                placeholder="Your email address"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full py-2.5 pl-3.5 pr-10 rounded-lg bg-pink-300/40 text-white placeholder-pink-100 text-xs focus:outline-none focus:ring-2 focus:ring-white border border-pink-300/60"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                disabled={newsletterStatus === 'loading'}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-pink-100 hover:text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {newsletterStatus === 'success' && (
              <p className="text-[11px] text-pink-100 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-pink-200" />
                <span>{newsletterMsg}</span>
              </p>
            )}

            {newsletterStatus === 'error' && (
              <p className="text-[11px] text-pink-200 mt-2">
                {newsletterMsg}
              </p>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
