import React from 'react'
import { motion } from 'framer-motion'

export default function CountUpStat({ number, label, subtext, icon: Icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="p-5 rounded-2xl glass-card-elevated border border-slate-200/80 dark:border-border-glass relative overflow-hidden group hover:border-brand-primary/50 transition-all duration-300 shadow-sm"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl group-hover:bg-brand-primary/10 transition-colors pointer-events-none" />
      
      <div className="flex items-center justify-between mb-3">
        <span className="text-3xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors">
          {number}
        </span>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:text-brand-primary group-hover:border-brand-primary/30 transition-colors shadow-sm">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1">
        {label}
      </h4>
      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        {subtext}
      </p>
    </motion.div>
  )
}
