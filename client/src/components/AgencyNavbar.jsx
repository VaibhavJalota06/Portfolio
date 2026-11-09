import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { scrollToHash } from '../motion';

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Post-Production', href: '/post-production/' },
  { label: 'Process', href: '#process' },
  { label: 'About', href: '#about' },
  { label: 'Apps', href: '/apps/' },
  { label: 'FAQ', href: '#faq' },
];

export default function AgencyNavbar({ onOpenDiscovery }) {
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastY = useRef(0);

  // Hide while scrolling down, show again when scrolling up (with a dead-zone so it never flickers).
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY.current;
      if (y < 300) { setHidden(false); lastY.current = y; return; }
      // A single huge move is a jump to a section (e.g. arriving via /#faq), not the visitor scrolling: keep the bar.
      if (Math.abs(dy) > 400) { lastY.current = y; return; }
      if (dy > 12) { setHidden(true); lastY.current = y; }
      else if (dy < -12) { setHidden(false); lastY.current = y; }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // In-page anchors smooth-scroll; if the section isn't on this page (e.g. a policy page)
  // the browser follows the hash normally and the app switches back to the homepage.
  const onLink = (e, href) => {
    setMobileMenuOpen(false);
    if (href.startsWith('#') && scrollToHash(href)) e.preventDefault();
  };

  const goHome = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (window.location.hash) window.location.hash = '';
    window.scrollTo({ top: 0 });
  };

  return (
    <header className={`cf-header ${hidden && !mobileMenuOpen ? 'is-hidden' : ''}`}>
      <div className="cf-wrap flex items-center justify-between h-16 gap-4">
        <a href="#" onClick={goHome} className="flex items-center gap-2.5 shrink-0" aria-label="Cutframe Studio home">
          <span className="cf-logo-mark">C</span>
          <span className="cf-logo-text">CUTFRAME <span>STUDIO</span></span>
        </a>

        <nav className="hidden lg:flex items-center" aria-label="Main">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} onClick={(e) => onLink(e, l.href)} className="cf-navlink">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button type="button" onClick={onOpenDiscovery} className="cf-btn cf-btn-red cf-btn-sm">
            <span className="hidden sm:inline">Book a free call</span>
            <span className="sm:hidden">Book call</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 grid place-items-center rounded-lg border border-[#23232c] text-white cursor-pointer"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#23232c] bg-[#08080b] animate-fade-in">
          <nav className="cf-wrap py-2 flex flex-col" aria-label="Mobile">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => onLink(e, l.href)}
                className="flex items-center justify-between py-3.5 border-b border-[#1b1b22] text-[15px] font-medium text-[#e4e4ea] hover:text-white"
              >
                {l.label}
                <ArrowUpRight className="w-4 h-4 text-[#6b6b78]" />
              </a>
            ))}
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onOpenDiscovery(); }}
              className="cf-btn cf-btn-red mt-4 mb-3 w-full"
            >
              Book a free call
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
