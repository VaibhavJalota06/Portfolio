import React from 'react';
import { gsap, useGsap, RevealHeading, Reveal, Scramble } from '../motion';

const STEPS = [
  { title: 'Free call', text: 'Book a call or message us on WhatsApp. We talk about your goals, style and budget.' },
  { title: 'Plan & quote', text: 'You get a clear monthly plan and price, with no hidden costs.' },
  { title: 'Shoot or share', text: 'We shoot on-site in Delhi NCR, or you send your raw files via Google Drive.' },
  { title: 'Review', text: 'You review every piece. We make your changes until you’re happy with it.' },
  { title: 'Export & post', text: 'Delivered ready to post, or we post it for you as part of page management.' },
];

export default function AgencyProcess() {
  const ref = useGsap((root) => {
    gsap.fromTo(root.querySelector('.cf-rail'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: root.querySelector('.cf-steps'), start: 'top 70%', end: 'bottom 60%', scrub: true } });
    root.querySelectorAll('.cf-step').forEach((step) => {
      gsap.from(step.querySelectorAll('h3, p'), { x: -50, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: step, start: 'top 88%' } });
    });
  });

  return (
    <section id="process" ref={ref} className="cf-sec">
      <div className="cf-wrap">
        <div className="cf-shead">
          <div>
            <Scramble text="03 / PROCESS" className="cf-idx" />
            <RevealHeading lines={['Raw to', 'render']} className="cf-wide cf-h2" />
          </div>
          <Reveal as="p">Simple and quick, and you always talk to the person editing your work.</Reveal>
        </div>
        <div className="relative">
          <div className="cf-rail" aria-hidden="true" />
          <ol className="cf-steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="cf-step">
                <Scramble text={`0${i + 1}`} className="n" />
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
