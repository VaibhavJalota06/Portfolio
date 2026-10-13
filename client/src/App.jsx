import React, { useState, useEffect, useRef } from 'react';
import { Film, Eye, Mail, Lock, X, ChevronLeft, ChevronRight, Trash2, MessageCircle, Instagram, Linkedin } from 'lucide-react';
import Toast from './components/Toast';
import AdminPanel from './components/AdminPanel';
import SettingsPanel from './components/SettingsPanel';
import PortfolioGrid from './components/PortfolioGrid';
import AgencyNavbar from './components/AgencyNavbar';
import AgencyHero from './components/AgencyHero';
import AgencyMarqueeStats from './components/AgencyMarqueeStats';
import AgencyServices from './components/AgencyServices';
import AgencyAbout from './components/AgencyAbout';
import { CONTACT, getWhatsAppUrl } from './contact';
import BeforeAfterShowcase from './components/BeforeAfterShowcase';
import AgencyFAQ from './components/AgencyFAQ';
import DiscoveryModal from './components/DiscoveryModal';
import GooglePanel from './components/GooglePanel';
import LegalPolicies from './components/LegalPolicies';
import { getMediaInfo, isEmbedType, isVideoItem } from './utils/media';

// Private admin link: not linked anywhere on the public site. Protected by the admin PIN as well.
const ADMIN_HASH = '#cutframe-admin';

export default function App() {
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [items, setItems] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeLightboxItem, setActiveLightboxItem] = useState(null);
  const [legalTab, setLegalTab] = useState('');
  const lightboxVideoRef = useRef(null);
  const [isLightboxLooping, setIsLightboxLooping] = useState(false);
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem('portfolio_settings');
      return cached ? JSON.parse(cached) : null;
    } catch { return null; }
  });
  const [adminGridTab, setAdminGridTab] = useState('edit');
  const [adminTypeFilter, setAdminTypeFilter] = useState('all');
  const [activeGalleryTab, setActiveGalleryTab] = useState('all');
  const [activeTagFilter, setActiveTagFilter] = useState(''); // tag name string

  // PIN protection
  const [pinVerified, setPinVerified] = useState(() => sessionStorage.getItem('admin_verified') === '1');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinChecking, setPinChecking] = useState(false);



  // Custom delete confirmation modal state
  const [itemToDelete, setItemToDelete] = useState(null);

  // Client messages
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Fetch settings and manage secret hash-based admin routing on mount
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const legalHashes = ['#privacy', '#terms', '#refund', '#grievance'];
      if (legalHashes.includes(hash)) {
        setLegalTab(hash.replace('#', ''));
        window.scrollTo(0, 0);
      } else {
        setLegalTab('');
      }
      if (hash === ADMIN_HASH) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        if (hash === '#videos') setActiveGalleryTab('videos');
        else if (hash === '#photos') setActiveGalleryTab('photos');
        else setActiveGalleryTab('all');
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run once on load
    fetchSettings();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Smooth Scroll-Reveal Observer (elements animate in smoothly and stay visible)
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      {
        threshold: 0.02,
        rootMargin: '0px 0px 100px 0px'
      }
    );

    const observeAll = () => {
      document.querySelectorAll('.scroll-reveal').forEach((el) => {
        const rect = el.getBoundingClientRect();
        // If already in viewport on load, reveal immediately
        if (rect.top < window.innerHeight) {
          el.classList.add('revealed');
        }
        observer.observe(el);
      });
    };

    observeAll();

    const mutationObserver = new MutationObserver(() => {
      observeAll();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  // Synchronize portfolio items based on user view (admin vs public) and login status
  useEffect(() => {
    if (isAdmin && (pinVerified || (settings && !settings.has_admin_pin))) {
      fetchItems(true);
    } else if (!isAdmin) {
      fetchItems(false);
    }
  }, [isAdmin, pinVerified, settings]);

  // Inject OG / Twitter meta tags, Google Analytics 4 & Search Console dynamically
  useEffect(() => {
    const name = settings?.editor_name || 'Cutframe Studio';
    const desc = settings?.hero_tagline || 'High-retention video editing, shorts, reels and content management for brands, businesses and creators.';
    const setMeta = (prop, content, attr = 'property') => {
      let el = document.querySelector(`meta[${attr}="${prop}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, prop); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    document.title = `${name} | High-Retention Video & Content Studio`;
    setMeta('og:title', `${name} | We help brands scale across platforms`);
    setMeta('og:description', desc);
    setMeta('og:type', 'website');
    setMeta('twitter:card', 'summary_large_image', 'name');
    setMeta('twitter:title', `${name} | We help brands scale across platforms`, 'name');
    setMeta('twitter:description', desc, 'name');

    // Google Search Console Verification
    if (settings?.google_site_verification) {
      let token = settings.google_site_verification.trim();
      // If user pasted whole tag <meta name="google-site-verification" content="..." />
      const match = token.match(/content=["']([^"']+)["']/i);
      if (match) token = match[1];
      setMeta('google-site-verification', token, 'name');
    }

    // Google Analytics 4 (gtag.js)
    const gaId = settings?.ga_measurement_id?.trim();
    if (gaId && /^G-[A-Z0-9]+$/i.test(gaId)) {
      if (!document.getElementById('ga-script')) {
        const script = document.createElement('script');
        script.id = 'ga-script';
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
        document.head.appendChild(script);

        const inlineScript = document.createElement('script');
        inlineScript.id = 'ga-init-script';
        inlineScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { send_page_view: true });
        `;
        document.head.appendChild(inlineScript);
      }
    }
  }, [settings]);

  // PIN verify function
  const handleVerifyPin = async () => {
    setPinChecking(true);
    setPinError('');
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput })
      });
      const data = await res.json();
      if (data.ok) {
        sessionStorage.setItem('admin_verified', '1');
        sessionStorage.setItem('admin_pin', pinInput);
        setPinVerified(true);
      } else {
        setPinError(data.error || 'Incorrect PIN. Try again.');
        setPinInput('');
      }
    } catch {
      setPinError('Connection error. Please try again.');
    } finally {
      setPinChecking(false);
    }
  };

  const getAdminHeaders = (extraHeaders = {}) => {
    const pin = sessionStorage.getItem('admin_pin') || '';
    return {
      ...extraHeaders,
      ...(pin ? { 'x-admin-pin': pin } : {})
    };
  };

  // Inject CSS accent theme variables dynamically based on settings
  useEffect(() => {
    const accent = settings?.theme_accent || 'blue';
    const palettes = {
      blue:  { base: '#2563EB', hover: '#1D4ED8', dark: '#1E40AF', light: '#3B82F6' },
      amber: { base: '#ff9f1c', hover: '#e58f13', dark: '#cc7f10', light: '#ffb347' },
      green: { base: '#10b981', hover: '#059669', dark: '#047857', light: '#34d399' },
      cyan:  { base: '#06b6d4', hover: '#0891b2', dark: '#0e7490', light: '#22d3ee' },
      red:   { base: '#ef4444', hover: '#dc2626', dark: '#b91c1c', light: '#f87171' }
    };
    const colors = palettes[accent] || palettes.blue;
    document.documentElement.style.setProperty('--color-accent', colors.base);
    document.documentElement.style.setProperty('--color-accent-hover', colors.hover);
    document.documentElement.style.setProperty('--color-accent-dark', colors.dark);
    document.documentElement.style.setProperty('--color-accent-light', colors.light);
  }, [settings]);

  // Fetch client messages for inbox
  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      const res = await fetch('/api/contact?admin=1', { headers: getAdminHeaders() });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE', headers: getAdminHeaders() });
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== id));
        showToast('Message deleted successfully');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete message', 'error');
    }
  };

  // Automatically fetch messages when entering admin workspace and authenticated
  useEffect(() => {
    if (isAdmin && (pinVerified || (settings && !settings.has_admin_pin))) {
      fetchMessages();
    }
  }, [isAdmin, pinVerified, settings]);

  // Lightbox arrow navigation
  const navigateLightbox = (direction) => {
    if (!activeLightboxItem) return;
    const VIDEO_TYPES = ['youtube', 'vimeo', 'mp4', 'gdrive'];
    const filtered = activeGalleryTab === 'videos'
      ? items.filter(i => VIDEO_TYPES.includes(i.type))
      : activeGalleryTab === 'photos'
        ? items.filter(i => i.type === 'image')
        : items;
    const visible = activeTagFilter
      ? filtered.filter(i => Array.isArray(i.tags) && i.tags.includes(activeTagFilter))
      : filtered;

    const idx = visible.findIndex(item => item.id === activeLightboxItem.id);
    if (idx === -1) return;

    if (direction === 'next') {
      const nextIdx = (idx + 1) % visible.length;
      setActiveLightboxItem(visible[nextIdx]);
    } else if (direction === 'prev') {
      const prevIdx = (idx - 1 + visible.length) % visible.length;
      setActiveLightboxItem(visible[prevIdx]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeLightboxItem) return;
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
      }

      if (e.key === 'Escape') setActiveLightboxItem(null);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') navigateLightbox('next');
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') navigateLightbox('prev');

      // Video playback controls
      const video = lightboxVideoRef.current;
      if (video) {
        if (e.key === 'k' || e.key === 'K' || e.key === ' ') {
          if (video.paused) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
        if (e.key === 'l' || e.key === 'L') {
          video.currentTime = Math.min(video.currentTime + 5, video.duration || 0);
        }
        if (e.key === 'j' || e.key === 'J') {
          video.currentTime = Math.max(video.currentTime - 5, 0);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxItem, items, activeGalleryTab, activeTagFilter]);

  const fetchItems = async (forAdmin = false) => {
    try {
      const res = await fetch(forAdmin ? '/api/items?admin=1' : '/api/items', {
        headers: forAdmin ? getAdminHeaders() : {}
      });
      if (!res.ok) throw new Error('Failed to load portfolio items');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
      showToast('Error loading portfolio items', 'error');
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Failed to load settings');
      const data = await res.json();
      setSettings(data);
      try { localStorage.setItem('portfolio_settings', JSON.stringify(data)); } catch {}
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  const handleSaveSettings = async (updatedSettings) => {
    const { admin_pin: _pin, ...visible } = updatedSettings; // the PIN never lives in client state
    const next = { ...settings, ...visible, has_admin_pin: (settings?.has_admin_pin || updatedSettings.admin_pin) ? '1' : '' };
    setSettings(next);
    try { localStorage.setItem('portfolio_settings', JSON.stringify(next)); } catch {}

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(updatedSettings)
      });
      if (res.ok) {
        showToast('Website identity settings updated');
      } else if (res.status === 401) {
        showToast('Theme updated locally (Admin PIN required for global default)', 'info');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      showToast('Settings saved locally', 'info');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Create or Update portfolio item
  const handleSaveItem = async (itemData) => {
    const isEditing = !!itemData.id;
    const url = isEditing ? `/api/items/${itemData.id}` : '/api/items';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(itemData),
      });

      if (!res.ok) throw new Error('Failed to save item');
      const savedItem = await res.json();

      if (isEditing) {
        setItems(prev => prev.map(item => item.id === savedItem.id ? savedItem : item));
        showToast('Project updated successfully');
      } else {
        setItems(prev => [...prev, savedItem]);
        showToast('Project added to bento layout');
      }
      setEditingItem(null);
    } catch (err) {
      console.error(err);
      showToast('Failed to save project', 'error');
    }
  };

  // Delete portfolio item with confirmation and immediate backend execution
  // Open custom delete confirmation modal
  const handleDeleteItem = (id) => {
    const toDelete = items.find(item => item.id === id);
    if (toDelete) {
      setItemToDelete(toDelete);
    }
  };

  // Resize a tile directly from its admin overlay (optimistic update)
  const handleResizeItem = async (id, newSize) => {
    const previousItems = [...items];
    const targetItem = items.find(item => item.id === id);
    if (!targetItem) return;

    // Optimistic resize
    const updatedItem = { ...targetItem, size: newSize };
    setItems(prev => prev.map(item => item.id === id ? updatedItem : item));

    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(updatedItem)
      });
      if (!res.ok) throw new Error('Failed to resize item');
      showToast(`Tile size changed to ${newSize}`);
    } catch (err) {
      console.error(err);
      setItems(previousItems);
      showToast('Failed to resize tile', 'error');
    }
  };

  // Hide / show a project on the public site (optimistic update)
  const handleTogglePublish = async (id) => {
    const target = items.find(item => item.id === id);
    if (!target) return;
    const updated = { ...target, is_published: !target.is_published };
    setItems(prev => prev.map(item => item.id === id ? updated : item));
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(updated)
      });
      if (!res.ok) throw new Error();
      showToast(updated.is_published ? 'Visible on the website again' : 'Hidden from the website');
    } catch {
      setItems(prev => prev.map(item => item.id === id ? target : item));
      showToast('Could not change visibility', 'error');
    }
  };

  // Reorder callback from @dnd-kit (optimistic update)
  const handleReorderItems = async (reorderedItems) => {
    const previousItems = [...items];
    setItems(reorderedItems); // Update state instantly

    try {
      const res = await fetch('/api/items/reorder', {
        method: 'PATCH',
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          ids: reorderedItems.map(item => item.id)
        })
      });
      if (!res.ok) throw new Error('Failed to reorder items');
      showToast('Layout order updated and saved');
    } catch (err) {
      console.error(err);
      setItems(previousItems);
      showToast('Failed to save layout order', 'error');
    }
  };

  return (
    <div className={`relative min-h-screen ${isAdmin ? 'cinema-dark bg-cinema-black' : 'bg-white text-slate-900'}`}>

      {/* Cinematic Custom Delete Confirmation Modal */}
      {itemToDelete && (
        <div 
          className="cinema-dark fixed inset-0 z-[60] flex items-center justify-center p-4 bg-cinema-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setItemToDelete(null)}
        >
          <div 
            className="relative w-full max-w-sm bg-cinema-card border border-cinema-border rounded-xl p-8 text-center shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative top accent bar */}
            <div className="h-1 w-full absolute top-0 left-0 bg-red-600" />
            <h2 className="text-lg font-display font-bold mb-2 uppercase tracking-wide text-white">Delete Project?</h2>
            <p className="text-xs text-cinema-muted mb-6 font-mono leading-relaxed">
              Are you sure you want to delete <span className="text-red-400 font-bold">"{itemToDelete.title || 'this project'}"</span>? This will permanently remove it from the timeline.
            </p>
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 border border-cinema-border text-cinema-muted hover:text-white rounded font-mono text-[10px] font-semibold tracking-wider cursor-pointer transition-colors focus-ring"
              >
                CANCEL
              </button>
              <button 
                type="button"
                id="btn-confirm-delete"
                onClick={async () => {
                  const id = itemToDelete.id;
                  setItemToDelete(null);
                  const previousItems = [...items];
                  setItems(prev => prev.filter(item => item.id !== id));
                  try {
                    const res = await fetch(`/api/items/${id}`, { method: 'DELETE', headers: getAdminHeaders() });
                    if (!res.ok) throw new Error('Failed to delete item');
                    showToast('Project deleted successfully');
                  } catch (err) {
                    console.error(err);
                    setItems(previousItems);
                    showToast('Failed to delete project', 'error');
                  }
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded font-mono text-[10px] font-semibold tracking-wider cursor-pointer transition-colors focus-ring"
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={4000}
        />
      )}

      {/* Admin PIN Lock Screen */}
      {isAdmin && settings?.has_admin_pin && !pinVerified && (
        <div className="cinema-dark fixed inset-0 z-[60] bg-cinema-black flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-cinema-card border border-cinema-border rounded-xl p-8 text-center">
            <Lock className="w-10 h-10 text-accent mx-auto mb-4" />
            <h2 className="text-lg font-display font-bold mb-1">Admin Access</h2>
            <p className="text-xs text-cinema-muted mb-6 font-mono">Enter your PIN to continue</p>
            <input
              type="password" inputMode="numeric" maxLength={6}
              value={pinInput} onChange={e => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onKeyDown={e => e.key === 'Enter' && handleVerifyPin()}
              placeholder="••••"
              className="w-full bg-cinema-black border border-cinema-border rounded px-4 py-3 text-center text-2xl tracking-[0.5em] text-white focus:outline-none focus:border-accent mb-4"
              autoFocus
            />
            {pinError && <p className="text-red-400 text-xs font-mono mb-4">{pinError}</p>}
            <button onClick={handleVerifyPin} disabled={pinChecking || !pinInput}
              className="w-full py-3 bg-accent hover:bg-accent-hover text-cinema-black font-bold rounded transition-colors disabled:opacity-50 cursor-pointer">
              {pinChecking ? 'Verifying...' : 'Enter Studio'}
            </button>
            <a href="#" onClick={() => window.location.hash = ''}
              className="block mt-4 text-xs text-cinema-muted hover:text-white transition-colors cursor-pointer">
              ← Back to Portfolio
            </a>
          </div>
        </div>
      )}






      {isAdmin ? (
        <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-3">
            <Film className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-sm text-white font-display">
              Cutframe Studio <span className="text-blue-400 font-mono text-xs">/ Admin Portal</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => { window.location.hash = ''; }}
            className="flex items-center gap-2 px-4 py-1.5 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded text-xs font-mono font-medium transition-all focus-ring cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            BACK TO PORTFOLIO
          </button>
        </header>
      ) : (
        <AgencyNavbar
          onOpenDiscovery={() => setShowDiscoveryModal(true)}
        />
      )}
      {isAdmin ? (
        /* --- DEDICATED FULLSCREEN ADMIN WORKSPACE --- */
        <main className="max-w-7xl mx-auto px-6 py-12 animate-fade-in flex flex-col gap-8">
          {/* Workspace Title & Stats Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-cinema-border gap-4">
            <div>
              <div className="text-accent font-mono text-xs tracking-wider mb-1 uppercase">
                [SYSTEM_TIMELINE_ADMIN]
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-white">
                PROJECT TIMELINE DASHBOARD
              </h1>
            </div>
            
            {/* Real-time split counts */}
            <div className="flex flex-wrap gap-3 font-mono text-[10px] text-cinema-muted">
              <div className="bg-cinema-card border border-cinema-border px-3 py-1.5 rounded flex gap-2">
                TOTAL: <span className="text-accent font-bold">{items.length} CLIPS</span>
              </div>
              <div className="bg-cinema-card border border-cinema-border px-3 py-1.5 rounded flex gap-2">
                YT: <span className="text-red-400 font-bold">{items.filter(i => i.type === 'youtube').length}</span>
              </div>
              <div className="bg-cinema-card border border-cinema-border px-3 py-1.5 rounded flex gap-2">
                VM: <span className="text-blue-400 font-bold">{items.filter(i => i.type === 'vimeo').length}</span>
              </div>
              <div className="bg-cinema-card border border-cinema-border px-3 py-1.5 rounded flex gap-2">
                MP4: <span className="text-accent font-bold">{items.filter(i => i.type === 'mp4').length}</span>
              </div>
              <div className="bg-cinema-card border border-cinema-border px-3 py-1.5 rounded flex gap-2">
                IMG: <span className="text-emerald-400 font-bold">{items.filter(i => i.type === 'image').length}</span>
              </div>
            </div>
          </div>

          {/* Admin panel item creation/updating form */}
          <AdminPanel
            onSave={handleSaveItem}
            editingItem={editingItem}
            onCancelEdit={() => setEditingItem(null)}
          />

          {/* Google Calendar + Drive connection */}
          <GooglePanel showToast={showToast} onSynced={() => fetchItems(true)} />

          {/* Website settings panel */}
          <SettingsPanel
            settings={settings}
            onSaveSettings={handleSaveSettings}
          />

          {/* Portfolio grid edit space */}
          <div className="mt-10">
            {/* Top bar: Layout/Preview tabs + Type filter + hint */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cinema-border/50 pb-3 mb-6 gap-3">
              {/* Left: Edit / Preview / Inbox tabs */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setAdminGridTab('edit')}
                  className={`text-xs font-mono font-medium pb-2 border-b-2 transition-all cursor-pointer focus-ring ${
                    adminGridTab === 'edit'
                      ? 'border-accent text-accent'
                      : 'border-transparent text-cinema-muted hover:text-white'
                  }`}
                >
                  [LAYOUT_EDITOR]
                </button>
                <button
                  type="button"
                  onClick={() => setAdminGridTab('preview')}
                  className={`text-xs font-mono font-medium pb-2 border-b-2 transition-all cursor-pointer focus-ring ${
                    adminGridTab === 'preview'
                      ? 'border-accent text-accent'
                      : 'border-transparent text-cinema-muted hover:text-white'
                  }`}
                >
                  [LIVE_PREVIEW]
                </button>
                <button
                  type="button"
                  onClick={() => setAdminGridTab('inbox')}
                  className={`text-xs font-mono font-medium pb-2 border-b-2 transition-all cursor-pointer focus-ring ${
                    adminGridTab === 'inbox'
                      ? 'border-accent text-accent'
                      : 'border-transparent text-cinema-muted hover:text-white'
                  }`}
                >
                  [CLIENT_INBOX] {messages.length > 0 && <span className="text-red-400 font-bold ml-1">({messages.length})</span>}
                </button>
              </div>

              {/* Right: Type filter pills */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cinema-muted uppercase mr-1">Filter:</span>
                {[
                  { id: 'all',    label: 'All',    count: items.length },
                  { id: 'videos', label: 'Videos', count: items.filter(i => ['youtube','vimeo','mp4','gdrive'].includes(i.type)).length },
                  { id: 'photos', label: 'Photos', count: items.filter(i => i.type === 'image').length },
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setAdminTypeFilter(f.id)}
                    className={`px-3 py-1 rounded text-[10px] font-mono font-semibold tracking-wide transition-all cursor-pointer focus-ring ${
                      adminTypeFilter === f.id
                        ? 'bg-accent text-cinema-black'
                        : 'border border-cinema-border text-cinema-muted hover:text-white'
                    }`}
                  >
                    {f.label} <span className="opacity-60">({f.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Empty state when filter yields nothing */}
            {(() => {
              const VIDEO_TYPES = ['youtube', 'vimeo', 'mp4', 'gdrive'];
              const adminFiltered = adminTypeFilter === 'videos'
                ? items.filter(i => VIDEO_TYPES.includes(i.type))
                : adminTypeFilter === 'photos'
                  ? items.filter(i => i.type === 'image')
                  : items;

              if (adminGridTab === 'inbox') {
                return (
                  <div className="bg-cinema-card border border-cinema-border rounded-lg p-6 animate-fade-in flex flex-col gap-4">
                    <div className="flex items-center justify-between pb-3 border-b border-cinema-border/50">
                      <h2 className="text-sm font-mono text-cinema-muted uppercase">Client Messages / Inquiries</h2>
                      <button onClick={fetchMessages} disabled={messagesLoading}
                        className="text-[10px] font-mono border border-cinema-border hover:border-accent/40 text-cinema-muted hover:text-white px-2.5 py-1 rounded transition-colors cursor-pointer focus-ring">
                        {messagesLoading ? 'REFRESHING...' : 'REFRESH LIST'}
                      </button>
                    </div>
                    {messages.length === 0 ? (
                      <div className="text-center py-12 text-cinema-muted font-mono text-xs">
                        [ NO MESSAGES RECEIVED ]
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2">
                        {messages.map(msg => (
                          <div key={msg.id} className="bg-cinema-black border border-cinema-border/60 hover:border-cinema-border rounded p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-colors">
                            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                              <div className="flex items-center flex-wrap gap-2 text-xs">
                                <span className="font-bold text-white">{msg.name}</span>
                                <a href={`mailto:${msg.email}`} className="text-accent hover:underline font-mono text-[10px] truncate">{msg.email}</a>
                                <span className="text-[9px] text-cinema-muted font-mono ml-auto">
                                  {new Date(msg.created_at).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-xs text-cinema-muted whitespace-pre-wrap leading-relaxed">
                                {msg.message}
                              </p>
                            </div>
                            <button onClick={() => handleDeleteMessage(msg.id)}
                              className="self-end sm:self-start p-1.5 bg-red-950/45 hover:bg-red-600 border border-red-900/30 text-red-200 hover:text-white rounded transition-colors cursor-pointer focus-ring"
                              title="Delete Message">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (adminFiltered.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-20 text-cinema-muted border border-dashed border-cinema-border/50 rounded-lg">
                    <div className="text-4xl mb-3 opacity-20">{adminTypeFilter === 'videos' ? '🎬' : adminTypeFilter === 'photos' ? '🖼' : '📂'}</div>
                    <p className="text-xs font-mono tracking-wider uppercase">No {adminTypeFilter === 'all' ? 'items' : adminTypeFilter} yet — add one above</p>
                  </div>
                );
              }

              return adminGridTab === 'edit' ? (
                <PortfolioGrid
                  items={adminFiltered}
                  isAdmin={true}
                  onEdit={(item) => {
                    setEditingItem(item);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onDelete={handleDeleteItem}
                  onResize={handleResizeItem}
                  onReorder={handleReorderItems}
                  onTogglePublish={handleTogglePublish}
                />
              ) : (
                <PortfolioGrid
                  items={adminFiltered}
                  isAdmin={false}
                  onClickTile={setActiveLightboxItem}
                />
              );
            })()}
          </div>
        </main>
      ) : (
        /* --- PUBLIC CINEMATIC PORTFOLIO VIEW --- */
        (() => {
          // Derive filtered items based on active gallery tab
          const VIDEO_TYPES = ['youtube', 'vimeo', 'mp4', 'gdrive'];
          const filteredItems = activeGalleryTab === 'videos'
            ? items.filter(i => VIDEO_TYPES.includes(i.type))
            : activeGalleryTab === 'photos'
              ? items.filter(i => i.type === 'image')
              : items;

          return (
            <>
              {legalTab ? <LegalPolicies initialTab={legalTab} /> : <>
              {/* 1. Agency Hero */}
              <AgencyHero onOpenDiscovery={() => { setSelectedService(''); setShowDiscoveryModal(true); }} />

              {/* 2. Kinetic Infinite Marquee & Live Stats Strip */}
              <AgencyMarqueeStats />

              {/* 3. Agency Video Showcase Matrix */}
              <section id="work" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {/* Section Title */}
                  <div className="text-center max-w-3xl mx-auto mb-10 scroll-reveal">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-4">
                      <Film className="w-3.5 h-3.5 text-blue-600" />
                      Our Work
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
                      Reels, posts &amp; designs <span className="text-blue-600">we&apos;ve made</span>
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-slate-600">
                      Real work for brands, businesses, and creators. Filter by category and tap any piece to watch or view it in full.
                    </p>
                  </div>

                  {/* Agency Category filter row */}
                  {(() => {
                    // Core agency categories first, then any other categories the work actually uses
                    // (e.g. Drive sub-folders like "Photoshop Projects"). Empty categories are hidden.
                    const core = ['AI Videos', 'Short-Form / Reels', 'YouTube Long-Form', 'Ad Creatives', 'Thumbnails & Packaging'];
                    const used = new Set(items.flatMap(i => Array.isArray(i.tags) ? i.tags : []));
                    const agencyCategories = ['All Work', ...core.filter(c => used.has(c)), ...[...used].filter(t => !core.includes(t)).sort()];

                    return (
                      <div className="flex flex-wrap gap-2.5 mb-8 scroll-reveal stagger-1">
                        {agencyCategories.map(cat => {
                          const isAll = cat === 'All Work';
                          const isSelected = isAll ? !activeTagFilter : activeTagFilter === cat;

                          return (
                            <button 
                              key={cat} 
                              onClick={() => setActiveTagFilter(isAll ? '' : (activeTagFilter === cat ? '' : cat))}
                              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-normal transition-all duration-150 cursor-pointer border active:scale-[0.98] ${
                                isSelected 
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                              }`}>
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Filtered Bento Grid */}
                  {(() => {
                    const tagFiltered = activeTagFilter
                      ? filteredItems.filter(i => Array.isArray(i.tags) && i.tags.includes(activeTagFilter))
                      : filteredItems;
                    
                    return tagFiltered.length > 0 ? (
                      <PortfolioGrid
                        key={activeGalleryTab + activeTagFilter}
                        items={tagFiltered}
                        isAdmin={false}
                        onClickTile={setActiveLightboxItem}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-slate-500 border border-dashed border-slate-200 rounded-2xl bg-slate-50 text-center">
                        <p className="text-sm text-slate-900 font-semibold mb-1">New {activeTagFilter || 'work'} coming soon</p>
                        <p className="text-xs text-slate-500 max-w-sm">We&apos;re adding fresh projects to this category. Explore the rest of our work in the meantime.</p>
                        <button
                          onClick={() => setActiveTagFilter('')}
                          className="mt-4 px-4 py-2 bg-white border border-slate-200 hover:border-blue-500 text-blue-600 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                        >
                          View All Work
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </section>

              {/* About the studio and how working together works */}
              <AgencyAbout />

              {/* Before vs After editing transformation showcase */}
              <BeforeAfterShowcase onOpenDiscovery={() => {
                setSelectedService('');
                setShowDiscoveryModal(true);
              }} />

              {/* 4. Agency Capabilities & Services */}
              <AgencyServices onSelectService={(serviceTitle) => {
                setSelectedService(serviceTitle);
                setShowDiscoveryModal(true);
              }} />

              {/* 7. Frequently Asked Questions */}
              <AgencyFAQ />

              </>}

              {/* 8. Sleek Ultra-Compact Single-Row Horizontal Footer */}
              <footer className="bg-slate-900 text-white py-5 px-6 border-t border-slate-800">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                  
                  {/* Left: Brand & Copyright */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white shadow-xs">
                        <Film className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-sm font-bold tracking-tight text-white font-display">
                        Cutframe <span className="text-blue-400">Studio</span>
                      </span>
                    </div>
                    <span className="text-slate-700">|</span>
                    <span className="text-slate-500 text-[11px]">© {new Date().getFullYear()}</span>
                  </div>

                  {/* Center: Inline Navigation & Legal Policies */}
                  <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] sm:text-xs font-medium">
                    <a href="#work" className="hover:text-white transition-colors">Work</a>
                    <span className="text-slate-700">·</span>
                    <a href="#difference" className="hover:text-white transition-colors">The Difference</a>
                    <span className="text-slate-700">·</span>
                    <a href="#services" className="hover:text-white transition-colors">Services</a>
                    <span className="text-slate-700">·</span>
                    <a href="#about" className="hover:text-white transition-colors">About</a>
                    <span className="text-slate-700">·</span>
                    <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                    <span className="text-slate-700 mx-1">|</span>
                    <a href="#privacy" className="text-slate-400 hover:text-blue-400 transition-colors">Privacy</a>
                    <span className="text-slate-700">·</span>
                    <a href="#terms" className="text-slate-400 hover:text-blue-400 transition-colors">Terms</a>
                    <span className="text-slate-700">·</span>
                    <a href="#refund" className="text-slate-400 hover:text-blue-400 transition-colors">Refunds</a>
                    <span className="text-slate-700">·</span>
                    <a href="#grievance" className="text-slate-400 hover:text-blue-400 transition-colors">Grievance</a>
                  </div>

                  {/* Right: Direct Contact & Social Links */}
                  <div className="flex items-center gap-3.5 text-[11px] sm:text-xs font-medium">
                    <a
                      href={CONTACT.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
                      title="Chat on WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={CONTACT.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-pink-400 hover:text-pink-300 transition-colors"
                      title="Follow on Instagram"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      <span>Instagram</span>
                    </a>
                    <a
                      href={CONTACT.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors"
                      title="Connect on LinkedIn"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>LinkedIn</span>
                    </a>
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                      title="Send email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </a>
                  </div>

                </div>
              </footer>
            </>
          );
        })()
      )}
      {/* Cinematic Lightbox Modal Overlay */}
      {activeLightboxItem && (() => {
        const media = getMediaInfo(activeLightboxItem.url);
        const mediaType = activeLightboxItem.type || media.type;
        return (
          <div 
            className="cinema-dark fixed inset-0 z-[60] flex flex-col items-center justify-center bg-cinema-black/95 backdrop-blur-md p-4 overflow-y-auto"
            onClick={() => setActiveLightboxItem(null)}
            style={{
              animation: 'fadeIn 0.25s ease-out forwards'
            }}
          >
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes zoomIn {
                from { transform: scale(0.95); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
              }
            `}</style>
            
            {/* Close Button */}
            <button 
              onClick={() => setActiveLightboxItem(null)}
              className="absolute top-6 right-6 p-2 bg-cinema-card border border-cinema-border hover:border-accent/40 rounded-full text-cinema-muted hover:text-white transition-colors cursor-pointer z-55 focus-ring"
              aria-label="Close preview"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Arrows */}
            <button 
              onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
              className="absolute left-6 p-2.5 bg-cinema-card/85 border border-cinema-border hover:border-accent hover:text-accent rounded-full text-cinema-muted transition-all cursor-pointer z-55 focus-ring hidden md:flex items-center justify-center shadow-xl"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
              className="absolute right-6 p-2.5 bg-cinema-card/85 border border-cinema-border hover:border-accent hover:text-accent rounded-full text-cinema-muted transition-all cursor-pointer z-55 focus-ring hidden md:flex items-center justify-center shadow-xl"
              aria-label="Next project"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Content Container */}
            <div 
              className="w-full max-w-5xl aspect-video bg-black/40 border border-cinema-border rounded-lg overflow-hidden relative shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking media
              style={{
                animation: 'zoomIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              }}
            >
              {mediaType === 'image' && (
                <img
                  referrerPolicy="no-referrer"
                  src={activeLightboxItem.url} 
                  alt={activeLightboxItem.title || 'Portfolio work'} 
                  className="w-full h-full object-contain"
                />
              )}

              {mediaType === 'mp4' && (
                <video 
                  ref={lightboxVideoRef}
                  src={activeLightboxItem.url} 
                  controls 
                  autoPlay 
                  playsInline
                  loop={isLightboxLooping}
                  className="w-full h-full object-contain"
                />
              )}

              {mediaType === 'gdrive' && (activeLightboxItem.mime || '').startsWith('image/') && (
                <img
                  referrerPolicy="no-referrer"
                  src={`https://lh3.googleusercontent.com/d/${media.id}=w2000`}
                  alt={activeLightboxItem.title || 'Portfolio work'}
                  className="w-full h-full object-contain"
                />
              )}

              {isEmbedType(mediaType) && !(mediaType === 'gdrive' && (activeLightboxItem.mime || '').startsWith('image/')) && (
                <iframe
                  key={`${activeLightboxItem.id}-${isLightboxLooping}`} // Force reload when loop switches
                  src={mediaType === 'youtube' 
                    ? `https://www.youtube.com/embed/${media.id}?autoplay=1&controls=1&rel=0${isLightboxLooping ? `&loop=1&playlist=${media.id}` : ''}`
                    : mediaType === 'vimeo'
                    ? `https://player.vimeo.com/video/${media.id}?autoplay=1&controls=1${isLightboxLooping ? '&loop=1' : ''}`
                    : media.embedUrl
                  }
                  title={activeLightboxItem.title || 'Portfolio work'}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              )}
            </div>

            {/* Metadata Footer */}
            <div 
              className="mt-6 text-center max-w-2xl px-4 flex flex-col items-center gap-3"
              onClick={(e) => e.stopPropagation()}
              style={{
                animation: 'zoomIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              }}
            >
              <div className="text-accent font-mono text-xs tracking-wider mb-1 uppercase flex items-center justify-center gap-4 flex-wrap">
                <span>{(Array.isArray(activeLightboxItem.tags) && activeLightboxItem.tags[0]) || (isVideoItem(activeLightboxItem) ? 'Video' : 'Photo')}</span>
                
                {/* Loop Video Selector */}
                {isVideoItem(activeLightboxItem) && (
                  <button
                    type="button"
                    onClick={() => setIsLightboxLooping(!isLightboxLooping)}
                    className={`flex items-center gap-1.5 px-3 py-1 border rounded text-[10px] font-mono font-medium transition-all cursor-pointer focus-ring ${
                      isLightboxLooping
                        ? 'bg-accent/15 border-accent text-accent '
                        : 'border-cinema-border text-cinema-muted hover:text-white hover:border-cinema-muted'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
                    </svg>
                    <span>LOOP: {isLightboxLooping ? 'ON' : 'OFF'}</span>
                  </button>
                )}
              </div>
              {activeLightboxItem.title && (
                <h3 className="text-xl md:text-2xl font-display font-bold text-white tracking-wide">
                  {activeLightboxItem.title}
                </h3>
              )}
              {activeLightboxItem.description && (
                <p className="text-sm text-cinema-muted mt-2 max-w-xl leading-relaxed">
                  {activeLightboxItem.description}
                </p>
              )}
              {Array.isArray(activeLightboxItem.tags) && activeLightboxItem.tags.length > 1 && (
                <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                  {activeLightboxItem.tags.slice(1).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-accent/10 text-accent border border-accent/20 text-[10px] font-mono rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Keyboard Shortcut Hints Bar */}
              <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-cinema-muted mt-3 pt-3 border-t border-cinema-border/40 flex-wrap">
                <span><kbd className="px-1.5 py-0.5 rounded bg-cinema-dark border border-cinema-border/60 text-white">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-cinema-dark border border-cinema-border/60 text-white">→</kbd> NAVIGATE</span>
                {isVideoItem(activeLightboxItem) && (
                  <>
                    <span><kbd className="px-1.5 py-0.5 rounded bg-cinema-dark border border-cinema-border/60 text-white">SPACE</kbd> PLAY/PAUSE</span>
                    <span><kbd className="px-1.5 py-0.5 rounded bg-cinema-dark border border-cinema-border/60 text-white">L</kbd> +5s</span>
                    <span><kbd className="px-1.5 py-0.5 rounded bg-cinema-dark border border-cinema-border/60 text-white">J</kbd> -5s</span>
                  </>
                )}
                <span><kbd className="px-1.5 py-0.5 rounded bg-cinema-dark border border-cinema-border/60 text-white">ESC</kbd> CLOSE</span>
              </div>
            </div>
          </div>
        );
      })()}
      {/* Floating WhatsApp button (public site) */}
      {!isAdmin && (
        <a
          href={getWhatsAppUrl("Hi Vaibhav, I have a quick question about Cutframe Studio's video editing & content management services.")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 focus-ring"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      )}

      {/* Agency Discovery & Scope Brief Modal */}
      <DiscoveryModal
        isOpen={showDiscoveryModal}
        onClose={() => setShowDiscoveryModal(false)}
        initialService={selectedService}
        showToast={showToast}
      />
    </div>
  );
}
