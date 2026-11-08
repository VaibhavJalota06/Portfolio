/* =====================================================================
   YOUR PORTFOLIO CONTENT
   ---------------------------------------------------------------------
   Edit any text below. Images live in /images:
     images/about-photo.jpg / about-cutout.png / hero-portrait.png  ← your Flow restyle (v3)
     images/flow/v1–v4.jpg   ← all 4 Flow versions (swap if you prefer another)
     images/work/*.jpg       ← designs downloaded from cutframestudio.in
   Missing images show a labelled placeholder box.
   ===================================================================== */

window.PORTFOLIO = {
  name: "VAIBHAV JALOTA",
  firstName: "VAIBHAV JALOTA",
  role: "DESIGNER / CREATIVE LEAD",
  tagline: "FOUNDER · CUTFRAME STUDIO",
  year: "2026",
  coords: "28.6139° N, 77.2090° E",

  heroPortrait: "images/hero-portrait.png",
  aboutPhoto:   "images/about-photo.jpg",
  aboutCutout:  "images/about-cutout.png",
  aboutFrames: [
    "images/portrait/frame1.webp",
    "images/portrait/frame2.webp",
    "images/portrait/frame3.webp",
    "images/portrait/frame4.webp"
  ],

  bio: "I'm Vaibhav Jalota — a multimedia graduate and founder of Cutframe Studio. I bridge creative storytelling and technical craft: brand identities, logos, packaging visuals and posters, plus high-retention video for brands, founders and creators across India. Since 2022 I've been making visuals that make people stop scrolling.",

  // from linkedin.com/in/vaibhavjalota
  education: [
    { title: "B.Sc. Intermedia / Multimedia", place: "Pyramid College of Business & Technology", years: "2023 – 2026" },
    { title: "Senior Secondary", place: "Kamla Nehru Public School", years: "2019 – 2023" }
  ],
  experience: [
    { title: "Founder", place: "Cutframe Studio · Delhi", years: "Sep 2026 – Present" },
    { title: "Video Editor", place: "Genesis Virtue · Remote", years: "May 2026 – Present" },
    { title: "Trainee", place: "Keventers · Okhla, Delhi", years: "Feb – May 2026" },
    { title: "Graphic Designer", place: "Self-employed · Punjab", years: "2022 – 2025" }
  ],
  skills: ["Graphic Design", "Brand Identity", "Branding", "Online Graphics", "Image Design", "Video Editing", "Motion Graphics", "Videography", "Creative Visualisation", "Design Thinking"],
  tools:  ["Photoshop", "Illustrator", "CorelDRAW", "Premiere Pro", "Gravit Designer", "Python + local AI"],

  quotes: [
    { text: "Design is thinking made visual.", by: "Saul Bass" },
    { text: "The first frame decides if they stay.", by: "Cutframe rule #1" },
    { text: "Make it simple, but significant.", by: "Don Draper" }
  ],

  sections: [
    {
      band: "LOGOS & MARKS",
      projects: [
        {
          title: "LOGO FOLIO",
          type: "Logo Design",
          about: "Food, catering & retail brands",
          based: "Delhi & Punjab, India",
          accent: "#c2410c",
          cover:  "images/work/cd01.jpg",
          coverTitle: false,   // Hangries logo already has its own lettering
          sketch: "images/work/ps05.jpg",
          sketchCaption: "Makkar Catering — emblem mark",
          palette: [
            { hex: "#e0561f", label: "Hangries orange" },
            { hex: "#8c1d18", label: "deep red" },
            { hex: "#5b1a2b", label: "Makkar maroon" },
            { hex: "#f7d74a", label: "sunny yellow" }
          ],
          notesTitle: "What the marks say:",
          notes: [
            "Hangries — a smile you can taste",
            "Makkar — a classic emblem for events",
            "Each mark built to work on signage & social"
          ],
          gallery: []
        }
      ]
    },
    {
      band: "BRANDING",
      projects: [
        {
          title: "KNOT HAUS",
          type: "Brand Identity",
          about: "Handmade crochet studio",
          based: "New Delhi, India",
          accent: "#db2777",
          cover:  "images/work/ps06.jpg",
          coverTitle: false,   // the design already shows the Knot Haus wordmark
          palette: [
            { hex: "#f9e1e6", label: "blush" },
            { hex: "#e88aa0", label: "rose" },
            { hex: "#7cc6e0", label: "yarn blue" },
            { hex: "#2b2b2b", label: "ink" }
          ],
          notesTitle: "What the brand says:",
          notes: [
            "Soft, handmade & friendly",
            "Script wordmark = hand-stitched feel",
                        "Florals tie into the gifting vibe"
          ],
          gallery: []
        }
      ]
    },
    {
      band: "PACKAGING & PRODUCT",
      projects: [
        {
          title: "KSONS",
          type: "Product & Packaging Visuals",
          about: "Premium dry fruits brand",
          based: "India",
          accent: "#b45309",
          cover:  "images/work/ps08.jpg",
          coverTitle: false,   // KSONS name is on the pack
          sketch: "images/work/ps01.jpg",
          sketchCaption: "cashews — hero product shot",
          palette: [
            { hex: "#1a1410", label: "dark pack" },
            { hex: "#7a1f1f", label: "studio red" },
            { hex: "#c9a24a", label: "premium gold" },
            { hex: "#f2e6d0", label: "cream" }
          ],
          notesTitle: "What the visuals say:",
          notes: [
            "Premium — moody light, rich textures",
            "Each flavour gets its own colour world",
            "Product first, props support the story",
            "Built for e-commerce & social ads"
          ],
          gallery: ["images/work/ps07.jpg", "images/work/ps02.jpg"]
        }
      ]
    },
    {
      band: "PHOTO MANIPULATION",
      projects: [
        {
          title: "DREAMSCAPES",
          type: "Photo Manipulation",
          about: "Personal series",
          based: "India",
          accent: "#7c3aed",
          cover:  "images/work/ps10.jpg",
          sketch: "images/work/ps04.jpg",
          sketchCaption: "surreal composite — night sky",
          palette: [
            { hex: "#1e1b4b", label: "night" },
            { hex: "#6d28d9", label: "violet" },
            { hex: "#c084fc", label: "glow" },
            { hex: "#f5f3ff", label: "starlight" }
          ],
          notesTitle: "What the work says:",
          notes: [
            "Surreal skies & cinematic colour",
            "One subject, a whole world around it",
            "Light and colour do the storytelling"
          ],
          gallery: []
        }
      ]
    }
  ],

  /* Reels & video — compressed MP4s in /video, posters in images/video.
     showreel = muted loop used behind the hero / intro. */
  videos: {
    band: "REELS & VIDEO",
    title: "MOTION",
    intro: "High-retention reels, AI-animated brand stories and real on-location edits from Cutframe Studio — hooks in the first frame, clean captions, sound design and colour grading.",
    showreel: "video/drs.mp4",
    reels: [
      { title: "DRS Homeopathy", type: "AI brand reel · 56s", poster: "images/video/drs.jpg", src: "video/drs.mp4" },
      { title: "Renova Clinic", type: "AI brand reel · 15s", poster: "images/video/renova.jpg", src: "video/renova.mp4" },
      { title: "Jewellery Showroom", type: "AI avatar reel · 30s", poster: "images/video/jewellery.jpg", src: "video/jewellery.mp4" },
      { title: "Behind the Edit", type: "Studio BTS · 66s", poster: "images/video/bts.jpg", src: "video/bts.mp4" }
    ],
    wide: []
  },

  /* "I edit with AI" section + Orbit Studio (Vaibhav's own AI video studio, in development).
     Keep claims to what the app really does; no pricing. */
  aiStudio: {
    band: "AI × EDIT",
    title: "I EDIT WITH AI",
    intro: "Not just manual cuts and motion graphics. I use AI at every step — scripting, scenes, voice, captions — then finish it by hand. And I'm building my own AI video studio to do it faster.",
    app: {
      name: "ORBIT STUDIO",
      status: "In development · 2026",
      line: "Upload a video or type an idea — Orbit plans the edit, makes the reels and gets them ready to post.",
      prompt: "Make 3 reels from this clinic video. Hook in the first 3 seconds, Hinglish captions.",
      frames: ["images/video/drs.jpg", "images/video/renova.jpg", "images/video/jewellery.jpg", "images/video/bts.jpg"]
    },
    pipeline: [
      { step: "IDEA / RAW FOOTAGE", detail: "Talking-head clip, product shoot or just a one-line idea" },
      { step: "AI SCRIPT & EDIT PLAN", detail: "Claude / Gemini write the hook, script and cut list" },
      { step: "AI SCENES & B-ROLL", detail: "Google Flow generates characters, scenes and B-roll" },
      { step: "AI VOICE", detail: "ElevenLabs voice-over when there's no recording" },
      { step: "HINDI / HINGLISH CAPTIONS", detail: "Word-by-word captions, timed automatically" },
      { step: "EDIT, GRAPHICS & GRADE", detail: "Pacing, sound design, motion graphics and colour — by hand" },
      { step: "REELS READY TO POST", detail: "9:16 exports for Reels & Shorts" }
    ],
    facts: [
      { big: "3", small: "AI engines — cloud, your own AI accounts, or free models on your computer" },
      { big: "0", small: "failed renders from a missing AI — the job moves to the next one" },
      { big: "हिं", small: "Hindi & Hinglish captions built in" }
    ],
    tools: ["Google Flow", "Claude", "Gemini", "ElevenLabs", "Premiere Pro", "DaVinci Resolve", "Photoshop"]
  },

  contact: {
    email: "vaibhav@cutframestudio.in",
    phone: "+91 92175 84204",
    instagram: "@studiocutframe",
    website: "cutframestudio.in",
    linkedin: "linkedin.com/in/vaibhavjalota"
  }
};
