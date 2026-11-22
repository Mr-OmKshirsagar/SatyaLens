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
1. **Top Header:** SatyaLens wordmark + live forensic engine status pill (zero login/signup buttons).
2. **Forensic Intake Console:**
   - Tabs/controls for `Text`, `URL`, `Image`, and `Voice Note` (with live audio file picker, format validation, and clear status).
   - **3 One-Click Live Sample Triggers** calling the real `POST /api/analyze` endpoint:
     - *UNESCO Anthem Viral Forward* (Text claim check)
     - *Altered Document / Photo* (Visual ELA & EXIF tampering audit)
     - *Viral Audio Voice Note* (Audio speech transcript & voice clone audit)
   - Animated multi-stage scan status with progressive forensic checkpoints.
3. **4-Layer Forensic Audit Output:**
   - **Layer 1: Verdict & Score Card:** `0–100` authenticity score dial, verdict badge (`Verified`, `Misleading`, `Fabricated`, `Manipulated Media`, `Unverified`), provenance category pill, engine used indicator, and concise executive summary.
   - **Layer 2A: Visual Forensics Card (when `has_image === true`):** Interactive toggle between original image and ELA heatmap, localized patch variance metrics, and EXIF software/camera metadata inspector.
   - **Layer 2B: Audio Voice Note Card (when `has_audio === true`):** In-browser audio player, extracted spoken transcript, and synthetic voice / AI clone likelihood badge.
   - **Layer 3: Atomic Claims & Citations Card:** Claim verification status, factual context explanation, and clickable grounded source URLs.
   - **Layer 4: Linguistic Flags & WhatsApp Fact Card:** Psychological scam triggers (False Urgency, Authority Spoofing, etc.) + English/Hindi Devanagari toggle with 1-click clipboard copy.

---

## 3. Component & Animation Rules
- Use Tailwind CSS, `lucide-react`, `framer-motion`, and Magic UI registry components aligned with Stitch tokens and Manus frontend assembly.
- Do not mix conflicting UI component frameworks (no MUI, Chakra, or Bootstrap).