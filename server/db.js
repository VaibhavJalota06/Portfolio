import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.resolve(__dirname, 'portfolio.db');

const SQL = await initSqlJs();

// Optional off-host backup in the owner's own Supabase project (approved by the owner): free hosts
// like Render wipe local files on restart, so the database is mirrored there and restored on boot.
// Access goes through two token-checked database functions; the table itself is not exposed.
const remote = process.env.SUPABASE_URL && process.env.SUPABASE_KEY && process.env.STATE_TOKEN
  ? async (fn, args) => {
      const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/${fn}`, {
        method: 'POST',
        headers: { apikey: process.env.SUPABASE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: process.env.STATE_TOKEN, ...args }),
      });
      if (!res.ok) throw new Error(`Supabase ${fn} failed: ${res.status} ${await res.text()}`);
      return res.status === 204 ? null : res.json();
    }
  : null;

async function loadInitialBytes() {
  if (remote) {
    // A remote failure must stop the boot: starting empty and then backing up would erase the real data.
    const b64 = await remote('load_state', {});
    if (b64) { console.log('Database restored from Supabase backup.'); return Buffer.from(b64, 'base64'); }
    console.log('No Supabase backup yet; using local database file.');
  }
  return fs.existsSync(dbPath) ? fs.readFileSync(dbPath) : null;
}

let sqlDb;
try {
  const bytes = await loadInitialBytes();
  sqlDb = bytes ? new SQL.Database(bytes) : new SQL.Database();
} catch (err) {
  if (remote) throw err;
  console.warn('Could not read existing db file, creating new database:', err);
  sqlDb = new SQL.Database();
}

let inTransaction = false; // sql.js export() mid-transaction discards it, so save once at COMMIT

// ponytail: debounced whole-file upload (DB is a few hundred KB); a crash inside the 2s window loses
// only that window's writes. Move to a real hosted DB if traffic ever makes this matter.
let backupTimer = null;
function scheduleBackup(data) {
  if (!remote) return;
  clearTimeout(backupTimer);
  backupTimer = setTimeout(() => {
    remote('save_state', { data: Buffer.from(data).toString('base64') })
      .catch(err => console.error('Supabase backup failed:', err.message));
  }, 2000);
}

function saveDatabase() {
  if (inTransaction) return;
  try {
    const data = sqlDb.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
    scheduleBackup(data);
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

const db = {
  exec(sql) {
    sqlDb.exec(sql);
    saveDatabase();
  },

  pragma(str) {
    try {
      sqlDb.exec(`PRAGMA ${str}`);
    } catch {
      // Ignore unsupported pragmas in WASM mode
    }
  },

  prepare(sql) {
    return {
      all(...args) {
        const params = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
        const stmt = sqlDb.prepare(sql);
        if (params.length > 0) stmt.bind(params);
        const results = [];
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
      },

      get(...args) {
        const params = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
        const stmt = sqlDb.prepare(sql);
        if (params.length > 0) stmt.bind(params);
        let result = undefined;
        if (stmt.step()) {
          result = stmt.getAsObject();
        }
        stmt.free();
        return result;
      },

      run(...args) {
        const params = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
        const stmt = sqlDb.prepare(sql);
        if (params.length > 0) stmt.bind(params);
        stmt.step();
        stmt.free();

        const lastInsertRowidRes = sqlDb.exec("SELECT last_insert_rowid() as id");
        const lastInsertRowid = (lastInsertRowidRes.length > 0 && lastInsertRowidRes[0].values.length > 0)
          ? lastInsertRowidRes[0].values[0][0]
          : 0;

        const changesRes = sqlDb.exec("SELECT changes() as c");
        const changes = (changesRes.length > 0 && changesRes[0].values.length > 0)
          ? changesRes[0].values[0][0]
          : 0;

        saveDatabase();
        return { lastInsertRowid, changes };
      }
    };
  },

  transaction(fn) {
    return (...args) => {
      if (inTransaction) return fn(...args); // nested: join the outer transaction
      sqlDb.exec('BEGIN TRANSACTION');
      inTransaction = true;
      try {
        const result = fn(...args);
        sqlDb.exec('COMMIT');
        return result;
      } catch (err) {
        console.error('Transaction inner error:', err);
        try { sqlDb.exec('ROLLBACK'); } catch {}
        throw err;
      } finally {
        inTransaction = false;
        saveDatabase();
      }
    };
  }
};

// Enable WAL mode or pragmas if applicable
db.pragma('journal_mode = WAL');

// Initialize base schema
db.exec(`
  CREATE TABLE IF NOT EXISTS portfolio_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    size TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Safe column migration: add new columns if they don't already exist
const safeAddColumn = (table, column, definition) => {
  try {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    console.log(`Migrated: added column ${column} to ${table}`);
  } catch (e) {
    // Column already exists — ignore
  }
};

safeAddColumn('portfolio_items', 'description', 'TEXT DEFAULT ""');
safeAddColumn('portfolio_items', 'tags',        'TEXT DEFAULT "[]"');
safeAddColumn('portfolio_items', 'is_featured', 'INTEGER DEFAULT 0');
safeAddColumn('portfolio_items', 'is_published','INTEGER DEFAULT 1');
safeAddColumn('portfolio_items', 'drive_id',    'TEXT');
safeAddColumn('portfolio_items', 'mime',        'TEXT');
safeAddColumn('portfolio_items', 'aspect',      'TEXT'); // "width/height", reserves tile space before the image loads

// Seed default settings if they do not exist
const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
const updateSetting = db.prepare('UPDATE settings SET value = ? WHERE key = ?');
const defaults = {
  editor_name: "Cutframe Studio",
  hero_tagline: "Reels, posts and Instagram page management for clinics and doctors. Delhi & all India.",
  showreel_url: "",
  bio_text: "Cutframe Studio is a full-service media production and post-production engine. We transform raw footage into magnetic, high-retaining short-form assets, cinematic YouTube stories, and commercial ad creatives designed to maximize reach, retention, and return on ad spend.",
  location_info: "FULL-SERVICE VIDEO AGENCY • DAVINCI RESOLVE / PREMIERE PRO / AFTER EFFECTS",
  contact_email: "vaibhav@cutframestudio.in",
  contact_github: "github.com/cutframestudio",
  contact_vimeo: "vimeo.com/cutframestudio",
  gallery_title: "AGENCY VIDEO SHOWCASE",
  gallery_description: "Filter our recent viral short-form campaigns, YouTube long-form stories, and high-conversion commercial ads.",
  hero_label: "CUTFRAME STUDIO • FULL-SERVICE MEDIA ENGINE",
  instagram_url: "instagram.com/studiocutframe",
  behance_url: "",
  available_for_work: "1",
  admin_pin: "",
  theme_accent: "blue"
};

const seedSettings = db.transaction(() => {
  for (const [key, value] of Object.entries(defaults)) {
    insertSetting.run(key, value);
  }
});
seedSettings();
console.log('Database schema ready.');

export default db;
