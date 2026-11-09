import React, { useEffect, useRef } from 'react';
import { gsap, reduceMotion } from '../motion';

const WORDS = [
  'Video editing', 'AI video', 'Motion graphics', 'Branding & design', 'Reels & Shorts',
  'Colour grading', 'Sound design', 'Websites', 'Thumbnails', 'Ad creatives',
];

// One strip of big type scrolling slowly to the left (the list is doubled so it loops seamlessly).
export default function AgencyMarqueeStats() {
  const ref = useRef(null);
  useEffect(() => {
    const row = ref.current;
    if (!row || reduceMotion) return undefined;
    let x = 0;
    const loop = () => {
      const w = row.scrollWidth / 2;
      if (!w) return;
      x -= 0.6;
      if (x <= -w) x += w;
      gsap.set(row, { x });
    };
    gsap.ticker.add(loop);
    return () => gsap.ticker.remove(loop);
  }, []);

  return (
    <div className="cf-marq" role="presentation">
      <div ref={ref} className="cf-marq-row">
        {[...WORDS, ...WORDS].map((w, i) => <span key={i} aria-hidden={i >= WORDS.length}>{w}</span>)}
      </div>
    </div>
  );
}
