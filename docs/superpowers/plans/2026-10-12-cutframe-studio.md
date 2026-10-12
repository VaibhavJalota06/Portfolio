# Cutframe Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the video editing portfolio into Cutframe Studio — an industrial-grade, full-service media and video editing agency web application featuring a bright white/blue aesthetic, an interactive Before & After split slider, agency showcase grid, workflow/services matrix, and high-conversion discovery call booking.

**Architecture:** A lightweight component-driven React + Tailwind CSS client served by Vite, backed by an Express + SQLite server. The agency landing page smoothly integrates live proof metrics, interactive before/after video comparisons, filtered portfolio lightbox, and discovery inquiry capture.

**Tech Stack:** React 19, Tailwind CSS v4, Lucide React, Vite, Express, SQLite3 / Better-SQLite3.

**Spec:** [`docs/superpowers/specs/2026-10-12-cutframe-studio-design.md`](file:///d:/ai%20models/portfolio/docs/superpowers/specs/2026-10-12-cutframe-studio-design.md)

## Global Constraints
- Primary background is pure white (`#FFFFFF`) with subtle slate contrast (`#F8FAFC`); borders are `#E2E8F0`.
- Primary brand blue is `#2563EB`, deep blue `#1D4ED8`, accent blue `#3B82F6`, and soft badge blue `#EFF6FF`.
- Interactive elements must implement tactile feedback (`active:scale-[0.98]`, subtle hover transitions).
- Typography strictly follows `Space Grotesk` for headings and `Inter` for body.
- Responsive grids must gracefully collapse across mobile, tablet, and desktop screens.

## Review Focus
1. Slider drag handling bounds: pointer dragging must be clamped between 0% and 100% without jumping on window edge release.
2. Lightbox video audio control: video embeds and direct video files must pause and reset audio when closing modals.
3. Form validation and state: discovery inquiry form must validate email and required project scope before submitting to `/api/contact`.
4. Theme consistency: no dark cinema leftover backgrounds or amber borders bleeding into the bright light theme.
5. Admin authentication preservation: admin PIN modal and project management capabilities must remain fully operational.

---

### Task 1: Design Tokens & Bright Industrial Theme
**Files:**
- Modify: `client/src/index.css`

**Interfaces:**
- Consumes: Tailwind v4 theme configuration
- Produces: CSS variables and utility classes for `--color-bg-base`, `--color-brand-blue`, `--color-brand-deep`, `--color-brand-accent`, focus rings, and light slider styling.

- [ ] **Step 1: Define bright theme color tokens in `client/src/index.css`**
  Set `--color-accent: #2563EB;`, `--color-accent-hover: #1D4ED8;`, `--color-cinema-black: #FFFFFF;`, `--color-cinema-card: #FFFFFF;`, `--color-cinema-border: #E2E8F0;`, and body background to `#FFFFFF` with slate text `#0F172A`.
- [ ] **Step 2: Add slider utility classes for Before & After split view**
  Add styles for draggable divider handle, grab cursor, and non-selectable comparison overlays.
- [ ] **Step 3: Verify build with Vite**
  Run `npm run build --prefix client` and verify there are no CSS syntax or token errors.
- [ ] **Step 4: Commit**
  `git add client/src/index.css && git commit -m "style: configure bright white and blue agency tokens"`

---

### Task 2: Interactive Before & After Split Slider Component
**Files:**
- Create: `client/src/components/BeforeAfterSlider.jsx`

**Interfaces:**
- Produces: `<BeforeAfterSlider />` component
- Props: `presets` (array of preset comparisons), `onSelectPreset`

- [ ] **Step 1: Implement `BeforeAfterSlider.jsx` with mouse and touch drag listeners**
  Create draggable slider split between 0% and 100%, with left image/video showing Raw Flat Footage and right showing Cutframe Studio Final Cut.
- [ ] **Step 2: Add category preset switcher tabs**
  Include presets: "Cinematic Color Grading", "Retention Pacing & SFX", "Commercial Motion VFX" with descriptive tags and metrics.
- [ ] **Step 3: Test slider interaction on mobile and desktop**
  Verify boundary clamping at 5% and 95% to maintain visual balance.
- [ ] **Step 4: Commit**
  `git add client/src/components/BeforeAfterSlider.jsx && git commit -m "feat: add interactive Before & After split slider"`

---

### Task 3: Agency Navigation & Hero Section
**Files:**
- Create: `client/src/components/AgencyNavbar.jsx`
- Create: `client/src/components/AgencyHero.jsx`

**Interfaces:**
- Produces: `<AgencyNavbar onOpenDiscovery={fn} onOpenAdmin={fn} />`
- Produces: `<AgencyHero onOpenDiscovery={fn} />`

- [ ] **Step 1: Implement `AgencyNavbar.jsx`**
  Sticky header with Cutframe Studio logo, navigation links (`#work`, `#before-after`, `#services`, `#process`, `#results`), and "Book Discovery Call" CTA button.
- [ ] **Step 2: Implement `AgencyHero.jsx`**
  Industrial typography headline, agency value proposition, dual CTAs, and live metrics counter banner (180M+ Views, +48% Retention Lift, 4.6x ROAS).
- [ ] **Step 3: Test responsive navigation drawer on mobile viewports**
  Ensure mobile menu toggles smoothly with backdrop blur.
- [ ] **Step 4: Commit**
  `git add client/src/components/AgencyNavbar.jsx client/src/components/AgencyHero.jsx && git commit -m "feat: add agency navbar and hero section"`

---

### Task 4: Agency Services & 4-Step Production Workflow
**Files:**
- Create: `client/src/components/AgencyServices.jsx`
- Create: `client/src/components/AgencyWorkflow.jsx`

**Interfaces:**
- Produces: `<AgencyServices onSelectService={fn} />`
- Produces: `<AgencyWorkflow />`

- [ ] **Step 1: Implement `AgencyServices.jsx`**
  Grid of 4 agency offerings: Short-Form Content Engine, YouTube Long-Form Production, Commercial & Paid Ads, and DaVinci Color & Post-Production Mastering with deliverables lists and turnaround times.
- [ ] **Step 2: Implement `AgencyWorkflow.jsx`**
  Visual 4-phase timeline: 01 Ingest & Strategy $\rightarrow$ 02 Assembly & Hook Crafting $\rightarrow$ 03 Motion, Sound & Color $\rightarrow$ 04 Delivery & Revisions.
- [ ] **Step 3: Verify alignment and typography on all breakpoints**
  Verify card spacing and hover lift feedback (`hover:-translate-y-1 transition-transform`).
- [ ] **Step 4: Commit**
  `git add client/src/components/AgencyServices.jsx client/src/components/AgencyWorkflow.jsx && git commit -m "feat: add services matrix and production workflow"`

---

### Task 5: Client Results, Testimonials & Agency FAQ
**Files:**
- Create: `client/src/components/AgencyResults.jsx`
- Create: `client/src/components/AgencyFAQ.jsx`

**Interfaces:**
- Produces: `<AgencyResults />`
- Produces: `<AgencyFAQ />`

- [ ] **Step 1: Implement `AgencyResults.jsx`**
  Showcase client growth metrics, case study highlights, and authentic creator/brand founder testimonial cards with verification badges.
- [ ] **Step 2: Implement `AgencyFAQ.jsx`**
  Interactive accordion answering common agency client questions: turnaround time, revision policy, raw footage handoff, and monthly retainers.
- [ ] **Step 3: Test accordion keyboard focus and open/close transitions**
  Verify accessible ARIA attributes and smooth expand animations.
- [ ] **Step 4: Commit**
  `git add client/src/components/AgencyResults.jsx client/src/components/AgencyFAQ.jsx && git commit -m "feat: add client results, testimonials, and FAQ accordion"`

---

### Task 6: Discovery Call & Project Scope Modal
**Files:**
- Create: `client/src/components/DiscoveryModal.jsx`

**Interfaces:**
- Produces: `<DiscoveryModal isOpen={bool} onClose={fn} />`
- Consumes: `POST /api/contact`

- [ ] **Step 1: Implement `DiscoveryModal.jsx`**
  Tabs for "Schedule Call" (embedded calendar selector) and "Project Scope Brief" (form with name, email, monthly video volume, budget tier, and project summary).
- [ ] **Step 2: Integrate submission handling with toast notifications**
  Submit form payload to `/api/contact`, display success feedback, and reset form fields.
- [ ] **Step 3: Test modal escape key and outside click dismissal**
  Ensure backdrop click and Escape key trigger `onClose`.
- [ ] **Step 4: Commit**
  `git add client/src/components/DiscoveryModal.jsx && git commit -m "feat: add discovery call booking and project scope modal"`

---

### Task 7: Agency Seed Data & Backend Updates
**Files:**
- Modify: `server/seed.js`
- Modify: `server/server.js`

**Interfaces:**
- Produces: Updated database records tailored to Cutframe Studio with agency video projects, verified metrics, and realistic client inquiries.

- [ ] **Step 1: Update `server/seed.js` with Cutframe Studio agency projects**
  Seed high-quality demo video items across Short-Form, YouTube, Commercials, and Podcasts with realistic view counts, retention stats, and agency client names.
- [ ] **Step 2: Run seed script**
  Execute `node server/seed.js` and verify SQLite database tables are populated cleanly.
- [ ] **Step 3: Commit**
  `git add server/seed.js server/server.js && git commit -m "data: update seed with Cutframe Studio agency projects"`

---

### Task 8: Assemble Cutframe Studio in `App.jsx` & Final Verification
**Files:**
- Modify: `client/src/App.jsx`
- Modify: `client/src/components/PortfolioGrid.jsx`
- Modify: `client/src/components/PortfolioTile.jsx`

**Interfaces:**
- Assembles all components into the cohesive Cutframe Studio platform.

- [ ] **Step 1: Connect agency sections into `App.jsx`**
  Integrate `AgencyNavbar`, `AgencyHero`, `BeforeAfterSlider`, `PortfolioGrid`, `AgencyServices`, `AgencyWorkflow`, `AgencyResults`, `AgencyFAQ`, and `DiscoveryModal`.
- [ ] **Step 2: Update `PortfolioTile.jsx` and `PortfolioGrid.jsx` for bright theme**
  Ensure clean white card backgrounds, blue tag chips, and crisp dark text for titles and metrics.
- [ ] **Step 3: Test full end-to-end user journey in browser**
  Test navigation anchors, slider dragging, video lightbox modal, category filtering, discovery modal submission, and admin panel access.
- [ ] **Step 4: Run build check**
  Run `npm run build --prefix client` to ensure zero compilation or bundling errors.
- [ ] **Step 5: Final Commit**
  `git commit -am "feat: complete Cutframe Studio media agency website"`
