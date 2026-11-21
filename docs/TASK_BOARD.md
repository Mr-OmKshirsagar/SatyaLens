# SatyaLens — Step-by-Step Build & Regression Board

---

## Rules of Execution
- Work strictly **one unchecked step per turn**.
- Complete **current-feature verification** AND **previous-step regression checks** before marking any step `[x]`.
- Never run `git commit` or `git push` automatically; output manual Windows Git commands at the end of each step.

---

## Phase 1: Backend (`/backend`)
- [x] **Step 1:** Create `backend/requirements.txt`, `backend/.env.example`, `backend/schemas.py`, and `backend/main.py` (`GET /health` + CORS). Verify `GET /health`.
- [x] **Step 2:** Create `backend/forensics.py` (`generate_ela_heatmap`, `extract_exif_metadata`, `extract_url_text`). Verify image + URL helpers and re-check `GET /health`.
- [x] **Step 3:** Create `backend/analyzer.py` (primary `google-genai` with Google Search grounding + `ddgs` and `groq` fallback). Verify structured JSON output and re-check Steps 1–2.
- [x] **Step 4:** Wire `POST /api/analyze` in `backend/main.py` for `text`, `url`, and `image` (`400` on empty input). Verify all modes + `GET /health` and earlier steps.

---

## Phase 2: Frontend (`/frontend`)
- [x] **Step 5:** Scaffold React + Vite + Tailwind + `framer-motion` + `lucide-react` in `frontend/`, apply Stitch/Magic UI tokens from `docs/design.md`, and verify `npm run build`.
- [x] **Step 6:** Build Forensic Intake Console with Text/URL/Image tabs, 3 one-click live samples, and multi-stage loading wired to `VITE_API_URL/api/analyze`. Verify `npm run build`, live backend request, and Steps 1–4.
- [ ] **Step 7:** Build 4-Layer Forensic Audit Report (Score, Original/ELA Heatmap + EXIF, Atomic Claims + clickable links, Linguistic Flags, and English/Hindi Copyable WhatsApp Card). Verify `npm run build`, Chrome DevTools MCP inspection, and all prior steps.

---

## Phase 3: Deployment, QA & Optional P1
- [ ] **Step 8:** Add deployment configuration (`render.yaml` / `vercel.json` as needed) and run full incognito verification across desktop and mobile viewports via Chrome DevTools MCP.
- [ ] **Step 9 (P1 Stretch Only):** Add optional `audio` voice-note support to `POST /api/analyze` and UI only if Steps 1–8 are complete and verified with time remaining.