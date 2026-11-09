import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { gsap, useGsap, RevealHeading, Reveal, Scramble } from '../motion';

const FAQS = [
  {
    q: 'Who do you work with?',
    a: 'Brands and businesses of all sizes: product and e-commerce brands, founders, creators, local businesses, and service companies that want high-retention video content and strong social media growth.',
  },
  {
    q: 'Do I have to record the videos myself?',
    a: 'Not necessarily. For clients in Delhi NCR, we can come to your office, store or workspace with professional cameras, lighting and audio equipment and record everything for you. If you already have footage, or you’re elsewhere in India, you can share your raw files via Google Drive or WhatsApp.',
  },
  {
    q: 'Can you make reels if I don’t have time to record?',
    a: 'Yes. We create engaging videos using motion graphics, AI visuals, licensed B-roll and custom animation, keeping your brand active and consistent without you having to step in front of a camera.',
  },
  {
    q: 'What happens if I want changes?',
    a: 'You review every reel and post before it goes live. Tell us what to change and we update it until you’re completely happy.',
  },
  {
    q: 'Do you only work in Delhi NCR?',
    a: 'We do on-site filming and production across Delhi NCR, and video editing, design and social media management for clients all over India and internationally.',
  },
  {
    q: 'How do your website projects work?',
    a: 'We design and build clean, fast, mobile-first websites (landing pages, portfolio sites, brand pages or product catalogues) with SEO, WhatsApp click-to-chat and contact forms built in, usually delivered in 5 to 10 business days.',
  },
  {
    q: 'How much does it cost?',
    a: 'It depends on how many videos you need, whether you need on-site shooting, and whether you want full social media management. After a short discovery call, we send a clear monthly quote with no hidden fees.',
  },
];

export default function AgencyFAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const ref = useGsap((root) => {
    gsap.from(root.querySelectorAll('.cf-faq'), { y: 30, autoAlpha: 0, stagger: 0.07, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: root.querySelector('.cf-faqs'), start: 'top 85%' } });
  });

  return (
    <section id="faq" ref={ref} className="cf-sec">
      <div className="cf-wrap">
        <div className="cf-shead">
          <div>
            <Scramble text="05 / FAQ" className="cf-idx" />
            <RevealHeading lines={['Questions']} className="cf-wide cf-h2" />
          </div>
          <Reveal as="p">Still unsure? Message us on WhatsApp and we’ll answer personally.</Reveal>
        </div>
        <div className="cf-faqs border-t border-[#23232c]">
          {FAQS.map((f, i) => {
            const open = openIndex === i;
            return (
              <div key={f.q} className={`cf-faq ${open ? 'open' : ''}`}>
                <button type="button" onClick={() => setOpenIndex(open ? -1 : i)} aria-expanded={open}>
                  <span>{f.q}</span>
                  <Plus className="plus" aria-hidden="true" />
                </button>
                <div className="ans"><div><p>{f.a}</p></div></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
