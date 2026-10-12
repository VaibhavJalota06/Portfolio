import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, HardDrive, RefreshCw, CheckCircle2, AlertCircle, Link2 } from 'lucide-react';

const getAdminHeaders = (extra = {}) => {
  const pin = sessionStorage.getItem('admin_pin') || '';
  return { ...extra, ...(pin ? { 'x-admin-pin': pin } : {}) };
};

// Admin: connect the owner's Google account (Calendar bookings + Meet links) and the Drive portfolio folder.
export default function GooglePanel({ showToast, onSynced }) {
  const [status, setStatus] = useState(null);
  const [folder, setFolder] = useState('');
  const [syncing, setSyncing] = useState(false);

  const loadStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/google/status', { headers: getAdminHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      setStatus(data);
      setFolder(f => f || data.driveFolderId);
    } catch { /* server offline: panel stays in loading state */ }
  }, []);

  useEffect(() => {
    loadStatus();
    // Re-check after the owner finishes Google sign-in in the other tab
    window.addEventListener('focus', loadStatus);
    return () => window.removeEventListener('focus', loadStatus);
  }, [loadStatus]);

  const connect = () => {
    const pin = getAdminHeaders()['x-admin-pin'] || '';
    window.open(`/api/google/connect${pin ? `?admin_pin=${encodeURIComponent(pin)}` : ''}`, '_blank', 'noopener');
  };

  const syncNow = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/google/sync', { method: 'POST', headers: getAdminHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync failed');
      if (data.skipped) showToast('Connect Google and set a Drive folder first', 'info');
      else showToast(`Drive synced: ${data.added} added, ${data.removed} removed (${data.total} files)`);
      onSynced();
      loadStatus();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSyncing(false);
    }
  };

  const saveFolder = async () => {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ drive_folder_id: folder.trim() })
    });
    if (!res.ok) return showToast('Could not save Drive folder', 'error');
    showToast('Drive folder saved');
    syncNow();
  };

  const field = 'flex-1 min-w-0 bg-cinema-black border border-cinema-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-accent focus-ring';
  const btn = 'flex items-center justify-center gap-2 px-4 py-2.5 rounded text-sm font-semibold transition-colors focus-ring cursor-pointer disabled:opacity-50 active:scale-[0.98]';

  const Badge = ({ ok, children }) => (
    <span className={`inline-flex items-center gap-1.5 text-xs font-mono ${ok ? 'text-emerald-400' : 'text-amber-400'}`}>
      {ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
      {children}
    </span>
  );

  return (
    <div className="bg-cinema-card border border-cinema-border rounded-lg p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-cinema-border flex-wrap">
        <h2 className="text-lg font-display font-bold flex items-center gap-2">
          <Link2 className="w-5 h-5 text-accent" /> Google Calendar &amp; Drive
        </h2>
        {status && (
          <Badge ok={status.connected}>
            {status.connected ? 'GOOGLE CONNECTED' : status.configured ? 'NOT CONNECTED' : 'NOT CONFIGURED'}
          </Badge>
        )}
      </div>

      {status && !status.configured && (
        <p className="text-xs text-cinema-muted leading-relaxed">
          Add <code className="text-accent">GOOGLE_CLIENT_ID</code> and <code className="text-accent">GOOGLE_CLIENT_SECRET</code> to <code>server/.env</code> and restart the server
          (step-by-step in <code>docs/GOOGLE-SETUP.md</code>). Until then, bookings are saved to your inbox and clients get an “Add to Google Calendar” link.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold"><Calendar className="w-4 h-4 text-accent" /> Discovery call bookings</div>
          <p className="text-xs text-cinema-muted leading-relaxed">
            Clients only see times that are free on your Google Calendar. Each booking creates an event with a Google Meet link,
            and Google emails the invite to the client and adds it to your calendar.
          </p>
          <button type="button" onClick={connect} disabled={!status?.configured} className={`${btn} bg-accent hover:bg-accent-hover text-white self-start`}>
            {status?.connected ? 'Reconnect Google Account' : 'Connect Google Account'}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold"><HardDrive className="w-4 h-4 text-accent" /> Drive portfolio folder</div>
          <p className="text-xs text-cinema-muted leading-relaxed">
            Videos and images in this folder appear in your Work section automatically (checked every 5 minutes).
            Sub-folders named like the filters (e.g. <em>AI Videos</em>, <em>Short-Form / Reels</em>) tag their files. Share the folder as “Anyone with the link can view”.
          </p>
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            <input
              value={folder}
              onChange={e => setFolder(e.target.value)}
              placeholder="Drive folder link or ID"
              aria-label="Google Drive folder link or ID"
              className={field}
            />
            <button type="button" onClick={saveFolder} disabled={!folder.trim()} className={`${btn} border border-cinema-border hover:border-accent`}>
              Save
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-[11px] font-mono text-cinema-muted">
              Last sync: {status?.driveLastSync ? new Date(status.driveLastSync).toLocaleString() : 'never'}
            </span>
            <button type="button" onClick={syncNow} disabled={syncing || !status?.connected} className={`${btn} border border-cinema-border hover:border-accent`}>
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} /> Sync now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
