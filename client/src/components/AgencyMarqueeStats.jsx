import React, { useEffect, useRef } from 'react';
import { gsap, reduceMotion } from '../motion';

const ROW_1 = ['Video editing', 'AI video', 'Motion graphics', 'Branding & design', 'Reels & Shorts'];
const ROW_2 = ['Colour grading', 'Sound design', 'Websites', 'Thumbnails', 'Ad creatives'];

// Two strips of big type moving slowly in opposite directions.
function Row({ words, dir, alt }) {
  const ref = useRef(null);
  useEffect(() => {
    const row = ref.current;
    if (!row || reduceMotion) return undefined;
    let x = 0;
    const loop = () => {
      const w = row.scrollWidth / 2;
      if (!w) return;
      x -= 0.6 * dir;
      if (x <= -w) x += w;
      if (x > 0) x -= w;
      gsap.set(row, { x });
    };
    gsap.ticker.add(loop);
    return () => gsap.ticker.remove(loop);
  }, [dir]);
  return (
    <div ref={ref} className={`cf-marq-row ${alt ? 'alt' : ''}`}>
      {[...words, ...words].map((w, i) => <span key={i} aria-hidden={i >= words.length}>{w}</span>)}
    </div>
  );
}

export default function AgencyMarqueeStats() {
  return (
    <div className="cf-marq" role="presentation">
      <Row words={ROW_1} dir={1} />
      <Row words={ROW_2} dir={-1} alt />
    </div>
  );
}
