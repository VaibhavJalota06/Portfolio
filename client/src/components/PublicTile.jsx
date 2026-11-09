import React, { useState } from 'react';
import { gsap, useGsap, refreshSoon } from '../motion';
import { Play } from 'lucide-react';
import { getMediaInfo, isVideoItem } from '../utils/media';

const FALLBACK = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="9"><rect width="16" height="9" fill="#15151b"/></svg>');

// Each tile opens with a different video-style transition: wipe, iris, barn door, wipe down, diagonal.
const WIPES = [
  ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)'],
  ['circle(0% at 50% 50%)', 'circle(75% at 50% 50%)'],
  ['inset(50% 0% 50% 0%)', 'inset(0% 0% 0% 0%)'],
  ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)'],
  ['polygon(0 0, 0 0, 0 100%, 0 100%)', 'polygon(0 0, 130% 0, 100% 100%, 0 100%)'],
];

// Public portfolio tile: media keeps its natural aspect ratio (masonry), nothing is cropped.
export default function PublicTile({ item, index = 0, onClick }) {
  const [loaded, setLoaded] = useState(false);
  const media = getMediaInfo(item.url);
  const video = isVideoItem(item);
  const category = (Array.isArray(item.tags) && item.tags[0]) || '';
  // Descriptive alt text for image search, e.g. "Photoshop Projects – design by Cutframe Studio"
  const label = `${item.title || category || 'Portfolio work'} – ${video ? 'video' : 'design'} by Cutframe Studio`;
  const src = item.type === 'image' ? item.url : media.thumbnailUrl;
  // Known shape -> reserve the space now, so the page doesn't jump while images load
  const aspect = item.aspect || (['youtube', 'vimeo'].includes(item.type) ? '16/9' : null);
  const isEager = index < 6;
  const ref = useGsap((el) => {
    const [from, to] = WIPES[index % WIPES.length];
    const st = { trigger: el, start: 'top 92%' };
    gsap.fromTo(el, { clipPath: from }, { clipPath: to, duration: 1.1, ease: 'expo.inOut', scrollTrigger: st, clearProps: 'clipPath' });
    const media = el.querySelector('img, video');
    if (media) gsap.fromTo(media, { scale: 1.35 }, { scale: 1, duration: 1.5, ease: 'expo.out', scrollTrigger: st, clearProps: 'transform' });
  });
  const onReady = () => { setLoaded(true); refreshSoon(); };

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onClick?.(item)}
      aria-label={`Open ${label}`}
      className="group relative block w-full overflow-hidden rounded-[14px] bg-[#15151b] text-left ring-1 ring-[#23232c] hover:ring-[#3a3a46] transition-shadow duration-300 cursor-pointer focus-ring"
      style={aspect ? { aspectRatio: aspect } : undefined}
    >
      {/* Skeleton shimmer while loading */}
      {!loaded && (
        <div 
          className="absolute inset-0 bg-[#15151b] animate-pulse flex items-center justify-center pointer-events-none"
        >
          <div className="w-10 h-10 rounded-full bg-[#23232c] flex items-center justify-center">
            <Play className="w-4 h-4 text-[#55555f] fill-[#55555f] ml-0.5" />
          </div>
        </div>
      )}

      {item.type === 'mp4' ? (
        <video src={item.url} muted playsInline preload="metadata" className="block w-full h-auto" onLoadedData={onReady} />
      ) : (
        <img
          src={src || FALLBACK}
          alt={label}
          loading={isEager ? 'eager' : 'lazy'}
          fetchPriority={isEager ? 'high' : 'auto'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={onReady}
          onError={(e) => {
            const img = e.currentTarget;
            // Google's image server sometimes refuses bursts of requests: retry once before showing the placeholder.
            if (src && !img.dataset.retried) { img.dataset.retried = '1'; setTimeout(() => { img.src = src; }, 1500); return; }
            img.onerror = null; img.src = FALLBACK; setLoaded(true);
          }}
          style={aspect ? { aspectRatio: aspect } : undefined}
          className={`block w-full ${aspect ? 'object-cover h-full' : 'h-auto'} transition-[opacity,filter] duration-500 group-hover:brightness-110 ${loaded ? 'opacity-100' : 'opacity-0 min-h-48'}`}
        />
      )}

      {/* Bottom gradient + label, revealed on hover (always visible on touch screens) */}
      <div className="absolute inset-x-0 bottom-0 p-4 pt-12 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {category && <div className="cf-mono" style={{ fontSize: 10, color: '#ff6b63' }}>{category}</div>}
        {item.title && <div className="text-sm font-semibold text-white mt-0.5">{item.title}</div>}
      </div>

      {video && (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <Play className="w-5 h-5 text-black fill-black ml-0.5" />
          </span>
        </span>
      )}
    </button>
  );
}
