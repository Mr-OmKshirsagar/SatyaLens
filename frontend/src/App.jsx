import React from 'react'
import { ShieldCheck, Activity, Cpu, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function App() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="border-b border-surface-border bg-surface/80 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-lg shadow-accent/20 border border-accent/40">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-accent text-transparent bg-clip-text">
                  SatyaLens
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-semibold tracking-wide">
                  CIVIC PULSE MVP
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Real-Time Fact-Verification & Deepfake Audit Engine
              </p>
            </div>
          </div>

          {/* Engine Status Indicator (Zero-Auth Incognito) */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-surface border border-surface-border text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-verdict-verified opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-verdict-verified"></span>
            </span>
            <span className="text-slate-300">Forensics Core</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-semibold">Active</span>
          </div>
        </div>
      </header>

      {/* Main Content Scaffold */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NxtWave Idea Forge Hackathon — Track 1</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-white">
            Stop Viral Misinformation at the Source
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Multimodal fact-checking combining pixel-level Error Level Analysis (ELA), Google Search grounding, linguistic manipulation flags, and one-click WhatsApp Fact Cards.
          </p>
        </motion.div>

        {/* Scaffold Readiness Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full max-w-xl bg-surface rounded-xl border border-surface-border p-6 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-emerald-400 to-accent"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-base">Step 5 Frontend Scaffold Ready</h2>
              <p className="text-xs text-slate-400 font-mono">Tailwind CSS • Framer Motion • Lucide React</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs font-mono bg-background/80 rounded-lg p-4 border border-surface-border text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Target API:</span>
              <span className="text-accent">{apiUrl}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Design Tokens:</span>
              <span className="text-emerald-400">Dark Cybersecurity (docs/design.md)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Next Step:</span>
              <span className="text-amber-400">Step 6: Forensic Intake Console</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border py-4 px-4 text-center text-xs text-slate-500 font-mono">
        SatyaLens © 2026 • Real-Time Fact-Verification & Deepfake Audit Engine • Zero-Auth Hackathon Mode
      </footer>
    </div>
  )
}

