import React from 'react';
import { Linkedin, Instagram, Mail, ArrowRight } from 'lucide-react';
import { CONTACT } from '../contact';
import { gsap, useGsap, RevealHeading, Reveal, Scramble } from '../motion';

const FACTS = [
  { big: '1:1', small: 'You talk directly to the editor' },
  { big: 'Delhi NCR', small: 'On-site shoots with camera & lights' },
  { big: 'All India', small: 'Remote editing & design' },
];

export default function AgencyAbout() {
  const ref = useGsap((root) => {
    const photo = root.querySelector('.cf-photo');
    // Photo is revealed by vertical strips (like a transition), then drifts slightly on scroll
    gsap.to(root.querySelectorAll('.cf-strips i'), { scaleY: 0, transformOrigin: (i) => (i % 2 ? 'top' : 'bottom'), duration: 1.1, stagger: 0.07, ease: 'expo.inOut', scrollTrigger: { trigger: photo, start: 'top 75%' } });
    gsap.fromTo(root.querySelector('.cf-photo img'), { scale: 1.3 }, { scale: 1, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: photo, start: 'top 75%' } });
    gsap.to(root.querySelector('.cf-photo img'), { yPercent: -6, ease: 'none', scrollTrigger: { trigger: photo, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from(root.querySelectorAll('.cf-stat'), { y: 30, autoAlpha: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: root.querySelector('.cf-stats'), start: 'top 90%' } });
  });

  return (
    <section id="about" ref={ref} className="cf-sec">
      <div className="cf-wrap grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 items-center">
        <div className="cf-photo mx-auto lg:mx-0">
          <img src="/founder.jpg" alt="Vaibhav Jalota, founder of Cutframe Studio" loading="lazy" />
          <div className="cf-strips" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
          <span className="absolute top-3.5 left-3.5 z-[3] flex items-center gap-2 cf-mono text-white bg-black/70 px-2.5 py-1.5 rounded-md" style={{ color: '#fff' }}>
            <span className="cf-dot" /> Founder · {CONTACT.founder}
          </span>
        </div>

        <div>
          <Scramble text="04 / ABOUT" className="cf-idx" />
          <RevealHeading lines={['No middlemen.', 'Just the editor.']} className="cf-wide text-[clamp(30px,4.6vw,56px)]" />
          <Reveal as="p" className="mt-5 text-[16px] sm:text-[17px] leading-relaxed text-[#b8b8c4]">
            Cutframe Studio is a post-production and design studio in Delhi, working with brands, founders and creators across India.
            You talk directly to {CONTACT.founder.split(' ')[0]}, the person cutting, grading and designing your content, with quick replies on WhatsApp.
          </Reveal>

          <div className="cf-stats mt-7 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {FACTS.map((f) => (
              <div key={f.big} className="cf-stat">
                <b>{f.big}</b>
                <span>{f.small}</span>
              </div>
            ))}
          </div>

          <Reveal className="mt-7 flex flex-wrap gap-2.5">
            <a href={CONTACT.linkedinUrl} target="_blank" rel="noopener noreferrer" className="cf-btn cf-btn-ghost cf-btn-sm"><Linkedin className="w-4 h-4" /> LinkedIn</a>
            <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" className="cf-btn cf-btn-ghost cf-btn-sm"><Instagram className="w-4 h-4" /> Instagram</a>
            <a href={`mailto:${CONTACT.email}`} className="cf-btn cf-btn-ghost cf-btn-sm"><Mail className="w-4 h-4" /> Email</a>
            <a href="/post-production/" className="cf-btn cf-btn-ghost cf-btn-sm">Post-Production portfolio <ArrowRight className="w-4 h-4" /></a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
