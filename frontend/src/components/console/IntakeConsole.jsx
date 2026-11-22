import React, { useState, useRef, useEffect } from 'react'
import {
  FileText,
  Globe,
  Image as ImageIcon,
  Mic,
  UploadCloud,
  Zap,
  AlertCircle,
  X,
  Volume2,
  RefreshCw,
  Square,
} from 'lucide-react'
import {
  SAMPLE_VIRAL_TEXT,
  SAMPLE_FACT_URL,
  SAMPLE_IMAGE_QUERY,
  SAMPLE_AUDIO_QUERY,
  createSampleImageFile,
  createSampleAudioFile,
} from '../../lib/sampleData'
import { analyzePayload } from '../../lib/api'
import TacticalAudioPlayer from './TacticalAudioPlayer'

const SCAN_STAGES = [
  'Ingesting multimodal payload & validating SSRF boundaries...',
  'Computing Error Level Analysis (ELA) heatmap & parsing EXIF metadata...',
  'Decomposing atomic claims & cross-referencing live grounded search...',
  'Auditing psychological manipulation triggers & composing bilingual WhatsApp cards...',
]

export default function IntakeConsole({
  onAnalysisStart,
  onAnalysisComplete,
  onInputChange,
  isLoading,
  setIsLoading,
  initialSampleTrigger,
}) {
  const [activeTab, setActiveTab] = useState('text')
  const [textInput, setTextInput] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageQuery, setImageQuery] = useState('')
  const [audioFile, setAudioFile] = useState(null)
  const [audioPreview, setAudioPreview] = useState(null)
  const [audioQuery, setAudioQuery] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const [loadingStage, setLoadingStage] = useState(0)
  const [error, setError] = useState(null)

  const fileInputRef = useRef(null)
  const audioInputRef = useRef(null)
  const abortControllerRef = useRef(null)

  // Stage cycling effect during loading
  useEffect(() => {
    let interval
    if (isLoading) {
      setLoadingStage(0)
      interval = setInterval(() => {
        setLoadingStage((prev) => (prev < SCAN_STAGES.length - 1 ? prev + 1 : prev))
      }, 1600)
    } else {
      setLoadingStage(0)
    }
    return () => clearInterval(interval)
  }, [isLoading])

  // Handle external trigger if passed from landing page
  useEffect(() => {
    if (initialSampleTrigger) {
      handleTriggerSample(initialSampleTrigger)
    }
  }, [initialSampleTrigger])

  const notifyInputChange = () => {
    if (onInputChange) onInputChange()
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setImageQuery('')
    if (fileInputRef.current) fileInputRef.current.value = ''
    notifyInputChange()
  }

  const clearAudio = () => {
    setAudioFile(null)
    setAudioPreview(null)
    setAudioQuery('')
    if (audioInputRef.current) audioInputRef.current.value = ''
    notifyInputChange()
  }

  const handleImageSelect = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPEG, PNG, WEBP).')
      return
    }
    setError(null)
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    notifyInputChange()
  }

  const handleAudioSelect = (file) => {
    if (!file) return
    const validExts = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.webm', '.flac']
    const hasValidExt = validExts.some((ext) => file.name.toLowerCase().endsWith(ext))
    if (!hasValidExt && !file.type.startsWith('audio/')) {
      setError('Please upload a valid audio file (MP3, WAV, OGG, M4A, AAC, WEBM, FLAC).')
      return
    }
    setError(null)
    setAudioFile(file)
    setAudioPreview(URL.createObjectURL(file))
    notifyInputChange()
  }

  const executeAnalysis = async (formDataOverride = null, previewOverride = null, audioPreviewOverride = null) => {
    setError(null)
    setIsLoading(true)
    if (onAnalysisStart) onAnalysisStart()

    // Cancel existing controller if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      let formData = formDataOverride
      if (!formData) {
        formData = new FormData()
        if (activeTab === 'text') {
          if (!textInput.trim()) {
            throw new Error('Please enter text to verify, or select a live demo sample.')
          }
          formData.append('text', textInput.trim())
        } else if (activeTab === 'url') {
          if (!urlInput.trim()) {
            throw new Error('Please enter a web article URL to verify.')
          }
          formData.append('url', urlInput.trim())
        } else if (activeTab === 'image') {
          if (!imageFile) {
            throw new Error('Please upload an image for forensic ELA analysis.')
          }
          formData.append('image', imageFile)
          if (imageQuery.trim()) formData.append('text', imageQuery.trim())
        } else if (activeTab === 'audio') {
          if (!audioFile) {
            throw new Error('Please upload a voice note recording.')
          }
          formData.append('audio', audioFile)
          if (audioQuery.trim()) formData.append('text', audioQuery.trim())
        }
      }

      const result = await analyzePayload(formData, controller.signal)
      const usedImagePreview = previewOverride || imagePreview
      const usedAudioPreview = audioPreviewOverride || audioPreview
      if (onAnalysisComplete) onAnalysisComplete(result, usedImagePreview, usedAudioPreview)
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Forensic analysis stopped by user.')
        setError('Forensic verification halted by user.')
        return
      }
      console.error('Forensic analysis failed:', err)
      setError(err.message || 'An unexpected error occurred during forensic verification.')
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleStopVerification = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsLoading(false)
    setError('Forensic verification halted by user.')
  }

  // 1-Click Live Sample Triggers
  const handleTriggerSample = async (sampleType) => {
    notifyInputChange()
    setError(null)
    if (sampleType === 'viral_text') {
      clearImage()
      clearAudio()
      setUrlInput('')
      setActiveTab('text')
      setTextInput(SAMPLE_VIRAL_TEXT)
      const fd = new FormData()
      fd.append('text', SAMPLE_VIRAL_TEXT)
      await executeAnalysis(fd, null, null)
    } else if (sampleType === 'fact_url') {
      clearImage()
      clearAudio()
      setTextInput('')
      setActiveTab('url')
      setUrlInput(SAMPLE_FACT_URL)
      const fd = new FormData()
      fd.append('url', SAMPLE_FACT_URL)
      await executeAnalysis(fd, null, null)
    } else if (sampleType === 'meme_image') {
      clearAudio()
      setTextInput('')
      setUrlInput('')
      setActiveTab('image')
      const file = await createSampleImageFile()
      const previewUrl = URL.createObjectURL(file)
      setImageFile(file)
      setImagePreview(previewUrl)
      setImageQuery(SAMPLE_IMAGE_QUERY)
      const fd = new FormData()
      fd.append('image', file)
      fd.append('text', SAMPLE_IMAGE_QUERY)
      await executeAnalysis(fd, previewUrl, null)
    } else if (sampleType === 'viral_audio') {
      clearImage()
      setTextInput('')
      setUrlInput('')
      setActiveTab('audio')
      const file = createSampleAudioFile()
      const previewUrl = URL.createObjectURL(file)
      setAudioFile(file)
      setAudioPreview(previewUrl)
      setAudioQuery(SAMPLE_AUDIO_QUERY)
      const fd = new FormData()
      fd.append('audio', file)
      fd.append('text', SAMPLE_AUDIO_QUERY)
      await executeAnalysis(fd, null, previewUrl)
    }
  }

  return (
    <div className="p-6 sm:p-7 rounded-3xl glass-card-elevated border border-slate-200/80 dark:border-border-glass shadow-sm transition-colors duration-200">
      {/* Bento Top Header for Intake */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-primary">
            00 // MULTIMODAL SENSORY INTAKE
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <span className="text-[11px] font-mono text-slate-500">SSRF HARDENED • CLIENT ISOLATED</span>
      </div>

      {/* Intake Modality Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80 dark:border-white/5">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/90 dark:bg-white/5 p-1 rounded-xl border border-slate-200/80 dark:border-white/10">
          <button
            disabled={isLoading}
            onClick={() => {
              if (isLoading) return
              setActiveTab('text')
              notifyInputChange()
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isLoading ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
            } ${
              activeTab === 'text'
                ? 'bg-brand-primary text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Text Claim</span>
          </button>
          <button
            disabled={isLoading}
            onClick={() => {
              if (isLoading) return
              setActiveTab('url')
              notifyInputChange()
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isLoading ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
            } ${
              activeTab === 'url'
                ? 'bg-brand-primary text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Web Article</span>
          </button>
          <button
            disabled={isLoading}
            onClick={() => {
              if (isLoading) return
              setActiveTab('image')
              notifyInputChange()
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isLoading ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
            } ${
              activeTab === 'image'
                ? 'bg-brand-primary text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Image Forensics</span>
          </button>
          <button
            disabled={isLoading}
            onClick={() => {
              if (isLoading) return
              setActiveTab('audio')
              notifyInputChange()
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isLoading ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
            } ${
              activeTab === 'audio'
                ? 'bg-brand-primary text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Note</span>
          </button>
        </div>

        {/* Live Sample Triggers Dropdown / Quick Pills */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">
            Quick Demos:
          </span>
          <button
            onClick={() => handleTriggerSample('viral_text')}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5 text-[11px] font-mono transition-all shadow-sm"
          >
            UNESCO Text
          </button>
          <button
            onClick={() => handleTriggerSample('fact_url')}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5 text-[11px] font-mono transition-all shadow-sm"
          >
            News URL
          </button>
          <button
            onClick={() => handleTriggerSample('meme_image')}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5 text-[11px] font-mono transition-all shadow-sm"
          >
            ₹5000 Image
          </button>
          <button
            onClick={() => handleTriggerSample('viral_audio')}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5 text-[11px] font-mono transition-all shadow-sm"
          >
            Voice Note
          </button>
        </div>
      </div>

      {/* Input Body depending on Active Tab */}
      <div className="mb-6">
        {activeTab === 'text' && (
          <div>
            <textarea
              value={textInput}
              disabled={isLoading}
              onChange={(e) => {
                setTextInput(e.target.value)
                notifyInputChange()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (!isLoading) executeAnalysis()
                }
              }}
              placeholder="Paste suspicious WhatsApp message, forwarded claim, or viral tweet here... (Press Enter to verify)"
              rows={4}
              className="w-full rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 p-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-primary transition-colors resize-y shadow-inner disabled:opacity-60"
            />
            <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                  Enter ↵
                </span>
                <span>to verify • Shift+Enter for new line</span>
              </span>
              <span>{textInput.length} characters</span>
            </div>
          </div>
        )}

        {activeTab === 'url' && (
          <div>
            <input
              type="url"
              value={urlInput}
              disabled={isLoading}
              onChange={(e) => {
                setUrlInput(e.target.value)
                notifyInputChange()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (!isLoading) executeAnalysis()
                }
              }}
              placeholder="https://example.com/breaking-news-article (Press Enter to verify)"
              className="w-full rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 p-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-primary transition-colors font-mono shadow-inner disabled:opacity-60"
            />
            <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>SSRF Protected: Private IPs and localhost filtered.</span>
              </div>
              <span className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                  Enter ↵
                </span>
                <span>to verify</span>
              </span>
            </div>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="space-y-4">
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)
                if (e.dataTransfer.files?.[0]) handleImageSelect(e.dataTransfer.files[0])
              }}
              className={`p-6 rounded-xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                isDragging
                  ? 'border-brand-primary bg-brand-primary/10'
                  : 'border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-brand-primary'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleImageSelect(e.target.files[0])
                }}
              />

              {imagePreview ? (
                <div className="relative group max-w-sm">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 rounded-lg object-contain border border-slate-200 dark:border-white/10 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      clearImage()
                    }}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-rose-600 text-white shadow-lg hover:bg-rose-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-brand-primary mb-2" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Click to browse or drag & drop image
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Supports JPEG, PNG, WEBP (Evaluates localized ELA compression & EXIF)
                  </span>
                </>
              )}
            </div>

            <input
              type="text"
              value={imageQuery}
              disabled={isLoading}
              onChange={(e) => {
                setImageQuery(e.target.value)
                notifyInputChange()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (!isLoading) executeAnalysis()
                }
              }}
              placeholder="Optional claim context (e.g. 'Is this leaked ₹5000 note genuine?') • Press Enter to verify"
              className="w-full rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-primary shadow-inner disabled:opacity-60"
            />
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="space-y-4">
            <div
              className="p-6 rounded-xl border-2 border-dashed border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-cyan-500 transition-all text-center flex flex-col items-center justify-center cursor-pointer"
              onClick={() => audioInputRef.current?.click()}
            >
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.webm,.flac"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleAudioSelect(e.target.files[0])
                }}
              />

              {audioPreview ? (
                <div
                  className="w-full max-w-xl flex flex-col gap-2.5 text-left"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between text-xs text-cyan-600 dark:text-cyan-400 font-mono px-1">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      <span className="truncate max-w-[260px] font-semibold">
                        {audioFile?.name || 'Selected Audio Voice Note'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        clearAudio()
                      }}
                      className="text-xs text-rose-500 hover:text-rose-400 hover:underline font-semibold"
                    >
                      Remove audio
                    </button>
                  </div>
                  <TacticalAudioPlayer
                    src={audioPreview}
                    title="Intake Audio Stream"
                  />
                </div>
              ) : (
                <>
                  <Mic className="w-8 h-8 text-cyan-500 dark:text-cyan-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Click to upload WhatsApp audio voice note
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Supports MP3, WAV, OGG, M4A, AAC up to 25MB (Transcribes speech & flags AI cloning)
                  </span>
                </>
              )}
            </div>

            <input
              type="text"
              value={audioQuery}
              disabled={isLoading}
              onChange={(e) => {
                setAudioQuery(e.target.value)
                notifyInputChange()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (!isLoading) executeAnalysis()
                }
              }}
              placeholder="Optional claim context for this voice note... • Press Enter to verify"
              className="w-full rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-primary shadow-inner disabled:opacity-60"
            />
          </div>
        )}
      </div>

      {/* Error / Status Banner */}
      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-3 text-xs text-rose-700 dark:text-rose-300">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-500 hover:text-rose-400 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Multi-Stage Scanner Progress (During Analysis) with Stop Button */}
      {isLoading ? (
        <div className="p-4 rounded-2xl bg-brand-primary/10 border border-brand-primary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-brand-primary animate-spin shrink-0" />
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                Forensics Engine Scanning & Grounding...
              </span>
              <span className="text-[11px] text-blue-700 dark:text-blue-300 font-mono">
                {SCAN_STAGES[loadingStage]}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleStopVerification}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/30 hover:scale-105 active:scale-95 self-start sm:self-auto shrink-0 cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop Verification</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[11px] text-slate-500 font-mono">
            Zero-Auth Incognito • Memory-only payload analysis
          </span>
          <button
            onClick={() => executeAnalysis()}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>Audit & Verify Payload</span>
          </button>
        </div>
      )}
    </div>
  )
}
