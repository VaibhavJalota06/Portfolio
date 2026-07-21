import React, { useState, useEffect, useRef } from 'react';
import { Film, Eye, Mail, Github, Compass, Video, X, Instagram, Globe, Tag, Send, Lock, RotateCcw, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import FilmGrain from './components/FilmGrain';
import Toast from './components/Toast';
import AdminPanel from './components/AdminPanel';
import SettingsPanel from './components/SettingsPanel';
import PortfolioGrid from './components/PortfolioGrid';
import FilmReel3D from './components/FilmReel3D';
import Background3D from './components/Background3D';
import ContactForm from './components/ContactForm';
import { getMediaInfo } from './utils/media';

export default function App() {
  const [items, setItems] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [timecode, setTimecode] = useState('00:00:00:00');
  const [activeLightboxItem, setActiveLightboxItem] = useState(null);
  const [isLightboxLooping, setIsLightboxLooping] = useState(false);
  const [settings, setSettings] = useState(null);
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

  // Contact form
  const [showContactForm, setShowContactForm] = useState(false);

  // Parallax hero
  const [heroParallax, setHeroParallax] = useState(0);

  // Client messages
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Custom Aesthetic Enhanced States & Refs
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isHeroMuted, setIsHeroMuted] = useState(true);
  const [isHeroPlaying, setIsHeroPlaying] = useState(true);
  
  const audioRef = useRef(null);
  const heroVideoRef = useRef(null);
  const lightboxVideoRef = useRef(null);

  // Reset loop state when closing lightbox
  useEffect(() => {
    if (!activeLightboxItem) {
      setIsLightboxLooping(false);
    }
  }, [activeLightboxItem]);

  // Refs for zero-render DOM-based high-performance cursor & ambient glow tracking
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const glowRef = useRef(null);

  // 1. High-Performance Mouse coordinate tracker for custom cursor & ambient glow (direct DOM mutation, 0% React render overhead)
  useEffect(() => {
    let mouseX = -1000;
    let mouseY = -1000;
    let ringX = -1000;
    let ringY = -1000;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Direct positioning for inner dot (instant track)
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${mouseX}px`;
        cursorDotRef.current.style.top = `${mouseY}px`;
      }
      
      // Direct positioning for background glow
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255, 159, 28, 0.055), transparent 80%)`;
      }
    };

    let frameId;
    const tick = () => {
      // Direct positioning for outer ring (interpolated lagging lag track)
      if (cursorRingRef.current) {
        // First frame initialization fix
        if (ringX === -1000) {
          ringX = mouseX;
          ringY = mouseY;
        } else {
          ringX += (mouseX - ringX) * 0.16;
          ringY += (mouseY - ringY) * 0.16;
        }
        cursorRingRef.current.style.left = `${ringX}px`;
        cursorRingRef.current.style.top = `${ringY}px`;
      }
      frameId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMouseMove);
    frameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  // 1b. Mouseover interactive elements tracker for custom cursor reactions
  useEffect(() => {
    if (isAdmin) {
      setIsHoveringInteractive(false);
      return;
    }
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'SELECT' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') || 
        target.closest('a') || 
        target.closest('.cursor-pointer') ||
        target.closest('[role="button"]');
        
      setIsHoveringInteractive(!!isInteractive);
    };
    
    window.addEventListener('mouseover', handleMouseOver);
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, [isAdmin]);

  // 2. Audio ambient player load
  useEffect(() => {
    audioRef.current = new Audio('/ambient.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.35;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // 3. Film Clapperboard Slate Intro Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const toggleSound = () => {
    if (!audioRef.current) return;
    if (isPlayingSound) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.warn('Sound play blocked:', err));
    }
    setIsPlayingSound(!isPlayingSound);
  };

  const toggleHeroPlay = () => {
    if (heroVideoRef.current) {
      if (isHeroPlaying) {
        heroVideoRef.current.pause();
      } else {
        heroVideoRef.current.play().catch(err => console.warn(err));
      }
      setIsHeroPlaying(!isHeroPlaying);
    }
  };

  const toggleHeroMute = () => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = !isHeroMuted;
      setIsHeroMuted(!isHeroMuted);
    }
  };

  // Fetch settings and manage secret hash-based admin routing on mount
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#studio') {
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

  // Synchronize portfolio items based on user view (admin vs public) and login status
  useEffect(() => {
    if (isAdmin && (pinVerified || (settings && !settings.admin_pin))) {
      fetchItems(true);
    } else if (!isAdmin) {
      fetchItems(false);
    }
  }, [isAdmin, pinVerified, settings]);

  // Parallax hero on scroll
  useEffect(() => {
    const handleScroll = () => setHeroParallax(window.scrollY * 0.35);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Inject OG / Twitter meta tags dynamically
  useEffect(() => {
    const name = settings?.editor_name || 'ALEX KANE';
    const desc = settings?.hero_tagline || 'Cinematic editor and colorist portfolio';
    const setMeta = (prop, content, attr = 'property') => {
      let el = document.querySelector(`meta[${attr}="${prop}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, prop); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    document.title = `${name.toUpperCase()} | Cinematic Editor & Colorist`;
    setMeta('og:title', `${name} | Portfolio`);
    setMeta('og:description', desc);
    setMeta('og:type', 'website');
    setMeta('twitter:card', 'summary_large_image', 'name');
    setMeta('twitter:title', `${name} | Portfolio`, 'name');
    setMeta('twitter:description', desc, 'name');
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
        setPinVerified(true);
      } else {
        setPinError('Incorrect PIN. Try again.');
        setPinInput('');
      }
    } catch {
      setPinError('Connection error. Please try again.');
    } finally {
      setPinChecking(false);
    }
  };

  // Inject CSS accent theme variables dynamically based on settings
  useEffect(() => {
    const accent = settings?.theme_accent || 'amber';
    const palettes = {
      amber: { base: '#ff9f1c', hover: '#e58f13', dark: '#cc7f10', light: '#ffb347' },
      green: { base: '#10b981', hover: '#059669', dark: '#047857', light: '#34d399' },
      cyan: { base: '#06b6d4', hover: '#0891b2', dark: '#0e7490', light: '#22d3ee' },
      red:   { base: '#ef4444', hover: '#dc2626', dark: '#b91c1c', light: '#f87171' }
    };
    const colors = palettes[accent] || palettes.amber;
    document.documentElement.style.setProperty('--color-accent', colors.base);
    document.documentElement.style.setProperty('--color-accent-hover', colors.hover);
    document.documentElement.style.setProperty('--color-accent-dark', colors.dark);
    document.documentElement.style.setProperty('--color-accent-light', colors.light);
  }, [settings]);

  // Fetch client messages for inbox
  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      const res = await fetch('/api/contact?admin=1');
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
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
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
    if (isAdmin && (pinVerified || (settings && !settings.admin_pin))) {
      fetchMessages();
    }
  }, [isAdmin, pinVerified, settings]);

  // Lightbox arrow navigation
  const navigateLightbox = (direction) => {
    if (!activeLightboxItem) return;
    const VIDEO_TYPES = ['youtube', 'vimeo', 'mp4'];
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
      
      // Stop space key from scrolling the page
      if (e.key === ' ') {
        e.preventDefault();
      }

      if (e.key === 'Escape') setActiveLightboxItem(null);
      if (e.key === 'ArrowRight') navigateLightbox('next');
      if (e.key === 'ArrowLeft') navigateLightbox('prev');

      // Native video playback controls (J-K-L + Space)
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
          video.currentTime = Math.min(video.currentTime + 5, video.duration);
        }
        if (e.key === 'j' || e.key === 'J') {
          video.currentTime = Math.max(video.currentTime - 5, 0);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxItem, items, activeGalleryTab, activeTagFilter]);

  // Update browser tab document title dynamically based on settings
  useEffect(() => {
    if (settings?.editor_name) {
      document.title = `${settings.editor_name.toUpperCase()} | Cinematic Editor & Colorist`;
    } else {
      document.title = "ALEX KANE | Cinematic Editor & Colorist";
    }
  }, [settings]);

  // 24fps Ticking Timecode to evoke editing timeline
  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const f = String(frame).padStart(2, '0');
      setTimecode(`${h}:${m}:${s}:${f}`);
      frame = (frame + 1) % 24;
    }, 41.67); // 1000ms / 24 frames = 41.67ms
    return () => clearInterval(interval);
  }, []);



  const fetchItems = async (forAdmin = false) => {
    try {
      const res = await fetch(forAdmin ? '/api/items?admin=1' : '/api/items');
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
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  const handleSaveSettings = async (updatedSettings) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
      if (!res.ok) throw new Error('Failed to save settings');
      setSettings(updatedSettings);
      showToast('Website identity settings updated');
    } catch (err) {
      console.error(err);
      showToast('Failed to save settings', 'error');
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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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

  // Reorder callback from @dnd-kit (optimistic update)
  const handleReorderItems = async (reorderedItems) => {
    const previousItems = [...items];
    setItems(reorderedItems); // Update state instantly

    try {
      const res = await fetch('/api/items/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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
    <div className={`relative min-h-screen ${!isAdmin ? 'custom-cursor-active' : ''}`}>

      {/* Contact Form Modal */}
      {showContactForm && <ContactForm onClose={() => setShowContactForm(false)} />}

      {/* Cinematic Custom Delete Confirmation Modal */}
      {itemToDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cinema-black/90 backdrop-blur-md animate-fade-in"
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
                    const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
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

      {/* Mobile Bottom Navigation (sm and below, public only) */}
      {!isAdmin && (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-cinema-black/95 backdrop-blur-md border-t border-cinema-border/50 flex items-center justify-around py-2 px-4">
          {[
            { id: 'all',    label: 'All',    hash: '#',       icon: '◈' },
            { id: 'videos', label: 'Videos', hash: '#videos', icon: '▶' },
            { id: 'photos', label: 'Photos', hash: '#photos', icon: '◻' },
          ].map(tab => (
            <a key={tab.id} href={tab.hash} onClick={() => setActiveGalleryTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded transition-colors ${
                activeGalleryTab === tab.id ? 'text-accent' : 'text-cinema-muted'
              }`}>
              <span className="text-base">{tab.icon}</span>
              <span className="text-[9px] font-mono font-semibold tracking-wider">{tab.label}</span>
            </a>
          ))}
          <button onClick={() => setShowContactForm(true)}
            className="flex flex-col items-center gap-0.5 px-4 py-1 rounded text-cinema-muted transition-colors cursor-pointer">
            <Mail className="w-4 h-4" />
            <span className="text-[9px] font-mono font-semibold tracking-wider">Contact</span>
          </button>
        </nav>
      )}

      {/* Admin PIN Lock Screen */}
      {isAdmin && settings?.admin_pin && !pinVerified && (
        <div className="fixed inset-0 z-50 bg-cinema-black flex items-center justify-center p-6">
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

      {/* Film Clapperboard Slate Intro Loader */}
      {loading && (
        <div 
          className="fixed inset-0 bg-cinema-black z-50 flex items-center justify-center flex-col animate-fade-out" 
          style={{ animationDelay: '1.4s', animationFillMode: 'forwards' }}
        >
          {/* Film slate box */}
          <div className="relative w-80 bg-cinema-card border-2 border-white rounded-lg p-6 font-mono text-[10px] text-white uppercase tracking-wider overflow-hidden shadow-[0_0_50px_rgba(255,159,28,0.08)]">
            {/* Clapper Arm */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-white text-cinema-black font-bold flex items-center justify-between px-4 text-xs animate-clack origin-bottom-left border-b-2 border-white">
              <span>///</span> <span>SLATE TIMELINE</span> <span>///</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full pt-6 text-left mt-2">
              <div className="border-r border-white/20 pr-2 pb-2">
                <span className="text-[8px] text-cinema-muted font-semibold">PROD:</span>
                <div className="font-bold truncate mt-0.5 text-xs text-accent">{settings?.editor_name || "ALEX KANE"}</div>
              </div>
              <div className="pb-2">
                <span className="text-[8px] text-cinema-muted font-semibold">ROLL:</span>
                <div className="font-bold mt-0.5 text-xs text-white">A-01</div>
              </div>
              <div className="border-t border-r border-white/20 pt-2 pr-2">
                <span className="text-[8px] text-cinema-muted font-semibold">TAKE:</span>
                <div className="font-bold mt-0.5 text-xs text-white">01</div>
              </div>
              <div className="border-t border-white/20 pt-2">
                <span className="text-[8px] text-cinema-muted font-semibold">SOUND:</span>
                <div className="font-bold mt-0.5 text-xs text-accent">SYNCED</div>
              </div>
            </div>
            <div className="w-full border-t border-white/20 mt-4 pt-3 text-[8px] text-center text-cinema-muted animate-pulse">
              [ INITIALIZING SHOWCASE CORE ]
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Custom Cursor (Only active on desktop views with pointer cursor) */}
      {!isAdmin && (
        <div className="hidden sm:block">
          {/* Inner Custom Dot - Theme Accent Amber */}
          <div 
            ref={cursorDotRef}
            className="pointer-events-none fixed z-50 w-2 h-2 rounded-full bg-accent transition-transform duration-75 ease-out"
            style={{
              left: '-20px',
              top: '-20px',
              transform: `translate(-50%, -50%) scale(${isHoveringInteractive ? 0.5 : 1})`,
              opacity: isHoveringInteractive ? 0.2 : 1
            }}
          />
          {/* Outer Custom Target Lens Ring - Theme Accent Amber Ring */}
          <div 
            ref={cursorRingRef}
            className="pointer-events-none fixed z-50 rounded-full border transition-all duration-300 ease-out"
            style={{
              left: '-20px',
              top: '-20px',
              width: isHoveringInteractive ? '44px' : '24px',
              height: isHoveringInteractive ? '44px' : '24px',
              transform: `translate(-50%, -50%)`,
              backgroundColor: isHoveringInteractive ? 'rgba(255, 159, 28, 0.08)' : 'transparent',
              borderColor: isHoveringInteractive ? '#ff9f1c' : 'rgba(255, 159, 28, 0.35)'
            }}
          />
        </div>
      )}


        {/* Cinematic Film Grain Overlay */}
        <FilmGrain />

        {/* Dynamic 3D Floating Background Elements */}
        {!isAdmin && <Background3D />}

      {/* Interactive Mouse Glow Tracker Overlay */}
      <div 
        ref={glowRef}
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300 opacity-60"
        style={{
          background: `radial-gradient(600px circle at -1000px -1000px, rgba(255, 159, 28, 0.055), transparent 80%)`
        }}
      />

      {/* Sleek Cinematic Header */}
      <header className="sticky top-0 z-40 bg-cinema-black/80 backdrop-blur-md border-b border-cinema-border/50 px-6 py-4 flex items-center justify-between gap-4">
        {/* Logo / Name */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <a href="#" onClick={() => { window.location.hash = ''; }}
            className="flex items-center gap-3 group focus-ring rounded">
            <Film className="w-5 h-5 text-accent" />
            <span className="font-display font-bold tracking-widest text-sm text-white group-hover:text-accent transition-colors">
              {settings?.editor_name || 'ALEX KANE'} <span className="hidden sm:inline text-accent font-light font-sans ml-1 text-xs">/ CUT & GRADE</span>
            </span>
          </a>
          {/* Available for Work badge */}
          {settings?.available_for_work === '1' && (
            <span className="hidden md:flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              AVAILABLE
            </span>
          )}
        </div>

        {/* Public Nav Tabs — only shown outside admin */}
        {!isAdmin && (
          <nav className="hidden sm:flex items-center gap-1 bg-cinema-card/60 border border-cinema-border/50 rounded-lg p-1">
            {[
              { id: 'all',    label: 'ALL WORK', hash: '#' },
              { id: 'videos', label: 'VIDEOS',   hash: '#videos' },
              { id: 'photos', label: 'PHOTOS',   hash: '#photos' },
            ].map(tab => (
              <a
                key={tab.id}
                href={tab.hash}
                onClick={() => setActiveGalleryTab(tab.id)}
                className={`px-4 py-1.5 rounded-md text-[11px] font-mono font-semibold tracking-wider transition-all duration-200 focus-ring ${
                  activeGalleryTab === tab.id
                    ? 'bg-accent text-cinema-black shadow-sm'
                    : 'text-cinema-muted hover:text-white'
                }`}
              >
                {tab.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {/* Audio ambient player */}
          <button
            type="button"
            onClick={toggleSound}
            className={`flex items-center gap-2 px-3 py-1.5 bg-cinema-card border rounded text-[10px] font-mono tracking-widest cursor-pointer transition-all duration-300 focus-ring ${
              isPlayingSound ? 'border-accent/40 text-accent shadow-[0_0_10px_rgba(255,159,28,0.1)]' : 'border-cinema-border text-cinema-muted hover:text-white'
            }`}
          >
            <div className="flex gap-[2px] items-end h-2.5 w-3.5">
              <span className={`w-[2px] bg-current rounded-full ${isPlayingSound ? 'animate-soundwave-1' : 'h-1'}`}></span>
              <span className={`w-[2px] bg-current rounded-full ${isPlayingSound ? 'animate-soundwave-2' : 'h-1'}`}></span>
              <span className={`w-[2px] bg-current rounded-full ${isPlayingSound ? 'animate-soundwave-3' : 'h-1'}`}></span>
              <span className={`w-[2px] bg-current rounded-full ${isPlayingSound ? 'animate-soundwave-4' : 'h-1'}`}></span>
            </div>
            <span>AMBIENT: {isPlayingSound ? 'ON' : 'OFF'}</span>
          </button>

          {/* Timecode display */}
          <div className="hidden lg:flex items-center gap-2 bg-cinema-card border border-cinema-border px-3 py-1.5 rounded text-[10px] font-mono tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
            <span className="text-cinema-muted">REC</span>
            <span className="text-white">{timecode}</span>
          </div>
        </div>

        {/* Return to Public Site Button (Only visible in admin workspace) */}
        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              window.location.hash = ''; // Clear hash to return to public site
            }}
            className="flex items-center gap-2 px-4 py-1.5 border border-cinema-border text-cinema-muted hover:text-white hover:border-cinema-muted rounded text-xs font-mono font-medium transition-all duration-300 focus-ring cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-accent" />
            BACK TO PORTFOLIO
          </button>
        )}
      </header>
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
                  { id: 'videos', label: 'Videos', count: items.filter(i => ['youtube','vimeo','mp4'].includes(i.type)).length },
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
              const VIDEO_TYPES = ['youtube', 'vimeo', 'mp4'];
              const adminFiltered = adminTypeFilter === 'videos'
                ? items.filter(i => VIDEO_TYPES.includes(i.type))
                : adminTypeFilter === 'photos'
                  ? items.filter(i => i.type === 'image')
                  : items;

              if (adminFiltered.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-20 text-cinema-muted border border-dashed border-cinema-border/50 rounded-lg">
                    <div className="text-4xl mb-3 opacity-20">{adminTypeFilter === 'videos' ? '🎬' : adminTypeFilter === 'photos' ? '🖼' : '📂'}</div>
                    <p className="text-xs font-mono tracking-wider uppercase">No {adminTypeFilter === 'all' ? 'items' : adminTypeFilter} yet — add one above</p>
                  </div>
                );
              }

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
          const VIDEO_TYPES = ['youtube', 'vimeo', 'mp4'];
          const filteredItems = activeGalleryTab === 'videos'
            ? items.filter(i => VIDEO_TYPES.includes(i.type))
            : activeGalleryTab === 'photos'
              ? items.filter(i => i.type === 'image')
              : items;

          return (
            <>
              {/* Hero Section — only on ALL WORK tab */}
              {activeGalleryTab === 'all' && (
                <section className="relative h-[80vh] flex items-center justify-center overflow-hidden border-b border-cinema-border/50">
                  <div className="absolute inset-0 w-full h-full z-0 bg-black/60" style={{ transform: `translateY(${heroParallax}px)` }}>
                    <video
                      ref={heroVideoRef}
                      key={settings?.showreel_url}
                      autoPlay
                      muted={isHeroMuted}
                      loop
                      playsInline
                      className="w-full h-full object-cover opacity-50"
                      src={settings?.showreel_url || "https://assets.mixkit.co/videos/preview/mixkit-cinematic-shot-of-a-man-with-a-camera-42861-large.mp4"}
                    />
                  </div>

                  {/* Play/Pause & Mute/Unmute overlays (bottom right) */}
                  <div className="absolute bottom-14 right-6 z-25 flex items-center gap-2 pointer-events-auto">
                    <button
                      type="button"
                      onClick={toggleHeroPlay}
                      className="p-2 bg-cinema-black/85 backdrop-blur-sm border border-cinema-border text-white hover:text-accent rounded-full transition-colors cursor-pointer focus-ring"
                      title={isHeroPlaying ? "Pause Showreel" : "Play Showreel"}
                    >
                      {isHeroPlaying ? (
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={toggleHeroMute}
                      className="p-2 bg-cinema-black/85 backdrop-blur-sm border border-cinema-border text-white hover:text-accent rounded-full transition-colors cursor-pointer focus-ring"
                      title={isHeroMuted ? "Unmute Showreel" : "Mute Showreel"}
                    >
                      {isHeroMuted ? (
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .9-1.077 1.347-1.707.707L5.586 15z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>
                      ) : (
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .9-1.077 1.347-1.707.707L5.586 15z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Subtle vignette layer */}
                  <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-transparent to-cinema-black/40 z-10 pointer-events-none" />

                  {/* Hero text */}
                  <div className="relative z-20 text-center max-w-4xl px-6 flex flex-col items-center">
                    <FilmReel3D />
                    {settings?.hero_label !== "" && (
                      <div className="text-accent font-mono text-xs tracking-[0.25em] mb-4 uppercase">
                        {settings?.hero_label ?? "[SHOWREEL_EDIT_2026]"}
                      </div>
                    )}
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-6 uppercase">
                      {settings?.editor_name || "ALEX KANE"}
                    </h1>
                    {settings?.hero_tagline !== "" && (
                      <p className="text-base md:text-xl font-light text-cinema-muted max-w-xl leading-relaxed tracking-wide mb-8">
                        {settings?.hero_tagline ?? "Cinematic editor and color scientist. Crafting rhythm, tone, and pacing for commercial, music video, and narrative formats."}
                      </p>
                    )}
                    <a
                      href="#gallery"
                      className="flex items-center gap-2 px-6 py-3 bg-transparent border border-white hover:bg-white hover:text-cinema-black font-semibold text-sm rounded transition-all duration-300 tracking-wider font-mono focus-ring"
                    >
                      <Video className="w-4 h-4" />
                      ENTER TIMELINE
                    </a>
                  </div>

                  {/* Timeline bar visual at the bottom of hero */}
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-cinema-card/75 backdrop-blur-sm border-t border-cinema-border/50 z-20 flex items-center justify-between px-6 text-[10px] font-mono text-cinema-muted">
                    <div>00:00:00:00</div>
                    <div className="flex-1 mx-4 h-px bg-cinema-border relative">
                      <div className="absolute top-1/2 left-[25%] transform -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent"></div>
                      <div className="absolute top-1/2 left-[60%] transform -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent"></div>
                    </div>
                    <div>00:04:12:00</div>
                  </div>
                </section>
              )}

              {/* Filtered Page Header — shown on Videos / Photos tabs only */}
              {activeGalleryTab !== 'all' && (
                <div className="max-w-7xl mx-auto px-6 pt-16 pb-4 border-b border-cinema-border/30">
                  <div className="text-accent font-mono text-xs tracking-[0.2em] mb-3 uppercase flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    {activeGalleryTab === 'videos' ? 'VIDEO WORK' : 'PHOTO WORK'}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white">
                    {activeGalleryTab === 'videos' ? 'VIDEOS' : 'PHOTOS'}
                  </h1>
                  <p className="text-sm text-cinema-muted mt-3 font-light">
                    {activeGalleryTab === 'videos'
                      ? `${filteredItems.length} video${filteredItems.length !== 1 ? 's' : ''} — YouTube, Vimeo & MP4`
                      : `${filteredItems.length} image${filteredItems.length !== 1 ? 's' : ''}`
                    }
                  </p>
                </div>
              )}

              {/* Gallery / Grid Section */}
              <main id="gallery" className="max-w-7xl mx-auto px-6 py-16">
                {/* Section Header (All Work tab only) */}
                {activeGalleryTab === 'all' && (
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight text-white">
                      {settings?.gallery_title ?? "PORTFOLIO SHOWCASE"}
                    </h2>
                  </div>
                )}

                {/* Tags filter row */}
                {(() => {
                  const allTags = [...new Set(filteredItems.flatMap(i => Array.isArray(i.tags) ? i.tags : []))];
                  if (allTags.length === 0) return null;
                  return (
                    <div className="flex flex-wrap gap-2 mb-8">
                      <button onClick={() => setActiveTagFilter('')}
                        className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all cursor-pointer border ${
                          !activeTagFilter ? 'bg-accent text-cinema-black border-accent' : 'border-cinema-border text-cinema-muted hover:text-white'
                        }`}>
                        ALL TAGS
                      </button>
                      {allTags.map(tag => (
                        <button key={tag} onClick={() => setActiveTagFilter(activeTagFilter === tag ? '' : tag)}
                          className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all cursor-pointer border ${
                            activeTagFilter === tag ? 'bg-accent text-cinema-black border-accent' : 'border-cinema-border text-cinema-muted hover:text-white'
                          }`}>
                          {tag}
                        </button>
                      ))}
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
                    <div className="flex flex-col items-center justify-center py-32 text-cinema-muted">
                      <div className="text-5xl mb-4 opacity-20">{activeGalleryTab === 'videos' ? '🎬' : '🖼'}</div>
                      <p className="text-sm font-mono tracking-wider uppercase">No {activeTagFilter || (activeGalleryTab === 'videos' ? 'videos' : 'images')} found.</p>
                    </div>
                  );
                })()}
              </main>

          {/* About/Contact Footer */}
          <footer className="bg-cinema-card border-t border-cinema-border/50 py-16 px-6 mt-12 relative overflow-hidden">
            {/* Background visual detail */}
            <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-accent/5 rounded-full filter blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              
              {/* Bio block */}
              <div className="flex flex-col justify-between gap-6">
                <div>
                  <div className="text-accent font-mono text-[10px] tracking-widest mb-3 uppercase">
                    [00:03:45:00] BIO_METADATA
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wide text-white mb-4">
                    THE EDITOR'S ROOM
                  </h3>
                  {settings?.bio_text !== "" && (
                    <p className="text-sm text-cinema-muted leading-relaxed font-light">
                      {settings?.bio_text ?? "Alex Kane is an industry-grade film editor and digital colorist. Drawing on a decade of color pipeline management and editorial storytelling, Alex transforms raw footage into cinematic narratives. Working with major commercial brands and indie narrative productions, he designs custom color grading curves and pacing that breathes life into every single cut."}
                    </p>
                  )}
                </div>
                
                {settings?.location_info !== "" && (
                  <div className="text-[10px] font-mono text-cinema-muted uppercase">
                    {settings?.location_info ?? "LOCATED: LOS ANGELES, CA • DIGITAL PIPELINE: DAVINCI RESOLVE / PREMIERE PRO"}
                  </div>
                )}
              </div>

              {/* Contact / Links block */}
              <div className="flex flex-col justify-between gap-8 md:pl-12 md:border-l border-cinema-border/50">
                <div>
                  <div className="text-accent font-mono text-[10px] tracking-widest mb-3 uppercase">
                    [CONTACT_CHANNELS]
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wide text-white mb-6">
                    START A PROJECT
                  </h3>
                  
                  <div className="flex flex-col gap-4">
                    {settings?.contact_email !== "" && (
                      <a href={settings?.contact_email ? `mailto:${settings.contact_email}` : "mailto:contact@alexkane.edit"}
                        className="flex items-center gap-3 text-sm text-cinema-muted hover:text-accent transition-colors group focus-ring p-1 -m-1 rounded">
                        <Mail className="w-4 h-4 text-accent" />
                        <span>{settings?.contact_email ?? "contact@alexkane.edit"}</span>
                      </a>
                    )}
                    {/* Contact Form Button */}
                    <button onClick={() => setShowContactForm(true)}
                      className="flex items-center gap-3 text-sm text-accent hover:text-white transition-colors border border-accent/30 hover:border-accent px-4 py-2 rounded font-mono tracking-wide cursor-pointer w-fit">
                      <Send className="w-3.5 h-3.5" />
                      SEND A MESSAGE
                    </button>
                    {settings?.contact_github !== "" && (
                      <a href={settings?.contact_github ? `https://${settings.contact_github.replace(/^https?:\/\//, '')}` : "https://github.com"}
                        target="_blank" rel="noreferrer"
                        className="flex items-center gap-3 text-sm text-cinema-muted hover:text-accent transition-colors group focus-ring p-1 -m-1 rounded">
                        <Github className="w-4 h-4 text-accent" />
                        <span>{settings?.contact_github ?? "github.com/alexkane-edit"}</span>
                      </a>
                    )}
                    {settings?.contact_vimeo !== "" && (
                      <a href={settings?.contact_vimeo ? `https://${settings.contact_vimeo.replace(/^https?:\/\//, '')}` : "https://vimeo.com"}
                        target="_blank" rel="noreferrer"
                        className="flex items-center gap-3 text-sm text-cinema-muted hover:text-accent transition-colors group focus-ring p-1 -m-1 rounded">
                        <Compass className="w-4 h-4 text-accent" />
                        <span>{settings?.contact_vimeo ?? "vimeo.com/alexkane"}</span>
                      </a>
                    )}
                    {settings?.instagram_url && settings.instagram_url !== "" && (
                      <a href={`https://${settings.instagram_url.replace(/^https?:\/\//, '')}`}
                        target="_blank" rel="noreferrer"
                        className="flex items-center gap-3 text-sm text-cinema-muted hover:text-accent transition-colors group focus-ring p-1 -m-1 rounded">
                        <Instagram className="w-4 h-4 text-accent" />
                        <span>{settings.instagram_url}</span>
                      </a>
                    )}
                    {settings?.behance_url && settings.behance_url !== "" && (
                      <a href={`https://${settings.behance_url.replace(/^https?:\/\//, '')}`}
                        target="_blank" rel="noreferrer"
                        className="flex items-center gap-3 text-sm text-cinema-muted hover:text-accent transition-colors group focus-ring p-1 -m-1 rounded">
                        <Globe className="w-4 h-4 text-accent" />
                        <span>{settings.behance_url}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Copyright and Timecode Metadata */}
                <div className="flex items-center justify-between text-[9px] font-mono text-cinema-muted">
                  <span>© {new Date().getFullYear()} {settings?.editor_name || "ALEX KANE"}. ALL RIGHTS RESERVED.</span>
                  <span className="tracking-widest">TC_OUT: 00:04:12:00</span>
                </div>
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
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cinema-black/95 backdrop-blur-md p-4 animate-fade-in"
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
                  src={activeLightboxItem.url} 
                  alt={activeLightboxItem.title} 
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

              {(mediaType === 'youtube' || mediaType === 'vimeo') && (
                <iframe
                  key={`${activeLightboxItem.id}-${isLightboxLooping}`} // Force reload when loop switches
                  src={mediaType === 'youtube' 
                    ? `https://www.youtube.com/embed/${media.id}?autoplay=1&controls=1&rel=0${isLightboxLooping ? `&loop=1&playlist=${media.id}` : ''}`
                    : `https://player.vimeo.com/video/${media.id}?autoplay=1&controls=1${isLightboxLooping ? '&loop=1' : ''}`
                  }
                  title={activeLightboxItem.title}
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
                <span>[TC 00:00:0{activeLightboxItem.id}:00 // FORMAT: {mediaType.toUpperCase()}]</span>
                
                {/* Loop Video Selector */}
                {mediaType !== 'image' && (
                  <button
                    type="button"
                    onClick={() => setIsLightboxLooping(!isLightboxLooping)}
                    className={`flex items-center gap-1.5 px-3 py-1 border rounded text-[10px] font-mono font-medium transition-all cursor-pointer focus-ring ${
                      isLightboxLooping
                        ? 'bg-accent/15 border-accent text-accent shadow-[0_0_10px_rgba(255,159,28,0.15)]'
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
              <h3 className="text-xl md:text-2xl font-display font-bold text-white tracking-wide">
                {activeLightboxItem.title}
              </h3>
              {activeLightboxItem.description && (
                <p className="text-sm text-cinema-muted mt-2 max-w-xl leading-relaxed">
                  {activeLightboxItem.description}
                </p>
              )}
              {Array.isArray(activeLightboxItem.tags) && activeLightboxItem.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                  {activeLightboxItem.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-accent/10 text-accent border border-accent/20 text-[10px] font-mono rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
