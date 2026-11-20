# SatyaLens — Master Project Constitution

---

## 1. Project Identity
Build **SatyaLens**, a Real-Time Fact-Verification & Deepfake Audit Engine for the NxtWave **Idea Forge** hackathon (Track 1: Civic Pulse, Digital Governance & Public Information). This is a **solo** 48-hour build on **Windows** with a hard submission deadline of **Sunday, November 22, 2026 at 11:59 PM IST** on Challazo.

---

## 2. Authoritative Project Documents
Always read and follow these project documents before making edits:
- @[Technical Specification (SDD)](docs/spec.md)
- @[Visual & Component Design Spec](docs/design.md)
- @[Step-by-Step Task Board](docs/TASK_BOARD.md)

---

## 3. Locked Stack & Environment
- **Backend (`/backend`):** Python 3.11+, FastAPI, Uvicorn, Pydantic v2, `python-multipart`, `python-dotenv`, `Pillow`, `NumPy`, `trafilatura`, `google-genai` (with Google Search grounding), and `ddgs` + `groq` (`llama-3.3-70b-versatile`) fallback.
- **Frontend (`/frontend`):** React, Vite, Tailwind CSS, `framer-motion`, `lucide-react`, and Magic UI registry components (aligned with Stitch design tokens and Manus frontend assembly).
- **Deployment:** Vercel (Frontend) and Render (Backend).
- **Zero-Auth Public Access:** Judges open the deployed MVP in an incognito browser. Never add login gates, sign-up flows, databases/ORMs, or secondary UI libraries (MUI, Chakra, Bootstrap).

---

## 4. What to Do & What Not to Do
- **DO** build meaningful, hybrid engineering: deterministic Python forensics (ELA heatmap + EXIF metadata + `trafilatura` URL extraction) combined with atomic claim decomposition, Search-grounded verification, linguistic manipulation detection, and shareable English/Hindi WhatsApp Fact Cards.
- **DO** execute strictly **one step at a time** from `docs/TASK_BOARD.md`.
- **DO** verify the newly added feature AND re-verify all previously completed steps before checking off a task.
- **DO NOT** combine multiple `TASK_BOARD.md` steps into one turn.
- **DO NOT** delete, stub out, or break previously working features; if an update causes a regression, fix it immediately and re-verify before finishing.
- **DO NOT** return hardcoded/mocked forensic scores or run `git commit` / `git push` automatically.

---

## 5. Step-by-Step Execution & Non-Regression Protocol
For every single step in `docs/TASK_BOARD.md`:
1. **Scope Lock:** State the exact step being executed, files to create/update, and existing files/features that must stay intact.
2. **Scoped Implementation:** Implement only that step cleanly without altering unrelated working logic.
3. **Current-Feature Verification:** Run concrete checks (Python syntax/imports + endpoint/module tests for backend; `npm run build` + Chrome DevTools MCP checks for frontend).
4. **Regression Guard:** Re-run verification for all previously completed steps (`GET /health`, prior `/api/analyze` modes, and frontend build). Fix any breakage immediately and re-test.
5. **Board & Git Handoff:** Mark the step complete in `docs/TASK_BOARD.md` and end with copy-pasteable Windows Git commands (`git status`, `git add ...`, `git commit ...`, `git push origin main`).