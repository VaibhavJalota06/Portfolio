import React, { useState, useEffect } from 'react';
import { X, Calendar, Send, CheckCircle2, ArrowRight, ShieldCheck, ChevronDown, Video, Loader2 } from 'lucide-react';

const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const toYmd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const istToDate = (dateStr, timeStr) => new Date(`${dateStr}T${timeStr}:00+05:30`);
const fmtIst = (timeStr) => new Date(`2000-01-01T${timeStr}:00`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
const fmtLocal = (dateStr, timeStr) => istToDate(dateStr, timeStr).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
const isIstZone = new Date().getTimezoneOffset() === -330;
const fmtDate = (dateStr) => new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

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
    timeSlot: '',
    topics: initialService || 'Social Media & Page Management'
  });

  // Brief Form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    brandUrl: '',
    service: initialService || 'Social Media & Page Management',
    volume: '8–12 posts / reels a month',
    budget: 'Not sure yet: suggest a plan',
    message: ''
  });

  // Sync when user clicks "Request [Service]" from any service card
  useEffect(() => {
    if (initialService) {
      setFormData(prev => ({ ...prev, service: initialService }));
      setCallData(prev => ({ ...prev, topics: initialService }));
    }
  }, [initialService]);

  // Set default date to tomorrow
  useEffect(() => {
    setCallData(prev => ({ ...prev, date: toYmd(addDays(new Date(), 1)) }));
  }, []);

  // Load free slots from the owner's Google Calendar whenever the date changes
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [slotsReload, setSlotsReload] = useState(0);
  useEffect(() => {
    if (!isOpen || !callData.date) return;
    let cancelled = false;
    setSlotsLoading(true);
    fetch(`/api/booking/slots?date=${callData.date}`)
      .then(r => r.ok ? r.json() : { slots: [] })
      .catch(() => ({ slots: [] }))
      .then(data => {
        if (cancelled) return;
        setSlots(data.slots || []);
        setCallData(prev => ({ ...prev, timeSlot: (data.slots || []).includes(prev.timeSlot) ? prev.timeSlot : '' }));
        setSlotsLoading(false);
      });
    return () => { cancelled = true; };
  }, [isOpen, callData.date, slotsReload]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);


  // Fallback "Add to Google Calendar" link (used when the owner's calendar isn't connected)
  const buildGoogleCalendarUrl = ({ title, details, dateStr, timeStr, durationMinutes }) => {
    const start = istToDate(dateStr, timeStr);
    const end = new Date(start.getTime() + durationMinutes * 60000);
    const fmt = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      details,
      location: 'Google Meet (link sent by email)',
      dates: `${fmt(start)}/${fmt(end)}`
    });
    return `https://calendar.google.com/calendar/render?${params}`;
  };

  const handleBookDiscoveryCall = async (e) => {
    e.preventDefault();
    if (!callData.timeSlot) {
      setBookingError('Please pick a time slot.');
      return;
    }
    setLoading(true);
    setBookingError('');

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: callData.name,
          email: callData.email,
          date: callData.date,
          time: callData.timeSlot,
          topic: callData.topics,
          channelUrl: callData.channelUrl
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Booking failed. Please try again.');

      setBookedCall({
        ...callData,
        minutes: data.minutes,
        meetLink: data.meetLink,
        calendarEvent: data.calendarEvent,
        gCalUrl: buildGoogleCalendarUrl({
          title: `Cutframe Studio × ${callData.name} (Discovery Call)`,
          details: `Discovery call with Cutframe Studio.
Focus: ${callData.topics}`,
          dateStr: callData.date,
          timeStr: callData.timeSlot,
          durationMinutes: data.minutes || 30
        })
      });
      window.gtag?.('event', 'generate_lead', { method: 'call_booking' }); // counted as an enquiry in Google Analytics
      if (showToast) showToast(data.calendarEvent ? 'Call booked! Invite sent to your email.' : 'Call request received!');
    } catch (err) {
      setBookingError(err.message);
      // A taken slot: refresh availability
      if (/no longer available/i.test(err.message)) setSlotsReload(n => n + 1);
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

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();

      setSubmittedBrief(true);
      window.gtag?.('event', 'generate_lead', { method: 'project_brief' });
      if (showToast) showToast('Project brief received! Our team will contact you shortly.');
    } catch {
      if (showToast) showToast('Could not send your brief. Please try again or email us.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const serviceOptions = [
    'Social Media & Page Management',
    'Reels & Video Editing',
    'Graphic Design',
    'AI Videos & Creatives',
    'Website Design & Development',
    'Full Creative Package'
  ];

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm"
      style={{ margin: 0, top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Book a Free Call
              </h3>
              <p className="text-xs text-slate-500">
                Free 30-minute call with the founder to discuss your brand goals.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 sm:px-6 pt-3 pb-0 border-b border-slate-100 flex gap-6 shrink-0 bg-white">
          <button
            type="button"
            onClick={() => { setActiveTab('call'); setBookedCall(null); setSubmittedBrief(false); }}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'call'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Discovery Call
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
            Get a Quote
          </button>
        </div>

        {/* Modal Body (Scrollable if viewport is small) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {bookedCall ? (
            /* Successful Google Calendar Booking View */
            <div className="text-center py-6 space-y-5">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Your Call Is Booked!
                </h4>
                <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                  {fmtDate(bookedCall.date)} at <strong className="text-slate-900 font-semibold">{fmtIst(bookedCall.timeSlot)} IST</strong>
                  {!isIstZone && <> ({fmtLocal(bookedCall.date, bookedCall.timeSlot)} your time)</>}.{' '}
                  {bookedCall.calendarEvent
                    ? <>A Google Calendar invite with the Meet link has been sent to <strong className="text-slate-900 font-semibold">{bookedCall.email}</strong>. If Gmail marks it &ldquo;unknown sender&rdquo;, that&apos;s normal for a first invite. Just click <strong className="text-slate-900 font-semibold">Accept</strong>.</>
                    : <>We&apos;ll email the Google Meet link to <strong className="text-slate-900 font-semibold">{bookedCall.email}</strong> shortly.</>}
                </p>
              </div>

              {/* Booking Summary Box */}
              <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 text-slate-700">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 shrink-0">Attendee:</span>
                  <span className="font-semibold text-slate-900 text-right break-all">{bookedCall.name} ({bookedCall.email})</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 shrink-0">Duration:</span>
                  <span className="font-semibold text-slate-900">{bookedCall.minutes || 30} minutes · Google Meet</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 shrink-0">Topic:</span>
                  <span className="font-semibold text-slate-900 text-right">{bookedCall.topics}</span>
                </div>
                {bookedCall.meetLink && (
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500 shrink-0">Meet link:</span>
                    <a href={bookedCall.meetLink} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline break-all text-right">{bookedCall.meetLink.replace('https://', '')}</a>
                  </div>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={bookedCall.meetLink || bookedCall.gCalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {bookedCall.meetLink ? <Video className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                  <span>{bookedCall.meetLink ? 'Open Google Meet Link' : 'Add to Google Calendar'}</span>
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
                Thank you! We’ll review your details and get back to you within a day with ideas and a clear quote. For a faster reply, message us on WhatsApp.
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

              <div>
                <label htmlFor="call-date" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preferred Date *
                </label>
                <input
                  id="call-date"
                  type="date"
                  required
                  min={toYmd(new Date())}
                  max={toYmd(addDays(new Date(), 60))}
                  value={callData.date}
                  onChange={(e) => setCallData({ ...callData, date: e.target.value })}
                  className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm text-slate-900 bg-white cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-3 mb-1.5">
                  <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Available Times (IST) *
                  </span>
                  {!isIstZone && callData.timeSlot && (
                    <span className="text-xs text-slate-500">= {fmtLocal(callData.date, callData.timeSlot)} your time</span>
                  )}
                </div>
                {slotsLoading ? (
                  <div className="flex items-center gap-2 text-sm text-slate-500 py-3">
                    <Loader2 className="w-4 h-4 animate-spin" /> Checking the calendar…
                  </div>
                ) : slots.length === 0 ? (
                  <p className="text-sm text-slate-500 py-3 px-4 rounded-xl bg-slate-50 border border-slate-200">
                    No free times on this day. Please pick another date.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="Available times">
                    {slots.map(t => (
                      <button
                        key={t}
                        type="button"
                        role="radio"
                        aria-checked={callData.timeSlot === t}
                        onClick={() => { setCallData({ ...callData, timeSlot: t }); setBookingError(''); }}
                        className={`py-2.5 rounded-xl border text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer focus-ring ${
                          callData.timeSlot === t
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-700'
                        }`}
                      >
                        {fmtIst(t)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Social Profiles / Website
                  </label>
                  <input
                    type="text"
                    value={callData.channelUrl}
                    onChange={(e) => setCallData({ ...callData, channelUrl: e.target.value })}
                    placeholder="@yourbrand or website / channels"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Call Focus
                  </label>
                  <div className="relative">
                    <select
                      value={callData.topics}
                      onChange={(e) => setCallData({ ...callData, topics: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm text-slate-900 bg-white cursor-pointer appearance-none pr-10"
                    >
                      {serviceOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {bookingError && (
                <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{bookingError}</p>
              )}

              <button
                type="submit"
                disabled={loading || !callData.timeSlot}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Booking your call…</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Confirm Call &amp; Send Google Meet Invite</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Project Scope Brief Form */
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rahul@brand.in"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Social Profiles / Website
                  </label>
                  <input
                    type="text"
                    value={formData.brandUrl}
                    onChange={(e) => setFormData({ ...formData, brandUrl: e.target.value })}
                    placeholder="@yourbrand or website / channels"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Posts / Reels per Month
                  </label>
                  <div className="relative">
                    <select
                      value={formData.volume}
                      onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm text-slate-900 bg-white cursor-pointer appearance-none pr-10"
                    >
                      <option value="4–8 posts / reels a month">4–8 posts / reels a month</option>
                      <option value="8–12 posts / reels a month">8–12 posts / reels a month</option>
                      <option value="12–20 posts / reels a month">12–20 posts / reels a month</option>
                      <option value="20+ a month (daily posting)">20+ a month (daily posting)</option>
                      <option value="One-time project">One-time project</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Primary Service
                  </label>
                  <div className="relative">
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm text-slate-900 bg-white cursor-pointer appearance-none pr-10"
                    >
                      {serviceOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Monthly Budget (₹)
                  </label>
                  <div className="relative">
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 text-sm text-slate-900 bg-white cursor-pointer appearance-none pr-10"
                    >
                      <option value="Not sure yet: suggest a plan">Not sure yet: suggest a plan</option>
                      <option value="Under ₹15,000 / month">Under ₹15,000 / month</option>
                      <option value="₹15,000 – ₹30,000 / month">₹15,000 – ₹30,000 / month</option>
                      <option value="₹30,000 – ₹60,000 / month">₹30,000 – ₹60,000 / month</option>
                      <option value="₹60,000+ / month">₹60,000+ / month</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
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
                  placeholder="Tell us about your brand, your social channels and what content you need…"
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
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Strictly Confidential • Direct Creative Consultation</span>
        </div>
      </div>
    </div>
  );
}
