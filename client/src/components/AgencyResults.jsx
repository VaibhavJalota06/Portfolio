import React from 'react';
import { Star, TrendingUp, Quote, CheckCircle2, Award, Users } from 'lucide-react';

export default function AgencyResults() {
  const testimonials = [
    {
      name: 'Marcus Vance',
      role: 'Tech & AI Creator • 850K Subscribers',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      metric: '+124% Watch Time',
      quote: 'Cutframe Studio completely revolutionized our long-form pacing. Our average view duration jumped from 3:40 to 8:15 in less than three weeks. They understand retention storytelling at an instinctual level.',
      highlight: 'Engineered 14 consecutive trending videos'
    },
    {
      name: 'Elena Rostova',
      role: 'Host, The Modern Founder Podcast',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      metric: '18M+ Organic Views',
      quote: 'Their short-form team is unmatched. We send over a single 45-minute raw podcast episode, and within 48 hours we get back 10 viral-ready vertical cuts with killer sound design, subtitles, and hook pacing.',
      highlight: 'Scaled TikTok from 12k to 240k followers'
    },
    {
      name: 'Daniel Chen',
      role: 'Founder & CEO, Lumina Gear',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      metric: '4.8x Blended ROAS',
      quote: 'Before working with Cutframe, our Meta video ads were getting fatigued after 5 days. Their team produced 8 distinct hook angles and color grades that dropped our customer acquisition cost by 38%.',
      highlight: 'Scaled monthly ad spend from $30k to $160k'
    }
  ];

  const highlights = [
    { label: 'Total Creator Views', value: '180,000,000+' },
    { label: 'Combined Followers Gained', value: '2,400,000+' },
    { label: 'Average Watch Time Lift', value: '+48%' },
    { label: 'Client Retention Rate', value: '94% Monthly' }
  ];

  return (
    <section id="results" className="py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-4">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            Proven Track Record
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            Real Numbers. <span className="text-blue-600">Documented Growth.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            We judge our success exclusively by audience watch time, viral distribution, and direct client revenue.
          </p>
        </div>

        {/* Big Impact Numbers Banner */}
        <div className="mb-16 grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200">
          {highlights.map((h, i) => (
            <div key={i} className="text-center p-3">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 font-mono tracking-tight">
                {h.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
                {h.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Metric Badge & Stars */}
                <div className="flex items-center justify-between mb-5">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold font-mono border border-blue-200/60">
                    {t.metric}
                  </span>
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "{t.quote}"
                </p>

                {/* Highlight Tag */}
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.highlight}</span>
                </div>
              </div>

              {/* Author Info */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {t.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
