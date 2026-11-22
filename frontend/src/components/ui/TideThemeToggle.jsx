import React from 'react'
import { useTheme } from '../../lib/themeContext'

export default function TideThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleTheme()
    }
  }

  return (
    <>
      {/* Scoped CSS for fluid wave dynamics, tail flutter, and ambient bubble drift */}
      <style>{`
        @keyframes tideWave {
          0% { transform: translateX(0); }
          50% { transform: translateX(-20%); }
          100% { transform: translateX(0); }
        }
        @keyframes fishTailWag {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(14deg); }
        }
        @keyframes fishBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-1.5px); }
        }
        @keyframes bubbleAscend {
          0% { transform: translateY(4px) scale(0.6); opacity: 0; }
          40% { opacity: 0.9; }
          100% { transform: translateY(-10px) scale(1.1); opacity: 0; }
        }
        .anim-tide-wave {
          animation: tideWave 4s ease-in-out infinite;
        }
        .anim-tail-wag {
          transform-origin: 14px 7px;
          animation: fishTailWag 0.6s ease-in-out infinite;
        }
        .anim-fish-bob {
          animation: fishBob 2.2s ease-in-out infinite;
        }
        .anim-bubble-1 {
          animation: bubbleAscend 2.5s ease-in-out infinite;
        }
        .anim-bubble-2 {
          animation: bubbleAscend 2.8s ease-in-out infinite 0.9s;
        }
        .anim-bubble-3 {
          animation: bubbleAscend 3.1s ease-in-out infinite 1.6s;
        }
      `}</style>

      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={`Toggle theme: currently ${isDark ? 'Dark Oceanic Tide' : 'Light Sunlit Shallows'}`}
        onClick={toggleTheme}
        onKeyDown={handleKeyDown}
        title={`Tide Mode: ${isDark ? 'Rising Midnight Tide (Dark)' : 'Sunlit Shallow Shallows (Light)'} • Click to toggle`}
        className={`relative inline-flex items-center h-8 w-[76px] p-1 rounded-full cursor-pointer select-none overflow-hidden transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 group active:scale-95 ${
          isDark
            ? 'bg-[#060D1A] border border-cyan-500/40 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8),0_0_14px_rgba(6,182,212,0.25)]'
            : 'bg-[#EBF7FD] border border-sky-300/80 shadow-[inset_0_2px_4px_rgba(14,165,233,0.18),0_2px_8px_rgba(0,0,0,0.06)]'
        } ${className}`}
      >
        {/* ======================================================== */}
        {/* 1. THE RISING / FALLING TIDE WATER CHAMBER                */}
        {/* ======================================================== */}
        <div
          className={`absolute inset-x-0 bottom-0 transition-all duration-700 ease-out pointer-events-none ${
            isDark ? 'h-[92%]' : 'h-[62%]'
          }`}
        >
          {/* Animated Undulating Wave Surface */}
          <div className="absolute inset-x-0 -top-2 h-3.5 overflow-hidden">
            <svg
              viewBox="0 0 160 14"
              preserveAspectRatio="none"
              className="w-[200%] h-full anim-tide-wave"
            >
              <path
                d="M0,7 C20,13 40,1 60,7 C80,13 100,1 120,7 C140,13 160,1 180,7 L180,14 L0,14 Z"
                fill={isDark ? 'rgba(6, 182, 212, 0.45)' : 'rgba(56, 189, 248, 0.55)'}
              />
              <path
                d="M0,8 C25,2 50,14 75,8 C100,2 125,14 150,8 C175,2 200,14 225,8 L225,14 L0,14 Z"
                fill={isDark ? 'rgba(14, 116, 144, 0.6)' : 'rgba(125, 211, 252, 0.65)'}
              />
            </svg>
          </div>

          {/* Body of Water (Deep Oceanic in Dark Mode vs Sunlit Turquoise in Light) */}
          <div
            className={`w-full h-full transition-colors duration-700 ${
              isDark
                ? 'bg-gradient-to-t from-[#03152A] via-[#052847]/90 to-[#084566]/80'
                : 'bg-gradient-to-t from-[#38BDF8]/60 via-[#7DD3FC]/50 to-[#BAE6FD]/40'
            }`}
          />
        </div>

        {/* ======================================================== */}
        {/* 2. RISING MICRO OXYGEN BUBBLES                           */}
        {/* ======================================================== */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="absolute bottom-1 left-4 w-1 h-1 rounded-full bg-white/70 anim-bubble-1" />
          <span className="absolute bottom-2 left-10 w-1.5 h-1.5 rounded-full bg-white/60 anim-bubble-2" />
          <span className="absolute bottom-1.5 left-14 w-0.5 h-0.5 rounded-full bg-white/80 anim-bubble-3" />
        </div>

        {/* ======================================================== */}
        {/* 3. TINY SWIMMING GOLDFISH                                */}
        {/* ======================================================== */}
        <div
          className={`absolute z-10 top-1/2 -translate-y-1/2 transition-all duration-700 ease-out pointer-events-none ${
            isDark
              ? 'left-[14px] scale-x-100'
              : 'left-[38px] -scale-x-100'
          }`}
        >
          <div className="anim-fish-bob">
            <svg
              viewBox="0 0 22 14"
              className="w-5 h-3.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
            >
              <defs>
                {/* Goldfish Shimmering Body Gradient */}
                <linearGradient id="tideFishBody" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFA41C" />
                  <stop offset="45%" stopColor="#FF6B00" />
                  <stop offset="100%" stopColor="#E63900" />
                </linearGradient>

                {/* Translucent Goldfish Fin Gradient */}
                <linearGradient id="tideFishFin" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFE082" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#FF7043" stopOpacity="0.65" />
                </linearGradient>
              </defs>

              {/* Swimming Goldfish Tail Fin (Wags with CSS) */}
              <g className="anim-tail-wag">
                <path
                  d="M13.5,7 C16.5,4 20,3 19,7 C20,11 16.5,10 13.5,7 Z"
                  fill="url(#tideFishFin)"
                />
                <path
                  d="M14,7 C16,5.5 18,5 17.5,7 C18,9 16,8.5 14,7 Z"
                  fill="#FFD54F"
                  opacity="0.8"
                />
              </g>

              {/* Dorsal Fin (Top) */}
              <path
                d="M7.5,4.5 C9,2.8 11.5,3.2 12,4.5 Z"
                fill="url(#tideFishFin)"
              />

              {/* Streamlined Body */}
              <path
                d="M3.5,7 C5,4.2 11,4.2 14,7 C11,9.8 5,9.8 3.5,7 Z"
                fill="url(#tideFishBody)"
              />

              {/* Ventral Fin (Bottom) */}
              <path
                d="M7,8.8 C8,10.2 9.5,10 9.2,8.8 Z"
                fill="url(#tideFishFin)"
              />

              {/* Gills Accent */}
              <path
                d="M6,5.8 C6.8,6.5 6.8,7.5 6,8.2"
                stroke="#FFB300"
                strokeWidth="0.6"
                strokeLinecap="round"
                fill="none"
              />

              {/* Cute Eye & Specular Glint */}
              <circle cx="5" cy="6.4" r="0.85" fill="#1A1C23" />
              <circle cx="4.75" cy="6.15" r="0.3" fill="#FFFFFF" />
            </svg>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. MINI REFRACTIVE LIQUID BUBBLE HANDLE                   */}
        {/* ======================================================== */}
        <div
          className={`relative z-20 w-6 h-6 rounded-full transition-transform duration-500 ease-out transform pointer-events-none ${
            isDark ? 'translate-x-[44px]' : 'translate-x-0'
          }`}
        >
          {/* Refractive Bubble Body with Glassmorphism & Caustics */}
          <div
            className="w-full h-full rounded-full backdrop-blur-sm relative overflow-hidden transition-all duration-300"
            style={{
              background: isDark
                ? 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.7) 0%, rgba(34, 211, 238, 0.3) 35%, rgba(6, 182, 212, 0.1) 70%, rgba(255, 255, 255, 0.25) 100%)'
                : 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.9) 0%, rgba(224, 242, 254, 0.5) 40%, rgba(56, 189, 248, 0.15) 75%, rgba(255, 255, 255, 0.5) 100%)',
              border: isDark
                ? '1px solid rgba(255, 255, 255, 0.75)'
                : '1px solid rgba(255, 255, 255, 0.95)',
              boxShadow: isDark
                ? '0 3px 10px rgba(0, 0, 0, 0.5), inset 0 1.5px 3px rgba(255, 255, 255, 0.8), inset 0 -1.5px 4px rgba(6, 182, 212, 0.5), 0 0 10px rgba(34, 211, 238, 0.4)'
                : '0 3px 8px rgba(14, 165, 233, 0.25), inset 0 1.5px 3px rgba(255, 255, 255, 0.95), inset 0 -1.5px 3px rgba(56, 189, 248, 0.35)',
            }}
          >
            {/* Primary Top-Left Specular Refractive Crescent Glint */}
            <div className="absolute top-[2px] left-[3px] w-2 h-1 rounded-full bg-white/95 transform -rotate-45 blur-[0.2px]" />

            {/* Secondary Micro Sparkle */}
            <div className="absolute top-[3px] left-[7px] w-0.5 h-0.5 rounded-full bg-white/90" />

            {/* Bottom-Right Subsurface Caustic Highlight */}
            <div
              className={`absolute bottom-[2px] right-[3px] w-1.5 h-0.5 rounded-full ${
                isDark ? 'bg-cyan-300/70' : 'bg-sky-200/80'
              } blur-[0.3px]`}
            />
          </div>
        </div>
      </button>
    </>
  )
}
