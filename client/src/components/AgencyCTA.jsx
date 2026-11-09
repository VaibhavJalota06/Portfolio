import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { CONTACT, getWhatsAppUrl } from '../contact';
import { gsap, useGsap, RevealHeading, Reveal } from '../motion';

export default function AgencyCTA({ onOpenDiscovery }) {
  const ref = useGsap((root) => {
    gsap.fromTo(root.querySelector('.cf-cta'), { scale: 0.9, borderRadius: 56 }, { scale: 1, borderRadius: 24, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'center center', scrub: true } });
  });

  return (
    <section id="contact" ref={ref} className="pb-10">
      <div className="cf-wrap">
        <div className="cf-cta">
          <p className="cf-mono flex items-center justify-center gap-2.5"><span className="cf-dot" /> Now taking new projects</p>
          <RevealHeading lines={['Got footage?', 'Let’s cut it.']} className="cf-wide mt-5" />
          <Reveal as="p" className="mt-5 mb-8 mx-auto max-w-[520px] text-[#c4c4cf] leading-relaxed">
            Book a free call. We’ll look at what you have and tell you exactly what we’d do with it.
          </Reveal>
          <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
            <button type="button" onClick={onOpenDiscovery} className="cf-btn cf-btn-red">
              Book a free call <ArrowRight className="w-4 h-4" />
            </button>
            <a href={getWhatsAppUrl('Hi Vaibhav, I have a project for Cutframe Studio.')} target="_blank" rel="noopener noreferrer" className="cf-btn cf-btn-wa">
              <MessageCircle className="w-4 h-4" /> WhatsApp {CONTACT.whatsapp}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
