---
name: verify-build
description: Verify the current feature and re-verify earlier completed steps to prevent regressions.
---

# Verification & Non-Regression Skill

## Steps
1. **Backend Verification:** Run Python syntax/import checks in `backend/` and test `GET /health` plus any completed `/api/analyze` modes (`text`, `url`, `image`, and empty `400` check).
2. **Frontend Verification:** Run `npm run build` in `frontend/` and use Chrome DevTools MCP to inspect console errors, network status, and layout rendering.
3. **Regression Fix Loop:** If any current or previously completed step fails, fix the issue immediately and re-run both current and regression checks before concluding.