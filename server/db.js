import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.resolve(__dirname, 'portfolio.db');

const SQL = await initSqlJs();

let sqlDb;
if (fs.existsSync(dbPath)) {
  try {
    const filebuffer = fs.readFileSync(dbPath);
    sqlDb = new SQL.Database(filebuffer);
  } catch (err) {
    console.warn('Could not read existing db file, creating new database:', err);
    sqlDb = new SQL.Database();
  }
} else {
  sqlDb = new SQL.Database();
}

function saveDatabase() {
  try {
    const data = sqlDb.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
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
      try {
        sqlDb.exec('BEGIN TRANSACTION');
      } catch (e) {}
      try {
        const result = fn(...args);
        try { sqlDb.exec('COMMIT'); } catch (e) {}
        saveDatabase();
        return result;
      } catch (err) {
        console.error('Transaction inner error:', err);
        try { sqlDb.exec('ROLLBACK'); } catch (e) {}
        throw err;
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

// Seed default settings if they do not exist
const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
const updateSetting = db.prepare('UPDATE settings SET value = ? WHERE key = ?');
const defaults = {
  editor_name: "Cutframe Studio",
  hero_tagline: "We engineer high-retention videos that scale modern brands and creators.",
  showreel_url: "https://assets.mixkit.co/videos/preview/mixkit-cinematic-shot-of-a-man-with-a-camera-42861-large.mp4",
  bio_text: "Cutframe Studio is a full-service media production and post-production engine. We transform raw footage into magnetic, high-retaining short-form assets, cinematic YouTube stories, and commercial ad creatives designed to maximize reach, retention, and return on ad spend.",
  location_info: "FULL-SERVICE VIDEO AGENCY • DAVINCI RESOLVE / PREMIERE PRO / AFTER EFFECTS",
  contact_email: "hello@cutframestudio.com",
  contact_github: "github.com/cutframestudio",
  contact_vimeo: "vimeo.com/cutframestudio",
  gallery_title: "AGENCY VIDEO SHOWCASE",
  gallery_description: "Filter our recent viral short-form campaigns, YouTube long-form stories, and high-conversion commercial ads.",
  hero_label: "CUTFRAME STUDIO • FULL-SERVICE MEDIA ENGINE",
  instagram_url: "instagram.com/cutframestudio",
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
