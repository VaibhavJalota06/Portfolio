// Run: node --test   (uses a throwaway in-memory DB file so real data is untouched)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';

process.env.DB_PATH = path.join(os.tmpdir(), `portfolio-test-${process.pid}.db`);
const { parseFolderId, freeSlots, SLOTS, categoryFor } = await import('./google.js');

test('parseFolderId accepts links and raw ids, strips junk', () => {
  assert.equal(parseFolderId('https://drive.google.com/drive/folders/1AbC_d-9?usp=sharing'), '1AbC_d-9');
  assert.equal(parseFolderId('1AbC_d-9'), '1AbC_d-9');
  assert.equal(parseFolderId("x' or 1=1"), 'xor11');
});

test('db.transaction writes reach the database file', async () => {
  const { default: db } = await import('./db.js');
  const fs = await import('node:fs');
  const { default: initSqlJs } = await import('sql.js');
  const set = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  db.transaction(() => set.run('tx_check', 'saved'))();
  const onDisk = new (await initSqlJs()).Database(fs.readFileSync(process.env.DB_PATH));
  assert.equal(onDisk.exec("SELECT value FROM settings WHERE key = 'tx_check'")[0]?.values[0][0], 'saved');
});

test('freeSlots: past days have none, far-future days have all (calendar not connected)', async () => {
  assert.deepEqual(await freeSlots('2020-01-01'), []);
  assert.deepEqual(await freeSlots('2099-01-01'), SLOTS);
});

test('categoryFor maps folder names to site filters', () => {
  assert.equal(categoryFor('Reels'), 'Short-Form / Reels');
  assert.equal(categoryFor('AI Edits'), 'AI Videos');
  assert.equal(categoryFor('YouTube Videos'), 'YouTube Long-Form');
  assert.equal(categoryFor('Ads'), 'Ad Creatives');
  assert.equal(categoryFor('Thumbnails'), 'Thumbnails & Packaging');
  assert.equal(categoryFor('Weddings'), 'Weddings');
});
