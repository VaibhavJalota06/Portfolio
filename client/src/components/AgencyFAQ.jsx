import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function AgencyFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How fast is your turnaround time?',
      a: 'Our standard turnaround is 24 to 48 hours for short-form content (Reels/TikTok/Shorts) and 3 to 4 business days for comprehensive YouTube long-form edits. We also provide express 24-hour turnaround for emergency campaigns and breaking content.'
    },
    {
      q: 'How do we upload and hand over raw footage?',
      a: 'We use high-speed cloud workflows including Frame.io, Google Drive, and Dropbox. Simply drop your camera memory card dump or raw files into your dedicated agency folder, and our ingest team takes over immediately.'
    },
    {
      q: 'What is your revision policy?',
      a: 'We provide unlimited revisions on all projects. You can leave frame-accurate timestamp notes directly on video drafts via Frame.io, and our editors turn around fixes within 24 hours until you are 100% thrilled with the final cut.'
    },
    {
      q: 'Do you provide a dedicated editor or random freelancers?',
      a: 'You are paired with a dedicated senior editor and a project manager who master your brand identity, pacing preferences, and typography guidelines over time. No outsourced mystery freelancers.'
    },
    {
      q: 'Can you handle professional cinema Log formats?',
      a: 'Absolutely. We run certified DaVinci Resolve Studio pipelines natively handling Sony S-Log3, Canon C-Log, Apple ProRes Log, Arri LogC, and RED IPP2 color spaces with film-print emulation and custom LUTs.'
    },
    {
      q: 'How do monthly agency retainers work?',
      a: 'Our monthly plans reserve guaranteed weekly editing bandwidth for your channel or brand. Plans are month-to-month with no long-term lock-in, meaning you can pause, scale up, or cancel whenever your production schedule shifts.'
    }
  ];

  return (
    <section id="faq" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Everything You Need to Know
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Transparent answers on how we collaborate with high-growth creators and brands.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200"
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
