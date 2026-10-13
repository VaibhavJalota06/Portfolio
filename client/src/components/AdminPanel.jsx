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
    youtube: 'bg-red-50 text-red-700 border-red-200',
    vimeo:   'bg-sky-50 text-sky-700 border-sky-200',
    gdrive:  'bg-amber-50 text-amber-700 border-amber-200',
    mp4:     'bg-blue-50 text-blue-700 border-blue-200',
    image:   'bg-emerald-50 text-emerald-700 border-emerald-200'
  };

  const field = 'w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition';
  const label = 'text-sm font-medium text-slate-700';
  const hint = 'font-normal text-slate-400';

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-8 animate-fade-in">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <h2 className="font-semibold">{editingItem ? 'Edit item' : 'Add to portfolio'}</h2>
          {url && (
            <span className={`text-xs font-medium px-2 py-0.5 border rounded-md capitalize ${badgeColors[detectedType] || badgeColors.image}`}>
              {detectedType === 'gdrive' ? 'Google Drive' : detectedType}
            </span>
          )}
        </div>
        {editingItem && (
          <button type="button" onClick={resetForm}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 transition-colors cursor-pointer focus-ring rounded px-2 py-1">
            <X className="w-4 h-4" /> Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className={label}>Link <span className="text-red-500">*</span></span>
            <input type="text" value={url} onChange={e => setUrl(e.target.value)}
              placeholder="YouTube, Drive, Vimeo, .mp4 or image link" className={field} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={label}>Title <span className={hint}>(optional)</span></span>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Café launch reel" className={field} />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className={label}>Description <span className={hint}>(shown when opened)</span></span>
          <textarea rows="2" value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Short caption about this project" className={`${field} resize-none`} />
        </label>

        <div className="flex flex-col gap-1.5">
          <span className={`${label} flex items-center gap-1.5`}><Tag className="w-3.5 h-3.5 text-slate-400" /> Tags <span className={hint}>(press Enter to add)</span></span>
          <div className="flex flex-wrap gap-2 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 min-h-[40px] items-center focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100 transition">
            {tags.map(t => (
              <span key={t} className="flex items-center gap-1 pl-2 pr-1 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">
                {t}
                <button type="button" onClick={() => removeTag(t)} aria-label={`Remove tag ${t}`} className="px-1 hover:text-blue-900 cursor-pointer">×</button>
              </span>
            ))}
            <input
              value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              placeholder={tags.length === 0 ? 'Reels, AI Videos, Posters…' : 'Add tag…'}
              aria-label="Add tag"
              className="flex-1 min-w-[140px] bg-transparent text-sm text-slate-900 focus:outline-none placeholder:text-slate-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <label className="flex flex-col gap-1.5">
            <span className={label}>Tile size</span>
            <select value={size} onChange={e => setSize(e.target.value)} className={`${field} cursor-pointer`}>
              <option value="small">Small (1×1)</option>
              <option value="wide">Wide (2×1)</option>
              <option value="tall">Tall (1×2)</option>
              <option value="large">Large (2×2)</option>
              <option value="banner">Banner (3×1)</option>
              <option value="ultratall">Extra tall (1×3)</option>
              <option value="full">Full width (4×1)</option>
            </select>
          </label>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setIsFeatured(f => !f)} aria-pressed={isFeatured}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer focus-ring ${
                isFeatured ? 'bg-amber-50 border-amber-300 text-amber-800' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}>
              <Star className={`w-4 h-4 ${isFeatured ? 'fill-amber-400 text-amber-500' : ''}`} />
              {isFeatured ? 'Pinned to top' : 'Pin to top'}
            </button>
            <button type="button" onClick={() => setIsPublished(p => !p)} aria-pressed={isPublished}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer focus-ring ${
                isPublished ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}>
              {isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {isPublished ? 'Visible on site' : 'Hidden'}
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          {editingItem && (
            <button type="button" onClick={resetForm}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors focus-ring cursor-pointer">
              Cancel
            </button>
          )}
          <button type="submit" disabled={!url.trim()}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-colors focus-ring cursor-pointer disabled:opacity-50">
            {editingItem ? <Save className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
            {editingItem ? 'Save changes' : 'Add to portfolio'}
          </button>
        </div>
      </form>
    </section>
  );
}
