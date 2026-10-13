import React, { useState } from 'react';
import { Calculator, Check, ArrowRight, MessageCircle, Calendar, Sparkles, Layers } from 'lucide-react';
import { getWhatsAppUrl } from '../contact';

const packages = [
  {
    id: 'starter',
    name: 'Starter Reels Pack',
    badge: 'Starter',
    subtitle: '8 Reels / Month',
    description: 'Perfect for creators and local businesses looking to establish a consistent, professional presence on Instagram.',
    deliverables: [
      '8 Short-form Reels (up to 60s each)',
      'First-3-second retention hooks',
      'Kinetic word-by-word captions',
      'Sound design, SFX & music ducking',
      'Exported in high-bitrate 9:16'
    ]
  },
  {
    id: 'growth',
    name: 'Growth Content Engine',
    badge: 'Most Popular',
    isPopular: true,
    subtitle: '15 Reels + 4 Posts / Month',
    description: 'Our core monthly content engine designed to maximize reach, engagement, and consistent follower growth.',
    deliverables: [
      '15 High-retention Reels / Shorts',
      '4 Graphic posts or swipe carousels',
      'Monthly content calendar & strategy',
      'Curated hooks & trend research',
      'Priority 48-hour delivery window'
    ]
  },
  {
    id: 'management',
    name: 'Complete Page Management',
    badge: 'Hands-Off',
    subtitle: 'Full Instagram Management',
    description: 'We run your Instagram account end-to-end so you can focus 100% on serving your clients and running your business.',
    deliverables: [
      '16–20 Reels & graphic posts per month',
      'Captions, hashtags & call-to-actions',
      'Direct scheduling & posting on your page',
      'Bio, highlights & profile optimization',
      'Direct WhatsApp access to your editor'
    ]
  }
];

const optionalAddons = [
  { id: 'posters', label: 'Festival & Offer Posters (4 graphics)', keyName: '4 Graphic Posters' },
  { id: 'ai', label: 'AI Explainer Scenes & B-roll', keyName: 'AI Explainer Visuals' },
  { id: 'rush', label: 'Priority 24-hour Fast Track delivery', keyName: '24h Rush Delivery' }
];

export default function AgencyEstimator({ onOpenDiscovery }) {
  const [selectedPkgId, setSelectedPkgId] = useState('growth');
  const [selectedAddons, setSelectedAddons] = useState([]);

  const currentPkg = packages.find(p => p.id === selectedPkgId) || packages[1];

  const toggleAddon = (id) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getAddonsText = () => {
    if (selectedAddons.length === 0) return 'None';
    return selectedAddons
      .map(id => optionalAddons.find(a => a.id === id)?.keyName)
      .filter(Boolean)
      .join(', ');
  };

  const whatsAppMessage = `Hi Vaibhav! I built a scope on Cutframe Studio:
• Package: ${currentPkg.name} (${currentPkg.subtitle})
• Add-ons: ${getAddonsText()}
Can we discuss a monthly plan and quote for my brand?`;

  return (
    <section id="pricing" className="py-24 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
            <Calculator className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Scope Guide</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            Tailor a plan for your <span className="text-blue-600">brand</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Select the content volume your brand needs. We send you a transparent, custom monthly quote with no lock-ins.
          </p>
        </div>

        {/* 3 Package Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {packages.map((pkg) => {
            const isSelected = selectedPkgId === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPkgId(pkg.id)}
                className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 cursor-pointer relative ${
                  isSelected
                    ? 'bg-white border-2 border-blue-600 shadow-xl shadow-blue-500/10 scale-[1.01]'
                    : 'bg-white border border-slate-200/90 hover:border-slate-300 shadow-sm'
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wide shadow-md">
                    Recommended
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                      isSelected ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {pkg.badge}
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{pkg.name}</h3>
                  <p className="text-xs font-semibold text-blue-600 font-mono mt-1">{pkg.subtitle}</p>
                  
                  <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                      Included Deliverables:
                    </h4>
                    <ul className="space-y-2">
                      {pkg.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                          <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4">
                  <span className={`block w-full py-2.5 rounded-xl text-center text-xs font-semibold transition-all ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}>
                    {isSelected ? '✓ Selected Plan' : 'Select Plan'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Add-ons Section */}
        <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wide">
              Optional Add-Ons
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {optionalAddons.map((addon) => {
              const isChecked = selectedAddons.includes(addon.id);
              return (
                <button
                  key={addon.id}
                  type="button"
                  onClick={() => toggleAddon(addon.id)}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-blue-50/70 border-blue-500/80 text-blue-900'
                      : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                    isChecked ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                  }`}>
                    {isChecked && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-xs font-medium leading-snug">{addon.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Action Bar */}
        <div className="max-w-3xl mx-auto bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">Your Selected Scope</span>
            <h4 className="text-lg sm:text-xl font-bold">{currentPkg.name}</h4>
            <p className="text-xs text-slate-400">
              {currentPkg.subtitle} {selectedAddons.length > 0 && `• +${selectedAddons.length} Add-on${selectedAddons.length > 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <a
              href={getWhatsAppUrl(whatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 focus-ring"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Get Quote on WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => onOpenDiscovery(currentPkg.name)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm border border-slate-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer focus-ring"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Call</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
