// Google Calendar (discovery-call booking + Meet links) and Google Drive (auto-import portfolio).
// Plain REST calls with the owner's OAuth refresh token — no SDK needed.
import db from './db.js';

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.freebusy',
  'https://www.googleapis.com/auth/drive.readonly',
].join(' ');

export const SLOTS = ['11:00', '12:30', '14:00', '15:30', '16:30', '17:30', '19:00']; // IST
export const CALL_MINUTES = 30;

const getSetting = (k) => db.prepare('SELECT value FROM settings WHERE key = ?').get(k)?.value || '';
const setSetting = (k, v) => db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(k, v);

const cfg = () => ({
  client_id: process.env.GOOGLE_CLIENT_ID || '',
  client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
  redirect_uri: process.env.GOOGLE_REDIRECT_URI || `http://localhost:${process.env.PORT || 5000}/api/google/callback`,
});
const refreshToken = () => process.env.GOOGLE_REFRESH_TOKEN || getSetting('google_refresh_token');

export const isConfigured = () => Boolean(cfg().client_id && cfg().client_secret);
export const isConnected = () => isConfigured() && Boolean(refreshToken());

export function authUrl(state) {
  const { client_id, redirect_uri } = cfg();
  const p = new URLSearchParams({
    client_id, redirect_uri, state, scope: SCOPES,
    response_type: 'code', access_type: 'offline', prompt: 'consent',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${p}`;
}

async function tokenRequest(params) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({ client_id: cfg().client_id, client_secret: cfg().client_secret, ...params }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.error || 'Google token request failed');
  return data;
}

export async function exchangeCode(code) {
  const data = await tokenRequest({ code, redirect_uri: cfg().redirect_uri, grant_type: 'authorization_code' });
  if (!data.refresh_token) throw new Error('Google did not return a refresh token. Remove the app at myaccount.google.com/permissions and connect again.');
  setSetting('google_refresh_token', data.refresh_token);
  cached = { token: '', exp: 0 };
}

let cached = { token: '', exp: 0 };
async function accessToken() {
  if (cached.token && Date.now() < cached.exp) return cached.token;
  const data = await tokenRequest({ refresh_token: refreshToken(), grant_type: 'refresh_token' });
  cached = { token: data.access_token, exp: Date.now() + (data.expires_in - 60) * 1000 };
  return cached.token;
}

async function gapi(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: { Authorization: `Bearer ${await accessToken()}`, 'Content-Type': 'application/json' },
  });
  const data = res.status === 204 ? {} : await res.json();
  if (!res.ok) throw new Error(data.error?.message || `Google API error ${res.status}`);
  return data;
}

// ─── CALENDAR ────────────────────────────────────────────────────────────────

const istDate = (date, time) => new Date(`${date}T${time}:00+05:30`);

// Slots for an IST date that are in the future (2h notice) and not busy on the owner's calendar.
export async function freeSlots(date) {
  const dayStart = istDate(date, '00:00');
  let busy = [];
  if (isConnected()) {
    const data = await gapi('https://www.googleapis.com/calendar/v3/freeBusy', {
      method: 'POST',
      body: JSON.stringify({
        timeMin: dayStart.toISOString(),
        timeMax: new Date(dayStart.getTime() + 86400000).toISOString(),
        items: [{ id: 'primary' }],
      }),
    });
    busy = data.calendars?.primary?.busy || [];
  }
  const earliest = Date.now() + 2 * 3600000;
  return SLOTS.filter((t) => {
    const s = istDate(date, t).getTime();
    const e = s + CALL_MINUTES * 60000;
    return s > earliest && !busy.some((b) => s < Date.parse(b.end) && e > Date.parse(b.start));
  });
}

// Creates the event on the owner's primary calendar with a Meet link; Google emails the invite to the client.
export async function bookCall({ name, email, date, time, topic, channelUrl }) {
  const start = istDate(date, time);
  const end = new Date(start.getTime() + CALL_MINUTES * 60000);
  const attendees = [{ email, displayName: name }];
  const owner = process.env.OWNER_EMAIL;
  if (owner && owner.toLowerCase() !== email.toLowerCase()) attendees.push({ email: owner });

  const event = await gapi(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
    {
      method: 'POST',
      body: JSON.stringify({
        summary: `Cutframe Studio × ${name} — Discovery Call`,
        description: `Focus: ${topic}\nChannel / brand: ${channelUrl || 'N/A'}\nClient: ${name} <${email}>\n\nBooked via the Cutframe Studio website.`,
        start: { dateTime: start.toISOString(), timeZone: 'Asia/Kolkata' },
        end: { dateTime: end.toISOString(), timeZone: 'Asia/Kolkata' },
        attendees,
        conferenceData: {
          createRequest: { requestId: crypto.randomUUID(), conferenceSolutionKey: { type: 'hangoutsMeet' } },
        },
        reminders: { useDefault: true },
      }),
    }
  );
  return { meetLink: event.hangoutLink || '', eventLink: event.htmlLink || '' };
}

// ─── DRIVE ───────────────────────────────────────────────────────────────────

const FOLDER = 'application/vnd.google-apps.folder';
const aspectOf = (f) => {
  const m = f.videoMediaMetadata || f.imageMediaMetadata || {};
  return m.width && m.height ? `${m.width}/${m.height}` : null;
};
const isMedia = (f) => f.mimeType.startsWith('video/') || f.mimeType.startsWith('image/');

// Accepts a raw folder ID or a full drive.google.com/drive/folders/<id> link.
export const parseFolderId = (input = '') => (String(input).match(/folders\/([\w-]+)/)?.[1] || String(input)).replace(/[^\w-]/g, '');

async function listChildren(folderId) {
  const files = [];
  let pageToken = '';
  do {
    const p = new URLSearchParams({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'nextPageToken, files(id, name, mimeType, description, videoMediaMetadata(width, height), imageMediaMetadata(width, height))',
      pageSize: '1000',
      ...(pageToken && { pageToken }),
    });
    const data = await gapi(`https://www.googleapis.com/drive/v3/files?${p}`);
    files.push(...data.files);
    pageToken = data.nextPageToken || '';
  } while (pageToken);
  return files;
}

// Maps a top-level Drive sub-folder name to one of the site's category filters.
export function categoryFor(folderName) {
  const n = folderName.toLowerCase();
  if (/\bai\b|generative/.test(n)) return 'AI Videos';
  if (/reel|short|tiktok/.test(n)) return 'Short-Form / Reels';
  if (/youtube|long/.test(n)) return 'YouTube Long-Form';
  if (/\bads?\b|commercial|creative/.test(n)) return 'Ad Creatives';
  if (/thumb|packag/.test(n)) return 'Thumbnails & Packaging';
  return folderName;
}

// Mirrors the Drive folder into portfolio_items. Sub-folder names become category tags
// File names are never shown publicly (they often contain client names/dates); titles are added in the admin.
// (e.g. a "Reels" sub-folder fills the "Short-Form / Reels" filter). Only Drive-imported items are ever removed.
export async function syncDrive() {
  const folderId = parseFolderId(getSetting('drive_folder_id'));
  if (!folderId || !isConnected()) return { skipped: true, added: 0, removed: 0 };

  // Walk sub-folders (any depth); files are tagged with the category of their top-level sub-folder.
  const found = [];
  const walk = async (id, tag, depth) => {
    for (const f of await listChildren(id)) {
      if (f.mimeType === FOLDER) { if (depth < 5) await walk(f.id, tag ?? categoryFor(f.name), depth + 1); }
      else if (isMedia(f)) found.push({ ...f, tag });
    }
  };
  await walk(folderId, null, 0);

  const existing = new Set(
    db.prepare("SELECT drive_id FROM portfolio_items WHERE drive_id IS NOT NULL AND drive_id != ''").all().map((r) => r.drive_id)
  );
  const foundIds = new Set(found.map((f) => f.id));
  let added = 0;
  let removed = 0;

  db.transaction(() => {
    let order = (db.prepare('SELECT MAX(sort_order) AS m FROM portfolio_items').get()?.m ?? -1) + 1;
    const insert = db.prepare(`
      INSERT INTO portfolio_items (url, type, title, size, sort_order, description, tags, is_featured, is_published, drive_id, mime, aspect)
      VALUES (?, 'gdrive', '', ?, ?, ?, ?, 0, 1, ?, ?, ?)
    `);
    const setMeta = db.prepare('UPDATE portfolio_items SET mime = ?, aspect = ? WHERE drive_id = ? AND (mime IS NOT ? OR aspect IS NOT ?)');
    for (const f of found) {
      if (existing.has(f.id)) { setMeta.run(f.mimeType, aspectOf(f), f.id, f.mimeType, aspectOf(f)); continue; }
      const meta = f.videoMediaMetadata || f.imageMediaMetadata || {};
      const size = meta.height > meta.width ? 'tall' : 'wide';
      insert.run(`https://drive.google.com/file/d/${f.id}/view`, size, order++, f.description || '', JSON.stringify(f.tag ? [f.tag] : []), f.id, f.mimeType, aspectOf(f));
      added++;
    }
    const del = db.prepare('DELETE FROM portfolio_items WHERE drive_id = ?');
    for (const id of existing) {
      if (!foundIds.has(id)) { del.run(id); removed++; }
    }
  })();

  setSetting('drive_last_sync', new Date().toISOString());
  return { skipped: false, added, removed, total: found.length };
}
