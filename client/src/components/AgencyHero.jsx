import React from 'react';
import { ArrowRight, Play, Sparkles, TrendingUp, ShieldCheck, CheckCircle2, Video, Flame } from 'lucide-react';

export default function AgencyHero({ onOpenDiscovery }) {
  const stats = [
    { label: 'Total Views Engineered', value: '180M+', change: '+24% QoQ' },
    { label: 'Avg Retention Rate Lift', value: '+48%', change: 'Validated' },
    { label: 'Ad Creative ROAS', value: '4.6x', change: 'E-Comm Average' },
    { label: 'Turnaround Compliance', value: '99.4%', change: '48h Standard' }
  ];

  const clientBadges = [
    'TechFlow Media',
    'Apex Growth',
    'CreatorSphere',
    'VenturePodcasts',
    'DirectScale Brands',
    'HyperNova Studios'
  ];

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/40 via-white to-white">
      {/* Subtle geometric grid background accent */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#2563EB 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Decorative gradient glow blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-400/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Eyebrow Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold tracking-wide shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Cutframe Studio • Full-Service Video Engine</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.08]">
            We Engineer <span className="text-blue-600">High-Retention</span> Videos That Scale Modern Brands
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            From viral short-form pacing to cinematic YouTube storytelling and high-converting commercial creatives — we turn raw footage into revenue.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenDiscovery}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span>Book a Discovery Call</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#work"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-base border border-slate-200 shadow-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span>Explore Our Work</span>
            </a>
          </div>

          {/* Quick Agency Guarantees */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Dedicated Senior Editor</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>24–48h Turnaround</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Unlimited Revisions</span>
            </div>
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="mt-16 sm:mt-20 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-100">
            {stats.map((s, i) => (
              <div 
                key={i} 
                className={`p-3 sm:p-4 text-center ${
                  i !== 0 ? 'border-l-0 sm:border-l border-slate-100' : ''
                }`}
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 font-mono tracking-tight">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                  {s.label}
                </div>
                <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  <TrendingUp className="w-3 h-3" />
                  {s.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Trust Strip */}
        <div className="mt-14 text-center">
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-5">
            Trusted by Creators, Founders & High-Growth Brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-70">
            {clientBadges.map((badge, idx) => (
              <span 
                key={idx}
                className="text-sm font-semibold tracking-wide text-slate-600 font-display hover:text-blue-600 transition-colors"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
