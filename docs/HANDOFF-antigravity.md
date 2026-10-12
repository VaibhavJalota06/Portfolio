# Handoff for Antigravity: Cutframe Studio website (2026-10-12)

Read this fully before changing anything. The site is LIVE and working; do not break it.

## Links
- Website (public): https://portfolio-server-ve91.onrender.com
- Admin (private, PIN-protected, never link it publicly): https://portfolio-server-ve91.onrender.com/#cutframe-admin
- GitHub: https://github.com/VaibhavJalota06/Portfolio (public repo, so never commit secrets)
- Render service: portfolio-server (serves API + website). Auto-deploys only on changes inside `server/`.
  After a client-only change, click **Manual Deploy** in Render (or touch a file in `server/`).

## How it works (do not undo)
- One Render free service. `server/server.js` serves `client/dist`. `server/package.json` `postinstall` builds the client on Render (`RENDER` env var).
- Database = sql.js file. On Render it is restored from / backed up to Supabase (project `cutframe-website`,
  table `private.app_state`) via token-checked RPCs `load_state` / `save_state` (`server/db.js`).
  **Only the live server may have `SUPABASE_URL`, `SUPABASE_KEY`, `STATE_TOKEN` set.** Never set them locally,
  or local testing overwrites live data.
- Google: OAuth client in Google Cloud project `cutframe-website`. Refresh token lives in the DB (restored from backup).
  Booking = `server/google.js` (`freeSlots`, `bookCall`); Drive sync every 5 min (`syncDrive`).
  Drive folder: https://drive.google.com/drive/folders/1qhWuK081RroDBzdLcYgPTr1dLixBJmsr (owned by vaibhavjalotaofficial@gmail.com).
- Keep-awake: `.github/workflows/keep-awake.yml` pings `/api/health` every 10 min.
- Contact details: `client/src/contact.js`.
- Tests: `npm test --prefix server` (must stay green).

## Owner's rules (from the owner, keep them)
- No fake numbers, testimonials or client names. Real results only, when the owner provides them.
- Positioning: "We help brands grow on Instagram" (brands, businesses, creators, clinics), not clinics only.
- No admin links/buttons on the public site. No Ctrl+K search. No "Let's talk" band in About.
- Do not show Drive file names publicly (they contain client names/dates).
- Keep it clean and simple. Everything must stay free.

## Remaining tasks
1. **Confirm the keep-awake deploy finished:** `https://portfolio-server-ve91.onrender.com/api/health` should return `{"ok":true}`
   (it returned 404 while commit c64f854 was still deploying). Then check GitHub → Actions → "Keep site awake" runs.
2. **Publish the Google app** so it stops disconnecting every 7 days: Google Cloud → project `cutframe-website` →
   Google Auth Platform → **Audience → Publish app**. Branding (home page, privacy link `/#privacy`, authorized domain
   `portfolio-server-ve91.onrender.com`) was just saved; confirm it saved. If Publish stays disabled, check Branding for errors.
   If Google later disconnects: open the admin → "Google Calendar & Drive" → Connect Google Account (the owner clicks Allow).
3. **Live booking test:** book on the live site with a test client email (e.g. vaibhavjalotaofficial@gmail.com), confirm the
   Google invite email arrives with a Meet link, then delete the test event from the calendar.
4. **Delete old test event:** "Cutframe Studio × Test Client", Oct 13 2026 12:30 PM IST, in vaibhavjalota06's calendar
   (only if the owner agrees).
5. **Old Netlify site** (site ids in `.netlify/state.json` and `client/.netlify/state.json`) still serves the OLD design.
   With the owner logged in to Netlify: delete those sites, or point them to the Render URL. Do not deploy the client there separately.
6. **Owner should change the admin PIN** (Admin → Settings → Admin PIN). The current PIN was exposed by the old code.
7. **Ask the owner:** keep or remove "free sample reel concept" / "free Instagram audit" in About, Services and FAQ?
8. Later (optional, paid): custom domain + Google Workspace email (removes Gmail's "unknown sender" label on invites).
   If a domain is added: update `GOOGLE_REDIRECT_URI` on Render, the OAuth redirect URI in Google Cloud, branding URLs,
   and the URL in `.github/workflows/keep-awake.yml`.

## Secrets (never paste into code, docs or chat)
- Live values are in Render → portfolio-server → Environment. A local copy is in `server/.env.render` (gitignored).
  Local dev values are in `server/.env` (gitignored, must NOT contain the SUPABASE_* / STATE_TOKEN lines).
