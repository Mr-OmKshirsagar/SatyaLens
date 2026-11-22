import React from 'react'

export default function ScoreDial({ score = 0, verdict = 'Unverified', size = 160 }) {
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedScore = Math.min(100, Math.max(0, score))
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference

  // Color mapping based on score & verdict
  let strokeColor = '#94A3B8' // neutral
  let verdictBg = 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30'
  let glowClass = ''

  if (clampedScore >= 75 || verdict === 'Verified') {
    strokeColor = '#10B981' // emerald
    verdictBg = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
    glowClass = 'shadow-emerald-glow'
  } else if (clampedScore >= 45 || verdict === 'Misleading') {
    strokeColor = '#F59E0B' // amber
    verdictBg = 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
  } else {
    strokeColor = '#EF4444' // crimson
    verdictBg = 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30'
    glowClass = 'shadow-crimson-glow'
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative flex items-center justify-center rounded-full ${glowClass} transition-shadow duration-500`}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200 dark:text-white/5"
            fill="transparent"
          />
          {/* Animated Value Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>

        {/* Center Score & Verdict */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white">
            {clampedScore}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Score / 100
          </span>
        </div>
      </div>

      {/* Result Verdict Badge (1-2 Words) */}
      <div className={`mt-4 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${verdictBg} shadow-sm`}>
        {verdict}
      </div>
    </div>
  )
}
