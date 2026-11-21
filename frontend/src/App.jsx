import React, { useState } from 'react'
import { ShieldCheck, Sparkles, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import ForensicIntakeConsole from './components/ForensicIntakeConsole'

export default function App() {
  const [currentResult, setCurrentResult] = useState(null)

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans selection:bg-accent/30 selection:text-white">
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 flex flex-col items-center">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NxtWave Idea Forge Hackathon — Track 1</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-white">
            Stop Viral Misinformation at the Source
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Multi-modal verification combining pixel-level Error Level Analysis (ELA), live Google Search grounding, psychological scam detection, and 1-click WhatsApp Fact Cards.
          </p>
        </motion.div>

        {/* Forensic Intake Console (Step 6) */}
        <ForensicIntakeConsole
          onAnalysisStart={() => setCurrentResult(null)}
          onAnalysisComplete={(res) => setCurrentResult(res)}
          onReset={() => setCurrentResult(null)}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border py-4 px-4 text-center text-xs text-slate-500 font-mono">
        SatyaLens © 2026 • Real-Time Fact-Verification & Deepfake Audit Engine • Zero-Auth Hackathon Mode
      </footer>
    </div>
  )
}
