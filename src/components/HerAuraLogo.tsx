import React from 'react';

export interface HerAuraLogoProps {
  variant?: 'default' | 'footer-badge' | 'white' | 'nav' | 'light' | 'dark' | 'card';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
  onClick?: () => void;
}

export const HerAuraLogo: React.FC<HerAuraLogoProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
  showTagline = true,
  onClick,
}) => {
  const isBadge = variant === 'footer-badge' || variant === 'card';
  const isWhite = variant === 'white' || variant === 'dark';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-16 h-16'
  };

  const titleSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl'
  };

  const tagSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-[12px]',
    xl: 'text-sm'
  };

  const content = (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Real HerAura Icon: Two Embracing Sisterhood Figures */}
      <svg
        className={`${iconSizes[size]} flex-shrink-0 transition-transform hover:scale-105`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logo-embracing-rose" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e91e63" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
          <linearGradient id="logo-embracing-soft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>

        {/* Left figure head (soft pastel pink) */}
        <circle cx="34" cy="26" r="13" fill="url(#logo-embracing-soft)" />
        {/* Right figure head (vibrant magenta) */}
        <circle cx="64" cy="22" r="12" fill="url(#logo-embracing-rose)" />

        {/* Left embracing torso & wing */}
        <path
          d="M 18 56 C 18 42 32 40 40 48 C 46 56 42 78 32 84 C 24 78 18 68 18 56 Z"
          fill="url(#logo-embracing-soft)"
        />

        {/* Right embracing torso & protective center embrace */}
        <path
          d="M 52 88 C 38 76 36 52 50 42 C 62 34 74 42 76 56 C 78 70 66 84 52 88 Z"
          fill="url(#logo-embracing-rose)"
          opacity="0.95"
        />

        {/* Harmonious lower cradle swoosh */}
        <path
          d="M 28 72 C 40 88 58 92 74 76 C 64 98 38 96 28 72 Z"
          fill="#be123c"
        />
        <path
          d="M 44 62 Q 52 84 62 86 Q 48 80 44 62 Z"
          fill="#ffffff"
          opacity="0.5"
        />
      </svg>

      {/* HerAura Text with Botanical Leaf Sprig & Tagline */}
      <div className="flex flex-col leading-tight relative">
        <div className="flex items-center">
          <span
            className={`font-black tracking-tight transition-colors ${titleSizes[size]} ${
              isWhite ? 'text-white' : 'text-[#c2185b]'
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <span className={isWhite ? 'text-pink-200' : 'text-[#d81b60]'}>Her</span>
            <span className={isWhite ? 'text-white' : 'text-[#c2185b]'}>Aura</span>
          </span>

          {/* Botanical Leaf Sprig Sprouting from the final 'a' */}
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 -ml-0.5 -mt-2 text-[#d81b60]"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Stem */}
            <path
              d="M 8 42 C 14 30 22 20 34 10"
              stroke={isWhite ? '#fbcfe8' : '#c2185b'}
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            {/* 5 Botanical Leaves */}
            <path d="M 34 10 C 34 2 44 0 46 7 C 47 13 41 15 34 10 Z" fill={isWhite ? '#f472b6' : '#e91e63'} />
            <path d="M 30 18 C 36 13 48 17 44 24 C 39 27 32 23 30 18 Z" fill={isWhite ? '#ec4899' : '#d81b60'} />
            <path d="M 23 23 C 17 15 9 19 12 26 C 16 28 21 26 23 23 Z" fill={isWhite ? '#f9a8d4' : '#ec4899'} />
            <path d="M 20 32 C 28 28 38 33 34 40 C 29 42 23 38 20 32 Z" fill={isWhite ? '#f472b6' : '#e91e63'} />
            <path d="M 14 37 C 8 31 2 36 6 43 C 10 45 13 41 14 37 Z" fill={isWhite ? '#fbcfe8' : '#f472b6'} />
          </svg>
        </div>

        {showTagline && (
          <span
            className={`italic font-serif font-medium tracking-tight -mt-0.5 ${tagSizes[size]} ${
              isWhite ? 'text-pink-100/95' : 'text-[#c2185b]'
            }`}
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            A digital safe space for girls
          </span>
        )}
      </div>
    </div>
  );

  if (isBadge) {
    return (
      <div className="bg-white px-4 py-2.5 rounded-2xl shadow-xs inline-block border border-pink-100">
        {content}
      </div>
    );
  }

  return content;
};
