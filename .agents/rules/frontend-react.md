---
trigger: glob
globs: frontend/**
description: Enforce React Vite Tailwind conventions, API binding, and zero-auth incognito UX
---

## Frontend Rules
- Read API base URL strictly from `import.meta.env.VITE_API_URL || "http://localhost:8000"`.
- Follow visual tokens and component structure in `docs/design.md`.
- Ensure all 3 one-click live samples invoke the real `POST /api/analyze` endpoint rather than client-side mock data.
- Keep zero login/signup screens so incognito visitors can test immediately.
- Preserve previously built frontend features when adding new components.