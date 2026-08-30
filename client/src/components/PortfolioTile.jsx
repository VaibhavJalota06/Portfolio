import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Edit3, Move, Maximize2, Play, VolumeX, Eye } from 'lucide-react';
import { getMediaInfo, isEmbedType } from '../utils/media';

export default function PortfolioTile({ 
  item, 
  isAdmin, 
  onEdit, 
  onDelete, 
  onResize,
  onClickTile,
  // Drag and drop properties from parent sortable wrapper
  dragHandleProps,
  isDragging
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // scroll-triggered fade-in
  const videoRef = useRef(null);
  const cardRef = useRef(null);
  const tileRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState('');
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });

  // Scroll-triggered fade-in via IntersectionObserver
  useEffect(() => {
    if (!tileRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.08 }
    );
    observer.observe(tileRef.current);
    return () => observer.disconnect();
  }, []);
  
  const media = getMediaInfo(item.url);
  const mediaType = item.type || media.type;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (mediaType === 'mp4' && videoRef.current) {
      videoRef.current.play().catch(err => {
        console.warn('Video play blocked:', err);
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isAdmin || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Calculate rotation: max 10 degrees tilt
    const rotateX = ((centerY - y) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    setTiltStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    
    // Gloss highlight position
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlareStyle({
      opacity: 0.15,
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.4) 0%, transparent 70%)`
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltStyle('');
    setGlareStyle({ opacity: 0 });
    if (mediaType === 'mp4' && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // Assign grid classes based on size
  const sizeClasses = {
    small: 'tile-small',
    wide: 'tile-wide',
    tall: 'tile-tall',
    large: 'tile-large',
    banner: 'tile-banner',
    ultratall: 'tile-ultratall',
    full: 'tile-full'
  };

  const currentSizeClass = sizeClasses[item.size] || 'tile-small';

  return (
    <div
      ref={tileRef}
      className={`group relative overflow-hidden bg-cinema-card border border-cinema-border rounded-lg ${
        isAdmin ? 'w-full h-full' : currentSizeClass
      } flex flex-col justify-between transition-all duration-300 ${
        isDragging ? 'opacity-40 scale-95 z-30 ring-2 ring-accent shadow-2xl' : 'hover:border-accent/40 shadow-lg'
      } ${!isAdmin ? (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6') : ''}`}
      style={{
        transform: isAdmin ? undefined : tiltStyle,
        transition: tiltStyle
          ? 'box-shadow 0.3s ease'
          : `transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease, opacity 0.6s ease, translate 0.6s ease`,
        transformStyle: isAdmin ? undefined : 'preserve-3d',
        willChange: 'transform'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => { if (!isAdmin && onClickTile) onClickTile(item); }}
    >
      {/* 3D Parallax Glare Highlight Overlay */}
      {!isAdmin && (
        <div 
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 rounded-lg"
          style={glareStyle}
        />
      )}

      {/* Media container */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none sm:pointer-events-auto">
        {/* Render Image */}
        {mediaType === 'image' && (
          <img 
            src={item.url} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
        )}

        {/* Render MP4 native video */}
        {mediaType === 'mp4' && (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={item.url}
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
            />
            {/* Play/Muted indicators (hidden in Admin edit mode to prevent overlap) */}
            {!isAdmin && (
              <div 
                className="absolute top-3 left-3 bg-cinema-black/70 backdrop-blur-sm border border-cinema-border px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1.5 opacity-60 transition-all duration-300"
                style={{ transform: 'translateZ(25px)' }}
              >
                <VolumeX className="w-3 h-3 text-accent" />
                <span>LOOP</span>
              </div>
            )}
          </div>
        )}

        {/* Render multi-platform embed preview */}
        {isEmbedType(mediaType) && (
          <div className="relative w-full h-full">
            {/* Show iframe when hovered on desktop, else show thumbnail */}
            {isHovered && !isDragging ? (
              <iframe
                src={media.embedUrl}
                title={item.title}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="w-full h-full scale-[1.03] object-cover pointer-events-none"
              />
            ) : (
              <img 
                src={media.thumbnailUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80'} 
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                onError={(e) => {
                  // Fallback for Google Drive thumbnail if CORS/auth blocks direct image
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80';
                }}
              />
            )}
            
            {/* Embed indicator icon (hidden in Admin edit mode to prevent overlap) */}
            {!isAdmin && (
              <div 
                className="absolute top-3 left-3 bg-cinema-black/70 backdrop-blur-sm border border-cinema-border px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1.5 z-10 opacity-70 group-hover:opacity-100 transition-all duration-300"
                style={{ transform: 'translateZ(25px)' }}
              >
                <Play className="w-3 h-3 text-accent fill-accent" />
                <span>{mediaType === 'gdrive' ? 'G-DRIVE' : mediaType.toUpperCase()}</span>
              </div>
            )}
          </div>
        )}
      </div>


      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/30 to-transparent opacity-60 sm:opacity-0 sm:group-hover:opacity-80 transition-opacity duration-300 z-10 pointer-events-none" />

      {/* Title & Info overlay (bottom) - Always visible on mobile, visible on hover for desktop */}
        <div 
          className="absolute bottom-0 left-0 right-0 p-4 z-15 flex flex-col justify-end transform translate-y-0 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 transition-all duration-300 pointer-events-none"
          style={{
            transform: isAdmin ? undefined : 'translateZ(35px)',
            transformStyle: isAdmin ? undefined : 'preserve-3d'
          }}
        >
          <div className="text-[10px] text-accent font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow"></span>
            {item.size.toUpperCase()} FORMAT
          </div>
          <h3 className="text-sm font-display font-semibold tracking-wide text-white drop-shadow-md">
            {item.title}
          </h3>
          {/* Tags */}
          {Array.isArray(item.tags) && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {item.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-1.5 py-0.5 bg-accent/15 text-accent text-[9px] font-mono rounded border border-accent/20">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

      {/* Floating Admin Controls - Top Left (Drag Handle & Size Selector) */}
      {isAdmin && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-auto">
          {/* Drag Handle */}
          <button
            type="button"
            {...dragHandleProps}
            style={{ touchAction: 'none' }}
            className="h-7 w-7 flex items-center justify-center bg-cinema-black/90 backdrop-blur-md border border-cinema-border/80 text-cinema-muted hover:text-accent hover:border-accent/40 rounded transition-all cursor-grab active:cursor-grabbing focus-ring"
            title="Drag to reorder"
          >
            <Move className="w-3.5 h-3.5" />
          </button>
          
          {/* Size Selector */}
          <select
            value={item.size}
            onChange={(e) => onResize(item.id, e.target.value)}
            className="h-7 px-2.5 bg-cinema-black/90 backdrop-blur-md border border-cinema-border/80 rounded text-[10px] font-mono font-semibold text-accent focus:outline-none cursor-pointer focus-ring"
          >
            <option value="small" className="bg-cinema-card text-white">1x1 Size</option>
            <option value="wide" className="bg-cinema-card text-white">2x1 Size</option>
            <option value="tall" className="bg-cinema-card text-white">1x2 Size</option>
            <option value="large" className="bg-cinema-card text-white">2x2 Size</option>
            <option value="banner" className="bg-cinema-card text-white">3x1 Size</option>
            <option value="ultratall" className="bg-cinema-card text-white">1x3 Size</option>
            <option value="full" className="bg-cinema-card text-white">4x2 Size</option>
          </select>
        </div>
      )}

      {/* Draft status indicator (Top Right) */}
      {isAdmin && !item.is_published && (
        <div className="absolute top-3 right-3 z-20 bg-red-950/90 border border-red-500/40 text-red-400 text-[9px] font-mono font-bold px-2 py-1 rounded shadow-lg select-none">
          DRAFT
        </div>
      )}

      {/* Floating Admin Controls - Bottom Right (Edit & Delete Buttons) */}
      {isAdmin && (
        <div className="absolute bottom-3 right-3 z-20 flex gap-2 pointer-events-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="p-1.5 bg-cinema-black/90 backdrop-blur-md border border-cinema-border/80 text-cinema-muted hover:text-accent hover:border-accent/40 rounded transition-colors focus-ring cursor-pointer"
            title="Edit Project"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="p-1.5 bg-red-950/90 backdrop-blur-md border border-red-900/50 text-red-200 hover:text-white hover:bg-red-600 rounded transition-colors focus-ring cursor-pointer"
            title="Delete Project"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
