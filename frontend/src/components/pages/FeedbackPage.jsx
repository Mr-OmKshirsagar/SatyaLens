import React, { useState } from 'react'
import {
  MessageSquareHeart,
  Star,
  Send,
  CheckCircle2,
  ThumbsUp,
  Sparkles,
  Smile,
  ShieldCheck,
} from 'lucide-react'

export default function FeedbackPage({ onToast }) {
  const [sentiment, setSentiment] = useState('Informed')
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [npsScore, setNpsScore] = useState(9)
  const [improvementText, setImprovementText] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [role, setRole] = useState('Citizen')
  const [submitted, setSubmitted] = useState(false)

  const tags = [
    'More Regional Languages',
    'Video Deepfake Analysis',
    'Automated WhatsApp Bot',
    'Chrome Browser Extension',
    'Faster Search Latency',
    'Audio Recording in Browser',
  ]

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const sentiments = [
    { label: 'Empowered', emoji: '🛡️' },
    { label: 'Informed', emoji: '💡' },
    { label: 'Thoughtful', emoji: '🧐' },
    { label: 'Cautious', emoji: '⚠️' },
    { label: 'Impressed', emoji: '🚀' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (onToast) {
      onToast('Thank you! Your feedback has been recorded.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-600 dark:text-blue-400">
          <MessageSquareHeart className="w-3.5 h-3.5" />
          <span>COMMUNITY FEEDBACK</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Help Us Improve SatyaLens
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          Your insights guide our forensic algorithms, language support, and debunker formats.
        </p>
      </div>

      {submitted ? (
        <div className="p-10 rounded-2xl glass-card-elevated border border-slate-200/80 dark:border-border-glass text-center space-y-4 shadow-sm">
          <CheckCircle2 className="w-16 h-16 text-verdict-verified mx-auto animate-bounce" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Thank you for helping defend civic truth!
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            Your evaluation and suggestions will directly inform the next iteration of our civic fact-verification model.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white text-xs font-semibold border border-slate-200 dark:border-white/10 transition-all shadow-sm"
          >
            Submit Another Feedback
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 rounded-2xl glass-card-elevated border border-slate-200/80 dark:border-border-glass space-y-8 shadow-sm transition-colors duration-200">
          {/* Question 1: How do you feel using SatyaLens? */}
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-3">
              1. How did you feel using SatyaLens?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {sentiments.map((s) => (
                <button
                  type="button"
                  key={s.label}
                  onClick={() => setSentiment(s.label)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    sentiment === s.label
                      ? 'bg-brand-primary/10 border-brand-primary text-blue-700 dark:text-white font-semibold shadow-md scale-105'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 dark:hover:bg-white/10'
                  }`}
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <span className="text-xs">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Star Rating */}
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
              2. How would you rate the overall speed and accuracy of SatyaLens?
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-xs font-mono text-slate-600 dark:text-slate-400">
                {rating === 5 && 'Outstanding Civic Tool (5/5)'}
                {rating === 4 && 'Very Helpful & Accurate (4/5)'}
                {rating === 3 && 'Decent Baseline (3/5)'}
                {rating === 2 && 'Needs Work (2/5)'}
                {rating === 1 && 'Critical Inaccuracies (1/5)'}
              </span>
            </div>
          </div>

          {/* Question 3: NPS */}
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
              3. How likely are you to recommend SatyaLens to friends or civic groups?
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              0 = Not likely at all, 10 = Extremely likely
            </p>
            <div className="grid grid-cols-11 gap-1 sm:gap-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setNpsScore(num)}
                  className={`py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                    npsScore === num
                      ? 'bg-brand-primary text-white scale-110 shadow-md shadow-brand-primary/20'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Question 4: How can we improve SatyaLens? */}
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
              4. How can we improve SatyaLens?
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-50 text-blue-700 border border-blue-300 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/40 font-semibold'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {selectedTags.includes(tag) ? `✓ ${tag}` : `+ ${tag}`}
                </button>
              ))}
            </div>

            <textarea
              value={improvementText}
              onChange={(e) => setImprovementText(e.target.value)}
              placeholder="Tell us what worked well or what features you would like added next..."
              rows={4}
              className="w-full rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 p-3.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-primary transition-colors resize-y shadow-inner"
            />
          </div>

          {/* Question 5: Role Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              What best describes your role? (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {['Citizen', 'Student / Educator', 'Journalist', 'Hackathon Evaluator', 'Developer'].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    role === r
                      ? 'bg-slate-200 dark:bg-white/15 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-white/20 shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/80 dark:border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">
              Feedback submitted anonymously
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-brand-primary/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Feedback</span>
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
