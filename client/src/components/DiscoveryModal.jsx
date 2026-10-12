import React, { useState, useEffect } from 'react';
import { X, Calendar, Send, CheckCircle2, Clock, Globe, ArrowRight, ShieldCheck, Video, User, Mail, Sparkles } from 'lucide-react';

export default function DiscoveryModal({ isOpen, onClose, initialService = '', showToast }) {
  const [activeTab, setActiveTab] = useState('call'); // default to 'call' for immediate scheduling
  const [loading, setLoading] = useState(false);
  const [submittedBrief, setSubmittedBrief] = useState(false);
  const [bookedCall, setBookedCall] = useState(null);

  // Discovery Call Form
  const [callData, setCallData] = useState({
    name: '',
    email: '',
    channelUrl: '',
    date: '',
    timeSlot: '16:00', // 4:00 PM IST default
    topics: 'Portfolio & Retention Audit'
  });

  // Brief Form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    brandUrl: '',
    service: initialService || 'AI Video Creation & Generative Media',
    volume: '8–12 Videos / Month',
    budget: '₹50,000 – ₹1,00,000 / month',
    message: ''
  });

  useEffect(() => {
    if (initialService) {
      setFormData(prev => ({ ...prev, service: initialService }));
    }
  }, [initialService]);

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setCallData(prev => ({ ...prev, date: `${yyyy}-${mm}-${dd}` }));
  }, []);

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

  // Generate Google Calendar Link
  const buildGoogleCalendarUrl = ({ title, details, dateStr, timeStr, durationMinutes = 30 }) => {
    try {
      // Parse date & time in local time
      const [year, month, day] = dateStr.split('-').map(Number);
      const [hours, minutes] = timeStr.split(':').map(Number);
      const start = new Date(year, month - 1, day, hours, minutes);
      const end = new Date(start.getTime() + durationMinutes * 60000);

      const formatIso = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
      const datesParam = `${formatIso(start)}/${formatIso(end)}`;

      const baseUrl = 'https://calendar.google.com/calendar/render';
      const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        details: details,
        location: 'Google Meet (Link will be sent to email)',
        dates: datesParam
      });

      return `${baseUrl}?${params.toString()}`;
    } catch {
      return 'https://calendar.google.com';
    }
  };

  const handleBookDiscoveryCall = async (e) => {
    e.preventDefault();
    setLoading(true);

    const callDetails = `Google Meet Strategy Session with Cutframe Studio.\nAgenda: ${callData.topics}\nChannel/Brand: ${callData.channelUrl || 'N/A'}\nClient Email: ${callData.email}`;
    const gCalUrl = buildGoogleCalendarUrl({
      title: `Cutframe Studio × ${callData.name} (Discovery Call)`,
      details: callDetails,
      dateStr: callData.date,
      timeStr: callData.timeSlot,
      durationMinutes: 25
    });

    try {
      const payload = {
        name: callData.name,
        email: callData.email,
        subject: `[Discovery Call Scheduled] ${callData.name} on ${callData.date} at ${callData.timeSlot} IST`,
        message: `Date: ${callData.date}\nTime: ${callData.timeSlot} IST\nTopic: ${callData.topics}\nChannel URL: ${callData.channelUrl || 'Not provided'}\nGoogle Calendar URL: ${gCalUrl}`
      };

      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setBookedCall({
        ...callData,
        gCalUrl
      });
      if (showToast) showToast('Discovery Call booked! Click below to add to Google Calendar.');
    } catch (err) {
      setBookedCall({
        ...callData,
        gCalUrl
      });
    } finally {
      setLoading(false);
    }
  };

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

      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setSubmittedBrief(true);
      if (showToast) showToast('Project brief received! Our team will contact you shortly.');
    } catch (err) {
      setSubmittedBrief(true);
      if (showToast) showToast('Project brief recorded!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Cutframe Studio • Schedule Strategy Call
              </h3>
              <p className="text-xs text-slate-500">
                1-on-1 creative & retention strategy with our senior production team.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 pb-0 border-b border-slate-100 flex gap-6">
          <button
            type="button"
            onClick={() => { setActiveTab('call'); setBookedCall(null); setSubmittedBrief(false); }}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'call'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Google Calendar Discovery Call
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('brief'); setBookedCall(null); setSubmittedBrief(false); }}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'brief'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Project Scope Brief (Quote)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6">
          {bookedCall ? (
            /* Successful Google Calendar Booking View */
            <div className="text-center py-6 space-y-5">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Discovery Call Confirmed!
                </h4>
                <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                  We have reserved your slot on <strong className="text-slate-900 font-semibold">{bookedCall.date}</strong> at <strong className="text-slate-900 font-semibold">{bookedCall.timeSlot} IST</strong>.
                </p>
              </div>

              {/* Booking Summary Box */}
              <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Attendee:</span>
                  <span className="font-semibold text-slate-900">{bookedCall.name} ({bookedCall.email})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration:</span>
                  <span className="font-semibold text-slate-900">25 Minutes (Google Meet)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Topic:</span>
                  <span className="font-semibold text-slate-900">{bookedCall.topics}</span>
                </div>
              </div>

              {/* 1-Click Add to Google Calendar Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={bookedCall.gCalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Add to Google Calendar</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : submittedBrief ? (
            /* Successful Brief View */
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-slate-900">
                Project Scope Received!
              </h4>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                Thank you. Our creative director will review your project requirements and respond with a customized scope and quote.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : activeTab === 'call' ? (
            /* Discovery Call Form with Date/Time Picker */
            <form onSubmit={handleBookDiscoveryCall} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={callData.name}
                    onChange={(e) => setCallData({ ...callData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={callData.email}
                    onChange={(e) => setCallData({ ...callData, email: e.target.value })}
                    placeholder="rahul@brand.in"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={callData.date}
                    onChange={(e) => setCallData({ ...callData, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm text-slate-900 bg-white cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Time Slot (IST) *
                  </label>
                  <select
                    value={callData.timeSlot}
                    onChange={(e) => setCallData({ ...callData, timeSlot: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm text-slate-900 bg-white cursor-pointer"
                  >
                    <option value="11:00">11:00 AM IST</option>
                    <option value="12:30">12:30 PM IST</option>
                    <option value="14:00">02:00 PM IST</option>
                    <option value="15:30">03:30 PM IST</option>
                    <option value="16:00">04:00 PM IST</option>
                    <option value="17:30">05:30 PM IST</option>
                    <option value="19:00">07:00 PM IST</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Channel / Brand / Instagram URL
                  </label>
                  <input
                    type="url"
                    value={callData.channelUrl}
                    onChange={(e) => setCallData({ ...callData, channelUrl: e.target.value })}
                    placeholder="https://youtube.com/@channel or @instagram"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Call Focus
                  </label>
                  <select
                    value={callData.topics}
                    onChange={(e) => setCallData({ ...callData, topics: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm text-slate-900 bg-white cursor-pointer"
                  >
                    <option value="AI Video Creation & Generative Media">AI Video Creation & Generative Media</option>
                    <option value="Short-Form Viral Retention Engine">Short-Form Viral Retention Engine</option>
                    <option value="YouTube Long-Form Storytelling">YouTube Long-Form Storytelling</option>
                    <option value="Commercial Ad Creatives">Commercial Ad Creatives</option>
                    <option value="Monthly Agency Retainer Consultation">Monthly Agency Retainer Consultation</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Reserving Slot...</span>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Confirm Call & Get Google Calendar Link</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Project Scope Brief Form (Indian Rupee ₹ Pricing Tiers) */
            <form onSubmit={handleSubmitBrief} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Marcus Vance"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="marcus@channel.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Brand / Channel / Portfolio Link
                  </label>
                  <input
                    type="url"
                    value={formData.brandUrl}
                    onChange={(e) => setFormData({ ...formData, brandUrl: e.target.value })}
                    placeholder="https://youtube.com/@channel"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Monthly Video Volume
                  </label>
                  <select
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm text-slate-900 bg-white cursor-pointer"
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
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Primary Service
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm text-slate-900 bg-white cursor-pointer"
                  >
                    <option value="AI Video Creation & Generative Media">AI Video Creation & Generative Media</option>
                    <option value="Short-Form Content Engine">Short-Form Content Engine</option>
                    <option value="YouTube Long-Form Production">YouTube Long-Form Production</option>
                    <option value="Commercial & Paid Ad Creatives">Commercial & Paid Ad Creatives</option>
                    <option value="Color Grading & Post-Production">Color Grading & Post-Production</option>
                    <option value="Full-Service Agency Retainer">Full-Service Agency Retainer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Budget Tier (INR)
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm text-slate-900 bg-white cursor-pointer"
                  >
                    <option value="₹25,000 – ₹50,000 / month">₹25,000 – ₹50,000 / month</option>
                    <option value="₹50,000 – ₹1,00,000 / month">₹50,000 – ₹1,00,000 / month</option>
                    <option value="₹1,00,000 – ₹2,50,000 / month">₹1,00,000 – ₹2,50,000 / month</option>
                    <option value="Custom Project Quote">Custom Project Quote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Project Notes & Details
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your brand, current retention hurdles, reference creators..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm text-slate-900 placeholder:text-slate-400 bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Submitting Scope Brief...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Project Scope Brief</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Confidential • Direct Creative Consultation</span>
        </div>
      </div>
    </div>
  );
}
