import React from 'react';
import { LayoutGrid, Clapperboard, Palette, Bot, Globe, Check, Zap, MessageCircle, Calendar, ArrowRight } from 'lucide-react';
import { getWhatsAppUrl } from '../contact';

export default function AgencyServices({ onSelectService }) {
  const services = [
    {
      id: 'page-management',
      page: '/instagram-page-management',
      icon: LayoutGrid,
      title: 'Social Media & Page Management',
      subtitle: 'Planning • Posting • Profiles',
      tag: 'Most Popular',
      description: 'We manage your brand’s social pages across platforms: a monthly content strategy, scheduled posting, and profiles that look consistent and trustworthy to new customers.',
      deliverables: [
        'Monthly content strategy',
        'Monthly content & posting calendar',
        'Captions and hashtags written for you',
        'Regular scheduled posting',
        'Profile, bio and highlights cleanup'
      ]
    },
    {
      id: 'reels',
      page: '/reels-video-editing-delhi',
      icon: Clapperboard,
      title: 'Reels & Video Editing',
      subtitle: 'Reels • Shorts • YouTube',
      tag: 'High Retention',
      description: 'From on-site video shoots to full post-production, we create high-retention reels and videos that showcase your brand, explain your products or services, and keep audiences watching.',
      deliverables: [
        'Strong first-3-second hooks',
        'Clean word-by-word captions',
        'Music, sound effects and B-roll',
        'Cuts, zooms and pacing for retention',
        'Exported in 9:16 for Reels & Shorts'
      ]
    },
    {
      id: 'design',
      page: '/graphic-design',
      icon: Palette,
      title: 'Graphic Design',
      subtitle: 'Posts • Posters • Carousels',
      tag: 'On-Brand',
      description: 'Posts, posters and carousels that explain your services clearly, built in Photoshop and CorelDraw to match your brand’s colors and style.',
      deliverables: [
        'Social media posts and carousels',
        'Festival and offer posters',
        'Thumbnails and reel covers',
        'Print designs (flyers, cards, packaging)',
        'A consistent look across your accounts'
      ]
    },
    {
      id: 'ai',
      page: '/ai-videos',
      icon: Bot,
      title: 'AI Videos & Creatives',
      subtitle: 'AI Avatars • AI Visuals • B-roll',
      tag: 'New',
      description: 'AI-generated characters, scenes and visuals to explain your products and ideas, perfect when you don’t have footage or want something eye-catching.',
      deliverables: [
        'AI avatar and explainer videos',
        'AI-generated scenes and B-roll',
        'Animated characters for awareness reels',
        'AI images for posts and ads',
        'Combined with real editing for a polished finish'
      ]
    },
    {
      id: 'website',
      page: '/website-design',
      icon: Globe,
      title: 'Website Design & Development',
      subtitle: 'Landing Pages • Brand Sites • Portfolios',
      tag: 'Full-Service',
      description: 'Custom-built, mobile-first websites that look premium and load fast — landing pages, brand sites, portfolios and e-commerce storefronts designed to convert visitors into customers.',
      deliverables: [
        'Custom responsive design (mobile-first)',
        'Fast-loading, SEO-optimized pages',
        'Contact forms, booking and WhatsApp integration',
        'Domain setup and hosting guidance',
        'Ongoing maintenance and content updates'
      ]
    }
  ];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-4">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            Our Services
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            Everything your brand needs <br />
            <span className="text-blue-600">across social media</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Pick one service or combine them into a monthly plan tailored to your brand. Flexible terms with no long-term lock-in.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className={`group relative bg-white border border-slate-200 hover:border-blue-400/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between scroll-reveal stagger-${(index % 4) + 1}`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold font-mono">
                        {service.tag}
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
                  <a href={service.page} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                    More about {service.title} <ArrowRight className="w-4 h-4" />
                  </a>

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
                <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectService(service.title)}
                    className="w-full py-3 rounded-xl bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white font-semibold text-sm border border-slate-200 hover:border-transparent transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book a Free Call</span>
                  </button>
                  <a
                    href={getWhatsAppUrl(`Hi Vaibhav, I'm interested in your ${service.title} service for my brand.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-xl text-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
