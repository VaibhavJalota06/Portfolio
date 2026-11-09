import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../contact';
import { gsap, useGsap, RevealHeading, Reveal, Scramble, finePointer } from '../motion';

// `service` must match an option in DiscoveryModal's "Primary Service" list.
const SERVICES = [
  {
    id: 'video', color: 'var(--red)', tag: 'Most popular', featured: true,
    title: 'Video editing & post-production', service: 'Reels & Video Editing',
    description: 'Reels, Shorts, YouTube, ads and brand films. Hooks in the first three seconds, clean captions, pacing that keeps people watching, plus colour and sound done properly.',
    chips: ['Reels & Shorts', 'YouTube', 'Ad edits', 'Colour grading', 'Sound design', 'Subtitles'],
    links: [{ label: 'More about video editing', href: '/reels-video-editing-delhi' }],
  },
  {
    id: 'ai', color: 'var(--violet)', tag: 'New',
    title: 'AI video & creatives', service: 'AI Videos & Creatives',
    description: 'AI avatars, generated scenes and B-roll for when you don’t have footage, finished with real editing so it looks polished, not robotic.',
    chips: ['AI avatars', 'AI B-roll', 'Explainers', 'AI images'],
    links: [{ label: 'More about AI videos', href: '/ai-videos' }],
  },
  {
    id: 'motion', color: 'var(--amber)',
    title: 'Motion graphics', service: 'Reels & Video Editing',
    description: 'Animated titles, logo reveals, kinetic text and explainer animation that make your videos feel premium.',
    chips: ['Logo reveals', 'Kinetic type', 'Lower thirds', 'Explainers'],
    links: [],
  },
  {
    id: 'design', color: 'var(--teal)',
    title: 'Branding & design', service: 'Graphic Design',
    description: 'Logos, social posts, carousels, posters, thumbnails and print, with one consistent look across everything.',
    chips: ['Logos', 'Posts & carousels', 'Thumbnails', 'Print'],
    links: [{ label: 'More about design', href: '/graphic-design' }],
  },
  {
    id: 'social', color: 'var(--green)',
    title: 'Social media & websites', service: 'Social Media & Page Management',
    description: 'Page management, posting calendars, and fast mobile-first websites that turn visitors into clients.',
    chips: ['Page management', 'Posting calendar', 'Websites', 'Landing pages'],
    links: [
      { label: 'Page management', href: '/instagram-page-management' },
      { label: 'Website design', href: '/website-design' },
    ],
  },
];

const CAPTIONS = ['Stop', 'scrolling.', 'This', 'hook', 'took', '3 sec.'];

function PhoneMock() {
  const ref = useGsap((root) => {
    const cap = root.querySelector('.cap span');
    gsap.to(root.querySelector('.pbar'), { width: '100%', duration: CAPTIONS.length * 1.1, ease: 'none', repeat: -1 });
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % CAPTIONS.length;
      cap.textContent = CAPTIONS[i];
      gsap.fromTo(cap, { scale: 1.25, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(2)' });
    }, 1100);
    gsap.to(root, { y: -24, rotate: -3, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } });
    return () => clearInterval(t);
  });
  return (
    <div ref={ref} className="cf-mini" aria-hidden="true">
      <div className="mb" />
      <div className="cap"><span>{CAPTIONS[0]}</span></div>
      <div className="meta">9:16 · REEL</div>
      <div className="pbar" />
    </div>
  );
}

function ServiceCard({ s, index, onSelectService }) {
  const ref = useGsap((card) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 85%' } });
    tl.fromTo(card, { clipPath: 'inset(100% 0% 0% 0% round 18px)', y: 50 }, { clipPath: 'inset(0% 0% 0% 0% round 18px)', y: 0, duration: 1.1, ease: 'expo.out', delay: (index % 2) * 0.1, clearProps: 'clipPath' })
      .from(card.querySelector('.bar'), { scaleX: 0, duration: 0.9, ease: 'expo.inOut' }, '-=0.8')
      .from(card.querySelectorAll('h3, p'), { y: 24, autoAlpha: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out' }, '-=0.7')
      .from(card.querySelectorAll('.cf-chips li'), { scale: 0.7, autoAlpha: 0, stagger: 0.04, duration: 0.45, ease: 'back.out(1.8)' }, '-=0.5');

    if (!finePointer) return undefined;
    // Gentle 3D tilt toward the mouse
    const move = (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, { rotateY: x * 4, rotateX: -y * 4, transformPerspective: 1200, duration: 0.6, ease: 'power2.out' });
    };
    const leave = () => gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'power3.out' });
    card.addEventListener('mousemove', move);
    card.addEventListener('mouseleave', leave);
    return () => { card.removeEventListener('mousemove', move); card.removeEventListener('mouseleave', leave); };
  });

  const body = (
    <div className="flex flex-col flex-1">
      {/* Tag row is always there (empty if no tag) so titles line up across cards */}
      <div className="flex min-h-[20px]">
        {s.tag && <span className="cf-tag" style={{ background: s.color }}>{s.tag.toUpperCase()}</span>}
      </div>
      <h3>{s.title}</h3>
      <p>{s.description}</p>
      <ul className="cf-chips">{s.chips.map((c) => <li key={c}>{c}</li>)}</ul>
      {s.links.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {s.links.map((l) => (
            <a key={l.href} href={l.href} className="cf-link">{l.label} <ArrowRight className="w-3.5 h-3.5" /></a>
          ))}
        </div>
      )}
      <div className="mt-auto pt-6 flex flex-wrap items-center gap-2.5">
        <button type="button" onClick={() => onSelectService(s.service)} className="cf-btn cf-btn-ghost cf-btn-sm">
          Book a free call
        </button>
        <a
          href={getWhatsAppUrl(`Hi Vaibhav, I'm interested in your ${s.title} service for my brand.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-2 py-2 text-[13px] font-semibold text-[#4ade80] hover:text-[#86efac]"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </a>
      </div>
    </div>
  );

  return (
    <article ref={ref} className={`cf-card ${s.featured ? 'md:col-span-2' : ''}`}>
      <div className="bar" style={{ background: s.color }} />
      {s.featured ? (
        <div className="grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-center flex-1">
          {body}
          <div className="hidden sm:block"><PhoneMock /></div>
        </div>
      ) : body}
    </article>
  );
}

export default function AgencyServices({ onSelectService }) {
  return (
    <section id="services" className="cf-sec">
      <div className="cf-wrap">
        <div className="cf-shead">
          <div>
            <Scramble text="SERVICES" className="cf-idx" />
            <RevealHeading lines={['What we', 'make']} className="cf-wide cf-h2" />
          </div>
          <Reveal as="p">Pick one, or combine them into a monthly plan. Flexible terms, no long lock-ins.</Reveal>
        </div>
        <div className="grid gap-3.5 md:grid-cols-2">
          {SERVICES.map((s, i) => <ServiceCard key={s.id} s={s} index={i} onSelectService={onSelectService} />)}
        </div>
      </div>
    </section>
  );
}
