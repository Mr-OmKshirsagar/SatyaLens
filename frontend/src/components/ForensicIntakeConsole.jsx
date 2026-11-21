import React, { useState, useRef, useEffect } from 'react'
import {
  FileText,
  Globe,
  Image as ImageIcon,
  UploadCloud,
  Zap,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  X,
  ArrowRight,
  ShieldAlert,
  Search,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SCAN_STAGES = [
  'Ingesting multimodal payload & validating SSRF boundaries...',
  'Computing Error Level Analysis (ELA) heatmap & parsing EXIF metadata...',
  'Decomposing atomic claims & cross-referencing live grounded search...',
  'Auditing psychological manipulation triggers & composing bilingual WhatsApp cards...',
]

export default function ForensicIntakeConsole({ onAnalysisStart, onAnalysisComplete, onReset }) {
  const [activeTab, setActiveTab] = useState('text')
  const [textInput, setTextInput] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageQuery, setImageQuery] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  // Loading & stage state
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState(0)
  const [error, setError] = useState(null)
  const [recentResult, setRecentResult] = useState(null)

  const fileInputRef = useRef(null)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  // Animate loading stages while analysis runs
  useEffect(() => {
    let interval
    if (isLoading) {
      setLoadingStage(0)
      interval = setInterval(() => {
        setLoadingStage((prev) => (prev < SCAN_STAGES.length - 1 ? prev + 1 : prev))
      }, 1200)
    } else {
      setLoadingStage(0)
    }
    return () => clearInterval(interval)
  }, [isLoading])

  const handleFileSelect = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WEBP).')
      return
    }
    setError(null)
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Create synthetic test image for Sample 3
  const createSampleImageFile = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 300
    const ctx = canvas.getContext('2d')

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 600, 300)
    gradient.addColorStop(0, '#1E293B')
    gradient.addColorStop(1, '#0F172A')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 600, 300)

    // Border
    ctx.strokeStyle = '#F59E0B'
    ctx.lineWidth = 4
    ctx.strokeRect(15, 15, 570, 270)

    // Text
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 24px monospace'
    ctx.fillText('RESERVE BANK OF INDIA', 150, 70)
    ctx.fillStyle = '#10B981'
    ctx.font = 'bold 36px monospace'
    ctx.fillText('₹ 5000 NEW SPECIMEN', 120, 140)
    ctx.fillStyle = '#EF4444'
    ctx.font = '16px monospace'
    ctx.fillText('LEAKED VIRAL MOCKUP - NOT FOR CIRCULATION', 90, 210)

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob], 'viral_5000_note_claim.jpg', { type: 'image/jpeg' })
        resolve(file)
      }, 'image/jpeg', 0.95)
    })
  }

  // Real backend submission against POST /api/analyze
  const executeAnalysis = async (formDataOverride = null, overridePreview = null) => {
    setError(null)
    setIsLoading(true)
    if (onAnalysisStart) onAnalysisStart()

    try {
      let formData = formDataOverride
      if (!formData) {
        formData = new FormData()
        if (activeTab === 'text') {
          if (!textInput.trim()) {
            throw new Error('Please enter text to analyze or choose a live sample.')
          }
          formData.append('text', textInput.trim())
        } else if (activeTab === 'url') {
          if (!urlInput.trim()) {
            throw new Error('Please enter a web URL to analyze.')
          }
          formData.append('url', urlInput.trim())
        } else if (activeTab === 'image') {
          if (!imageFile) {
            throw new Error('Please upload an image to analyze.')
          }
          formData.append('image', imageFile)
          if (imageQuery.trim()) {
            formData.append('text', imageQuery.trim())
          }
        }
      }

      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        const message = errData.detail || `Server returned status ${response.status} (${response.statusText})`
        throw new Error(message)
      }

      const result = await response.json()
      setRecentResult(result)
      const previewToUse = overridePreview || imagePreview
      if (onAnalysisComplete) onAnalysisComplete(result, previewToUse)
    } catch (err) {
      console.error('Forensic analysis error:', err)
      setError(err.message || 'An unexpected error occurred during forensic analysis.')
    } finally {
      setIsLoading(false)
    }
  }

  // 1-Click Live Sample Triggers (Live POST /api/analyze requests)
  const handleTriggerSample = async (sampleType) => {
    setError(null)
    if (sampleType === 'viral_text') {
      clearImage()
      setActiveTab('text')
      const text =
        '🚨 URGENT FORWARD: UNESCO has officially declared the Indian National Anthem as the best in the world! NASA satellite has also confirmed cosmic energy alignment. Forward to 10 groups immediately or bad luck will follow!'
      setTextInput(text)
      const fd = new FormData()
      fd.append('text', text)
      await executeAnalysis(fd, null)
    } else if (sampleType === 'fact_url') {
      clearImage()
      setActiveTab('url')
      const url = 'https://en.wikipedia.org/wiki/Jana_Gana_Mana'
      setUrlInput(url)
      const fd = new FormData()
      fd.append('url', url)
      await executeAnalysis(fd, null)
    } else if (sampleType === 'meme_image') {
      setActiveTab('image')
      const file = await createSampleImageFile()
      const previewUrl = URL.createObjectURL(file)
      setImageFile(file)
      setImagePreview(previewUrl)
      const query = 'Breaking: Leaked photo claiming new government 5000 rupee note issued. Is this note genuine?'
      setImageQuery(query)
      const fd = new FormData()
      fd.append('image', file)
      fd.append('text', query)
      await executeAnalysis(fd, previewUrl)
    }
  }

  const handleResetForm = () => {
    setTextInput('')
    setUrlInput('')
    clearImage()
    setImageQuery('')
    setError(null)
    setRecentResult(null)
    if (onReset) onReset()
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 1-Click Live Sample Triggers Bar */}
      <div className="mb-6 p-4 rounded-xl bg-surface/60 border border-surface-border backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-slate-200 tracking-wide uppercase font-mono">
            One-Click Live Test Scenarios
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            Real Live POST /api/analyze
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => handleTriggerSample('viral_text')}
            disabled={isLoading}
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-surface border border-surface-border hover:border-accent hover:bg-surface-hover text-left transition text-xs group disabled:opacity-50"
          >
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400 group-hover:bg-accent/10 group-hover:text-accent transition">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white group-hover:text-accent transition">
                Viral WhatsApp Forward
              </div>
              <div className="text-[10px] text-slate-400 line-clamp-1 font-mono">
                UNESCO Anthem declaration claim
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleTriggerSample('fact_url')}
            disabled={isLoading}
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-surface border border-surface-border hover:border-accent hover:bg-surface-hover text-left transition text-xs group disabled:opacity-50"
          >
            <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 group-hover:bg-accent/10 group-hover:text-accent transition">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white group-hover:text-accent transition">
                News URL Fact-Check
              </div>
              <div className="text-[10px] text-slate-400 line-clamp-1 font-mono">
                Wikipedia article reference
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleTriggerSample('meme_image')}
            disabled={isLoading}
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-surface border border-surface-border hover:border-accent hover:bg-surface-hover text-left transition text-xs group disabled:opacity-50"
          >
            <div className="p-1.5 rounded-md bg-red-500/10 text-red-400 group-hover:bg-accent/10 group-hover:text-accent transition">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white group-hover:text-accent transition">
                Manipulated Media & Note
              </div>
              <div className="text-[10px] text-slate-400 line-clamp-1 font-mono">
                ₹5000 specimen image claim
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Forensic Intake Console Card */}
      <div className="bg-surface rounded-2xl border border-surface-border shadow-2xl overflow-hidden relative">
        {/* Subtle accent border top */}
        <div className="h-1 w-full bg-gradient-to-r from-accent-dark via-accent to-emerald-400"></div>

        {/* Tab Controls */}
        <div className="flex border-b border-surface-border bg-background/50 px-4 pt-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('text')
              setError(null)
            }}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition relative ${
              activeTab === 'text'
                ? 'bg-surface text-accent border-t border-x border-surface-border'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Claim Text</span>
            {activeTab === 'text' && (
              <motion.div
                layoutId="activeTabBadge"
                className="absolute -top-1 left-0 right-0 h-0.5 bg-accent rounded-full"
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('url')
              setError(null)
            }}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition relative ${
              activeTab === 'url'
                ? 'bg-surface text-accent border-t border-x border-surface-border'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Web Article URL</span>
            {activeTab === 'url' && (
              <motion.div
                layoutId="activeTabBadge"
                className="absolute -top-1 left-0 right-0 h-0.5 bg-accent rounded-full"
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('image')
              setError(null)
            }}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition relative ${
              activeTab === 'image'
                ? 'bg-surface text-accent border-t border-x border-surface-border'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Image Forensics</span>
            {activeTab === 'image' && (
              <motion.div
                layoutId="activeTabBadge"
                className="absolute -top-1 left-0 right-0 h-0.5 bg-accent rounded-full"
              />
            )}
          </button>
        </div>

        {/* Console Body */}
        <div className="p-6">
          {/* Text Input Mode */}
          {activeTab === 'text' && (
            <div className="space-y-3">
              <label className="block text-xs font-mono font-medium text-slate-300">
                PASTE CLAIM OR WHATSAPP FORWARD
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={isLoading}
                rows={5}
                placeholder="Paste suspicious forward, viral message, or statement to audit (e.g. 'NASA satellite confirms cosmic radiation tonight...')"
                className="w-full rounded-xl bg-background border border-surface-border p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition font-sans resize-none"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Prompt-injection safe boundary active</span>
                <span>{textInput.length} characters</span>
              </div>
            </div>
          )}

          {/* URL Input Mode */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <label className="block text-xs font-mono font-medium text-slate-300">
                SOURCE ARTICLE OR POST URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  disabled={isLoading}
                  placeholder="https://example.com/viral-news-article"
                  className="w-full rounded-xl bg-background border border-surface-border pl-10 pr-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Trafilatura article extraction with strict SSRF guards (localhost/private IP blocked).
              </p>
            </div>
          )}

          {/* Image Input Mode */}
          {activeTab === 'image' && (
            <div className="space-y-4">
              <label className="block text-xs font-mono font-medium text-slate-300">
                UPLOAD SCREENSHOT, MEME, OR PHOTO
              </label>

              {!imagePreview ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                    isDragging
                      ? 'border-accent bg-accent/10'
                      : 'border-surface-border hover:border-accent/60 bg-background/50 hover:bg-background'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-accent mb-3 border border-surface-border">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-200 mb-1">
                    Drag and drop your image here, or <span className="text-accent">browse</span>
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    Supports JPEG, PNG, WEBP (Max 25MB) • Computes ELA Heatmap & EXIF
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                  />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-background border border-surface-border flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-surface-border bg-black flex-shrink-0 relative">
                    <img
                      src={imagePreview}
                      alt="Upload preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{imageFile?.name}</p>
                    <p className="text-xs text-slate-400 font-mono">
                      {(imageFile?.size / 1024).toFixed(1)} KB • Ready for Error Level Analysis
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearImage}
                    disabled={isLoading}
                    className="p-2 rounded-lg bg-surface border border-surface-border hover:border-red-500/50 hover:text-red-400 text-slate-400 transition"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Optional contextual claim text */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1.5">
                  ACCOMPANYING CLAIM OR CONTEXT (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={imageQuery}
                  onChange={(e) => setImageQuery(e.target.value)}
                  disabled={isLoading}
                  placeholder="e.g. 'Is this leaked notification from the government genuine?'"
                  className="w-full rounded-lg bg-background border border-surface-border px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-accent transition font-sans"
                />
              </div>
            </div>
          )}

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-xs text-red-200"
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 font-mono">{error}</div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Multi-Stage Loading Feedback Indicator */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-6 p-4 rounded-xl bg-background/80 border border-surface-border"
              >
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <div className="flex items-center gap-2 text-accent">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span className="font-semibold">FORENSIC AUDIT IN PROGRESS</span>
                  </div>
                  <span className="text-slate-400">
                    STAGE {loadingStage + 1} OF {SCAN_STAGES.length}
                  </span>
                </div>

                {/* Animated progress bar */}
                <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden mb-3">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent via-emerald-400 to-accent"
                    initial={{ width: '15%' }}
                    animate={{ width: `${((loadingStage + 1) / SCAN_STAGES.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <p className="text-xs text-slate-300 font-mono flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {SCAN_STAGES[loadingStage]}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-surface-border flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetForm}
              disabled={isLoading || (!textInput && !urlInput && !imageFile && !recentResult)}
              className="px-4 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-white disabled:opacity-30 transition"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => executeAnalysis()}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-dark hover:from-accent-light hover:to-accent text-white font-semibold text-xs shadow-lg shadow-accent/25 transition disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scanning Evidence...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Run Forensic Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
