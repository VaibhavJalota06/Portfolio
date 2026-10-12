import React from 'react';
import { ArrowRight, Play, MessageCircle } from 'lucide-react';
import { CONTACT } from '../contact';

export default function AgencyHero({ onOpenDiscovery }) {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden bg-white">
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#0F172A 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold tracking-wide shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Cutframe Studio · Video editing &amp; Instagram content</span>
          </div>
        </div>

        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.08]">
            We help brands <span className="text-blue-600">grow on Instagram</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Reels, posts, graphic design and complete Instagram page management for brands, businesses and creators.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenDiscovery}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-600/25 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer focus-ring"
            >
              <span>Book a Free Call</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base shadow-lg shadow-emerald-500/20 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 focus-ring"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
            <a
              href="#work"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-base border border-slate-200 shadow-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 focus-ring"
            >
              <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span>See Our Work</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
