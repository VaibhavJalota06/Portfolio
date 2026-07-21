import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, X, Star, Eye, EyeOff, Tag } from 'lucide-react';
import { getMediaInfo } from '../utils/media';

export default function AdminPanel({ onSave, editingItem, onCancelEdit }) {
  const [url, setUrl]               = useState('');
  const [title, setTitle]           = useState('');
  const [size, setSize]             = useState('small');
  const [description, setDescription] = useState('');
  const [tags, setTags]             = useState([]);  // array of strings
  const [tagInput, setTagInput]     = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [detectedType, setDetectedType] = useState('image');

  useEffect(() => {
    if (editingItem) {
      setUrl(editingItem.url);
      setTitle(editingItem.title || '');
      setSize(editingItem.size);
      setDescription(editingItem.description || '');
      setTags(Array.isArray(editingItem.tags) ? editingItem.tags : []);
      setIsFeatured(Boolean(editingItem.is_featured));
      setIsPublished(editingItem.is_published !== false);
      setDetectedType(editingItem.type);
    } else {
      resetForm();
    }
  }, [editingItem]);

  useEffect(() => {
    if (url) {
      const media = getMediaInfo(url);
      setDetectedType(media.type);
    } else {
      setDetectedType('image');
    }
  }, [url]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    onSave({
      ...(editingItem && { id: editingItem.id }),
      url: url.trim(),
      title: title.trim(),
      size,
      description: description.trim(),
      tags,
      is_featured: isFeatured,
      is_published: isPublished,
      type: detectedType
    });

    resetForm();
  };

  const resetForm = () => {
    setUrl(''); setTitle(''); setSize('small');
    setDescription(''); setTags([]); setTagInput('');
    setIsFeatured(false); setIsPublished(true);
    if (onCancelEdit) onCancelEdit();
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput('');
  };
  const removeTag = (t) => setTags(tags.filter(x => x !== t));

  const badgeColors = {
    youtube: 'bg-red-500/10 text-red-400 border-red-500/30',
    vimeo:   'bg-blue-500/10 text-blue-400 border-blue-500/30',
    mp4:     'bg-accent/10 text-accent border-accent/30',
    image:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  };

  return (
    <div className="bg-cinema-card border border-cinema-border rounded-lg p-6 mb-8 relative animate-fade-in">
      <div className="absolute top-0 left-6 transform -translate-y-1/2 bg-cinema-black px-2 border border-cinema-border/60 text-[9px] font-mono text-accent">
        {editingItem ? '[EDIT_CLIP]' : '[NEW_CLIP]'}
      </div>

      <div className="flex items-center justify-between mb-6 pb-4 border-b border-cinema-border">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-display font-bold">
            {editingItem ? 'Edit Portfolio Item' : 'Add New Item'}
          </h2>
          {detectedType && (
            <span className={`text-[10px] font-mono px-2 py-0.5 border rounded uppercase ${badgeColors[detectedType] || badgeColors.image}`}>
              {detectedType}
            </span>
          )}
        </div>
        {editingItem && (
          <button type="button" onClick={resetForm}
            className="flex items-center gap-1 text-xs text-cinema-muted hover:text-white transition-colors cursor-pointer focus-ring rounded px-2 py-1">
            <X className="w-3.5 h-3.5" /> Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Row 1: URL + Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-cinema-muted">MEDIA URL <span className="text-red-400">*</span></label>
            <input type="text" value={url} onChange={e => setUrl(e.target.value)}
              placeholder="YouTube / Vimeo / .mp4 / Image URL"
              className="bg-cinema-black border border-cinema-border rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent transition-colors focus-ring" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-cinema-muted">TITLE <span className="text-cinema-muted/50">(optional)</span></label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Nike Campaign Edit"
              className="bg-cinema-black border border-cinema-border rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent transition-colors focus-ring" />
          </div>
        </div>

        {/* Row 2: Description */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-cinema-muted">DESCRIPTION <span className="text-cinema-muted/50">(shown in lightbox)</span></label>
          <textarea rows="2" value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Brief caption or notes about this project..."
            className="bg-cinema-black border border-cinema-border rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent transition-colors focus-ring resize-none" />
        </div>

        {/* Row 3: Tags */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-cinema-muted flex items-center gap-1.5">
            <Tag className="w-3 h-3" /> TAGS <span className="text-cinema-muted/50">(press Enter to add)</span>
          </label>
          <div className="flex flex-wrap gap-2 bg-cinema-black border border-cinema-border rounded px-3 py-2 min-h-[44px] items-center">
            {tags.map(t => (
              <span key={t} className="flex items-center gap-1 px-2 py-0.5 bg-accent/10 text-accent border border-accent/30 text-xs rounded font-mono">
                {t}
                <button type="button" onClick={() => removeTag(t)} className="hover:text-white cursor-pointer">×</button>
              </span>
            ))}
            <input
              value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              placeholder={tags.length === 0 ? "Commercial, Music Video, Short Film..." : "Add tag..."}
              className="flex-1 min-w-[140px] bg-transparent text-sm text-white focus:outline-none placeholder:text-cinema-muted/40" />
          </div>
        </div>

        {/* Row 4: Size + Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-cinema-muted">GRID SIZE</label>
            <select value={size} onChange={e => setSize(e.target.value)}
              className="bg-cinema-black border border-cinema-border rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent transition-colors focus-ring cursor-pointer">
              <option value="small">Small (1×1)</option>
              <option value="wide">Wide (2×1)</option>
              <option value="tall">Tall (1×2)</option>
              <option value="large">Large (2×2)</option>
              <option value="banner">Banner (3×1)</option>
              <option value="ultratall">Ultra Tall (1×3)</option>
              <option value="full">Full Width (4×1)</option>
            </select>
          </div>

          {/* Toggle buttons */}
          <div className="flex items-center gap-3">
            {/* Featured toggle */}
            <button type="button" onClick={() => setIsFeatured(f => !f)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded border text-xs font-mono font-semibold transition-all cursor-pointer focus-ring flex-1 justify-center ${
                isFeatured ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400' : 'border-cinema-border text-cinema-muted hover:text-white'
              }`}>
              <Star className={`w-3.5 h-3.5 ${isFeatured ? 'fill-yellow-400' : ''}`} />
              {isFeatured ? 'Featured' : 'Pin to Top'}
            </button>

            {/* Published toggle */}
            <button type="button" onClick={() => setIsPublished(p => !p)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded border text-xs font-mono font-semibold transition-all cursor-pointer focus-ring flex-1 justify-center ${
                isPublished ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-red-500/5 border-red-500/30 text-red-400'
              }`}>
              {isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {isPublished ? 'Published' : 'Draft'}
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2 border-t border-cinema-border/50 gap-3">
          {editingItem && (
            <button type="button" onClick={resetForm}
              className="px-5 py-2.5 border border-cinema-border text-cinema-muted hover:text-white rounded text-sm transition-colors focus-ring cursor-pointer">
              Cancel
            </button>
          )}
          <button type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-cinema-black font-semibold rounded text-sm transition-colors focus-ring cursor-pointer">
            {editingItem ? <Save className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
            {editingItem ? 'Update Item' : 'Add to Portfolio'}
          </button>
        </div>
      </form>
    </div>
  );
}
