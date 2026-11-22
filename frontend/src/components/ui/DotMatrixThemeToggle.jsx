import React from 'react'
import { useTheme } from '../../lib/themeContext'

// 5x5 Matrix Representations (1 = Active Glowing LED, 0 = Inactive LED)
const SUN_MATRIX = [
  [0, 0, 1, 0, 0],
  [0, 1, 1, 1, 0],
  [1, 1, 1, 1, 1],
  [0, 1, 1, 1, 0],
  [0, 0, 1, 0, 0],
]

const MOON_MATRIX = [
  [0, 1, 1, 1, 0],
  [1, 1, 0, 0, 0],
  [1, 1, 0, 0, 0],
  [1, 1, 0, 0, 0],
  [0, 1, 1, 1, 0],
]

export default function DotMatrixThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  const activeMatrix = isDark ? MOON_MATRIX : SUN_MATRIX

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleTheme()
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      title={`Active: ${isDark ? 'Dark Mode (Phosphor Cyan)' : 'Light Mode (Solar Amber)'} • Click to toggle`}
      className={`relative inline-flex items-center h-8 w-[68px] p-1 rounded-full cursor-pointer select-none transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 group ${
        isDark
          ? 'bg-slate-950/90 border border-cyan-500/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_0_12px_rgba(6,182,212,0.15)]'
          : 'bg-slate-200/90 border border-slate-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]'
      } ${className}`}
    >
      {/* Background Track Passive Dot Matrix Markers */}
      <div className="absolute inset-x-2 inset-y-1 flex items-center justify-between pointer-events-none px-1">
        {/* Left Track Ghost Marker (Sun 3-dot column) */}
        <div className="flex flex-col gap-1 opacity-35">
          <span className="w-1 h-1 rounded-full bg-amber-500" />
          <span className="w-1 h-1 rounded-full bg-amber-500" />
          <span className="w-1 h-1 rounded-full bg-amber-500" />
        </div>

        {/* Right Track Ghost Marker (Moon 3-dot column) */}
        <div className="flex flex-col gap-1 opacity-35">
          <span className="w-1 h-1 rounded-full bg-cyan-400" />
          <span className="w-1 h-1 rounded-full bg-cyan-400" />
          <span className="w-1 h-1 rounded-full bg-cyan-400" />
        </div>
      </div>

      {/* Sliding Pill Thumb with Embedded 5x5 LED Dot Matrix */}
      <div
        className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center p-[2.5px] transition-all duration-300 ease-out transform shadow-md ${
          isDark
            ? 'translate-x-[36px] bg-[#0A1220] border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
            : 'translate-x-0 bg-white border border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
        }`}
      >
        {/* 5x5 LED Dot Matrix Display */}
        <div className="grid grid-cols-5 gap-[1.5px] w-full h-full">
          {activeMatrix.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const isLit = cell === 1

              let dotClass = 'bg-slate-200/80 dark:bg-slate-800/80'
              if (isLit) {
                dotClass = isDark
                  ? 'bg-cyan-400 shadow-[0_0_4px_#22d3ee]'
                  : 'bg-amber-500 shadow-[0_0_4px_#f59e0b]'
              }

              return (
                <span
                  key={`${rIdx}-${cIdx}`}
                  className={`w-[2.5px] h-[2.5px] rounded-full transition-all duration-200 ${dotClass}`}
                />
              )
            })
          )}
        </div>
      </div>
    </button>
  )
}
