# Software Design Document (SDD): Real-Time Fact-Verification & Deepfake Audit Engine (SatyaLens)

---

## 1. Project Overview
Build **SatyaLens**, a full-stack, AI-powered fact-verification and deepfake/media audit engine for the NxtWave Idea Forge hackathon (Track 1: Civic Pulse, Digital Governance & Public Information), built solo on Windows ahead of the Sunday, November 22, 2026 (11:59 PM IST) Challazo deadline. Rather than acting as a shallow LLM wrapper, SatyaLens combines deterministic Python image/metadata forensics, atomic claim extraction, live Google Search grounding, psychological manipulation/scam-hook detection, and one-click English/Hindi WhatsApp Fact Cards so users and judges can immediately verify claims and stop viral misinformation chains.

---

## 2. Tech Stack

- **Frontend (`/frontend`):** React, Vite, Tailwind CSS, `framer-motion`, `lucide-react`, and Magic UI registry components (leveraging Stitch MCP design tokens and Manus React component assembly).
- **Backend (`/backend`):** Python 3.11+, FastAPI, Uvicorn, Pydantic v2, `python-multipart`, `python-dotenv`, `Pillow`, `NumPy`, and `trafilatura`.
- **AI & Grounded Search:**
  - **Primary:** Google GenAI SDK (`gemini-3.8-flash`) with Google Search grounding enabled and structured JSON schema enforcement.
  - **Fallback:** `ddgs` (keyless web search) paired with Groq (`llama-3.3-70b-versatile`) inside a `try/except` fallback when primary search or generation fails or hits rate limits.
- **Developer & Verification Tooling:** Antigravity (Gemini 3.8 High), Context7 MCP, Magic UI MCP, Stitch MCP, Figma MCP, Manus MCP, and Chrome DevTools MCP.
- **Deployment Platforms:** Vercel (Frontend Client) and Render (Backend REST API).

---

## 3. Core Features

- **Multi-Modal Forensic Intake:** Accepts `text` (WhatsApp forwards or claims), `url` (extracted via `trafilatura`), and `image` (uploaded screenshots, memes, or photos), plus `audio` (P1 stretch only).
- **Deterministic Image & Metadata Forensics:** Generates a pixel-level Error Level Analysis (ELA) heatmap (re-saved at JPEG quality 90, amplified pixel difference returned as a base64 JPEG data URI) and extracts EXIF/software metadata anomalies.
- **Atomic Claim Decomposition & Grounded Verification:** Breaks submissions into discrete claims, checks them via live grounded search, and attaches clickable source citations (`title`, `url`).
- **Linguistic Manipulation & Scam-Hook Detection:** Flags false urgency, fear-mongering, authority spoofing, and phishing/scam triggers.
- **Counter-Spread WhatsApp Fact Cards:** Generates shareable, copy-ready verification summaries in English (`whatsapp_card_en`) and Hindi (`whatsapp_card_hi`).
- **Graceful Fallback & Validation:** Returns `400 Bad Request` when no valid input is supplied; routes provider/search failures through `ddgs` + Groq fallback instead of crashing with unhandled `500` errors.

---

## 4. Access Model (Zero-Auth Hackathon Mode)

- **Public Incognito Access:** No login, registration, JWT sessions, or RBAC walls so judges can open the live deployed link in an incognito browser and test immediately.
- **Stateless Processing:** Each `POST /api/analyze` request runs independently without requiring a database or persistent user session.

---

## 5. Frontend Views & Components

- **Header Bar:** SatyaLens branding and live forensic engine status pill (no auth controls).
- **Forensic Intake Console:**
  - Input tabs/controls for `Text`, `URL`, and `Image` (plus optional `Audio` in P1).
  - **3 One-Click Live Sample Triggers** that execute real `POST /api/analyze` requests (never client-side fake data).
  - Multi-stage forensic progress indicator while analysis runs.
- **4-Layer Forensic Audit Report:**
  - **Score & Verdict Card:** `0–100` authenticity score, verdict badge (`Verified`, `Misleading`, `Fabricated`, `Manipulated Media`, `Unverified`), provenance category, and concise summary.
  - **Visual Forensics Panel (when `has_image === true`):** Toggle/view between original image and ELA heatmap + EXIF summary details.
  - **Atomic Claims Panel:** Claim-by-claim status, explanation, and clickable source links.
  - **Linguistic Flags & WhatsApp Fact Card:** Manipulation badges + English/Hindi toggle with 1-click copy.

---

## 6. Backend Architecture

- **Entrypoint & Routing (`backend/main.py`):** Exposes `GET /health` and `POST /api/analyze` (`multipart/form-data`), validates non-empty input (`400` otherwise), and configures CORS (`allow_origins=["*"]`).
- **Schema Layer (`backend/schemas.py`):** Pydantic v2 models enforcing the exact `POST /api/analyze` JSON response contract.
- **Forensics Service (`backend/forensics.py`):** Pure deterministic Python helpers for ELA heatmap generation, EXIF metadata extraction, and URL text extraction.
- **Analyzer Service (`backend/analyzer.py`):** Orchestrates primary Gemini + Google Search grounding and `ddgs` + Groq fallback into the unified response contract.

---

## 7. Data & Response Contracts (Pydantic v2)

### `POST /api/analyze` Request (`multipart/form-data`)
- `text` (optional `str`)
- `url` (optional `str`)
- `image` (optional `UploadFile`)
- `audio` (optional `UploadFile`, P1 stretch only)

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
    }
  },
  "linguistic_flags": [
    { "trigger": "", "evidence": "", "severity": "Low" }
  ],
  "whatsapp_card_en": "",
  "whatsapp_card_hi": "",
  "engine_used": ""
}