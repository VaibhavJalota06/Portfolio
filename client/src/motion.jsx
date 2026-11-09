// Shared motion helpers for the public homepage: GSAP + ScrollTrigger, Lenis smooth scrolling,
// and small components that pre-split text so React owns every span (no DOM mutation of React text).
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

const mq = (q) => typeof window !== 'undefined' && window.matchMedia(q).matches;
export const reduceMotion = mq('(prefers-reduced-motion: reduce)');
export const finePointer = mq('(hover: hover) and (pointer: fine)');

/* ---------- smooth scrolling ---------- */
let lenis = null;
let tick = null;

export function startSmoothScroll() {
  if (reduceMotion || lenis) return lenis;
  // lerp: how quickly the page catches up to the wheel (higher = snappier). 0.2 keeps it smooth without lag.
  lenis = new Lenis({ lerp: 0.2, wheelMultiplier: 1.1 });
  lenis.on('scroll', ScrollTrigger.update);
  tick = (t) => lenis && lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function stopSmoothScroll() {
  if (!lenis) return;
  gsap.ticker.remove(tick);
  lenis.destroy();
  lenis = null;
}

export const getLenis = () => lenis;

// Smooth-scroll to an in-page anchor like "#work". Returns false when the target isn't on the page.
export function scrollToHash(hash) {
  const el = hash && hash.length > 1 ? document.querySelector(hash) : null;
  if (!el) return false;
  if (lenis) lenis.scrollTo(el, { offset: -70, duration: 0.9 });
  else el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  return true;
}

// Images loading inside masonry columns change the page height: re-measure triggers, at most every 200ms.
let refreshTimer = null;
export function refreshSoon() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
}

/* ---------- hook: run GSAP inside a scoped context ---------- */
// fn(root) may return a cleanup function (for intervals / listeners). Everything is reverted on unmount.
export function useGsap(fn, deps = []) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (reduceMotion || !ref.current) return undefined;
    const ctx = gsap.context(() => fn(ref.current), ref);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/* ---------- text splitting (rendered by React) ---------- */
// Splits into words → characters. Pass `parts` to style pieces: [{ text, className }]
export function SplitChars({ parts, text, className = '' }) {
  const segs = parts || [{ text }];
  return (
    <span className={className} aria-label={segs.map((s) => s.text).join('')}>
      {segs.map((seg, si) => (
        <span key={si} className={seg.className} aria-hidden="true">
          {seg.text.split(/(\s+)/).map((word, wi) =>
            /^\s+$/.test(word) ? ' ' : word ? (
              <span key={wi} className="cf-w">
                {[...word].map((ch, ci) => <span key={ci} className="cf-c">{ch}</span>)}
              </span>
            ) : null
          )}
        </span>
      ))}
    </span>
  );
}

// Splits lines → masked words, for heading reveals.
export function SplitWords({ lines, className = '', as: Tag = 'h2' }) {
  return (
    <Tag className={className} aria-label={lines.join(' ')}>
      {lines.map((line, li) => (
        <span key={li} className="cf-ln" aria-hidden="true">
          {line.split(' ').map((w, wi) => (
            <React.Fragment key={wi}>
              {wi > 0 && ' '}
              <span className="cf-wm"><span className="cf-wi">{w}</span></span>
            </React.Fragment>
          ))}
        </span>
      ))}
    </Tag>
  );
}

// Heading that reveals word-by-word from a mask when scrolled into view.
export function RevealHeading({ lines, className = '', as = 'h2' }) {
  const ref = useGsap((root) => {
    gsap.from(root.querySelectorAll('.cf-wi'), {
      yPercent: 120, rotate: 6, duration: 1.1, stagger: 0.08, ease: 'expo.out',
      scrollTrigger: { trigger: root, start: 'top 85%' },
    });
  });
  return <div ref={ref}><SplitWords lines={lines} className={className} as={as} /></div>;
}

// Fades/blur-ins its children when scrolled into view.
export function Reveal({ children, className = '', as: Tag = 'div', delay = 0 }) {
  const ref = useGsap((root) => {
    gsap.from(root, {
      autoAlpha: 0, y: 30, filter: 'blur(8px)', duration: 1, delay, ease: 'power3.out', clearProps: 'filter',
      scrollTrigger: { trigger: root, start: 'top 88%' },
    });
  });
  return <Tag ref={ref} className={className}>{children}</Tag>;
}

// Small label that "decodes" from random characters when it scrolls into view.
const GLYPHS = '!<>-_\\/[]{}=+*^?#01ABCDEFX';
export function Scramble({ text, className = '' }) {
  const ref = useRef(null);
  const [out, setOut] = useState(reduceMotion ? text : ' ');
  useEffect(() => {
    if (reduceMotion || !ref.current) return undefined;
    let raf = 0;
    const st = ScrollTrigger.create({
      trigger: ref.current, start: 'top 92%', once: true,
      onEnter: () => {
        const start = performance.now();
        const step = (t) => {
          const p = Math.min((t - start) / 700, 1);
          const n = Math.floor(p * text.length);
          let s = text.slice(0, n);
          for (let i = n; i < text.length; i++) s += text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
          setOut(s);
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
    });
    return () => { st.kill(); cancelAnimationFrame(raf); };
  }, [text]);
  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{out}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}

