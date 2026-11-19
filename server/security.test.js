import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

async function withServer(pin, fn) {
  const dir = mkdtempSync(path.join(tmpdir(), 'cutframe-security-'));
  const port = 19000 + Math.floor(Math.random() * 10000);
  const env = { ...process.env, PORT: String(port), DB_PATH: path.join(dir, 'test.db'), ADMIN_BOOTSTRAP_PIN: pin, SUPABASE_URL: '', SUPABASE_KEY: '', STATE_TOKEN: '', RENDER_EXTERNAL_URL: '', GOOGLE_CLIENT_ID: 'test-client', GOOGLE_CLIENT_SECRET: 'test-secret' };
  const child = spawn(process.execPath, ['server.js'], { cwd: new URL('.', import.meta.url), env, stdio: 'ignore' });
  const base = `http://127.0.0.1:${port}`;
  try {
    let ready = false;
    for (let i = 0; i < 60; i++) { try { if ((await fetch(base + '/api/health')).ok) { ready = true; break; } } catch {} await new Promise(r => setTimeout(r, 100)); }
    assert.ok(ready, 'server started');
    await fn(base);
  } finally { child.kill(); rmSync(dir, { recursive: true, force: true }); }
}

test('admin fails closed without a configured PIN', async () => withServer('', async base => {
  assert.equal((await fetch(base + '/api/contact')).status, 401);
  assert.equal((await fetch(base + '/api/auth/verify', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({pin:'1234'}) })).status, 401);
}));

test('bootstrap PIN permits authenticated actions and rejects URL PINs', async () => withServer('123456', async base => {
  assert.equal((await fetch(base + '/api/contact?admin_pin=123456')).status, 401);
  assert.equal((await fetch(base + '/api/contact', { headers:{'x-admin-pin':'123456'} })).status, 200);
  const res = await fetch(base + '/api/google/connect', {method:'POST',headers:{'x-admin-pin':'123456'}});
  assert.equal(res.status, 200);
  const {url} = await res.json();
  assert.equal(new URL(url).hostname, 'accounts.google.com');
  assert.ok(!url.includes('123456'));
}));

test('OAuth errors do not reflect attacker HTML', async () => withServer('', async base => {
  for (const value of ['<script>alert(1)</script>', '<img src=x onerror=alert(1)>']) {
    const res = await fetch(base + '/api/google/callback?error=' + encodeURIComponent(value));
    assert.equal(res.status, 400);
    assert.match(res.headers.get('content-type'), /^text\/plain/);
    assert.ok(!(await res.text()).includes(value));
  }
}));
