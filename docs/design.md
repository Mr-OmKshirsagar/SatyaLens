# Design Specification: SatyaLens Forensic UI

---

## 1. Visual Direction & Theme
- **Aesthetic:** Dark cybersecurity and digital forensics dashboard—crisp, high-contrast, scannable, and free of marketing bloat.
- **Color System:**
  - Primary Background: `#0B1120`
  - Card / Elevated Surface: `#111C33` (`1px solid #1E3A5F` border)
  - Primary Accent: `#4DA3FF` (deep blue framing `#1A365D`)
  - Verdict Accents: Verified `#10B981`, Misleading/Unverified `#F59E0B`, Fabricated/Manipulated `#EF4444`
- **Typography:** `Inter` / `Plus Jakarta Sans` for UI copy; `JetBrains Mono` for scores, EXIF metadata, URLs, and technical readouts.

---

## 2. Layout & Core Components
1. **Top Header:** SatyaLens wordmark + live engine status indicator (zero login/signup buttons).
2. **Forensic Intake Console:**
   - Tabs/controls for `Text`, `URL`, and `Image` (plus optional `Audio` in P1).
   - **3 One-Click Live Sample Triggers** calling the real `POST /api/analyze` endpoint.
   - Animated multi-stage scan status while awaiting `POST /api/analyze`.
3. **4-Layer Forensic Audit Output:**
   - **Verdict & Score Card:** `0–100` score, verdict badge, provenance category, and summary.
   - **Visual Forensics Card (when `has_image === true`):** Toggle/comparison between original image and ELA heatmap + EXIF summary.
   - **Atomic Claims & Citations Card:** Claim verification status, explanation, and clickable source URLs.
   - **Linguistic Flags & WhatsApp Fact Card:** Manipulation badges + English/Hindi toggle with 1-click copy.

---

## 3. Component & Animation Rules
- Use Tailwind CSS, `lucide-react`, `framer-motion`, and Magic UI registry components aligned with Stitch tokens and Manus frontend assembly.
- Do not mix conflicting UI component frameworks (no MUI, Chakra, or Bootstrap).