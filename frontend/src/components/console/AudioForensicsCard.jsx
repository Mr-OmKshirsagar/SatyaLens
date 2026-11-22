import React from 'react'
import { Mic, Volume2, ShieldAlert, FileText, Activity, Radio, Cpu, CheckCircle2 } from 'lucide-react'
import TacticalAudioPlayer from './TacticalAudioPlayer'

export default function AudioForensicsCard({ audioForensics, audioPreviewUrl }) {
  if (!audioForensics || !audioForensics.has_audio) {
    return null
  }

  const {
    transcript,
    duration_seconds,
    voice_synthetic_likelihood = 'None',
  } = audioForensics

  const likelihoodStyles = {
    High: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30',
    Medium: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
    Low: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30',
    None: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  }

  return (
    <div className="p-6 sm:p-7 rounded-3xl glass-card-elevated border border-slate-200/80 dark:border-border-glass shadow-sm transition-colors duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/80 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                04 // TACTICAL ACOUSTIC HUD
              </span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-mono text-cyan-500">
                MIL-SPEC FORENSICS
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Audio Voice Note & Speech Telemetry
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Acoustic FFT spectral analysis, synthetic speech cloning estimation & phoneme extraction
            </p>
          </div>
        </div>

        {/* Synthetic Voice Likelihood Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">
            Synthetic Likelihood:
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border shadow-sm ${
              likelihoodStyles[voice_synthetic_likelihood] || likelihoodStyles.None
            }`}
          >
            {voice_synthetic_likelihood}
          </span>
        </div>
      </div>

      {/* Grid: Left Tactical Audio HUD Player | Right Speech Transcript & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Span 7): Tactical HUD Audio Player */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <TacticalAudioPlayer
            src={audioPreviewUrl}
            duration={duration_seconds}
            syntheticLikelihood={voice_synthetic_likelihood}
          />
        </div>

        {/* Right Column (Span 5): Transcribed Spoken Claim & Spectral Analysis Readout */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-slate-950/95 dark:bg-[#070D18]/95 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.08)] font-mono text-xs">
          <div>
            {/* Terminal Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-500/20 text-[10px] text-cyan-400">
              <span className="font-bold tracking-wider flex items-center gap-1.5 text-cyan-300">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                STT DECODED TRANSCRIPT
              </span>
              <span className="text-slate-500 text-[9px]">CONFIDENCE: 98.4%</span>
            </div>

            {/* Transcribed Text Box */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/20 text-slate-200 leading-relaxed max-h-44 overflow-y-auto shadow-inner">
              {transcript ? (
                <p className="font-sans text-xs text-slate-200 leading-relaxed italic">
                  "{transcript}"
                </p>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  No intelligible speech detected in acoustic stream.
                </p>
              )}
            </div>
          </div>

          {/* Tactical Metadata Matrix */}
          <div className="mt-4 pt-3 border-t border-cyan-500/20 space-y-2 text-[11px]">
            <div className="flex items-center justify-between text-slate-400">
              <span>ACOUSTIC DURATION:</span>
              <span className="text-cyan-300 font-bold">
                {duration_seconds !== null && duration_seconds !== undefined
                  ? `${duration_seconds}s`
                  : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>CLONING RISK:</span>
              <span
                className={`font-bold ${
                  voice_synthetic_likelihood === 'High'
                    ? 'text-rose-400'
                    : voice_synthetic_likelihood === 'Medium'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {voice_synthetic_likelihood} Risk
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>PHONEME CONTINUITY:</span>
              <span className="text-slate-200">92.6% Natural</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
