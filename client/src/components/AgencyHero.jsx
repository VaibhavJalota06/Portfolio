import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../contact';

const TAGLINE_PHRASES = [
  'scale across platforms.',
  'dominate short-form video.',
  'turn viewers into clients.',
  'build a stunning website.',
  'grow on social media.'
];

function TypewriterText({ phrases }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timer;

    if (!isDeleting && text === currentPhrase) {
      // Pause at the end of the word for 2.4s so the navigator cursor blinks
      timer = setTimeout(() => setIsDeleting(true), 2400);
    } else if (isDeleting && text === '') {
      // Move to the next phrase after deleting
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
      timer = setTimeout(() => {}, 300);
    } else {
      // Typing or deleting next character
      const speed = isDeleting ? 38 : 80;
      timer = setTimeout(() => {
        const nextText = isDeleting
          ? currentPhrase.substring(0, text.length - 1)
          : currentPhrase.substring(0, text.length + 1);
        setText(nextText);
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, phraseIndex, phrases]);

  return (
    <span className="inline-flex items-center whitespace-nowrap text-blue-600">
      <span>{text || '\u00A0'}</span>
      {/* Blinking navigator line cursor */}
      <span
        aria-hidden="true"
        className="inline-block w-[3px] sm:w-[4px] h-[0.85em] ml-1 bg-blue-600 align-middle animate-cursor-blink rounded-xs shadow-xs shrink-0"
      />
    </span>
  );
}

export default function AgencyHero({ onOpenDiscovery }) {
  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden bg-white">
      {/* Subtle Dot Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#0F172A 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      {/* Organic Aurora Ambient Glow Blobs */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[650px] sm:w-[900px] h-[350px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/10 to-transparent blur-3xl pointer-events-none rounded-full animate-glow z-0" />
      <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-sky-400/10 blur-3xl pointer-events-none rounded-full animate-float z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold tracking-wide shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Cutframe Studio · High-Retention Video &amp; Content Studio</span>
          </div>
        </div>

        <div className="text-center max-w-5xl mx-auto">
          {/* Exactly 2 lines: Line 1 stable, Line 2 single-line blue typewriter */}
          <h1 className="tracking-tight leading-[1.12]">
            <span className="block text-3xl sm:text-5xl md:text-6xl font-bold text-slate-900">
              We help brands
            </span>
            <span className="block mt-1 sm:mt-2 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-600 whitespace-nowrap h-[1.25em] flex items-center justify-center overflow-visible">
              <TypewriterText phrases={TAGLINE_PHRASES} />
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Reels, Shorts, commercial videos, graphics, websites and complete content management that build trust and drive real growth.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenDiscovery}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer focus-ring"
            >
              <span>Book a Free Call</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={getWhatsAppUrl("Hi Vaibhav, I checked out Cutframe Studio and I'd like to discuss video editing & content for my brand.")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 focus-ring"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
            <a
              href="#work"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-base border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 focus-ring"
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

