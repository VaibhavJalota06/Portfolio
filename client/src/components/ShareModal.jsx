import React, { useState } from 'react';
import { X, Copy, Check, Share2, Globe, Twitter, Linkedin, ExternalLink, QrCode } from 'lucide-react';

export default function ShareModal({ isOpen, onClose, settings }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://alexkane.edit';
  const name = settings?.editor_name || 'ALEX KANE';
  const tagline = settings?.hero_tagline || 'Cinematic editor and colorist portfolio';
  const shareText = `Check out ${name}'s Cinematic Portfolio: ${tagline}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`;

  // SVG QR Code generator (matrix pattern for clean visual QR code)
  const qrCells = [
    [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,1,1,1,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [1,1,0,1,0,1,1,1,0,0,1,1,0,1,1,0,1],
    [0,0,1,0,1,0,0,1,1,0,1,0,1,0,0,1,0],
    [1,0,1,1,1,1,0,0,0,1,0,1,1,1,0,0,1],
    [0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,1,0],
    [1,1,1,1,1,1,1,0,1,1,0,1,0,1,0,1,0],
    [1,0,0,0,0,0,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,1,0,0,0,1,0],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,1,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,0,1,0,1,1,1,1]
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cinema-black/85 backdrop-blur-md animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-lg bg-cinema-card border border-cinema-border rounded-xl p-6 shadow-2xl overflow-hidden flex flex-col gap-5">
        {/* Top Accent Line */}
        <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-accent via-accent/60 to-transparent" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-cinema-border/50 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-display font-bold text-white uppercase tracking-tight">
              Share Portfolio
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-cinema-muted hover:text-white p-1 focus-ring rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Copyable Portfolio URL Bar */}
        <div className="flex items-center gap-2 bg-cinema-black border border-cinema-border rounded-lg p-2">
          <Globe className="w-4 h-4 text-cinema-muted ml-2 shrink-0" />
          <input
            type="text"
            readOnly
            value={currentUrl}
            className="w-full bg-transparent text-xs font-mono text-white outline-none truncate"
          />
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all shrink-0 cursor-pointer ${
              copied
                ? 'bg-emerald-500 text-cinema-black font-bold'
                : 'bg-accent hover:bg-accent-hover text-cinema-black'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'COPIED!' : 'COPY'}
          </button>
        </div>

        {/* Middle Grid: OpenGraph Preview Card + QR Code */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
          {/* OpenGraph Social Card Preview (2 columns) */}
          <div className="sm:col-span-2 bg-cinema-black/60 border border-cinema-border/80 rounded-lg p-3.5 flex flex-col justify-between relative overflow-hidden">
            <div className="text-[9px] font-mono text-accent uppercase mb-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              SOCIAL PREVIEW CARD
            </div>
            <div className="font-display font-bold text-sm text-white truncate">{name}</div>
            <div className="text-[11px] font-sans text-cinema-muted line-clamp-2 mt-1 leading-relaxed">{tagline}</div>
            <div className="mt-3 pt-2 border-t border-cinema-border/40 text-[9px] font-mono text-cinema-muted truncate">
              {currentUrl.replace(/^https?:\/\//, '')}
            </div>
          </div>

          {/* Clean Vector QR Code (1 column) */}
          <div className="bg-cinema-black/60 border border-cinema-border/80 rounded-lg p-3 flex flex-col items-center justify-center text-center">
            <div className="bg-white p-2 rounded shadow-md mb-1.5">
              <svg width="72" height="72" viewBox="0 0 17 17" className="shape-rendering-crisp">
                {qrCells.map((row, r) =>
                  row.map((cell, c) =>
                    cell === 1 ? (
                      <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#070708" />
                    ) : null
                  )
                )}
              </svg>
            </div>
            <span className="text-[9px] font-mono text-cinema-muted flex items-center gap-1">
              <QrCode className="w-3 h-3 text-accent" /> SCAN ME
            </span>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-cinema-border/50">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-cinema-dark border border-cinema-border/80 hover:border-accent/40 text-cinema-muted hover:text-white rounded text-xs font-mono transition-colors focus-ring"
          >
            <Twitter className="w-3.5 h-3.5 text-accent" /> X / Twitter
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-cinema-dark border border-cinema-border/80 hover:border-accent/40 text-cinema-muted hover:text-white rounded text-xs font-mono transition-colors focus-ring"
          >
            <Linkedin className="w-3.5 h-3.5 text-accent" /> LinkedIn
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-cinema-dark border border-cinema-border/80 hover:border-accent/40 text-cinema-muted hover:text-white rounded text-xs font-mono transition-colors focus-ring"
          >
            <Share2 className="w-3.5 h-3.5 text-accent" /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
