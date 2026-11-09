import React from 'react';
import { ArrowRight, MessageCircle, Play } from 'lucide-react';
import { getWhatsAppUrl } from '../contact';
import { gsap, useGsap, SplitChars, scrollToHash } from '../motion';

const LINES = [
  { drift: 3, parts: [{ text: 'We cut ' }, { text: 'frames', className: 'o' }] },
  { drift: -2, parts: [{ text: 'that make brands ' }, { text: 'move.', className: 'r' }] },
];

export default function AgencyHero({ onOpenDiscovery }) {
  const ref = useGsap((root) => {
    const q = gsap.utils.selector(root);
    const lines = q('.cf-h1 .cf-ln');

    // Start state (set before first paint, so nothing flashes)
    lines.forEach((ln) => gsap.set(ln.querySelectorAll('.cf-c'), { yPercent: 110, rotate: 8 }));
    gsap.set(q('.h-fade, .h-btn'), { autoAlpha: 0, y: 20 });

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
      // No intro (e.g. arrived via /#work): main.jsx fades the loader out, covering the jump to the section.
      tl.add('hero', 0.1);
    }
    lines.forEach((ln, i) => {
      tl.to(ln.querySelectorAll('.cf-c'), { yPercent: 0, rotate: 0, duration: 1, stagger: 0.025, ease: 'expo.out' }, `hero+=${i * 0.12}`);
    });
    tl.to(q('.h-fade'), { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, 'hero+=0.4')
      .to(q('.h-btn'), { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out' }, 'hero+=0.55');

    // Scroll: headline lines drift apart, glow grows
    lines.forEach((ln, i) => {
      gsap.to(ln, { xPercent: LINES[i].drift, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } });
    });
    gsap.to(q('.cf-glow'), { scale: 1.6, opacity: 0.4, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } });
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
      </div>
    </section>
  );
}
