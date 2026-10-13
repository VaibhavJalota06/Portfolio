import React, { useState, useEffect } from 'react';
import { Film, Calendar, Menu, X, ChevronRight } from 'lucide-react';

export default function AgencyNavbar({ onOpenDiscovery }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'The Difference', href: '#difference' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-white/95 backdrop-blur-md border-b border-slate-200 ${
        isScrolled ? 'shadow-sm py-3' : 'py-3.5 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Agency Logo */}
          <a
            href="#"
            className="flex items-center gap-2.5 group transition-transform active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5 font-display">
                Cutframe <span className="text-blue-600 font-semibold">Studio</span>
              </span>
              <span className="text-[10px] font-mono font-medium tracking-wider text-slate-500 uppercase -mt-0.5">
                Video &amp; Creative Studio
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 xl:px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 transition-all duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenDiscovery}
              className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Free Call</span>
            </button>

          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={onOpenDiscovery}
              className="sm:hidden px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-semibold shadow-sm active:scale-[0.98]"
            >
              Book Call
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            ))}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between px-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDiscovery();
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-md active:scale-[0.98] text-center"
              >
                Book a Discovery Call
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
