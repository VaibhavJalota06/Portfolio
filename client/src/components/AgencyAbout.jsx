import React from 'react';
import { Users, LayoutGrid, Clapperboard, Palette, Bot, FileText, CalendarCheck, FolderUp, MessageSquareText, PackageCheck, Linkedin, Instagram, Mail } from 'lucide-react';
import { CONTACT } from '../contact';


const services = [
  { icon: LayoutGrid, title: 'Instagram page management', text: 'Content plan, posting and a consistent look for your page, so it stays active without taking your time.' },
  { icon: Clapperboard, title: 'Reels & video editing', text: 'Short, engaging reels from your raw clips: hooks, captions, music and pacing that keep people watching.' },
  { icon: Palette, title: 'Graphic design', text: 'Posts, posters and carousels that explain your services clearly and match your brand.' },
  { icon: Bot, title: 'AI videos & creatives', text: 'AI-generated visuals, avatars and B-roll to explain your products and ideas when you don’t have footage.' },
];

const steps = [
  { icon: CalendarCheck, title: 'Free discovery call', text: 'Book a call or message us on WhatsApp to discuss your brand and content goals.' },
  { icon: FileText, title: 'Custom plan & quote', text: 'We prepare a clear monthly plan and quote tailored to your needs, with no hidden costs.' },
  { icon: FolderUp, title: 'Share your footage', text: 'Send clips through WhatsApp or a shared Google Drive folder. No new apps or software needed.' },
  { icon: MessageSquareText, title: 'Review & approve', text: 'You get each reel or post to review. We make your changes until you are happy with it.' },
  { icon: PackageCheck, title: 'Post & grow', text: 'Content is delivered ready to post, or we post it for you as part of page management.' },
];

export default function AgencyAbout() {
  return (
    <section id="about" className="py-24 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Who we are */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-4">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              About Cutframe Studio
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
              We help brands <span className="text-blue-600">grow on Instagram</span>
            </h2>
            <p className="mt-4 text-base text-slate-500 font-medium">Video editing &amp; Instagram content studio · Delhi &amp; all India</p>
          </div>
          <div className="space-y-6 text-base sm:text-lg text-slate-600 leading-relaxed lg:pt-4">
            <p>
              Cutframe Studio is a video editing and Instagram content studio based in Delhi. We work with brands,
              businesses, creators, clinics and doctors across India. We handle the reels, posts and page management,
              so you can focus on running your business.
            </p>

            {/* Founder Profile Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="relative shrink-0">
                <img
                  src="/founder.jpg"
                  alt="Vaibhav Jalota, Founder of Cutframe Studio"
                  className="w-24 h-28 sm:w-28 sm:h-32 object-cover object-top rounded-xl border border-slate-200 shadow-md"
                  loading="lazy"
                />
                <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold font-mono tracking-wider shadow-sm">
                  FOUNDER
                </span>
              </div>
              <div className="space-y-2 text-center sm:text-left flex-1">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Vaibhav Jalota</h3>
                  <p className="text-xs text-blue-600 font-semibold font-mono">Founder &amp; Creative Lead</p>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  You talk directly to the person creating and overseeing your content — no middlemen, no handoffs, and quick replies on WhatsApp.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <a
                    href={CONTACT.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-medium text-xs transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={CONTACT.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 font-medium text-xs transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What we do */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* How working with us works */}
        <div className="mt-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">How working with us works</h3>
            <p className="mt-3 text-slate-600">
              Book a quick call to talk through your goals, and we'll create a tailored plan for your brand.
            </p>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-base font-bold text-slate-900">{title}</h4>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{text}</p>
              </li>
            ))}
          </ol>
        </div>

      </div>
    </section>
  );
}
