import React from 'react';
import { UploadCloud, Scissors, Sparkles, Send, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AgencyWorkflow() {
  const steps = [
    {
      step: '01',
      icon: UploadCloud,
      title: 'Strategy & Media Ingest',
      description: 'You upload your raw camera files, zoom records, or voice notes to our secure cloud drive. We analyze your brand style, target audience, and retention objectives.',
      deliverable: 'Creative roadmap & asset ingest verification'
    },
    {
      step: '02',
      icon: Scissors,
      title: 'Assembly & Hook Scripting',
      description: 'We cut the dead air, tighten pauses, and build a magnetic 3-second hook that halts viewer scrolling. The narrative arc is locked for maximum engagement.',
      deliverable: 'Rough cut & retention pacing pass'
    },
    {
      step: '03',
      icon: Sparkles,
      title: 'Motion, Sound & Color Polish',
      description: 'Our senior colorists and motion designers inject cinematic color grading, sound design layers (impacts, risers, ambient texture), and dynamic graphic overlays.',
      deliverable: 'Fully mastered cinema / vertical export'
    },
    {
      step: '04',
      icon: Send,
      title: 'Review & Final Delivery',
      description: 'Review with frame-accurate timestamp comments. We incorporate feedback within 24 hours and deliver high-bitrate master files formatted for all platforms.',
      deliverable: 'Final masters (4K ProRes + Web MP4)'
    }
  ];

  return (
    <section id="process" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-4">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            Seamless Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            From Raw Footage to <span className="text-blue-600">Viral Master</span> in 4 Steps
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            A battle-tested production pipeline built for zero friction, fast turnarounds, and consistent broadcast quality.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-bold font-mono text-blue-600/30">
                      {step.step}
                    </span>
                    <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Deliverable Tag */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="text-[11px] font-mono font-semibold text-blue-600 uppercase tracking-wide">
                    Output:
                  </div>
                  <div className="text-xs font-medium text-slate-700 mt-0.5">
                    {step.deliverable}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Speed Guarantee Callout */}
        <div className="mt-14 max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/20 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-base sm:text-lg font-bold">
              Need emergency turnaround on a time-sensitive campaign?
            </h4>
            <p className="text-xs sm:text-sm text-blue-100 mt-1">
              We offer 24-hour express sprints for breaking content, product launches, and news reaction videos.
            </p>
          </div>
          <a
            href="#contact"
            className="px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-semibold text-xs sm:text-sm shrink-0 shadow-md transition-transform active:scale-[0.98]"
          >
            Inquire Express Sprint
          </a>
        </div>

      </div>
    </section>
  );
}
