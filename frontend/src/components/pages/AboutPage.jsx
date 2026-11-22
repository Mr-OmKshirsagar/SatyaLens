import React from 'react'
import {
  Users,
  ShieldCheck,
  Github,
  Linkedin,
  Mail,
  Award,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10 text-slate-700 dark:text-slate-300 transition-colors duration-200">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-600 dark:text-blue-400">
          <Users className="w-3.5 h-3.5" />
          <span>MISSION & ARCHITECTURE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About SatyaLens
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Defending civic integrity through deterministic media forensics, live search grounding, and WhatsApp counter-spread tools.
        </p>
      </div>

      {/* Hackathon Heritage */}
      <div className="p-6 rounded-2xl glass-card-elevated border border-slate-200/80 dark:border-border-glass flex flex-col sm:flex-row items-center gap-6 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary shrink-0">
          <Award className="w-8 h-8" />
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="font-bold text-slate-900 dark:text-white text-base">NxtWave IDEA FORGE 2026</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-semibold">
              TRACK 1
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Built for <strong>Civic Pulse, Digital Governance & Public Information</strong>. SatyaLens tackles the epidemic of viral forwarded rumors across digital messaging apps in India and global democracies.
          </p>
        </div>
      </div>

      {/* The Core Methodology */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">How SatyaLens Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">1. Deterministic Forensics</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Python-based Error Level Analysis (ELA) re-saves at JPEG quality 90 to isolate compression differentials, while EXIF parsers audit camera hardware tags.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">2. Live Search Grounding</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Multi-tier engine querying Google Search and DuckDuckGo in real-time, verifying ordinal claims (first vs second), dates, and official government press releases.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">3. WhatsApp Counter-Spread</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Synthesizes one-click shareable debunker cards in both English and Hindi Devanagari to deliver verified facts back into family and community chat groups.
            </p>
          </div>
        </div>
      </div>

      {/* Creator Profile Section */}
      <div className="p-8 rounded-2xl glass-card-elevated border border-slate-200/80 dark:border-border-glass space-y-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-primary" />
          <span>Creator Profile & Contact</span>
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-brand-primary/25 shrink-0">
            OK
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Om Kshirsagar — Full-Stack Engineer & Civic Technologist
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-w-lg">
              Passionate about building resilient, ethical AI systems, deterministic media forensics, and open public governance tools that bridge technology with democratic accountability.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
              <a
                href="https://github.com/Mr-OmKshirsagar/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white text-xs font-semibold border border-slate-200 dark:border-white/10 shadow-sm transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>github.com/Mr-OmKshirsagar</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              <a
                href="https://linkedin.com/in/mromkshirsagar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white text-xs font-semibold border border-slate-200 dark:border-white/10 shadow-sm transition-colors"
              >
                <Linkedin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>linkedin.com/in/mromkshirsagar</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
