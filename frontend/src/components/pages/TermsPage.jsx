import React from 'react'
import { FileText, AlertTriangle, ShieldCheck, Cpu, Scale, Lock } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 text-slate-700 dark:text-slate-300 transition-colors duration-200">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-border-glass text-xs font-mono text-slate-700 dark:text-slate-300">
          <Scale className="w-3.5 h-3.5 text-brand-primary" />
          <span>LEGAL & CIVIC RESPONSIBILITY</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms & Conditions of Use
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          Please review the technical parameters, inaccuracy risks, and civic guidelines governing SatyaLens.
        </p>
      </div>

      {/* Prominent Risk Warning Banner */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs leading-relaxed text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
            CRITICAL ACCURACY & RISK NOTICE:
          </span>
          SatyaLens is an automated assistive forensic instrument, NOT an infallible court of law. Due to fast-moving current events, evolving reporting, or sparse/inappropriate contextual data available in web indices at any given moment, the verification engine may occasionally produce inaccurate, incomplete, or provisional assessments. Critical electoral, legal, medical, or financial matters must always be corroborated with certified primary authorities.
        </div>
      </div>

      {/* Structured Terms Sections */}
      <div className="p-8 rounded-2xl glass-card-elevated border border-slate-200/80 dark:border-border-glass space-y-8 text-xs sm:text-sm leading-relaxed shadow-sm">
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-primary" />
            1. Nature of the Service & Zero-Auth Access
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            SatyaLens is deployed as an open-access civic technology prototype for the NxtWave IDEA FORGE hackathon (Track 1: Civic Pulse, Digital Governance & Public Information). It is designed to assist users in detecting media tampering and disinformation. Access is provided without authentication barriers ("Zero-Auth Incognito") to enable rapid public evaluation.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2 border-t border-slate-200/80 dark:border-white/5 pt-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            2. Inaccuracy Risks & Probabilistic AI Limitations
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            You explicitly acknowledge and agree that:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li>
              <strong className="text-slate-900 dark:text-slate-200">Sparse Grounding Data:</strong> In instances of nascent viral rumors or hyper-local incidents where official records or reputable journalistic sources have not yet reported, the engine may render an <em>"Unverified"</em> status or struggle to disambiguate satire, sarcasm, and regional dialects.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-200">Algorithmic Heuristics:</strong> Large Language Models (LLMs) operate probabilistically. While grounded in real-time search queries, synthesized summaries can inadvertently omit secondary context or misinterpret complex historical timelines.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-200">Visual Compression False Positives:</strong> Deterministic Error Level Analysis (ELA) identifies differences in JPEG compression levels. Re-saving legitimate photos multiple times or messaging-app downscaling (e.g., WhatsApp compression) can trigger high localized variance that mimics tampering.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-2 border-t border-slate-200/80 dark:border-white/5 pt-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            3. Privacy & Ephemeral Data Processing
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            SatyaLens operates on a strict stateless architecture. Text, URLs, uploaded images, and voice notes are ingested into memory for immediate forensic computation and live grounding. No media files or claims are persistently stored in a profiling database, sold to marketing third-parties, or used to track individual users.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2 border-t border-slate-200/80 dark:border-white/5 pt-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            4. Prohibited Misuse & Ethical Guidelines
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            You agree NOT to utilize the platform for:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li>Generating counter-disinformation or training deepfake models to evade detection.</li>
            <li>Launching targeted harassment campaigns against journalists or institutions based on automated ratings.</li>
            <li>Conducting automated denial-of-service (DoS) or attempting to exploit SSRF boundaries.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-2 border-t border-slate-200/80 dark:border-white/5 pt-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            5. Limitation of Liability & Non-Advice Clause
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            The developers of SatyaLens disclaim all liability for any direct, indirect, or consequential damages resulting from the use or inability to use this platform. The forensic audit reports do not constitute certified legal testimony, electoral certification, or medical counsel.
          </p>
        </section>
      </div>
    </div>
  )
}
