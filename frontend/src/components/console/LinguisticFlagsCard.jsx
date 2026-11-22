import React from 'react'
import { AlertTriangle, Zap, ShieldAlert } from 'lucide-react'

export default function LinguisticFlagsCard({ flags }) {
  if (!flags || flags.length === 0) {
    return null
  }

  const severityStyles = {
    High: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30',
    Medium: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
    Low: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30',
  }

  return (
    <div className="p-6 sm:p-7 rounded-3xl glass-card-elevated border border-slate-200/80 dark:border-border-glass shadow-sm transition-colors duration-200 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200/80 dark:border-white/5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                06 // SCAM & PANIC TRIGGERS
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Layer 4: Psychological Flags
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Automated detection of panic-mongering, authority spoofing, and viral propagation triggers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flags.map((flag, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    {flag.trigger}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border shadow-sm ${
                      severityStyles[flag.severity] || severityStyles.Low
                    }`}
                  >
                    {flag.severity} Severity
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-white dark:bg-black/20 p-2.5 rounded-lg border border-slate-200 dark:border-white/5 font-mono shadow-inner">
                  "{flag.evidence}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bento Bottom Status Bar */}
      <div className="mt-5 pt-3 border-t border-slate-200/80 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 font-mono">
        <span>Manipulation Filter</span>
        <span className="font-semibold text-amber-600 dark:text-amber-400">
          {flags.length} Flag{flags.length > 1 ? 's' : ''} Triggered
        </span>
      </div>
    </div>
  )
}
