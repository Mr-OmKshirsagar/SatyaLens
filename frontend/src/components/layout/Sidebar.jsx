import React from 'react'
import {
  ShieldCheck,
  Search,
  MessageSquareHeart,
  FileText,
  Users,
  Award,
  Github,
  Linkedin,
  X,
} from 'lucide-react'

export default function Sidebar({ activePage, setActivePage, isOpen, onClose, onGoHome }) {
  // Home is removed from sidebar; only workspace pages are here
  const navItems = [
    { id: 'console', label: 'Analysis Console', icon: Search, desc: 'Multimodal Engine', hasPulse: true },
    { id: 'feedback', label: 'Community Feedback', icon: MessageSquareHeart, desc: 'Ratings & Insights' },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText, desc: 'Ethics & Accuracy' },
    { id: 'about', label: 'About Us', icon: Users, desc: 'Mission & Team' },
  ]

  const handleNavClick = (id) => {
    setActivePage(id)
    if (onClose) onClose()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleHomeClick = () => {
    if (onGoHome) onGoHome()
    else setActivePage('landing')
    if (onClose) onClose()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5">
      {/* Top Branding */}
      <div>
        <div className="flex items-center justify-between pb-5 border-b border-slate-200/80 dark:border-white/10 mb-6">
          <button
            onClick={handleHomeClick}
            className="flex items-center gap-3 text-left group focus:outline-none"
            title="SatyaLens (Click to return to Landing Page)"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-blue-700 flex items-center justify-center shadow-md shadow-brand-primary/25 border border-brand-primary/40 group-hover:scale-105 transition-transform shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-brand-primary dark:from-white dark:via-slate-100 dark:to-brand-primary text-transparent bg-clip-text">
                  SatyaLens
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                  CIVIC
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-tight">
                Forensics & Fact Engine
              </p>
            </div>
          </button>

          {/* Close button on mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Menu Links */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 block mb-2 font-bold">
            Workspace Views
          </span>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  />
                  <div className="truncate">
                    <div className="text-xs font-medium leading-none">{item.label}</div>
                    <div
                      className={`text-[10px] mt-1 leading-none truncate ${
                        isActive
                          ? 'text-blue-100 font-normal'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>

                {item.hasPulse && (
                  <span className="relative flex h-2 w-2 ml-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-verdict-verified opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-verdict-verified"></span>
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Bottom Section: Hackathon Badge & Social */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 space-y-3">
        {/* Hackathon Pill Box */}
        <div className="p-3 rounded-xl bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-3.5 h-3.5 text-brand-primary shrink-0" />
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              NxtWave IDEA FORGE
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
            Track 1: Civic Pulse & Digital Governance
          </p>
        </div>

        {/* External Links */}
        <div className="flex items-center justify-between text-xs px-1 text-slate-500 dark:text-slate-400">
          <a
            href="https://github.com/Mr-OmKshirsagar/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="text-[11px]">GitHub</span>
          </a>
          <span>•</span>
          <a
            href="https://linkedin.com/in/mromkshirsagar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span className="text-[11px]">LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-slate-200/80 dark:border-border-glass bg-white/70 dark:bg-surface-dark/70 backdrop-blur-xl z-40 shrink-0 transition-colors duration-200">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop blur */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
          />

          {/* Slide-over Container */}
          <div className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-border-glass shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
