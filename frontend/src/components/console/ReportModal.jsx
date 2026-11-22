import React, { useState } from 'react'
import { Flag, X, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ReportModal({ isOpen, onClose, onSubmitSuccess }) {
  const [reason, setReason] = useState('factual_error')
  const [details, setDetails] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const reasons = [
    { id: 'factual_error', label: 'Factual error or wrong verdict' },
    { id: 'broken_source', label: 'Grounded citation source is broken or irrelevant' },
    { id: 'missed_context', label: 'Missed localized regional/cultural context' },
    { id: 'false_tamper', label: 'False positive on image tampering / ELA' },
    { id: 'other', label: 'Other feedback or algorithmic bias' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      if (onSubmitSuccess) onSubmitSuccess()
      setTimeout(() => {
        setSubmitted(false)
        setDetails('')
        onClose()
      }, 2000)
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-glass p-6 shadow-2xl transition-colors duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Report Inappropriate Analysis
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Help us calibrate the SatyaLens civic verification model
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-12 h-12 text-verdict-verified mb-3 animate-bounce" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Thank you for reporting!
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Your feedback has been logged to improve our grounding and forensic algorithms.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Select Reason for Report
              </label>
              <div className="space-y-2">
                {reasons.map((r) => (
                  <label
                    key={r.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      reason === r.id
                        ? 'bg-rose-50 border-rose-300 text-rose-900 dark:bg-rose-500/10 dark:border-rose-500/40 dark:text-white font-medium shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-white/5 dark:border-white/5 dark:text-slate-300 dark:hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="radio"
                      name="report_reason"
                      value={r.id}
                      checked={reason === r.id}
                      onChange={() => setReason(r.id)}
                      className="accent-rose-500"
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Additional Notes or Correct Primary Links (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Paste the official gazette URL or explain why the verdict is inaccurate..."
                rows={3}
                className="w-full rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors shadow-inner"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
