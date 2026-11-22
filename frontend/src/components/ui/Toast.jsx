import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl glass-card-elevated text-sm font-medium shadow-2xl border border-slate-200 dark:border-white/10"
      >
        {type === 'success' && <CheckCircle2 className="w-5 h-5 text-verdict-verified shrink-0" />}
        {type === 'error' && <AlertCircle className="w-5 h-5 text-verdict-fabricated shrink-0" />}
        {type === 'info' && <Info className="w-5 h-5 text-brand-primary shrink-0" />}
        
        <span className="text-slate-900 dark:text-slate-100">{message}</span>

        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 p-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
