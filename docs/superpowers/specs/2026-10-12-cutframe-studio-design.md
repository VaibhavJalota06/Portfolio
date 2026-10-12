# Cutframe Studio - Full-Service Media Agency Design Spec

## 1. Overview & Objective
Transform the personal portfolio into **Cutframe Studio**, an industrial-grade, high-conversion full-service media and video editing agency website. The platform showcases premium video editing, color grading, motion design, and retention-focused storytelling. It is styled with a bright, ultra-clean modern aesthetic featuring white backgrounds, deep royal/electric blue accents, crisp typography, and an interactive Before & After split slider.

---

## 2. Design System & Aesthetic Tokens
- **Theme**: Light Mode / Industrial Minimalist.
- **Background Palette**:
  - Primary Base: `#FFFFFF` (Pure White)
  - Section Background Alt: `#F8FAFC` (Slate 50)
  - Card & Container Fill: `#FFFFFF`
  - Subtle Borders: `#E2E8F0` (Slate 200) / Hover: `#CBD5E1` (Slate 300)
- **Blue Brand Palette**:
  - Primary Brand Accent: `#2563EB` (Blue 600)
  - Deep Brand Tone: `#1D4ED8` (Blue 700) / `#1E40AF` (Blue 800)
  - Bright / Glow Accent: `#3B82F6` (Blue 500)
  - Light Ice Blue (Chips & Badges): `#EFF6FF` (Blue 50) / Border: `#BFDBFE` (Blue 200)
- **Typography**:
  - Headings: `Space Grotesk`, sans-serif (tracking-tight, high-contrast `#0F172A`)
  - Body: `Inter`, sans-serif (slate `#334155` / muted `#64748B`)
  - Metrics / Code: `JetBrains Mono`, monospace (for stats, timecodes, labels)
- **Tactile UI Guidelines**:
  - Active press feedback on all buttons and cards: `active:scale-[0.98]`
  - Accessible focus states: `focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2`
  - Generous padding and clean grid alignment with zero visual clutter.

---

## 3. Architecture & Component Hierarchy

### 3.1 Navbar (`Navbar.jsx`)
- Agency Brand Identity: **Cutframe Studio** with geometric frame badge.
- Navigation links:
  - Work (`#work`)
  - Before / After (`#before-after`)
  - Services (`#services`)
  - Process (`#process`)
  - Results (`#results`)
- Action Buttons:
  - "Book Discovery Call" (Primary royal blue pill CTA)
  - Admin Unlock Trigger (Subtle icon in header/footer)

### 3.2 Hero Section (`Hero.jsx`)
- Eyebrow Badge: `⚡ Cutframe Studio • Full-Service Post-Production & Video Engine`
- Main Headline: *"We Engineer High-Retention Videos That Scale Modern Brands & Creators"*
- Subtitle: *"From viral short-form pacing to cinematic YouTube storytelling and high-converting commercial creatives — we turn raw footage into revenue."*
- Dual Call-To-Action:
  - Primary: "Book a Discovery Call" (opens DiscoveryModal)
  - Secondary: "Explore Our Work" (smooth scrolls to `#work`)
- Live Social Proof Metrics Ribbon:
  - `180M+` Total Views Engineered
  - `+48%` Average Audience Retention Lift
  - `4.6x` Average Ad Creative ROAS
  - `99.4%` On-Time Delivery Rate

### 3.3 Interactive Before & After Engine (`BeforeAfterSlider.jsx`)
- Interactive split-screen viewport with draggable slider divider.
- Client Interaction:
  - Drag or click anywhere across the frame to reveal **Raw Footage** (left) vs. **Cutframe Studio Final Cut** (right).
  - Mode presets:
    - *01 Cinematic Color Grading*: Flat S-Log3 / D-Log to rich contrast, skin tone accuracy, and film emulation.
    - *02 Retention Pacing & Graphics*: Raw unedited talking head vs. snappy jump cuts, dynamic motion graphics, sound fx cues, and kinetic captions.
    - *03 Commercial VFX & Polish*: Flat product clip vs. commercial grading, speed ramps, and clean visual graphics.
- Responsive touch and mouse event listeners with auto-boundary limits.

### 3.4 Agency Portfolio Matrix (`PortfolioGrid.jsx` & `PortfolioTile.jsx`)
- Category Filter Tabs:
  - `All Projects`
  - `Short-Form (Reels / TikTok / Shorts)`
  - `YouTube Long-Form`
  - `Commercials & Paid Ads`
  - `Podcasts & Interviews`
- Project Cards:
  - Video player or thumbnail with play trigger
  - Metric badges (e.g. `1.8M Views`, `84% Retention`, `Featured on TechCrunch`)
  - Deliverables tags (e.g. `Color Grading`, `Sound Design`, `Motion Graphics`)
  - Lightbox modal for full high-resolution playback with playback speed and loop controls.

### 3.5 Services Matrix (`Services.jsx`)
- Structured cards with clear deliverables and turnaround times:
  1. **Short-Form Content Engine**: Daily Reels/TikToks, retention hooks, captions, 24-48h turnaround.
  2. **YouTube High-Retention Long-Form**: Complete edit, sound mix, b-roll research, packaging & thumbnails.
  3. **Commercial & Direct-Response Ads**: Hook variations, product highlight reels, UGC optimization, high ROAS.
  4. **Post-Production & Color Mastering**: DaVinci Resolve color pipeline, audio noise reduction, broadcast mastering.

### 3.6 4-Step Agency Workflow (`Workflow.jsx`)
- Visual step progression:
  - **Phase 01: Strategy & Ingest**: Content audit, asset upload, brand style kit setup.
  - **Phase 02: Assembly & Hook Crafting**: First cut, pacing analysis, retention curve optimization.
  - **Phase 03: Motion, Sound & Color**: Custom sound design, SFX, kinetic graphics, cinematic grading.
  - **Phase 04: Delivery & Revisions**: Frame.io feedback integration, multi-aspect ratio exports, rapid delivery.

### 3.7 Social Proof & Client Testimonials (`Testimonials.jsx`)
- Testimonial cards featuring authentic quotes, creator/brand handles, avatar thumbnails, and metrics achieved.

### 3.8 Discovery Call & Project Scope Modal (`DiscoveryModal.jsx`)
- Dual tab interface:
  - **Tab 1: Book Discovery Call**: Direct interactive calendar picker / Cal.com / Calendly embed preview.
  - **Tab 2: Project Scope Inquiry**:
    - Fields: Full Name, Email Address, Brand / Channel URL, Monthly Video Volume, Budget Bracket, Project Goals.
    - Form posts to backend `/api/contact` and saves directly into the SQLite database.

### 3.9 Admin Management Dashboard (`AdminPanel.jsx` & `SettingsPanel.jsx`)
- Updated to support Cutframe Studio brand settings, adding/editing video projects, categorizing by agency service, and reviewing submitted client inquiries with status tracking (`New`, `Contacted`, `Booked`).

---

## 4. Backend & Seed Data (`server/`)
- Seed database with high-tier agency sample projects for Cutframe Studio with real video previews, realistic metrics, tags, and testimonials.
- Maintain existing Express REST endpoints (`/api/items`, `/api/settings`, `/api/contact`, `/api/messages`).

---

## 5. Verification & Testing
- Verify dev servers compile without errors (`npm run dev`).
- Test interactive Before & After slider mouse and touch events across different screen sizes.
- Verify discovery call modal and project inquiry submission to SQLite backend.
- Validate responsive grid layouts from mobile (375px) to desktop (1440px).
