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

  const field = 'flex-1 min-w-0 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100';
  const btn = 'flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors focus-ring cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  const secondary = `${btn} border border-slate-300 text-slate-700 hover:bg-slate-50`;

  const Badge = ({ ok, children }) => (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${ok ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>
      {ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
      {children}
    </span>
  );

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="font-semibold flex items-center gap-2">
          <Link2 className="w-4 h-4 text-blue-600" /> Google Calendar &amp; Drive
        </h2>
        {status && (
          <Badge ok={status.connected}>
            {status.connected ? 'Connected' : status.configured ? 'Not connected' : 'Not set up'}
          </Badge>
        )}
      </div>

      {status && !status.configured && (
        <p className="text-sm text-slate-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 leading-relaxed">
          Google isn’t set up on the server yet (<code>GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_SECRET</code>, see <code>docs/GOOGLE-SETUP.md</code>).
          Until then, bookings still arrive in your Inbox.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold"><Calendar className="w-4 h-4 text-blue-600" /> Discovery call bookings</div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Clients only see times that are free on your Google Calendar. Each booking creates a calendar event with a Google Meet link.
          </p>
          <button type="button" onClick={connect} disabled={!status?.configured} className={`${btn} bg-blue-600 hover:bg-blue-700 text-white self-start mt-auto`}>
            {status?.connected ? 'Reconnect Google' : 'Connect Google'}
          </button>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold"><HardDrive className="w-4 h-4 text-blue-600" /> Drive portfolio folder</div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Files in this folder appear in your Work section automatically (checked every 5 minutes). Sub-folders named like the filters
            (e.g. <em>AI Videos</em>) tag their files. Share it as “Anyone with the link can view”.
          </p>
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            <input
              value={folder}
              onChange={e => setFolder(e.target.value)}
              placeholder="Drive folder link or ID"
              aria-label="Google Drive folder link or ID"
              className={field}
            />
            <button type="button" onClick={saveFolder} disabled={!folder.trim()} className={secondary}>Save</button>
          </div>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-xs text-slate-500">
              Last sync: {status?.driveLastSync ? new Date(status.driveLastSync).toLocaleString() : 'never'}
            </span>
            <button type="button" onClick={syncNow} disabled={syncing || !status?.connected} className={secondary}>
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} /> Sync now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
