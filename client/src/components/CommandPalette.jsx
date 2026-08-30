import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Command, Palette, Mail, Shield, ExternalLink, Folder } from 'lucide-react';

export default function CommandPalette({
  isOpen,
  onClose,
  items = [],
  onOpenContact,
  onOpenAdminPin,
  onSelectTheme,
  onSelectProject
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Build command options list
  const navCommands = [
    {
      id: 'contact',
      category: 'Actions',
      title: 'Send Message / Contact Me',
      subtitle: 'Open contact modal',
      icon: Mail,
      action: () => { onClose(); onOpenContact(); }
    },
    {
      id: 'admin',
      category: 'Actions',
      title: 'Admin Verification / Settings',
      subtitle: 'Enter PIN to edit portfolio',
      icon: Shield,
      action: () => { onClose(); onOpenAdminPin(); }
    }
  ];

  const themeCommands = [
    { id: 'theme-amber', category: 'Theme Accent', title: 'Amber Theme', subtitle: 'Warm gold accent', icon: Palette, action: () => { onSelectTheme?.('amber'); onClose(); } },
    { id: 'theme-green', category: 'Theme Accent', title: 'Emerald Theme', subtitle: 'Cyber green accent', icon: Palette, action: () => { onSelectTheme?.('green'); onClose(); } },
    { id: 'theme-cyan', category: 'Theme Accent', title: 'Cyan Theme', subtitle: 'Electric blue accent', icon: Palette, action: () => { onSelectTheme?.('cyan'); onClose(); } },
    { id: 'theme-red', category: 'Theme Accent', title: 'Crimson Theme', subtitle: 'Vibrant red accent', icon: Palette, action: () => { onSelectTheme?.('red'); onClose(); } }
  ];

  const projectCommands = items.map(item => ({
    id: `project-${item.id}`,
    category: 'Projects',
    title: item.title || 'Untitled Project',
    subtitle: item.type ? `${item.type.toUpperCase()} • ${item.size}` : item.size,
    icon: Folder,
    action: () => { onClose(); onSelectProject?.(item); }
  }));

  const allCommands = [...navCommands, ...themeCommands, ...projectCommands];

  const filteredCommands = allCommands.filter(cmd =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard navigation inside modal
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-cinema-black/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={handleKeyDown}
    >
      <div className="relative w-full max-w-xl bg-cinema-card border border-cinema-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Top Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-accent via-accent/60 to-transparent" />

        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-cinema-border/60 bg-cinema-dark/50">
          <Search className="w-4 h-4 text-cinema-muted mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Type a command or search projects... (Press Esc to exit)"
            className="w-full bg-transparent text-sm text-white placeholder-cinema-muted outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-cinema-muted hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded border border-cinema-border text-cinema-muted">
            ESC
          </span>
        </div>

        {/* Command Results List */}
        <div className="overflow-y-auto p-2 space-y-1 divide-y divide-cinema-border/20">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-cinema-muted">
              No matching commands or projects found for "{query}"
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-accent/15 text-accent font-medium border-l-2 border-accent'
                      : 'hover:bg-cinema-border/30 text-cinema-text'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-accent' : 'text-cinema-muted'}`} />
                    <div className="truncate">
                      <div className="text-xs font-medium text-white truncate">{cmd.title}</div>
                      <div className="text-[11px] font-mono text-cinema-muted truncate">{cmd.subtitle}</div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 uppercase tracking-wider ${
                    isSelected
                      ? 'bg-accent/20 text-accent font-bold'
                      : 'bg-cinema-dark text-cinema-muted border border-cinema-border/50'
                  }`}>
                    {cmd.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="flex items-center justify-between px-4 py-2 bg-cinema-dark/80 border-t border-cinema-border/40 text-[11px] font-mono text-cinema-muted">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 rounded border border-cinema-border bg-cinema-card">↑↓</kbd> navigate</span>
            <span><kbd className="px-1 py-0.5 rounded border border-cinema-border bg-cinema-card">↵</kbd> select</span>
          </div>
          <div className="flex items-center gap-1 text-[10px]">
            <Command className="w-3 h-3" /> Palette
          </div>
        </div>
      </div>
    </div>
  );
}
