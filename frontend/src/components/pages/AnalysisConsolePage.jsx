import React, { useState, useRef } from 'react'
import {
  ShieldAlert,
  AlertCircle,
  Flag,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  Layers,
  Activity,
  FileCheck,
} from 'lucide-react'
import IntakeConsole from '../console/IntakeConsole'
import ScoreDial from '../console/ScoreDial'
import VisualForensicsCard from '../console/VisualForensicsCard'
import AudioForensicsCard from '../console/AudioForensicsCard'
import AtomicClaimsCard from '../console/AtomicClaimsCard'
import LinguisticFlagsCard from '../console/LinguisticFlagsCard'
import WhatsAppCard from '../console/WhatsAppCard'
import ReportModal from '../console/ReportModal'

export default function AnalysisConsolePage({
  initialSampleTrigger,
  onCopyToast,
  backendStatus = 'connected',
  onRetryHealth,
}) {
  const [currentResult, setCurrentResult] = useState(null)
  const [originalImagePreview, setOriginalImagePreview] = useState(null)
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  const reportRef = useRef(null)

  const handleInputChange = () => {
    // When user types or uploads new content, immediately vanish previous analysis
    if (currentResult) {
      setCurrentResult(null)
      setOriginalImagePreview(null)
      setAudioPreviewUrl(null)
    }
  }

  const handleAnalysisStart = () => {
    // Clear any previous analysis when starting a new scan
    setCurrentResult(null)
    setOriginalImagePreview(null)
    setAudioPreviewUrl(null)
  }

  const handleAnalysisComplete = (result, imagePreview, audioPreview) => {
    setCurrentResult(result)
    setOriginalImagePreview(imagePreview || null)
    setAudioPreviewUrl(audioPreview || null)
    setTimeout(() => {
      reportRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 150)
  }

  const handleReset = () => {
    setCurrentResult(null)
    setOriginalImagePreview(null)
    setAudioPreviewUrl(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hasFlags =
    currentResult?.linguistic_flags && currentResult.linguistic_flags.length > 0

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-primary px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              FORENSIC WORKSPACE
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">•</span>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              Bento Architecture
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Forensic Analysis Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Real-time multimodal intake for claim text, web articles, image ELA, and voice notes.
          </p>
        </div>

        {currentResult && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 text-xs font-semibold transition-all self-start sm:self-auto shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Analysis</span>
          </button>
        )}
      </div>

      {/* Backend Disconnection Advisory Banner */}
      {backendStatus === 'disconnected' && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-800 dark:text-rose-300 shadow-sm transition-all">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>
              <strong>Forensic Engine Offline:</strong> Unable to connect to the SatyaLens FastAPI engine on <code>http://localhost:8000</code>. Please start the backend service.
            </span>
          </div>
          {onRetryHealth && (
            <button
              onClick={onRetryHealth}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs self-start sm:self-auto transition-all shadow-sm shrink-0"
            >
              Retry Connection
            </button>
          )}
        </div>
      )}

      {/* 1. Multimodal Intake Console (Bento Style) */}
      <IntakeConsole
        onAnalysisStart={handleAnalysisStart}
        onAnalysisComplete={handleAnalysisComplete}
        onInputChange={handleInputChange}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        initialSampleTrigger={initialSampleTrigger}
      />

      {/* 2. Bento Grid Forensic Audit Report */}
      {currentResult && (
        <div ref={reportRef} className="space-y-6 pt-2">
          {/* Bento Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-primary" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                AUDIT DOSSIER // BENTO SPECIFICATION
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              ID: SL-{Math.abs(currentResult.overall_score * 31 + 1042)}
            </span>
          </div>

          {/* BENTO GRID CELLS CONTAINER */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* 🍱 BENTO CELL 1: Score & Verdict Dial (Span 4) */}
            <div className="md:col-span-5 lg:col-span-4 rounded-3xl glass-card-elevated border border-slate-200/80 dark:border-border-glass p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl pointer-events-none group-hover:bg-brand-primary/10 transition-colors" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                    01 // CONFIDENCE GAUGE
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-brand-primary">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="py-2">
                  <ScoreDial
                    score={currentResult.overall_score}
                    verdict={currentResult.verdict}
                    size={170}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span>Provenance:</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">
                  {currentResult.provenance_category || 'Claim Check'}
                </span>
              </div>
            </div>

            {/* 🍱 BENTO CELL 2: Executive Summary & Engine Tier (Span 8) */}
            <div className="md:col-span-7 lg:col-span-8 rounded-3xl glass-card-elevated border border-slate-200/80 dark:border-border-glass p-6 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200/80 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                      02 // EXECUTIVE INTELLIGENCE
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-mono text-slate-700 dark:text-slate-300">
                      Layer 1 Verified
                    </span>
                  </div>

                  {/* Engine Used Pill */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-700 dark:text-blue-300 self-start sm:self-auto">
                    <Sparkles className="w-3 h-3 text-brand-primary" />
                    <span className="truncate max-w-[260px]">
                      {currentResult.engine_used || 'SatyaLens Core'}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                  Forensic Assessment Summary
                </h3>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-sm leading-relaxed">
                  <p className="text-sm text-slate-800 dark:text-slate-200 font-sans">
                    {currentResult.summary}
                  </p>
                </div>
              </div>

              {/* Bottom Card Action Bar */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  Multi-source consensus corroborated
                </span>
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Report Inaccuracy</span>
                </button>
              </div>
            </div>

            {/* 🍱 BENTO CELL 3: Deterministic Visual Forensics (Span 12 when image exists) */}
            {currentResult.visual_forensics?.has_image && (
              <div className="col-span-12 rounded-3xl overflow-hidden">
                <VisualForensicsCard
                  visualForensics={currentResult.visual_forensics}
                  originalImagePreview={originalImagePreview}
                />
              </div>
            )}

            {/* 🍱 BENTO CELL 4: Audio Forensics (Span 12 when audio exists) */}
            {currentResult.audio_forensics?.has_audio && (
              <div className="col-span-12 rounded-3xl overflow-hidden">
                <AudioForensicsCard
                  audioForensics={currentResult.audio_forensics}
                  audioPreviewUrl={audioPreviewUrl}
                />
              </div>
            )}

            {/* 🍱 BENTO CELL 5: Atomic Claims (Span 7 or 12) */}
            {currentResult.atomic_claims && currentResult.atomic_claims.length > 0 && (
              <div
                className={`${
                  hasFlags ? 'col-span-12 lg:col-span-7' : 'col-span-12'
                } rounded-3xl overflow-hidden flex flex-col`}
              >
                <AtomicClaimsCard atomicClaims={currentResult.atomic_claims} />
              </div>
            )}

            {/* 🍱 BENTO CELL 6: Linguistic & Psychological Flags (Span 5) */}
            {hasFlags && (
              <div className="col-span-12 lg:col-span-5 rounded-3xl overflow-hidden flex flex-col">
                <LinguisticFlagsCard flags={currentResult.linguistic_flags} />
              </div>
            )}

            {/* 🍱 BENTO CELL 7: Counter-Spread WhatsApp Fact Card (Span 12) */}
            {(currentResult.whatsapp_card_en || currentResult.whatsapp_card_hi) && (
              <div className="col-span-12 rounded-3xl overflow-hidden">
                <WhatsAppCard
                  cardEn={currentResult.whatsapp_card_en}
                  cardHi={currentResult.whatsapp_card_hi}
                  onCopyToast={onCopyToast}
                />
              </div>
            )}

            {/* 🍱 BENTO CELL 8: Civic Disclaimer Notice (Span 12) */}
            <div className="col-span-12 rounded-3xl bg-amber-500/10 border border-amber-500/30 p-5 text-xs text-slate-800 dark:text-slate-300 flex items-start gap-3 leading-relaxed shadow-sm">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">
                  Civic Verification & Forensic Limitation Disclaimer:
                </span>
                SatyaLens is an automated assistive forensic engine. While our models cross-reference live search indices and deterministic compression metrics, AI models and web groundings may occasionally produce inaccuracies or incomplete assessments during breaking news events. Always verify critical electoral, legal, or health claims across primary official records.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Inaccuracy Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitSuccess={() => {
          if (onCopyToast) onCopyToast('Report submitted! Thank you for helping calibrate our models.')
        }}
      />
    </div>
  )
}
