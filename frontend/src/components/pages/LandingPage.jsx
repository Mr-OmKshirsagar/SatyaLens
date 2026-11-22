import React from 'react'
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Layers,
  Search,
  MessageSquare,
  Globe,
  FileText,
  Image as ImageIcon,
  Mic,
  CheckCircle2,
  XCircle,
  Activity,
  Award,
} from 'lucide-react'
import WordRotator from '../ui/WordRotator'
import CountUpStat from '../ui/CountUpStat'

export default function LandingPage({ onNavigateToConsole, onTriggerDemo }) {
  const comparisonData = [
    {
      feature: 'Image Tampering Detection',
      them: 'Guesses visually from blurry pixels with zero error analysis',
      us: 'Generates deterministic Error Level Analysis (ELA) heatmaps & analyzes localized patch variance',
    },
    {
      feature: 'Source Provenance',
      them: 'Hallucinates dead links or outdated static training data',
      us: 'Live Google Search grounding with clickable, verified corroborating citations',
    },
    {
      feature: 'WhatsApp Voice Notes',
      them: 'Incapable of processing local audio files or voice forwards',
      us: 'Transcribes multi-format voice notes & flags synthetic AI voice cloning likelihood',
    },
    {
      feature: 'Counter-Spread Readiness',
      them: 'Outputs dry paragraphs of text that no one reads on mobile',
      us: 'Generates one-click English & Hindi Devanagari cards ready for instant WhatsApp counter-messaging',
    },
    {
      feature: 'Psychological Scam Auditing',
      them: 'Ignores social engineering hooks and emotional manipulation',
      us: 'Detects False Urgency, Authority Spoofing, and Phishing triggers with snippet evidence',
    },
    {
      feature: 'System Resilience',
      them: 'Fails with 500 error when API keys run out of rate limits',
      us: '4-tier automatic failover ensures 100% uptime without service interruption',
    },
  ]

  const demoCards = [
    {
      id: 'viral_text',
      title: 'Viral Forward Text',
      subtitle: 'UNESCO Indian Anthem Hoax',
      desc: 'Test atomic claim extraction and live search debunker citations on a viral national pride claim.',
      icon: FileText,
      badge: 'TEXT CLAIM',
    },
    {
      id: 'fact_url',
      title: 'News Article URL',
      subtitle: 'Wikipedia Historical Grounding',
      desc: 'Verify web domain extraction through SSRF-protected trafilatura parsing and corroboration.',
      icon: Globe,
      badge: 'WEB EXTRACTION',
    },
    {
      id: 'meme_image',
      title: 'Manipulated Media',
      subtitle: '₹5000 Specimen Note Tamper',
      desc: 'Inspect localized JPEG compression differentials and ELA heatmaps detecting digitally spliced currency.',
      icon: ImageIcon,
      badge: 'IMAGE ELA',
    },
    {
      id: 'viral_audio',
      title: 'Viral Voice Note',
      subtitle: 'Emergency Lockdown Audio',
      desc: 'Transcribe WhatsApp audio recordings and estimate synthetic voice clone / deepfake likelihood.',
      icon: Mic,
      badge: 'AUDIO DEEPFAKE',
    },
  ]

  return (
    <div className="space-y-24 py-6">
      {/* 1. Hero Reveal Section */}
      <section className="relative text-center max-w-4xl mx-auto px-4 pt-8">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Hackathon Track Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-border-glass text-xs font-mono text-slate-700 dark:text-slate-300 mb-6 backdrop-blur-md shadow-sm">
          <Award className="w-3.5 h-3.5 text-brand-primary" />
          <span>NxtWave IDEA FORGE 2026 • Track 1: Civic Pulse & Digital Governance</span>
        </div>

        {/* Hero Title with Word Rotator */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
          Real-Time Forensic Engine for Verifying{' '}
          <br className="hidden sm:inline" />
          <WordRotator />
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto">
          Stop viral misinformation chains before they cause real-world panic. SatyaLens
          combines deterministic pixel-level Error Level Analysis (ELA), audio voice-note forensics,
          live Google Search grounding, and instant bilingual WhatsApp Fact Cards.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigateToConsole()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm shadow-xl shadow-brand-primary/25 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>Try It Yourself (Open Console)</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => onTriggerDemo('viral_text')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-border-glass text-sm font-semibold transition-all shadow-sm"
          >
            Run UNESCO Anthem Demo
          </button>
        </div>
      </section>

      {/* 2. Count-Up Stats Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CountUpStat
            number="4-Tier"
            label="Resilience Pipeline"
            subtext="Gemini 3.8 Grounded -> DDGS Smart Hybrid -> Groq Llama 3.3 -> Python Core."
            icon={Layers}
            delay={0.1}
          />
          <CountUpStat
            number="0 - 100"
            label="Authenticity Score"
            subtext="Granular mathematical confidence scale distinguishing nuance from total fabrication."
            icon={Activity}
            delay={0.2}
          />
          <CountUpStat
            number="2 Langs"
            label="WhatsApp Fact Cards"
            subtext="One-click plain text debunker cards in English & Hindi Devanagari for mobile chats."
            icon={MessageSquare}
            delay={0.3}
          />
          <CountUpStat
            number="< 3.2s"
            label="Grounded Latency"
            subtext="Fast deterministic image forensics coupled with parallel live web corroboration."
            icon={Zap}
            delay={0.4}
          />
        </div>
      </section>

      {/* 3. Demo Trials Showcase */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-primary">
            Interactive Test Drive
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Choose a Real-World Scenario to Verify
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Click any sample card below to immediately open the Analysis Console and watch the live forensic engine process the payload in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {demoCards.map((demo) => {
            const Icon = demo.icon
            return (
              <div
                key={demo.id}
                onClick={() => onTriggerDemo(demo.id)}
                className="p-5 rounded-2xl glass-card-elevated border border-slate-200/80 dark:border-border-glass hover:border-brand-primary/50 cursor-pointer group transition-all duration-300 flex flex-col justify-between hover:scale-[1.02] shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-400 font-semibold">
                      {demo.badge}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:text-brand-primary transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors mb-1">
                    {demo.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 font-mono">
                    {demo.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {demo.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-brand-primary">
                  <span>Verify Live</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 4. Us vs Them Section (Strictly Bold Concise Points) */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Architectural Differentiation
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Us vs. Them: Engineering Comparison
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Why SatyaLens delivers reliable civic accountability while shallow LLM wrappers fail.
          </p>
        </div>

        <div className="rounded-2xl glass-card-elevated border border-slate-200/80 dark:border-border-glass overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 bg-slate-100/90 dark:bg-white/5 p-4 border-b border-slate-200/80 dark:border-white/10 text-xs font-mono font-bold uppercase tracking-wider">
            <div className="md:col-span-3 text-slate-600 dark:text-slate-400">Capability Vector</div>
            <div className="md:col-span-4 text-rose-600 dark:text-rose-400 flex items-center gap-1.5 mt-2 md:mt-0">
              <XCircle className="w-4 h-4" />
              <span>Generic AI Chatbot / Shallow Checker</span>
            </div>
            <div className="md:col-span-5 text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mt-2 md:mt-0">
              <CheckCircle2 className="w-4 h-4" />
              <span>SatyaLens Civic Forensic Engine</span>
            </div>
          </div>

          <div className="divide-y divide-slate-200/80 dark:divide-white/5">
            {comparisonData.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 p-4 text-xs transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.02] gap-3"
              >
                <div className="md:col-span-3 font-bold text-slate-900 dark:text-white flex items-center">
                  {row.feature}
                </div>
                <div className="md:col-span-4 text-slate-700 dark:text-slate-400">
                  <span className="font-bold text-rose-700 dark:text-rose-300 block">
                    {row.them}
                  </span>
                </div>
                <div className="md:col-span-5 text-slate-700 dark:text-slate-200">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 block">
                    {row.us}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Review Status & Trust Verification Badge */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="p-6 rounded-2xl glass-card-elevated border border-slate-200/80 dark:border-border-glass flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-verdict-verified shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="font-bold text-base text-slate-900 dark:text-white">Civic Trust & Review Status</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-semibold">
                  AUDITED
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Zero-Auth Incognito • Memory-only ephemeral execution • Strict SSRF loopback boundary enforcement
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToConsole()}
            className="px-6 py-2.5 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-white text-xs font-semibold border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all shrink-0 shadow-sm"
          >
            Launch Console Now
          </button>
        </div>
      </section>
    </div>
  )
}
