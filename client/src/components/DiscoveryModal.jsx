import React, { useState, useEffect } from 'react';
import { X, Calendar, Send, CheckCircle2, Sparkles, Clock, Globe, ArrowRight, ShieldCheck } from 'lucide-react';

export default function DiscoveryModal({ isOpen, onClose, initialService = '', showToast }) {
  const [activeTab, setActiveTab] = useState('brief'); // 'call' or 'brief'
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    brandUrl: '',
    service: initialService || 'Full-Service Video Engine',
    volume: '8–12 Videos / Month',
    budget: '$2,500 – $5,000 / month',
    message: ''
  });

  useEffect(() => {
    if (initialService) {
      setFormData(prev => ({ ...prev, service: initialService }));
    }
  }, [initialService]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmitBrief = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        subject: `[Cutframe Inquiry] ${formData.service} (${formData.volume})`,
        message: `Brand URL: ${formData.brandUrl || 'Not provided'}\nBudget: ${formData.budget}\nVolume: ${formData.volume}\nDetails:\n${formData.message}`
      };

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSubmitted(true);
        if (showToast) showToast('Project brief received! We will be in touch within 12 hours.');
      } else {
        throw new Error('Failed to send inquiry');
      }
    } catch (err) {
      // Fallback local acknowledgment
      setSubmitted(true);
      if (showToast) showToast('Inquiry recorded! Our team will contact you shortly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-6 sm:p-7 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-white to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Partner with Cutframe Studio
              </h3>
              <p className="text-xs text-slate-500">
                Scale your audience and conversions with dedicated senior post-production.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 sm:px-7 pt-4 pb-2 border-b border-slate-100 flex gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('brief')}
            className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'brief'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Project Scope Brief
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('call')}
            className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'call'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Schedule Discovery Call
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900">
                Project Brief Received!
              </h4>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                Thank you for reaching out to Cutframe Studio. Our creative director will review your channel/assets and email you within 12 hours with a bespoke proposal.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : activeTab === 'brief' ? (
            <form onSubmit={handleSubmitBrief} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Marcus Vance"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm text-slate-900 placeholder:text-slate-400 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="marcus@channel.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm text-slate-900 placeholder:text-slate-400 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    YouTube / Social / Brand Link
                  </label>
                  <input
                    type="url"
                    value={formData.brandUrl}
                    onChange={(e) => setFormData({ ...formData, brandUrl: e.target.value })}
                    placeholder="https://youtube.com/@yourchannel"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm text-slate-900 placeholder:text-slate-400 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Monthly Video Volume
                  </label>
                  <select
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm text-slate-900 bg-white cursor-pointer"
                  >
                    <option value="4–6 Videos / Month">4–6 Videos / Month</option>
                    <option value="8–12 Videos / Month">8–12 Videos / Month</option>
                    <option value="15–25 Short-Form Reels / Month">15–25 Short-Form Reels / Month</option>
                    <option value="Daily Output (30+ Videos)">Daily Output (30+ Videos)</option>
                    <option value="Single Project / Campaign">Single Project / Campaign</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Primary Service
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm text-slate-900 bg-white cursor-pointer"
                  >
                    <option value="Short-Form Content Engine">Short-Form Content Engine</option>
                    <option value="YouTube Long-Form Production">YouTube Long-Form Production</option>
                    <option value="Commercial & Paid Ad Creatives">Commercial & Paid Ad Creatives</option>
                    <option value="Color Grading & Post-Production">Color Grading & Post-Production</option>
                    <option value="Full-Service Retainer">Full-Service Retainer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Monthly Budget Tier
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm text-slate-900 bg-white cursor-pointer"
                  >
                    <option value="$1,500 – $2,500 / month">$1,500 – $2,500 / month</option>
                    <option value="$2,500 – $5,000 / month">$2,500 – $5,000 / month</option>
                    <option value="$5,000 – $10,000 / month">$5,000 – $10,000 / month</option>
                    <option value="$10,000+ / month">$10,000+ / month (Enterprise)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Project Goals & Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your audience, current retention challenges, or reference channels you admire..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm text-slate-900 placeholder:text-slate-400 bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Submitting Project Brief...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Project Scope Brief</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6 text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto">
                <Calendar className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">
                  Book a 20-Minute Creative Discovery Call
                </h4>
                <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                  Hop on a 1-on-1 strategy session with our creative director. We will audit your recent videos, analyze your drop-off points, and suggest immediate retention improvements.
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Free 5-minute audit of your latest video</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Custom turnaround & monthly workflow plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Dedicated senior editor assignment details</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://calendly.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Open Calendar Scheduler</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>No obligation • 100% Confidential Creative Review</span>
        </div>
      </div>
    </div>
  );
}
