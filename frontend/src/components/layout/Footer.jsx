import React from 'react'
import { ShieldCheck, Github, Linkedin } from 'lucide-react'

export default function Footer({ setActivePage }) {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-border-glass bg-slate-100/70 dark:bg-surface-dark/60 backdrop-blur-md py-12 px-4 sm:px-6 lg:px-8 mt-auto text-slate-600 dark:text-slate-400 text-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight">SatyaLens</span>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Civic Fact-Verification & Deepfake Audit Engine
            </p>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
          <button
            onClick={() => {
              setActivePage('landing')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => {
              setActivePage('console')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Analysis Console
          </button>
          <button
            onClick={() => {
              setActivePage('feedback')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Feedback
          </button>
          <button
            onClick={() => {
              setActivePage('terms')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Terms & Conditions
          </button>
          <button
            onClick={() => {
              setActivePage('about')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            About Us
          </button>
        </div>

        {/* Social / Hackathon Info */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <a
            href="https://github.com/Mr-OmKshirsagar/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 shadow-sm transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <a
            href="https://linkedin.com/in/mromkshirsagar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 shadow-sm transition-colors"
          >
            <Linkedin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/5 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>© 2026 SatyaLens. Built for NxtWave IDEA FORGE (Track 1: Civic Pulse).</p>
        <p className="flex items-center gap-1">
          Designed with Material Design & Glassmorphism
        </p>
      </div>
    </footer>
  )
}
