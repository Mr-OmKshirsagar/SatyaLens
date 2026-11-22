import React, { useState } from 'react'
import { Eye, ShieldAlert, Cpu, Sparkles, Layers, AlertTriangle } from 'lucide-react'

export default function VisualForensicsCard({ visualForensics, originalImagePreview }) {
  const [viewMode, setViewMode] = useState('heatmap') // 'original' | 'heatmap'

  if (!visualForensics || !visualForensics.has_image) {
    return null
  }

  const {
    ela_heatmap_base64,
    tampering_likelihood = 'None',
    ela_metrics = {},
    exif_summary = {},
  } = visualForensics

  const likelihoodColors = {
    High: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30',
    Medium: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
    Low: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30',
    None: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  }

  return (
    <div className="p-6 sm:p-7 rounded-3xl glass-card-elevated border border-slate-200/80 dark:border-border-glass shadow-sm transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/80 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                03 // PIXEL ERROR LEVEL ANALYSIS
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Layer 2: Deterministic Visual & Metadata Forensics
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Pixel compression error analysis & EXIF hardware tampering inspection
            </p>
          </div>
        </div>

        {/* Tampering Likelihood Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 dark:text-slate-400">Tampering Likelihood:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border shadow-sm ${
              likelihoodColors[tampering_likelihood] || likelihoodColors.None
            }`}
          >
            {tampering_likelihood}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Viewer with Toggle */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="flex items-center justify-between bg-slate-100/90 dark:bg-white/5 p-1.5 rounded-xl border border-slate-200/80 dark:border-white/10 shadow-sm">
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium px-2">Preview Mode:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode('original')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'original'
                    ? 'bg-brand-primary text-white font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Original Image
              </button>
              <button
                onClick={() => setViewMode('heatmap')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'heatmap'
                    ? 'bg-purple-600 text-white font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ELA Heatmap (Compression)
              </button>
            </div>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-300 dark:border-white/10 flex items-center justify-center group shadow-md">
            {viewMode === 'original' ? (
              originalImagePreview ? (
                <img
                  src={originalImagePreview}
                  alt="Original upload"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-xs text-slate-500 font-mono">Original image preview unavailable</div>
              )
            ) : ela_heatmap_base64 ? (
              <img
                src={ela_heatmap_base64}
                alt="ELA Heatmap"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-xs text-slate-500 font-mono">ELA Heatmap could not be generated</div>
            )}

            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-white/10">
              {viewMode === 'original' ? 'Source RGB Payload' : 'Amplified JPEG Resave Artifacts (Q=90)'}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed italic">
            * Error Level Analysis (ELA) re-saves the frame at quality 90 and scales pixel differentials. Inconsistent high-contrast clusters highlight spliced text or imported elements.
          </p>
        </div>

        {/* Right Column: Quantitative Metrics & EXIF */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Quantitative Metrics Cards */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-sm">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              Quantitative ELA Metrics
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5 shadow-inner">
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Mean Error</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {ela_metrics?.mean_error !== undefined ? Number(ela_metrics.mean_error).toFixed(2) : '0.00'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5 shadow-inner">
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Max Patch Variance</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {ela_metrics?.max_patch_variance !== undefined
                    ? Number(ela_metrics.max_patch_variance).toFixed(2)
                    : '0.00'}
                </span>
              </div>
              <div className="col-span-2 p-2.5 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5 shadow-inner flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">
                    Anomalous Patches Count
                  </span>
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400 text-sm">
                    {ela_metrics?.anomalous_patches_count ?? 0} patches
                  </span>
                </div>
                {ela_metrics?.anomalous_patches_count > 0 && (
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                )}
              </div>
            </div>
          </div>

          {/* EXIF Metadata Audit */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex-1 shadow-sm">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              EXIF & Software Signatures
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/5 pb-1.5">
                <span className="text-slate-600 dark:text-slate-400">Editing Software:</span>
                <span className="font-mono text-slate-900 dark:text-slate-200 font-medium">
                  {exif_summary?.software || 'None detected (Stripped or Clean)'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/5 pb-1.5">
                <span className="text-slate-600 dark:text-slate-400">Camera / Hardware:</span>
                <span className="font-mono text-slate-900 dark:text-slate-200 font-medium">
                  {exif_summary?.camera_model || 'No Camera Signature'}
                </span>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400 block mb-1">Detected Anomalies:</span>
                {exif_summary?.anomalies && exif_summary.anomalies.length > 0 ? (
                  <ul className="space-y-1">
                    {exif_summary.anomalies.map((ano, idx) => (
                      <li key={idx} className="text-[11px] font-mono text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-amber-500" />
                        {ano}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-[11px] text-slate-500 font-mono italic">
                    No critical metadata inconsistencies detected.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
