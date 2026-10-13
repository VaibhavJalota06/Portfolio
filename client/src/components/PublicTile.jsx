import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { getMediaInfo, isVideoItem } from '../utils/media';

const FALLBACK = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="9"><rect width="16" height="9" fill="#e2e8f0"/></svg>');

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

  return (
    <button
      type="button"
      onClick={() => onClick?.(item)}
      aria-label={`Open ${label}`}
      className="group relative block w-full mb-4 sm:mb-5 break-inside-avoid overflow-hidden rounded-2xl bg-slate-100 text-left shadow-sm hover:shadow-xl ring-1 ring-slate-200/70 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer focus-ring"
      style={aspect ? { aspectRatio: aspect } : undefined}
    >
      {/* Skeleton shimmer while loading */}
      {!loaded && (
        <div 
          className="absolute inset-0 bg-slate-200/80 animate-pulse flex items-center justify-center pointer-events-none"
        >
          <div className="w-10 h-10 rounded-full bg-slate-300/80 flex items-center justify-center shadow-inner">
            <Play className="w-4 h-4 text-slate-400 fill-slate-400 ml-0.5" />
          </div>
        </div>
      )}

      {item.type === 'mp4' ? (
        <video src={item.url} muted playsInline preload="metadata" className="block w-full h-auto" onLoadedData={() => setLoaded(true)} />
      ) : (
        <img
          src={src || FALLBACK}
          alt={label}
          loading={isEager ? 'eager' : 'lazy'}
          fetchPriority={isEager ? 'high' : 'auto'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            const img = e.currentTarget;
            // Google's image server sometimes refuses bursts of requests: retry once before showing the placeholder.
            if (src && !img.dataset.retried) { img.dataset.retried = '1'; setTimeout(() => { img.src = src; }, 1500); return; }
            img.onerror = null; img.src = FALLBACK; setLoaded(true);
          }}
          style={aspect ? { aspectRatio: aspect } : undefined}
          className={`block w-full ${aspect ? 'object-cover h-full' : 'h-auto'} transition-all duration-500 group-hover:scale-[1.03] ${loaded ? 'opacity-100' : 'opacity-0 min-h-48'}`}
        />
      )}

      {/* Bottom gradient + label, revealed on hover (always visible on touch screens) */}
      <div className="absolute inset-x-0 bottom-0 p-4 pt-12 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {category && <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-200">{category}</div>}
        {item.title && <div className="text-sm font-semibold text-white mt-0.5">{item.title}</div>}
      </div>

      {video && (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <Play className="w-5 h-5 text-slate-900 fill-slate-900 ml-0.5" />
          </span>
        </span>
      )}
    </button>
  );
}
