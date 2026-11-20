---
trigger: always_on
description: Enforce one-step-per-turn discipline, non-regression, and P0/P1 scope boundaries
---

## Scope & Safety Guardrails
- Execute strictly **one step at a time** from `docs/TASK_BOARD.md`.
- Do not add databases, ORMs, authentication systems, or unrequested UI frameworks.
- Keep `audio` (P1) out of P0 steps unless explicitly executing Step 9.
- Never run `git commit` or `git push` automatically; provide Windows Git commands at the end of each verified step.