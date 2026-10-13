import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AgencyMarqueeStats() {
  const marqueeItems = [
    '4K ON-LOCATION FILMING',
    'HIGH-RETENTION PACING',
    'DYNAMIC ANIMATED SUBTITLES',
    'COLOR GRADING & CINEMATIC AUDIO',
    'INSTAGRAM REELS & YOUTUBE SHORTS',
    'SOCIAL MEDIA MANAGEMENT',
    'AD CREATIVES & COMMERCIAL EDITS',
    'SOUND DESIGN & SFX',
    'WEBSITE DESIGN & DEVELOPMENT'
  ];

  return (
    <div className="w-full bg-slate-950 text-white overflow-hidden border-y border-slate-800 py-3.5 relative">
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-xs font-mono font-semibold tracking-wider text-slate-300">
        {[...marqueeItems, ...marqueeItems].map((item, idx) => (
          <div key={idx} className="flex items-center gap-8">
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="hover:text-blue-400 transition-colors cursor-default">{item}</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
