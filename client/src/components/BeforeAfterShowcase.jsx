import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, CheckCircle2, XCircle, Zap, Scissors, Type, Volume2, Film, ArrowRight, MoveHorizontal, Play, Eye } from 'lucide-react';

const comparisonPoints = [
  {
    id: 'hook',
    title: 'The First Frame & Hook',
    icon: Zap,
    rawText: '“Hey guys, so today in this video I wanted to talk about...”',
    rawBadge: 'Slow Intro',
    polishText: '🔥 “STOP WASTING AD SPEND: The 3-second hook that converts”',
    polishBadge: 'High-Retention Visual Hook',
    raw: {
      tag: 'Raw Recording',
      description: 'Slow unedited intro ("Hey guys, so today..."), taking too long to get to the core topic.',
      badge: 'Slow Opening'
    },
    cutframe: {
      tag: 'Cutframe Polish',
      description: 'A clear visual hook and on-screen text in the opening frame so viewers immediately know the value.',
      badge: 'Clear Opening Hook'
    }
  },
  {
    id: 'captions',
    title: 'Accurate Subtitles',
    icon: Type,
    rawText: 'automatic audio transcription with mispelled words...',
    rawBadge: 'Buggy / Misaligned Text',
    polishText: 'DYNAMIC WORD-BY-WORD HIGHLIGHTED CAPTIONS',
    polishBadge: 'Bold Highlighted Subtitles',
    raw: {
      tag: 'Raw Recording',
      description: 'No text or unedited auto-generated captions containing spelling errors and clumsy timing.',
      badge: 'Missing / Buggy Captions'
    },
    cutframe: {
      tag: 'Cutframe Polish',
      description: 'Clean, word-by-word highlighted subtitles with accurate transcription, bold keywords, and brand styling.',
      badge: 'Clear & Readable Subtitles'
    }
  },
  {
    id: 'pacing',
    title: 'Retention Pacing & Cuts',
    icon: Scissors,
    rawText: 'Long awkward breathing pause... [silence for 4 seconds]... umm...',
    rawBadge: 'Dead Air & Pauses',
    polishText: 'PUNCH CUT ➔ B-ROLL INSERT ➔ SOUND EFFECT ➔ ZERO DEAD TIME',
    polishBadge: 'Tight Retention Pacing',
    raw: {
      tag: 'Raw Recording',
      description: 'Long breathing pauses, filler words ("umm", "ahh"), and a single static angle with dead air.',
      badge: 'Uncut Pauses'
    },
    cutframe: {
      tag: 'Cutframe Polish',
      description: 'Jump cuts remove dead pauses, while subtle punch-in zooms and B-roll cut-ins maintain visual momentum.',
      badge: 'Tight Pacing'
    }
  },
  {
    id: 'sound',
    title: 'Sound Design & Audio',
    icon: Volume2,
    rawText: 'Hissy phone microphone with room echo and muffled speech',
    rawBadge: 'Muffled Phone Mic',
    polishText: 'STUDIO NORMALIZED SPEECH + DUCKED BACKGROUND LO-FI BEAT + WHOOSH SFX',
    polishBadge: 'Mastered Audio & SFX',
    raw: {
      tag: 'Raw Recording',
      description: 'Flat phone microphone with room echo, background noise, and silence between thoughts.',
      badge: 'Phone Mic Audio'
    },
    cutframe: {
      tag: 'Cutframe Polish',
      description: 'Normalized speech, background room hiss removed, and background music ducked cleanly under speech.',
      badge: 'Balanced Audio'
    }
  }
];

export default function BeforeAfterShowcase({ onOpenDiscovery }) {
  const [activeTab, setActiveTab] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const current = comparisonPoints[activeTab];

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };
    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  return (
    <section id="difference" className="py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>The Editing Difference</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            How we turn raw footage into <span className="text-blue-600">engaging videos</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Whether filmed during an on-site shoot or from raw footage you provide, we handle the cuts, subtitles, pacing, color grading, and audio balancing that make videos look polished and professional.
          </p>
        </div>

        {/* Feature Tab Selector */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-8 scroll-reveal stagger-1">
          {comparisonPoints.map((point, index) => {
            const Icon = point.icon;
            const isActive = activeTab === index;
            return (
              <button
                key={point.id}
                type="button"
                onClick={() => setActiveTab(index)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer focus-ring ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{point.title}</span>
              </button>
            );
          })}
        </div>

        {/* --- INTERACTIVE SPLIT DRAG SLIDER --- */}
        <div className="max-w-4xl mx-auto mb-10 scroll-reveal stagger-2">
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            className="relative w-full h-[260px] sm:h-[340px] md:h-[380px] rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-900/10 cursor-ew-resize select-none touch-none bg-slate-950"
          >
            {/* 1. RIGHT SIDE: AFTER (CUTFRAME 4K POLISH) */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6 sm:p-10 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-end">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600 text-white text-xs font-mono font-bold tracking-wide shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>THE CUTFRAME POLISH</span>
                </div>
              </div>

              {/* Dynamic Mockup Content (After) */}
              <div className="my-auto text-center max-w-lg mx-auto">
                <div className="inline-block px-3 py-1 rounded bg-blue-500/20 text-blue-300 font-mono text-[11px] mb-3 border border-blue-400/30">
                  {current.polishBadge}
                </div>
                <h4 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
                  {current.polishText}
                </h4>
                {/* Audio/Retention waveform bars */}
                <div className="mt-5 flex items-center justify-center gap-1.5 text-blue-400">
                  <span className="w-1 h-3 bg-blue-400 rounded-full animate-pulse" />
                  <span className="w-1 h-6 bg-blue-300 rounded-full animate-pulse [animation-delay:100ms]" />
                  <span className="w-1 h-9 bg-blue-400 rounded-full animate-pulse [animation-delay:200ms]" />
                  <span className="w-1 h-5 bg-blue-300 rounded-full animate-pulse [animation-delay:300ms]" />
                  <span className="w-1 h-7 bg-blue-400 rounded-full animate-pulse [animation-delay:400ms]" />
                  <span className="w-1 h-3 bg-blue-300 rounded-full animate-pulse [animation-delay:500ms]" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-blue-300/80 font-mono">
                <span>02 · 4K MASTER GRADE</span>
                <span>STUDIO POLISHED</span>
              </div>
            </div>

            {/* 2. LEFT SIDE: BEFORE (RAW UNEDITED CLIP) - CLIPPED */}
            <div
              className="absolute inset-0 bg-stone-900 p-6 sm:p-10 flex flex-col justify-between overflow-hidden border-r border-white/40"
              style={{
                clipPath: `inset(0 ${100 - sliderPos}% 0 0)`
              }}
            >
              <div className="flex items-center justify-start">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-mono font-bold tracking-wide">
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>RAW / UNEDITED</span>
                </div>
              </div>

              {/* Dynamic Mockup Content (Before) */}
              <div className="my-auto text-center max-w-lg mx-auto opacity-70">
                <div className="inline-block px-3 py-1 rounded bg-stone-800 text-stone-400 font-mono text-[11px] mb-3">
                  {current.rawBadge}
                </div>
                <h4 className="text-xl sm:text-2xl font-medium text-stone-400 italic">
                  {current.rawText}
                </h4>
                <div className="mt-4 text-xs font-mono text-stone-500">
                  [Flat Phone Mic · Room Echo · Awkward Pauses]
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                <span>01 · RAW CAMERA CLIP</span>
                <span>UNEDITED BASE</span>
              </div>
            </div>

            {/* 3. DRAGGABLE SPLIT LINE & HANDLE */}
            <div
              className="absolute top-0 bottom-0 z-20 pointer-events-none flex flex-col items-center"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-[3px] h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-blue-600 text-white border-2 border-white shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95">
                <MoveHorizontal className="w-4 h-4" />
              </div>
            </div>

          </div>

          {/* Slider Controls / Hint */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono px-2">
            <span className="flex items-center gap-1.5 text-blue-600 font-semibold">
              <MoveHorizontal className="w-4 h-4" />
              <span>Drag the slider left or right to compare</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSliderPos(20)}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                Before (20%)
              </button>
              <button
                type="button"
                onClick={() => setSliderPos(50)}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                Split (50%)
              </button>
              <button
                type="button"
                onClick={() => setSliderPos(80)}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                After (80%)
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          
          {/* Card 1: Raw Phone Recording */}
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden scroll-reveal stagger-2">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Before Editing</span>
              </div>
              <span className="text-xs font-mono font-medium text-slate-400 uppercase">Raw Phone Video</span>
            </div>

            <div className="my-auto space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
                {current.title}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {current.raw.description}
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-200/80 flex items-center justify-between text-xs text-rose-600 font-medium">
              <span>Standard: {current.raw.badge}</span>
              <span className="text-slate-400 font-mono">01 / UNEDITED</span>
            </div>
          </div>

          {/* Card 2: Cutframe Polish */}
          <div className="bg-blue-50/50 border-2 border-blue-500/40 rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-lg shadow-blue-500/5 scroll-reveal stagger-3">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-200" />
                <span>The Cutframe Polish</span>
              </div>
              <span className="text-xs font-mono font-bold text-blue-600 uppercase">Professional Craft</span>
            </div>

            <div className="my-auto space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                {current.title}
              </h3>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {current.cutframe.description}
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-blue-200/80 flex items-center justify-between text-xs text-blue-700 font-bold">
              <span>Delivered: {current.cutframe.badge}</span>
              <span className="text-blue-500 font-mono">02 / CUTFRAME</span>
            </div>
          </div>

        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-12 text-center scroll-reveal stagger-4">
          <button
            type="button"
            onClick={onOpenDiscovery}
            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-semibold text-sm shadow-md transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <span>Ready to turn raw footage into high-retention videos? Let&apos;s talk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
