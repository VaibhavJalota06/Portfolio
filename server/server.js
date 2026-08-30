import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

function verifyAdmin(req, res, next) {
  const storedPinRow = db.prepare("SELECT value FROM settings WHERE key = 'admin_pin'").get();
  const storedPin = storedPinRow?.value || '';
  if (!storedPin) return next(); // Open access if no PIN is configured

  const clientPin = req.headers['x-admin-pin'] || req.query.admin_pin;
  if (clientPin === storedPin) return next();
  return res.status(401).json({ error: 'Unauthorized: Invalid or missing admin PIN' });
}

// ─── PORTFOLIO ITEMS ────────────────────────────────────────────────────────

// GET /api/items — public: published items; admin: all items
app.get('/api/items', (req, res) => {
  try {
    const storedPinRow = db.prepare("SELECT value FROM settings WHERE key = 'admin_pin'").get();
    const storedPin = storedPinRow?.value || '';
    const clientPin = req.headers['x-admin-pin'] || req.query.admin_pin;
    const isAdmin = req.query.admin === '1' && (!storedPin || clientPin === storedPin);

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

app.get('/api/settings', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM settings').all();
    const settingsObj = {};
    rows.forEach(row => { settingsObj[row.key] = row.value; });
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
      for (const [key, value] of Object.entries(map)) updateStmt.run(key, String(value));
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
  const { pin } = req.body;
  const storedPinRow = db.prepare("SELECT value FROM settings WHERE key = 'admin_pin'").get();
  const storedPin = storedPinRow?.value || '';
  if (!storedPin) {
    // No PIN set — open access
    return res.json({ ok: true, noPin: true });
  }
  if (pin === storedPin) {
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false, error: 'Incorrect PIN' });
});

// ─── START ───────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
