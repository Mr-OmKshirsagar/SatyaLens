---
trigger: glob
globs: backend/**
description: Enforce FastAPI conventions, deterministic forensics, and Gemini/Groq fallback
---

## Backend Rules
- Validate payloads and responses using Pydantic v2 models matching `docs/spec.md`.
- Load `GEMINI_API_KEY` and `GROQ_API_KEY` from `backend/.env` via `python-dotenv`; never hardcode secrets.
- Compute ELA heatmap in `backend/forensics.py` by re-encoding at JPEG quality 90, computing amplified pixel difference, and returning a base64 JPEG data URI (`data:image/jpeg;base64,...`).
- Catch errors cleanly and route through `ddgs` + `groq` (`llama-3.3-70b-versatile`) fallback rather than failing with unhandled `500` errors.
- Preserve all previously working endpoints and helpers when extending `backend/`.