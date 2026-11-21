import React, { useState } from 'react'
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  XCircle,
  ShieldAlert,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Eye,
  Cpu,
  Share2,
  Sparkles,
  Info,
  Camera,
  Wrench,
  AlertOctagon,
  ArrowUpRight,
  RotateCcw,
  Mic,
  Volume2,
  Activity,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ForensicAuditReport({ audit, originalImagePreview, onNewAnalysis }) {
  if (!audit) return null

  const [whatsappLang, setWhatsappLang] = useState('en') // 'en' | 'hi'
  const [copied, setCopied] = useState(false)
  const [imageTab, setImageTab] = useState('compare') // 'compare' | 'ela' | 'original'

  const score = audit.overall_score ?? 0
  const verdict = audit.verdict || 'Unverified'

  // Verdict style mapping
  const getVerdictTheme = (v) => {
    switch (v) {
      case 'Verified':
        return {
          bg: 'bg-emerald-500/15',
          border: 'border-emerald-500/40',
          text: 'text-emerald-400',
          glow: 'shadow-emerald-500/10',
          icon: CheckCircle2,
          color: '#10B981',
          description: 'High factual consistency across corroborating sources with no detected visual anomalies.',
        }
      case 'Misleading':
        return {
          bg: 'bg-amber-500/15',
          border: 'border-amber-500/40',
          text: 'text-amber-400',
          glow: 'shadow-amber-500/10',
          icon: AlertTriangle,
          color: '#F59E0B',
          description: 'Contains partially true facts stripped of critical context or distorted with sensationalist framing.',
        }
      case 'Fabricated':
        return {
          bg: 'bg-red-500/15',
          border: 'border-red-500/40',
          text: 'text-red-400',
          glow: 'shadow-red-500/10',
          icon: XCircle,
          color: '#EF4444',
          description: 'Completely debunked or synthetic claim contradicted by official records and verified sources.',
        }
      case 'Manipulated Media':
        return {
          bg: 'bg-red-500/15',
          border: 'border-red-500/40',
          text: 'text-red-400',
          glow: 'shadow-red-500/10',
          icon: ShieldAlert,
          color: '#EF4444',
          description: 'Visual or metadata forensics detected localized compression anomalies, digital alteration, or editing signatures.',
        }
      default:
        return {
          bg: 'bg-slate-500/15',
          border: 'border-slate-500/40',
          text: 'text-slate-300',
          glow: 'shadow-slate-500/10',
          icon: AlertOctagon,
          color: '#94A3B8',
          description: 'Insufficient public corroboration available to definitively confirm or debunk this claim.',
        }
    }
  }

  const theme = getVerdictTheme(verdict)
  const VerdictIcon = theme.icon

  // Copy WhatsApp Fact Card
  const activeCardText = whatsappLang === 'hi' ? audit.whatsapp_card_hi : audit.whatsapp_card_en
  const handleCopyCard = async () => {
    try {
      await navigator.clipboard.writeText(activeCardText || '')
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch (e) {
      console.error('Failed to copy to clipboard:', e)
    }
  }

  const hasImage = audit.visual_forensics?.has_image && audit.visual_forensics?.ela_heatmap_base64
  const hasAudio = audit.audio_forensics?.has_audio

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto space-y-6 mt-8"
      id="audit-report"
    >
      {/* ======================================================== */}
      {/* LAYER 1: SCORE & VERDICT CARD                            */}
      {/* ======================================================== */}
      <div className="bg-surface rounded-2xl border border-surface-border shadow-2xl overflow-hidden relative p-6 sm:p-8">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-emerald-400 to-accent"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-surface-border">
          {/* Verdict and Category */}
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-md bg-accent/10 border border-accent/25 text-accent font-semibold tracking-wider">
                {audit.provenance_category || 'Claim Check'}
              </span>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-surface border border-surface-border text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-slate-400" />
                {audit.engine_used || 'SatyaLens Engine'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${theme.bg} ${theme.border} border ${theme.text}`}>
                <VerdictIcon className="w-7 h-7" />
              </div>
              <div>
                <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${theme.text}`}>
                  {verdict}
                </h2>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  {theme.description}
                </p>
              </div>
            </div>
          </div>

          {/* Authenticity Score Dial */}
          <div className="flex items-center gap-4 bg-background/80 rounded-xl p-4 border border-surface-border self-stretch lg:self-auto justify-between lg:justify-start">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-border"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <motion.path
                  initial={{ strokeDasharray: '0, 100' }}
                  animate={{ strokeDasharray: `${score}, 100` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  stroke={theme.color}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                <span className="text-xl font-extrabold text-white leading-none">{score}</span>
                <span className="text-[10px] text-slate-400">/100</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-mono font-semibold text-slate-200 uppercase tracking-wider">
                Authenticity Score
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                {score >= 80 ? 'High Confidence (Genuine)' : score >= 40 ? 'Moderate Alert (Questionable)' : 'Critical Alert (High Falsehood)'}
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mt-6">
          <div className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-accent" />
            <span>Forensic Executive Summary</span>
          </div>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed bg-background/50 p-4 rounded-xl border border-surface-border">
            {audit.summary}
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* LAYER 2: VISUAL FORENSICS PANEL (WHEN HAS_IMAGE IS TRUE) */}
      {/* ======================================================== */}
      {hasImage && (
        <div className="bg-surface rounded-2xl border border-surface-border shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Layer 2: Deterministic Visual & Metadata Forensics
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Error Level Analysis (ELA) Heatmap & Hardware/Software EXIF Inspection
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-background border border-surface-border text-xs font-mono">
              <button
                type="button"
                onClick={() => setImageTab('compare')}
                className={`px-3 py-1.5 rounded-md transition ${
                  imageTab === 'compare' ? 'bg-surface text-accent font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Side-by-Side
              </button>
              <button
                type="button"
                onClick={() => setImageTab('ela')}
                className={`px-3 py-1.5 rounded-md transition ${
                  imageTab === 'ela' ? 'bg-surface text-accent font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                ELA Heatmap
              </button>
              <button
                type="button"
                onClick={() => setImageTab('original')}
                className={`px-3 py-1.5 rounded-md transition ${
                  imageTab === 'original' ? 'bg-surface text-accent font-semibold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Original
              </button>
            </div>
          </div>

          {/* Image Display Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(imageTab === 'compare' || imageTab === 'original') && (
              <div className="bg-background rounded-xl p-3 border border-surface-border flex flex-col items-center">
                <div className="text-xs font-mono text-slate-300 font-medium mb-2 self-start flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  Original Input Media
                </div>
                <div className="w-full h-64 sm:h-72 rounded-lg overflow-hidden bg-black flex items-center justify-center border border-surface-border/50">
                  <img
                    src={originalImagePreview || audit.visual_forensics.ela_heatmap_base64}
                    alt="Original Submitted Artifact"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            )}

            {(imageTab === 'compare' || imageTab === 'ela') && (
              <div className="bg-background rounded-xl p-3 border border-surface-border flex flex-col items-center">
                <div className="text-xs font-mono text-accent font-medium mb-2 self-start flex items-center justify-between w-full">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                    ELA Heatmap (Error Level Amplification)
                  </span>
                  <span className="text-[10px] text-slate-400">Quality: 90 / 15x Scale</span>
                </div>
                <div className="w-full h-64 sm:h-72 rounded-lg overflow-hidden bg-black flex items-center justify-center border border-surface-border/50 relative">
                  <img
                    src={audit.visual_forensics.ela_heatmap_base64}
                    alt="Error Level Analysis Heatmap"
                    className="max-h-full max-w-full object-contain"
                  />
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/80 backdrop-blur-sm border border-surface-border text-[10px] font-mono text-slate-300">
                    Amplified Variance
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ELA Guidance Note */}
          <div className="text-xs text-slate-400 bg-background/50 p-3.5 rounded-xl border border-surface-border font-mono leading-relaxed">
            <span className="text-accent font-semibold">How to read ELA:</span> Normal photos display uniform grain and compression artifacts. Inconsistent bright clusters, sharp edge discrepancies, or mismatched textures indicate localized splicing, text overlay insertions, or generative AI rendering.
          </div>

          {/* Metadata & EXIF Analysis Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            <div className="bg-background rounded-xl p-4 border border-surface-border">
              <div className="text-[11px] font-mono text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                Tampering Likelihood
              </div>
              <div
                className={`text-base font-extrabold font-mono ${
                  audit.visual_forensics.tampering_likelihood === 'High'
                    ? 'text-red-400'
                    : audit.visual_forensics.tampering_likelihood === 'Medium'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {audit.visual_forensics.tampering_likelihood}
              </div>
            </div>

            <div className="bg-background rounded-xl p-4 border border-surface-border">
              <div className="text-[11px] font-mono text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-accent" />
                Detected Software
              </div>
              <div className="text-sm font-semibold text-white font-mono truncate" title={audit.visual_forensics.exif_summary?.software || 'None'}>
                {audit.visual_forensics.exif_summary?.software || 'No editor detected'}
              </div>
            </div>

            <div className="bg-background rounded-xl p-4 border border-surface-border">
              <div className="text-[11px] font-mono text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-slate-300" />
                Camera Hardware
              </div>
              <div className="text-sm font-semibold text-white font-mono truncate" title={audit.visual_forensics.exif_summary?.camera_model || 'None'}>
                {audit.visual_forensics.exif_summary?.camera_model || 'No hardware metadata'}
              </div>
            </div>
          </div>

          {/* Anomalies List */}
          {audit.visual_forensics.exif_summary?.anomalies?.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-4">
              <div className="text-xs font-mono font-semibold text-red-300 uppercase mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>EXIF & Metadata Anomalies Flagged</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                {audit.visual_forensics.exif_summary.anomalies.map((anom, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">•</span>
                    <span>{anom}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* LAYER 2B: AUDIO VOICE NOTE FORENSICS (WHEN HAS_AUDIO)    */}
      {/* ======================================================== */}
      {hasAudio && (
        <div className="bg-surface rounded-2xl border border-surface-border shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Layer 2B: Audio & Synthetic Voice Forensics
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Acoustic analysis, deepfake voice clone probability & speech-to-text extraction
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-semibold self-start sm:self-auto">
              Voice Note Audited
            </span>
          </div>

          {/* Synthetic Voice Likelihood & Acoustic Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-background rounded-xl p-4 border border-surface-border">
              <div className="text-[11px] font-mono text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-purple-400" />
                Voice Clone Likelihood
              </div>
              <div
                className={`text-base font-extrabold font-mono ${
                  audit.audio_forensics.voice_synthetic_likelihood === 'High'
                    ? 'text-red-400'
                    : audit.audio_forensics.voice_synthetic_likelihood === 'Medium'
                    ? 'text-amber-400'
                    : audit.audio_forensics.voice_synthetic_likelihood === 'Low'
                    ? 'text-yellow-300'
                    : 'text-emerald-400'
                }`}
              >
                {audit.audio_forensics.voice_synthetic_likelihood || 'None'}
              </div>
            </div>

            <div className="bg-background rounded-xl p-4 border border-surface-border">
              <div className="text-[11px] font-mono text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-accent" />
                Speech Engine
              </div>
              <div className="text-sm font-semibold text-white font-mono">
                Multimodal Audio Pipeline
              </div>
            </div>

            <div className="bg-background rounded-xl p-4 border border-surface-border">
              <div className="text-[11px] font-mono text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-slate-300" />
                Acoustic Duration
              </div>
              <div className="text-sm font-semibold text-white font-mono">
                {audit.audio_forensics.duration_seconds
                  ? `${audit.audio_forensics.duration_seconds.toFixed(1)}s`
                  : 'Audio Stream'}
              </div>
            </div>
          </div>

          {/* Transcript Display */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-purple-400" />
              <span>Decoded Spoken Audio Transcript</span>
            </div>
            <div className="p-4 rounded-xl bg-background border border-surface-border text-sm text-slate-200 font-sans leading-relaxed whitespace-pre-wrap">
              {audit.audio_forensics.transcript || 'Spoken audio payload processed into claim decomposition.'}
            </div>
          </div>

          {/* Deepfake Voice Guidance */}
          <div className="text-xs text-slate-400 bg-background/50 p-3.5 rounded-xl border border-surface-border font-mono leading-relaxed">
            <span className="text-purple-400 font-semibold">How to read Audio Forensics:</span> Deepfake audio clones often exhibit unnatural spectral phase continuity, synthetic pitch flatlining, robotic formants, or lack of ambient room reverberation.
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* LAYER 3: ATOMIC CLAIMS & GROUNDED CITATIONS              */}
      {/* ======================================================== */}
      <div className="bg-surface rounded-2xl border border-surface-border shadow-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-surface-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                Layer 3: Atomic Claim Decomposition & Grounded Citations
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Verified claim-by-claim with live external search grounding citations
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-background border border-surface-border text-slate-300">
            {audit.atomic_claims?.length || 0} Claim(s)
          </span>
        </div>

        <div className="space-y-4">
          {audit.atomic_claims && audit.atomic_claims.length > 0 ? (
            audit.atomic_claims.map((claimItem, index) => {
              const claimStatus = claimItem.status || 'Unverified'
              const claimTheme = getVerdictTheme(claimStatus)
              const ClaimIcon = claimTheme.icon

              return (
                <div
                  key={index}
                  className="bg-background rounded-xl p-5 border border-surface-border hover:border-surface-border/80 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-start gap-2.5 flex-1">
                      <span className="text-xs font-mono text-accent font-bold px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
                        #{index + 1}
                      </span>
                      <h4 className="text-sm sm:text-base font-semibold text-white leading-snug">
                        {claimItem.claim}
                      </h4>
                    </div>
                    <span
                      className={`text-xs font-mono font-bold px-3 py-1 rounded-full border self-start sm:self-auto flex items-center gap-1.5 ${claimTheme.bg} ${claimTheme.border} ${claimTheme.text}`}
                    >
                      <ClaimIcon className="w-3.5 h-3.5" />
                      {claimStatus}
                    </span>
                  </div>

                  {claimItem.explanation && (
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-surface/50 p-3.5 rounded-lg border border-surface-border/60">
                      {claimItem.explanation}
                    </p>
                  )}

                  {/* Grounding Source Citations */}
                  {claimItem.sources && claimItem.sources.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[11px] font-mono text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                        <ExternalLink className="w-3 h-3 text-accent" />
                        <span>Corroborating / Debunking Citations</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {claimItem.sources.map((src, sIdx) => {
                          const isSafeLink = src.url && (src.url.startsWith('http://') || src.url.startsWith('https://'))
                          return isSafeLink ? (
                            <a
                              key={sIdx}
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-surface-border hover:border-accent text-xs font-mono text-accent hover:text-white transition group"
                            >
                              <span className="truncate max-w-[240px] sm:max-w-[320px]">
                                {src.title || src.url}
                              </span>
                              <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                            </a>
                          ) : (
                            <span
                              key={sIdx}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-xs font-mono text-slate-400"
                            >
                              {src.title || 'Official Statement'}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="text-center py-8 text-xs font-mono text-slate-400">
              No individual factual claims extracted.
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* LAYER 4: LINGUISTIC FLAGS & WHATSAPP COUNTER-FACT CARD   */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Layer 4A: Linguistic Manipulation & Scam-Hook Badges */}
        <div className="bg-surface rounded-2xl border border-surface-border shadow-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white tracking-tight">
                Psychological Manipulation Flags
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-mono mb-4">
              Viral triggers, false urgency, authority spoofing, and scam hooks
            </p>

            <div className="space-y-3">
              {audit.linguistic_flags && audit.linguistic_flags.length > 0 ? (
                audit.linguistic_flags.map((flag, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-3.5 rounded-xl bg-background border border-surface-border space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        {flag.trigger}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          flag.severity === 'High'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : flag.severity === 'Medium'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                        }`}
                      >
                        {flag.severity} Severity
                      </span>
                    </div>
                    {flag.evidence && (
                      <p className="text-xs text-slate-300 font-mono italic bg-surface/50 p-2 rounded border border-surface-border/40">
                        "{flag.evidence}"
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-xl bg-background border border-surface-border text-center text-xs font-mono text-slate-400">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  No high-risk psychological manipulation triggers detected.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-surface-border text-[11px] text-slate-400 font-mono">
            Analyzes coercive copy patterns designed to drive irrational forward behavior.
          </div>
        </div>

        {/* Layer 4B: Bilingual WhatsApp Fact Card (English & Hindi) */}
        <div className="bg-surface rounded-2xl border border-surface-border shadow-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white tracking-tight">
                  Counter-Spread WhatsApp Card
                </h3>
              </div>
              {/* Language Switcher */}
              <div className="flex items-center p-1 rounded-lg bg-background border border-surface-border text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setWhatsappLang('en')}
                  className={`px-2.5 py-1 rounded transition ${
                    whatsappLang === 'en' ? 'bg-emerald-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setWhatsappLang('hi')}
                  className={`px-2.5 py-1 rounded transition ${
                    whatsappLang === 'hi' ? 'bg-emerald-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  हिंदी
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-mono mb-4">
              Pre-formatted, copy-ready debunking summary for instant counter-messaging
            </p>

            {/* WhatsApp Card Display Preview */}
            <div className="p-4 rounded-xl bg-[#0F2027]/80 border border-emerald-500/25 font-mono text-xs text-slate-100 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto select-all shadow-inner">
              {activeCardText || 'WhatsApp card generation in progress...'}
            </div>
          </div>

          {/* 1-Click Copy Button */}
          <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">
              Ready to paste into WhatsApp groups
            </span>
            <button
              type="button"
              onClick={handleCopyCard}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold font-mono transition shadow-lg ${
                copied
                  ? 'bg-emerald-500 text-white shadow-emerald-500/25'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Fact Card</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Floating Reset / New Audit Action */}
      <div className="pt-4 flex justify-center">
        <button
          type="button"
          onClick={onNewAnalysis}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface border border-surface-border hover:border-accent text-slate-300 hover:text-white text-xs font-mono transition shadow-lg"
        >
          <RotateCcw className="w-3.5 h-3.5 text-accent" />
          <span>Start Another Forensic Audit</span>
        </button>
      </div>
    </motion.div>
  )
}
