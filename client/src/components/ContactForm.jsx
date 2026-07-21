import React, { useState } from 'react';
import { Send, X, CheckCircle, Mail } from 'lucide-react';

export default function ContactForm({ onClose }) {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() })
      });
      if (!res.ok) throw new Error('Failed to send');
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cinema-black/90 backdrop-blur-md animate-fade-in"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-lg bg-cinema-card border border-cinema-border rounded-xl shadow-2xl overflow-hidden">
        {/* Decorative top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-accent via-accent/60 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-cinema-border">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-display font-bold tracking-wider uppercase">Get In Touch</h2>
          </div>
          <button onClick={onClose}
            className="text-cinema-muted hover:text-white transition-colors cursor-pointer focus-ring rounded p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {sent ? (
          // Success state
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
            <CheckCircle className="w-12 h-12 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Message Sent!</h3>
            <p className="text-sm text-cinema-muted">Thanks for reaching out. I'll get back to you soon.</p>
            <button onClick={onClose}
              className="mt-2 px-6 py-2.5 bg-accent text-cinema-black font-semibold rounded text-sm transition-colors cursor-pointer hover:bg-accent-hover focus-ring">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-cinema-muted">YOUR NAME</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required
                  placeholder="Jane Smith"
                  className="bg-cinema-black border border-cinema-border rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-cinema-muted">YOUR EMAIL</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="jane@studio.com"
                  className="bg-cinema-black border border-cinema-border rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent transition-colors" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-cinema-muted">MESSAGE</label>
              <textarea rows="5" value={message} onChange={e => setMessage(e.target.value)} required
                placeholder="Tell me about your project..."
                className="bg-cinema-black border border-cinema-border rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent transition-colors resize-none" />
            </div>

            {error && <p className="text-xs text-red-400 font-mono">{error}</p>}

            <div className="flex justify-end gap-3 pt-1 border-t border-cinema-border/30">
              <button type="button" onClick={onClose}
                className="px-4 py-2 text-sm text-cinema-muted hover:text-white transition-colors cursor-pointer focus-ring rounded">
                Cancel
              </button>
              <button type="submit" disabled={sending}
                className="flex items-center gap-2 px-5 py-2 bg-accent hover:bg-accent-hover text-cinema-black font-semibold rounded text-sm transition-colors cursor-pointer focus-ring disabled:opacity-60">
                <Send className="w-3.5 h-3.5" />
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
