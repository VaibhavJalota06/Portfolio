import React, { useState, useEffect, useRef } from 'react';
import { Film, Zap, Clock, ShieldCheck, Sparkles, TrendingUp, Layers, CheckCircle } from 'lucide-react';

function AnimatedCounter({ end, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Cubic ease-out
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * end));

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCount(end);
          }
        };

        requestAnimationFrame(animate);
        observer.disconnect();
      }
    }, { threshold: 0.2 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function AgencyMarqueeStats() {
  const marqueeItems = [
    '4K ON-LOCATION FILMING',
    'HIGH-RETENTION PACING',
    'DYNAMIC ANIMATED SUBTITLES',
    'COLOR GRADING & CINEMATIC AUDIO',
    'INSTAGRAM REELS & YOUTUBE SHORTS',
    'SOCIAL MEDIA MANAGEMENT',
    'AD CREATIVES & COMMERCIAL EDITS',
    'SOUND DESIGN & SFX'
  ];

  const stats = [
    { icon: TrendingUp, value: 5, suffix: 'M+', label: 'Organic Views Generated', detail: 'Across client platforms' },
    { icon: Clock, value: 48, suffix: 'h', label: 'Average Turnaround', detail: 'Fast revision turnaround' },
    { icon: Film, value: 200, suffix: '+', label: 'Videos & Creatives Delivered', detail: 'Short-form & long-form' },
    { icon: ShieldCheck, value: 100, suffix: '%', label: 'Commercial Rights Included', detail: 'Zero royalty or licensing fees' },
  ];

  return (
    <div className="w-full bg-slate-950 text-white overflow-hidden border-y border-slate-800">
      
      {/* 1. Silky Infinite Kinetic Marquee Ticker */}
      <div className="py-3.5 border-b border-slate-800/80 bg-slate-900/40 relative">
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

      {/* 2. Interactive Animated Stats Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label} 
                className={`flex flex-col items-center sm:items-start p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-blue-500/40 transition-all duration-300 group scroll-reveal stagger-${(i % 4) + 1}`}
              >
                <div className="w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight flex items-baseline gap-0.5">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">
                  {stat.label}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {stat.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
