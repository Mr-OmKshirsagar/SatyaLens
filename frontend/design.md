# SatyaLens — Modern Civic Forensics UI Design Specification (frontend03)

---

## 1. Executive Summary & Design Vision

**SatyaLens** is a Real-Time Fact-Verification and Deepfake Audit Engine created for the NxtWave **IDEA FORGE** hackathon (Track 1: Civic Pulse, Digital Governance & Public Information). Its core purpose is to protect citizens, journalists, and public administrators from viral misinformation, manipulated media, and synthetic voice clones through deterministic forensics, live web search grounding, and counter-spread WhatsApp fact cards.

### Visual Aesthetic & Philosophy
- **Style Archetype:** **Material Design 3 (M3) enhanced with Dark Mode and Subtle Glassmorphism**.
- **Visual Personality:** High-trust, authoritative, calm, scannable, and democratic. It feels like an open-access intelligence workstation rather than a generic promotional tech startup or a gimmicky "AI generator".
- **Glassmorphism Discipline:** Subtle, high-performance backdrop blurs (`backdrop-blur-md` to `backdrop-blur-xl`) applied to elevated surfaces, light-catching borders (`1px solid rgba(255, 255, 255, 0.08)` in dark mode), and organic rounded corners (`rounded-2xl` and `rounded-3xl`).
- **Material Elevation:** Distinct tactile surface levels (Base, Card, Elevated Surface, Dialog / Modal, Floating Toolbars) with ambient drop shadows and responsive tactile ripple / hover states.
- **Anti "AI Cliché" Rule:** Avoid oversaturated neon purples, glowing pink circuits, floating 3D spheres, or rainbow gradient meshes. Misinformation verification requires sober, high-credibility civic colors (deep obsidian, sovereign navy, crisp mint emerald, warm amber, and alert crimson).

---

## 2. Color System & Design Tokens

### 2.1 Dark Mode (Default Primary Experience)

| Token Name | Hex / RGBA | Role / Usage |
| :--- | :--- | :--- |
| **`bg-canvas`** | `#090D16` | Global page background (Deep Obsidian Slate) |
| **`bg-surface`** | `#0F172A` | Standard card surfaces (Midnight Navy) |
| **`bg-surface-elevated`** | `rgba(21, 34, 56, 0.72)` | Elevated frosted glass cards (`backdrop-blur-lg`) |
| **`bg-surface-glass`** | `rgba(255, 255, 255, 0.03)` | Subtle interactive containers & input wells |
| **`border-glass`** | `rgba(255, 255, 255, 0.08)` | Default card border with subtle specular sheen |
| **`border-glass-active`** | `rgba(59, 130, 246, 0.35)` | Active input focus & selected tab border |
| **`brand-primary`** | `#3B82F6` | Sovereign Blue (Primary action buttons, brand accents) |
| **`brand-primary-hover`**| `#2563EB` | Deep Sovereign Blue on hover / click |
| **`brand-secondary`** | `#0EA5E9` | Oceanic Teal-Cyan (Sub-accents, scanner pulse) |
| **`verdict-verified`** | `#10B981` | Crisp Emerald (Authentic, corroborated, clean media) |
| **`verdict-misleading`**| `#F59E0B` | Warm Amber (Distorted context, unverified claims) |
| **`verdict-fabricated`**| `#EF4444` | Crimson Rust (Debunked hoaxes, manipulated media) |
| **`verdict-neutral`** | `#94A3B8` | Slate Pearl (Unverified, inconclusive, pending) |
| **`text-primary`** | `#F8FAFC` | Main headings, critical verdicts, emphasized values |
| **`text-secondary`** | `#94A3B8` | Body paragraphs, input helper text, labels |
| **`text-muted`** | `#64748B` | Timestamps, metadata keys, footnote disclaimers |

### 2.2 Light Mode (Pleasant High-Contrast Adaptation)

| Token Name | Hex / RGBA | Role / Usage |
| :--- | :--- | :--- |
| **`bg-canvas`** | `#F8FAFC` | Clean Porcelain background |
| **`bg-surface`** | `#FFFFFF` | Solid white container background |
| **`bg-surface-elevated`** | `rgba(255, 255, 255, 0.85)` | Elevated frosted glass card (`backdrop-blur-md`) |
| **`border-glass`** | `rgba(15, 23, 42, 0.08)` | Crisp subtle border |
| **`border-glass-active`** | `rgba(37, 99, 235, 0.40)` | Active focus and selection border |
| **`brand-primary`** | `#1D4ED8` | Deep Presidential Navy |
| **`text-primary`** | `#0F172A` | Deep Slate / Charcoal headings |
| **`text-secondary`** | `#475569` | Mid-slate body text |
| **`text-muted`** | `#94A3B8` | Subtle metadata captions |

### 2.3 Typography Stack
- **Display & Headings:** `Plus Jakarta Sans` or `Inter`, font-weight 700 / 800, tracking tight (`-0.02em`).
- **Body & UI Controls:** `Inter`, font-weight 400 / 500 / 600, leading relaxed for readability.
- **Forensic & Data Readouts:** `JetBrains Mono`, font-weight 500 / 700, used for:
  - Authenticity confidence score values (`0` to `100`)
  - Error Level Analysis (ELA) mean error and patch variance percentages
  - EXIF metadata tags, camera firmware models, and timestamp signatures
  - Latency readouts (`< 3.2s`) and engine pipeline identifiers.

---

## 3. Global Information Architecture & Navigation

The application features a dual-mode layout architecture designed for maximum immersion:
1. **Fullscreen Landing View:** When on the Landing Page, the interface renders in an expansive, edge-to-edge full-width layout without any sidebar.
2. **Workspace Sidebar View:** Upon entering the Analysis Console, Feedback, Terms, or About Us pages, the layout introduces the frosted Left Sidebar for rapid workspace navigation.

```
MODE A: FULLSCREEN LANDING VIEW (Home / Landing)
┌────────────────────────────────────────────────────────────────────────┐
│                   TOP NAVBAR (FULLSCREEN CONTAINER)                    │
│ [SatyaLens Logo + Civic Tag]         [Launch Console]  [Core]  [Theme] │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                    HERO REVEAL & WORD ROTATOR                          │
│                    COUNT-UP STATS GRID (4-TIER)                        │
│                    US VS THEM (BOLD CONCISE POINTS)                    │
│                    4 INTERACTIVE DEMO TRIALS                           │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘

MODE B: WORKSPACE VIEW (Console, Feedback, Terms, About Us — No Footer)
┌─────────────────┬──────────────────────────────────────────────────────┐
│  LEFT SIDEBAR   │                   TOP NAVBAR HEADER                  │
│ (Desktop fixed/ │ [Mobile Menu]  [Active Page Title]   [Core]  [Theme] │
│  Mobile drawer) ├──────────────────────────────────────────────────────┤
│                 │                                                      │
│ [SatyaLens Logo]│    ┌────────────────┬──────────────┬──────────────┐  │
│ [Civic Tag]     │    ▼                ▼              ▼              ▼  │
│                 │ [Console (LIVE)] [Feedback]     [Terms]        [About]│
│ [Console (LIVE)]│  - Intake        - Sentiment    - AI Limits    - Story│
│ [Feedback]      │  - Score Dial    - 5-Star Rating- Sparse Data  - Tech │
│ [Terms]         │  - Visual ELA    - NPS 0-10     - Civic Ethics - Team │
│ [About Us]      │  - Citations     - Feature Tags - Non-Liability       │
│                 │  - WhatsApp Card                                      │
│ [Hackathon Box] │  - Report Issue                                       │
│ [GitHub|LinkedIn│  - Disclaimer                                         │
│                 │  (Clean Workspace — Footer only on Landing Page)     │
└─────────────────┴──────────────────────────────────────────────────────┘
```

---

## 4. Component Specification: Left Sidebar & Fixed Top Navbar

### 4.1 Fixed Left Sidebar (`Sidebar.jsx` — Active on Workspace Pages)
- **Desktop Positioning:** Fixed / sticky on the left viewport (`w-64 h-screen sticky top-0`), styled with subtle glassmorphism (`backdrop-blur-xl bg-white/70 dark:bg-surface-dark/70 border-r border-slate-200/80 dark:border-border-glass`).
- **Brand Header:**
  - Tactile 40x40px gradient container with `ShieldCheck` emblem.
  - "SatyaLens" wordmark with dual-tone gradient text (clickable to return to the Landing page).
  - "CIVIC" mono badge + "Forensics & Fact Engine" caption.
- **Workspace Navigation Links (Home option removed):**
  1. **Analysis Console** (`AnalysisConsolePage`) — Includes live green radar pulse dot and "LIVE" badge.
  2. **Community Feedback** (`FeedbackPage`)
  3. **Terms & Conditions** (`TermsPage`)
  4. **About Us** (`AboutPage`)
  - **Item Styling:** Each item displays an icon, title, and descriptive subtitle (e.g. "Multimodal Engine", "Ratings & Insights"). Active items render with an elevated gradient pill (`bg-brand-primary text-white shadow-md shadow-brand-primary/20`).
- **Footer Section:**
  - NxtWave IDEA FORGE 2026 (Track 1) badge.
  - Quick links to GitHub and LinkedIn.
- **Mobile Responsive Drawer:** On mobile devices, the sidebar slides over smoothly as a full-height frosted glass drawer with a semi-transparent blurred backdrop.

### 4.2 Fixed Top Navbar (`Navbar.jsx`)
- **Positioning:** Fixed at the top (`sticky top-0 z-30 w-full glass-panel border-b border-slate-200/80 dark:border-border-glass backdrop-blur-md px-4 sm:px-6 py-3`).
- **Fullscreen Landing Mode (`isLanding === true`):**
  - Left: Full brand logo, wordmark, and "Civic Pulse" badge.
  - Right: Quick "Launch Console" CTA button + Core Active status pill + Theme Switcher.
- **Workspace Mode (`isLanding === false`):**
  - Left: Mobile hamburger trigger (`Menu` icon) + dynamic active page breadcrumb/title.
  - Right: Core Active status pill + Theme Switcher.

---

## 5. Page 1: Landing Page

The landing page serves as the front door for citizens, hackathon evaluators, and journalists, instantly establishing credibility and explaining why SatyaLens is fundamentally different from a superficial LLM wrapper.

### 5.1 Hero Reveal Section
- **Staggered Entrance Animation:** Uses `framer-motion` to reveal elements sequentially (badge -> headline -> word rotator -> subhead -> CTA buttons).
- **Forensic Background Grid:** Subtle SVG isometric forensic coordinate grid overlaid with soft ambient radial glows (Cobalt Blue `#1D4ED8` at 12% opacity, Emerald `#10B981` at 8% opacity).
- **Category Badge:**
  - "NxtWave IDEA FORGE 2026 • Track 1: Civic Pulse & Digital Governance"
- **Main Headline with Dynamic Word Rotator:**
  - Headline structure:
    `"Real-Time Forensic Engine for Verifying "` + `<WordRotator />`
  - Rotator Words (smooth vertical flip with spring physics):
    1. **"Viral WhatsApp Forwards"** (Emphasized in Sovereign Blue)
    2. **"Manipulated Images & Memes"** (Emphasized in Emerald)
    3. **"Synthetic AI Voice Notes"** (Emphasized in Amber)
    4. **"Breaking News Headlines"** (Emphasized in Cyan)
    5. **"Financial & Phishing Scams"** (Emphasized in Crimson)
- **Sub-headline:**
  > "Stop the chain of misinformation before it causes real-world harm. SatyaLens combines deterministic pixel-level Error Level Analysis, acoustic voice forensics, live Google Search grounding, and one-click bilingual WhatsApp Fact Cards."

### 5.2 Interactive Count-Up Stats
Positioned immediately beneath the hero, a 4-card glassmorphic grid highlighting verified technical benchmarks:

1. **`4-Tier` Architecture**
   - Label: *Resilient Multi-Engine Fallback*
   - Description: Gemini 3.8 Search-Grounded -> DDGS Smart Hybrid -> Groq Llama 3.3 -> Pure Python Heuristics.
2. **`0 - 100` Scale**
   - Label: *Granular Authenticity Score*
   - Description: Mathematical confidence index distinguishing slight hyperbole from total fabrication.
3. **`2 Languages` (EN + HI)**
   - Label: *Instant Bilingual WhatsApp Cards*
   - Description: One-click counter-spread cards formatted for English and Hindi family & community groups.
4. **`< 3.2s` Average**
   - Label: *Real-Time Verification Speed*
   - Description: Sub-second deterministic forensics coupled with parallel live web grounding.

### 5.3 "Us vs. Them" Comparison (Bold & Concise Points)
Misinformation solutions are often confused with generic chatbots. This section presents a crisp, high-contrast matrix using **strictly bold, concise points**:

| Evaluation Vector | Generic AI Chatbot / Shallow Checker | SatyaLens Forensic Engine |
| :--- | :--- | :--- |
| **Image Tampering Detection** | **Guesses visually from blurry pixels with zero error analysis** | **Generates deterministic Error Level Analysis (ELA) heatmaps & analyzes localized patch variance** |
| **Source Provenance** | **Hallucinates dead links or outdated static training data** | **Live Google Search grounding with clickable, verified corroborating citations** |
| **WhatsApp Voice Notes** | **Incapable of processing local audio files or voice forwards** | **Transcribes multi-format voice notes & flags synthetic AI voice cloning likelihood** |
| **Counter-Spread Readiness** | **Outputs dry paragraphs of text that no one reads on mobile** | **Generates one-click English & Hindi Devanagari cards ready for instant WhatsApp counter-messaging** |
| **Psychological Scam Auditing** | **Ignores social engineering hooks and emotional manipulation** | **Detects False Urgency, Authority Spoofing, and Phishing triggers with snippet evidence** |
| **System Resilience** | **Fails with 500 error when API keys run out of rate limits** | **4-tier automatic failover ensures 100% uptime without service interruption** |

### 5.4 Review Status & Trust Badges
A horizontal trust strip reinforcing zero-auth civic accessibility:
- **Zero-Auth Incognito Access:** No login, registration, or credit card required. Evaluators and users can test directly.
- **Privacy First & Stateless:** Media payloads are processed in memory and never stored in a tracking database.
- **Strict SSRF Boundary Protection:** Automated private IP and loopback filters prevent URL intake vulnerabilities.
- **Open Civic Methodology:** Transparent atomic claim decomposition reveals exactly *why* a verdict was rendered.

### 5.5 "Try It Yourself" CTA & 4 Interactive Demo Trials
A primary interactive launchpad inviting the user to start analyzing immediately:

- **Primary Action Button:**
  - `"Launch Forensic Console"` (Large glowing glass button with arrow icon, transitioning directly to the Analysis Console view).
- **4 Live Demo Trial Cards:**
  Clicking any of these 4 cards **immediately switches to the Analysis Console**, pre-loads the payload, and executes the real backend verification live:

  1. **Demo 1: Viral WhatsApp Forward (Text Claim)**
     - *Payload:* "🚨 URGENT: UNESCO has declared the Indian National Anthem the best in the world! NASA confirms cosmic alignment. Forward to 10 groups immediately!"
     - *Demonstrated Feature:* Atomic claim extraction, live debunker grounding, and false urgency detection.
  2. **Demo 2: News Article URL (Web Extraction)**
     - *Payload:* `https://en.wikipedia.org/wiki/Jana_Gana_Mana`
     - *Demonstrated Feature:* SSRF-protected `trafilatura` extraction, official lyric history corroboration, and high authenticity score.
  3. **Demo 3: Manipulated Currency Note (Image Forensics)**
     - *Payload:* Leaked "₹5000 Specimen Currency Note" mockup image.
     - *Demonstrated Feature:* Deterministic Error Level Analysis (ELA) heatmap generation, localized patch variance anomaly detection, and software signature parsing.
  4. **Demo 4: Emergency Lockdown Voice Note (Audio Forensics)**
     - *Payload:* Synthesized WhatsApp audio voice clip announcing an emergency midnight nationwide curfew.
     - *Demonstrated Feature:* Voice note transcription, acoustic synthetic speech estimation, and panic-mongering linguistic flags.

---

## 6. Page 2: Analysis Console (Bento Grid Architecture)

The Analysis Console is the flagship operational workspace where users submit artifacts and inspect the deep forensic breakdown organized in an asymmetric, responsive **12-Column Bento Grid**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        00 // MULTIMODAL INTAKE CONSOLE                                 │
│  [Text Claim]   [Web Article]   [Image Forensics]   [Voice Note]                       │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Multimodal Input Area (Drag & drop / paste / live recorder)                      │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│  [Quick Demos: UNESCO Text | News URL | ₹5000 Image | Voice Note]                      │
│  [Initiate Multi-Layer Forensic Scan Button]                                            │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
    ┌───────────────────────────────────────┴───────────────────────────────────────┐
    ▼                                                                               ▼
┌───────────────────────────────────────┐ ┌───────────────────────────────────────────────┐
│ 🍱 BENTO CELL 1: 01 // CONFIDENCE     │ │ 🍱 BENTO CELL 2: 02 // EXECUTIVE INTELLIGENCE │
│ [Span 4 Cols on Desktop]              │ │ [Span 8 Cols on Desktop]                      │
│ - 0-100 Circular SVG Score Dial       │ │ - Layer 1 Corroborated Status Pill            │
│ - 1-2 Word High-Contrast Verdict      │ │ - Multi-Engine Fallback Tier Readout          │
│ - Provenance Category Tag             │ │ - Executive Forensic Intelligence Summary     │
│ - Ambient Score Radial Glow           │ │ - Consensus corroboration & Inaccuracy Flag   │
└───────────────────────────────────────┘ └───────────────────────────────────────────────┘
                                            │
    ┌───────────────────────────────────────┴───────────────────────────────────────┐
    ▼                                                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 🍱 BENTO CELL 3: 03 // PIXEL ERROR LEVEL ANALYSIS (Span 12 Cols - When Image Uploaded)  │
│ - Interactive Original Image vs. ELA Compression Heatmap Toggle                         │
│ - Quantitative ELA Metrics: Mean Error %, Max Patch Variance, Anomalous Patches         │
│ - EXIF Camera Hardware Signature, Software Suite, & Tampering Anomaly Log               │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                            │
    ┌───────────────────────────────────────┴───────────────────────────────────────┐
    ▼                                                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 🍱 BENTO CELL 4: 04 // ACOUSTIC SPEECH AUDIT (Span 12 Cols - When Audio Ingested)       │
│ - Audio Payload Waveform / HTML5 Player                                                 │
│ - Synthetic Voice / Deepfake Clone Likelihood Badge (High / Medium / Low / None)        │
│ - Extracted Spoken Transcript & Detected Audio Duration                                 │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                            │
    ┌───────────────────────────────────────┴───────────────────────────────────────┐
    ▼                                                                               ▼
┌───────────────────────────────────────┐ ┌───────────────────────────────────────────────┐
│ 🍱 BENTO CELL 5: 05 // CITATIONS      │ │ 🍱 BENTO CELL 6: 06 // SCAM & PANIC TRIGGERS  │
│ [Span 7 Cols on Desktop]              │ │ [Span 5 Cols on Desktop]                      │
│ - Atomic Claim-by-Claim Decomposition │ │ - Psychological Manipulation & Urgency Audit  │
│ - Verified / Misleading / Fabricated  │ │ - Quoted Snippet Trigger Evidence             │
│ - Factual Contextual Explanation      │ │ - Severity Pill Badges (High / Medium / Low)  │
│ - Clickable Live Grounded Source URLs │ │ - Bottom Manipulation Filter Status Bar       │
│ - Grounded Evaluation Counter         │ │                                               │
└───────────────────────────────────────┘ └───────────────────────────────────────────────┘
                                            │
    ┌───────────────────────────────────────┴───────────────────────────────────────┐
    ▼                                                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 🍱 BENTO CELL 7: 07 // COUNTER-SPREAD FACT CARDS (Span 12 Cols)                         │
│ - Bilingual Toggle: English vs. हिन्दी (Devanagari)                                    │
│ - 1-Click Clipboard Copy with Feedback Toast                                            │
│ - WhatsApp Formatted Message Bubble Preview with Timestamp & Citation Footer            │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                            │
    ┌───────────────────────────────────────┴───────────────────────────────────────┐
    ▼                                                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 🍱 BENTO CELL 8: CIVIC DISCLAIMER & CALIBRATION ADVISORY (Span 12 Cols)                 │
│ - Civic Limitation Notice & Primary Record Advisory                                     │
│ - Crowdsourced Model Calibration Inaccuracy Report Trigger                              │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 6.1 Multimodal Intake Console
- **Tab Navigation:** Segmented frosted tab bar for switching modalities:
  1. **Text Forward (`text`)**: Multi-line textarea with character counter and auto-clean formatting for raw WhatsApp forwards.
  2. **Web Article (`url`)**: High-contrast URL input with real-time protocol validation (`http://` / `https://`) and SSRF protection shield indicator.
  3. **Image Forensics (`image`)**: Drag-and-drop file uploader supporting JPEG, PNG, WEBP, and TIFF up to 20MB. Includes image preview thumbnail with clear button, plus an optional contextual claim query input.
  4. **Voice Note (`audio`)**: Audio file intake supporting MP3, WAV, OGG, M4A, AAC, WEBM, and FLAC up to 25MB. Features an inline audio player for playback and an optional contextual claim query input.
- **Multimodal Quick Samples Bar:** Directly accessible 1-click pills below the input box to instantly populate test scenarios without leaving the console.
- **Animated Multi-Stage Scanning Progress:**
  When analysis begins, the button transforms into an active progress scanner cycling through actual forensic steps:
  1. *"Ingesting multimodal payload & validating SSRF boundaries..."*
  2. *"Computing Error Level Analysis (ELA) heatmap & parsing EXIF metadata..."*
  3. *"Decomposing atomic claims & cross-referencing live grounded search..."*
  4. *"Auditing psychological manipulation triggers & composing bilingual WhatsApp cards..."*

### 6.2 Layer 1: Authenticity Score & Verdict
- **Authenticity Confidence Gauge:**
  - Large SVG circular dial (0 to 100) with animated stroke dash-offset.
  - Color-coded trajectory:
    - `80 - 100`: Crisp Emerald (`#10B981`) — **Verified**
    - `50 - 79`: Amber Ochre (`#F59E0B`) — **Misleading / Mixed**
    - `0 - 49`: Alert Crimson (`#EF4444`) — **Fabricated / Manipulated**
- **1-2 Word Forensic Verdict Badge:**
  - High-visibility pill: `Verified`, `Misleading`, `Fabricated`, `Manipulated Media`, or `Unverified`.
- **Provenance Category Tag:**
  - Identifies the media nature (e.g., `Viral WhatsApp Forward`, `Altered Currency Specimen`, `Government Notification`, `News Article`).
- **Engine Used Indicator:**
  - Displays the exact resilience tier that powered the report:
    - `Google GenAI (gemini-3.8-flash) + Live Search Grounding`
    - `Smart Hybrid (gemini-3.1-flash-lite + DDGS Context Injection)`
    - `Groq Fallback (llama-3.3-70b-versatile + DDGS Web Snippets)`
    - `Deterministic Forensic Heuristics & ELA Engine`
- **Forensic Executive Summary:**
  - Crisp 2-3 sentence overview synthesized by the grounded engine, detailing the core verdict and primary reason for caution or corroboration.

### 6.3 Layer 2: Deterministic Visual & Metadata Forensics (Image Submissions)
Rendered whenever `visual_forensics.has_image === true`:
- **Interactive Original vs. ELA Heatmap Toggle:**
  - Split view or tab toggle allowing users to compare the uploaded original image against the high-contrast Error Level Analysis (ELA) heatmap.
  - Heatmap explanation: Brighter white and neon patches highlight regions saved at different JPEG compression levels, revealing digitally inserted or spliced text/graphics.
- **Quantitative Localized ELA Metrics:**
  - `Mean Error`: Global pixel compression differential across the image.
  - `Max Patch Variance`: Highest localized variance across 32x32px inspection grids.
  - `Anomalous Patches Count`: Total number of suspicious localized patches exceeding normal compression thresholds.
  - `Tampering Likelihood Badge`: `None`, `Low`, `Medium`, or `High`.
- **EXIF & Software Signature Inspector:**
  - Detected Software: Flags photo editing software such as Adobe Photoshop, Canva, Snapseed, or mobile photo editors.
  - Camera Model: Displays camera hardware signatures or flags suspicious absence in supposed "live photos".
  - Metadata Anomalies: Bulleted list of suspicious EXIF inconsistencies (e.g., mismatched timestamps, stripped color profiles, edited headers).

### 6.4 Audio Voice Note Forensics (Audio Submissions)
Rendered whenever `audio_forensics.has_audio === true`:
- **Acoustic Player & Waveform Display:**
  - In-browser HTML5 audio player styled with glassmorphism controls.
- **Speech-to-Text Transcript:**
  - Verbatim transcription of the spoken audio claims with word highlighting.
- **Synthetic Voice Clone Likelihood Badge:**
  - Gauge indicating `None`, `Low`, `Medium`, or `High` likelihood of synthetic text-to-speech (TTS) or deepfake voice synthesis.

### 6.5 Layer 3: Atomic Claim Decomposition & Grounded Citations
- **Atomic Claim Cards:**
  - Each complex post is broken down into discrete factual claims.
  - Each claim features its own status pill (`Verified`, `Misleading`, `Fabricated`, `Unverified`).
  - Clear debunker explanation providing the missing context or verified truth.
- **Clickable Grounded Source Links:**
  - Real citation cards showing the publisher title, favicon placeholder, and full external URL.
  - Clicking opens the primary source in a secure new tab (`target="_blank" rel="noopener noreferrer"`).

### 6.6 Layer 4: Psychological Manipulation & Scam-Hook Detection
- **Linguistic Trigger Badges:**
  - Categorizes manipulation tactics: `False Urgency`, `Authority Spoofing`, `Fear-Mongering`, `Conspiracy Framing`, `Phishing / Scam Bait`.
- **Quoted Evidence Snippet:**
  - Highlights the exact phrase or sentence from the input text that triggered the flag (e.g., *"Forward to 10 groups immediately or bad luck will follow"*).
- **Severity Indicator:**
  - Tagged as `Low`, `Medium`, or `High` severity.

### 6.7 Layer 5: Counter-Spread WhatsApp Fact Cards
Designed to solve the "last mile" of fact-checking: getting the verified truth back into the viral chat threads where the lie originated.
- **Bilingual Language Switcher:**
  - Toggle between **English** (`whatsapp_card_en`) and **Hindi Devanagari** (`whatsapp_card_hi`).
- **Simulated Chat Bubble Display:**
  - Monospace styled message preview with WhatsApp formatting markers (`*bold*`, `_italics_`, bulleted points).
- **1-Click Copy Action:**
  - Prominent "Copy Fact Card" button with clipboard integration and an animated "Copied to Clipboard!" toast feedback.

### 6.8 Report Inappropriate Analysis Modal & Section
- **Trigger Button:** "Flag / Report Analysis" button with an alert icon located at the bottom of the audit card.
- **Interactive Report Modal:**
  - Modal with subtle glassmorphic backdrop:
    - **Report Reason Dropdown / Radio Grid:**
      - *Factual error in claim verification*
      - *Grounded citation is broken or irrelevant*
      - *Missed localized regional or cultural context*
      - *False positive on image tampering / ELA*
      - *Other feedback / algorithmic bias*
    - **Optional Notes Textarea:** Allows user to paste supplementary reference links or explanatory notes.
    - **Submit Report Button:** Triggers an immediate acknowledgment state thanking the user for helping calibrate the civic engine.

### 6.9 Bottom Engine Accuracy Disclaimer Note
- A persistent, prominent glassmorphic advisory box placed at the conclusion of every analysis:
  > **⚠️ Civic Forensics Notice:** SatyaLens is an automated assistive fact-checking and media audit system. While our engine combines deterministic error analysis with multi-source live search grounding, algorithmic models and web indexes can be incomplete or inconsistent during rapidly evolving breaking events. This report does not constitute a certified legal, medical, or governmental declaration. Always cross-reference critical civic or electoral matters with primary official gazettes.

---

## 7. Page 3: Feedback Page

The Feedback Page provides a welcoming, community-driven channel for citizens, evaluators, and researchers to share their experience and guide iterative improvements.

### 7.1 Page Structure & Hero
- **Header:** "Help Us Strengthen Civic Integrity"
- **Subhead:** "SatyaLens is an evolving open civic project. Your feedback directly shapes our forensic algorithms, language support, and debunker formats."

### 7.2 Structured Question Modules
1. **Emotional Sentiment Rating:**
   - Question: *"How did you feel using SatyaLens?"*
   - Five interactive sentiment pills with tactile feedback:
     - 🛡️ *Empowered*
     - 💡 *Informed*
     - 🧐 *Thoughtful*
     - ⚠️ *Cautious*
     - 🚀 *Impressed*
2. **Overall Star Rating:**
   - Question: *"How would you rate the overall speed and accuracy of SatyaLens?"*
   - Interactive 5-star rating selector with gold gradient fill and dynamic label (1: *Needs Work*, 3: *Helpful*, 5: *Outstanding Civic Tool*).
3. **Net Promoter Score (NPS):**
   - Question: *"How likely are you to recommend SatyaLens to friends, family, or colleagues?"*
   - Horizontal 0-10 numeric scale segmented into Detractors (0-6), Passives (7-8), and Promoters (9-10).
4. **Open Constructive Input:**
   - Question: *"What could we improve or add to make SatyaLens more effective for you?"*
   - Feature Suggestion Quick Tags (clickable toggles):
     - `+ More Indian Languages (Tamil, Telugu, Bengali)`
     - `+ Video Deepfake Frame Analysis`
     - `+ WhatsApp Automated Bot`
     - `+ Chrome Browser Extension`
     - `+ Real-Time Audio Recording`
   - Rich multi-line textarea with placeholder: *"Tell us about any specific claim that was verified well, or where our engine missed crucial context..."*
5. **Optional Contact & Role Identifier:**
   - Optional fields for Name / Email and Role selector (`Citizen`, `Student / Educator`, `Journalist`, `Hackathon Evaluator`, `Developer`).
6. **Submission & Confirmation:**
   - Submit button with tactile ripple animation.
   - On submission, morphs into a frosted celebration card: *"Thank you for defending civic truth! Your feedback has been recorded."*

---

## 8. Page 4: Terms and Conditions Page

The Terms and Conditions page establishes transparent ethical standards, explicitly states technological limitations, and outlines liability boundaries.

### 8.1 Section 1: Nature of the Platform & Public Access
- SatyaLens is provided as a zero-authentication civic prototype for public evaluation and digital literacy education.
- Use of the service is free, stateless, and does not require account creation.

### 8.2 Section 2: Probabilistic Technology & Inaccuracy Disclaimers
- **AI & Large Language Models:** The textual decomposition, claim extraction, and summary generation are conducted via advanced generative AI models (including Google GenAI and Groq LLMs). While grounded in real-time search, LLMs are probabilistic systems and may occasionally misinterpret nuances, satire, sarcasm, or regional idioms.
- **Search Grounding Latency:** During breaking news events or fast-moving crises, web search indexes may contain incomplete, conflicting, or unverified reports. A verdict rendered as `Unverified` reflects the absence of authoritative public consensus at the exact time of query.
- **Deterministic Image Forensics (ELA):** Error Level Analysis identifies differences in compression levels. High ELA variance can arise from multiple natural resaves, social media compression filters (e.g., WhatsApp downscaling), or legitimate re-encoding, and does not unilaterally prove malicious tampering.

### 8.3 Section 3: Prohibited Misuse & Civic Responsibility
- Users agree **NOT** to use SatyaLens for:
  - Generating counter-disinformation or synthetic hoaxes.
  - Conducting automated scraping attacks or denial-of-service attempts.
  - Harassing individuals or defaming civic organizations based on provisional ratings.
  - Circumventing SSRF boundaries or probing internal backend infrastructure.

### 8.4 Section 4: Privacy & Ephemeral Processing
- SatyaLens adheres to a strict stateless architecture.
- Uploaded text, URLs, images, and audio files are analyzed in temporary memory buffers and are **not** persisted into long-term relational databases or sold to third-party advertising brokers.

### 8.5 Section 5: Limitation of Liability
- SatyaLens and its creators assume no liability for personal, commercial, legal, or electoral decisions made on the basis of analysis reports. Users are strongly advised to independently verify critical information with verified institutional sources.

---

## 9. Page 5: About Us Page

The About Us page shares the story, technical ethos, and creator background behind SatyaLens, providing complete transparency and contact avenues.

### 9.1 The SatyaLens Origin Story
- **Track Context:** Built for the **NxtWave IDEA FORGE** hackathon under **Track 1: Civic Pulse, Digital Governance & Public Information**.
- **The Civic Crisis:** India is the world's largest WhatsApp market, with hundreds of millions of daily forwards. Viral misinformation—from fabricated government subsidies to dangerous health hoaxes and synthetic audio clips—spreads exponentially faster than human fact-checkers can respond.
- **The SatyaLens Mission:** To democratize industrial-grade media forensics and grounded verification into an intuitive, zero-barrier tool that arms every citizen with the tools to stop misinformation before forwarding it.

### 9.2 Engineering Architecture & Methodology
A transparent technical breakdown of our hybrid pipeline:
- **Python Deterministic Core:** Custom Error Level Analysis (ELA) generation re-saving at JPEG quality 90, computing pixel differences, and inspecting raw EXIF metadata and software markers.
- **Multimodal AI Grounding:** Google GenAI SDK (`gemini-3.8-flash` & `gemini-3.1-flash-lite`) integrated with native Google Search tools for real-time web verification.
- **High-Availability Fallback Chain:** Seamless failover to Groq (`llama-3.3-70b-versatile`) coupled with DuckDuckGo real-time search snippets when quotas are constrained.
- **Bilingual WhatsApp Counter-Spread:** Immediate synthesis of plain-text fact cards in both English and Hindi Devanagari to meet users where misinformation actually circulates.

### 9.3 Creator Profile & Contact Channels
A dedicated, professional creator profile card:
- **Developer:** Om Kshirsagar — solo passionate full-stack engineer and civic technologist dedicated to building AI systems with explainability, resilience, and real-world societal impact.
- **GitHub Profile:**
  - Direct Link: `https://github.com/Mr-OmKshirsagar/` (display: `github.com/Mr-OmKshirsagar`).
- **LinkedIn Profile:**
  - Direct Link: `https://linkedin.com/in/mromkshirsagar` (display: `linkedin.com/in/mromkshirsagar`).
- **Contact & Inquiry:**
  - Direct connection for hackathon judges, educators, and civic researchers.

---

## 10. Technical Architecture & React Component Hierarchy (frontend03)

```
frontend03/
├── public/
│   └── favicon.svg                     # Civic shield lens SVG emblem
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx              # Fixed top frosted navbar with theme switcher
│   │   │   ├── MobileDrawer.jsx        # Slide-over touch navigation for phones
│   │   │   └── Footer.jsx              # Civic footer with links & engine status
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx         # Hero, rotator, count stats, Us vs Them, Demos
│   │   │   ├── AnalysisConsolePage.jsx # Multi-modal intake + 5-layer forensic report
│   │   │   ├── FeedbackPage.jsx        # Sentiment, rating, NPS, open feedback
│   │   │   ├── TermsPage.jsx           # Disclaimers, AI limits, civic terms
│   │   │   └── AboutPage.jsx           # Mission, architecture, creator contact
│   │   ├── console/
│   │   │   ├── IntakeConsole.jsx       # Text, URL, Image, Audio intake tabs
│   │   │   ├── ScoreDial.jsx           # 0-100 SVG animated authenticity dial
│   │   │   ├── VisualForensicsCard.jsx # Original vs ELA heatmap toggle + EXIF
│   │   │   ├── AudioForensicsCard.jsx  # Player, transcript & synthetic voice likelihood
│   │   │   ├── AtomicClaimsCard.jsx    # Claim status list + grounded source links
│   │   │   ├── LinguisticFlagsCard.jsx # Psychological manipulation triggers
│   │   │   ├── WhatsAppCard.jsx        # English/Hindi cards with 1-click copy
│   │   │   └── ReportModal.jsx         # Inaccurate analysis report form modal
│   │   └── ui/
│   │       ├── WordRotator.jsx         # Animated text flip rotator
│   │       ├── CountUpStat.jsx         # Animated number increment counter
│   │       ├── GlassCard.jsx           # Reusable frosted glass container with elevation
│   │       └── Toast.jsx               # Feedback toast notifications
│   ├── lib/
│   │   ├── api.js                      # Centralized fetch wrapper for POST /api/analyze
│   │   ├── sampleData.js               # The 4 live sample trigger payloads
│   │   └── themeContext.jsx            # Dark / Light mode provider & local persistence
│   ├── App.jsx                         # Main page router & active view orchestrator
│   ├── index.css                       # Tailwind directives, font imports & glass utilities
│   └── main.jsx                        # React root entrypoint
├── index.html
├── package.json
├── tailwind.config.js                  # Custom glassmorphic tokens & colors
└── vite.config.js                      # Vite build & local dev server config
```

---

## 11. Backend API Integration Contract

`frontend03` communicates with the existing real working backend without altering any backend code or schemas.

### 11.1 API Endpoint Definition
- **Base URL Resolution:**
  ```javascript
  const getApiUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
      return envUrl;
    }
    if (typeof window !== 'undefined' && window.location) {
      return window.location.origin; // Supports LAN testing without port collision
    }
    return 'http://localhost:8000';
  };
  ```
- **Endpoint:** `POST /api/analyze`
- **Content-Type:** `multipart/form-data`
- **Request Fields:**
  - `text` (optional string): WhatsApp forward or claim text.
  - `url` (optional string): Web article link.
  - `image` (optional binary file): Uploaded image for ELA and EXIF processing.
  - `audio` (optional binary file): Uploaded voice note (`.mp3`, `.wav`, `.ogg`, `.m4a`, etc.).

### 11.2 Response Schema Mapping (`ForensicAuditResponse`)
The console maps the backend JSON response directly:
- `overall_score` (0-100) -> Plotted on `ScoreDial.jsx`
- `verdict` -> Styled badge with verdict color coding
- `provenance_category` -> Displayed above summary
- `summary` -> Executive summary text
- `visual_forensics`:
  - `has_image` (boolean)
  - `ela_heatmap_base64` (base64 JPEG data URI) -> Displayed in interactive ELA toggle
  - `tampering_likelihood` (`None` | `Low` | `Medium` | `High`)
  - `ela_metrics` (`mean_error`, `max_patch_variance`, `anomalous_patches_count`)
  - `exif_summary` (`software`, `camera_model`, `anomalies`)
- `audio_forensics`:
  - `has_audio` (boolean)
  - `transcript` (string)
  - `voice_synthetic_likelihood` (`None` | `Low` | `Medium` | `High`)
- `atomic_claims`: Array of `{ claim, status, explanation, sources: [{ title, url }] }`
- `linguistic_flags`: Array of `{ trigger, evidence, severity }`
- `whatsapp_card_en` & `whatsapp_card_hi`: Plain text strings rendered with 1-click clipboard copy
- `engine_used`: Identifies the exact engine tier.

---

## 12. Verification & Quality Checklist

Before shipping `frontend03`, the design guarantees adherence to the following standards:
1. **Zero Impact on Real Backend:** No alterations to `backend/main.py`, `backend/schemas.py`, or `backend/forensics.py`.
2. **True Material Design & Glassmorphism:** Elevation is communicated via tactile surface colors and frosted translucency (`backdrop-blur-md`), not gaudy flat shadows or opaque plastic blocks.
3. **Responsive Across Devices:**
   - Desktop (>= 1024px): Multi-column forensic HUD with dual-column cards.
   - Tablet (768px - 1023px): Fluid single-column layout with horizontal scrollable tabs.
   - Mobile (< 768px): Touch-friendly drawer navigation, sticky bottom quick-nav, and full-bleed image/ELA comparison.
4. **Accessible Contrast (WCAG AAA/AA):** Text elements maintain minimum 4.5:1 contrast against their frosted backgrounds in both Dark and Light modes.
5. **No AI Cliché Palette:** Uses authoritative obsidian slate, sovereign blue, and natural emerald/amber/crimson status colors.
