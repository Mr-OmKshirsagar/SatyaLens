import React from 'react'
import {
  Menu,
  Activity,
  ShieldCheck,
  Search,
  MessageSquareHeart,
  FileText,
  Users,
  Zap,
  ArrowRight,
} from 'lucide-react'
import { useTheme } from '../../lib/themeContext'
import TideThemeToggle from '../ui/TideThemeToggle'

export default function Navbar({
  activePage,
  isLanding = false,
  onToggleMobileSidebar,
  onOpenConsole,
  backendStatus = 'connected',
  onRetryHealth,
}) {
  const { theme, toggleTheme } = useTheme()

  const pageMeta = {
    landing: { title: 'Home / Overview', icon: ShieldCheck },
    console: { title: 'Analysis Console', icon: Search },
    feedback: { title: 'Community Feedback', icon: MessageSquareHeart },
    terms: { title: 'Terms & Conditions', icon: FileText },
    about: { title: 'About Us', icon: Users },
  }

  const currentPage = pageMeta[activePage] || pageMeta.landing
  const PageIcon = currentPage.icon

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-200/80 dark:border-border-glass backdrop-blur-md px-4 sm:px-6 py-3 transition-colors duration-200">
      <div className={`${isLanding ? 'max-w-7xl mx-auto' : ''} flex items-center justify-between`}>
        {/* Left Section */}
        {isLanding ? (
          /* Landing Page: Full brand presentation */
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center shadow-md shadow-brand-primary/25 border border-brand-primary/40">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-brand-primary dark:from-white dark:via-slate-100 dark:to-brand-primary text-transparent bg-clip-text">
                  SatyaLens
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-semibold tracking-wide">
                  CIVIC PULSE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block leading-none mt-0.5">
                Real-Time Fact-Verification & Deepfake Audit Engine
              </p>
            </div>
          </div>
        ) : (
          /* Workspace Pages: Sidebar toggle + Active Page Title */
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileSidebar}
              aria-label="Toggle navigation menu"
              className="md:hidden w-9 h-9 rounded-xl bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-border-glass flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
                <PageIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                {currentPage.title}
              </span>
            </div>
          </div>
        )}

        {/* Right Section: Core Active + Theme Switcher (+ Quick Console CTA if on Landing) */}
        <div className="flex items-center gap-3">
          {/* Landing Page Action Button */}
          {isLanding && onOpenConsole && (
            <button
              onClick={onOpenConsole}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold shadow-md shadow-brand-primary/20 transition-all hover:scale-105"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Launch Console</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          )}

          {/* Core Backend Status Pill */}
          {backendStatus === 'connected' ? (
            <div
              title="SatyaLens Forensic Engine is live & responding (FastAPI)"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-700 dark:text-emerald-400 shadow-sm transition-all"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-verdict-verified opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-verdict-verified"></span>
              </span>
              <span className="font-semibold">Core Active</span>
            </div>
          ) : backendStatus === 'disconnected' ? (
            <button
              onClick={onRetryHealth}
              title="Forensic engine is offline. Click to retry connecting to backend."
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-mono text-rose-700 dark:text-rose-400 shadow-sm transition-all cursor-pointer group"
            >
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="font-semibold group-hover:underline">Core Offline</span>
            </button>
          ) : (
            <div
              title="Checking connection to forensic engine..."
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-700 dark:text-amber-400 shadow-sm transition-all"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="font-semibold">Connecting...</span>
            </div>
          )}

          {/* Tide Theme Toggle: Streamlined toolbar pill with mini refractive bubble & swimming goldfish inside the rising tide */}
          <TideThemeToggle />
        </div>
      </div>
    </header>
  )
}
