import React from 'react'
import { CheckCircle2, AlertCircle, XCircle, HelpCircle, ExternalLink, ShieldCheck } from 'lucide-react'

export default function AtomicClaimsCard({ atomicClaims }) {
  if (!atomicClaims || atomicClaims.length === 0) {
    return null
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return {
          icon: CheckCircle2,
          color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
        }
      case 'Misleading':
        return {
          icon: AlertCircle,
          color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
        }
      case 'Fabricated':
        return {
          icon: XCircle,
          color: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30',
        }
      default:
        return {
          icon: HelpCircle,
          color: 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/30',
        }
    }
  }

  return (
    <div className="p-6 sm:p-7 rounded-3xl glass-card-elevated border border-slate-200/80 dark:border-border-glass shadow-sm transition-colors duration-200 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200/80 dark:border-white/5">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-brand-primary shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-primary">
                05 // GROUNDED CITATIONS
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Layer 3: Atomic Claim Decomposition
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Discrete claim isolation cross-referenced against live authoritative grounding sources
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {atomicClaims.map((item, index) => {
            const { icon: StatusIcon, color } = getStatusBadge(item.status)
            return (
              <div
                key={index}
                className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">
                    CLAIM #{index + 1}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border shadow-sm ${color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {item.status}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 leading-snug">
                  "{item.claim}"
                </h4>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                  {item.explanation}
                </p>

                {/* Citations & Source Links */}
                {item.sources && item.sources.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80 dark:border-white/5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1.5">
                      Grounded Reference Sources:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {item.sources.map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-black/20 hover:bg-blue-50 dark:hover:bg-brand-primary/20 border border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-brand-primary/40 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs transition-colors shadow-sm"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[220px]">{src.title || src.url}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Bento Bottom Status Bar */}
      <div className="mt-5 pt-3 border-t border-slate-200/80 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 font-mono">
        <span>Grounded Consensus</span>
        <span className="text-slate-800 dark:text-slate-200 font-semibold">
          {atomicClaims.length} Claim{atomicClaims.length > 1 ? 's' : ''} Scanned
        </span>
      </div>
    </div>
  )
}
