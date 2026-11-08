/* =====================================================================
   MAIN.JS — Portfolio Generator & Interaction Engine
   Vaibhav Jalota — Editor & Designer Portfolio
   ===================================================================== */

(function () {
  'use strict';

  // State & Motion Preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenisInstance = null;
  let isIntroActive = true;
  let lastFocusedElement = null;

  // 1. Text Escaping Helper
  function escapeHTML(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // 2. Global Image Error Handler (replaces failed img with .ph placeholder)
  window.__handleImgError = function (img) {
    if (!img || !img.parentNode) return;
    const fn = img.getAttribute('data-filename') || (img.src ? img.src.split('/').pop() : 'image');
    const ph = document.createElement('div');
    const origClass = img.className ? img.className.trim() : '';
    ph.className = 'ph' + (origClass ? ' ' + origClass : '');

    const b = document.createElement('b');
    b.textContent = fn;
    ph.appendChild(b);
    ph.appendChild(document.createTextNode('drop this image in /images'));

    img.replaceWith(ph);
  };

  // 3. Image Tag Helper
  function imgHelper(src, alt = '', className = '', eager = false, extraAttr = '') {
    const safeSrc = escapeHTML(src || '');
    const safeAlt = escapeHTML(alt || '');
    const filename = src ? src.split('/').pop() : 'image';
    const safeFn = escapeHTML(filename);
    const classAttr = className ? ` class="${escapeHTML(className)}"` : '';
    const loadingAttr = eager ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"';
    const extra = extraAttr ? ` ${extraAttr}` : '';

    return `<img src="${safeSrc}" alt="${safeAlt}"${loadingAttr}${classAttr}${extra} data-filename="${safeFn}" onerror="window.__handleImgError(this)">`;
  }

  // 4. SMPTE 24fps Timecode Formatter (00:00:00:00)
  function formatSMPTE(seconds) {
    const totalFrames = Math.max(0, Math.floor(seconds * 24));
    const ff = totalFrames % 24;
    const totalSecs = Math.floor(totalFrames / 24);
    const ss = totalSecs % 60;
    const mm = Math.floor(totalSecs / 60) % 60;
    const hh = Math.floor(totalSecs / 3600);
    const pad = n => String(n).padStart(2, '0');
    return `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
  }

  // 5. Subtle Paper Crumple Texture Generator (SVG Filter)
  function applyCrumpleTexture() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900">` +
      `<filter id="c" x="0%" y="0%" width="100%" height="100%">` +
      `<feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" result="noise"/>` +
      `<feDiffuseLighting in="noise" lighting-color="#f2f2ee" surfaceScale="1.1" result="light">` +
      `<feDistantLight azimuth="45" elevation="60"/>` +
      `</feDiffuseLighting>` +
      `</filter>` +
      `<rect width="100%" height="100%" filter="url(#c)" fill="#ffffff"/>` +
      `</svg>`;

    const dataUri = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    document.documentElement.style.setProperty('--crumple', dataUri);
  }

  // 6. Torn Paper Edges Clip-Path Generator
  function generateTornPolygon(pointsCount = 60, maxVariation = 22) {
    const points = [];
    for (let i = 0; i <= pointsCount; i++) {
      const x = (i / pointsCount) * 100;
      const y = Math.random() * maxVariation;
      points.push(`${x.toFixed(2)}% ${y.toFixed(1)}px`);
    }
    for (let i = pointsCount; i >= 0; i--) {
      const x = (i / pointsCount) * 100;
      const y = Math.random() * maxVariation;
      points.push(`${x.toFixed(2)}% calc(100% - ${y.toFixed(1)}px)`);
    }
    return `polygon(${points.join(', ')})`;
  }

  function updateTornEdges() {
    const tornEls = document.querySelectorAll('.torn');
    tornEls.forEach(el => {
      el.style.clipPath = generateTornPolygon(60, 22);
    });
  }

  // 7. Marquee Helper: repeats chunk twice for seamless translation
  function buildScrollerHTML(unitHTML, repeatCount = 8) {
    const chunk = unitHTML.repeat(repeatCount);
    return chunk + chunk;
  }

  // 8. Word-Mask Splitting Helper for Big Headings
  function wrapWordsInMask(el) {
    if (!el) return;
    const childNodes = Array.from(el.childNodes);
    let wordIndex = 0;

    childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text.trim()) return;
        const fragment = document.createDocumentFragment();
        const tokens = text.split(/(\s+)/);
        tokens.forEach(tok => {
          if (/^\s+$/.test(tok)) {
            fragment.appendChild(document.createTextNode(tok));
          } else if (tok) {
            const mask = document.createElement('span');
            mask.className = 'word-mask';
            const inner = document.createElement('span');
            inner.className = 'word';
            inner.style.setProperty('--wi', wordIndex++);
            inner.textContent = tok;
            mask.appendChild(inner);
            fragment.appendChild(mask);
          }
        });
        node.replaceWith(fragment);
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
        const text = node.textContent.trim();
        if (text) {
          const mask = document.createElement('span');
          mask.className = 'word-mask';
          const inner = document.createElement('span');
          inner.className = 'word' + (node.className ? ' ' + node.className : '');
          inner.style.setProperty('--wi', wordIndex++);
          inner.textContent = text;
          mask.appendChild(inner);
          node.replaceWith(mask);
        }
      }
    });
  }

  // =====================================================================
  // INTRO "EDIT TIMELINE" LOADER
  // =====================================================================
  function initIntroLoader(onIntroComplete) {
    const overlay = document.getElementById('intro-overlay');
    if (!overlay) {
      if (onIntroComplete) onIntroComplete();
      return;
    }

    if (prefersReducedMotion) {
      overlay.remove();
      document.body.classList.remove('intro-locked');
      isIntroActive = false;
      if (onIntroComplete) onIntroComplete();
      return;
    }

    const timecodeEl = document.getElementById('intro-timecode');
    const wordEl = document.getElementById('intro-word');
    const playheadEl = document.getElementById('intro-playhead');
    const flashEl = document.getElementById('intro-flash');

    const totalDurationMs = 2800; // ~2.8s total
    const stages = [
      { threshold: 0.00, word: 'EDIT' },
      { threshold: 0.20, word: 'CUT' },
      { threshold: 0.40, word: 'GRADE' },
      { threshold: 0.60, word: 'SOUND' },
      { threshold: 0.80, word: 'PORTFOLIO' }
    ];

    let currentStageIndex = 0;
    let startTime = null;
    let animFrameId = null;
    let hasCompleted = false;

    function triggerCutFlash(nextWord) {
      if (flashEl) {
        flashEl.classList.add('flash-active');
        setTimeout(() => {
          flashEl.classList.remove('flash-active');
        }, 45);
      }
      if (wordEl) {
        wordEl.textContent = nextWord;
        wordEl.style.transform = 'scale(1.08)';
        setTimeout(() => {
          if (wordEl) wordEl.style.transform = 'scale(1)';
        }, 75);
      }
    }

    function finishIntro() {
      if (hasCompleted) return;
      hasCompleted = true;
      if (animFrameId) cancelAnimationFrame(animFrameId);

      // Clean up event listeners
      window.removeEventListener('keydown', onSkipKey);
      window.removeEventListener('wheel', onSkipScroll);
      window.removeEventListener('touchmove', onSkipScroll);
      overlay.removeEventListener('click', finishIntro);

      // Slide open the letterbox curtains
      overlay.classList.add('split-open');

      setTimeout(() => {
        document.body.classList.remove('intro-locked');
        isIntroActive = false;
        overlay.remove();
        if (onIntroComplete) onIntroComplete();
      }, 620);
    }

    function onSkipKey() { finishIntro(); }
    function onSkipScroll() { finishIntro(); }

    window.addEventListener('keydown', onSkipKey, { once: true });
    window.addEventListener('wheel', onSkipScroll, { once: true, passive: true });
    window.addEventListener('touchmove', onSkipScroll, { once: true, passive: true });
    overlay.addEventListener('click', finishIntro);

    function tick(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / totalDurationMs);

      // Update SMPTE Timecode
      if (timecodeEl) {
        timecodeEl.textContent = formatSMPTE(elapsed / 1000);
      }

      // Update playhead position
      if (playheadEl) {
        playheadEl.style.left = (progress * 100) + '%';
      }

      // Check clip boundaries
      for (let i = stages.length - 1; i >= 0; i--) {
        if (progress >= stages[i].threshold) {
          if (i !== currentStageIndex) {
            currentStageIndex = i;
            triggerCutFlash(stages[i].word);
          }
          break;
        }
      }

      if (progress < 1) {
        animFrameId = requestAnimationFrame(tick);
      } else {
        finishIntro();
      }
    }

    animFrameId = requestAnimationFrame(tick);
  }

  // =====================================================================
  // HERO REVEAL & VIEWFINDER
  // =====================================================================
  function triggerHeroReveal() {
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.classList.add('is-revealed');
    }

    // Hero waveform timecode: ticks like a running edit timeline
    const heroTc = document.getElementById('hero-tc');
    if (heroTc && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const t0 = performance.now();
      const tick = () => {
        heroTc.textContent = formatSMPTE((performance.now() - t0) / 1000);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  // =====================================================================
  // SCROLL-SCRUBBED PORTRAIT CONTROLLER
  // =====================================================================
  function initPortraitScrubber() {
    const aboutSection = document.querySelector('.about');
    const portraitStack = document.getElementById('portrait-stack');
    const frames = portraitStack ? portraitStack.querySelectorAll('.scrub-frame') : [];

    if (!aboutSection || !portraitStack || frames.length < 4) return;

    function updatePortrait() {
      const rect = aboutSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight;
      const end = viewportHeight * 0.15; // frame 4 fully shown by 15% viewport

      const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));

      // Subtle scale 0.94 -> 1 and subtle translateY parallax
      const scale = 0.94 + 0.06 * progress;
      const translateY = (1 - progress) * 18;
      portraitStack.style.transform = `scale(${scale}) translateY(${translateY}px)`;

      // Hard "cuts" between frames 1 -> 2 -> 3 -> 4 (no ghosting double-exposure),
      // with a 1-frame white flash on each cut like an edit.
      const idx = progress >= 1 ? 3 : Math.min(3, Math.floor(progress * 4));
      if (idx !== updatePortrait.last) {
        frames.forEach((f, i) => { f.style.opacity = i === idx ? 1 : 0; });
        if (updatePortrait.last !== undefined) {
          portraitStack.classList.remove('cut-flash');
          void portraitStack.offsetWidth; // restart animation
          portraitStack.classList.add('cut-flash');
        }
        updatePortrait.last = idx;
      }
    }

    // Bind to scroll updates
    window.__updatePortraitScrub = updatePortrait;
    updatePortrait();
  }

  // =====================================================================
  // VIDEO SECTION & LIGHTBOX CONTROLLER
  // =====================================================================
  function initVideoEngine() {
    const modal = document.getElementById('video-modal');
    const modalVideo = document.getElementById('vmodal-video');
    const modalTitle = document.getElementById('vmodal-title');
    const modalType = document.getElementById('vmodal-type');
    const modalClose = document.getElementById('vmodal-close');
    const modalBackdrop = document.getElementById('vmodal-backdrop');
    const vCursor = document.getElementById('video-cursor');

    function openModal(src, title, type, triggerEl) {
      if (!modal || !modalVideo) return;
      lastFocusedElement = triggerEl || document.activeElement;

      modalVideo.src = src;
      modalVideo.currentTime = 0;
      if (modalTitle) modalTitle.textContent = title || 'CUT_FRAME';
      if (modalType) modalType.textContent = type || '4K • 24FPS';

      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      if (lenisInstance) lenisInstance.stop();

      modalVideo.muted = false;
      modalVideo.play().catch(() => {});

      if (modalClose) modalClose.focus();
    }

    function closeModal() {
      if (!modal || !modalVideo) return;
      modalVideo.pause();
      modalVideo.removeAttribute('src');
      modalVideo.load();

      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      if (lenisInstance && !isIntroActive) lenisInstance.start();

      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('is-active')) {
        closeModal();
      }
    });

    // Trap focus inside modal
    if (modal) {
      modal.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('is-active')) return;
        if (e.key === 'Tab') {
          const focusable = modal.querySelectorAll('button, video, [tabindex="0"]');
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      });
    }

    // Attach click events to hero viewfinder card
    const vfCard = document.querySelector('.viewfinder-card');
    if (vfCard) {
      const src = vfCard.dataset.src;
      const title = vfCard.dataset.title;
      const type = vfCard.dataset.type;

      vfCard.addEventListener('click', () => openModal(src, title, type, vfCard));
      vfCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(src, title, type, vfCard);
        }
      });
    }

    // Video Tiles Interactions (Desktop hover preview + Click modal + Cursor)
    const tiles = document.querySelectorAll('.vtile');
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    tiles.forEach(tile => {
      const video = tile.querySelector('video');
      const src = tile.dataset.src;
      const title = tile.dataset.title;
      const type = tile.dataset.type;

      // Click to open lightbox
      tile.addEventListener('click', () => openModal(src, title, type, tile));
      tile.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(src, title, type, tile);
        }
      });

      // Desktop hover preview
      if (!isTouchDevice && video) {
        tile.addEventListener('mouseenter', () => {
          video.play().catch(() => {});
        });
        tile.addEventListener('mouseleave', () => {
          video.pause();
          video.currentTime = 0;
        });
      }
    });

    // Mobile Autoplay when >=60% in view
    if (isTouchDevice && 'IntersectionObserver' in window) {
      const mobileVideoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const video = entry.target.querySelector('video');
          if (!video) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      }, { threshold: [0, 0.6, 1.0] });

      tiles.forEach(tile => mobileVideoObserver.observe(tile));
    }

    // Custom Video Cursor for Desktop
    if (!isTouchDevice && vCursor) {
      const activeTargets = document.querySelectorAll('.vtile, .viewfinder-card');
      let isOverVideo = false;

      activeTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
          isOverVideo = true;
          vCursor.classList.add('is-visible');
        });
        target.addEventListener('mouseleave', () => {
          isOverVideo = false;
          vCursor.classList.remove('is-visible');
        });
      });

      window.addEventListener('mousemove', (e) => {
        if (!isOverVideo) return;
        vCursor.style.left = `${e.clientX + 14}px`;
        vCursor.style.top = `${e.clientY + 14}px`;
      }, { passive: true });
    }
  }

  // =====================================================================
  // TEXT & SCROLL ANIMATIONS (INTERSECTION OBSERVER)
  // =====================================================================
  function initScrollAnimations() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.word-mask .word, .reveal-fade, .chips, .polaroid, .cover, .sheet, .gallery-grid').forEach(el => {
        el.classList.add('is-inview');
      });
      return;
    }

    // Split words in big headings
    document.querySelectorAll('.about h2, .contact .mega, .videos-head h3, .ai-studio-head h3, .cover .title').forEach(wrapWordsInMask);

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    // Observe masked headings
    document.querySelectorAll('.about h2, .contact .mega, .videos-head h3, .ai-studio-head h3, .cover .title').forEach(el => observer.observe(el));

    // Observe fade items
    document.querySelectorAll('.reveal-fade').forEach(el => observer.observe(el));

    // Observe chips containers
    document.querySelectorAll('.chips').forEach(el => observer.observe(el));

    // Observe polaroids
    document.querySelectorAll('.polaroid').forEach(el => observer.observe(el));

    // Observe sketchbook sheets
    document.querySelectorAll('.sheet').forEach(el => observer.observe(el));

    // Observe project covers
    document.querySelectorAll('.cover').forEach(el => observer.observe(el));

    // Observe gallery grids
    document.querySelectorAll('.gallery-grid').forEach(el => observer.observe(el));
  }

  // =====================================================================
  // SMOOTH SCROLL (LENIS) & SCROLL DYNAMICS
  // =====================================================================
  function initSmoothScroll() {
    const progressBar = document.getElementById('scroll-progress');
    const scrollers = document.querySelectorAll('.scroller');
    const covers = document.querySelectorAll('.cover');

    // Setup scrollers data for velocity-driven animation
    const scrollerData = Array.from(scrollers).map(scroller => {
      const halfWidth = scroller.scrollWidth / 2 || 1000;
      return { el: scroller, pos: 0, halfWidth };
    });

    let currentVelocity = 0;
    let targetVelocity = 0;

    if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
      lenisInstance = new Lenis({
        lerp: 0.09,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.4,
      });

      // Keep stopped while intro is active
      if (isIntroActive) {
        lenisInstance.stop();
      }

      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      lenisInstance.on('scroll', (e) => {
        targetVelocity = e.velocity || 0;
        onScrollTick(e.scroll);
      });
    } else {
      window.addEventListener('scroll', () => {
        onScrollTick(window.scrollY);
      }, { passive: true });
    }

    function onScrollTick(scrollY) {
      // 1. Scroll progress bar
      if (progressBar) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const pct = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
        progressBar.style.width = `${pct}%`;
      }

      // 2. Portrait scrub update
      if (window.__updatePortraitScrub) {
        window.__updatePortraitScrub();
      }

      // 3. Parallax for Project Covers
      if (!prefersReducedMotion) {
        const viewportHeight = window.innerHeight;
        covers.forEach(cover => {
          const rect = cover.getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < viewportHeight) {
            const img = cover.querySelector('img');
            if (img) {
              const offset = ((rect.top + rect.height / 2) - viewportHeight / 2) * 0.08;
              img.style.transform = `scale(1) translateY(${offset}px)`;
            }
          }
        });
      }

      // 4. AI Pipeline scroll-linked draw & pop-in
      if (window.__updateAiPipeline) {
        window.__updateAiPipeline();
      }
    }

    // Velocity-modulated marquee animation loop
    if (!prefersReducedMotion) {
      const baseSpeed = 0.55;

      function marqueeLoop() {
        currentVelocity = currentVelocity * 0.90 + targetVelocity * 0.10;
        targetVelocity *= 0.94; // bleed off velocity

        // Speed is faster when scrolling; direction flips when scrolling up (velocity < -0.15)
        const direction = currentVelocity < -0.15 ? -1 : 1;
        const speed = (baseSpeed + Math.min(Math.abs(currentVelocity) * 0.45, 12)) * direction;

        scrollerData.forEach(item => {
          const currentHalf = (item.el.scrollWidth > 50) ? (item.el.scrollWidth / 2) : item.halfWidth;
          item.pos = (item.pos + speed);
          if (item.pos >= currentHalf) item.pos -= currentHalf;
          if (item.pos < 0) item.pos += currentHalf;
          item.el.style.transform = `translate3d(${-item.pos}px, 0, 0)`;
        });

        requestAnimationFrame(marqueeLoop);
      }
      requestAnimationFrame(marqueeLoop);
    }

    // Anchor links smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || !href) return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          if (lenisInstance) {
            lenisInstance.scrollTo(target);
          } else {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  // =====================================================================
  // ORBIT STUDIO APP MOCKUP CONTROLLER
  // =====================================================================
  function initOrbitStudio() {
    const mockup = document.getElementById('orbit-mockup');
    if (!mockup) return;

    const data = window.PORTFOLIO?.aiStudio?.app || {};
    const fullPrompt = data.prompt || "Make 3 reels from this clinic video. Hook in the first 3 seconds, Hinglish captions.";
    const promptTextEl = mockup.querySelector('.prompt-text');
    const promptCursorEl = mockup.querySelector('.prompt-cursor');
    const typingDotsEl = document.getElementById('orbit-typing-dots');
    const checklistItems = mockup.querySelectorAll('.check-item');
    const monitorTcEl = document.getElementById('orbit-monitor-tc');
    const frameImgs = mockup.querySelectorAll('.orbit-frame-img');
    const cutFlashEl = document.getElementById('orbit-flash-cut');
    const captionWordsEl = document.getElementById('orbit-caption-words');
    const engineCards = mockup.querySelectorAll('.engine-card');
    const fallbackEl = document.getElementById('orbit-engine-fallback');
    const playheadEl = document.getElementById('orbit-playhead');
    const capBlocks = mockup.querySelectorAll('.cap-block');

    // Hinglish phrases & word sequences
    const captionPhases = [
      { start: 0, end: 3200, words: ["Bas", "3", "second", "mein"] },
      { start: 3200, end: 6400, words: ["hook", "lagao"] },
      { start: 6400, end: 9600, words: ["aur", "dekho", "magic"] }
    ];

    // Reduced motion handling: static final state
    if (prefersReducedMotion) {
      if (promptTextEl) promptTextEl.textContent = fullPrompt;
      if (promptCursorEl) promptCursorEl.style.display = 'none';
      if (typingDotsEl) typingDotsEl.style.display = 'none';
      checklistItems.forEach(item => item.classList.add('is-checked'));
      if (frameImgs.length > 0) {
        frameImgs.forEach((img, i) => img.classList.toggle('is-active', i === 0));
      }
      if (captionWordsEl) captionWordsEl.textContent = "Bas 3 second mein hook lagao aur dekho magic";
      if (monitorTcEl) monitorTcEl.textContent = "00:00:03:00";
      if (engineCards.length > 0) {
        engineCards.forEach((c, i) => c.classList.toggle('is-active', i === 0));
      }
      if (fallbackEl) fallbackEl.classList.add('is-active');
      if (playheadEl) playheadEl.style.left = '50%';
      capBlocks.forEach(b => b.classList.add('is-passed'));
      return;
    }

    let rafId = null;
    let startTime = null;
    let lastFrameIdx = -1;
    const loopDuration = 9600; // 9.6s total cycle

    function tick(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = elapsed % loopDuration;

      // 1. User Prompt letter-by-letter typing (0ms -> 2200ms)
      if (promptTextEl) {
        if (t < 2200) {
          const charIdx = Math.min(fullPrompt.length, Math.floor((t / 2200) * fullPrompt.length));
          promptTextEl.textContent = fullPrompt.slice(0, charIdx);
          if (promptCursorEl) promptCursorEl.style.opacity = (Math.floor(t / 250) % 2 === 0) ? '1' : '0';
        } else {
          promptTextEl.textContent = fullPrompt;
          if (promptCursorEl) promptCursorEl.style.opacity = '0';
        }
      }

      // 2. AI Bubble: 3-dot typing indicator (2200ms -> 3200ms), then checklist ticking (3200ms -> 7800ms)
      if (typingDotsEl) {
        typingDotsEl.style.display = (t >= 2200 && t < 3200) ? 'inline-flex' : 'none';
      }

      // Checklist ticking
      const checkTimes = [3400, 4200, 5000, 5800, 6600, 7400];
      checklistItems.forEach((item, idx) => {
        if (t >= checkTimes[idx]) {
          item.classList.add('is-checked');
        } else {
          item.classList.remove('is-checked');
        }
      });

      // 3. Monitor: Hard cuts every 1200ms with flash
      const totalFrames = frameImgs.length || 4;
      const frameIdx = Math.floor(t / 1200) % totalFrames;
      if (frameIdx !== lastFrameIdx) {
        frameImgs.forEach((img, i) => {
          img.classList.toggle('is-active', i === frameIdx);
        });
        if (cutFlashEl && lastFrameIdx !== -1) {
          cutFlashEl.classList.remove('flash-active');
          void cutFlashEl.offsetWidth; // force reflow
          cutFlashEl.classList.add('flash-active');
        }
        lastFrameIdx = frameIdx;
      }

      // Monitor Timecode
      if (monitorTcEl) {
        monitorTcEl.textContent = formatSMPTE(t / 1000);
      }

      // Burned-in caption line animating word-by-word
      if (captionWordsEl) {
        let currentPhase = captionPhases.find(p => t >= p.start && t < p.end);
        if (!currentPhase) currentPhase = captionPhases[0];
        const phaseDuration = currentPhase.end - currentPhase.start;
        const timeInPhase = t - currentPhase.start;
        const wordCount = currentPhase.words.length;
        const wordsToShowCount = Math.min(wordCount, Math.floor((timeInPhase / phaseDuration) * (wordCount + 0.5)) + 1);
        const activeWords = currentPhase.words.slice(0, wordsToShowCount).join(' ');
        captionWordsEl.textContent = activeWords;
      }

      // 4. Engine Switcher: Highlight moves between options
      // 0 -> 3200ms: Cloud (0)
      // 3200 -> 6400ms: Accounts (1)
      // 6400 -> 9600ms: Computer (2)
      const activeEngineIdx = Math.min(2, Math.floor(t / 3200));
      engineCards.forEach((card, idx) => {
        card.classList.toggle('is-active', idx === activeEngineIdx);
      });

      // Fallback line: shows during engine 1 failover (4000ms -> 6200ms)
      if (fallbackEl) {
        fallbackEl.classList.toggle('is-active', t >= 4000 && t < 6200);
      }

      // 5. Timeline: Playhead sweep & caption blocks
      const progressPct = (t / loopDuration) * 100;
      if (playheadEl) {
        playheadEl.style.left = `${progressPct}%`;
      }

      // Caption blocks highlight as playhead sweeps over them
      capBlocks.forEach((block, idx) => {
        const blockPct = (idx / capBlocks.length) * 100;
        block.classList.toggle('is-passed', progressPct >= blockPct);
      });

      rafId = requestAnimationFrame(tick);
    }

    function startLoop() {
      if (rafId) cancelAnimationFrame(rafId);
      startTime = null;
      lastFrameIdx = -1;
      rafId = requestAnimationFrame(tick);
    }

    function stopLoop() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    // IntersectionObserver to run loop only when mockup is in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startLoop();
        } else {
          stopLoop();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(mockup);
  }

  // =====================================================================
  // AI PIPELINE SCROLL-LINKED CONTROLLER
  // =====================================================================
  function initAiPipeline() {
    const container = document.getElementById('ai-pipeline');
    if (!container) return;

    function update() {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const startY = vh * 0.82;
      const totalDist = rect.height + vh * 0.45;
      const progress = Math.max(0, Math.min(1, (startY - rect.top) / totalDist));

      if (prefersReducedMotion) {
        const steps = container.querySelectorAll('.pipeline-step');
        steps.forEach(s => s.classList.add('is-reached'));
        const lineFill = document.getElementById('pipeline-line-fill');
        if (lineFill) lineFill.style.transform = 'scaleX(1)';
        const lineFillV = document.getElementById('pipeline-line-fill-v');
        if (lineFillV) lineFillV.style.transform = 'scaleY(1)';
        const svgPath = document.getElementById('pipeline-svg-path');
        if (svgPath) svgPath.style.strokeDashoffset = '0';
        return;
      }

      // Scale line
      const lineFill = document.getElementById('pipeline-line-fill');
      if (lineFill) lineFill.style.transform = `scaleX(${progress})`;

      const lineFillV = document.getElementById('pipeline-line-fill-v');
      if (lineFillV) lineFillV.style.transform = `scaleY(${progress})`;

      // SVG stroke-dashoffset
      const svgPath = document.getElementById('pipeline-svg-path');
      if (svgPath) {
        svgPath.style.strokeDashoffset = String(1000 * (1 - progress));
      }

      // Step cards pop-in sequentially
      const steps = container.querySelectorAll('.pipeline-step');
      const total = steps.length;
      steps.forEach((step, idx) => {
        const threshold = total > 1 ? (idx / (total - 1)) * 0.88 : 0;
        if (progress >= threshold) {
          step.classList.add('is-reached');
        } else {
          step.classList.remove('is-reached');
        }
      });
    }

    window.__updateAiPipeline = update;
    update();
  }

  // =====================================================================
  // AI FACTS COUNTER & POP CONTROLLER
  // =====================================================================
  function initAiFacts() {
    const row = document.querySelector('.ai-facts-row');
    if (!row) return;

    const factTiles = row.querySelectorAll('.ai-fact-tile');

    if (prefersReducedMotion) {
      factTiles.forEach(tile => {
        const bigEl = tile.querySelector('.fact-big');
        if (bigEl && bigEl.dataset.target) bigEl.textContent = bigEl.dataset.target;
        tile.classList.add('is-inview');
      });
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          factTiles.forEach((tile, tileIdx) => {
            tile.classList.add('is-inview');
            const bigEl = tile.querySelector('.fact-big');
            if (!bigEl) return;
            const target = bigEl.dataset.target || '';

            // Numerical counting
            if (/^\d+$/.test(target)) {
              const endNum = parseInt(target, 10);
              if (endNum === 0) {
                // Count down from 4 to 0 for dramatic punch
                let cur = 4;
                bigEl.textContent = String(cur);
                const timer = setInterval(() => {
                  cur--;
                  bigEl.textContent = String(cur);
                  if (cur <= 0) {
                    clearInterval(timer);
                    bigEl.style.transform = 'scale(1.15)';
                    setTimeout(() => { bigEl.style.transform = 'scale(1)'; }, 140);
                  }
                }, 120);
              } else {
                // Count up 0 -> endNum
                let cur = 0;
                bigEl.textContent = '0';
                const duration = 600;
                const stepTime = Math.max(40, duration / endNum);
                const timer = setInterval(() => {
                  cur++;
                  bigEl.textContent = String(cur);
                  if (cur >= endNum) {
                    clearInterval(timer);
                    bigEl.style.transform = 'scale(1.15)';
                    setTimeout(() => { bigEl.style.transform = 'scale(1)'; }, 140);
                  }
                }, stepTime);
              }
            } else {
              // Non-numeric like "हिं" - pop stamp animation
              bigEl.style.display = 'inline-block';
              bigEl.style.transform = 'scale(0.3) rotate(-15deg)';
              bigEl.style.opacity = '0';
              setTimeout(() => {
                bigEl.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease';
                bigEl.style.transform = 'scale(1) rotate(0deg)';
                bigEl.style.opacity = '1';
              }, tileIdx * 150 + 100);
            }
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    observer.observe(row);
  }

  // =====================================================================
  // RENDER PORTFOLIO
  // =====================================================================
  function render() {
    const app = document.getElementById('app');
    if (!app) return;

    const data = window.PORTFOLIO || {};

    if (data.name && data.year) {
      document.title = `${data.name} — Portfolio ${data.year}`;
    }

    const firstName = data.firstName || 'VAIBHAV';
    const displayName = firstName.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

    // 1. Hero Section
    const vidData = data.videos || {};
    const showreelSrc = vidData.showreel || 'video/drs.mp4';
    const firstReel = (vidData.reels && vidData.reels[0]) ? vidData.reels[0] : {};
    const firstPoster = firstReel.poster || 'images/video/drs.jpg';

    const heroHTML = `
      <section class="hero paper">
        <div class="hero-inner">
          <div class="hero-top">
            <div class="label">${escapeHTML(data.role)}</div>
            <div class="label">${escapeHTML(data.year)}</div>
          </div>
          <div class="hero-word mega" aria-label="PORTFOLIO">
            <span class="char-wrap"><span class="char" style="--ci:0">P</span></span>
            <span class="char-wrap"><span class="char" style="--ci:1">O</span></span>
            <span class="char-wrap"><span class="char" style="--ci:2">R</span></span>
            <span class="char-wrap"><span class="char" style="--ci:3">T</span></span>
            <span class="char-wrap"><span class="char" style="--ci:4">F</span></span>
            <div class="hero-o">
              ${imgHelper(data.heroPortrait, data.name, '', true)}
            </div>
            <span class="char-wrap"><span class="char" style="--ci:5">L</span></span>
            <span class="char-wrap"><span class="char" style="--ci:6">I</span></span>
            <span class="char-wrap"><span class="char" style="--ci:7">O</span></span>
          </div>
          <div class="glyphs">
            <span>✸</span>
            <span>✦</span>
            <span>♣</span>
          </div>
          <div class="scroll-cue">SCROLL ↓</div>

        </div>

        <!-- Hero motion graphics (pure CSS/SVG, no video) -->
        <div class="hero-badge" aria-hidden="true">
          <!-- One SVG, one centre (100,100): ring text, glow, red disc and star all share it -->
          <svg viewBox="0 0 200 200" class="hero-badge-svg">
            <defs><path id="badgeCircle" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"/></defs>
            <g class="hb-ring">
              <text><textPath href="#badgeCircle" textLength="463" lengthAdjust="spacingAndGlyphs">VIDEO EDITOR ✸ GRAPHIC DESIGNER ✸ CUTFRAME STUDIO ✸ </textPath></text>
            </g>
            <circle class="hb-glow" cx="100" cy="100" r="44"/>
            <circle class="hb-disc" cx="100" cy="100" r="44"/>
            <path class="hb-star" d="${Array.from({ length: 16 }, (_, i) => {
              const r = i % 2 ? 7 : 20, a = (Math.PI / 8) * i - Math.PI / 2;
              return (i ? 'L' : 'M') + (100 + r * Math.cos(a)).toFixed(2) + ',' + (100 + r * Math.sin(a)).toFixed(2);
            }).join(' ')} Z"/>
          </svg>
        </div>
        <div class="hero-wave" aria-hidden="true">
          <div class="hero-wave-bars">${Array.from({ length: 28 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div>
          <span class="hero-wave-tc" id="hero-tc">00:00:00:00</span>
        </div>
      </section>
    `;

    // 2. About Section with Scroll-Scrubbed Portrait
    const frames = data.aboutFrames || [
      'images/portrait/frame1.webp',
      'images/portrait/frame2.webp',
      'images/portrait/frame3.webp',
      'images/portrait/frame4.webp'
    ];

    const aboutHTML = `
      <section class="about paper">
        <div class="about-grid">
          <div class="about-stage-wrap">
            <div class="select-frame portrait-stage">
              <div class="portrait-glow"></div>
              <div class="portrait-stack" id="portrait-stack">
                <img src="${escapeHTML(frames[0])}" class="scrub-frame f1" alt="${escapeHTML(data.name)}" loading="eager" fetchpriority="high">
                <img src="${escapeHTML(frames[1])}" class="scrub-frame f2" alt="" loading="eager">
                <img src="${escapeHTML(frames[2])}" class="scrub-frame f3" alt="" loading="eager">
                <img src="${escapeHTML(frames[3])}" class="scrub-frame f4" alt="" loading="eager">
              </div>
              <i></i><i></i><i></i><i></i>
              <span class="dims">${escapeHTML(displayName)} · 900 × 1150</span>
            </div>
          </div>
          <div class="about-right">
            <h2 class="mega">ABOUT ME</h2>
            <p class="bio reveal-fade">${escapeHTML(data.bio)}</p>
            <div class="cv">
              <div>
                <h3 class="reveal-fade">EDUCATION</h3>
                ${(data.education || []).map((ed, idx) => `
                  <div class="item reveal-fade" style="--ii: ${idx}">
                    <b>${escapeHTML(ed.title)}</b>
                    <span>${escapeHTML(ed.place)} · ${escapeHTML(ed.years)}</span>
                  </div>
                `).join('')}
              </div>
              <div>
                <h3 class="reveal-fade">EXPERIENCE</h3>
                ${(data.experience || []).map((ex, idx) => `
                  <div class="item reveal-fade" style="--ii: ${idx}">
                    <b>${escapeHTML(ex.title)}</b>
                    <span>${escapeHTML(ex.place)} · ${escapeHTML(ex.years)}</span>
                  </div>
                `).join('')}
              </div>
              <div>
                <h3 class="reveal-fade">SKILLS</h3>
                <div class="chips">
                  ${(data.skills || []).map((s, idx) => `<span style="--ci: ${idx}">${escapeHTML(s)}</span>`).join('')}
                </div>
              </div>
              <div>
                <h3 class="reveal-fade">TOOLS</h3>
                <div class="chips">
                  ${(data.tools || []).map((t, idx) => `<span style="--ci: ${idx}">${escapeHTML(t)}</span>`).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    // 3. Torn Black Band Wrap
    const tornBandHTML = `
      <div class="band-wrap">
        <div class="torn-band torn">
          <div class="scroller mega">
            ${buildScrollerHTML(`<span>${escapeHTML(firstName)} ✸ PORTFOLIO ✸</span>`, 8)}
          </div>
          <div class="cutout">
            ${imgHelper(data.aboutCutout, data.name)}
          </div>
        </div>
      </div>
    `;

    // 4. Polaroid Notes Section
    const notesHTML = `
      <section class="notes paper">
        <div class="notes-row">
          ${(data.quotes || []).map((q, idx) => `
            <div class="polaroid" style="--pi: ${idx}">
              <div class="inner">
                <span>“${escapeHTML(q.text)}”</span>
                <div class="by">— ${escapeHTML(q.by)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;

    // 5. Sections and Projects
    const sectionsHTML = (data.sections || []).map(sec => {
      const marqueeHTML = `
        <div class="marquee">
          <div class="scroller mega">
            ${buildScrollerHTML(`<span>${escapeHTML(sec.band)}</span><span class="star">✦✦✦</span>`, 10)}
          </div>
        </div>
      `;

      const projectsHTML = (sec.projects || []).map(proj => {
        const firstNote = (proj.notes && proj.notes.length > 0) ? proj.notes[0] : '';
        const hasGallery = proj.gallery && Array.isArray(proj.gallery) && proj.gallery.length > 0;
        const isSingleImage = hasGallery && proj.gallery.length === 1;

        const galleryHTML = hasGallery ? `
          <section class="gallery dark-grid">
            <div class="gallery-grid${isSingleImage ? ' n1' : ''}">
              ${proj.gallery.map((g, gi) => imgHelper(g, proj.title + ' gallery image', '', false, `style="--gi: ${gi}"`)).join('')}
            </div>
          </section>
        ` : '';

        return `
          <div class="cover">
            ${imgHelper(proj.cover, proj.title)}
            <div class="corner tl">PORTFOLIO OF ${escapeHTML(data.name)}</div>
            <div class="corner tr">${escapeHTML(data.tagline)}</div>
            <div class="corner bl">${escapeHTML(data.coords)}</div>
            <div class="corner br">${escapeHTML(data.year)} PORTFOLIO</div>
            ${proj.coverTitle === false ? '' : `<div class="title mega">${escapeHTML(proj.title)}</div>`}
          </div>

          <section class="case dark-grid">
            <div class="sheet paper" style="--accent: ${escapeHTML(proj.accent || '#7c3aed')}">
              <div class="head">
                <div class="proj">Project: <b>${escapeHTML(proj.title)}</b> — ${escapeHTML(proj.type)}<br>${escapeHTML(proj.about)} · Based in ${escapeHTML(proj.based)}</div>
                <div class="stamp">★ ${escapeHTML(firstNote)}</div>
              </div>
              <div class="body${proj.sketch ? '' : ' no-sketch'}">
                ${proj.sketch ? `<div class="sketch">
                  ${imgHelper(proj.sketch, proj.title + ' sketch')}
                  <div class="caption">↑ ${escapeHTML(proj.sketchCaption || 'process sketch')}</div>
                </div>` : ''}
                <div>
                  <h4>Colour palette</h4>
                  <div class="swatches">
                    ${(proj.palette || []).map((sw, idx) => `
                      <div class="swatch reveal-fade" style="--ii: ${idx}">
                        <i style="background: ${escapeHTML(sw.hex)}"></i>
                        ${escapeHTML(sw.label)}
                        <small>${escapeHTML(sw.hex)}</small>
                      </div>
                    `).join('')}
                  </div>
                  <h4>${escapeHTML(proj.notesTitle || 'What the logo says:')}</h4>
                  <ul class="say">
                    ${(proj.notes || []).map((n, idx) => `
                      <li class="reveal-fade" style="--ii: ${idx}">${escapeHTML(n)}</li>
                    `).join('')}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          ${galleryHTML}
        `;
      }).join('');

      return marqueeHTML + projectsHTML;
    }).join('');

    // 6. Reels & Video Section
    const videoTile = (v, wide) => `
      <div class="vtile${wide ? ' wide' : ''}" tabindex="0" role="button" aria-label="Play ${escapeHTML(v.title)}" data-src="${escapeHTML(v.src)}" data-title="${escapeHTML(v.title)}" data-type="${escapeHTML(v.type || '')}">
        <video class="vtile-video" muted loop playsinline preload="none" poster="${escapeHTML(v.poster)}">
          <source src="${escapeHTML(v.src)}" type="video/mp4">
        </video>
        <div class="vtile-overlay">
          <span class="vplay" aria-hidden="true">▶</span>
          <span class="vmeta">
            <b>${escapeHTML(v.title)}</b>
            ${escapeHTML(v.type || '')}
          </span>
        </div>
      </div>
    `;

    const hasWideReels = vidData.wide && Array.isArray(vidData.wide) && vidData.wide.length > 0;
    const videosHTML = vidData ? `
      <div class="marquee">
        <div class="scroller mega">
          ${buildScrollerHTML(`<span>${escapeHTML(vidData.band)}</span><span class="star">✦✦✦</span>`, 10)}
        </div>
      </div>
      <section class="videos dark-grid">
        <div class="videos-inner">
          <div class="videos-head">
            <h3 class="mega">${escapeHTML(vidData.title || '')}</h3>
            <p class="reveal-fade">${escapeHTML(vidData.intro || '')}</p>
          </div>
          <div class="reels-grid">
            ${(vidData.reels || []).map(v => videoTile(v, false)).join('')}
          </div>
          ${hasWideReels ? (vidData.wide || []).map(v => videoTile(v, true)).join('') : ''}
        </div>
      </section>` : '';

    // 6.5 AI Studio & Orbit Studio Section
    const aiData = data.aiStudio || {};
    const aiMarqueeHTML = aiData.band ? `
      <div class="marquee ai-marquee">
        <div class="scroller mega">
          ${buildScrollerHTML(`<span>${escapeHTML(aiData.band)}</span><span class="star">✦✦✦</span>`, 10)}
        </div>
      </div>
    ` : '';

    const aiStudioSectionHTML = aiData.title ? `
      <section class="ai-studio dark-grid" id="ai-studio">
        <div class="ai-studio-inner">
          <div class="ai-studio-head">
            <h3 class="mega">${escapeHTML(aiData.title || 'I EDIT WITH AI')}</h3>
            <p class="reveal-fade">${escapeHTML(aiData.intro || '')}</p>
          </div>

          <!-- ORBIT STUDIO APP MOCKUP -->
          <div class="orbit-wrap reveal-fade">
            <div class="sr-only">
              Interactive preview of Orbit Studio: AI-powered video editing workspace featuring automated prompt ingestion, multi-model redundant engine routing across cloud and local models, cross-cutting 9:16 vertical video preview with word-by-word Hinglish captions, and automated multi-track video timeline assembly.
            </div>

            <div class="orbit-mockup" id="orbit-mockup" aria-hidden="true">
              <!-- Window Chrome -->
              <div class="orbit-chrome">
                <div class="orbit-chrome-left">
                  <span class="orbit-dot dot-red"></span>
                  <span class="orbit-dot dot-yellow"></span>
                  <span class="orbit-dot dot-green"></span>
                  <span class="orbit-window-title">${escapeHTML(aiData.app?.name || 'ORBIT STUDIO')}</span>
                </div>
                <div class="orbit-chrome-center">
                  <span class="orbit-pill">${escapeHTML(aiData.app?.status || 'In development · 2026')}</span>
                </div>
                <div class="orbit-chrome-right">
                  <span class="orbit-ai-badge">
                    <span class="orbit-ai-dot"></span>
                    <span>AI</span>
                  </span>
                </div>
              </div>

              <!-- Main 3-Column Studio Body -->
              <div class="orbit-body">
                <!-- Left: AI Director -->
                <div class="orbit-panel orbit-director">
                  <div class="orbit-panel-hdr">
                    <div class="panel-hdr-left">
                      <span class="panel-icon">◈</span>
                      <span>AI DIRECTOR</span>
                    </div>
                    <span class="panel-status">ACTIVE</span>
                  </div>
                  <div class="orbit-chat">
                    <div class="orbit-msg msg-user">
                      <div class="msg-meta">USER // PROMPT</div>
                      <div class="msg-content user-prompt" id="orbit-user-prompt">
                        <span class="prompt-text"></span><span class="prompt-cursor"></span>
                      </div>
                    </div>
                    <div class="orbit-msg msg-ai" id="orbit-ai-bubble">
                      <div class="msg-meta">
                        <span class="ai-badge-sm">ORBIT CO-PILOT</span>
                        <span class="ai-typing-indicator" id="orbit-typing-dots">
                          <i></i><i></i><i></i>
                        </span>
                      </div>
                      <div class="orbit-checklist" id="orbit-checklist">
                        <div class="check-item"><span class="check-box"></span><span class="check-text">Hook found at 00:02</span></div>
                        <div class="check-item"><span class="check-box"></span><span class="check-text">Script ✓</span></div>
                        <div class="check-item"><span class="check-box"></span><span class="check-text">Scenes generated ✓</span></div>
                        <div class="check-item"><span class="check-box"></span><span class="check-text">Voice ✓</span></div>
                        <div class="check-item"><span class="check-box"></span><span class="check-text">Hinglish captions ✓</span></div>
                        <div class="check-item"><span class="check-box"></span><span class="check-text">3 reels ready ✓</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Centre: 9:16 Preview Monitor -->
                <div class="orbit-panel orbit-monitor-panel">
                  <div class="orbit-panel-hdr">
                    <div class="monitor-rec">
                      <span class="rec-dot"></span>
                      <span>PREVIEW</span>
                    </div>
                    <div class="monitor-tc" id="orbit-monitor-tc">00:00:00:00</div>
                  </div>
                  <div class="orbit-monitor-viewport">
                    <div class="orbit-monitor-bezel">
                      <span class="vf-bracket vf-tl"></span>
                      <span class="vf-bracket vf-tr"></span>
                      <span class="vf-bracket vf-bl"></span>
                      <span class="vf-bracket vf-br"></span>
                      <span class="vf-center-cross"></span>
                      <div class="monitor-top-info">
                        <span class="mon-res">9:16 UHD</span>
                        <span class="mon-fps">24 FPS</span>
                      </div>

                      <div class="orbit-frames-stack" id="orbit-frames-stack">
                        ${(aiData.app?.frames || []).map((frameSrc, idx) => `
                          <img src="${escapeHTML(frameSrc)}" alt="" class="orbit-frame-img ${idx === 0 ? 'is-active' : ''}" data-index="${idx}">
                        `).join('')}
                        <div class="orbit-flash-cut" id="orbit-flash-cut"></div>
                      </div>

                      <div class="orbit-caption-overlay" id="orbit-caption-overlay">
                        <div class="orbit-caption-words" id="orbit-caption-words"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Right: Engine Switcher (hide on mobile) -->
                <div class="orbit-panel orbit-engine">
                  <div class="orbit-panel-hdr">
                    <div class="panel-hdr-left">
                      <span class="panel-icon">⚡</span>
                      <span>ENGINE</span>
                    </div>
                    <span class="panel-tag">FAILOVER</span>
                  </div>
                  <div class="engine-options" id="orbit-engine-options">
                    <div class="engine-card is-active" data-engine="0">
                      <div class="engine-card-top">
                        <span class="engine-name">CLOUD</span>
                        <span class="engine-badge">FASTEST</span>
                      </div>
                      <div class="engine-desc">Gemini / Claude</div>
                    </div>
                    <div class="engine-card" data-engine="1">
                      <div class="engine-card-top">
                        <span class="engine-name">YOUR AI ACCOUNTS</span>
                        <span class="engine-badge">BYOK</span>
                      </div>
                      <div class="engine-desc">Custom API keys & limits</div>
                    </div>
                    <div class="engine-card" data-engine="2">
                      <div class="engine-card-top">
                        <span class="engine-name">ON YOUR COMPUTER</span>
                        <span class="engine-badge">OFFLINE</span>
                      </div>
                      <div class="engine-desc">Local models · 100% private</div>
                    </div>
                  </div>
                  <div class="engine-fallback" id="orbit-engine-fallback">
                    <span class="fallback-icon">↻</span>
                    <span class="fallback-text">Gemini busy → switching to Claude ✓</span>
                  </div>
                </div>
              </div>

              <!-- Bottom: Timeline with 3 tracks + A1 audio -->
              <div class="orbit-timeline-wrap">
                <div class="orbit-timeline-ruler">
                  <span>00:00:00:00</span>
                  <span>00:00:02:10</span>
                  <span>00:00:04:20</span>
                  <span>00:00:07:06</span>
                  <span>00:00:09:14</span>
                </div>
                <div class="orbit-timeline" id="orbit-timeline">
                  <div class="orbit-playhead" id="orbit-playhead">
                    <div class="playhead-cap"></div>
                    <div class="playhead-line"></div>
                  </div>

                  <!-- Track 1: AI B-ROLL clips in purple with shimmer -->
                  <div class="orbit-track track-v2">
                    <div class="track-label">V2 · AI B-ROLL</div>
                    <div class="track-lane">
                      <div class="track-clip clip-purple clip-shimmer" style="left: 10%; width: 28%;">
                        <span>AI_B-ROLL_FLOW_01</span>
                      </div>
                      <div class="track-clip clip-purple clip-shimmer" style="left: 42%; width: 26%;">
                        <span>AI_SCENE_GEN_02</span>
                      </div>
                      <div class="track-clip clip-purple clip-shimmer" style="left: 72%; width: 24%;">
                        <span>AI_B-ROLL_CUT_03</span>
                      </div>
                    </div>
                  </div>

                  <!-- Track 2: V1 clips -->
                  <div class="orbit-track track-v1">
                    <div class="track-label">V1 · RAW CLIPS</div>
                    <div class="track-lane">
                      <div class="track-clip clip-teal" style="left: 0%; width: 32%;">
                        <span>RAW_HOOK_A01</span>
                      </div>
                      <div class="track-clip clip-amber" style="left: 33%; width: 30%;">
                        <span>CLINIC_TALK_02</span>
                      </div>
                      <div class="track-clip clip-teal" style="left: 64%; width: 36%;">
                        <span>MASTER_OUTRO_03</span>
                      </div>
                    </div>
                  </div>

                  <!-- Track 3: CAPTIONS track filling with small blocks -->
                  <div class="orbit-track track-cap">
                    <div class="track-label">CAP · HINGLISH</div>
                    <div class="track-lane caption-blocks-lane" id="orbit-caption-lane">
                      ${Array.from({ length: 18 }, (_, i) => `<span class="cap-block" style="left: ${(i * 5.5).toFixed(1)}%; width: 4.6%;"></span>`).join('')}
                    </div>
                  </div>

                  <!-- Audio Track A1 with waveform bars -->
                  <div class="orbit-track track-a1">
                    <div class="track-label">A1 · AUDIO 48K</div>
                    <div class="track-lane audio-lane">
                      <div class="orbit-waveform-bars">
                        ${Array.from({ length: 54 }, (_, i) => `<i style="--i: ${i}; height: ${Math.round(20 + Math.abs(Math.sin(i * 0.38)) * 75)}%;"></i>`).join('')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Name + app.line as caption under mockup -->
            <div class="orbit-caption">
              <b>${escapeHTML(aiData.app?.name || 'ORBIT STUDIO')}</b> — ${escapeHTML(aiData.app?.line || '')}
            </div>
          </div>

          <!-- AI PIPELINE -->
          <div class="ai-pipeline-wrap">
            <div class="ai-pipeline-header">
              <span class="ai-sublabel">END-TO-END WORKFLOW</span>
              <h4 class="mega">AI PIPELINE</h4>
            </div>

            <div class="ai-pipeline" id="ai-pipeline">
              <svg class="pipeline-svg-desktop" viewBox="0 0 1000 24" preserveAspectRatio="none" aria-hidden="true">
                <line x1="0" y1="12" x2="1000" y2="12" class="pipeline-svg-bg" />
                <line x1="0" y1="12" x2="1000" y2="12" class="pipeline-svg-path" id="pipeline-svg-path" />
              </svg>

              <div class="pipeline-line-track" aria-hidden="true">
                <div class="pipeline-line-fill" id="pipeline-line-fill"></div>
              </div>
              <div class="pipeline-line-track-v" aria-hidden="true">
                <div class="pipeline-line-fill-v" id="pipeline-line-fill-v"></div>
              </div>

              <div class="pipeline-steps-grid">
                ${(aiData.pipeline || []).map((stepObj, idx) => {
                  const stepNum = String(idx + 1).padStart(2, '0');
                  const isAiStep = (idx >= 1 && idx <= 4); // 2, 3, 4, 5
                  const isHandmade = (idx === 5); // 6

                  return `
                    <div class="pipeline-step" data-step-idx="${idx}" style="--si: ${idx}">
                      <div class="step-top">
                        <span class="step-num">${stepNum}</span>
                        ${isAiStep ? '<span class="pipe-tag tag-ai">AI</span>' : ''}
                        ${isHandmade ? '<span class="pipe-tag tag-handmade">HAND-MADE</span>' : ''}
                      </div>
                      <div class="step-title">${escapeHTML(stepObj.step)}</div>
                      <div class="step-detail">${escapeHTML(stepObj.detail)}</div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- FACTS ROW -->
          <div class="ai-facts-row">
            ${(aiData.facts || []).map((fact, idx) => `
              <div class="ai-fact-tile reveal-fade" style="--ii: ${idx}">
                <div class="fact-big mega" data-target="${escapeHTML(fact.big)}">${escapeHTML(fact.big)}</div>
                <div class="fact-small">${escapeHTML(fact.small)}</div>
              </div>
            `).join('')}
          </div>

          <!-- TOOLS MARQUEE -->
          <div class="ai-tools-wrap">
            <div class="ai-tools-label">TOOLS IN MY AI WORKFLOW</div>
            <div class="marquee ai-tools-marquee">
              <div class="scroller">
                ${buildScrollerHTML(
                  (aiData.tools || []).map(t => `<span class="tool-chip">${escapeHTML(t)}<i class="tool-sep">✦</i></span>`).join(''),
                  8
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    ` : '';

    const aiStudioHTML = aiMarqueeHTML + aiStudioSectionHTML;

    // 7. Contact Section
    const contactData = data.contact || {};
    const contactHTML = `
      <section class="contact paper">
        <div class="mega">
          LET'S WORK<br>
          <span class="red">TOGETHER</span>
        </div>
        <div class="contact-grid">
          <a class="reveal-fade" style="--ii: 0" href="mailto:${escapeHTML(contactData.email || '')}">
            <b>EMAIL</b>
            <span>${escapeHTML(contactData.email || '')}</span>
          </a>
          <a class="reveal-fade" style="--ii: 1" href="tel:${escapeHTML((contactData.phone || '').replace(/\s+/g, ''))}">
            <b>PHONE</b>
            <span>${escapeHTML(contactData.phone || '')}</span>
          </a>
          <a class="reveal-fade" style="--ii: 2" href="https://instagram.com/${escapeHTML((contactData.instagram || '').replace(/^@/, ''))}" target="_blank" rel="noopener noreferrer">
            <b>INSTAGRAM</b>
            <span>${escapeHTML(contactData.instagram || '')}</span>
          </a>
          <a class="reveal-fade" style="--ii: 3" href="https://${escapeHTML((contactData.website || '').replace(/^https?:\/\//, ''))}" target="_blank" rel="noopener noreferrer">
            <b>STUDIO</b>
            <span>${escapeHTML(contactData.website || '')}</span>
          </a>
          <a class="reveal-fade" style="--ii: 4" href="https://${escapeHTML((contactData.linkedin || '').replace(/^https?:\/\//, ''))}" target="_blank" rel="noopener noreferrer">
            <b>LINKEDIN</b>
            <span>${escapeHTML(contactData.linkedin || '')}</span>
          </a>
        </div>
        <div class="foot">
          <div>© ${escapeHTML(data.year)} ${escapeHTML(data.name)}</div>
          <div>✸ ✦ ♣</div>
        </div>
      </section>
    `;

    // Render into <main id="app">
    app.innerHTML = heroHTML + aboutHTML + tornBandHTML + notesHTML + sectionsHTML + videosHTML + aiStudioHTML + contactHTML;

    // Apply paper crumple & torn paper edges
    applyCrumpleTexture();
    updateTornEdges();

    // Check images that might already be cached or failed
    app.querySelectorAll('img').forEach(img => {
      if (img.complete && img.naturalWidth === 0) {
        window.__handleImgError(img);
      }
    });

    // Initialize subsystems
    initPortraitScrubber();
    initVideoEngine();
    initScrollAnimations();
    initSmoothScroll();
    initOrbitStudio();
    initAiPipeline();
    initAiFacts();

    // Start Intro Loader (or reveal directly)
    initIntroLoader(() => {
      triggerHeroReveal();
      if (lenisInstance) {
        lenisInstance.start();
      }
    });
  }

  // Debounced resize handler for torn edge recalculation
  let resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateTornEdges, 120);
  });

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
