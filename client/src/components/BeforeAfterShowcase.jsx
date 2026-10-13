import React, { useState } from 'react';
import { Sparkles, CheckCircle2, XCircle, Zap, Scissors, Type, Volume2, Film, ArrowRight } from 'lucide-react';

const comparisonPoints = [
  {
    id: 'hook',
    title: 'The First Frame & Hook',
    icon: Zap,
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
  const current = comparisonPoints[activeTab];

  return (
    <section className="py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>The Editing Difference</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            How we turn raw footage into <span className="text-blue-600">engaging videos</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Record on your phone with no special equipment. We handle the cuts, subtitles, pacing, and audio balancing that make videos look polished and professional.
          </p>
        </div>

        {/* Feature Tab Selector */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10 scroll-reveal stagger-1">
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
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{point.title}</span>
              </button>
            );
          })}
        </div>

        {/* Comparison Cards Grid */}
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
            <span>Have clips on your phone? Let&apos;s turn them into videos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
