import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, FileText, RefreshCw, AlertCircle, Mail, MapPin, Phone, CheckCircle2 } from 'lucide-react';
import { CONTACT } from '../contact';

export default function LegalPolicies({ initialTab = 'privacy' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['privacy', 'terms', 'refund', 'grievance'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: Shield, badge: 'DPDP Act 2023' },
    { id: 'terms', label: 'Terms of Service', icon: FileText, badge: 'Contract Act' },
    { id: 'refund', label: 'Refund & Cancellation', icon: RefreshCw, badge: 'Consumer Protection' },
    { id: 'grievance', label: 'Grievance Redressal', icon: AlertCircle, badge: 'IT Rules 2021' },
  ];

  const handleTabChange = (id) => {
    setActiveTab(id);
    window.location.hash = `#${id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-24 text-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '';
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cutframe Studio</span>
          </a>
        </div>

        {/* Title Header */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
                <span>Statutory Compliance &amp; Policies</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Legal &amp; Policy Portal
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Cutframe Studio · Compliant with the Digital Personal Data Protection Act 2023, IT Act 2000 &amp; Consumer Protection Rules.
              </p>
            </div>
            <div className="text-right font-mono text-xs text-slate-400 shrink-0">
              <div>Effective: October 2026</div>
              <div>Jurisdiction: New Delhi, India</div>
            </div>
          </div>

          {/* Policy Navigation Tabs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex flex-col items-start p-3 sm:p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {tab.badge}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold leading-tight">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Privacy Policy */}
        {activeTab === 'privacy' && (
          <article className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 leading-relaxed">
            <header className="border-b border-slate-100 pb-5">
              <h2 className="text-2xl font-bold text-slate-900">Privacy Policy (Consent Notice)</h2>
              <p className="text-xs text-slate-500 mt-1">
                Framed under Section 5 &amp; 6 of the Digital Personal Data Protection (DPDP) Act, 2023 and Rule 4 of the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
              </p>
            </header>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">1. Data Fiduciary Identity</h3>
              <p className="text-sm text-slate-600">
                <strong>Cutframe Studio</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is an independent video editing and creative production studio based in New Delhi, India. In collecting and processing personal data from our clients and website visitors, Cutframe Studio acts as the <strong>Data Fiduciary</strong> under the Digital Personal Data Protection Act, 2023.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">2. Categories of Personal Data Collected</h3>
              <p className="text-sm text-slate-600">
                We collect only specific personal data that is strictly necessary for communicating with you and fulfilling creative video editing deliverables:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600">
                <li><strong>Identity &amp; Contact Details:</strong> Name, professional email address, WhatsApp/phone number.</li>
                <li><strong>Brand Information:</strong> Website URL, social media handles, channel usernames, and content preferences.</li>
                <li><strong>Client Media Files:</strong> Raw video footage, B-roll, audio recordings, script files, and logos provided by you for editing via Google Drive or WhatsApp.</li>
                <li><strong>Billing &amp; Invoicing:</strong> GSTIN (if applicable), billing address, and transaction confirmation details. We do not store credit card or debit card numbers on our servers.</li>
              </ul>
              <p className="text-sm text-slate-600">
                We <strong>do not</strong> use invasive advertising pixels, third-party data tracking networks, or behavioral data brokers.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">3. Purpose of Data Processing</h3>
              <p className="text-sm text-slate-600">
                Your data is processed strictly for:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600">
                <li>Scheduling discovery calls and confirming Google Meet appointments.</li>
                <li>Delivering video editing, reels, shorts, motion graphics, and page management services.</li>
                <li>Providing project revision drafts and collecting client feedback.</li>
                <li>Issuing service invoices, payment receipts, and statutory tax records.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">4. Your Rights as a Data Principal (DPDP Act, 2023)</h3>
              <p className="text-sm text-slate-600">
                Under the DPDP Act 2023, you hold the following statutory rights regarding your personal data:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-semibold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Right to Access
                  </div>
                  <p className="text-xs text-slate-600">Request a summary of all personal data held by us.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-semibold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Right to Correction
                  </div>
                  <p className="text-xs text-slate-600">Update inaccurate or incomplete contact or project information.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-semibold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Right to Erasure
                  </div>
                  <p className="text-xs text-slate-600">Request complete deletion of your files and contact details once services conclude.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-semibold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Right to Withdraw Consent
                  </div>
                  <p className="text-xs text-slate-600">Withdraw communication consent at any time via email or WhatsApp.</p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">5. Storage, Cloud Services &amp; Google API Disclosures</h3>
              <p className="text-sm text-slate-600">
                Bookings are coordinated through our Google Calendar (which generates Google Meet invitations). Client work portfolio items are hosted using our Google Drive. The site accesses only Cutframe Studio&apos;s own Google accounts and never accesses any visitor&apos;s personal Google account or Drive data. Our implementation adheres strictly to the <a className="text-blue-600 hover:underline" href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including Limited Use requirements.
              </p>
              <p className="text-sm text-slate-600">
                <strong>Retention Window:</strong> Client raw footage files are securely retained for 30 calendar days post final delivery to accommodate revision requests, after which raw project archives are permanently deleted unless ongoing retention is requested in writing.
              </p>
            </section>
          </article>
        )}

        {/* Tab 2: Terms of Service */}
        {activeTab === 'terms' && (
          <article className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 leading-relaxed">
            <header className="border-b border-slate-100 pb-5">
              <h2 className="text-2xl font-bold text-slate-900">Terms of Service (Client Agreement)</h2>
              <p className="text-xs text-slate-500 mt-1">
                Governed by the Indian Contract Act, 1872 and the Information Technology Act, 2000.
              </p>
            </header>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">1. Scope of Creative Services</h3>
              <p className="text-sm text-slate-600">
                Cutframe Studio provides post-production and creative content services including short-form video editing (Reels, Shorts), YouTube long-form editing, commercial brand edits, graphic design assets (carousels, posters), and multi-platform page management. Specific deliverables, quantities, and timelines are agreed upon prior to project commencement via discovery call, WhatsApp, or written scope brief.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">2. Intellectual Property &amp; Commercial Usage Rights</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                <li><strong>Client Raw Footage:</strong> The client retains 100% intellectual property ownership of all original raw footage, audio, trademarks, and logos supplied to Cutframe Studio.</li>
                <li><strong>Final Deliverables:</strong> Upon receipt of full agreed payment, Cutframe Studio grants the client full, perpetual, worldwide commercial usage rights for the final rendered video and graphic files.</li>
                <li><strong>Portfolio Showcase:</strong> Unless an explicit Non-Disclosure Agreement (NDA) or privacy requirement is requested prior to editing, Cutframe Studio reserves the standard industry right to display published work in its digital portfolio to demonstrate creative craft.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">3. Client Warranties &amp; Third-Party Content</h3>
              <p className="text-sm text-slate-600">
                The client represents and warrants that all media, footage, and scripts supplied do not infringe any copyright, trademark, privacy, or proprietary rights of any third party. The client agrees not to request content that violates Indian penal laws, incites hate speech, or promotes unlawful activities.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">4. Review, Approval &amp; Revision Cycles</h3>
              <p className="text-sm text-slate-600">
                We believe in complete creative alignment:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600">
                <li>Every edit is delivered as a review draft before public release.</li>
                <li>Clients may request revisions regarding pacing, text, audio balance, or color grading.</li>
                <li>Changes outside the initial agreed scope or new footage recorded after editing has started may incur an additional agreed fee.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">5. Limitation of Liability &amp; Platform Algorithm Disclaimer</h3>
              <p className="text-sm text-slate-600">
                While Cutframe Studio optimizes video structure for high retention, we do not guarantee specific viewer numbers, algorithmic distribution, or sales, as social media platform algorithms (Instagram, YouTube, Meta, etc.) are outside our control. In no event shall Cutframe Studio be liable for indirect, punitive, or consequential damages.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">6. Governing Law &amp; Jurisdiction</h3>
              <p className="text-sm text-slate-600">
                These Terms are governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts of <strong>New Delhi, India</strong>.
              </p>
            </section>
          </article>
        )}

        {/* Tab 3: Refund & Cancellation */}
        {activeTab === 'refund' && (
          <article className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 leading-relaxed">
            <header className="border-b border-slate-100 pb-5">
              <h2 className="text-2xl font-bold text-slate-900">Refund &amp; Cancellation Policy</h2>
              <p className="text-xs text-slate-500 mt-1">
                Framed under the Consumer Protection (E-Commerce) Rules, 2020 and Indian Contract Act, 1872.
              </p>
            </header>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">1. Cancellation of Monthly Page Management &amp; Retainers</h3>
              <p className="text-sm text-slate-600">
                We value long-term partnerships built on trust rather than restrictive lock-ins. You may cancel or pause your monthly retainer plan at any time by giving <strong>7 calendar days written notice</strong> before your next monthly billing date via WhatsApp or email. Upon cancellation, no further charges will be billed for subsequent months.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">2. Project-Based Editing Refund Rules</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                <li><strong>Prior to Work Commencement:</strong> If an upfront payment has been made but editing work has not yet commenced, a <strong>100% full refund</strong> will be issued immediately upon written request.</li>
                <li><strong>In-Progress Projects:</strong> If raw footage has been ingested and drafts have been delivered, refunds are calculated pro-rata deducting the editing hours already invested in delivered drafts.</li>
                <li><strong>Completed Projects:</strong> Due to the customized nature of digital video editing, once a video edit or graphic deliverable is finalized and approved by the client, fees are non-refundable. Revisions are provided to ensure complete client satisfaction before final sign-off.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">3. Refund Processing Timelines</h3>
              <p className="text-sm text-slate-600">
                Approved refund requests are initiated within <strong>24 to 48 hours</strong> and will be credited back to your original payment method (Bank Transfer / UPI) within <strong>5 to 7 business days</strong> as per banking network standards.
              </p>
            </section>
          </article>
        )}

        {/* Tab 4: Grievance Redressal */}
        {activeTab === 'grievance' && (
          <article className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 leading-relaxed">
            <header className="border-b border-slate-100 pb-5">
              <h2 className="text-2xl font-bold text-slate-900">Grievance Redressal Mechanism</h2>
              <p className="text-xs text-slate-500 mt-1">
                Statutory disclosure published pursuant to Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and Section 12 of the DPDP Act, 2023.
              </p>
            </header>

            <section className="space-y-3">
              <p className="text-sm text-slate-600">
                If you have any questions, concerns, or grievances regarding our privacy practices, data processing, intellectual property, or creative deliverables, you may contact our designated <strong>Grievance Officer</strong> directly:
              </p>

              {/* Grievance Officer Contact Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold font-mono">
                    VJ
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Vaibhav Jalota</h3>
                    <p className="text-xs text-blue-600 font-semibold font-mono">Designated Grievance &amp; Data Protection Officer</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>Cutframe Studio, New Delhi - 110001, India</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <a href={`mailto:${CONTACT.email}`} className="text-blue-600 hover:underline font-mono">{CONTACT.email}</a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>WhatsApp: {CONTACT.whatsapp}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Redressal Timeline: 24h ack / 15d resolution</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">Resolution Process &amp; Timelines</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600">
                <li><strong>Acknowledgement:</strong> Every formal grievance received via email will be acknowledged with a unique reference number within <strong>24 to 48 hours</strong>.</li>
                <li><strong>Investigation &amp; Redressal:</strong> In accordance with statutory guidelines under the IT Rules 2021, grievances will be thoroughly investigated and resolved within <strong>15 calendar days</strong> from receipt.</li>
              </ul>
            </section>
          </article>
        )}

      </div>
    </main>
  );
}
