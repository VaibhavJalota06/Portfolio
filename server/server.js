import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();
const { default: db } = await import('./db.js');
const google = await import('./google.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Same-origin in dev (Vite proxy) and prod (Render serves client/dist) - grid update
app.use(cors({ origin: process.env.CORS_ORIGIN || false }));
// Behind Netlify/Render proxies set TRUST_PROXY (e.g. 2) so the PIN lockout sees real client IPs.
app.set('trust proxy', process.env.TRUST_PROXY ? Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY : 'loopback');
app.use(express.json({ limit: '100kb' }));

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Helper: Auto-detect media type from URL
function detectMediaType(url) {
  if (!url) return 'image';
  if (/youtu\.be\/|youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/)/i.test(url)) return 'youtube';
  if (/vimeo\.com\/(\d+)|player\.vimeo\.com\/video\/(\d+)/i.test(url)) return 'vimeo';
  if (/drive\.google\.com\/(file\/d\/|open\?id=|uc\?id=)|lh3\.googleusercontent\.com\/d\//i.test(url)) return 'gdrive';
  if (/loom\.com\/(share|embed)\//i.test(url)) return 'loom';
  if (/streamable\.com\//i.test(url)) return 'streamable';
  if (/tiktok\.com\//i.test(url)) return 'tiktok';
  if (/instagram\.com\/(reel|p|tv)\//i.test(url)) return 'instagram';
  if (/dailymotion\.com\/video\/|dai\.ly\//i.test(url)) return 'dailymotion';
  if (/wistia\.(com|net)\//i.test(url)) return 'wistia';
  if (/dropbox\.com/i.test(url) || /\.(mp4|webm|mov|ogg)($|\?)/i.test(url)) return 'mp4';
  return 'image';
}

// ─── ADMIN AUTH & MIDDLEWARE ──────────────────────────────────────────────────

// ponytail: in-memory per-IP lockout, resets on restart; move to a store if running several instances.
const failedPins = new Map(); // ip -> { count, until }
const PIN_MAX_FAILS = 8;
const PIN_LOCK_MS = 15 * 60 * 1000;

const storedPin = () => db.prepare("SELECT value FROM settings WHERE key = 'admin_pin'").get()?.value || '';

// Returns 'ok' | 'bad' | 'locked'.
function checkPin(req, pin) {
  const stored = storedPin();
  if (!stored) return 'ok'; // Open access if no PIN is configured
  const ip = req.ip;
  const entry = failedPins.get(ip);
  if (entry && entry.until > Date.now()) return 'locked';
  if (pin && String(pin) === stored) { failedPins.delete(ip); return 'ok'; }
  if (!pin) return 'bad'; // no PIN sent (e.g. admin page open before login) is not a guess
  const count = (entry?.count || 0) + 1;
  failedPins.set(ip, { count, until: count >= PIN_MAX_FAILS ? Date.now() + PIN_LOCK_MS : 0 });
  return 'bad';
}

function verifyAdmin(req, res, next) {
  const result = checkPin(req, req.headers['x-admin-pin'] || req.query.admin_pin);
  if (result === 'ok') return next();
  return res.status(result === 'locked' ? 429 : 401).json({ error: result === 'locked' ? 'Too many attempts. Try again in 15 minutes.' : 'Unauthorized: Invalid or missing admin PIN' });
}

// ─── PORTFOLIO ITEMS ────────────────────────────────────────────────────────

// GET /api/items — public: published items; admin: all items
app.get('/api/items', (req, res) => {
  try {
    const isAdmin = req.query.admin === '1' && checkPin(req, req.headers['x-admin-pin']) === 'ok';

    const stmt = isAdmin
      ? db.prepare('SELECT * FROM portfolio_items ORDER BY is_featured DESC, sort_order ASC, created_at DESC')
      : db.prepare('SELECT * FROM portfolio_items WHERE is_published = 1 ORDER BY is_featured DESC, sort_order ASC, created_at DESC');
    const items = stmt.all();
    // Parse tags JSON string to array for each item
    const parsed = items.map(item => ({
      ...item,
      tags: (() => { try { return JSON.parse(item.tags || '[]'); } catch { return []; } })(),
      is_featured: Boolean(item.is_featured),
      is_published: item.is_published !== 0
    }));
    res.json(parsed);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio items' });
  }
});

// POST /api/items — create new item (Admin)
app.post('/api/items', verifyAdmin, (req, res) => {
  const { url, title, size, description, tags, is_featured, is_published } = req.body;
  if (!url || !size) return res.status(400).json({ error: 'URL and size are required.' });

  const finalTitle = title ? String(title).trim() : '';
  const finalDesc  = description ? String(description).trim() : '';
  const finalTags  = JSON.stringify(Array.isArray(tags) ? tags : []);
  const featured   = is_featured ? 1 : 0;
  const published  = is_published === false ? 0 : 1;

  try {
    const type = detectMediaType(url);
    const maxSortStmt = db.prepare('SELECT MAX(sort_order) as max_order FROM portfolio_items');
    const result = maxSortStmt.get();
    const nextOrder = (result.max_order !== null && result.max_order !== undefined) ? result.max_order + 1 : 0;

    const insertStmt = db.prepare(`
      INSERT INTO portfolio_items (url, type, title, size, sort_order, description, tags, is_featured, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = insertStmt.run(url, type, finalTitle, size, nextOrder, finalDesc, finalTags, featured, published);
    const newItem = db.prepare('SELECT * FROM portfolio_items WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({
      ...newItem,
      tags: (() => { try { return JSON.parse(newItem.tags || '[]'); } catch { return []; } })(),
      is_featured: Boolean(newItem.is_featured),
      is_published: newItem.is_published !== 0
    });
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    res.status(500).json({ error: 'Failed to create portfolio item' });
  }
});

// PUT /api/items/:id — update existing item (Admin)
app.put('/api/items/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { url, title, size, sort_order, description, tags, is_featured, is_published } = req.body;
  if (!url || !size) return res.status(400).json({ error: 'URL and size are required.' });

  const finalTitle = title ? String(title).trim() : '';
  const finalDesc  = description ? String(description).trim() : '';
  const finalTags  = JSON.stringify(Array.isArray(tags) ? tags : []);
  const featured   = is_featured ? 1 : 0;
  const published  = is_published === false ? 0 : 1;

  try {
    const existing = db.prepare('SELECT * FROM portfolio_items WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'Portfolio item not found' });

    const type  = detectMediaType(url);
    const order = sort_order !== undefined ? sort_order : existing.sort_order;

    db.prepare(`
      UPDATE portfolio_items
      SET url = ?, type = ?, title = ?, size = ?, sort_order = ?, description = ?, tags = ?, is_featured = ?, is_published = ?
      WHERE id = ?
    `).run(url, type, finalTitle, size, order, finalDesc, finalTags, featured, published, id);

    const updatedItem = db.prepare('SELECT * FROM portfolio_items WHERE id = ?').get(id);
    res.json({
      ...updatedItem,
      tags: (() => { try { return JSON.parse(updatedItem.tags || '[]'); } catch { return []; } })(),
      is_featured: Boolean(updatedItem.is_featured),
      is_published: updatedItem.is_published !== 0
    });
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    res.status(500).json({ error: 'Failed to update portfolio item' });
  }
});

// DELETE /api/items/:id (Admin)
app.delete('/api/items/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  try {
    const result = db.prepare('DELETE FROM portfolio_items WHERE id = ?').run(id);
    if (result.changes === 0) return res.status(404).json({ error: 'Portfolio item not found' });
    res.json({ message: 'Portfolio item deleted successfully', id: Number(id) });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    res.status(500).json({ error: 'Failed to delete portfolio item' });
  }
});

// PATCH /api/items/reorder — batch update sort order (Admin)
app.patch('/api/items/reorder', verifyAdmin, (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'An array of item IDs is required.' });
  try {
    const updateStmt = db.prepare('UPDATE portfolio_items SET sort_order = ? WHERE id = ?');
    db.transaction((itemIds) => { itemIds.forEach((id, idx) => updateStmt.run(idx, id)); })(ids);
    res.json({ message: 'Portfolio items reordered successfully' });
  } catch (error) {
    console.error('Error reordering portfolio items:', error);
    res.status(500).json({ error: 'Failed to reorder portfolio items' });
  }
});

// ─── SETTINGS ───────────────────────────────────────────────────────────────

// Never sent to the browser, never writable through PUT /api/settings.
const PRIVATE_SETTINGS = ['admin_pin', 'google_refresh_token'];
const READONLY_SETTINGS = ['google_refresh_token', 'drive_last_sync', 'has_admin_pin'];

app.get('/api/settings', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM settings').all();
    const settingsObj = {};
    rows.forEach(row => { if (!PRIVATE_SETTINGS.includes(row.key)) settingsObj[row.key] = row.value; });
    settingsObj.has_admin_pin = rows.some(r => r.key === 'admin_pin' && r.value) ? '1' : '';
    res.json(settingsObj);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', verifyAdmin, (req, res) => {
  const newSettings = req.body;
  try {
    const updateStmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    db.transaction((map) => {
      for (const [key, value] of Object.entries(map)) {
        if (READONLY_SETTINGS.includes(key)) continue;
        if (key === 'admin_pin' && !String(value).trim()) continue; // blank = keep current PIN
        updateStmt.run(key, String(value));
      }
    })(newSettings);
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ─── CONTACT FORM ────────────────────────────────────────────────────────────

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'All fields are required.' });
  try {
    const stmt = db.prepare('INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)');
    stmt.run(name.trim(), email.trim(), message.trim());

    console.log('\n========== NEW CONTACT MESSAGE SAVED ==========');
    console.log(`From:    ${name} <${email}>`);
    console.log(`Message: ${message}`);
    console.log(`Time:    ${new Date().toISOString()}`);
    console.log('===============================================\n');
    res.json({ message: 'Message received. Thank you!' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'Failed to submit contact message.' });
  }
});

app.get('/api/contact', verifyAdmin, (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC');
    const messages = stmt.all();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Failed to fetch contact messages.' });
  }
});

app.delete('/api/contact/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  try {
    const result = db.prepare('DELETE FROM contact_messages WHERE id = ?').run(id);
    if (result.changes === 0) return res.status(404).json({ error: 'Message not found' });
    res.json({ message: 'Message deleted successfully', id: Number(id) });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({ error: 'Failed to delete contact message.' });
  }
});

// ─── ADMIN AUTH (PIN) ────────────────────────────────────────────────────────

app.post('/api/auth/verify', (req, res) => {
  const result = checkPin(req, req.body?.pin);
  if (result === 'ok') return res.json({ ok: true, noPin: !storedPin() });
  if (result === 'locked') return res.status(429).json({ ok: false, error: 'Too many attempts. Try again in 15 minutes.' });
  return res.status(401).json({ ok: false, error: 'Incorrect PIN' });
});

// ─── DISCOVERY CALL BOOKING (Google Calendar) ───────────────────────────────

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.get('/api/booking/slots', async (req, res) => {
  const { date } = req.query;
  if (!DATE_RE.test(date || '')) return res.status(400).json({ error: 'Invalid date' });
  try {
    res.json({ date, slots: await google.freeSlots(date), calendarConnected: google.isConnected() });
  } catch (error) {
    console.error('Error loading free slots:', error.message);
    // Calendar unreachable: still offer future slots so booking never dead-ends.
    res.json({ date, slots: google.SLOTS, calendarConnected: false });
  }
});

app.post('/api/booking', async (req, res) => {
  const { name = '', email = '', date = '', time = '', topic = '', channelUrl = '' } = req.body || {};
  const clean = (v, max) => String(v).trim().slice(0, max);
  const booking = {
    name: clean(name, 100), email: clean(email, 200), date, time,
    topic: clean(topic, 200), channelUrl: clean(channelUrl, 300),
  };
  if (!booking.name || !EMAIL_RE.test(booking.email)) return res.status(400).json({ error: 'Please enter your name and a valid email.' });
  if (!DATE_RE.test(date) || !google.SLOTS.includes(time)) return res.status(400).json({ error: 'Please pick a valid date and time slot.' });

  try {
    const free = await google.freeSlots(date).catch(() => google.SLOTS);
    if (!free.includes(time)) return res.status(409).json({ error: 'That time is no longer available. Please pick another slot.' });

    let meetLink = '';
    let calendarEvent = false;
    if (google.isConnected()) {
      ({ meetLink } = await google.bookCall(booking));
      calendarEvent = true;
    }

    db.prepare('INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)').run(
      booking.name, booking.email,
      `[DISCOVERY CALL] ${date} at ${time} IST (${google.CALL_MINUTES} min)
Focus: ${booking.topic}
Channel: ${booking.channelUrl || 'N/A'}
Meet: ${meetLink || (calendarEvent ? 'created' : 'Google Calendar not connected — send the invite manually')}`
    );
    res.json({ ok: true, date, time, minutes: google.CALL_MINUTES, meetLink, calendarEvent });
  } catch (error) {
    console.error('Error booking call:', error.message);
    res.status(502).json({ error: 'Could not create the calendar invite. Please try again or email us.' });
  }
});

// ─── GOOGLE CONNECTION (owner) ──────────────────────────────────────────────

const oauthStates = new Set();

app.get('/api/google/status', verifyAdmin, (req, res) => {
  const row = (k) => db.prepare('SELECT value FROM settings WHERE key = ?').get(k)?.value || '';
  res.json({
    configured: google.isConfigured(),
    connected: google.isConnected(),
    driveFolderId: row('drive_folder_id'),
    driveLastSync: row('drive_last_sync'),
  });
});

// Opened in the browser by the admin (PIN in the query, since it is a top-level navigation).
app.get('/api/google/connect', verifyAdmin, (req, res) => {
  if (!google.isConfigured()) return res.status(400).send('Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in server/.env first.');
  const state = crypto.randomUUID();
  oauthStates.add(state);
  setTimeout(() => oauthStates.delete(state), 10 * 60 * 1000);
  res.redirect(google.authUrl(state));
});

app.get('/api/google/callback', async (req, res) => {
  const { code, state, error } = req.query;
  if (error || !code || !oauthStates.has(state)) return res.status(400).send(`Google connection failed: ${error || 'invalid or expired request'}. Close this tab and try again.`);
  oauthStates.delete(state);
  try {
    await google.exchangeCode(code);
    syncDriveSafe();
    res.send('<p style="font-family:sans-serif">Google account connected. You can close this tab and return to the admin panel.</p>');
  } catch (err) {
    console.error('Google OAuth error:', err.message);
    res.status(500).send(`Google connection failed: ${err.message}`);
  }
});

let driveSyncing = null;
function syncDriveSafe() {
  driveSyncing ||= google.syncDrive()
    .catch(err => { console.error('Drive sync failed:', err.message); return { error: err.message }; })
    .finally(() => { driveSyncing = null; });
  return driveSyncing;
}

app.post('/api/google/sync', verifyAdmin, async (req, res) => {
  const result = await syncDriveSafe();
  if (result.error) return res.status(502).json(result);
  res.json(result);
});

// Public, cheap: pinged every ~10 min (GitHub Actions) so the free Render instance never sleeps.
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Hit every ~10 min by a free external cron (cron-job.org): keeps a free-tier host awake and syncs Drive.
app.get('/api/cron', (req, res) => {
  if (!process.env.CRON_SECRET || req.query.key !== process.env.CRON_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  syncDriveSafe();
  res.json({ ok: true });
});

setInterval(syncDriveSafe, 5 * 60 * 1000);
syncDriveSafe();

// ─── WEBSITE (built client) ─────────────────────────────────────────────────
// In production one service serves both the API and the website (client/dist), so no separate host is needed.
const clientDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist, { index: false, maxAge: '1h' }));
  app.get(/^\/(?!api\/).*/, (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

// ─── START ───────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
