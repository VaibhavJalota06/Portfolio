import React, { useState, useEffect } from 'react';
import { Save, Settings, Instagram, Globe, Lock, Briefcase } from 'lucide-react';

export default function SettingsPanel({ settings, onSaveSettings }) {
  const [editorName, setEditorName]         = useState('');
  const [heroTagline, setHeroTagline]       = useState('');
  const [showreelUrl, setShowreelUrl]       = useState('');
  const [bioText, setBioText]               = useState('');
  const [locationInfo, setLocationInfo]     = useState('');
  const [contactEmail, setContactEmail]     = useState('');
  const [contactGithub, setContactGithub]   = useState('');
  const [contactVimeo, setContactVimeo]     = useState('');
  const [galleryTitle, setGalleryTitle]     = useState('');
  const [heroLabel, setHeroLabel]           = useState('');
  const [instagramUrl, setInstagramUrl]     = useState('');
  const [behanceUrl, setBehanceUrl]         = useState('');
  const [availableForWork, setAvailableForWork] = useState(false);
  const [adminPin, setAdminPin]             = useState('');
  const [themeAccent, setThemeAccent]       = useState('amber');

  useEffect(() => {
    if (settings) {
      setEditorName(settings.editor_name || '');
      setHeroTagline(settings.hero_tagline || '');
      setShowreelUrl(settings.showreel_url || '');
      setBioText(settings.bio_text || '');
      setLocationInfo(settings.location_info || '');
      setContactEmail(settings.contact_email || '');
      setContactGithub(settings.contact_github || '');
      setContactVimeo(settings.contact_vimeo || '');
      setGalleryTitle(settings.gallery_title || '');
      setHeroLabel(settings.hero_label || '');
      setInstagramUrl(settings.instagram_url || '');
      setBehanceUrl(settings.behance_url || '');
      setAvailableForWork(settings.available_for_work === '1');
      setAdminPin(settings.admin_pin || '');
      setThemeAccent(settings.theme_accent || 'amber');
    }
  }, [settings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings({
      editor_name:       editorName.trim(),
      hero_tagline:      heroTagline.trim(),
      showreel_url:      showreelUrl.trim(),
      bio_text:          bioText.trim(),
      location_info:     locationInfo.trim(),
      contact_email:     contactEmail.trim(),
      contact_github:    contactGithub.trim(),
      contact_vimeo:     contactVimeo.trim(),
      gallery_title:     galleryTitle.trim(),
      hero_label:        heroLabel.trim(),
      instagram_url:     instagramUrl.trim(),
      behance_url:       behanceUrl.trim(),
      available_for_work: availableForWork ? '1' : '0',
      admin_pin:         adminPin.trim(),
      theme_accent:      themeAccent
    });
  };

  const fieldClass = "bg-cinema-black border border-cinema-border rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent transition-colors focus-ring";
  const labelClass = "text-xs font-mono text-cinema-muted";

  return (
    <div className="bg-cinema-card border border-cinema-border rounded-lg p-6 mb-8 relative animate-fade-in">
      <div className="absolute top-0 left-6 transform -translate-y-1/2 bg-cinema-black px-2 border border-cinema-border/60 text-[9px] font-mono text-accent">
        [SYS_META_EDITOR]
      </div>

      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-cinema-border">
        <Settings className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-display font-bold">Website Identity & Settings</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Row 1: Name + Slate Label + Showreel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="editorName" className={labelClass}>EDITOR / DIRECTOR NAME</label>
            <input id="editorName" type="text" value={editorName} onChange={e => setEditorName(e.target.value)}
              placeholder="e.g. ALEX KANE" className={fieldClass} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="heroLabel" className={labelClass}>HERO SLATE LABEL</label>
            <input id="heroLabel" type="text" value={heroLabel} onChange={e => setHeroLabel(e.target.value)}
              placeholder="e.g. [SHOWREEL_EDIT_2026]" className={fieldClass} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="showreelUrl" className={labelClass}>HERO SHOWREEL VIDEO URL (.MP4)</label>
            <input id="showreelUrl" type="text" value={showreelUrl} onChange={e => setShowreelUrl(e.target.value)}
              placeholder="https://path/to/loop.mp4" className={fieldClass} />
          </div>
        </div>

        {/* Row 2: Hero tagline */}
        <div className="flex flex-col gap-2">
          <label htmlFor="heroTagline" className={labelClass}>HERO TAGLINE / OVERVIEW DESCRIPTION</label>
          <textarea id="heroTagline" rows="2" value={heroTagline} onChange={e => setHeroTagline(e.target.value)}
            placeholder="A short subtitle summarizing editing specialties..."
            className={`${fieldClass} resize-none`} />
        </div>

        {/* Row 3: Bio text */}
        <div className="flex flex-col gap-2">
          <label htmlFor="bioText" className={labelClass}>FOOTER BIOGRAPHY / BACKGROUND DETAIL</label>
          <textarea id="bioText" rows="4" value={bioText} onChange={e => setBioText(e.target.value)}
            placeholder="Introduce editing experience, software setups, or workflow approaches..."
            className={fieldClass} />
        </div>

        {/* Row 4: Location + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="locationInfo" className={labelClass}>LOCATION & SPECS LINE</label>
            <input id="locationInfo" type="text" value={locationInfo} onChange={e => setLocationInfo(e.target.value)}
              placeholder="LOCATED: LOS ANGELES, CA • PIPELINE: DAVINCI RESOLVE" className={fieldClass} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="contactEmail" className={labelClass}>CONTACT EMAIL ADDRESS</label>
            <input id="contactEmail" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)}
              placeholder="contact@yourname.com" className={fieldClass} />
          </div>
        </div>

        {/* Row 5: Gallery Title + Available toggle */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-cinema-border/30">
          <div className="md:col-span-2 flex flex-col gap-2">
            <label htmlFor="galleryTitle" className={labelClass}>PORTFOLIO SECTION TITLE <span className="text-cinema-muted/50 normal-case font-sans">(optional)</span></label>
            <input id="galleryTitle" type="text" value={galleryTitle} onChange={e => setGalleryTitle(e.target.value)}
              placeholder="e.g. PORTFOLIO SHOWCASE" className={fieldClass} />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelClass + ' flex items-center gap-1.5'}><Briefcase className="w-3 h-3" /> AVAILABILITY STATUS</label>
            <button type="button" onClick={() => setAvailableForWork(v => !v)}
              className={`h-[42px] flex items-center justify-center gap-2 rounded border text-xs font-mono font-semibold transition-all cursor-pointer focus-ring ${
                availableForWork
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'border-cinema-border text-cinema-muted hover:text-white'
              }`}>
              <span className={`w-2 h-2 rounded-full ${availableForWork ? 'bg-emerald-400 animate-pulse' : 'bg-cinema-muted'}`}></span>
              {availableForWork ? 'AVAILABLE FOR WORK' : 'NOT AVAILABLE'}
            </button>
          </div>
        </div>

        {/* Row 6: Social links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-cinema-border/30">
          <div className="flex flex-col gap-2">
            <label htmlFor="contactGithub" className={labelClass}>GITHUB LINK / PROFILE</label>
            <input id="contactGithub" type="text" value={contactGithub} onChange={e => setContactGithub(e.target.value)}
              placeholder="github.com/yourname" className={fieldClass} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="contactVimeo" className={labelClass}>VIMEO LINK / PROFILE</label>
            <input id="contactVimeo" type="text" value={contactVimeo} onChange={e => setContactVimeo(e.target.value)}
              placeholder="vimeo.com/yourname" className={fieldClass} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="instagramUrl" className={labelClass + ' flex items-center gap-1.5'}><Instagram className="w-3 h-3" /> INSTAGRAM LINK</label>
            <input id="instagramUrl" type="text" value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)}
              placeholder="instagram.com/yourname" className={fieldClass} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="behanceUrl" className={labelClass + ' flex items-center gap-1.5'}><Globe className="w-3 h-3" /> BEHANCE LINK</label>
            <input id="behanceUrl" type="text" value={behanceUrl} onChange={e => setBehanceUrl(e.target.value)}
              placeholder="behance.net/yourname" className={fieldClass} />
          </div>
        </div>

        {/* Row 7: Admin PIN + Theme Accent */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-cinema-border/30">
          <div className="flex flex-col gap-2 max-w-xs">
            <label htmlFor="adminPin" className={labelClass + ' flex items-center gap-1.5'}><Lock className="w-3 h-3" /> ADMIN PIN <span className="text-cinema-muted/50 normal-case font-sans">(leave blank = no lock)</span></label>
            <input id="adminPin" type="password" value={adminPin} onChange={e => setAdminPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="e.g. 1234" maxLength={6}
              className={fieldClass + ' tracking-widest text-center text-lg'} />
            <p className="text-[10px] text-cinema-muted font-mono">Set a numeric PIN to protect the #studio admin panel. Leave blank for open access.</p>
          </div>
          <div className="flex flex-col gap-2 max-w-xs">
            <label htmlFor="themeAccent" className={labelClass + ' flex items-center gap-1.5'}><Globe className="w-3 h-3" /> CINEMATIC ACCENT THEME</label>
            <select id="themeAccent" value={themeAccent} onChange={e => setThemeAccent(e.target.value)}
              className={fieldClass + ' cursor-pointer'}>
              <option value="amber">Classic Amber (Warm Cinema)</option>
              <option value="green">Emerald Green (Matrix Grade)</option>
              <option value="cyan">Cyber Cyan (Neo-Noir Grade)</option>
              <option value="red">Hollywood Red (Technicolor Grade)</option>
            </select>
            <p className="text-[10px] text-cinema-muted font-mono">Select a color grading look for your borders, active buttons, and visual highlights.</p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2 border-t border-cinema-border/50">
          <button type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-cinema-black font-semibold rounded text-sm transition-colors focus-ring cursor-pointer">
            <Save className="w-4 h-4" />
            Save Identity Settings
          </button>
        </div>
      </form>
    </div>
  );
}
