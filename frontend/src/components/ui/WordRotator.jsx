import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WordRotator({
  words = [
    'Viral WhatsApp Forwards',
    'Manipulated Images & Memes',
    'Synthetic AI Voice Notes',
    'Breaking News Headlines',
    'Financial & Phishing Scams',
  ],
  interval = 2800,
}) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, interval)
    return () => clearInterval(timer)
  }, [words.length, interval])

  const colors = [
    'text-blue-400',
    'text-emerald-400',
    'text-amber-400',
    'text-sky-400',
    'text-rose-400',
  ]

  const currentColor = colors[index % colors.length]

  return (
    <span className="inline-block relative h-[1.3em] overflow-hidden align-bottom min-w-[280px] sm:min-w-[360px] text-left">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: 35, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -35, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className={`inline-block font-extrabold ${currentColor} tracking-tight drop-shadow-sm`}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
