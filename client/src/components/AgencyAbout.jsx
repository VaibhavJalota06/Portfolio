import React from 'react';
import { Users, LayoutGrid, Clapperboard, Palette, Bot, Gift, CalendarCheck, FolderUp, MessageSquareText, PackageCheck } from 'lucide-react';


const services = [
  { icon: LayoutGrid, title: 'Instagram page management', text: 'Content plan, posting and a consistent look for your page, so it stays active without taking your time.' },
  { icon: Clapperboard, title: 'Reels & video editing', text: 'Short, engaging reels from your raw clips: hooks, captions, music and pacing that keep people watching.' },
  { icon: Palette, title: 'Graphic design', text: 'Posts, posters and carousels that explain your services clearly and match your brand.' },
  { icon: Bot, title: 'AI videos & creatives', text: 'AI-generated visuals, avatars and B-roll to explain your products and ideas when you don’t have footage.' },
];

const steps = [
  { icon: CalendarCheck, title: 'Free call + Instagram audit', text: 'Book a call or message us on WhatsApp. We review your current Instagram page and show you what to improve.' },
  { icon: Gift, title: 'Free sample reel concept', text: 'Before you pay anything, we share a sample reel idea made for your brand, so you can see how we think.' },
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
          <div className="space-y-5 text-base sm:text-lg text-slate-600 leading-relaxed lg:pt-10">
            <p>
              Cutframe Studio is a video editing and Instagram content studio based in Delhi. We work with brands,
              businesses, creators, clinics and doctors across India. We handle the reels, posts and page management,
              so you can focus on running your business.
            </p>
            <p>
              The studio is run by <strong className="text-slate-900 font-semibold">Vaibhav Jalota</strong>, its founder.
              You talk directly to the person creating your content, with no middlemen, no handoffs and quick replies on WhatsApp.
            </p>
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
              We always start with a <strong className="text-slate-900 font-semibold">free sample reel concept</strong> and a <strong className="text-slate-900 font-semibold">quick Instagram audit</strong>, so you see the value before you commit.
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
