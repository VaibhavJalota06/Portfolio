import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Sliders, Sparkles, Wand2, Eye, Volume2, MoveHorizontal, CheckCircle2 } from 'lucide-react';

const PRESETS = [
  {
    id: 'color-grading',
    name: 'Cinematic Color Grading',
    tag: 'DaVinci Resolve Pipeline',
    description: 'Transforming washed out flat S-Log3 sensor data into rich, filmic contrast with tonal depth and pristine skin fidelity.',
    before: {
      label: 'Raw Sony FX3 S-Log3',
      sublabel: 'Flat, desaturated log profile',
      // High quality illustrative imagery showing flat desaturated vs rich cinematic grade
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80&sat=-100&con=-30&bri=15',
      badge: 'Unprocessed Raw Log'
    },
    after: {
      label: 'Cutframe Studio Master',
      sublabel: 'Kodak 2383 emulation, micro-contrast & skin glow',
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80&sat=20&con=35',
      badge: 'Color Graded + Film Print'
    },
    stats: [
      { label: 'Dynamic Range', value: '14+ Stops Balanced' },
      { label: 'Color Space', value: 'Rec.709 / DCI-P3' },
      { label: 'Skin Tone Delta', value: '< 1.2% Drift' }
    ]
  },
  {
    id: 'retention-pacing',
    name: 'Retention Pacing & Graphics',
    tag: 'YouTube & Short-Form Engine',
    description: 'Eliminating dead air, engineering visual hooks every 3-5 seconds with kinetic captions, sound design, and b-roll inserts.',
    before: {
      label: 'Raw Talking Head',
      sublabel: 'Monotone delivery, zero sound design, dead air',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80&sat=-60&bri=-10',
      badge: 'Boring Raw Recording'
    },
    after: {
      label: 'Cutframe Retention Cut',
      sublabel: 'Punch-ins, kinetic sound cues, dynamic captions',
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=80',
      badge: 'Engineered Viral Retention'
    },
    stats: [
      { label: 'Avg Retention Lift', value: '+48%' },
      { label: 'Drop-off Reduction', value: '-62% at 30s' },
      { label: 'SFX Elements', value: '45+ cues/min' }
    ]
  },
  {
    id: 'commercial-vfx',
    name: 'Commercial VFX & Polish',
    tag: 'Direct-Response Ad Creative',
    description: 'Premium product glamorization, speed ramping, 3D kinetic typography, and audio mastering designed to maximize conversion.',
    before: {
      label: 'Raw Studio Take',
      sublabel: 'Flat studio lighting, unpolished audio track',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80&sat=-80&bri=-20',
      badge: 'Raw Product Angle'
    },
    after: {
      label: 'Cutframe Ad Creative',
      sublabel: 'Speed ramps, dynamic glow, broadcast audio',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80&con=30',
      badge: 'High-Converting Ad Master'
    },
    stats: [
      { label: 'Target ROAS', value: '4.6x Achieved' },
      { label: 'Hook CTR Lift', value: '+2.8%' },
      { label: 'Turnaround Time', value: '48 Hours' }
    ]
  }
];

export default function BeforeAfterSlider() {
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const preset = PRESETS[activePresetIndex];

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <section id="before-after" className="py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Interactive Comparison Engine
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            See The <span className="text-blue-600">Cutframe Difference</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Drag the slider to compare raw unedited footage against our industry-standard color grading, retention pacing, and sound design.
          </p>
        </div>

        {/* Preset Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
          {PRESETS.map((p, idx) => {
            const isActive = idx === activePresetIndex;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setActivePresetIndex(idx);
                  setSliderPos(50);
                }}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        {/* Interactive Comparison Viewport */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-3 sm:p-4">
          <div
            ref={containerRef}
            onMouseDown={(e) => {
              setIsDragging(true);
              handleMove(e.clientX);
            }}
            onTouchStart={(e) => {
              setIsDragging(true);
              handleMove(e.touches[0].clientX);
            }}
            className="ba-container relative w-full h-[360px] sm:h-[480px] lg:h-[560px] rounded-xl overflow-hidden cursor-ew-resize bg-slate-900 select-none"
          >
            {/* AFTER Layer (Full Base Image) */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={preset.after.image}
                alt={preset.after.label}
                className="w-full h-full object-cover"
                draggable={false}
              />
              {/* After Info Overlay */}
              <div className="absolute top-4 right-4 z-20 flex flex-col items-end pointer-events-none">
                <span className="px-3 py-1 rounded-md bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold tracking-wide uppercase shadow-lg">
                  {preset.after.badge}
                </span>
                <span className="mt-1 text-xs text-white/90 drop-shadow-md hidden sm:block">
                  {preset.after.sublabel}
                </span>
              </div>
            </div>

            {/* BEFORE Layer (Clipped Overlay Image) */}
            <div
              className="absolute inset-0 h-full overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={preset.before.image}
                alt={preset.before.label}
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                  height: '100%'
                }}
                draggable={false}
              />
              {/* Before Info Overlay */}
              <div className="absolute top-4 left-4 z-20 flex flex-col items-start pointer-events-none">
                <span className="px-3 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-slate-200 text-xs font-bold tracking-wide uppercase border border-white/10 shadow-lg">
                  {preset.before.badge}
                </span>
                <span className="mt-1 text-xs text-white/80 drop-shadow-md hidden sm:block">
                  {preset.before.sublabel}
                </span>
              </div>
            </div>

            {/* Draggable Divider Line & Knob */}
            <div
              className="ba-slider-handle"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="ba-slider-button">
                <MoveHorizontal className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Drag Help Pill at bottom */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
              <div className="px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium border border-white/15 flex items-center gap-2 shadow-lg">
                <MoveHorizontal className="w-3.5 h-3.5 text-blue-400" />
                <span>Drag horizontally to compare</span>
              </div>
            </div>
          </div>

          {/* Preset Context & Metrics Bar below slider */}
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-4">
            <div className="md:col-span-1">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                {preset.tag}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {preset.description}
              </p>
            </div>
            <div className="md:col-span-2 grid grid-cols-3 gap-3 sm:gap-4 items-center">
              {preset.stats.map((stat, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                  <div className="text-sm sm:text-base font-bold text-slate-900 font-mono">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium uppercase tracking-tight mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
