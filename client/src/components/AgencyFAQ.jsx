import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function AgencyFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Who do you work with?',
      a: 'Brands and businesses of all sizes: product and e-commerce brands, founders, creators, local businesses, and service companies that want high-retention video content and strong social media growth.'
    },
    {
      q: 'Do I have to record the videos myself?',
      a: 'Not necessarily. For clients in Delhi NCR, our team can come directly to your office, store, or workspace with professional cameras, lighting, and audio equipment to record everything for you. If you already have footage or are located across India, you can also easily share your raw files via Google Drive or WhatsApp.'
    },
    {
      q: 'Can you make reels if I don’t have time to record?',
      a: 'Yes. We create engaging videos using motion graphics, AI visuals, licensed B-roll, and custom animations, keeping your brand active and consistent without you ever having to step in front of a camera.'
    },
    {
      q: 'What happens if I want changes?',
      a: 'You review every reel and post before it goes live. Tell us what to change and we update it until you are completely satisfied.'
    },
    {
      q: 'Do you only work in Delhi NCR?',
      a: 'We provide on-site filming and production across Delhi NCR, and end-to-end video editing, design, and social media management for clients all over India and internationally.'
    },
    {
      q: 'How much does it cost?',
      a: 'It depends on your required video volume, whether you need on-site shooting, and if you want full-service social media management. After a brief discovery call, we provide a transparent monthly retainer quote with zero hidden fees.'
    }
  ];

  return (
    <section id="faq" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Still unsure? Message us on WhatsApp and we will answer personally.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200 scroll-reveal stagger-${(idx % 4) + 1}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
