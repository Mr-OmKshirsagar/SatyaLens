# Software Design Document (SDD): Real-Time Fact-Verification & Deepfake Audit Engine (SatyaLens)

---

## 1. Project Overview
Build **SatyaLens**, a full-stack, AI-powered fact-verification and deepfake/media audit engine for the NxtWave Idea Forge hackathon (Track 1: Civic Pulse, Digital Governance & Public Information), built solo on Windows ahead of the Sunday, November 22, 2026 (11:59 PM IST) Challazo deadline. Rather than acting as a shallow LLM wrapper, SatyaLens combines deterministic Python image/metadata forensics, atomic claim extraction, live Google Search grounding, psychological manipulation/scam-hook detection, and one-click English/Hindi WhatsApp Fact Cards so users and judges can immediately verify claims and stop viral misinformation chains.

---

## 2. Tech Stack

- **Frontend (`/frontend`):** React, Vite, Tailwind CSS, `framer-motion`, `lucide-react`, and Magic UI registry components (leveraging Stitch MCP design tokens and Manus React component assembly).
- **Backend (`/backend`):** Python 3.11+, FastAPI, Uvicorn, Pydantic v2, `python-multipart`, `python-dotenv`, `Pillow`, `NumPy`, and `trafilatura`.
- **AI & Grounded Search:**
  - **Tier 1 (Primary):** Google GenAI SDK (`gemini-3.8-flash`, fallback to `gemini-3.1-flash-lite`) with native Google Search grounding enabled (`tools=[types.Tool(google_search=types.GoogleSearch())]`) and structured JSON schema enforcement.
  - **Tier 2 (Smart Hybrid Gemini):** Real-time web snippets fetched via `ddgs` (`from ddgs import DDGS`) and injected directly into Gemini prompt context when native search grounding hits 429 quota limits.
  - **Tier 3 (Groq Fallback):** Groq API (`llama-3.3-70b-versatile` / `openai/gpt-oss-120b`) paired with `ddgs` live search snippets when Gemini is unavailable.
  - **Tier 4 (Deterministic Heuristics):** Pure Python rule-based evaluation and ELA tampering scoring ensuring requests never crash with unhandled `500` errors.
- **Developer & Verification Tooling:** Antigravity (Gemini 3.8 High), Context7 MCP, Magic UI MCP, Stitch MCP, Figma MCP, Manus MCP, and Chrome DevTools MCP.
- **Deployment Platforms:** Vercel (Frontend Client) and Render (Backend REST API).

---

## 3. Core Features

- **Multi-Modal Forensic Intake:** Accepts `text` (WhatsApp forwards or claims), `url` (hardened SSRF protection with loopback/private IP filtering and `trafilatura` extraction), `image` (uploaded screenshots, memes, or photos), and `audio` (Step 9 voice note analysis).
- **Deterministic Image & Metadata Forensics:** Generates a pixel-level Error Level Analysis (ELA) heatmap (re-saved at JPEG quality 90, amplified pixel difference returned as a base64 JPEG data URI), calculates localized patch-level variance and anomalous patch count (`ela_metrics`), and extracts EXIF/software metadata signatures (Photoshop, Snapseed, Android Gallery, Canva, etc.).
- **Image-First Context Evaluation:** When an image is submitted without claim text, audits the image for text/claims first; if purely non-claim media (photo/landscape), audits tampering likelihood without fabricating unrelated claims.
- **Audio Voice Note Forensics (Step 9):** Ingests audio files (`.mp3`, `.wav`, `.ogg`, `.m4a`, `.aac`, `.webm`, `.flac`) up to 25MB, transcribes spoken claims, audits for acoustic synthetic speech / voice cloning, and classifies `voice_synthetic_likelihood`.
- **Atomic Claim Decomposition & Grounded Verification:** Breaks submissions into discrete claims, verifies them via live grounded search with strict qualifier and ordinal scrutiny (e.g., verifying "first" vs. "second", superlatives, dates), and attaches clickable source citations (`title`, `url`).
- **Linguistic Manipulation & Scam-Hook Detection:** Flags false urgency, fear-mongering, authority spoofing, and phishing/scam triggers.
- **Counter-Spread WhatsApp Fact Cards:** Generates shareable, copy-ready verification summaries in English (`whatsapp_card_en`) and Hindi Devanagari (`whatsapp_card_hi`) with aligned verdicts and score dials.
- **Graceful Fallback & Validation:** Returns `400 Bad Request` when no valid input is supplied; routes provider/search failures through the 4-tier resilience fallback chain instead of crashing with unhandled `500` errors.

---

## 4. Access Model (Zero-Auth Hackathon Mode)

- **Public Incognito Access:** No login, registration, JWT sessions, or RBAC walls so judges can open the live deployed link in an incognito browser and test immediately.
- **Stateless Processing:** Each `POST /api/analyze` request runs independently without requiring a database or persistent user session.

---

## 5. Frontend Views & Components

- **Header Bar:** SatyaLens branding and live forensic engine status pill (no auth controls).
- **Forensic Intake Console:**
  - Input tabs/controls for `Text`, `URL`, `Image`, and `Voice Note`.
  - **3 One-Click Live Sample Triggers** that execute real `POST /api/analyze` requests (never client-side fake data).
  - Multi-stage forensic progress indicator while analysis runs.
- **4-Layer Forensic Audit Report:**
  - **Score & Verdict Card:** `0–100` authenticity score, verdict badge (`Verified`, `Misleading`, `Fabricated`, `Manipulated Media`, `Unverified`), provenance category, and concise summary.
  - **Visual Forensics Panel (when `has_image === true`):** Interactive toggle between original image and ELA heatmap, quantitative metrics, and EXIF summary details.
  - **Audio Voice Note Panel (when `has_audio === true`):** Audio player, extracted spoken transcript, and synthetic voice likelihood badge.
  - **Atomic Claims Panel:** Claim-by-claim status, explanation, and clickable source links.
  - **Linguistic Flags & WhatsApp Fact Card:** Manipulation badges + English/Hindi toggle with 1-click copy.

---

## 6. Backend Architecture

- **Entrypoint & Routing (`backend/main.py`):** Exposes `GET /health` and `POST /api/analyze` (`multipart/form-data`), validates non-empty input (`400` otherwise), enforces SSRF protection and file size bounds, and configures CORS (`allow_origins=["*"]`).
- **Schema Layer (`backend/schemas.py`):** Pydantic v2 models enforcing the exact `POST /api/analyze` JSON response contract (`ForensicAuditResponse`).
- **Forensics Service (`backend/forensics.py`):** Pure deterministic Python helpers for ELA heatmap generation, EXIF metadata extraction, and URL text extraction with SSRF security verification.
- **Analyzer Service (`backend/analyzer.py`):** Orchestrates the 4-tier resilience fallback chain, candidate search query generation, prompt injection defanging, and post-processing consistency guards.

---

## 7. Data & Response Contracts (Pydantic v2)

### `POST /api/analyze` Request (`multipart/form-data`)
- `text` (optional `str`)
- `url` (optional `str`)
- `image` (optional `UploadFile`)
- `audio` (optional `UploadFile`)

### `POST /api/analyze` Response (`200 OK`)
```json
{
  "overall_score": 0,
  "verdict": "Unverified",
  "provenance_category": "Claim Check",
  "summary": "",
  "atomic_claims": [
    {
      "claim": "",
      "status": "Unverified",
      "explanation": "",
      "sources": [{ "title": "", "url": "" }]
    }
  ],
  "visual_forensics": {
    "has_image": false,
    "ela_heatmap_base64": null,
    "tampering_likelihood": "None",
    "exif_summary": {
      "software": null,
      "camera_model": null,
      "anomalies": []
    },
    "ela_metrics": {
      "mean_error": 0.0,
      "max_patch_variance": 0.0,
      "anomalous_patches_count": 0
    }
  },
  "audio_forensics": {
    "has_audio": false,
    "transcript": null,
    "duration_seconds": null,
    "voice_synthetic_likelihood": "None"
  },
  "linguistic_flags": [
    { "trigger": "", "evidence": "", "severity": "Low" }
  ],
  "whatsapp_card_en": "",
  "whatsapp_card_hi": "",
  "engine_used": ""
}