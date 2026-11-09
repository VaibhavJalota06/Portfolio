import React from 'react';
import { ArrowRight, MessageCircle, Play } from 'lucide-react';
import { getWhatsAppUrl } from '../contact';
import { gsap, useGsap, SplitChars, scrollToHash } from '../motion';

const LINES = [
  { drift: -6, parts: [{ text: 'We cut' }] },
  { drift: 8, parts: [{ text: 'frames', className: 'o' }, { text: ' that' }] },
  { drift: -4, parts: [{ text: 'make brands ' }, { text: 'move.', className: 'r' }] },
];
const REEL_WORDS = ['Cut.', 'Grade.', 'Animate.', 'Generate.', 'Design.', 'Deliver.'];

export default function AgencyHero({ onOpenDiscovery }) {
  const ref = useGsap((root) => {
    const q = gsap.utils.selector(root);
    const lines = q('.cf-h1 .cf-ln');

    // Start state (set before first paint, so nothing flashes)
    lines.forEach((ln) => gsap.set(ln.querySelectorAll('.cf-c'), { yPercent: 110, rotate: 8 }));
    gsap.set(q('.h-fade, .h-btn'), { autoAlpha: 0, y: 20 });
    gsap.set(q('.cf-reel'), { autoAlpha: 0, y: 80 });

    // Intro: the boot loader from index.html (CUTFRAME on black slices) slides away, then the headline rises.
    const tl = gsap.timeline();
    const loader = document.getElementById('boot-loader');
    if (loader && loader.dataset.intro === '1') {
      const word = loader.querySelector('.word span');
      tl.to(word, { yPercent: -110, duration: 0.5, ease: 'power3.in', delay: 0.35 })
        .to(loader.querySelectorAll('.sl'), { xPercent: (i) => (i % 2 ? 100 : -100), duration: 0.9, stagger: 0.06, ease: 'expo.inOut' }, '-=0.1')
        .add('hero', '-=0.55')
        .add(() => loader.remove());
    } else {
      if (loader) loader.remove();
      tl.add('hero', 0.1);
    }
    lines.forEach((ln, i) => {
      tl.to(ln.querySelectorAll('.cf-c'), { yPercent: 0, rotate: 0, duration: 1, stagger: 0.025, ease: 'expo.out' }, `hero+=${i * 0.12}`);
    });
    tl.to(q('.h-fade'), { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, 'hero+=0.4')
      .to(q('.h-btn'), { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out' }, 'hero+=0.55')
      .to(q('.cf-reel'), { autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out' }, 'hero+=0.6')
      .from(q('.cf-track > div'), { scaleX: 0, duration: 0.8, stagger: 0.05, ease: 'expo.out' }, 'hero+=0.9');

    // Scroll: headline lines drift apart, glow grows
    lines.forEach((ln, i) => {
      gsap.to(ln, { xPercent: LINES[i].drift, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } });
    });
    gsap.to(q('.cf-glow'), { scale: 1.6, opacity: 0.4, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } });

    // Showreel opens up to full frame, colours drift, playhead runs across the timeline
    const reel = q('.cf-reel')[0];
    gsap.fromTo(q('.cf-screen'), { clipPath: 'inset(6% 6% 6% 6% round 14px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: reel, start: 'top 85%', end: 'center 45%', scrub: true } });
    gsap.to(q('.cf-blob'), { xPercent: (i) => [40, -50, 30][i], yPercent: (i) => [20, -30, 40][i], ease: 'none', scrollTrigger: { trigger: reel, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.to(q('.cf-playhead'), { left: () => q('.cf-tl')[0].clientWidth - 18, ease: 'none', scrollTrigger: { trigger: reel, start: 'top 70%', end: 'bottom 20%', scrub: true, invalidateOnRefresh: true } });

    // Kinetic word inside the showreel frame
    const kin = q('.cf-kin')[0];
    let k = 0;
    const timer = setInterval(() => {
      k = (k + 1) % REEL_WORDS.length;
      gsap.timeline()
        .to(kin, { yPercent: -20, autoAlpha: 0, duration: 0.5, ease: 'power2.in' })
        .add(() => { kin.textContent = REEL_WORDS[k]; })
        .fromTo(kin, { yPercent: 20 }, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out' });
    }, 2600);
    return () => clearInterval(timer);
  });

  return (
    <section ref={ref} className="cf-hero">
      <div className="cf-glow" aria-hidden="true" />
      <div className="cf-wrap relative">
        <p className="cf-mono h-fade flex items-center gap-2.5 mb-7">
          <span className="cf-dot" />
          <span className="sm:hidden">Post-production studio · Delhi</span>
          <span className="hidden sm:inline">Video post-production &amp; design studio · Delhi</span>
        </p>

        <h1 className="cf-wide cf-h1">
          {LINES.map((l, i) => (
            <span key={i} className="cf-ln">
              <SplitChars parts={l.parts} />
            </span>
          ))}
        </h1>

        <div className="mt-9 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <p className="h-fade text-[17px] sm:text-lg leading-relaxed text-[#b8b8c4] max-w-[520px]">
            Video editing, AI video, motion graphics and brand design for founders, brands and creators who want content people actually stop for.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2.5">
            <button type="button" onClick={onOpenDiscovery} className="h-btn cf-btn cf-btn-red">
              Book a free call <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={getWhatsAppUrl("Hi Vaibhav, I checked out Cutframe Studio and I'd like to discuss video editing & content for my brand.")}
              target="_blank"
              rel="noopener noreferrer"
              className="h-btn cf-btn cf-btn-wa"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp us
            </a>
            <a href="#work" onClick={(e) => { if (scrollToHash('#work')) e.preventDefault(); }} className="h-btn cf-btn cf-btn-ghost">
              <Play className="w-4 h-4 fill-current" /> See work
            </a>
          </div>
        </div>

        <div className="cf-reel">
          <div className="cf-screen">
            <div className="cf-blob cf-b1" /><div className="cf-blob cf-b2" /><div className="cf-blob cf-b3" />
            <div className="cf-kin cf-wide" aria-hidden="true">{REEL_WORDS[0]}</div>
            <div className="cf-safe" />
            <span className="cf-mono absolute left-4 top-4 z-[2] text-[10px] sm:text-[11px]">CUTFRAME_STUDIO</span>
            <span className="cf-mono absolute right-4 top-4 z-[2] text-[10px] sm:text-[11px]">4K · 24FPS</span>
            <a href="#work" onClick={(e) => { if (scrollToHash('#work')) e.preventDefault(); }} className="cf-play" aria-label="See our work" />
          </div>
          <div className="cf-tl" aria-hidden="true">
            <div className="cf-playhead" />
            <div className="cf-mono flex justify-between mb-2" style={{ fontSize: 9 }}>
              <span>00:00</span><span>00:10</span><span>00:20</span><span>00:30</span><span>00:40</span>
            </div>
            <div className="cf-track">
              <div style={{ flex: 2, background: 'var(--teal)' }}>V2 · TITLES</div>
              <div style={{ flex: 3, background: 'var(--amber)' }}>MOTION_GFX</div>
              <div style={{ flex: 2, background: 'var(--violet)' }}>AI_SCENES</div>
            </div>
            <div className="cf-track">
              <div style={{ flex: 3, background: '#3a3a46' }}>V1 · A-ROLL</div>
              <div style={{ flex: 2, background: 'var(--red)' }}>CUTFRAME_01</div>
              <div style={{ flex: 3, background: 'var(--teal)' }}>GRADE_LUT</div>
              <div style={{ flex: 1, background: 'var(--violet)' }}>VFX</div>
            </div>
            <div className="cf-track"><div className="a">A1 · MASTER_AUDIO</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
