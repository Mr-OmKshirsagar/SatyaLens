import React, { useState } from 'react'
import { Share2, Copy, Check, MessageCircle } from 'lucide-react'

export default function WhatsAppCard({ cardEn, cardHi, onCopyToast }) {
  const [activeLang, setActiveLang] = useState('en') // 'en' | 'hi'
  const [copied, setCopied] = useState(false)

  const activeContent = activeLang === 'en' ? cardEn : cardHi

  const handleCopy = () => {
    if (!activeContent) return
    navigator.clipboard.writeText(activeContent)
    setCopied(true)
    if (onCopyToast) {
      onCopyToast(
        activeLang === 'en'
          ? 'WhatsApp Fact Card (English) copied to clipboard!'
          : 'व्हाट्सएप फैक्ट कार्ड (हिंदी) क्लिपबोर्ड पर कॉपी हो गया!'
      )
    }
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="p-6 sm:p-7 rounded-3xl glass-card-elevated border border-slate-200/80 dark:border-border-glass shadow-sm transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/80 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                07 // COUNTER-SPREAD FACT CARDS
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Layer 5: WhatsApp Counter-Spread Fact Card
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              One-click shareable verification summary formatted to stop viral chains in chat groups
            </p>
          </div>
        </div>

        {/* Language Tabs & Copy Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100/90 dark:bg-white/5 p-1 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-sm">
            <button
              onClick={() => setActiveLang('en')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeLang === 'en'
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setActiveLang('hi')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeLang === 'hi'
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              हिंदी (Hindi)
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Card'}</span>
          </button>
        </div>
      </div>

      {/* WhatsApp Message Bubble Container */}
      <div className="relative rounded-2xl bg-[#EFEAE2] dark:bg-[#0b141a] border border-[#DAD3CC] dark:border-emerald-500/20 p-5 font-mono text-xs shadow-inner transition-colors duration-200">
        <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] text-emerald-800 dark:text-emerald-400/80 font-sans font-medium">
          <span>WhatsApp Formatted</span>
        </div>
        <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-800 dark:text-slate-200">
          {activeContent || 'Fact card content unavailable.'}
        </pre>
      </div>

      {/* Bento Bottom Status Bar */}
      <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 font-mono">
        <span>Dual-Language Broadcast Format</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
          English / हिन्दी Ready
        </span>
      </div>
    </div>
  )
}
