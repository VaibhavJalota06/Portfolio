import React from 'react';
import { Smartphone, Youtube, ShoppingBag, Palette, ArrowRight, Check, Zap, Clock, Shield } from 'lucide-react';

export default function AgencyServices({ onSelectService }) {
  const services = [
    {
      id: 'short-form',
      icon: Smartphone,
      title: 'Short-Form Content Engine',
      subtitle: 'Reels • TikTok • YouTube Shorts',
      tag: 'Viral Retention',
      turnaround: '24–48 Hours',
      description: 'We turn podcasts, raw talking heads, and vlog footage into punchy, high-retaining short-form assets that capture algorithms and drive organic followers.',
      deliverables: [
        'Aggressive hook editing (0–3s retention)',
        'Kinetic word-by-word animated captions',
        'Immersive sound design & audio impact cues',
        'Custom zoom-ins, b-roll overlays & stickers',
        'Formatted for 9:16 vertical distribution'
      ]
    },
    {
      id: 'youtube',
      icon: Youtube,
      title: 'YouTube Long-Form Production',
      subtitle: 'Docuseries • Vlogs • Video Podcasts',
      tag: 'Audience Loyalty',
      turnaround: '3–4 Days',
      description: 'Full-spectrum editing engineered around the retention curve. We eliminate viewer drop-off points and build compelling pacing that maximizes watch time and RPM.',
      deliverables: [
        'Complete pacing & story structure assembly',
        'A-Roll and multicam switching',
        'Contextual 4K B-Roll & motion graphics',
        'Broadcast audio mastering (-14 LUFS)',
        'CTR-boosting packaging & thumbnail consultation'
      ]
    },
    {
      id: 'commercial',
      icon: ShoppingBag,
      title: 'Commercial & Paid Ad Creatives',
      subtitle: 'Meta Ads • TikTok Ads • Brand Films',
      tag: 'ROAS Focused',
      turnaround: '48 Hours',
      description: 'Direct-response video creatives built to convert cold traffic into buyers. We deliver multiple hook variations and product glamour shots to scale your ad spend.',
      deliverables: [
        '3+ interchangeable hook variations per concept',
        'Dynamic speed ramping & macro product shots',
        'Clear benefit callouts & motion typography',
        'Platform-specific aspect ratio exports (1:1, 9:16, 16:9)',
        'Direct-response conversion optimization'
      ]
    },
    {
      id: 'post-production',
      icon: Palette,
      title: 'Color Grading & Audio Mastering',
      subtitle: 'DaVinci Resolve • Sound Polish',
      tag: 'Cinema Standard',
      turnaround: '48 Hours',
      description: 'Industrial post-production finishing for indie filmmakers, commercial directors, and creators looking for that unmistakable high-budget cinema texture.',
      deliverables: [
        'Sony, Arri, RED, Canon Log to Rec.709 color pipeline',
        'Kodak & Fujifilm cinema print emulation',
        'Skin tone purity and isolated color masks',
        'iZotope RX spectral audio cleanup & de-noise',
        'Lossless ProRes 422 HQ / 4444 master exports'
      ]
    }
  ];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-4">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            Agency Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            Tailored Video Solutions <br />
            <span className="text-blue-600">Built to Scale Your Media</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Choose a dedicated post-production engine or combine services into a monthly retainer designed for maximum output.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative bg-white border border-slate-200 hover:border-blue-400/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold font-mono">
                        {service.tag}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500 font-medium font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {service.turnaround}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <div className="text-xs font-mono font-medium text-slate-500 mt-1 uppercase tracking-wide">
                    {service.subtitle}
                  </div>
                  <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                      What's Included:
                    </h4>
                    <ul className="space-y-2.5">
                      {service.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                          <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="mt-8 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onSelectService(service.title)}
                    className="w-full py-3 rounded-xl bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white font-semibold text-sm border border-slate-200 hover:border-transparent transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                  >
                    <span>Request {service.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
