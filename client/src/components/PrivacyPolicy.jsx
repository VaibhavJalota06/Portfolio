import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CONTACT } from '../contact';

// Required by Google before the OAuth app can be published (Calendar + Drive access).
export default function PrivacyPolicy({ contactEmail }) {
  const email = contactEmail || CONTACT.email;
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-24 text-slate-700 leading-relaxed">
      <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Cutframe Studio
      </a>
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mb-10">Last updated: 12 October 2026</p>

      <section className="space-y-6 text-sm sm:text-base">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">What we collect</h2>
          <p>When you book a discovery call or request a quote, we collect the details you enter: your name, email address, optional channel or brand link, the service you&apos;re interested in, and any project notes. We do not use tracking cookies or advertising trackers.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">How we use it</h2>
          <p>We use your details only to schedule and hold your call, reply to your enquiry, and send you the meeting invitation. We never sell or share your information with third parties for marketing.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Google services</h2>
          <p>Bookings are scheduled through our own Google Calendar, which creates the Google Meet link and emails you the invitation. Our portfolio is shown from our own Google Drive. The site accesses only the studio&apos;s Google account. It never accesses visitors&apos; Google accounts or data. Our use of information received from Google APIs follows the <a className="text-blue-600 hover:underline" href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Storage &amp; retention</h2>
          <p>Enquiries are stored securely and kept only as long as needed to work with you. You can ask us to delete your information at any time.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Contact</h2>
          <p>Questions or deletion requests: <a className="text-blue-600 hover:underline" href={`mailto:${email}`}>{email}</a></p>
        </div>
      </section>
    </main>
  );
}
